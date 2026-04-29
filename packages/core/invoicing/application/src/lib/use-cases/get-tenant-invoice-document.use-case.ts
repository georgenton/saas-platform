import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { CustomerNotFoundError } from '../errors/customer-not-found.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { CustomerRepository } from '../ports/customer.repository';
import { InvoiceItemRepository } from '../ports/invoice-item.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import {
  buildInvoiceDocumentView,
  InvoiceDocumentView,
} from '../types/invoice-view';

export class GetTenantInvoiceDocumentUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
  ) {}

  async execute(
    tenantSlug: string,
    invoiceId: string,
  ): Promise<InvoiceDocumentView> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const invoice = await this.invoiceRepository.findByTenantIdAndId(
      tenant.id,
      invoiceId,
    );

    if (!invoice) {
      throw new InvoiceNotFoundError(tenantSlug, invoiceId);
    }

    const customer = await this.customerRepository.findByTenantIdAndId(
      tenant.id,
      invoice.customerId,
    );

    if (!customer) {
      throw new CustomerNotFoundError(tenantSlug, invoice.customerId);
    }

    const items = await this.invoiceItemRepository.findByTenantIdAndInvoiceId(
      tenant.id,
      invoice.id,
    );

    return buildInvoiceDocumentView({
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
      customer,
      invoice,
      items,
    });
  }
}
