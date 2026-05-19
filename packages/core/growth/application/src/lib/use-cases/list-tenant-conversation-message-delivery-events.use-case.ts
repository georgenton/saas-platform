import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { ConversationDeliveryEvent } from '@saas-platform/growth-domain';
import { ConversationThreadNotFoundError } from '../errors/conversation-thread-not-found.error';
import { ConversationDeliveryEventRepository } from '../ports/conversation-delivery-event.repository';
import { ConversationMessageRepository } from '../ports/conversation-message.repository';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';

export class ListTenantConversationMessageDeliveryEventsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
    private readonly conversationMessageRepository: ConversationMessageRepository,
    private readonly conversationDeliveryEventRepository: ConversationDeliveryEventRepository,
  ) {}

  async execute(
    tenantSlug: string,
    threadId: string,
    messageId: string,
  ): Promise<ConversationDeliveryEvent[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const thread = await this.conversationThreadRepository.findByTenantIdAndId(
      tenant.id,
      threadId,
    );

    if (!thread) {
      throw new ConversationThreadNotFoundError(tenantSlug, threadId);
    }

    const messages =
      await this.conversationMessageRepository.findByTenantIdAndThreadId(
        tenant.id,
        threadId,
      );
    const message = messages.find((item) => item.id === messageId);

    if (!message) {
      throw new ConversationThreadNotFoundError(tenantSlug, messageId);
    }

    return this.conversationDeliveryEventRepository.findByTenantIdAndMessageId(
      tenant.id,
      message.id,
    );
  }
}
