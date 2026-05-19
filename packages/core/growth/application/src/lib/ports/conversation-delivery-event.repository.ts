import { ConversationDeliveryEvent } from '@saas-platform/growth-domain';

export interface ConversationDeliveryEventRepository {
  save(event: ConversationDeliveryEvent): Promise<void>;
  findByTenantIdAndProviderAndEventKey(
    tenantId: string,
    provider: string,
    eventKey: string,
  ): Promise<ConversationDeliveryEvent | null>;
  findByTenantIdAndMessageId(
    tenantId: string,
    messageId: string,
  ): Promise<ConversationDeliveryEvent[]>;
}
