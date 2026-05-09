import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Invoice, InvoiceItem } from '@saas-platform/invoicing-domain';
import { InvalidWithholdingSourceInvoiceError } from '../errors/invalid-withholding-source-invoice.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { InvoiceNumberRequiredError } from '../errors/invoice-number-required.error';
import { TaxRateNotFoundError } from '../errors/tax-rate-not-found.error';
import { InvoiceIdGenerator } from '../ports/invoice-id.generator';
import { InvoiceItemIdGenerator } from '../ports/invoice-item-id.generator';
import { InvoiceItemRepository } from '../ports/invoice-item.repository';
import { InvoiceNumberingSettingsRepository } from '../ports/invoice-numbering-settings.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import { TaxRateRepository } from '../ports/tax-rate.repository';
import { formatEcuadorInvoiceNumber } from '../types/electronic-invoice';

const WITHHOLDING_DOCUMENT_CODE = '07';

export interface CreateTenantWithholdingInput {
  tenantSlug: string;
  sourceInvoiceId: string;
  reason: string;
  amountInCents: number;
  taxRateId?: string | null;
  number?: string;
  issuedAt?: Date;
  notes?: string | null;
}

export interface CreateTenantWithholdingResult {
  withholding: Invoice;
  sourceInvoice: Invoice;
  initialItem: InvoiceItem;
}

export class CreateTenantWithholdingUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
    private readonly invoiceIdGenerator: InvoiceIdGenerator,
    private readonly invoiceItemIdGenerator: InvoiceItemIdGenerator,
    private readonly invoiceNumberingSettingsRepository: InvoiceNumberingSettingsRepository,
    private readonly taxRateRepository: TaxRateRepository,
  ) {}

  async execute(
    input: CreateTenantWithholdingInput,
  ): Promise<CreateTenantWithholdingResult> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const sourceInvoice = await this.invoiceRepository.findByTenantIdAndId(
      tenant.id,
      input.sourceInvoiceId,
    );

    if (!sourceInvoice) {
      throw new InvoiceNotFoundError(input.tenantSlug, input.sourceInvoiceId);
    }

    if ((sourceInvoice.documentCode ?? '01') !== '01') {
      throw new InvalidWithholdingSourceInvoiceError(
        input.tenantSlug,
        input.sourceInvoiceId,
      );
    }

    const taxRate =
      input.taxRateId && input.taxRateId.trim().length > 0
        ? await this.taxRateRepository.findByTenantIdAndId(
            tenant.id,
            input.taxRateId,
          )
        : null;

    if (input.taxRateId && !taxRate) {
      throw new TaxRateNotFoundError(input.tenantSlug, input.taxRateId);
    }

    const now = new Date();
    const numberingSettings =
      await this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        WITHHOLDING_DOCUMENT_CODE,
      );
    const numberingReservation =
      !input.number && numberingSettings
        ? numberingSettings.reserveNextSequence(now)
        : null;

    const resolvedNumber =
      input.number?.trim() ||
      (numberingReservation
        ? formatEcuadorInvoiceNumber({
            establishmentCode: numberingSettings.establishmentCode,
            emissionPointCode: numberingSettings.emissionPointCode,
            sequenceNumber: numberingReservation.sequenceNumber,
          })
        : null);

    if (!resolvedNumber) {
      throw new InvoiceNumberRequiredError(input.tenantSlug);
    }

    const issuedAt = input.issuedAt ?? now;
    const withholding = Invoice.create({
      id: this.invoiceIdGenerator.generate(),
      tenantId: tenant.id,
      customerId: sourceInvoice.customerId,
      number: resolvedNumber.toUpperCase(),
      documentCode: WITHHOLDING_DOCUMENT_CODE,
      establishmentCode: numberingReservation
        ? numberingSettings.establishmentCode
        : null,
      emissionPointCode: numberingReservation
        ? numberingSettings.emissionPointCode
        : null,
      sequenceNumber: numberingReservation?.sequenceNumber ?? null,
      modifiedDocumentId: sourceInvoice.id,
      modifiedDocumentNumber: sourceInvoice.number,
      modifiedDocumentIssuedAt: sourceInvoice.issuedAt,
      modificationReason: input.reason.trim(),
      buyerIdentificationType: sourceInvoice.buyerIdentificationType,
      buyerIdentification: sourceInvoice.buyerIdentification,
      buyerName: sourceInvoice.buyerName,
      buyerAddress: sourceInvoice.buyerAddress,
      status: 'draft',
      currency: sourceInvoice.currency,
      issuedAt,
      dueAt: null,
      notes: this.normalizeOptionalValue(input.notes),
      createdAt: now,
      updatedAt: now,
    });

    if (numberingReservation) {
      await this.invoiceNumberingSettingsRepository.save(
        numberingReservation.nextSettings,
      );
    }

    await this.invoiceRepository.save(withholding);

    const lineTotalInCents = input.amountInCents;
    const initialItem = InvoiceItem.create({
      id: this.invoiceItemIdGenerator.generate(),
      tenantId: tenant.id,
      invoiceId: withholding.id,
      position: 1,
      description: input.reason.trim(),
      quantity: 1,
      unitPriceInCents: input.amountInCents,
      lineTotalInCents,
      taxRateId: taxRate?.id ?? null,
      taxRateName: taxRate?.name ?? null,
      taxRatePercentage: taxRate?.percentage ?? null,
      lineTaxInCents: 0,
      createdAt: now,
      updatedAt: now,
    });

    await this.invoiceItemRepository.save(initialItem);

    return {
      withholding,
      sourceInvoice,
      initialItem,
    };
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
