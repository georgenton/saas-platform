import {
  EcuadorTaxComplianceEventType,
  EcuadorTaxComplianceEventView,
} from '@saas-platform/tax-compliance-domain';

export interface TaxComplianceEventRepository {
  record(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    period: string;
    year: number;
    eventType: EcuadorTaxComplianceEventType;
    source: string;
    payload: Record<string, unknown>;
    occurredAt: Date;
  }): Promise<EcuadorTaxComplianceEventView>;
  listByTenantAndPeriod(command: {
    tenantId: string;
    tenantSlug: string;
    period: string;
    limit?: number;
  }): Promise<EcuadorTaxComplianceEventView[]>;
}
