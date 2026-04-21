import { MembershipNotFoundError } from '../errors/membership-not-found.error';
import { TenantNotFoundError } from '../errors/tenant-not-found.error';
import { TenantRoleManagementPolicyError } from '../errors/tenant-role-management-policy.error';
import { TENANT_ROLES } from '../roles/tenant-roles';
import { MembershipRepository } from '../ports/membership.repository';
import { MembershipRoleRepository } from '../ports/membership-role.repository';
import { TenantRepository } from '../ports/tenant.repository';

export interface RemoveMembershipRoleCommand {
  actorMembershipId: string;
  actorRoleKeys: string[];
  tenantSlug: string;
  userId: string;
  roleKey: string;
}

export class RemoveMembershipRoleUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly membershipRoleRepository: MembershipRoleRepository,
  ) {}

  async execute(command: RemoveMembershipRoleCommand): Promise<void> {
    const tenant = await this.tenantRepository.findBySlug(command.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(command.tenantSlug);
    }

    const membership = await this.membershipRepository.findByTenantAndUser(
      tenant.id,
      command.userId,
    );

    if (!membership) {
      throw new MembershipNotFoundError(command.tenantSlug, command.userId);
    }

    if (command.roleKey === TENANT_ROLES.OWNER) {
      if (!command.actorRoleKeys.includes(TENANT_ROLES.OWNER)) {
        throw new TenantRoleManagementPolicyError(
          'Only tenant owners can remove the tenant_owner role.',
        );
      }

      const targetHasRole = await this.membershipRoleRepository.hasRole(
        membership.id,
        command.roleKey,
      );

      if (targetHasRole) {
        const ownerCount =
          await this.membershipRoleRepository.countMembershipsWithRole(
            tenant.id,
            command.roleKey,
          );

        if (ownerCount <= 1) {
          throw new TenantRoleManagementPolicyError(
            'A tenant must keep at least one tenant_owner.',
          );
        }
      }
    }

    await this.membershipRoleRepository.removeRole(
      membership.id,
      command.roleKey,
    );
  }
}
