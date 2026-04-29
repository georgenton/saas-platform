import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '@saas-platform/invoicing-application';
import { Payment } from '@saas-platform/invoicing-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(payment: Payment): Promise<void> {
    const data = payment.toPrimitives();

    await this.prisma.payment.upsert({
      where: { id: data.id },
      update: {
        amountInCents: data.amountInCents,
        currency: data.currency,
        status: data.status,
        method: data.method,
        reference: data.reference,
        paidAt: data.paidAt,
        notes: data.notes,
        reversedAt: data.reversedAt,
        reversalReason: data.reversalReason,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        invoiceId: data.invoiceId,
        amountInCents: data.amountInCents,
        currency: data.currency,
        status: data.status,
        method: data.method,
        reference: data.reference,
        paidAt: data.paidAt,
        notes: data.notes,
        reversedAt: data.reversedAt,
        reversalReason: data.reversalReason,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantIdAndId(
    tenantId: string,
    paymentId: string,
  ): Promise<Payment | null> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        tenantId,
        id: paymentId,
      },
    });

    return payment ? this.toDomain(payment) : null;
  }

  async findByTenantIdAndInvoiceId(
    tenantId: string,
    invoiceId: string,
  ): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        tenantId,
        invoiceId,
      },
      orderBy: [{ paidAt: 'asc' }, { createdAt: 'asc' }],
    });

    return payments.map((payment) => this.toDomain(payment));
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    invoiceId: string;
    amountInCents: number;
    currency: string;
    status: string;
    method: string;
    reference: string | null;
    paidAt: Date;
    notes: string | null;
    reversedAt: Date | null;
    reversalReason: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Payment {
    return Payment.create({
      id: record.id,
      tenantId: record.tenantId,
      invoiceId: record.invoiceId,
      amountInCents: record.amountInCents,
      currency: record.currency,
      status: this.normalizeStatus(record.status),
      method: record.method,
      reference: record.reference,
      paidAt: record.paidAt,
      notes: record.notes,
      reversedAt: record.reversedAt,
      reversalReason: record.reversalReason,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private normalizeStatus(status: string): 'posted' | 'reversed' {
    return status === 'reversed' ? 'reversed' : 'posted';
  }
}
