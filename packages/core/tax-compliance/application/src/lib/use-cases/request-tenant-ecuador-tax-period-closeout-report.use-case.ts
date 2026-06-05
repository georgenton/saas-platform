import {
  EcuadorTaxPeriodCloseoutReportView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAnnexesReadinessUseCase } from './get-tenant-ecuador-tax-annexes-readiness.use-case';
import { GetTenantEcuadorTaxFilingHandoffUseCase } from './get-tenant-ecuador-tax-filing-handoff.use-case';
import { GetTenantEcuadorTaxOperationalCloseoutUseCase } from './get-tenant-ecuador-tax-operational-closeout.use-case';
import { GetTenantEcuadorTaxPeriodEvidenceVaultUseCase } from './get-tenant-ecuador-tax-period-evidence-vault.use-case';
import { GetTenantEcuadorTaxVatDeclarationApprovalUseCase } from './get-tenant-ecuador-tax-vat-declaration-approval.use-case';
import { GetTenantEcuadorTaxWithholdingRegistryUseCase } from './get-tenant-ecuador-tax-withholding-registry.use-case';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxAccountingBridgePreviewUseCase } from './request-tenant-ecuador-tax-accounting-bridge-preview.use-case';
import { RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase } from './request-tenant-ecuador-tax-income-tax-evidence-packet.use-case';
import { RequestTenantEcuadorTaxSalesBookUseCase } from './request-tenant-ecuador-tax-sales-book.use-case';

