import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Lead } from '@saas-platform/growth-domain';
import { LeadNotFoundError } from '../errors/lead-not-found.error';
import { LeadRepository } from '../ports/lead.repository';

export class GetTenantLeadByIdUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly leadRepository: LeadRepository,
  ) {}

  async execute(tenantSlug: string, leadId: string): Promise<Lead> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const lead = await this.leadRepository.findByTenantIdAndId(
      tenant.id,
      leadId,
    );

    if (!lead) {
      throw new LeadNotFoundError(tenantSlug, leadId);
    }

    return lead;
  }
}
