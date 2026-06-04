import { Injectable } from '@nestjs/common';
import { TaxComplianceEventRepository } from '@saas-platform/tax-compliance-application';
import {
  EcuadorTaxComplianceEventType,
  EcuadorTaxComplianceEventView,
} from '@saas-platform/tax-compliance-domain';
import { PrismaService } from '../prisma.service';

type TaxComplianceEventRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  eventType: string;
  source: string;
  payloadJson: string;
  occurredAt: Date;
  createdAt: Date;
};

@Injectable()
export class PrismaTaxComplianceEventRepository
  implements TaxComplianceEventRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async record(
    command: Parameters<TaxComplianceEventRepository['record']>[0],
  ): Promise<EcuadorTaxComplianceEventView> {
    const record = await this.delegate.create({
      data: {
        id: command.id,
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        period: command.period,
        year: command.year,
        eventType: command.eventType,
        source: command.source,
        payloadJson: JSON.stringify(command.payload),
        occurredAt: command.occurredAt,
      },
    });

    return this.toView(record as TaxComplianceEventRow);
  }

  async listByTenantAndPeriod(
    command: Parameters<TaxComplianceEventRepository['listByTenantAndPeriod']>[0],
  ): Promise<EcuadorTaxComplianceEventView[]> {
    const records = await this.delegate.findMany({
      where: {
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        period: command.period,
      },
      orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
      take: command.limit ?? 50,
    });

    return records.map((record: TaxComplianceEventRow) => this.toView(record));
  }

  private toView(record: TaxComplianceEventRow): EcuadorTaxComplianceEventView {
    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      period: record.period,
      year: record.year,
      eventType: record.eventType as EcuadorTaxComplianceEventType,
      source: record.source,
      payload: JSON.parse(record.payloadJson),
      occurredAt: record.occurredAt,
      createdAt: record.createdAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).taxComplianceEvent;
  }
}
