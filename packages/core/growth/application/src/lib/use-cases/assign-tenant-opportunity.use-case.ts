import {
  MembershipRepository,
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { Opportunity } from '@saas-platform/growth-domain';
import { GrowthAssigneeMembershipNotFoundError } from '../errors/growth-assignee-membership-not-found.error';
import { OpportunityNotFoundError } from '../errors/opportunity-not-found.error';
import { OpportunityRepository } from '../ports/opportunity.repository';

export interface AssignTenantOpportunityInput {
  tenantSlug: string;
  opportunityId: string;
  assigneeUserId?: string | null;
}

export class AssignTenantOpportunityUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly opportunityRepository: OpportunityRepository,
  ) {}

  async execute(
    input: AssignTenantOpportunityInput,
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
      throw new OpportunityNotFoundError(input.tenantSlug, input.opportunityId);
    }

    const normalizedAssigneeUserId = this.normalizeOptionalValue(
      input.assigneeUserId,
    );

    if (normalizedAssigneeUserId) {
      const membership = await this.membershipRepository.findByTenantAndUser(
        tenant.id,
        normalizedAssigneeUserId,
      );

      if (!membership) {
        throw new GrowthAssigneeMembershipNotFoundError(
          input.tenantSlug,
          normalizedAssigneeUserId,
        );
      }
    }

    const updatedOpportunity = Opportunity.create({
      ...opportunity.toPrimitives(),
      assigneeUserId: normalizedAssigneeUserId,
      updatedAt: new Date(),
    });

    await this.opportunityRepository.save(updatedOpportunity);

    return updatedOpportunity;
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
