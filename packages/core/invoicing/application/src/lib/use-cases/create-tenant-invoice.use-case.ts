import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Invoice, InvoiceStatus } from '@saas-platform/invoicing-domain';
import { CustomerNotFoundError } from '../errors/customer-not-found.error';
import { InvoiceNumberRequiredError } from '../errors/invoice-number-required.error';
import { CustomerRepository } from '../ports/customer.repository';
import { InvoiceIdGenerator } from '../ports/invoice-id.generator';
import { InvoiceNumberingSettingsRepository } from '../ports/invoice-numbering-settings.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import { formatEcuadorInvoiceNumber } from '../types/electronic-invoice';

export interface CreateTenantInvoiceInput {
  tenantSlug: string;
  customerId: string;
  number?: string;
  currency: string;
  status?: InvoiceStatus;
  issuedAt?: Date;
  dueAt?: Date | null;
  notes?: string | null;
}

export class CreateTenantInvoiceUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceIdGenerator: InvoiceIdGenerator,
    private readonly invoiceNumberingSettingsRepository: InvoiceNumberingSettingsRepository,
  ) {}

  async execute(input: CreateTenantInvoiceInput): Promise<Invoice> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const customer = await this.customerRepository.findByTenantIdAndId(
      tenant.id,
      input.customerId,
    );

    if (!customer) {
      throw new CustomerNotFoundError(input.tenantSlug, input.customerId);
    }

    const now = new Date();
    const numberingSettings =
      await this.invoiceNumberingSettingsRepository.findByTenantId(tenant.id);
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

    const invoice = Invoice.create({
      id: this.invoiceIdGenerator.generate(),
      tenantId: tenant.id,
      customerId: customer.id,
      number: resolvedNumber.toUpperCase(),
      documentCode: numberingSettings?.documentCode ?? null,
      establishmentCode: numberingReservation
        ? numberingSettings.establishmentCode
        : null,
      emissionPointCode: numberingReservation
        ? numberingSettings.emissionPointCode
        : null,
      sequenceNumber: numberingReservation?.sequenceNumber ?? null,
      buyerIdentificationType: customer.identificationType,
      buyerIdentification: customer.identification ?? customer.taxId,
      buyerName: customer.name,
      buyerAddress: customer.billingAddress,
      status: input.status ?? 'draft',
      currency: input.currency.trim().toUpperCase(),
      issuedAt: input.issuedAt ?? now,
      dueAt: input.dueAt ?? null,
      notes: this.normalizeOptionalValue(input.notes),
      createdAt: now,
      updatedAt: now,
    });

    if (numberingReservation) {
      await this.invoiceNumberingSettingsRepository.save(
        numberingReservation.nextSettings,
      );
    }

    await this.invoiceRepository.save(invoice);

    return invoice;
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
