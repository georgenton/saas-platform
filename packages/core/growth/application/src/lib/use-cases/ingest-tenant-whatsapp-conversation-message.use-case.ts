import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import {
  ConversationMessage,
  ConversationMessageProvider,
  ConversationThread,
} from '@saas-platform/growth-domain';
import { LeadNotFoundError } from '../errors/lead-not-found.error';
import { ConversationMessageIdGenerator } from '../ports/conversation-message-id.generator';
import { ConversationMessageRepository } from '../ports/conversation-message.repository';
import { ConversationThreadIdGenerator } from '../ports/conversation-thread-id.generator';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';
import { LeadRepository } from '../ports/lead.repository';

export interface IngestTenantWhatsappConversationMessageInput {
  tenantSlug: string;
  externalConversationId: string;
  participantHandle: string;
  participantDisplayName?: string | null;
  leadId?: string | null;
  body: string;
  externalMessageId?: string | null;
  provider?: ConversationMessageProvider;
  occurredAt?: Date | null;
}

export interface IngestTenantWhatsappConversationMessageResult {
  thread: ConversationThread;
  message: ConversationMessage;
  createdThread: boolean;
}

export class IngestTenantWhatsappConversationMessageUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly leadRepository: LeadRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
    private readonly conversationThreadIdGenerator: ConversationThreadIdGenerator,
    private readonly conversationMessageRepository: ConversationMessageRepository,
    private readonly conversationMessageIdGenerator: ConversationMessageIdGenerator,
  ) {}

  async execute(
    input: IngestTenantWhatsappConversationMessageInput,
  ): Promise<IngestTenantWhatsappConversationMessageResult> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const normalizedLeadId = this.normalizeOptionalValue(input.leadId);

    if (normalizedLeadId) {
      const lead = await this.leadRepository.findByTenantIdAndId(
        tenant.id,
        normalizedLeadId,
      );

      if (!lead) {
        throw new LeadNotFoundError(input.tenantSlug, normalizedLeadId);
      }
    }

    const occurredAt = input.occurredAt ?? new Date();
    const externalConversationId = input.externalConversationId.trim();
    const participantHandle = input.participantHandle.trim();
    const participantDisplayName = this.normalizeOptionalValue(
      input.participantDisplayName,
    );
    const normalizedExternalMessageId = this.normalizeOptionalValue(
      input.externalMessageId,
    );

    if (normalizedExternalMessageId) {
      const existingMessage =
        await this.conversationMessageRepository.findByTenantIdAndExternalMessageId(
          tenant.id,
          normalizedExternalMessageId,
        );

      if (existingMessage) {
        const existingThread =
          await this.conversationThreadRepository.findByTenantIdAndId(
            tenant.id,
            existingMessage.threadId,
          );

        if (existingThread) {
          return {
            thread: existingThread,
            message: existingMessage,
            createdThread: false,
          };
        }
      }
    }

    const existingThread =
      await this.conversationThreadRepository.findByTenantIdAndChannelAndExternalConversationId(
        tenant.id,
        'whatsapp',
        externalConversationId,
      );

    const thread = existingThread
      ? this.withInboundActivity(
          existingThread,
          normalizedLeadId,
          participantDisplayName,
          participantHandle,
          input.body,
          occurredAt,
        )
      : this.createNewThread({
          tenantId: tenant.id,
          leadId: normalizedLeadId,
          externalConversationId,
          participantDisplayName,
          participantHandle,
          body: input.body,
          occurredAt,
        });

    const message = ConversationMessage.create({
      id: this.conversationMessageIdGenerator.generate(),
      tenantId: tenant.id,
      threadId: thread.id,
      direction: 'inbound',
      body: input.body.trim(),
      templateId: null,
      outboundIntentKey: null,
      provider: input.provider ?? 'meta_cloud_api_stub',
      deliveryStatus: 'delivered',
      externalMessageId: normalizedExternalMessageId,
      failureReason: null,
      deliveredAt: occurredAt,
      readAt: null,
      createdAt: occurredAt,
    });

    await this.conversationThreadRepository.save(thread);
    await this.conversationMessageRepository.save(message);

    return {
      thread,
      message,
      createdThread: !existingThread,
    };
  }

  private createNewThread(input: {
    tenantId: string;
    leadId: string | null;
    externalConversationId: string;
    participantDisplayName: string | null;
    participantHandle: string;
    body: string;
    occurredAt: Date;
  }): ConversationThread {
    return ConversationThread.create({
      id: this.conversationThreadIdGenerator.generate(),
      tenantId: input.tenantId,
      leadId: input.leadId,
      assigneeUserId: null,
      subject:
        input.participantDisplayName ??
        `WhatsApp ${input.participantHandle}`,
      channel: 'whatsapp',
      externalConversationId: input.externalConversationId,
      participantDisplayName: input.participantDisplayName,
      participantHandle: input.participantHandle,
      status: 'open',
      latestMessagePreview: input.body.trim().slice(0, 160),
      messageCount: 1,
      openedAt: input.occurredAt,
      closedAt: null,
      lastActivityAt: input.occurredAt,
      createdAt: input.occurredAt,
      updatedAt: input.occurredAt,
    });
  }

  private withInboundActivity(
    thread: ConversationThread,
    leadId: string | null,
    participantDisplayName: string | null,
    participantHandle: string,
    body: string,
    occurredAt: Date,
  ): ConversationThread {
    const data = thread.toPrimitives();

    return ConversationThread.create({
      ...data,
      leadId: data.leadId ?? leadId,
      assigneeUserId: data.assigneeUserId,
      participantDisplayName: participantDisplayName ?? data.participantDisplayName,
      participantHandle: participantHandle || data.participantHandle,
      latestMessagePreview: body.trim().slice(0, 160),
      messageCount: data.messageCount + 1,
      status: 'open',
      closedAt: null,
      lastActivityAt: occurredAt,
      updatedAt: occurredAt,
    });
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
