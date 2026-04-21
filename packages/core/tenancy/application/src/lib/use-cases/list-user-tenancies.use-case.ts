import { Membership, Tenant } from '@saas-platform/tenancy-domain';
import { MembershipRepository } from '../ports/membership.repository';
import {
  TenantAccessRecord,
  TenantAccessRepository,
} from '../ports/tenant-access.repository';
import { TenantRepository } from '../ports/tenant.repository';

export interface UserTenancyView {
  tenant: Tenant;
  membership: Membership;
  roleKeys: string[];
  permissionKeys: string[];
}

export class ListUserTenanciesUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly tenantAccessRepository: TenantAccessRepository,
  ) {}

  async execute(userId: string): Promise<UserTenancyView[]> {
    const memberships = await this.membershipRepository.findByUserId(userId);
    const tenancies = await Promise.all(
      memberships.map(async (membership) => {
        const [tenant, access] = await Promise.all([
          this.tenantRepository.findById(membership.tenantId),
          this.tenantAccessRepository.findByTenantAndUser(
            membership.tenantId,
            userId,
          ),
        ]);

        if (!tenant || !access) {
          return null;
        }

        return this.toView(tenant, membership, access);
      }),
    );

    return tenancies.filter((tenancy): tenancy is UserTenancyView => tenancy !== null);
  }

  private toView(
    tenant: Tenant,
    membership: Membership,
    access: TenantAccessRecord,
  ): UserTenancyView {
    return {
      tenant,
      membership,
      roleKeys: access.roleKeys,
      permissionKeys: access.permissionKeys,
    };
  }
}
