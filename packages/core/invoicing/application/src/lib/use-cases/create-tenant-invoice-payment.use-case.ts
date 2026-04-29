import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Payment } from '@saas-platform/invoicing-domain';
import { InvalidInvoicePaymentStateError } from '../errors/invalid-invoice-payment-state.error';
import { InvoiceNotFoundError } from '../errors/invoice-not-found.error';
import { InvoicePaymentExceedsBalanceError } from '../errors/invoice-payment-exceeds-balance.error';
import { InvoiceItemRepository } from '../ports/invoice-item.repository';
import { InvoiceRepository } from '../ports/invoice.repository';
import { PaymentIdGenerator } from '../ports/payment-id.generator';
import { PaymentRepository } from '../ports/payment.repository';
import {
  calculateInvoiceSettlement,
  calculateInvoiceTotals,
} from '../types/invoice-view';

export interface CreateTenantInvoicePaymentInput {
  tenantSlug: string;
  invoiceId: string;
  amountInCents: number;
  method: string;
  reference?: string | null;
  paidAt?: Date;
  notes?: string | null;
}

export class CreateTenantInvoicePaymentUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentIdGenerator: PaymentIdGenerator,
  ) {}

  async execute(input: CreateTenantInvoicePaymentInput): Promise<Payment> {
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

    if (invoice.status === 'draft' || invoice.status === 'void') {
      throw new InvalidInvoicePaymentStateError(
        input.tenantSlug,
        input.invoiceId,
        invoice.status,
      );
    }

    const [items, existingPayments] = await Promise.all([
      this.invoiceItemRepository.findByTenantIdAndInvoiceId(tenant.id, invoice.id),
      this.paymentRepository.findByTenantIdAndInvoiceId(tenant.id, invoice.id),
    ]);
    const totals = calculateInvoiceTotals(items);
    const settlement = calculateInvoiceSettlement(
      totals.totalInCents,
      existingPayments,
    );

    if (input.amountInCents > settlement.balanceDueInCents) {
      throw new InvoicePaymentExceedsBalanceError(
        input.tenantSlug,
        input.invoiceId,
        input.amountInCents,
        settlement.balanceDueInCents,
      );
    }

    const now = new Date();
    const payment = Payment.create({
      id: this.paymentIdGenerator.generate(),
      tenantId: tenant.id,
      invoiceId: invoice.id,
      amountInCents: input.amountInCents,
      currency: invoice.currency,
      method: input.method.trim(),
      reference: this.normalizeOptionalValue(input.reference),
      paidAt: input.paidAt ?? now,
      notes: this.normalizeOptionalValue(input.notes),
      createdAt: now,
      updatedAt: now,
    });

    await this.paymentRepository.save(payment);

    const updatedBalance = settlement.balanceDueInCents - payment.amountInCents;
    if (updatedBalance === 0 && invoice.status !== 'paid') {
      await this.invoiceRepository.save(invoice.transitionTo('paid', now));
    }

    return payment;
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
