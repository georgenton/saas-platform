import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import {
  GrowthOperationalCaseRecord,
  GrowthOperationalCaseRepository,
  GrowthOperationalCaseRoutingPolicyKey,
  GrowthOperationalCaseStatus,
} from '../ports/growth-operational-case.repository';

export class ListTenantGrowthOperationalCasesUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly growthOperationalCaseRepository: GrowthOperationalCaseRepository,
  ) {}

  async execute(
    tenantSlug: string,
    status?: GrowthOperationalCaseStatus | null,
    routingPolicyKey?: GrowthOperationalCaseRoutingPolicyKey | null,
  ): Promise<GrowthOperationalCaseRecord[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.growthOperationalCaseRepository.findByTenantId(
      tenant.id,
      {
        status: status ?? null,
        routingPolicyKey: routingPolicyKey ?? null,
      },
    );
  }
}
