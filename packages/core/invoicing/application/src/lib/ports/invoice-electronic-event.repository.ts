import { InvoiceElectronicEvent } from '@saas-platform/invoicing-domain';

export interface InvoiceElectronicEventRepository {
  save(event: InvoiceElectronicEvent): Promise<void>;
  findByTenantIdAndInvoiceId(
    tenantId: string,
    invoiceId: string,
  ): Promise<InvoiceElectronicEvent[]>;
  findLatestByTenantIdAndProvider(
    tenantId: string,
    provider: string,
    eventType?: InvoiceElectronicEvent['eventType'],
  ): Promise<InvoiceElectronicEvent | null>;
}
