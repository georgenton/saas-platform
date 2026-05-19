import { Lead } from '@saas-platform/growth-domain';

export interface LeadRepository {
  save(lead: Lead): Promise<void>;
  findByTenantId(tenantId: string): Promise<Lead[]>;
  findByTenantIdAndId(tenantId: string, leadId: string): Promise<Lead | null>;
}
