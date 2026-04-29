import { Injectable } from '@nestjs/common';
import { InvoiceItemRepository } from '@saas-platform/invoicing-application';
import { InvoiceItem } from '@saas-platform/invoicing-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaInvoiceItemRepository implements InvoiceItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(item: InvoiceItem): Promise<void> {
    const data = item.toPrimitives();

    await this.prisma.invoiceItem.upsert({
      where: { id: data.id },
      update: {
        position: data.position,
        description: data.description,
        quantity: data.quantity,
        unitPriceInCents: data.unitPriceInCents,
        lineTotalInCents: data.lineTotalInCents,
        taxRateId: data.taxRateId ?? null,
        taxRateName: data.taxRateName ?? null,
        taxRatePercentage: data.taxRatePercentage ?? null,
        lineTaxInCents: data.lineTaxInCents,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        invoiceId: data.invoiceId,
        position: data.position,
        description: data.description,
        quantity: data.quantity,
        unitPriceInCents: data.unitPriceInCents,
        lineTotalInCents: data.lineTotalInCents,
        taxRateId: data.taxRateId ?? null,
        taxRateName: data.taxRateName ?? null,
        taxRatePercentage: data.taxRatePercentage ?? null,
        lineTaxInCents: data.lineTaxInCents,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantIdAndInvoiceId(
    tenantId: string,
    invoiceId: string,
  ): Promise<InvoiceItem[]> {
    const items = await this.prisma.invoiceItem.findMany({
      where: {
        tenantId,
        invoiceId,
      },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });

    return items.map((item) => this.toDomain(item));
  }

  async findByTenantIdInvoiceIdAndId(
    tenantId: string,
    invoiceId: string,
    itemId: string,
  ): Promise<InvoiceItem | null> {
    const item = await this.prisma.invoiceItem.findFirst({
      where: {
        id: itemId,
        tenantId,
        invoiceId,
      },
    });

    return item ? this.toDomain(item) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    invoiceId: string;
    position: number;
    description: string;
    quantity: number;
    unitPriceInCents: number;
    lineTotalInCents: number;
    taxRateId: string | null;
    taxRateName: string | null;
    taxRatePercentage: number | null;
    lineTaxInCents: number;
    createdAt: Date;
    updatedAt: Date;
  }): InvoiceItem {
    return InvoiceItem.create({
      id: record.id,
      tenantId: record.tenantId,
      invoiceId: record.invoiceId,
      position: record.position,
      description: record.description,
      quantity: record.quantity,
      unitPriceInCents: record.unitPriceInCents,
      lineTotalInCents: record.lineTotalInCents,
      taxRateId: record.taxRateId,
      taxRateName: record.taxRateName,
      taxRatePercentage: record.taxRatePercentage,
      lineTaxInCents: record.lineTaxInCents,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
