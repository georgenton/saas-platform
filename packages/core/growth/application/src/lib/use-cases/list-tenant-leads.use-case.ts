import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Lead } from '@saas-platform/growth-domain';
import { LeadRepository } from '../ports/lead.repository';

export class ListTenantLeadsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly leadRepository: LeadRepository,
  ) {}

  async execute(tenantSlug: string): Promise<Lead[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.leadRepository.findByTenantId(tenant.id);
  }
}
