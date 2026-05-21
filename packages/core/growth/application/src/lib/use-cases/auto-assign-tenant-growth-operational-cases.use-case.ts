import { UserRepository } from '@saas-platform/identity-application';
import {
  MembershipRepository,
  TenantAccessRepository,
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { MembershipStatus } from '@saas-platform/tenancy-domain';
import { ConversationThread } from '@saas-platform/growth-domain';
import { GROWTH_PERMISSIONS } from '../permissions/growth-permissions';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';
import {
  GrowthOperationalCaseRecord,
  GrowthOperationalCaseRepository,
  GrowthOperationalCaseRoutingPolicyKey,
} from '../ports/growth-operational-case.repository';
import { OpportunityRepository } from '../ports/opportunity.repository';

export type GrowthOperationalCaseAutoAssignmentPolicyKey =
  | 'balanced'
  | 'owner_queue_first'
  | 'follow_up_first';

export interface AutoAssignTenantGrowthOperationalCasesInput {
  tenantSlug: string;
  policyKey?: GrowthOperationalCaseAutoAssignmentPolicyKey | null;
}

export interface AutoAssignTenantGrowthOperationalCasesResult {
  policyKey: GrowthOperationalCaseAutoAssignmentPolicyKey;
  candidateCount: number;
  reviewedCount: number;
  assignedCount: number;
  threadAssignmentCount: number;
  inheritedOwnerCount: number;
  fallbackAssignmentCount: number;
  cases: GrowthOperationalCaseRecord[];
}

interface AutoAssignmentCandidate {
  userId: string;
  email: string | null;
  loadScore: number;
}

const AUTO_ASSIGNABLE_ROUTING_POLICIES = new Set<
  GrowthOperationalCaseRoutingPolicyKey
>(['owner_assignment', 'follow_up_team', 'escalation_review']);

const AUTO_ASSIGNMENT_POLICY_ORDER: Record<
  GrowthOperationalCaseAutoAssignmentPolicyKey,
  GrowthOperationalCaseRoutingPolicyKey[]
> = {
  balanced: ['escalation_review', 'owner_assignment', 'follow_up_team'],
  owner_queue_first: [
    'owner_assignment',
    'escalation_review',
    'follow_up_team',
  ],
  follow_up_first: [
    'follow_up_team',
    'escalation_review',
    'owner_assignment',
  ],
};

export class AutoAssignTenantGrowthOperationalCasesUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly tenantAccessRepository: TenantAccessRepository,
    private readonly userRepository: UserRepository,
    private readonly growthOperationalCaseRepository: GrowthOperationalCaseRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
    private readonly opportunityRepository: OpportunityRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AutoAssignTenantGrowthOperationalCasesInput,
  ): Promise<AutoAssignTenantGrowthOperationalCasesResult> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const [memberships, cases, threads, opportunities] = await Promise.all([
      this.membershipRepository.findByTenantId(tenant.id),
      this.growthOperationalCaseRepository.findByTenantId(tenant.id),
      this.conversationThreadRepository.findByTenantId(tenant.id),
      this.opportunityRepository.findByTenantId(tenant.id),
    ]);

    const now = this.nowProvider();
    const activeMemberships = memberships.filter(
      (membership) => membership.status === MembershipStatus.Active,
    );
    const [candidateEntries, userEntries] = await Promise.all([
      Promise.all(
        activeMemberships.map(async (membership) => {
          const access = await this.tenantAccessRepository.findByTenantAndUser(
            tenant.id,
            membership.userId,
          );

          if (
            !access ||
            access.membershipStatus !== MembershipStatus.Active ||
            !access.permissionKeys.includes(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
          ) {
            return null;
          }

          return membership.userId;
        }),
      ),
      Promise.all(
        activeMemberships.map(async (membership) => [
          membership.userId,
          await this.userRepository.findById(membership.userId),
        ] as const),
      ),
    ]);

    const eligibleUserIds = [...new Set(candidateEntries.filter((entry): entry is string => !!entry))];
    const userIndex = new Map(userEntries);
    const candidates = new Map<string, AutoAssignmentCandidate>();

    for (const userId of eligibleUserIds) {
      const user = userIndex.get(userId) ?? null;
      const assignedOperationalCaseCount = cases.filter(
        (entry) =>
          entry.status !== 'resolved' && entry.assignedUserId === userId,
      ).length;
      const openThreadCount = threads.filter(
        (thread) => thread.status === 'open' && thread.assigneeUserId === userId,
      ).length;
      const openOpportunityCount = opportunities.filter(
        (opportunity) =>
          opportunity.assigneeUserId === userId &&
          opportunity.stage !== 'won' &&
          opportunity.stage !== 'lost',
      ).length;

      candidates.set(userId, {
        userId,
        email: user?.email ?? null,
        loadScore:
          assignedOperationalCaseCount + openThreadCount + openOpportunityCount,
      });
    }

    const policyKey = input.policyKey ?? 'balanced';
    const assignableCases = this.orderCasesForPolicy(
      cases.filter(
        (entry) =>
          entry.status !== 'resolved' &&
          !entry.assignedUserId &&
          AUTO_ASSIGNABLE_ROUTING_POLICIES.has(entry.routingPolicyKey),
      ),
      policyKey,
    );

    if (candidates.size === 0 || assignableCases.length === 0) {
      return {
        policyKey,
        candidateCount: candidates.size,
        reviewedCount: assignableCases.length,
        assignedCount: 0,
        threadAssignmentCount: 0,
        inheritedOwnerCount: 0,
        fallbackAssignmentCount: 0,
        cases: [],
      };
    }

    const threadIndex = new Map(threads.map((thread) => [thread.id, thread]));
    const updatedCases: GrowthOperationalCaseRecord[] = [];
    let threadAssignmentCount = 0;
    let inheritedOwnerCount = 0;
    let fallbackAssignmentCount = 0;

    for (const entry of assignableCases) {
      const thread =
        entry.threadId ? (threadIndex.get(entry.threadId) ?? null) : null;
      const inheritedCandidate = this.resolveThreadOwnerCandidate(
        thread,
        candidates,
      );
      const selectedCandidate =
        inheritedCandidate ?? this.selectLeastLoadedCandidate(candidates);

      if (!selectedCandidate) {
        continue;
      }

      if (inheritedCandidate) {
        inheritedOwnerCount += 1;
      } else {
        fallbackAssignmentCount += 1;
      }

      const updatedCase = await this.growthOperationalCaseRepository.save({
        ...entry,
        assignedUserId: selectedCandidate.userId,
        assignedUserEmail: selectedCandidate.email,
        updatedAt: now,
      });
      updatedCases.push(updatedCase);
      selectedCandidate.loadScore += 1;

      if (thread && !thread.assigneeUserId) {
        const updatedThread = ConversationThread.create({
          ...thread.toPrimitives(),
          assigneeUserId: selectedCandidate.userId,
          updatedAt: now,
        });
        await this.conversationThreadRepository.save(updatedThread);
        threadIndex.set(updatedThread.id, updatedThread);
        threadAssignmentCount += 1;

        if (updatedThread.status === 'open') {
          selectedCandidate.loadScore += 1;
        }
      }
    }

    return {
      policyKey,
      candidateCount: candidates.size,
      reviewedCount: assignableCases.length,
      assignedCount: updatedCases.length,
      threadAssignmentCount,
      inheritedOwnerCount,
      fallbackAssignmentCount,
      cases: updatedCases,
    };
  }

  private orderCasesForPolicy(
    cases: GrowthOperationalCaseRecord[],
    policyKey: GrowthOperationalCaseAutoAssignmentPolicyKey,
  ): GrowthOperationalCaseRecord[] {
    const laneOrder = AUTO_ASSIGNMENT_POLICY_ORDER[policyKey];
    const laneIndex = new Map(
      laneOrder.map((routingPolicyKey, index) => [routingPolicyKey, index]),
    );

    return [...cases].sort((left, right) => {
      const leftLaneIndex = laneIndex.get(left.routingPolicyKey) ?? Number.MAX_SAFE_INTEGER;
      const rightLaneIndex =
        laneIndex.get(right.routingPolicyKey) ?? Number.MAX_SAFE_INTEGER;

      return (
        leftLaneIndex - rightLaneIndex ||
        this.compareNullableDates(left.dueAt, right.dueAt) ||
        this.comparePriority(left.priority, right.priority) ||
        left.createdAt.getTime() - right.createdAt.getTime() ||
        left.id.localeCompare(right.id)
      );
    });
  }

  private resolveThreadOwnerCandidate(
    thread: ConversationThread | null,
    candidates: Map<string, AutoAssignmentCandidate>,
  ): AutoAssignmentCandidate | null {
    if (!thread?.assigneeUserId) {
      return null;
    }

    return candidates.get(thread.assigneeUserId) ?? null;
  }

  private selectLeastLoadedCandidate(
    candidates: Map<string, AutoAssignmentCandidate>,
  ): AutoAssignmentCandidate | null {
    const candidateList = [...candidates.values()];

    if (candidateList.length === 0) {
      return null;
    }

    candidateList.sort((left, right) => {
      return (
        left.loadScore - right.loadScore ||
        left.userId.localeCompare(right.userId)
      );
    });

    return candidateList[0] ?? null;
  }

  private compareNullableDates(left: Date | null, right: Date | null): number {
    if (left && right) {
      return left.getTime() - right.getTime();
    }

    if (left) {
      return -1;
    }

    if (right) {
      return 1;
    }

    return 0;
  }

  private comparePriority(
    left: GrowthOperationalCaseRecord['priority'],
    right: GrowthOperationalCaseRecord['priority'],
  ): number {
    const priorityWeight = {
      critical: 0,
      warning: 1,
    } as const;

    return priorityWeight[left] - priorityWeight[right];
  }
}
