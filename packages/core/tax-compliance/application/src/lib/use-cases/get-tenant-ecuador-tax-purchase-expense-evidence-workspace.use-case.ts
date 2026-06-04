import { GetTenantPartyFiscalReadinessSummaryUseCase } from '@saas-platform/parties-application';
import {
  EcuadorTaxPurchaseExpenseEvidenceWorkspaceView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase {
  constructor(
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
    const partySummary =
      await this.getTenantPartyFiscalReadinessSummaryUseCase.execute(
        input.tenantSlug,
      );
    const supplierRole = partySummary.roleSummaries.find(
      (role) => role.role === 'supplier',
    );
    const incompleteSupplierIds = partySummary.incompleteParties
      .filter((party) => party.roles.includes('supplier'))
      .map((party) => party.id);
    const blockers = [
      'purchase_expense_evidence.source_not_connected',
      ...(incompleteSupplierIds.length > 0
        ? ['purchase_expense_evidence.suppliers_incomplete']
        : []),
    ];
    const readinessStatus = resolveReadinessStatus(blockers);
    const view: EcuadorTaxPurchaseExpenseEvidenceWorkspaceView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      source: 'operational_intake',
      documentRows: [],
      totalsByCurrency: [],
      supplierReadiness: {
        totalSuppliers: supplierRole?.totalParties ?? 0,
        completeSuppliers: supplierRole?.completeParties ?? 0,
        needsReviewSuppliers: supplierRole?.needsReviewParties ?? 0,
        incompleteSupplierIds,
      },
      blockers,
      reviewNotes: [
        'No hay fuente de compras/gastos conectada; este workspace prepara el contrato para intake operacional.',
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

function resolveReadinessStatus(blockers: string[]): EcuadorTaxReadinessStatus {
  return blockers.length > 0 ? 'blocked' : 'ready';
}
