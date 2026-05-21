import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { GrowthOperationalCaseFollowUpStateNotAllowedError } from '../errors/growth-operational-case-follow-up-state-not-allowed.error';
import { GrowthOperationalCaseNotFoundError } from '../errors/growth-operational-case-not-found.error';
import {
  GrowthOperationalCaseFollowUpState,
  GrowthOperationalCaseRecord,
  GrowthOperationalCaseRepository,
} from '../ports/growth-operational-case.repository';
import {
  resolveGrowthOperationalCasePriority,
  resolveGrowthOperationalCaseRoutingPolicyKey,
} from '../support/growth-operational-case-routing-policy';

export interface UpdateTenantGrowthOperationalCaseFollowUpStateInput {
  tenantSlug: string;
  caseId: string;
  followUpState: GrowthOperationalCaseFollowUpState;
  nextAction?: string | null;
  dueAt?: Date | null;
}

export class UpdateTenantGrowthOperationalCaseFollowUpStateUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly growthOperationalCaseRepository: GrowthOperationalCaseRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: UpdateTenantGrowthOperationalCaseFollowUpStateInput,
  ): Promise<GrowthOperationalCaseRecord> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const record = await this.growthOperationalCaseRepository.findByTenantIdAndId(
      tenant.id,
      input.caseId,
    );

    if (!record) {
      throw new GrowthOperationalCaseNotFoundError(
        input.tenantSlug,
        input.caseId,
      );
    }

    if (record.caseType !== 'follow_up' || record.status === 'resolved') {
      throw new GrowthOperationalCaseFollowUpStateNotAllowedError(input.caseId);
    }

    const now = this.nowProvider();
    const priority = resolveGrowthOperationalCasePriority({
      caseType: record.caseType,
      status: record.status,
      currentPriority: record.priority,
      followUpState: input.followUpState,
      dueAt: input.dueAt === undefined ? record.dueAt : input.dueAt,
      now,
    });

    return this.growthOperationalCaseRepository.save({
      ...record,
      priority,
      followUpState: input.followUpState,
      routingPolicyKey: resolveGrowthOperationalCaseRoutingPolicyKey({
        caseType: record.caseType,
        status: record.status,
        followUpState: input.followUpState,
        dueAt: input.dueAt === undefined ? record.dueAt : input.dueAt,
        now,
      }),
      nextAction: input.nextAction ?? record.nextAction,
      dueAt: input.dueAt === undefined ? record.dueAt : input.dueAt,
      updatedAt: now,
    });
  }
}
