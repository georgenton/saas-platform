import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { ConversationMessage } from '@saas-platform/growth-domain';
import { ConversationThreadNotFoundError } from '../errors/conversation-thread-not-found.error';
import { ConversationMessageRepository } from '../ports/conversation-message.repository';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';

export class ListTenantConversationMessagesUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
    private readonly conversationMessageRepository: ConversationMessageRepository,
  ) {}

  async execute(
    tenantSlug: string,
    threadId: string,
  ): Promise<ConversationMessage[]> {
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

    return this.conversationMessageRepository.findByTenantIdAndThreadId(
      tenant.id,
      thread.id,
    );
  }
}
