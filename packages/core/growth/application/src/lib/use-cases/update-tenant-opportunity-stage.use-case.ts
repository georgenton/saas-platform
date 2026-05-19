import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Opportunity, OpportunityStage } from '@saas-platform/growth-domain';
import { OpportunityNotFoundError } from '../errors/opportunity-not-found.error';
import { OpportunityRepository } from '../ports/opportunity.repository';

export interface UpdateTenantOpportunityStageInput {
  tenantSlug: string;
  opportunityId: string;
  stage: OpportunityStage;
}

export class UpdateTenantOpportunityStageUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly opportunityRepository: OpportunityRepository,
  ) {}

  async execute(
    input: UpdateTenantOpportunityStageInput,
  ): Promise<Opportunity> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const opportunity = await this.opportunityRepository.findByTenantIdAndId(
      tenant.id,
      input.opportunityId,
    );

    if (!opportunity) {
      throw new OpportunityNotFoundError(
        input.tenantSlug,
        input.opportunityId,
      );
    }

    const now = new Date();
    const data = opportunity.toPrimitives();
    const updatedOpportunity = Opportunity.create({
      ...data,
      stage: input.stage,
      closedAt:
        input.stage === 'won' || input.stage === 'lost'
          ? data.closedAt ?? now
          : null,
      updatedAt: now,
    });

    await this.opportunityRepository.save(updatedOpportunity);

    return updatedOpportunity;
  }
}
