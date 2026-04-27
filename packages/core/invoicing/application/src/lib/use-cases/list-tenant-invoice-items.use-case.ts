import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { InvoiceItem } from '@saas-platform/invoicing-domain';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { InvoiceItemRepository } from '../ports/invoice-item.repository';
import { InvoiceRepository } from '../ports/invoice.repository';

export class ListTenantInvoiceItemsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
  ) {}

  async execute(tenantSlug: string, invoiceId: string): Promise<InvoiceItem[]> {
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

    return this.invoiceItemRepository.findByTenantIdAndInvoiceId(
      tenant.id,
      invoice.id,
    );
  }
}
