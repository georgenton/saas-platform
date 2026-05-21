import { ConversationMessage } from '@saas-platform/growth-domain';

export interface ConversationMessageRepository {
  save(message: ConversationMessage): Promise<void>;
  findByTenantId(tenantId: string): Promise<ConversationMessage[]>;
  findByTenantIdAndId(
    tenantId: string,
    messageId: string,
  ): Promise<ConversationMessage | null>;
  findByTenantIdAndThreadId(
    tenantId: string,
    threadId: string,
  ): Promise<ConversationMessage[]>;
  findByTenantIdAndExternalMessageId(
    tenantId: string,
    externalMessageId: string,
  ): Promise<ConversationMessage | null>;
}
