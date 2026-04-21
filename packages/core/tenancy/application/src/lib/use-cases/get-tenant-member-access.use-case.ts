import { MembershipNotFoundError } from '../errors/membership-not-found.error';
import { TenantNotFoundError } from '../errors/tenant-not-found.error';
import {
  TenantAccessRecord,
  TenantAccessRepository,
} from '../ports/tenant-access.repository';
import { TenantRepository } from '../ports/tenant.repository';

export interface GetTenantMemberAccessCommand {
  tenantSlug: string;
  userId: string;
}

export interface TenantMemberAccessView extends TenantAccessRecord {
  userId: string;
}

export class GetTenantMemberAccessUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly tenantAccessRepository: TenantAccessRepository,
  ) {}

  async execute(
    command: GetTenantMemberAccessCommand,
  ): Promise<TenantMemberAccessView> {
    const tenant = await this.tenantRepository.findBySlug(command.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(command.tenantSlug);
    }

    const access = await this.tenantAccessRepository.findByTenantAndUser(
      tenant.id,
      command.userId,
    );

    if (!access) {
      throw new MembershipNotFoundError(command.tenantSlug, command.userId);
    }

    return {
      ...access,
      userId: command.userId,
    };
  }
}
