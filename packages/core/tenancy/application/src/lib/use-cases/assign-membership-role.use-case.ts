import { MembershipNotFoundError } from '../errors/membership-not-found.error';
import { TenantNotFoundError } from '../errors/tenant-not-found.error';
import { TenantRoleManagementPolicyError } from '../errors/tenant-role-management-policy.error';
import { TENANT_ROLES } from '../roles/tenant-roles';
import { MembershipRepository } from '../ports/membership.repository';
import { MembershipRoleRepository } from '../ports/membership-role.repository';
import { TenantRepository } from '../ports/tenant.repository';

export interface AssignMembershipRoleCommand {
  actorRoleKeys: string[];
  tenantSlug: string;
  userId: string;
  roleKey: string;
}

export class AssignMembershipRoleUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly membershipRoleRepository: MembershipRoleRepository,
  ) {}

  async execute(command: AssignMembershipRoleCommand): Promise<void> {
    if (
      command.roleKey === TENANT_ROLES.OWNER &&
      !command.actorRoleKeys.includes(TENANT_ROLES.OWNER)
    ) {
      throw new TenantRoleManagementPolicyError(
        'Only tenant owners can assign the tenant_owner role.',
      );
    }

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

    await this.membershipRoleRepository.assignRole(
      membership.id,
      command.roleKey,
      new Date(),
    );
  }
}
