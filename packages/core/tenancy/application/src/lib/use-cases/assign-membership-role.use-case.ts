import { MembershipNotFoundError } from '../errors/membership-not-found.error';
import { TenantNotFoundError } from '../errors/tenant-not-found.error';
import { MembershipRepository } from '../ports/membership.repository';
import { MembershipRoleRepository } from '../ports/membership-role.repository';
import { TenantRepository } from '../ports/tenant.repository';

export interface AssignMembershipRoleCommand {
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
