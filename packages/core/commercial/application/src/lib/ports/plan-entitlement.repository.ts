import { PlanEntitlement } from '@saas-platform/commercial-domain';

export interface PlanEntitlementRepository {
  findByPlanId(planId: string): Promise<PlanEntitlement[]>;
}
