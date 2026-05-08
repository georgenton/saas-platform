import { InvoiceNumberingSettings } from '@saas-platform/invoicing-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { InvoiceNumberingSettingsNotFoundError } from '../errors/invoice-numbering-settings-not-found.error';
import { InvoiceNumberingSettingsRepository } from '../ports/invoice-numbering-settings.repository';

export class GetTenantInvoiceNumberingSettingsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceNumberingSettingsRepository: InvoiceNumberingSettingsRepository,
  ) {}

  async execute(
    tenantSlug: string,
    documentCode = '01',
  ): Promise<InvoiceNumberingSettings> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const settings =
      await this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        documentCode,
      );

    if (!settings) {
      throw new InvoiceNumberingSettingsNotFoundError(tenantSlug, documentCode);
    }

    return settings;
  }
}
