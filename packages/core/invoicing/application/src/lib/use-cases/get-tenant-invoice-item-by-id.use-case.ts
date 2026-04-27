import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { InvoiceItem } from '@saas-platform/invoicing-domain';
import { InvoiceItemNotFoundError } from '../errors/invoice-item-not-found.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { InvoiceItemRepository } from '../ports/invoice-item.repository';
import { InvoiceRepository } from '../ports/invoice.repository';

export class GetTenantInvoiceItemByIdUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
  ) {}

  async execute(
    tenantSlug: string,
    invoiceId: string,
    itemId: string,
  ): Promise<InvoiceItem> {
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

    const item = await this.invoiceItemRepository.findByTenantIdInvoiceIdAndId(
      tenant.id,
      invoice.id,
      itemId,
    );

    if (!item) {
      throw new InvoiceItemNotFoundError(tenantSlug, itemId);
    }

    return item;
  }
}
