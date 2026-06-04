import {
  EcuadorTaxPeriodEvidenceVaultView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantWorkbenchUseCase } from './get-tenant-ecuador-tax-accountant-workbench.use-case';
import { GetTenantEcuadorTaxAuditReadinessUseCase } from './get-tenant-ecuador-tax-audit-readiness.use-case';
import { GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-purchase-expense-evidence-workspace.use-case';
import { ListTenantEcuadorTaxAccountantReviewsUseCase } from './list-tenant-ecuador-tax-accountant-reviews.use-case';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxPeriodCloseoutPacketUseCase } from './request-tenant-ecuador-tax-period-closeout-packet.use-case';
import { RequestTenantEcuadorTaxSalesBookUseCase } from './request-tenant-ecuador-tax-sales-book.use-case';
import { RequestTenantEcuadorTaxVatDeclarationDraftUseCase } from './request-tenant-ecuador-tax-vat-declaration-draft.use-case';
import { RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase } from './request-tenant-ecuador-tax-withholding-evidence-packet.use-case';

export class GetTenantEcuadorTaxPeriodEvidenceVaultUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxSalesBookUseCase: RequestTenantEcuadorTaxSalesBookUseCase,
    private readonly getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase: GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
    private readonly requestTenantEcuadorTaxWithholdingEvidencePacketUseCase: RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
    private readonly requestTenantEcuadorTaxVatDeclarationDraftUseCase: RequestTenantEcuadorTaxVatDeclarationDraftUseCase,
    private readonly getTenantEcuadorTaxAccountantWorkbenchUseCase: GetTenantEcuadorTaxAccountantWorkbenchUseCase,
    private readonly requestTenantEcuadorTaxPeriodCloseoutPacketUseCase: RequestTenantEcuadorTaxPeriodCloseoutPacketUseCase,
    private readonly getTenantEcuadorTaxAuditReadinessUseCase: GetTenantEcuadorTaxAuditReadinessUseCase,
    private readonly listTenantEcuadorTaxAccountantReviewsUseCase: ListTenantEcuadorTaxAccountantReviewsUseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxPeriodEvidenceVaultView> {
    const [
      salesBook,
      purchaseWorkspace,
      withholdingPacket,
      vatDraft,
      accountantWorkbench,
      closeoutPacket,
      auditReadiness,
      accountantReviews,
      events,
    ] = await Promise.all([
      this.requestTenantEcuadorTaxSalesBookUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxWithholdingEvidencePacketUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxVatDeclarationDraftUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxAccountantWorkbenchUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxPeriodCloseoutPacketUseCase.execute(input),
      this.getTenantEcuadorTaxAuditReadinessUseCase.execute(input),
      this.listTenantEcuadorTaxAccountantReviewsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
      }),
      this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        limit: 100,
      }),
    ]);
    const folders: EcuadorTaxPeriodEvidenceVaultView['folders'] = [
      {
        key: 'sales_book',
        label: 'Libro de ventas',
        readinessStatus: salesBook.readinessStatus,
        artifactCount: salesBook.documentRows.length,
        missingItems: salesBook.blockers,
        nextStep: salesBook.nextStep,
      },
      {
        key: 'purchase_evidence',
        label: 'Compras y gastos',
        readinessStatus: purchaseWorkspace.readinessStatus,
        artifactCount: purchaseWorkspace.documentRows.length,
        missingItems: purchaseWorkspace.blockers,
        nextStep: purchaseWorkspace.nextStep,
      },
      {
        key: 'withholdings',
        label: 'Retenciones',
        readinessStatus: withholdingPacket.readinessStatus,
        artifactCount:
          withholdingPacket.salesCandidates.length +
          withholdingPacket.purchaseCandidates.length,
        missingItems: withholdingPacket.blockers,
        nextStep: withholdingPacket.nextStep,
      },
      {
        key: 'vat_declaration',
        label: 'Borrador IVA',
        readinessStatus: vatDraft.readinessStatus,
        artifactCount: vatDraft.declarationSections.length,
        missingItems: vatDraft.blockers,
        nextStep: vatDraft.nextStep,
      },
      {
        key: 'accountant_review',
        label: 'Revision contable',
        readinessStatus: accountantWorkbench.readinessStatus,
        artifactCount: accountantReviews.length,
        missingItems: accountantWorkbench.blockers,
        nextStep: accountantWorkbench.nextStep,
      },
      {
        key: 'closeout_audit',
        label: 'Closeout y auditoria',
        readinessStatus: mapCloseoutStatus(closeoutPacket.closeoutStatus),
        artifactCount: events.length,
        missingItems: auditReadiness.missingPersistence,
        nextStep: closeoutPacket.nextStep,
      },
    ];
    const missingItems = folders.flatMap((folder) => folder.missingItems);
    const readinessStatus = resolveVaultStatus(folders);
    const view: EcuadorTaxPeriodEvidenceVaultView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      folders,
      exportedSummary: {
        salesDocuments: salesBook.documentRows.length,
        purchaseDocuments: purchaseWorkspace.documentRows.length,
        withholdingCandidates:
          withholdingPacket.salesCandidates.length +
          withholdingPacket.purchaseCandidates.length,
        accountantReviews: accountantReviews.length,
        auditEventCount: events.length,
      },
      missingItems: [...new Set(missingItems)],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Completar carpetas bloqueadas antes de exportar evidencia al contador.'
          : readinessStatus === 'needs_review'
            ? 'Enviar carpeta fiscal del periodo al contador para revision final.'
            : 'Carpeta fiscal lista para conservar como soporte operacional.',
      guardrails: [
        'Evidence vault agrupa evidencia operacional; no reemplaza archivo contable oficial.',
        'Exportar o compartir esta carpeta no implica declaracion presentada ni pago realizado.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'period_evidence_vault_reviewed',
        source: 'period_evidence_vault',
        payload: {
          readinessStatus,
          exportedSummary: view.exportedSummary,
          missingItemCount: view.missingItems.length,
        },
      });
    }

    return view;
  }
}

function resolveVaultStatus(
  folders: EcuadorTaxPeriodEvidenceVaultView['folders'],
): EcuadorTaxReadinessStatus {
  if (folders.some((folder) => folder.readinessStatus === 'blocked')) {
    return 'blocked';
  }

  if (folders.some((folder) => folder.readinessStatus === 'needs_review')) {
    return 'needs_review';
  }

  return 'ready';
}

function mapCloseoutStatus(status: string): EcuadorTaxReadinessStatus {
  if (status === 'blocked') {
    return 'blocked';
  }

  return status === 'ready_for_external_filing' ? 'ready' : 'needs_review';
}
