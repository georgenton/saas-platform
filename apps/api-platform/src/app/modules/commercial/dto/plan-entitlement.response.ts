import { PlanEntitlement } from '@saas-platform/commercial-domain';

export interface PlanEntitlementResponseDto {
  id: string;
  planId: string;
  key: string;
  value: unknown;
  createdAt: string;
  updatedAt: string;
}

export const toPlanEntitlementResponseDto = (
  entitlement: PlanEntitlement,
): PlanEntitlementResponseDto => ({
  id: entitlement.id,
  planId: entitlement.planId,
  key: entitlement.key,
  value: entitlement.value,
  createdAt: entitlement.createdAt.toISOString(),
  updatedAt: entitlement.updatedAt.toISOString(),
});
