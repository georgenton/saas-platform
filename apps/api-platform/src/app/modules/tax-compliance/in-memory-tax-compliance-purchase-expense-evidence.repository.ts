import { EcuadorTaxPurchaseExpenseEvidenceRecordView } from '@saas-platform/tax-compliance-domain';
import {
  TaxCompliancePurchaseExpenseEvidenceRecordInput,
  TaxCompliancePurchaseExpenseEvidenceRepository,
} from '@saas-platform/tax-compliance-application';

export class InMemoryTaxCompliancePurchaseExpenseEvidenceRepository
  implements TaxCompliancePurchaseExpenseEvidenceRepository
{
  private readonly records = new Map<
    string,
    EcuadorTaxPurchaseExpenseEvidenceRecordView
  >();

  async save(
    input: TaxCompliancePurchaseExpenseEvidenceRecordInput,
  ): Promise<EcuadorTaxPurchaseExpenseEvidenceRecordView> {
    const existing = this.records.get(input.evidenceId);
    const now = input.occurredAt;
    const record: EcuadorTaxPurchaseExpenseEvidenceRecordView = {
      evidenceId: input.evidenceId,
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      supplierPartyId: input.supplierPartyId,
      supplierName: input.supplierName,
      supplierTaxpayerId: input.supplierTaxpayerId,
      documentNumber: input.documentNumber,
      documentCode: input.documentCode,
      issuedAt: input.issuedAt,
      category: input.category,
      currency: input.currency,
      subtotalInCents: input.subtotalInCents,
      vatInCents: input.vatInCents,
      totalInCents: input.totalInCents,
      deductible: input.deductible,
      supportReference: input.supportReference,
      status: input.status,
      readinessStatus: input.readinessStatus,
      blockers: [...input.blockers],
      reviewNotes: [...input.reviewNotes],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.records.set(input.evidenceId, record);

    return clone(record);
  }

  async listByTenantAndPeriod(input: {
    tenantId: string;
    tenantSlug: string;
    period: string;
  }): Promise<EcuadorTaxPurchaseExpenseEvidenceRecordView[]> {
    return Array.from(this.records.values())
      .filter(
        (record) =>
          record.tenantSlug === input.tenantSlug &&
          record.period === input.period,
      )
      .sort(
        (left, right) => left.createdAt.getTime() - right.createdAt.getTime(),
      )
      .map((record) => clone(record));
  }
}

function clone(
  record: EcuadorTaxPurchaseExpenseEvidenceRecordView,
): EcuadorTaxPurchaseExpenseEvidenceRecordView {
  return {
    ...record,
    blockers: [...record.blockers],
    reviewNotes: [...record.reviewNotes],
  };
}
