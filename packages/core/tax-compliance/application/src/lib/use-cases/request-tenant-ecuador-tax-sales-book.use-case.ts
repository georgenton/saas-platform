import { InvoiceItemRepository, InvoiceRepository, PaymentRepository } from '@saas-platform/invoicing-application';
import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxSalesBookView,
} from '@saas-platform/tax-compliance-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase } from './get-tenant-ecuador-tax-ecommerce-evidence-summary.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class RequestTenantEcuadorTaxSalesBookUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly getTenantEcuadorTaxEcommerceEvidenceSummaryUseCase: GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxSalesBookView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const [invoices, ecommerceEvidence] = await Promise.all([
      this.invoiceRepository.findByTenantId(tenant.id),
      this.getTenantEcuadorTaxEcommerceEvidenceSummaryUseCase.execute({
        tenantSlug: tenant.slug,
        period: input.period,
      }),
    ]);
    const periodInvoices = invoices.filter(
      (invoice) => formatPeriod(invoice.issuedAt) === input.period,
    );

    const documentRows = await Promise.all(
      periodInvoices.map(async (invoice) => {
        const [items, payments] = await Promise.all([
          this.invoiceItemRepository.findByTenantIdAndInvoiceId(
            tenant.id,
            invoice.id,
          ),
          this.paymentRepository.findByTenantIdAndInvoiceId(tenant.id, invoice.id),
        ]);
        const subtotalInCents = items.reduce(
          (total, item) => total + item.lineTotalInCents,
          0,
        );
        const taxInCents = items.reduce(
          (total, item) => total + item.lineTaxInCents,
          0,
        );
        const totalInCents = subtotalInCents + taxInCents;
        const paidInCents = payments
          .filter((payment) => payment.status === 'posted')
          .reduce((total, payment) => total + payment.amountInCents, 0);
        const blockers = [
          invoice.electronicStatus !== 'authorized'
            ? `invoice.${invoice.id}.electronic_status_${invoice.electronicStatus ?? 'missing'}`
            : null,
          items.length === 0 ? `invoice.${invoice.id}.items_empty` : null,
          !invoice.buyerIdentification
            ? `invoice.${invoice.id}.buyer_identification_missing`
            : null,
        ].filter((blocker): blocker is string => blocker !== null);

        return {
          invoiceId: invoice.id,
          number: invoice.number,
          documentCode: invoice.documentCode,
          status: invoice.status,
          electronicStatus: invoice.electronicStatus,
          issuedAt: invoice.issuedAt,
          currency: invoice.currency,
          subtotalInCents,
          taxInCents,
          totalInCents,
          paidInCents,
          outstandingTotalInCents: Math.max(totalInCents - paidInCents, 0),
          customerId: invoice.customerId,
          buyerIdentification: invoice.buyerIdentification,
          buyerName: invoice.buyerName,
          blockers,
        };
      }),
    );
    const blockers = [
      ...documentRows.flatMap((row) => row.blockers),
      ...(ecommerceEvidence.needsFiscalDataCount > 0
        ? ['ecommerce_evidence.needs_fiscal_data']
        : []),
      ...(ecommerceEvidence.disputedPaymentEventCount > 0
        ? ['ecommerce_evidence.payment_disputes_open']
        : []),
    ];
    const readinessStatus = resolveReadinessStatus({
      blockers,
      ecommerceStatus: ecommerceEvidence.status,
      documentCount: documentRows.length,
    });
    const totalsByCurrency = Array.from(
      documentRows.reduce((totals, row) => {
        const current = totals.get(row.currency) ?? {
          currency: row.currency,
          documentCount: 0,
          subtotalInCents: 0,
          taxInCents: 0,
          totalInCents: 0,
          paidInCents: 0,
          outstandingTotalInCents: 0,
        };
        current.documentCount += 1;
        current.subtotalInCents += row.subtotalInCents;
        current.taxInCents += row.taxInCents;
        current.totalInCents += row.totalInCents;
        current.paidInCents += row.paidInCents;
        current.outstandingTotalInCents += row.outstandingTotalInCents;
        totals.set(row.currency, current);
        return totals;
      }, new Map<string, EcuadorTaxSalesBookView['totalsByCurrency'][number]>()),
      ([, total]) => total,
    );
    const view: EcuadorTaxSalesBookView = {
      tenantSlug: tenant.slug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      source: 'invoicing_and_ecommerce_operational_evidence',
      readinessStatus,
      totalsByCurrency,
      documentRows,
      ecommerceEvidence,
      blockers: [...new Set(blockers)],
      reviewNotes: buildReviewNotes(documentRows.length, ecommerceEvidence.status),
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver blockers del libro de ventas antes de preparar declaracion.'
          : readinessStatus === 'needs_review'
            ? 'Revisar libro de ventas con contador y contrastar ecommerce operativo.'
            : 'Usar libro de ventas como evidencia del periodo antes de aprobacion humana.',
      guardrails: [
        'Este libro tributario es derivado y operativo; no reemplaza libros contables oficiales.',
        'Los montos ecommerce se mantienen como evidencia operacional hasta normalizar precios y documentos tributarios.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: tenant.slug,
        period: input.period,
        year: input.year,
        eventType: 'tax_sales_book_generated',
        source: 'tax_sales_book',
        payload: {
          documentCount: documentRows.length,
          readinessStatus,
          blockerCount: view.blockers.length,
          ecommerceOrderCount: ecommerceEvidence.orderCount,
        },
      });
    }

    return view;
  }
}

function formatPeriod(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(
    2,
    '0',
  )}`;
}

function resolveReadinessStatus(input: {
  blockers: string[];
  ecommerceStatus: string;
  documentCount: number;
}): EcuadorTaxReadinessStatus {
  if (input.blockers.length > 0 || input.documentCount === 0) {
    return 'blocked';
  }

  return input.ecommerceStatus === 'requires_review' ? 'needs_review' : 'ready';
}

function buildReviewNotes(
  documentCount: number,
  ecommerceStatus: string,
): string[] {
  return [
    documentCount === 0
      ? 'No hay documentos de venta emitidos en el periodo.'
      : `${documentCount} documentos de venta alimentan el libro tributario.`,
    ecommerceStatus === 'requires_review'
      ? 'Ecommerce aporta señales operativas que requieren conciliacion humana.'
      : null,
  ].filter((note): note is string => note !== null);
}
