import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Customer } from '@saas-platform/invoicing-domain';
import { CustomerRepository } from '../ports/customer.repository';

export class ListTenantCustomersUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(tenantSlug: string): Promise<Customer[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.customerRepository.findByTenantId(tenant.id);
  }
}
