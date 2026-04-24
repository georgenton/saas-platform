import { FeatureFlag } from '@saas-platform/feature-flags-domain';

export interface FeatureFlagRepository {
  findByTenantId(tenantId: string): Promise<FeatureFlag[]>;
  upsert(input: {
    tenantId: string;
    key: string;
    enabled: boolean;
  }): Promise<FeatureFlag>;
}
