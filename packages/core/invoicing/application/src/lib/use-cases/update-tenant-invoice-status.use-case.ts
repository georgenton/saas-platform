import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { InvoiceStatus } from '@saas-platform/invoicing-domain';
import { InvalidInvoiceStatusTransitionError } from '../errors/invalid-invoice-status-transition.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { InvoiceRepository } from '../ports/invoice.repository';

export interface UpdateTenantInvoiceStatusInput {
  tenantSlug: string;
  invoiceId: string;
  status: InvoiceStatus;
}

export class UpdateTenantInvoiceStatusUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async execute(input: UpdateTenantInvoiceStatusInput) {
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

    if (!invoice.canTransitionTo(input.status)) {
      throw new InvalidInvoiceStatusTransitionError(
        input.tenantSlug,
        input.invoiceId,
        invoice.status,
        input.status,
      );
    }

    const updatedInvoice = invoice.transitionTo(input.status, new Date());
    await this.invoiceRepository.save(updatedInvoice);

    return updatedInvoice;
  }
}
