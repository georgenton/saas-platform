import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { InvalidPaymentReversalStateError } from '../errors/invalid-payment-reversal-state.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { PaymentNotFoundError } from '../errors/payment-not-found.error';
import { InvoiceItemRepository } from '../ports/invoice-item.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import { PaymentRepository } from '../ports/payment.repository';
import {
  calculateInvoiceSettlement,
  calculateInvoiceTotals,
} from '../types/invoice-view';

export interface ReverseTenantInvoicePaymentInput {
  tenantSlug: string;
  invoiceId: string;
  paymentId: string;
  reason?: string | null;
}

export class ReverseTenantInvoicePaymentUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(input: ReverseTenantInvoicePaymentInput) {
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

    const payment = await this.paymentRepository.findByTenantIdAndId(
      tenant.id,
      input.paymentId,
    );

    if (!payment || payment.invoiceId !== invoice.id) {
      throw new PaymentNotFoundError(
        input.tenantSlug,
        input.invoiceId,
        input.paymentId,
      );
    }

    if (!payment.canReverse()) {
      throw new InvalidPaymentReversalStateError(
        input.tenantSlug,
        input.invoiceId,
        input.paymentId,
      );
    }

    const now = new Date();
    const reversedPayment = payment.reverse(now, this.normalizeOptionalValue(input.reason));
    await this.paymentRepository.save(reversedPayment);

    const [items, payments] = await Promise.all([
      this.invoiceItemRepository.findByTenantIdAndInvoiceId(tenant.id, invoice.id),
      this.paymentRepository.findByTenantIdAndInvoiceId(tenant.id, invoice.id),
    ]);
    const totals = calculateInvoiceTotals(items);
    const settlement = calculateInvoiceSettlement(
      totals.totalInCents,
      payments,
    );

    if (invoice.status === 'paid' || invoice.status === 'partially_paid') {
      const nextStatus =
        settlement.paidInCents === 0 ? 'issued' : settlement.isFullyPaid ? 'paid' : 'partially_paid';

      if (invoice.status !== nextStatus) {
        await this.invoiceRepository.save(invoice.transitionTo(nextStatus, now));
      }
    }

    return reversedPayment;
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
