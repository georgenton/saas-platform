import { Injectable } from '@nestjs/common';
import { TaxRateRepository } from '@saas-platform/invoicing-application';
import { TaxRate } from '@saas-platform/invoicing-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTaxRateRepository implements TaxRateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(taxRate: TaxRate): Promise<void> {
    const data = taxRate.toPrimitives();

    await this.prisma.taxRate.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        percentage: data.percentage,
        isActive: data.isActive,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        name: data.name,
        percentage: data.percentage,
        isActive: data.isActive,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantId(tenantId: string): Promise<TaxRate[]> {
    const taxRates = await this.prisma.taxRate.findMany({
      where: { tenantId },
      orderBy: [{ isActive: 'desc' }, { createdAt: 'asc' }],
    });

    return taxRates.map((taxRate) => this.toDomain(taxRate));
  }

  async findByTenantIdAndId(
    tenantId: string,
    taxRateId: string,
  ): Promise<TaxRate | null> {
    const taxRate = await this.prisma.taxRate.findFirst({
      where: {
        id: taxRateId,
        tenantId,
      },
    });

    return taxRate ? this.toDomain(taxRate) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    name: string;
    percentage: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): TaxRate {
    return TaxRate.create({
      id: record.id,
      tenantId: record.tenantId,
      name: record.name,
      percentage: record.percentage,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
