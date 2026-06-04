import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxReconciliationCheckView,
  EcuadorTaxReconciliationStatus,
  EcuadorTaxReconciliationWorkspaceView,
} from '@saas-platform/tax-compliance-domain';
import { ListTenantEcuadorTaxAccountantReviewsUseCase } from './list-tenant-ecuador-tax-accountant-reviews.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxPeriodPreparationPacketUseCase } from './request-tenant-ecuador-tax-period-preparation-packet.use-case';
import { RequestTenantEcuadorTaxSalesBookUseCase } from './request-tenant-ecuador-tax-sales-book.use-case';

export class GetTenantEcuadorTaxReconciliationWorkspaceUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxSalesBookUseCase: RequestTenantEcuadorTaxSalesBookUseCase,
    private readonly requestTenantEcuadorTaxPeriodPreparationPacketUseCase: RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
    private readonly listTenantEcuadorTaxAccountantReviewsUseCase: ListTenantEcuadorTaxAccountantReviewsUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxReconciliationWorkspaceView> {
    const [salesBook, preparationPacket, accountantReviews] = await Promise.all([
      this.requestTenantEcuadorTaxSalesBookUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxPeriodPreparationPacketUseCase.execute(
        input.tenantSlug,
        input.period,
      ),
      this.listTenantEcuadorTaxAccountantReviewsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
      }),
    ]);
    const checks = buildChecks({
      salesBook,
      parties: preparationPacket.evidenceSummary.parties,
      accountantReviewStatus: accountantReviews[0]?.status ?? null,
    });
    const blockers = [...new Set(checks.flatMap((check) => check.blockers))];
    const status = resolveReconciliationStatus(checks);
    const reviewNotes = [
      `${salesBook.documentRows.length} documentos tributarios y ${salesBook.ecommerceEvidence.orderCount} ordenes ecommerce cruzadas para ${input.period}.`,
      accountantReviews.length === 0
        ? 'No existe revision de contador registrada para este periodo.'
        : `Ultima revision de contador: ${accountantReviews[0].status}.`,
      preparationPacket.evidenceSummary.parties.needsReviewParties > 0
        ? `${preparationPacket.evidenceSummary.parties.needsReviewParties} terceros requieren completar datos fiscales.`
        : null,
    ].filter((note): note is string => note !== null);

    const view: EcuadorTaxReconciliationWorkspaceView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      status,
      salesBook,
      ecommerceEvidence: salesBook.ecommerceEvidence,
      accountantReviews,
      checks,
      blockers,
      reviewNotes,
      nextStep:
        status === 'blocked'
          ? 'Resolver diferencias bloqueantes antes de preparar IVA o cierre del periodo.'
          : status === 'needs_review'
            ? 'Revisar diferencias operativas con contador antes de marcar el periodo conciliado.'
            : 'Usar conciliacion como soporte del packet IVA y del closeout del periodo.',
      guardrails: [
        'La conciliacion compara evidencia operacional y tributaria; no reemplaza revision contable.',
        'No confirma presentacion ni pago ante SRI.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_reconciliation_reviewed',
        source: 'tax_reconciliation_workspace',
        payload: {
          status,
          checkCount: checks.length,
          blockerCount: blockers.length,
          documentCount: salesBook.documentRows.length,
          ecommerceOrderCount: salesBook.ecommerceEvidence.orderCount,
        },
      });
    }

    return view;
  }
}

