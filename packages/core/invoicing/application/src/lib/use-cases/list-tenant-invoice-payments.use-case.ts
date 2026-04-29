import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Payment } from '@saas-platform/invoicing-domain';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { InvoiceRepository } from '../ports/invoice.repository';
import { PaymentRepository } from '../ports/payment.repository';

export class ListTenantInvoicePaymentsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(tenantSlug: string, invoiceId: string): Promise<Payment[]> {
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

    return this.paymentRepository.findByTenantIdAndInvoiceId(tenant.id, invoice.id);
  }
}
