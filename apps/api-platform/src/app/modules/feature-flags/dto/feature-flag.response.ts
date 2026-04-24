import { FeatureFlag } from '@saas-platform/feature-flags-domain';

export interface FeatureFlagResponseDto {
  id: string;
  tenantId: string;
  key: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export const toFeatureFlagResponseDto = (
  featureFlag: FeatureFlag,
): FeatureFlagResponseDto => {
  const data = featureFlag.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    key: data.key,
    enabled: data.enabled,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
