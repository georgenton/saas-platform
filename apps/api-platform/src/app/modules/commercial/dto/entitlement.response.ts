import { Entitlement } from '@saas-platform/commercial-domain';

export interface EntitlementResponseDto {
  id: string;
  tenantId: string;
  key: string;
  value: unknown;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export const toEntitlementResponseDto = (
  entitlement: Entitlement,
): EntitlementResponseDto => ({
  id: entitlement.id,
  tenantId: entitlement.tenantId,
  key: entitlement.key,
  value: entitlement.value,
  source: entitlement.source,
  createdAt: entitlement.createdAt.toISOString(),
  updatedAt: entitlement.updatedAt.toISOString(),
});
