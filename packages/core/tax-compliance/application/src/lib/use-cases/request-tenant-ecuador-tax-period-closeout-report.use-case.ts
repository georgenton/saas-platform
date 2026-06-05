import {
  EcuadorTaxPeriodCloseoutReportView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAnnexesReadinessUseCase } from './get-tenant-ecuador-tax-annexes-readiness.use-case';
import { GetTenantEcuadorTaxAccountingBridgeMappingUseCase } from './get-tenant-ecuador-tax-accounting-bridge-mapping.use-case';
import { GetTenantEcuadorTaxDeclarationFormCatalogUseCase } from './get-tenant-ecuador-tax-declaration-form-catalog.use-case';
import { GetTenantEcuadorTaxFilingHandoffUseCase } from './get-tenant-ecuador-tax-filing-handoff.use-case';
import { GetTenantEcuadorTaxOperationalCloseoutUseCase } from './get-tenant-ecuador-tax-operational-closeout.use-case';
import { GetTenantEcuadorTaxPeriodEvidenceVaultUseCase } from './get-tenant-ecuador-tax-period-evidence-vault.use-case';
import { GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-sri-fiscal-evidence-workspace.use-case';
import { GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase } from './get-tenant-ecuador-tax-sri-platform-reconciliation-workspace.use-case';
import { GetTenantEcuadorTaxVatDeclarationApprovalUseCase } from './get-tenant-ecuador-tax-vat-declaration-approval.use-case';
import { GetTenantEcuadorTaxWithholdingRegistryUseCase } from './get-tenant-ecuador-tax-withholding-registry.use-case';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxDeclarationArtifactExportUseCase } from './request-tenant-ecuador-tax-declaration-artifact-export.use-case';
import { RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase } from './request-tenant-ecuador-tax-declaration-form-draft-packet.use-case';
import { RequestTenantEcuadorTaxFilingGuidePacketUseCase } from './request-tenant-ecuador-tax-filing-guide-packet.use-case';
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
    private readonly getTenantEcuadorTaxAccountingBridgeMappingUseCase: GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
    private readonly getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase: GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
    private readonly getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase: GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
    private readonly getTenantEcuadorTaxDeclarationFormCatalogUseCase: GetTenantEcuadorTaxDeclarationFormCatalogUseCase,
    private readonly requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase: RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
    private readonly requestTenantEcuadorTaxFilingGuidePacketUseCase: RequestTenantEcuadorTaxFilingGuidePacketUseCase,
    private readonly requestTenantEcuadorTaxDeclarationArtifactExportUseCase: RequestTenantEcuadorTaxDeclarationArtifactExportUseCase,
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
      accountingBridgeMapping,
      sriEvidenceWorkspace,
      sriPlatformReconciliation,
      declarationFormCatalog,
      declarationFormDraftPacket,
      filingGuidePacket,
      declarationArtifactExport,
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
      this.getTenantEcuadorTaxAccountingBridgeMappingUseCase.execute(input),
      this.getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase.execute(
        {
          ...input,
          recordEvent: false,
        },
      ),
      this.getTenantEcuadorTaxDeclarationFormCatalogUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase.execute({
        ...input,
        formKey: 'iva',
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxFilingGuidePacketUseCase.execute({
        ...input,
        formKey: 'iva',
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxDeclarationArtifactExportUseCase.execute({
        ...input,
        formKey: 'iva',
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
        label: 'Mapping contable',
        readinessStatus: accountingBridgeMapping.readinessStatus,
        summary: `${accountingBridgeMapping.summary.mappedHintCount}/${accountingBridgeMapping.summary.hintCount} hints mapeados.`,
        blockerCount:
          accountingBridgeMapping.blockers.length +
          accountingBridgeMapping.summary.unmappedHintCount,
        artifactCount: accountingBridgeMapping.rows.length,
      },
      {
        key: 'sri_evidence',
        label: 'Evidencia SRI',
        readinessStatus: sriEvidenceWorkspace.readinessStatus,
        summary: `${sriEvidenceWorkspace.summary.totalVouchers} comprobantes SRI importados.`,
        blockerCount: sriEvidenceWorkspace.blockers.length,
        artifactCount: sriEvidenceWorkspace.voucherRows.length,
      },
      {
        key: 'sri_platform_reconciliation',
        label: 'Reconciliacion SRI vs plataforma',
        readinessStatus: sriPlatformReconciliation.readinessStatus,
        summary: `${sriPlatformReconciliation.issueSummary.totalIssues} diferencias detectadas.`,
        blockerCount: sriPlatformReconciliation.issueSummary.blockingIssues,
        artifactCount: sriPlatformReconciliation.issues.length,
      },
      {
        key: 'declaration_forms',
        label: 'Formularios',
        readinessStatus: declarationFormCatalog.readinessStatus,
        summary: `${declarationFormCatalog.forms.length} formularios catalogados para el contribuyente.`,
        blockerCount: declarationFormCatalog.forms.reduce(
          (total, form) => total + form.blockers.length,
          0,
        ),
        artifactCount: declarationFormCatalog.forms.length,
      },
      {
        key: 'declaration_draft',
        label: 'Borrador IVA',
        readinessStatus: declarationFormDraftPacket.readinessStatus,
        summary: `${declarationFormDraftPacket.suggestedBoxes.length} casilleros sugeridos.`,
        blockerCount: declarationFormDraftPacket.blockers.length,
        artifactCount: declarationFormDraftPacket.suggestedBoxes.length,
      },
      {
        key: 'filing_guide',
        label: 'Guia de presentacion',
        readinessStatus: filingGuidePacket.readinessStatus,
        summary: `${filingGuidePacket.steps.length} pasos guiados manuales.`,
        blockerCount: filingGuidePacket.blockedCapabilities.length,
        artifactCount: filingGuidePacket.steps.length,
      },
      {
        key: 'artifact_export',
        label: 'Export asistido',
        readinessStatus: declarationArtifactExport.readinessStatus,
        summary: `${declarationArtifactExport.artifacts.length} artefactos de soporte.`,
        blockerCount: declarationArtifactExport.blockedCapabilities.length,
        artifactCount: declarationArtifactExport.artifacts.length,
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
      ...accountingBridgeMapping.blockers,
      ...sriEvidenceWorkspace.blockers,
      ...sriPlatformReconciliation.issues
        .filter((issue) => issue.severity === 'blocking')
        .map((issue) => issue.key),
      ...declarationFormCatalog.forms.flatMap((form) => form.blockers),
      ...declarationFormDraftPacket.blockers,
      ...filingGuidePacket.blockedCapabilities,
      ...declarationArtifactExport.blockedCapabilities,
      ...Array.from(
        { length: accountingBridgeMapping.summary.unmappedHintCount },
        (_, index) => `accounting_bridge.unmapped_hint_${index + 1}`,
      ),
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
        accountingPreviewEntries:
          accountingBridgeMapping.summary.previewEntryCount,
        accountingMappedHints: accountingBridgeMapping.summary.mappedHintCount,
        accountingUnmappedHints:
          accountingBridgeMapping.summary.unmappedHintCount,
        sriImportedVouchers: sriEvidenceWorkspace.summary.totalVouchers,
        sriReconciliationIssues:
          sriPlatformReconciliation.issueSummary.totalIssues,
        declarationForms: declarationFormCatalog.forms.length,
        declarationDraftBoxes: declarationFormDraftPacket.suggestedBoxes.length,
        filingGuideSteps: filingGuidePacket.steps.length,
        declarationArtifacts: declarationArtifactExport.artifacts.length,
        auditEventCount: events.length,
      },
      filingHandoffStatus: filingHandoff.status,
      closeoutStatus: operationalCloseout.status,
      blockers: [...new Set(blockers)],
      accountantQuestions: [
        ...vatApproval.draft.accountantQuestions,
        ...incomeTaxEvidence.accountantQuestions,
        ...declarationFormDraftPacket.accountantReview.suggestedQuestions,
        ...filingGuidePacket.accountantQuestions,
        accountingBridgeMapping.summary.unmappedHintCount > 0
          ? 'Que cuentas contables deben asignarse a los hints tributarios pendientes?'
          : 'El mapping contable tributario es suficiente para el cierre del periodo?',
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
