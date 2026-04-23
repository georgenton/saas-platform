import { Entitlement, Subscription } from '@saas-platform/commercial-domain';

export interface TenantCommercialSnapshot {
  subscription: Subscription;
  entitlements: Entitlement[];
}
