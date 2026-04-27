import { Invoice } from '@saas-platform/invoicing-domain';

export interface InvoiceRepository {
  save(invoice: Invoice): Promise<void>;
  findByTenantId(tenantId: string): Promise<Invoice[]>;
  findByTenantIdAndId(tenantId: string, invoiceId: string): Promise<Invoice | null>;
}
