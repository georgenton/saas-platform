import { GetTenantPartyFiscalReadinessSummaryUseCase } from '@saas-platform/parties-application';
import {
  EcuadorTaxPurchaseExpenseEvidenceWorkspaceView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { TaxCompliancePurchaseExpenseEvidenceRepository } from '../ports/tax-compliance-purchase-expense-evidence.repository';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly purchaseExpenseEvidenceRepository: TaxCompliancePurchaseExpenseEvidenceRepository,
    private readonly getTenantPartyFiscalReadinessSummaryUseCase: GetTenantPartyFiscalReadinessSummaryUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxPurchaseExpenseEvidenceWorkspaceView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const [partySummary, evidenceRows] = await Promise.all([
      this.getTenantPartyFiscalReadinessSummaryUseCase.execute(tenant.slug),
      this.purchaseExpenseEvidenceRepository.listByTenantAndPeriod({
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        period: input.period,
      }),
    ]);
    const supplierRole = partySummary.roleSummaries.find(
      (role) => role.role === 'supplier',
    );
    const incompleteSupplierIds = partySummary.incompleteParties
      .filter((party) => party.roles.includes('supplier'))
      .map((party) => party.id);
    const documentRows = evidenceRows.map((row) => ({
      evidenceId: row.evidenceId,
      supplierPartyId: row.supplierPartyId,
      supplierName: row.supplierName,
      supplierTaxpayerId: row.supplierTaxpayerId,
      documentNumber: row.documentNumber,
      documentCode: row.documentCode,
      issuedAt: row.issuedAt,
      category: row.category,
      currency: row.currency,
      subtotalInCents: row.subtotalInCents,
      vatInCents: row.vatInCents,
      totalInCents: row.totalInCents,
      deductible: row.deductible,
      supportReference: row.supportReference,
      status: row.status,
      readinessStatus: row.readinessStatus,
      blockers: [...row.blockers],
      reviewNotes: [...row.reviewNotes],
    }));
    const blockers = [
      ...(documentRows.length === 0
        ? ['purchase_expense_evidence.source_not_connected']
        : []),
      ...documentRows.flatMap((row) => row.blockers),
      ...(incompleteSupplierIds.length > 0
        ? ['purchase_expense_evidence.suppliers_incomplete']
        : []),
    ];
    const readinessStatus = resolveReadinessStatus({
      blockers,
      hasNeedsReview: documentRows.some(
        (row) => row.readinessStatus === 'needs_review',
      ),
    });
    const view: EcuadorTaxPurchaseExpenseEvidenceWorkspaceView = {
      tenantSlug: tenant.slug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      source: 'operational_intake',
      documentRows,
      totalsByCurrency: buildTotals(documentRows),
      supplierReadiness: {
        totalSuppliers: Math.max(
          supplierRole?.totalParties ?? 0,
          new Set(
            documentRows.map(
              (row) => row.supplierTaxpayerId ?? row.supplierName,
            ),
          ).size,
        ),
        completeSuppliers: supplierRole?.completeParties ?? 0,
        needsReviewSuppliers: supplierRole?.needsReviewParties ?? 0,
        incompleteSupplierIds,
      },
      blockers,
      reviewNotes: [
        documentRows.length === 0
          ? 'No hay comprobantes de compra/gasto cargados para este periodo.'
          : `${documentRows.length} comprobantes de compra/gasto cargados para este periodo.`,
        supplierRole
          ? `${supplierRole.totalParties} proveedores detectados en directorio fiscal.`
          : 'No hay proveedores fiscales detectados en Parties todavia.',
      ],
      nextStep:
        'Conectar intake de comprobantes de compra/gasto o cargar evidencia operacional antes de calcular credito tributario.',
      guardrails: [
        'Compras y gastos se modelan como evidencia operacional, no como contabilidad oficial.',
        'Deducibilidad y credito tributario requieren criterio del contador o responsable tributario.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'purchase_expense_evidence_reviewed',
        source: 'purchase_expense_evidence_workspace',
        payload: {
          readinessStatus,
          documentCount: view.documentRows.length,
          supplierCount: view.supplierReadiness.totalSuppliers,
          blockerCount: blockers.length,
        },
      });
    }

    return view;
  }
}

function buildTotals(
  rows: EcuadorTaxPurchaseExpenseEvidenceWorkspaceView['documentRows'],
): EcuadorTaxPurchaseExpenseEvidenceWorkspaceView['totalsByCurrency'] {
  return Array.from(
    rows.reduce((totals, row) => {
      const current = totals.get(row.currency) ?? {
        currency: row.currency,
        documentCount: 0,
        subtotalInCents: 0,
        vatInCents: 0,
        totalInCents: 0,
        deductibleSubtotalInCents: 0,
      };
      current.documentCount += 1;
      current.subtotalInCents += row.subtotalInCents;
      current.vatInCents += row.vatInCents;
      current.totalInCents += row.totalInCents;
      current.deductibleSubtotalInCents +=
        row.deductible === false ? 0 : row.subtotalInCents;
      totals.set(row.currency, current);
      return totals;
    }, new Map<string, EcuadorTaxPurchaseExpenseEvidenceWorkspaceView['totalsByCurrency'][number]>()),
    ([, total]) => total,
  );
}

function resolveReadinessStatus(input: {
  blockers: string[];
  hasNeedsReview: boolean;
}): EcuadorTaxReadinessStatus {
  if (input.blockers.length > 0) {
    return 'blocked';
  }

  return input.hasNeedsReview ? 'needs_review' : 'ready';
}
