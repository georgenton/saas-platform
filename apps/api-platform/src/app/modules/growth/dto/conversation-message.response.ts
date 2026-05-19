import { ConversationMessage } from '@saas-platform/growth-domain';

export interface ConversationMessageResponseDto {
  id: string;
  tenantId: string;
  threadId: string;
  direction: string;
  body: string;
  templateId: string | null;
  outboundIntentKey: string | null;
  provider: string | null;
  deliveryStatus: string | null;
  externalMessageId: string | null;
  failureReason: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  createdAt: string;
}

export const toConversationMessageResponseDto = (
  message: ConversationMessage,
): ConversationMessageResponseDto => {
  const data = message.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    threadId: data.threadId,
    direction: data.direction,
    body: data.body,
    templateId: data.templateId ?? null,
    outboundIntentKey: data.outboundIntentKey ?? null,
    provider: data.provider ?? null,
    deliveryStatus: data.deliveryStatus ?? null,
    externalMessageId: data.externalMessageId,
    failureReason: data.failureReason ?? null,
    deliveredAt: data.deliveredAt?.toISOString() ?? null,
    readAt: data.readAt?.toISOString() ?? null,
    createdAt: data.createdAt.toISOString(),
  };
};
