import {
  Plan,
  PlanEntitlement,
  SubscriptionStatus,
} from '@saas-platform/commercial-domain';
import { TenantCommercialSnapshot } from '../types/tenant-commercial-snapshot';

export interface AssignPlanToTenantParams {
  tenantId: string;
  plan: Plan;
  planEntitlements: PlanEntitlement[];
  subscriptionId: string;
  status: SubscriptionStatus;
  startedAt: Date;
  expiresAt: Date | null;
  trialEndsAt: Date | null;
}

export interface TenantCommercialProvisioningRepository {
  assignPlanToTenant(
    params: AssignPlanToTenantParams,
  ): Promise<TenantCommercialSnapshot>;
}
