import { Tenant, TenantStatus } from '@saas-platform/tenancy-domain';
import { TenantIdGenerator } from '../ports/tenant-id.generator';
import { TenantRepository } from '../ports/tenant.repository';

export interface CreateTenantCommand {
  name: string;
  slug: string;
}

export class CreateTenantUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly tenantIdGenerator: TenantIdGenerator,
  ) {}

  async execute(command: CreateTenantCommand): Promise<Tenant> {
    const existingTenant = await this.tenantRepository.findBySlug(command.slug);

    if (existingTenant) {
      throw new Error(`Tenant slug "${command.slug}" is already in use.`);
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

    await this.tenantRepository.save(tenant);

    return tenant;
  }
}
