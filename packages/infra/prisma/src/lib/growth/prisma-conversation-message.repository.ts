import { Injectable } from '@nestjs/common';
import {
  ConversationMessageRepository,
} from '@saas-platform/growth-application';
import {
  ConversationMessage,
  ConversationMessageDeliveryStatus,
  ConversationMessageDirection,
  ConversationMessageProvider,
} from '@saas-platform/growth-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaConversationMessageRepository
  implements ConversationMessageRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(message: ConversationMessage): Promise<void> {
    const data = message.toPrimitives();

    await this.conversationMessageDelegate.upsert({
      where: { id: data.id },
      update: {
        direction: data.direction,
        body: data.body,
        templateId: data.templateId,
        outboundIntentKey: data.outboundIntentKey,
        provider: data.provider,
        deliveryStatus: data.deliveryStatus,
        externalMessageId: data.externalMessageId,
        failureReason: data.failureReason,
        deliveredAt: data.deliveredAt,
        readAt: data.readAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        threadId: data.threadId,
        direction: data.direction,
        body: data.body,
        templateId: data.templateId,
        outboundIntentKey: data.outboundIntentKey,
        provider: data.provider,
        deliveryStatus: data.deliveryStatus,
        externalMessageId: data.externalMessageId,
        failureReason: data.failureReason,
        deliveredAt: data.deliveredAt,
        readAt: data.readAt,
        createdAt: data.createdAt,
      },
    });
  }

  async findByTenantId(tenantId: string): Promise<ConversationMessage[]> {
    const messages = await this.conversationMessageDelegate.findMany({
      where: {
        tenantId,
      },
      orderBy: [{ createdAt: 'asc' }],
    });

    return messages.map((message) => this.toDomain(message as any));
  }

  async findByTenantIdAndThreadId(
    tenantId: string,
    threadId: string,
  ): Promise<ConversationMessage[]> {
    const messages = await this.conversationMessageDelegate.findMany({
      where: {
        tenantId,
        threadId,
      },
      orderBy: [{ createdAt: 'asc' }],
    });

    return messages.map((message) => this.toDomain(message as any));
  }

  async findByTenantIdAndExternalMessageId(
    tenantId: string,
    externalMessageId: string,
  ): Promise<ConversationMessage | null> {
    const message = await this.conversationMessageDelegate.findFirst({
      where: {
        tenantId,
        externalMessageId,
      },
    });

    return message ? this.toDomain(message as any) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    threadId: string;
    direction: string;
    body: string;
    templateId: string | null;
    outboundIntentKey: string | null;
    provider: string | null;
    deliveryStatus: string | null;
    externalMessageId: string | null;
    failureReason: string | null;
    deliveredAt: Date | null;
    readAt: Date | null;
    createdAt: Date;
  }): ConversationMessage {
    return ConversationMessage.create({
      id: record.id,
      tenantId: record.tenantId,
      threadId: record.threadId,
      direction: record.direction as ConversationMessageDirection,
      body: record.body,
      templateId: record.templateId,
      outboundIntentKey: record.outboundIntentKey,
      provider: record.provider as ConversationMessageProvider | null,
      deliveryStatus:
        record.deliveryStatus as ConversationMessageDeliveryStatus | null,
      externalMessageId: record.externalMessageId,
      failureReason: record.failureReason,
      deliveredAt: record.deliveredAt,
      readAt: record.readAt,
      createdAt: record.createdAt,
    });
  }

  private get prismaClient(): PrismaService {
    return this.prisma;
  }

  private get conversationMessageDelegate(): any {
    return (this.prismaClient as any).conversationMessage;
  }
}
