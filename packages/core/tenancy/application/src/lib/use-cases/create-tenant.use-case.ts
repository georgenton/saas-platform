import {
  Membership,
  MembershipStatus,
  Tenant,
  TenantStatus,
} from '@saas-platform/tenancy-domain';
import { TenantSlugAlreadyInUseError } from '../errors/tenant-slug-already-in-use.error';
import { MembershipIdGenerator } from '../ports/membership-id.generator';
import { TenantIdGenerator } from '../ports/tenant-id.generator';
import { TenantProvisioningRepository } from '../ports/tenant-provisioning.repository';
import { TenantRepository } from '../ports/tenant.repository';

export interface CreateTenantCommand {
  name: string;
  slug: string;
  ownerUserId: string;
}

export class CreateTenantUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly tenantIdGenerator: TenantIdGenerator,
    private readonly membershipIdGenerator: MembershipIdGenerator,
    private readonly tenantProvisioningRepository: TenantProvisioningRepository,
  ) {}

  async execute(command: CreateTenantCommand): Promise<Tenant> {
    const existingTenant = await this.tenantRepository.findBySlug(command.slug);

    if (existingTenant) {
      throw new TenantSlugAlreadyInUseError(command.slug);
    }

    const now = new Date();
    const tenant = Tenant.create({
      id: this.tenantIdGenerator.generate(),
      name: command.name,
      slug: command.slug,
      status: TenantStatus.Draft,
      createdAt: now,
      updatedAt: now,
    });

    const membership = Membership.create({
      id: this.membershipIdGenerator.generate(),
      tenantId: tenant.id,
      userId: command.ownerUserId,
      status: MembershipStatus.Active,
      invitedBy: command.ownerUserId,
      createdAt: now,
      updatedAt: now,
    });

    await this.tenantProvisioningRepository.createTenantWithOwner(
      tenant,
      membership,
    );

    return tenant;
  }
}
