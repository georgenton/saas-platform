import { Injectable } from '@nestjs/common';
import {
  ConversationThreadRepository,
} from '@saas-platform/growth-application';
import {
  ConversationChannel,
  ConversationThread,
  ConversationThreadStatus,
} from '@saas-platform/growth-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaConversationThreadRepository
  implements ConversationThreadRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(thread: ConversationThread): Promise<void> {
    const data = thread.toPrimitives();

    await this.conversationThreadDelegate.upsert({
      where: { id: data.id },
      update: {
        leadId: data.leadId,
        assigneeUserId: data.assigneeUserId,
        subject: data.subject,
        channel: data.channel,
        externalConversationId: data.externalConversationId,
        participantDisplayName: data.participantDisplayName,
        participantHandle: data.participantHandle,
        status: data.status,
        latestMessagePreview: data.latestMessagePreview,
        messageCount: data.messageCount,
        openedAt: data.openedAt,
        closedAt: data.closedAt,
        lastActivityAt: data.lastActivityAt,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        leadId: data.leadId,
        assigneeUserId: data.assigneeUserId,
        subject: data.subject,
        channel: data.channel,
        externalConversationId: data.externalConversationId,
        participantDisplayName: data.participantDisplayName,
        participantHandle: data.participantHandle,
        status: data.status,
        latestMessagePreview: data.latestMessagePreview,
        messageCount: data.messageCount,
        openedAt: data.openedAt,
        closedAt: data.closedAt,
        lastActivityAt: data.lastActivityAt,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantId(
    tenantId: string,
    assigneeUserId?: string | null,
  ): Promise<ConversationThread[]> {
    const threads = await this.conversationThreadDelegate.findMany({
      where: {
        tenantId,
        ...(assigneeUserId ? { assigneeUserId } : {}),
      },
      orderBy: [{ lastActivityAt: 'desc' }, { createdAt: 'desc' }],
    });

    return threads.map((thread) => this.toDomain(thread as any));
  }

  async findByTenantIdAndChannel(
    tenantId: string,
    channel: ConversationChannel,
    assigneeUserId?: string | null,
  ): Promise<ConversationThread[]> {
    const threads = await this.conversationThreadDelegate.findMany({
      where: {
        tenantId,
        channel,
        ...(assigneeUserId ? { assigneeUserId } : {}),
      },
      orderBy: [{ lastActivityAt: 'desc' }, { createdAt: 'desc' }],
    });

    return threads.map((thread) => this.toDomain(thread as any));
  }

  async findByTenantIdAndId(
    tenantId: string,
    threadId: string,
  ): Promise<ConversationThread | null> {
    const thread = await this.conversationThreadDelegate.findFirst({
      where: {
        id: threadId,
        tenantId,
      },
    });

    return thread ? this.toDomain(thread as any) : null;
  }

  async findByTenantIdAndChannelAndExternalConversationId(
    tenantId: string,
    channel: ConversationChannel,
    externalConversationId: string,
  ): Promise<ConversationThread | null> {
    const thread = await this.conversationThreadDelegate.findFirst({
      where: {
        tenantId,
        channel,
        externalConversationId,
      },
    });

    return thread ? this.toDomain(thread as any) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    leadId: string | null;
    assigneeUserId: string | null;
    subject: string;
    channel: string;
    externalConversationId: string | null;
    participantDisplayName: string | null;
    participantHandle: string | null;
    status: string;
    latestMessagePreview: string | null;
    messageCount: number;
    openedAt: Date;
    closedAt: Date | null;
    lastActivityAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }): ConversationThread {
    return ConversationThread.create({
      id: record.id,
      tenantId: record.tenantId,
      leadId: record.leadId,
      assigneeUserId: record.assigneeUserId,
      subject: record.subject,
      channel: record.channel as ConversationChannel,
      externalConversationId: record.externalConversationId,
      participantDisplayName: record.participantDisplayName,
      participantHandle: record.participantHandle,
      status: record.status as ConversationThreadStatus,
      latestMessagePreview: record.latestMessagePreview,
      messageCount: record.messageCount,
      openedAt: record.openedAt,
      closedAt: record.closedAt,
      lastActivityAt: record.lastActivityAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private get prismaClient(): PrismaService {
    return this.prisma;
  }

  private get conversationThreadDelegate(): any {
    return (this.prismaClient as any).conversationThread;
  }
}
