import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import {
  GrowthOperationalCaseFollowUpState,
  GrowthOperationalCasePriority,
  GrowthOperationalCaseRecord,
  GrowthOperationalCaseRepository,
  GrowthOperationalCaseType,
} from '../ports/growth-operational-case.repository';
import { resolveGrowthOperationalCaseRoutingPolicyKey } from '../support/growth-operational-case-routing-policy';

export interface CreateTenantGrowthOperationalCaseInput {
  tenantSlug: string;
  sourceKey: string;
  caseType: GrowthOperationalCaseType;
  priority: GrowthOperationalCasePriority;
  title: string;
  summary: string;
  nextAction: string;
  followUpState?: GrowthOperationalCaseFollowUpState | null;
  threadId?: string | null;
  alertKey?: string | null;
  dueAt?: Date | null;
  createdByUserId: string;
  createdByEmail: string | null;
}

export class CreateTenantGrowthOperationalCaseUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly growthOperationalCaseRepository: GrowthOperationalCaseRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: CreateTenantGrowthOperationalCaseInput,
  ): Promise<GrowthOperationalCaseRecord> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const existing =
      await this.growthOperationalCaseRepository.findByTenantIdAndSourceKey(
        tenant.id,
        input.sourceKey,
      );

    const followUpState = this.resolveFollowUpState(
      input.caseType,
      input.followUpState,
    );
    const routingPolicyKey = resolveGrowthOperationalCaseRoutingPolicyKey({
      caseType: input.caseType,
      followUpState,
    });

    if (!existing) {
      return this.growthOperationalCaseRepository.create({
        tenantId: tenant.id,
        sourceKey: input.sourceKey,
        caseType: input.caseType,
        status: 'open',
        priority: input.priority,
        title: input.title,
        summary: input.summary,
        nextAction: input.nextAction,
        followUpState,
        routingPolicyKey,
        threadId: input.threadId ?? null,
        alertKey: input.alertKey ?? null,
        dueAt: input.dueAt ?? null,
        assignedUserId: null,
        assignedUserEmail: null,
        createdByUserId: input.createdByUserId,
        createdByEmail: input.createdByEmail,
        resolvedAt: null,
        resolvedByUserId: null,
        resolvedByEmail: null,
      });
    }

    const reopenedStatus =
      existing.status === 'resolved'
        ? existing.assignedUserId
          ? 'in_progress'
          : 'open'
        : existing.status;

    return this.growthOperationalCaseRepository.save({
      ...existing,
      caseType: input.caseType,
      status: reopenedStatus,
      priority: input.priority,
      title: input.title,
      summary: input.summary,
      nextAction: input.nextAction,
      followUpState,
      routingPolicyKey,
      threadId: input.threadId ?? null,
      alertKey: input.alertKey ?? null,
      dueAt: input.dueAt ?? null,
      resolvedAt: null,
      resolvedByUserId: null,
      resolvedByEmail: null,
      updatedAt: this.nowProvider(),
    });
  }

  private resolveFollowUpState(
    caseType: GrowthOperationalCaseType,
    followUpState?: GrowthOperationalCaseFollowUpState | null,
  ): GrowthOperationalCaseFollowUpState | null {
    if (caseType !== 'follow_up') {
      return null;
    }

    return followUpState ?? 'pending_team';
  }
}