export class RequestTenantEcuadorTaxPeriodCloseoutReportUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxSalesBookUseCase: RequestTenantEcuadorTaxSalesBookUseCase,
    private readonly getTenantEcuadorTaxVatDeclarationApprovalUseCase: GetTenantEcuadorTaxVatDeclarationApprovalUseCase,
    private readonly requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase: RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
    private readonly getTenantEcuadorTaxWithholdingRegistryUseCase: GetTenantEcuadorTaxWithholdingRegistryUseCase,
    private readonly getTenantEcuadorTaxPeriodEvidenceVaultUseCase: GetTenantEcuadorTaxPeriodEvidenceVaultUseCase,
    private readonly getTenantEcuadorTaxOperationalCloseoutUseCase: GetTenantEcuadorTaxOperationalCloseoutUseCase,
    private readonly getTenantEcuadorTaxFilingHandoffUseCase: GetTenantEcuadorTaxFilingHandoffUseCase,
    private readonly getTenantEcuadorTaxAnnexesReadinessUseCase: GetTenantEcuadorTaxAnnexesReadinessUseCase,
    private readonly requestTenantEcuadorTaxAccountingBridgePreviewUseCase: RequestTenantEcuadorTaxAccountingBridgePreviewUseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxPeriodCloseoutReportView> {
    const [
      salesBook,
      vatApproval,
      incomeTaxEvidence,
      withholdingRegistry,
      evidenceVault,
      operationalCloseout,
      filingHandoff,
      annexesReadiness,
      accountingBridgePreview,
      events,
    ] = await Promise.all([
      this.requestTenantEcuadorTaxSalesBookUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxVatDeclarationApprovalUseCase.execute(input),
      this.requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxWithholdingRegistryUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxPeriodEvidenceVaultUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxOperationalCloseoutUseCase.execute(input),
      this.getTenantEcuadorTaxFilingHandoffUseCase.execute(input),
      this.getTenantEcuadorTaxAnnexesReadinessUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxAccountingBridgePreviewUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        limit: 100,
      }),
    ]);
    const sections = [
      {
        key: 'sales_book',
        label: 'Libro de ventas',
        readinessStatus: salesBook.readinessStatus,
        summary: `${salesBook.documentRows.length} documentos de venta.`,
        blockerCount: salesBook.blockers.length,
        artifactCount: salesBook.documentRows.length,
      },
      {
        key: 'vat',
        label: 'IVA',
        readinessStatus:
          vatApproval.status === 'approved_for_external_filing'
            ? ('ready' as const)
            : ('needs_review' as const),
        summary: `Aprobacion IVA: ${vatApproval.status}.`,
        blockerCount: vatApproval.blockers.length,
        artifactCount: vatApproval.draft.declarationSections.length,
      },
      {
        key: 'income_tax',
        label: 'Renta',
        readinessStatus: incomeTaxEvidence.readinessStatus,
        summary: `${incomeTaxEvidence.estimatedTaxableBaseByCurrency.length} bases estimadas.`,
        blockerCount: incomeTaxEvidence.blockers.length,
        artifactCount: incomeTaxEvidence.supportChecklist.length,
      },
      {
        key: 'withholding',
        label: 'Retenciones',
        readinessStatus: withholdingRegistry.readinessStatus,
        summary: `${withholdingRegistry.rows.length} filas de retencion.`,
        blockerCount: withholdingRegistry.blockers.length,
        artifactCount: withholdingRegistry.rows.length,
      },
      {
        key: 'annexes',
        label: 'Anexos',
        readinessStatus: annexesReadiness.readinessStatus,
        summary: `${annexesReadiness.annexes.filter((annex) => annex.applies).length} anexos aplicables.`,
        blockerCount: annexesReadiness.blockers.length,
        artifactCount: annexesReadiness.annexes.length,
      },
      {
        key: 'evidence_vault',
        label: 'Carpeta fiscal',
        readinessStatus: evidenceVault.readinessStatus,
        summary: `${evidenceVault.folders.length} carpetas de evidencia.`,
        blockerCount: evidenceVault.missingItems.length,
        artifactCount: evidenceVault.folders.reduce(
          (total, folder) => total + folder.artifactCount,
          0,
        ),
      },
      {
        key: 'accounting_bridge',
        label: 'Preview contable',
        readinessStatus: accountingBridgePreview.readinessStatus,
        summary: `${accountingBridgePreview.summary.entryCount} entradas preliminares.`,
        blockerCount: accountingBridgePreview.blockers.length,
        artifactCount: accountingBridgePreview.entries.length,
      },
    ];
    const blockers = [
      ...salesBook.blockers,
      ...vatApproval.blockers,
      ...incomeTaxEvidence.blockers,
      ...withholdingRegistry.blockers,
      ...annexesReadiness.blockers,
      ...evidenceVault.missingItems,
      ...operationalCloseout.blockers,
      ...filingHandoff.blockers,
      ...accountingBridgePreview.blockers,
    ];
    const readinessStatus = resolveReadinessStatus(
      sections.map((section) => section.readinessStatus),
      blockers,
    );
    const view: EcuadorTaxPeriodCloseoutReportView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      sections,
      totals: {
        salesDocuments: salesBook.documentRows.length,
        purchaseDocuments: evidenceVault.exportedSummary.purchaseDocuments,
        withholdingCandidates: withholdingRegistry.rows.length,
        annexesApplicable: annexesReadiness.annexes.filter(
          (annex) => annex.applies,
        ).length,
        accountingPreviewEntries: accountingBridgePreview.summary.entryCount,
        auditEventCount: events.length,
      },
      filingHandoffStatus: filingHandoff.status,
      closeoutStatus: operationalCloseout.status,
      blockers: [...new Set(blockers)],
      accountantQuestions: [
        ...vatApproval.draft.accountantQuestions,
        ...incomeTaxEvidence.accountantQuestions,
        'El reporte contiene toda la evidencia que debe conservarse del periodo?',
      ],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver blockers antes de considerar completo el reporte.'
          : 'Guardar reporte de periodo como salida operacional para contador/auditoria.',
      guardrails: [
        'Reporte operacional; no es libro contable oficial ni formulario SRI.',
        'Debe conservarse junto a soportes externos de declaracion, pago y anexos.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_period_closeout_report_requested',
        source: 'tax_period_closeout_report',
        payload: {
          readinessStatus,
          sectionCount: sections.length,
          blockerCount: view.blockers.length,
          totals: view.totals,
        },
      });
    }

    return view;
  }
}

function resolveReadinessStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
