import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Invoice, InvoiceItem } from '@saas-platform/invoicing-domain';
import { InvalidCreditNoteSourceInvoiceError } from '../errors/invalid-credit-note-source-invoice.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { InvoiceNumberRequiredError } from '../errors/invoice-number-required.error';
import { InvoiceIdGenerator } from '../ports/invoice-id.generator';
import { InvoiceItemIdGenerator } from '../ports/invoice-item-id.generator';
import { InvoiceItemRepository } from '../ports/invoice-item.repository';
import { InvoiceNumberingSettingsRepository } from '../ports/invoice-numbering-settings.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import { formatEcuadorInvoiceNumber } from '../types/electronic-invoice';

const CREDIT_NOTE_DOCUMENT_CODE = '04';

export interface CreateTenantCreditNoteInput {
  tenantSlug: string;
  sourceInvoiceId: string;
  reason: string;
  number?: string;
  issuedAt?: Date;
  notes?: string | null;
}

export interface CreateTenantCreditNoteResult {
  creditNote: Invoice;
  sourceInvoice: Invoice;
}

export class CreateTenantCreditNoteUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
    private readonly invoiceIdGenerator: InvoiceIdGenerator,
    private readonly invoiceItemIdGenerator: InvoiceItemIdGenerator,
    private readonly invoiceNumberingSettingsRepository: InvoiceNumberingSettingsRepository,
  ) {}

  async execute(
    input: CreateTenantCreditNoteInput,
  ): Promise<CreateTenantCreditNoteResult> {
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
      throw new InvalidCreditNoteSourceInvoiceError(
        input.tenantSlug,
        input.sourceInvoiceId,
      );
    }

    const sourceItems =
      await this.invoiceItemRepository.findByTenantIdAndInvoiceId(
        tenant.id,
        sourceInvoice.id,
      );

    const now = new Date();
    const numberingSettings =
      await this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        CREDIT_NOTE_DOCUMENT_CODE,
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
    const creditNote = Invoice.create({
      id: this.invoiceIdGenerator.generate(),
      tenantId: tenant.id,
      customerId: sourceInvoice.customerId,
      number: resolvedNumber.toUpperCase(),
      documentCode: CREDIT_NOTE_DOCUMENT_CODE,
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

    await this.invoiceRepository.save(creditNote);

    const reversalItems = sourceItems.map((item, index) =>
      this.buildReversalItem(tenant.id, creditNote.id, item, index + 1, now),
    );

    for (const item of reversalItems) {
      await this.invoiceItemRepository.save(item);
    }

    return {
      creditNote,
      sourceInvoice,
    };
  }

  private buildReversalItem(
    tenantId: string,
    creditNoteId: string,
    sourceItem: InvoiceItem,
    position: number,
    now: Date,
  ): InvoiceItem {
    return InvoiceItem.create({
      id: this.invoiceItemIdGenerator.generate(),
      tenantId,
      invoiceId: creditNoteId,
      position,
      description: sourceItem.description,
      quantity: sourceItem.quantity,
      unitPriceInCents: sourceItem.unitPriceInCents * -1,
      lineTotalInCents: sourceItem.lineTotalInCents * -1,
      taxRateId: sourceItem.taxRateId,
      taxRateName: sourceItem.taxRateName,
      taxRatePercentage: sourceItem.taxRatePercentage,
      lineTaxInCents: sourceItem.lineTaxInCents * -1,
      createdAt: now,
      updatedAt: now,
    });
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
