import { InvoiceNumberingSettings } from '@saas-platform/invoicing-domain';

export interface InvoiceNumberingSettingsRepository {
  save(settings: InvoiceNumberingSettings): Promise<void>;
  findByTenantIdAndDocumentCode(
    tenantId: string,
    documentCode: string,
  ): Promise<InvoiceNumberingSettings | null>;
}
