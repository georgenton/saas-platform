import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { InvoiceStatus } from '@saas-platform/invoicing-domain';
import { InvoiceNotFullySettledError } from '../errors/invoice-not-fully-settled.error';
import { InvalidInvoiceStatusTransitionError } from '../errors/invalid-invoice-status-transition.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { InvoiceItemRepository } from '../ports/invoice-item.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import { PaymentRepository } from '../ports/payment.repository';
import {
  calculateInvoiceSettlement,
  calculateInvoiceTotals,
} from '../types/invoice-view';

export interface UpdateTenantInvoiceStatusInput {
  tenantSlug: string;
  invoiceId: string;
  status: InvoiceStatus;
}

export class UpdateTenantInvoiceStatusUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
    private readonly paymentRepository: PaymentRepository,
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

    if (input.status === 'paid') {
      const [items, payments] = await Promise.all([
        this.invoiceItemRepository.findByTenantIdAndInvoiceId(tenant.id, invoice.id),
        this.paymentRepository.findByTenantIdAndInvoiceId(tenant.id, invoice.id),
      ]);
      const totals = calculateInvoiceTotals(items);
      const settlement = calculateInvoiceSettlement(totals.totalInCents, payments);

      if (!settlement.isFullyPaid) {
        throw new InvoiceNotFullySettledError(
          input.tenantSlug,
          input.invoiceId,
          settlement.balanceDueInCents,
        );
      }
    }

    const updatedInvoice = invoice.transitionTo(input.status, new Date());
    await this.invoiceRepository.save(updatedInvoice);

    return updatedInvoice;
  }
}
