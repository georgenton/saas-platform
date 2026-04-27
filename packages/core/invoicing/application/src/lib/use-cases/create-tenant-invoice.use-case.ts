import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Invoice, InvoiceStatus } from '@saas-platform/invoicing-domain';
import { CustomerNotFoundError } from '../errors/customer-not-found.error';
import { CustomerRepository } from '../ports/customer.repository';
import { InvoiceIdGenerator } from '../ports/invoice-id.generator';
import { InvoiceRepository } from '../ports/invoice.repository';

export interface CreateTenantInvoiceInput {
  tenantSlug: string;
  customerId: string;
  number: string;
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
    const invoice = Invoice.create({
      id: this.invoiceIdGenerator.generate(),
      tenantId: tenant.id,
      customerId: customer.id,
      number: input.number.trim().toUpperCase(),
      status: input.status ?? 'draft',
      currency: input.currency.trim().toUpperCase(),
      issuedAt: input.issuedAt ?? now,
      dueAt: input.dueAt ?? null,
      notes: this.normalizeOptionalValue(input.notes),
      createdAt: now,
      updatedAt: now,
    });

    await this.invoiceRepository.save(invoice);

    return invoice;
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
