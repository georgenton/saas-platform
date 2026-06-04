import {
  EcuadorTaxPurchaseExpenseCategory,
  EcuadorTaxPurchaseExpenseEvidenceRecordView,
  EcuadorTaxPurchaseExpenseEvidenceStatus,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { TaxCompliancePurchaseExpenseEvidenceRepository } from '../ports/tax-compliance-purchase-expense-evidence.repository';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class RecordTenantEcuadorTaxPurchaseExpenseEvidenceUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly purchaseExpenseEvidenceRepository: TaxCompliancePurchaseExpenseEvidenceRepository,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    supplierPartyId?: string | null;
    supplierName: string;
    supplierTaxpayerId?: string | null;
    documentNumber?: string | null;
    documentCode?: string | null;
    issuedAt?: Date | string | null;
    category?: EcuadorTaxPurchaseExpenseCategory;
    currency?: string;
    subtotalInCents: number;
    vatInCents?: number;
    totalInCents?: number;
    deductible?: boolean | null;
    supportReference?: string | null;
  }): Promise<EcuadorTaxPurchaseExpenseEvidenceRecordView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const now = this.nowProvider();
    const category = input.category ?? 'uncategorized';
    const currency = input.currency ?? 'USD';
    const vatInCents = input.vatInCents ?? 0;
    const totalInCents =
      input.totalInCents ?? Math.max(input.subtotalInCents + vatInCents, 0);
    const issuedAt =
      typeof input.issuedAt === 'string'
        ? new Date(input.issuedAt)
        : (input.issuedAt ?? null);
    const resolution = resolveEvidenceState({
      supplierName: input.supplierName,
      supplierTaxpayerId: input.supplierTaxpayerId ?? null,
      documentNumber: input.documentNumber ?? null,
      category,
      subtotalInCents: input.subtotalInCents,
      supportReference: input.supportReference ?? null,
    });
    const evidence = await this.purchaseExpenseEvidenceRepository.save({
      evidenceId: `purchase_expense_${now.getTime()}`,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      period: input.period,
      year: input.year,
      supplierPartyId: input.supplierPartyId ?? null,
      supplierName: input.supplierName,
      supplierTaxpayerId: input.supplierTaxpayerId ?? null,
      documentNumber: input.documentNumber ?? null,
      documentCode: input.documentCode ?? null,
      issuedAt,
      category,
      currency,
      subtotalInCents: input.subtotalInCents,
      vatInCents,
      totalInCents,
      deductible: input.deductible ?? null,
      supportReference: input.supportReference ?? null,
      status: resolution.status,
      readinessStatus: resolution.readinessStatus,
      blockers: resolution.blockers,
      reviewNotes: resolution.reviewNotes,
      occurredAt: now,
    });

    await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
      tenantSlug: tenant.slug,
      period: input.period,
      year: input.year,
      eventType: 'purchase_expense_evidence_recorded',
      source: 'purchase_expense_evidence_intake',
      payload: {
        evidenceId: evidence.evidenceId,
        status: evidence.status,
        readinessStatus: evidence.readinessStatus,
        category: evidence.category,
        totalInCents: evidence.totalInCents,
        currency: evidence.currency,
      },
    });

    return evidence;
  }
}

function resolveEvidenceState(input: {
  supplierName: string;
  supplierTaxpayerId: string | null;
  documentNumber: string | null;
  category: EcuadorTaxPurchaseExpenseCategory;
  subtotalInCents: number;
  supportReference: string | null;
}): {
  status: EcuadorTaxPurchaseExpenseEvidenceStatus;
  readinessStatus: EcuadorTaxReadinessStatus;
  blockers: string[];
  reviewNotes: string[];
} {
  const blockers = [
    input.supplierName.trim()
      ? null
      : 'purchase_evidence.supplier_name_missing',
    input.supplierTaxpayerId
      ? null
      : 'purchase_evidence.supplier_taxpayer_id_missing',
    input.documentNumber ? null : 'purchase_evidence.document_number_missing',
    input.subtotalInCents > 0 ? null : 'purchase_evidence.subtotal_invalid',
    input.supportReference
      ? null
      : 'purchase_evidence.support_reference_missing',
  ].filter((blocker): blocker is string => blocker !== null);
  const reviewNotes = [
    input.category === 'uncategorized'
      ? 'purchase_evidence.category_requires_review'
      : null,
    input.category === 'non_deductible'
      ? 'purchase_evidence.marked_non_deductible'
      : null,
  ].filter((note): note is string => note !== null);

  if (!input.supplierTaxpayerId) {
    return {
      status: 'needs_supplier_data',
      readinessStatus: 'blocked',
      blockers,
      reviewNotes,
    };
  }

  if (blockers.length > 0) {
    return {
      status: 'draft',
      readinessStatus: 'blocked',
      blockers,
      reviewNotes,
    };
  }

  if (reviewNotes.length > 0) {
    return {
      status: 'needs_tax_review',
      readinessStatus: 'needs_review',
      blockers,
      reviewNotes,
    };
  }

  return {
    status: 'ready',
    readinessStatus: 'ready',
    blockers,
    reviewNotes,
  };
}
