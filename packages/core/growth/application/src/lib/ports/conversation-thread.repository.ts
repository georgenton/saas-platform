import {
  ConversationChannel,
  ConversationThread,
} from '@saas-platform/growth-domain';

export interface ConversationThreadRepository {
  save(thread: ConversationThread): Promise<void>;
  findByTenantId(
    tenantId: string,
    assigneeUserId?: string | null,
  ): Promise<ConversationThread[]>;
  findByTenantIdAndChannel(
    tenantId: string,
    channel: ConversationChannel,
    assigneeUserId?: string | null,
  ): Promise<ConversationThread[]>;
  findByTenantIdAndId(
    tenantId: string,
    threadId: string,
  ): Promise<ConversationThread | null>;
  findByTenantIdAndChannelAndExternalConversationId(
    tenantId: string,
    channel: ConversationChannel,
    externalConversationId: string,
  ): Promise<ConversationThread | null>;
}
