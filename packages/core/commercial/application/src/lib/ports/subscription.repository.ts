import { Subscription } from '@saas-platform/commercial-domain';

export interface SubscriptionRepository {
  findByTenantId(tenantId: string): Promise<Subscription | null>;
}
