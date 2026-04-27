import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Invoice } from '@saas-platform/invoicing-domain';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { InvoiceRepository } from '../ports/invoice.repository';

export class GetTenantInvoiceByIdUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(tenantSlug: string, invoiceId: string): Promise<Invoice> {
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

    return invoice;
  }
}
