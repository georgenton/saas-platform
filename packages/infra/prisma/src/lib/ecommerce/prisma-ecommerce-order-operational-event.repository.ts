import { Injectable } from '@nestjs/common';
import { EcommerceOrderOperationalEventRepository } from '@saas-platform/ecommerce-application';
import {
  TenantEcommerceOrderOperationalEventType,
  TenantEcommerceOrderOperationalEventView,
} from '@saas-platform/ecommerce-domain';
import { PrismaService } from '../prisma.service';

type EcommerceOrderOperationalEventRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  productEntityId: string;
  orderDraftId: string;
  dedupeKey: string;
  eventType: TenantEcommerceOrderOperationalEventType;
  sourceWorkspace: string;
  status: string;
  summary: string;
  payloadJson: string;
  occurredAt: Date;
  createdAt: Date;
};

@Injectable()
export class PrismaEcommerceOrderOperationalEventRepository
  implements EcommerceOrderOperationalEventRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async record(
    command: Parameters<EcommerceOrderOperationalEventRepository['record']>[0],
  ): Promise<TenantEcommerceOrderOperationalEventView> {
    const data = {
      id: command.id,
      tenantId: command.tenantId,
      tenantSlug: command.tenantSlug,
      productEntityId: command.productEntityId,
      orderDraftId: command.orderDraftId,
      dedupeKey: command.dedupeKey,
      eventType: command.eventType,
      sourceWorkspace: command.sourceWorkspace,
      status: command.status,
      summary: command.summary,
      payloadJson: JSON.stringify(command.payload),
      occurredAt: command.occurredAt,
    };
    const record = await this.delegate.upsert({
      where: {
        dedupeKey: command.dedupeKey,
      },
      create: data,
      update: {
        summary: command.summary,
        payloadJson: JSON.stringify(command.payload),
        occurredAt: command.occurredAt,
      },
    });

    return this.toView(record as EcommerceOrderOperationalEventRow);
  }

  async listLatestByOrderDraft(
    command: Parameters<
      EcommerceOrderOperationalEventRepository['listLatestByOrderDraft']
    >[0],
  ): Promise<TenantEcommerceOrderOperationalEventView[]> {
    const records = await this.delegate.findMany({
      where: {
        tenantSlug: command.tenantSlug,
        productEntityId: command.productEntityId,
        orderDraftId: command.orderDraftId,
        ...(command.eventType ? { eventType: command.eventType } : {}),
        ...(command.status ? { status: command.status } : {}),
        ...(command.sourceWorkspace
          ? { sourceWorkspace: command.sourceWorkspace }
          : {}),
      },
      orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
      take: command.limit ?? 20,
    });

    return records.map((record: EcommerceOrderOperationalEventRow) =>
      this.toView(record),
    );
  }

  private toView(
    record: EcommerceOrderOperationalEventRow,
  ): TenantEcommerceOrderOperationalEventView {
    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      productEntityId: record.productEntityId,
      orderDraftId: record.orderDraftId,
      dedupeKey: record.dedupeKey,
      eventType: record.eventType,
      sourceWorkspace: record.sourceWorkspace,
      status: record.status,
      summary: record.summary,
      payload: JSON.parse(record.payloadJson),
      occurredAt: record.occurredAt,
      createdAt: record.createdAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).ecommerceOrderOperationalEvent;
  }
}
