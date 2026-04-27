import { Customer } from '@saas-platform/invoicing-domain';

export interface CustomerRepository {
  save(customer: Customer): Promise<void>;
  findByTenantId(tenantId: string): Promise<Customer[]>;
  findByTenantIdAndId(tenantId: string, customerId: string): Promise<Customer | null>;
}
