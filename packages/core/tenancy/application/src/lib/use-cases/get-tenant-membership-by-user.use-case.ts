import { Membership } from '@saas-platform/tenancy-domain';
import { MembershipNotFoundError } from '../errors/membership-not-found.error';
import { TenantNotFoundError } from '../errors/tenant-not-found.error';
import { MembershipRepository } from '../ports/membership.repository';
import { TenantRepository } from '../ports/tenant.repository';

export interface GetTenantMembershipByUserCommand {
  tenantSlug: string;
  userId: string;
}

export class GetTenantMembershipByUserUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly membershipRepository: MembershipRepository,
  ) {}

  async execute(
    command: GetTenantMembershipByUserCommand,
  ): Promise<Membership> {
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

    return membership;
  }
}
