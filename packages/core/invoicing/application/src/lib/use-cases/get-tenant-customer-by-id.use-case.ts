import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Customer } from '@saas-platform/invoicing-domain';
import { CustomerNotFoundError } from '../errors/customer-not-found.error';
import { CustomerRepository } from '../ports/customer.repository';

export class GetTenantCustomerByIdUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(tenantSlug: string, customerId: string): Promise<Customer> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const customer = await this.customerRepository.findByTenantIdAndId(
      tenant.id,
      customerId,
    );

    if (!customer) {
      throw new CustomerNotFoundError(tenantSlug, customerId);
    }

    return customer;
  }
}
