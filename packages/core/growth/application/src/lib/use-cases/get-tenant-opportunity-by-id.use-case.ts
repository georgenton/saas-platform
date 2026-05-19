import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Opportunity } from '@saas-platform/growth-domain';
import { OpportunityNotFoundError } from '../errors/opportunity-not-found.error';
import { OpportunityRepository } from '../ports/opportunity.repository';

export class GetTenantOpportunityByIdUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly opportunityRepository: OpportunityRepository,
  ) {}

  async execute(
    tenantSlug: string,
    opportunityId: string,
  ): Promise<Opportunity> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const opportunity = await this.opportunityRepository.findByTenantIdAndId(
      tenant.id,
      opportunityId,
    );

    if (!opportunity) {
      throw new OpportunityNotFoundError(tenantSlug, opportunityId);
    }

    return opportunity;
  }
}
