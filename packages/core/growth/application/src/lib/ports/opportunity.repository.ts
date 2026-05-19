import { Opportunity } from '@saas-platform/growth-domain';

export interface OpportunityRepository {
  save(opportunity: Opportunity): Promise<void>;
  findByTenantId(
    tenantId: string,
    assigneeUserId?: string | null,
  ): Promise<Opportunity[]>;
  findByTenantIdAndId(
    tenantId: string,
    opportunityId: string,
  ): Promise<Opportunity | null>;
}
