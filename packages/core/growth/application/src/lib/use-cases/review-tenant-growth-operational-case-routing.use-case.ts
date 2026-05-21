import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import {
  GrowthOperationalCaseRecord,
  GrowthOperationalCaseRepository,
} from '../ports/growth-operational-case.repository';
import {
  resolveGrowthOperationalCasePriority,
  resolveGrowthOperationalCaseRoutingPolicyKey,
} from '../support/growth-operational-case-routing-policy';

export interface ReviewTenantGrowthOperationalCaseRoutingInput {
  tenantSlug: string;
}

export interface ReviewTenantGrowthOperationalCaseRoutingResult {
  reviewedCount: number;
  updatedCount: number;
  escalationReviewCount: number;
  cases: GrowthOperationalCaseRecord[];
}

export class ReviewTenantGrowthOperationalCaseRoutingUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly growthOperationalCaseRepository: GrowthOperationalCaseRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: ReviewTenantGrowthOperationalCaseRoutingInput,
  ): Promise<ReviewTenantGrowthOperationalCaseRoutingResult> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const now = this.nowProvider();
    const cases = await this.growthOperationalCaseRepository.findByTenantId(tenant.id);
    const activeCases = cases.filter((entry) => entry.status !== 'resolved');
    const updatedCases: GrowthOperationalCaseRecord[] = [];

    for (const entry of activeCases) {
      const priority = resolveGrowthOperationalCasePriority({
        caseType: entry.caseType,
        status: entry.status,
        currentPriority: entry.priority,
        followUpState: entry.followUpState,
        dueAt: entry.dueAt,
        now,
      });
      const routingPolicyKey = resolveGrowthOperationalCaseRoutingPolicyKey({
        caseType: entry.caseType,
        status: entry.status,
        followUpState: entry.followUpState,
        dueAt: entry.dueAt,
        now,
      });

      if (
        priority === entry.priority &&
        routingPolicyKey === entry.routingPolicyKey
      ) {
        continue;
      }

      const updated = await this.growthOperationalCaseRepository.save({
        ...entry,
        priority,
        routingPolicyKey,
        updatedAt: now,
      });

      updatedCases.push(updated);
    }

    return {
      reviewedCount: activeCases.length,
      updatedCount: updatedCases.length,
      escalationReviewCount: updatedCases.filter(
        (entry) => entry.routingPolicyKey === 'escalation_review',
      ).length,
      cases: updatedCases,
    };
  }
}
