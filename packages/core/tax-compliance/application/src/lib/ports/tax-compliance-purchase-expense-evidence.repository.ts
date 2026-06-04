import {
  EcuadorTaxPurchaseExpenseCategory,
  EcuadorTaxPurchaseExpenseEvidenceRecordView,
  EcuadorTaxPurchaseExpenseEvidenceStatus,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';

export interface TaxCompliancePurchaseExpenseEvidenceRecordInput {
  evidenceId: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  supplierPartyId: string | null;
  supplierName: string;
  supplierTaxpayerId: string | null;
  documentNumber: string | null;
  documentCode: string | null;
  issuedAt: Date | null;
  category: EcuadorTaxPurchaseExpenseCategory;
  currency: string;
  subtotalInCents: number;
  vatInCents: number;
  totalInCents: number;
  deductible: boolean | null;
  supportReference: string | null;
  status: EcuadorTaxPurchaseExpenseEvidenceStatus;
  readinessStatus: EcuadorTaxReadinessStatus;
  blockers: string[];
  reviewNotes: string[];
  occurredAt: Date;
}

export interface TaxCompliancePurchaseExpenseEvidenceRepository {
  save(
    input: TaxCompliancePurchaseExpenseEvidenceRecordInput,
  ): Promise<EcuadorTaxPurchaseExpenseEvidenceRecordView>;
  listByTenantAndPeriod(input: {
    tenantId: string;
    tenantSlug: string;
    period: string;
  }): Promise<EcuadorTaxPurchaseExpenseEvidenceRecordView[]>;
}
