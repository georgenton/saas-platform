import { Tenant } from '@saas-platform/tenancy-domain';
import { TenantNotFoundError } from '../errors/tenant-not-found.error';
import { TenantRepository } from '../ports/tenant.repository';

export class GetTenantBySlugUseCase {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(slug: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findBySlug(slug);

    if (!tenant) {
      throw new TenantNotFoundError(slug);
    }

    return tenant;
  }
}
