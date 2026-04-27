import { InvoiceItem } from '@saas-platform/invoicing-domain';

export interface InvoiceItemRepository {
  save(item: InvoiceItem): Promise<void>;
  findByTenantIdAndInvoiceId(
    tenantId: string,
    invoiceId: string,
  ): Promise<InvoiceItem[]>;
  findByTenantIdInvoiceIdAndId(
    tenantId: string,
    invoiceId: string,
    itemId: string,
  ): Promise<InvoiceItem | null>;
}
