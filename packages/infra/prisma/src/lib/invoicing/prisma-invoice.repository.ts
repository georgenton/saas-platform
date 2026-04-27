import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '@saas-platform/invoicing-application';
import { Invoice, InvoiceStatus } from '@saas-platform/invoicing-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaInvoiceRepository implements InvoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(invoice: Invoice): Promise<void> {
    const data = invoice.toPrimitives();

    await this.prisma.invoice.upsert({
      where: { id: data.id },
      update: {
        customerId: data.customerId,
        number: data.number,
        status: data.status,
        currency: data.currency,
        issuedAt: data.issuedAt,
        dueAt: data.dueAt,
        notes: data.notes,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        customerId: data.customerId,
        number: data.number,
        status: data.status,
        currency: data.currency,
        issuedAt: data.issuedAt,
        dueAt: data.dueAt,
        notes: data.notes,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantId(tenantId: string): Promise<Invoice[]> {
    const invoices = await this.prisma.invoice.findMany({
      where: { tenantId },
      orderBy: [{ createdAt: 'desc' }, { number: 'desc' }],
    });

    return invoices.map((invoice) => this.toDomain(invoice));
  }

  async findByTenantIdAndId(
    tenantId: string,
    invoiceId: string,
  ): Promise<Invoice | null> {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        tenantId,
      },
    });

    return invoice ? this.toDomain(invoice) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    customerId: string;
    number: string;
    status: string;
    currency: string;
    issuedAt: Date;
    dueAt: Date | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Invoice {
    return Invoice.create({
      id: record.id,
      tenantId: record.tenantId,
      customerId: record.customerId,
      number: record.number,
      status: record.status as InvoiceStatus,
      currency: record.currency,
      issuedAt: record.issuedAt,
      dueAt: record.dueAt,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
