import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { ConversationThread } from '@saas-platform/growth-domain';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';

export class ListTenantConversationThreadsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
  ) {}

  async execute(
    tenantSlug: string,
    assigneeUserId?: string | null,
  ): Promise<ConversationThread[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.conversationThreadRepository.findByTenantId(
      tenant.id,
      assigneeUserId?.trim() || null,
    );
  }
}
