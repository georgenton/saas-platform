import { EcuadorTaxEcommerceEvidenceSummaryView } from '@saas-platform/tax-compliance-domain';

export interface TaxComplianceEcommerceEvidenceRepository {
  summarizeTenantPeriod(command: {
    tenantSlug: string;
    period: string;
    generatedAt: Date;
  }): Promise<EcuadorTaxEcommerceEvidenceSummaryView>;
}
