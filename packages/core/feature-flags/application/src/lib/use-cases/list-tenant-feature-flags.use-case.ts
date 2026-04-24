import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { FeatureFlag } from '@saas-platform/feature-flags-domain';
import { FeatureFlagRepository } from '../ports/feature-flag.repository';

export class ListTenantFeatureFlagsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly featureFlagRepository: FeatureFlagRepository,
  ) {}

  async execute(tenantSlug: string): Promise<FeatureFlag[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.featureFlagRepository.findByTenantId(tenant.id);
  }
}
