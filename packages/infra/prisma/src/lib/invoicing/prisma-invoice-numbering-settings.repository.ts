import { Injectable } from '@nestjs/common';
import { InvoiceNumberingSettingsRepository } from '@saas-platform/invoicing-application';
import { InvoiceNumberingSettings } from '@saas-platform/invoicing-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaInvoiceNumberingSettingsRepository
  implements InvoiceNumberingSettingsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(settings: InvoiceNumberingSettings): Promise<void> {
    const data = settings.toPrimitives();

    await this.prisma.invoiceNumberingSettings.upsert({
      where: {
        tenantId_documentCode: {
          tenantId: data.tenantId,
          documentCode: data.documentCode,
        },
      },
      update: {
        documentCode: data.documentCode,
        establishmentCode: data.establishmentCode,
        emissionPointCode: data.emissionPointCode,
        nextSequenceNumber: data.nextSequenceNumber,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        documentCode: data.documentCode,
        establishmentCode: data.establishmentCode,
        emissionPointCode: data.emissionPointCode,
        nextSequenceNumber: data.nextSequenceNumber,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantIdAndDocumentCode(
    tenantId: string,
    documentCode: string,
  ): Promise<InvoiceNumberingSettings | null> {
    const record = await this.prisma.invoiceNumberingSettings.findUnique({
      where: {
        tenantId_documentCode: {
          tenantId,
          documentCode,
        },
      },
    });

    return record ? this.toDomain(record) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    documentCode: string;
    establishmentCode: string;
    emissionPointCode: string;
    nextSequenceNumber: number;
    createdAt: Date;
    updatedAt: Date;
  }): InvoiceNumberingSettings {
    return InvoiceNumberingSettings.create({
      id: record.id,
      tenantId: record.tenantId,
      documentCode: record.documentCode,
      establishmentCode: record.establishmentCode,
      emissionPointCode: record.emissionPointCode,
      nextSequenceNumber: record.nextSequenceNumber,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
