import {
  BuyerIdentificationType,
  Invoice,
  InvoiceItem,
} from '@saas-platform/invoicing-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { InvalidRemissionGuideSourceInvoiceError } from '../errors/invalid-remission-guide-source-invoice.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { InvoiceNumberRequiredError } from '../errors/invoice-number-required.error';
import { InvoiceIdGenerator } from '../ports/invoice-id.generator';
import { InvoiceItemIdGenerator } from '../ports/invoice-item-id.generator';
import { InvoiceItemRepository } from '../ports/invoice-item.repository';
import { InvoiceNumberingSettingsRepository } from '../ports/invoice-numbering-settings.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import { formatEcuadorInvoiceNumber } from '../types/electronic-invoice';

const REMISSION_GUIDE_DOCUMENT_CODE = '06';

export interface CreateTenantRemissionGuideInput {
  tenantSlug: string;
  sourceInvoiceId: string;
  shipmentReason: string;
  shipmentStartAt: Date;
  shipmentEndAt: Date;
  departureAddress: string;
  arrivalAddress: string;
  carrierName: string;
  carrierIdentificationType: BuyerIdentificationType;
  carrierIdentification: string;
  vehiclePlate: string;
  destinationRoute?: string | null;
  number?: string;
  issuedAt?: Date;
  notes?: string | null;
}

export interface CreateTenantRemissionGuideResult {
  remissionGuide: Invoice;
  sourceInvoice: Invoice;
  items: InvoiceItem[];
}

export class CreateTenantRemissionGuideUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
    private readonly invoiceIdGenerator: InvoiceIdGenerator,
    private readonly invoiceItemIdGenerator: InvoiceItemIdGenerator,
    private readonly invoiceNumberingSettingsRepository: InvoiceNumberingSettingsRepository,
  ) {}

  async execute(
    input: CreateTenantRemissionGuideInput,
  ): Promise<CreateTenantRemissionGuideResult> {
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
      throw new InvalidRemissionGuideSourceInvoiceError(
        input.tenantSlug,
        input.sourceInvoiceId,
      );
    }

    const now = new Date();
    const numberingSettings =
      await this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        REMISSION_GUIDE_DOCUMENT_CODE,
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
    const remissionGuide = Invoice.create({
      id: this.invoiceIdGenerator.generate(),
      tenantId: tenant.id,
      customerId: sourceInvoice.customerId,
      number: resolvedNumber.toUpperCase(),
      documentCode: REMISSION_GUIDE_DOCUMENT_CODE,
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
      modificationReason: input.shipmentReason.trim(),
      shipmentReason: input.shipmentReason.trim(),
      shipmentStartAt: input.shipmentStartAt,
      shipmentEndAt: input.shipmentEndAt,
      departureAddress: input.departureAddress.trim(),
      arrivalAddress: input.arrivalAddress.trim(),
      carrierName: input.carrierName.trim(),
      carrierIdentificationType: input.carrierIdentificationType,
      carrierIdentification: input.carrierIdentification.trim(),
      vehiclePlate: input.vehiclePlate.trim().toUpperCase(),
      destinationRoute: this.normalizeOptionalValue(input.destinationRoute),
      buyerIdentificationType: sourceInvoice.buyerIdentificationType,
      buyerIdentification: sourceInvoice.buyerIdentification,
      buyerName: sourceInvoice.buyerName,
      buyerAddress: sourceInvoice.buyerAddress,
      status: 'draft',
      currency: sourceInvoice.currency,
      issuedAt,
      dueAt: input.shipmentEndAt,
      notes: this.normalizeOptionalValue(input.notes),
      createdAt: now,
      updatedAt: now,
    });

    if (numberingReservation) {
      await this.invoiceNumberingSettingsRepository.save(
        numberingReservation.nextSettings,
      );
    }

    await this.invoiceRepository.save(remissionGuide);

    const sourceItems = await this.invoiceItemRepository.findByTenantIdAndInvoiceId(
      tenant.id,
      sourceInvoice.id,
    );
    const items = this.buildRemissionGuideItems({
      tenantId: tenant.id,
      invoiceId: remissionGuide.id,
      createdAt: now,
      shipmentReason: input.shipmentReason.trim(),
      sourceItems,
    });

    for (const item of items) {
      await this.invoiceItemRepository.save(item);
    }

    return {
      remissionGuide,
      sourceInvoice,
      items,
    };
  }

  private buildRemissionGuideItems(input: {
    tenantId: string;
    invoiceId: string;
    createdAt: Date;
    shipmentReason: string;
    sourceItems: InvoiceItem[];
  }): InvoiceItem[] {
    if (input.sourceItems.length === 0) {
      return [
        InvoiceItem.create({
          id: this.invoiceItemIdGenerator.generate(),
          tenantId: input.tenantId,
          invoiceId: input.invoiceId,
          position: 1,
          description: input.shipmentReason,
          quantity: 1,
          unitPriceInCents: 0,
          lineTotalInCents: 0,
          taxRateId: null,
          taxRateName: null,
          taxRatePercentage: null,
          lineTaxInCents: 0,
          createdAt: input.createdAt,
          updatedAt: input.createdAt,
        }),
      ];
    }

    return input.sourceItems.map((sourceItem) =>
      InvoiceItem.create({
        id: this.invoiceItemIdGenerator.generate(),
        tenantId: input.tenantId,
        invoiceId: input.invoiceId,
        position: sourceItem.position,
        description: sourceItem.description,
        quantity: sourceItem.quantity,
        unitPriceInCents: 0,
        lineTotalInCents: 0,
        taxRateId: null,
        taxRateName: null,
        taxRatePercentage: null,
        lineTaxInCents: 0,
        createdAt: input.createdAt,
        updatedAt: input.createdAt,
      }),
    );
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
