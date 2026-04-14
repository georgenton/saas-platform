import { Membership } from '@saas-platform/tenancy-domain';

export interface MembershipRepository {
  save(membership: Membership): Promise<void>;
  findByTenantAndUser(
    tenantId: string,
    userId: string,
  ): Promise<Membership | null>;
}
