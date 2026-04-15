import { MembershipStatus } from '@saas-platform/tenancy-domain';
import { TenantAccessDeniedError } from '../errors/tenant-access-denied.error';
import { TenantNotFoundError } from '../errors/tenant-not-found.error';
import { MembershipRepository } from '../ports/membership.repository';
import { TenantRepository } from '../ports/tenant.repository';

export interface ResolveTenantAccessCommand {
  tenantSlug: string;
  userId: string;
}

export interface TenantAccessContext {
  tenantId: string;
  tenantSlug: string;
  userId: string;
  membershipId: string;
  membershipStatus: MembershipStatus;
  membershipRole: 'owner' | 'member';
}

export class ResolveTenantAccessUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly membershipRepository: MembershipRepository,
  ) {}

  async execute(
    command: ResolveTenantAccessCommand,
  ): Promise<TenantAccessContext> {
    const tenant = await this.tenantRepository.findBySlug(command.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(command.tenantSlug);
    }

    const membership = await this.membershipRepository.findByTenantAndUser(
      tenant.id,
      command.userId,
    );

    if (!membership || membership.status !== MembershipStatus.Active) {
      throw new TenantAccessDeniedError(command.tenantSlug, command.userId);
    }

    return {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      userId: command.userId,
      membershipId: membership.id,
      membershipStatus: membership.status,
      membershipRole:
        membership.userId === membership.toPrimitives().invitedBy
          ? 'owner'
          : 'member',
    };
  }
}
