import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxWithholdingEvidencePacketView,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxObligationCalendarUseCase } from './get-tenant-ecuador-tax-obligation-calendar.use-case';
import { GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-purchase-expense-evidence-workspace.use-case';
import { GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase } from './get-tenant-ecuador-tax-supplier-fiscal-readiness-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxSalesBookUseCase } from './request-tenant-ecuador-tax-sales-book.use-case';

export class RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxSalesBookUseCase: RequestTenantEcuadorTaxSalesBookUseCase,
    private readonly getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase: GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
    private readonly getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase: GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
    private readonly getTenantEcuadorTaxObligationCalendarUseCase: GetTenantEcuadorTaxObligationCalendarUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxWithholdingEvidencePacketView> {
    const [salesBook, purchaseEvidence, supplierReadiness, calendar] =
      await Promise.all([
        this.requestTenantEcuadorTaxSalesBookUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase.execute(
          {
            ...input,
            recordEvent: false,
          },
        ),
        this.getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase.execute(
          {
            ...input,
            recordEvent: false,
          },
        ),
        this.getTenantEcuadorTaxObligationCalendarUseCase.execute(
          input.tenantSlug,
          input.year,
        ),
      ]);
    const withholdingObligation =
      calendar.entries.find(
        (entry) =>
          entry.obligationKey === 'withholding' &&
          (entry.period === input.period ||
            input.period.startsWith(entry.period)),
      ) ?? null;
    const salesCandidates = salesBook.documentRows
      .filter((row) => row.totalInCents > 0)
      .map((row) => ({
        invoiceId: row.invoiceId,
        number: row.number,
        buyerName: row.buyerName,
        buyerIdentification: row.buyerIdentification,
        currency: row.currency,
        taxableBaseInCents: row.subtotalInCents,
        vatInCents: row.taxInCents,
        candidateReason: 'sale_document_may_have_received_withholding',
      }));
    const purchaseCandidates = purchaseEvidence.documentRows
      .filter((row) => row.totalInCents > 0)
      .map((row) => ({
        evidenceId: row.evidenceId,
        supplierName: row.supplierName,
        supplierTaxpayerId: row.supplierTaxpayerId,
        currency: row.currency,
        taxableBaseInCents: row.subtotalInCents,
        vatInCents: row.vatInCents,
        category: row.category,
        candidateReason: 'purchase_document_may_require_withholding',
      }));
    const blockers = [
      ...purchaseEvidence.blockers,
      ...supplierReadiness.blockers,
      ...(withholdingObligation?.readinessStatus === 'blocked'
        ? ['withholding_obligation.calendar_blocked']
        : []),
      ...(withholdingObligation
        ? []
        : ['withholding_obligation.not_scheduled']),
      ...(salesCandidates.length + purchaseCandidates.length === 0
        ? ['withholding_evidence.no_candidates']
        : []),
    ];
    const readinessStatus = resolveReadinessStatus({
      blockers,
      purchaseStatus: purchaseEvidence.readinessStatus,
      supplierStatus: supplierReadiness.readinessStatus,
    });
    const view: EcuadorTaxWithholdingEvidencePacketView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      withholdingObligation,
      salesCandidates,
      purchaseCandidates,
      blockers: [...new Set(blockers)],
      accountantQuestions: [
        'Que ventas del periodo recibieron retencion y deben cruzarse con comprobantes?',
        'Que compras requieren emision o registro de retencion segun proveedor y concepto?',
        'Existen porcentajes o codigos de retencion especiales por regimen o tipo de proveedor?',
      ],
      supportChecklist: [
        'Ventas autorizadas del periodo.',
        'Compras/gastos con proveedor fiscal completo.',
        'Comprobantes de retencion recibidos y emitidos.',
        'Revision de porcentajes/codigos por contador antes de emitir documentos oficiales.',
      ],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Completar proveedores, compras y calendario antes de preparar retenciones.'
          : 'Enviar candidatos de retencion al contador para validacion de codigos y porcentajes.',
      guardrails: [
        'Este packet no emite comprobantes de retencion ni presenta anexos.',
        'Codigos, porcentajes y obligatoriedad de retencion requieren validacion profesional.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'withholding_evidence_packet_requested',
        source: 'withholding_evidence_packet',
        payload: {
          readinessStatus,
          salesCandidateCount: salesCandidates.length,
          purchaseCandidateCount: purchaseCandidates.length,
          blockerCount: view.blockers.length,
        },
      });
    }

    return view;
  }
}

function resolveReadinessStatus(input: {
  blockers: string[];
  purchaseStatus: EcuadorTaxReadinessStatus;
  supplierStatus: EcuadorTaxReadinessStatus;
}): EcuadorTaxReadinessStatus {
  if (
    input.blockers.length > 0 ||
    input.purchaseStatus === 'blocked' ||
    input.supplierStatus === 'blocked'
  ) {
    return 'blocked';
  }

  if (
    input.purchaseStatus === 'needs_review' ||
    input.supplierStatus === 'needs_review'
  ) {
    return 'needs_review';
  }

  return 'ready';
}
