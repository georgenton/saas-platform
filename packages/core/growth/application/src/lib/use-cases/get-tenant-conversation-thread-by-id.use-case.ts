import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { ConversationThread } from '@saas-platform/growth-domain';
import { ConversationThreadNotFoundError } from '../errors/conversation-thread-not-found.error';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';

export class GetTenantConversationThreadByIdUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
  ) {}

  async execute(
    tenantSlug: string,
    threadId: string,
  ): Promise<ConversationThread> {
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

    return thread;
  }
}
