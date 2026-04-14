import { Membership, Tenant } from '@saas-platform/tenancy-domain';

export interface TenantProvisioningRepository {
  createTenantWithOwner(tenant: Tenant, membership: Membership): Promise<void>;
}
