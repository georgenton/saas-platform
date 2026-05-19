import { Injectable } from '@nestjs/common';
import { ConversationDeliveryEventRepository } from '@saas-platform/growth-application';
import {
  ConversationDeliveryEvent,
  ConversationDeliveryEventProvider,
} from '@saas-platform/growth-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaConversationDeliveryEventRepository
  implements ConversationDeliveryEventRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(event: ConversationDeliveryEvent): Promise<void> {
    const data = event.toPrimitives();

    await this.conversationDeliveryEventDelegate.upsert({
      where: { id: data.id },
      update: {
        messageId: data.messageId,
        provider: data.provider,
        eventKey: data.eventKey,
        providerEventId: data.providerEventId,
        externalMessageId: data.externalMessageId,
        deliveryStatus: data.deliveryStatus,
        failureReason: data.failureReason,
        providerStatusDetail: data.providerStatusDetail,
        providerConversationCategory: data.providerConversationCategory,
        providerPricingCategory: data.providerPricingCategory,
        providerErrorCode: data.providerErrorCode,
        payloadJson: data.payloadJson,
        occurredAt: data.occurredAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        messageId: data.messageId,
        provider: data.provider,
        eventKey: data.eventKey,
        providerEventId: data.providerEventId,
        externalMessageId: data.externalMessageId,
        deliveryStatus: data.deliveryStatus,
        failureReason: data.failureReason,
        providerStatusDetail: data.providerStatusDetail,
        providerConversationCategory: data.providerConversationCategory,
        providerPricingCategory: data.providerPricingCategory,
        providerErrorCode: data.providerErrorCode,
        payloadJson: data.payloadJson,
        occurredAt: data.occurredAt,
        createdAt: data.createdAt,
      },
    });
  }

  async findByTenantIdAndProviderAndEventKey(
    tenantId: string,
    provider: string,
    eventKey: string,
  ): Promise<ConversationDeliveryEvent | null> {
    const event = await this.conversationDeliveryEventDelegate.findFirst({
      where: {
        tenantId,
        provider,
        eventKey,
      },
    });

    return event ? this.toDomain(event as any) : null;
  }

  async findByTenantIdAndMessageId(
    tenantId: string,
    messageId: string,
  ): Promise<ConversationDeliveryEvent[]> {
    const events = await this.conversationDeliveryEventDelegate.findMany({
      where: {
        tenantId,
        messageId,
      },
      orderBy: [{ occurredAt: 'asc' }, { createdAt: 'asc' }],
    });

    return events.map((event) => this.toDomain(event as any));
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    messageId: string | null;
    provider: string;
    eventKey: string;
    providerEventId: string | null;
    externalMessageId: string;
    deliveryStatus: string;
    failureReason: string | null;
    providerStatusDetail: string | null;
    providerConversationCategory: string | null;
    providerPricingCategory: string | null;
    providerErrorCode: string | null;
    payloadJson: string | null;
    occurredAt: Date;
    createdAt: Date;
  }): ConversationDeliveryEvent {
    return ConversationDeliveryEvent.create({
      id: record.id,
      tenantId: record.tenantId,
      messageId: record.messageId,
      provider: record.provider as ConversationDeliveryEventProvider,
      eventKey: record.eventKey,
      providerEventId: record.providerEventId,
      externalMessageId: record.externalMessageId,
      deliveryStatus: record.deliveryStatus,
      failureReason: record.failureReason,
      providerStatusDetail: record.providerStatusDetail,
      providerConversationCategory: record.providerConversationCategory,
      providerPricingCategory: record.providerPricingCategory,
      providerErrorCode: record.providerErrorCode,
      payloadJson: record.payloadJson,
      occurredAt: record.occurredAt,
      createdAt: record.createdAt,
    });
  }

  private get prismaClient(): PrismaService {
    return this.prisma;
  }

  private get conversationDeliveryEventDelegate(): any {
    return (this.prismaClient as any).conversationDeliveryEvent;
  }
}
