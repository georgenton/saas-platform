import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { InvoiceItemRepository } from '../ports/invoice-item.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import {
  calculateInvoiceTotals,
  InvoiceSummaryView,
} from '../types/invoice-view';

export class ListTenantInvoiceSummariesUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
  ) {}

  async execute(tenantSlug: string): Promise<InvoiceSummaryView[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const invoices = await this.invoiceRepository.findByTenantId(tenant.id);

    return Promise.all(
      invoices.map(async (invoice) => {
        const items =
          await this.invoiceItemRepository.findByTenantIdAndInvoiceId(
            tenant.id,
            invoice.id,
          );

        return {
          invoice,
          itemCount: items.length,
          totals: calculateInvoiceTotals(items),
        };
      }),
    );
  }
}
