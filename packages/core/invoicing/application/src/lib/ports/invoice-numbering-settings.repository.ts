import { InvoiceNumberingSettings } from '@saas-platform/invoicing-domain';

export interface InvoiceNumberingSettingsRepository {
  save(settings: InvoiceNumberingSettings): Promise<void>;
  findByTenantId(tenantId: string): Promise<InvoiceNumberingSettings | null>;
}
