import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Opportunity } from '@saas-platform/growth-domain';
import { OpportunityRepository } from '../ports/opportunity.repository';

export class ListTenantOpportunitiesUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly opportunityRepository: OpportunityRepository,
  ) {}

  async execute(
    tenantSlug: string,
    assigneeUserId?: string | null,
  ): Promise<Opportunity[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.opportunityRepository.findByTenantId(
      tenant.id,
      assigneeUserId?.trim() || null,
    );
  }
}
