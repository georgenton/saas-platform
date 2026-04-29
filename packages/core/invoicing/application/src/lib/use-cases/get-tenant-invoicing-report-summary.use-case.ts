import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { CustomerRepository } from '../ports/customer.repository';
import { InvoiceItemRepository } from '../ports/invoice-item.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import { PaymentRepository } from '../ports/payment.repository';
import {
  buildInvoicingReportSummary,
  InvoicingReportSummaryView,
} from '../types/invoicing-report';

export class GetTenantInvoicingReportSummaryUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(tenantSlug: string): Promise<InvoicingReportSummaryView> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const [customers, invoices] = await Promise.all([
      this.customerRepository.findByTenantId(tenant.id),
      this.invoiceRepository.findByTenantId(tenant.id),
    ]);

    const itemsByInvoiceId = new Map<
      string,
      { lineTotalInCents: number; lineTaxInCents: number }[]
    >();
    const paymentsByInvoiceId = new Map<
      string,
      { amountInCents: number; status: 'posted' | 'reversed' }[]
    >();

    await Promise.all(
      invoices.map(async (invoice) => {
        const [items, payments] = await Promise.all([
          this.invoiceItemRepository.findByTenantIdAndInvoiceId(
            tenant.id,
            invoice.id,
          ),
          this.paymentRepository.findByTenantIdAndInvoiceId(tenant.id, invoice.id),
        ]);
        itemsByInvoiceId.set(
          invoice.id,
          items.map((item) => ({
            lineTotalInCents: item.lineTotalInCents,
            lineTaxInCents: item.lineTaxInCents,
          })),
        );
        paymentsByInvoiceId.set(
          invoice.id,
          payments.map((payment) => ({
            amountInCents: payment.amountInCents,
            status: payment.status,
          })),
        );
      }),
    );

    return buildInvoicingReportSummary({
      customerCount: customers.length,
      invoices,
      itemsByInvoiceId,
      paymentsByInvoiceId,
    });
  }
}
