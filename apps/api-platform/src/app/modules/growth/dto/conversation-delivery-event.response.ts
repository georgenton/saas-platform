import { ConversationDeliveryEvent } from '@saas-platform/growth-domain';

export interface ConversationDeliveryEventResponseDto {
  id: string;
  tenantId: string;
  messageId: string | null;
  provider: string;
  eventKey: string;
  providerEventId: string | null;
  externalMessageId: string;
  deliveryStatus: string;
  failureReason: string | null;
  providerStatusDetail: string | null;
  providerConversationCategory: string | null;
  providerPricingCategory: string | null;
  providerErrorCode: string | null;
  payloadJson: string | null;
  occurredAt: string;
  createdAt: string;
}

export const toConversationDeliveryEventResponseDto = (
  event: ConversationDeliveryEvent,
): ConversationDeliveryEventResponseDto => {
  const data = event.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    messageId: data.messageId,
    provider: data.provider,
    eventKey: data.eventKey,
    providerEventId: data.providerEventId,
    externalMessageId: data.externalMessageId,
    deliveryStatus: data.deliveryStatus,
    failureReason: data.failureReason,
    providerStatusDetail: data.providerStatusDetail,
    providerConversationCategory: data.providerConversationCategory,
    providerPricingCategory: data.providerPricingCategory,
    providerErrorCode: data.providerErrorCode,
    payloadJson: data.payloadJson,
    occurredAt: data.occurredAt.toISOString(),
    createdAt: data.createdAt.toISOString(),
  };
};
