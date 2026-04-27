import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Customer } from '@saas-platform/invoicing-domain';
import { CustomerIdGenerator } from '../ports/customer-id.generator';
import { CustomerRepository } from '../ports/customer.repository';

export interface CreateTenantCustomerInput {
  tenantSlug: string;
  name: string;
  email?: string | null;
  taxId?: string | null;
}

export class CreateTenantCustomerUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly customerIdGenerator: CustomerIdGenerator,
  ) {}

  async execute(input: CreateTenantCustomerInput): Promise<Customer> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const now = new Date();
    const customer = Customer.create({
      id: this.customerIdGenerator.generate(),
      tenantId: tenant.id,
      name: input.name.trim(),
      email: this.normalizeOptionalEmail(input.email),
      taxId: this.normalizeOptionalValue(input.taxId),
      createdAt: now,
      updatedAt: now,
    });

    await this.customerRepository.save(customer);

    return customer;
  }

  private normalizeOptionalEmail(value?: string | null): string | null {
    const normalizedValue = this.normalizeOptionalValue(value);

    return normalizedValue ? normalizedValue.toLowerCase() : null;
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
