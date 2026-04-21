import { Membership } from '@saas-platform/tenancy-domain';

export interface MembershipRepository {
  save(membership: Membership): Promise<void>;
  findByTenantId(tenantId: string): Promise<Membership[]>;
  findByUserId(userId: string): Promise<Membership[]>;
  findByTenantAndUser(
    tenantId: string,
    userId: string,
  ): Promise<Membership | null>;
}
