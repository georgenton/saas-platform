import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { InvoiceItemRepository } from '../ports/invoice-item.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import { PaymentRepository } from '../ports/payment.repository';
import {
  calculateInvoiceSettlement,
  calculateInvoiceTotals,
  InvoiceDetailView,
} from '../types/invoice-view';

export class GetTenantInvoiceDetailUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(tenantSlug: string, invoiceId: string): Promise<InvoiceDetailView> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const invoice = await this.invoiceRepository.findByTenantIdAndId(
      tenant.id,
      invoiceId,
    );

    if (!invoice) {
      throw new InvoiceNotFoundError(tenantSlug, invoiceId);
    }

    const items = await this.invoiceItemRepository.findByTenantIdAndInvoiceId(
      tenant.id,
      invoice.id,
    );
    const payments = await this.paymentRepository.findByTenantIdAndInvoiceId(
      tenant.id,
      invoice.id,
    );
    const totals = calculateInvoiceTotals(items);

    return {
      invoice,
      items,
      payments,
      totals,
      settlement: calculateInvoiceSettlement(totals.totalInCents, payments),
    };
  }
}
