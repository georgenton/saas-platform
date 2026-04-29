import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { InvoiceItem } from '@saas-platform/invoicing-domain';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { InvoiceItemIdGenerator } from '../ports/invoice-item-id.generator';
import { InvoiceItemRepository } from '../ports/invoice-item.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import { TaxRateNotFoundError } from '../errors/tax-rate-not-found.error';
import { TaxRateRepository } from '../ports/tax-rate.repository';

export interface CreateTenantInvoiceItemInput {
  tenantSlug: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPriceInCents: number;
  taxRateId?: string | null;
}

export class CreateTenantInvoiceItemUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
    private readonly invoiceItemIdGenerator: InvoiceItemIdGenerator,
    private readonly taxRateRepository: TaxRateRepository,
  ) {}

  async execute(input: CreateTenantInvoiceItemInput): Promise<InvoiceItem> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const invoice = await this.invoiceRepository.findByTenantIdAndId(
      tenant.id,
      input.invoiceId,
    );

    if (!invoice) {
      throw new InvoiceNotFoundError(input.tenantSlug, input.invoiceId);
    }

    const currentItems =
      await this.invoiceItemRepository.findByTenantIdAndInvoiceId(
        tenant.id,
        invoice.id,
      );

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
    const lineTotalInCents = input.quantity * input.unitPriceInCents;
    const taxRatePercentage = taxRate?.percentage ?? null;
    const lineTaxInCents =
      taxRatePercentage === null
        ? 0
        : Math.round((lineTotalInCents * taxRatePercentage) / 100);
    const item = InvoiceItem.create({
      id: this.invoiceItemIdGenerator.generate(),
      tenantId: tenant.id,
      invoiceId: invoice.id,
      position: currentItems.length + 1,
      description: input.description.trim(),
      quantity: input.quantity,
      unitPriceInCents: input.unitPriceInCents,
      lineTotalInCents,
      taxRateId: taxRate?.id ?? null,
      taxRateName: taxRate?.name ?? null,
      taxRatePercentage,
      lineTaxInCents,
      createdAt: now,
      updatedAt: now,
    });

    await this.invoiceItemRepository.save(item);

    return item;
  }
}
