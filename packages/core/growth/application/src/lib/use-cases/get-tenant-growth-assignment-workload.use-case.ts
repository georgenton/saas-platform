import { UserRepository } from '@saas-platform/identity-application';
import {
  MembershipRepository,
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { ConversationThread, Opportunity } from '@saas-platform/growth-domain';
import { MembershipStatus } from '@saas-platform/tenancy-domain';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';
import { OpportunityRepository } from '../ports/opportunity.repository';

export interface TenantGrowthAssigneeWorkloadView {
  userId: string;
  displayName: string | null;
  email: string | null;
  openThreadCount: number;
  openWhatsappThreadCount: number;
  openManualThreadCount: number;
  openOpportunityCount: number;
  openOpportunityAmountInCents: number;
  wonOpportunityCount: number;
  lostOpportunityCount: number;
}

export interface TenantGrowthAssignmentWorkloadView {
  tenantSlug: string;
  generatedAt: Date;
  totals: {
    openThreadCount: number;
    unassignedOpenThreadCount: number;
    openOpportunityCount: number;
    unassignedOpenOpportunityCount: number;
    openOpportunityAmountInCents: number;
  };
  assignees: TenantGrowthAssigneeWorkloadView[];
}

export class GetTenantGrowthAssignmentWorkloadUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly userRepository: UserRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
    private readonly opportunityRepository: OpportunityRepository,
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantGrowthAssignmentWorkloadView> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const [memberships, threads, opportunities] = await Promise.all([
      this.membershipRepository.findByTenantId(tenant.id),
      this.conversationThreadRepository.findByTenantId(tenant.id),
      this.opportunityRepository.findByTenantId(tenant.id),
    ]);

    const activeMemberships = memberships.filter(
      (membership) => membership.status === MembershipStatus.Active,
    );
    const assigneeIds = new Set(
      activeMemberships.map((membership) => membership.userId),
    );

    for (const thread of threads) {
      if (thread.assigneeUserId) {
        assigneeIds.add(thread.assigneeUserId);
      }
    }

    for (const opportunity of opportunities) {
      if (opportunity.assigneeUserId) {
        assigneeIds.add(opportunity.assigneeUserId);
      }
    }

    const userIndex = new Map<string, Awaited<ReturnType<UserRepository['findById']>>>();

    await Promise.all(
      [...assigneeIds].map(async (userId) => {
        userIndex.set(userId, await this.userRepository.findById(userId));
      }),
    );

    const assignees = [...assigneeIds]
      .map((userId) =>
        this.toAssigneeWorkload(
          userId,
          userIndex.get(userId) ?? null,
          threads,
          opportunities,
        ),
      )
      .sort((left, right) => {
        const leftLoad =
          left.openThreadCount + left.openOpportunityCount + left.openOpportunityAmountInCents;
        const rightLoad =
          right.openThreadCount + right.openOpportunityCount + right.openOpportunityAmountInCents;

        return rightLoad - leftLoad || left.userId.localeCompare(right.userId);
      });

    const openThreads = threads.filter((thread) => thread.status === 'open');
    const openOpportunities = opportunities.filter(
      (opportunity) =>
        opportunity.stage !== 'won' && opportunity.stage !== 'lost',
    );

    return {
      tenantSlug,
      generatedAt: new Date(),
      totals: {
        openThreadCount: openThreads.length,
        unassignedOpenThreadCount: openThreads.filter(
          (thread) => !thread.assigneeUserId,
        ).length,
        openOpportunityCount: openOpportunities.length,
        unassignedOpenOpportunityCount: openOpportunities.filter(
          (opportunity) => !opportunity.assigneeUserId,
        ).length,
        openOpportunityAmountInCents: openOpportunities.reduce(
          (sum, opportunity) => sum + (opportunity.amountInCents ?? 0),
          0,
        ),
      },
      assignees,
    };
  }

  private toAssigneeWorkload(
    userId: string,
    user: Awaited<ReturnType<UserRepository['findById']>>,
    threads: ConversationThread[],
    opportunities: Opportunity[],
  ): TenantGrowthAssigneeWorkloadView {
    const assignedThreads = threads.filter(
      (thread) => thread.assigneeUserId === userId && thread.status === 'open',
    );
    const assignedOpenOpportunities = opportunities.filter(
      (opportunity) =>
        opportunity.assigneeUserId === userId &&
        opportunity.stage !== 'won' &&
        opportunity.stage !== 'lost',
    );

    return {
      userId,
      displayName: user?.toPrimitives().name ?? null,
      email: user?.email ?? null,
      openThreadCount: assignedThreads.length,
      openWhatsappThreadCount: assignedThreads.filter(
        (thread) => thread.channel === 'whatsapp',
      ).length,
      openManualThreadCount: assignedThreads.filter(
        (thread) => thread.channel === 'manual',
      ).length,
      openOpportunityCount: assignedOpenOpportunities.length,
      openOpportunityAmountInCents: assignedOpenOpportunities.reduce(
        (sum, opportunity) => sum + (opportunity.amountInCents ?? 0),
        0,
      ),
      wonOpportunityCount: opportunities.filter(
        (opportunity) =>
          opportunity.assigneeUserId === userId && opportunity.stage === 'won',
      ).length,
      lostOpportunityCount: opportunities.filter(
        (opportunity) =>
          opportunity.assigneeUserId === userId && opportunity.stage === 'lost',
      ).length,
    };
  }
}
