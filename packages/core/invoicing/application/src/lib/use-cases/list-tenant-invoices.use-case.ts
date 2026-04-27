import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Invoice } from '@saas-platform/invoicing-domain';
import { InvoiceRepository } from '../ports/invoice.repository';

export class ListTenantInvoicesUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(tenantSlug: string): Promise<Invoice[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.invoiceRepository.findByTenantId(tenant.id);
  }
}
