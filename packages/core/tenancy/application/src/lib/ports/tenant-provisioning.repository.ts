import { Membership, Tenant } from '@saas-platform/tenancy-domain';

export interface TenantProvisioningRepository {
  createTenantWithOwner(
    tenant: Tenant,
    membership: Membership,
    ownerRoleKey: string,
  ): Promise<void>;
}
