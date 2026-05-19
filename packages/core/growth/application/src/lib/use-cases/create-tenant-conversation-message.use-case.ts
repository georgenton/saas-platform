import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import {
  ConversationMessage,
  ConversationMessageDirection,
  ConversationThread,
} from '@saas-platform/growth-domain';
import { ConversationThreadNotFoundError } from '../errors/conversation-thread-not-found.error';
import { ConversationMessageIdGenerator } from '../ports/conversation-message-id.generator';
import { ConversationMessageRepository } from '../ports/conversation-message.repository';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';

export interface CreateTenantConversationMessageInput {
  tenantSlug: string;
  threadId: string;
  direction: ConversationMessageDirection;
  body: string;
  externalMessageId?: string | null;
}

export class CreateTenantConversationMessageUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
    private readonly conversationMessageRepository: ConversationMessageRepository,
    private readonly conversationMessageIdGenerator: ConversationMessageIdGenerator,
  ) {}

  async execute(
    input: CreateTenantConversationMessageInput,
  ): Promise<ConversationMessage> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const thread = await this.conversationThreadRepository.findByTenantIdAndId(
      tenant.id,
      input.threadId,
    );

    if (!thread) {
      throw new ConversationThreadNotFoundError(
        input.tenantSlug,
        input.threadId,
      );
    }

    const now = new Date();
    const message = ConversationMessage.create({
      id: this.conversationMessageIdGenerator.generate(),
      tenantId: tenant.id,
      threadId: thread.id,
      direction: input.direction,
      body: input.body.trim(),
      templateId: null,
      outboundIntentKey: null,
      provider: null,
      deliveryStatus: null,
      externalMessageId: this.normalizeOptionalValue(input.externalMessageId),
      failureReason: null,
      deliveredAt: null,
      readAt: null,
      createdAt: now,
    });

    await this.conversationMessageRepository.save(message);
    await this.conversationThreadRepository.save(
      this.withMessageActivity(thread, message.body, now),
    );

    return message;
  }

  private withMessageActivity(
    thread: ConversationThread,
    body: string,
    occurredAt: Date,
  ): ConversationThread {
    const data = thread.toPrimitives();

    return ConversationThread.create({
      ...data,
      latestMessagePreview: body.slice(0, 160),
      messageCount: data.messageCount + 1,
      lastActivityAt: occurredAt,
      updatedAt: occurredAt,
    });
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
