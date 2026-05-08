import { InvoiceNumberingSettings } from '@saas-platform/invoicing-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { InvoiceNumberingSettingsRepository } from '../ports/invoice-numbering-settings.repository';

export interface UpsertTenantInvoiceNumberingSettingsInput {
  tenantSlug: string;
  documentCode: string;
  establishmentCode: string;
  emissionPointCode: string;
  nextSequenceNumber: number;
}

export class UpsertTenantInvoiceNumberingSettingsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceNumberingSettingsRepository: InvoiceNumberingSettingsRepository,
  ) {}

  async execute(
    input: UpsertTenantInvoiceNumberingSettingsInput,
  ): Promise<InvoiceNumberingSettings> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const now = new Date();
    const documentCode = input.documentCode.trim();
    const existingSettings =
      await this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        documentCode,
      );

    const settings = InvoiceNumberingSettings.create({
      id: existingSettings?.id ?? `${tenant.id}:invoice-numbering:${documentCode}`,
      tenantId: tenant.id,
      documentCode,
      establishmentCode: input.establishmentCode.trim(),
      emissionPointCode: input.emissionPointCode.trim(),
      nextSequenceNumber: input.nextSequenceNumber,
      createdAt: existingSettings?.createdAt ?? now,
      updatedAt: now,
    });

    await this.invoiceNumberingSettingsRepository.save(settings);

    return settings;
  }
}
