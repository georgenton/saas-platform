import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { FeatureFlag } from '@saas-platform/feature-flags-domain';
import { FeatureFlagRepository } from '../ports/feature-flag.repository';

export interface SetTenantFeatureFlagInput {
  tenantSlug: string;
  key: string;
  enabled: boolean;
}

export class SetTenantFeatureFlagUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly featureFlagRepository: FeatureFlagRepository,
  ) {}

  async execute(input: SetTenantFeatureFlagInput): Promise<FeatureFlag> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    return this.featureFlagRepository.upsert({
      tenantId: tenant.id,
      key: input.key,
      enabled: input.enabled,
    });
  }
}
