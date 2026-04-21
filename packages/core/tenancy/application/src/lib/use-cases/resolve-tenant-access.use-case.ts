import { MembershipStatus } from '@saas-platform/tenancy-domain';
import { TenantAccessDeniedError } from '../errors/tenant-access-denied.error';
import { TenantNotFoundError } from '../errors/tenant-not-found.error';
import { TenantAccessRepository } from '../ports/tenant-access.repository';
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
  roleKeys: string[];
  permissionKeys: string[];
}

export class ResolveTenantAccessUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly tenantAccessRepository: TenantAccessRepository,
  ) {}

  async execute(
    command: ResolveTenantAccessCommand,
  ): Promise<TenantAccessContext> {
    const tenant = await this.tenantRepository.findBySlug(command.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(command.tenantSlug);
    }

    const access = await this.tenantAccessRepository.findByTenantAndUser(
      tenant.id,
      command.userId,
    );

    if (!access || access.membershipStatus !== MembershipStatus.Active) {
      throw new TenantAccessDeniedError(command.tenantSlug, command.userId);
    }

    return {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      userId: command.userId,
      membershipId: access.membershipId,
      membershipStatus: access.membershipStatus as MembershipStatus,
      roleKeys: access.roleKeys,
      permissionKeys: access.permissionKeys,
    };
  }
}
