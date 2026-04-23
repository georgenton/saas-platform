import { Entitlement } from '@saas-platform/commercial-domain';

export interface EntitlementRepository {
  findByTenantId(tenantId: string): Promise<Entitlement[]>;
}