function buildChecks(input: {
  salesBook: EcuadorTaxReconciliationWorkspaceView['salesBook'];
  parties: {
    needsReviewParties: number;
    incompletePartyIds: string[];
  };
  accountantReviewStatus: string | null;
}): EcuadorTaxReconciliationCheckView[] {
  const unauthorizedInvoices = input.salesBook.documentRows
    .filter((row) => row.electronicStatus !== 'authorized')
    .map((row) => `invoice.${row.invoiceId}.electronic_status_${row.electronicStatus ?? 'missing'}`);
  const ecommerceFiscalBlockers =
    input.salesBook.ecommerceEvidence.needsFiscalDataCount > 0
      ? ['ecommerce_evidence.needs_fiscal_data']
      : [];
  const ecommerceDisputeBlockers =
    input.salesBook.ecommerceEvidence.disputedPaymentEventCount > 0
      ? ['ecommerce_evidence.payment_disputes_open']
      : [];
  const partyBlockers =
    input.parties.needsReviewParties > 0
      ? input.parties.incompletePartyIds.map((partyId) => `party.${partyId}.fiscal_data_incomplete`)
      : [];
  const readyToInvoiceWithoutDocuments =
    input.salesBook.ecommerceEvidence.readyToInvoiceCount >
    input.salesBook.documentRows.length
      ? [
          `ecommerce_evidence.ready_to_invoice_without_tax_document:${
            input.salesBook.ecommerceEvidence.readyToInvoiceCount -
            input.salesBook.documentRows.length
          }`,
        ]
      : [];
  const accountantReviewNeedsReview = input.accountantReviewStatus !== 'approved';

  return [
    buildCheck({
      key: 'sales_book_authorization',
      source: 'invoicing',
      blockers: unauthorizedInvoices,
      summary:
        unauthorizedInvoices.length === 0
          ? 'Todos los documentos del libro tienen autorizacion electronica.'
          : `${unauthorizedInvoices.length} documentos no estan autorizados.`,
    }),
    buildCheck({
      key: 'ecommerce_ready_to_invoice',
      source: 'ecommerce',
      blockers: readyToInvoiceWithoutDocuments,
      summary:
        readyToInvoiceWithoutDocuments.length === 0
          ? 'Ordenes ecommerce listas para facturar estan cubiertas por el libro de ventas disponible.'
          : 'Hay ordenes ecommerce listas para facturar sin documento tributario comparable.',
    }),
    buildCheck({
      key: 'third_party_fiscal_data',
      source: 'parties',
      blockers: partyBlockers,
      summary:
        partyBlockers.length === 0
          ? 'Terceros del periodo no reportan datos fiscales incompletos.'
          : `${partyBlockers.length} terceros requieren completar datos fiscales.`,
    }),
    buildCheck({
      key: 'ecommerce_fiscal_readiness',
      source: 'ecommerce',
      blockers: ecommerceFiscalBlockers,
      summary:
        ecommerceFiscalBlockers.length === 0
          ? 'Ecommerce no reporta ordenes pendientes por datos fiscales.'
          : 'Ecommerce reporta ordenes pendientes por datos fiscales.',
    }),
    buildCheck({
      key: 'payment_disputes',
      source: 'ecommerce',
      blockers: ecommerceDisputeBlockers,
      summary:
        ecommerceDisputeBlockers.length === 0
          ? 'No hay disputas de pago abiertas en la evidencia ecommerce.'
          : 'Hay disputas de pago abiertas que requieren conciliacion humana.',
    }),
    buildCheck({
      key: 'accountant_review',
      source: 'accountant_review',
      blockers: [],
      summary:
        !accountantReviewNeedsReview
          ? 'La ultima revision de contador esta aprobada.'
          : 'Falta aprobacion de contador para cerrar la conciliacion.',
      readinessStatus: accountantReviewNeedsReview ? 'needs_review' : 'ready',
    }),
  ];
}

function buildCheck(input: {
  key: string;
  source: string;
  blockers: string[];
  summary: string;
  readinessStatus?: EcuadorTaxReadinessStatus;
}): EcuadorTaxReconciliationCheckView {
  return {
    key: input.key,
    source: input.source,
    readinessStatus:
      input.readinessStatus ??
      (input.blockers.length > 0 ? 'blocked' : 'ready'),
    summary: input.summary,
    blockers: input.blockers,
  };
}

function resolveReconciliationStatus(
  checks: EcuadorTaxReconciliationCheckView[],
): EcuadorTaxReconciliationStatus {
  if (checks.some((check) => check.readinessStatus === 'blocked')) {
    return 'blocked';
  }

  if (checks.some((check) => check.readinessStatus === 'needs_review')) {
    return 'needs_review';
  }

  return 'reconciled';
}
