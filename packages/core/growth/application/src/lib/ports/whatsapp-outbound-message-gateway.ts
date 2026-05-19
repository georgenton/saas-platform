import {
  ConversationMessageDeliveryStatus,
  ConversationMessageProvider,
} from '@saas-platform/growth-domain';

export interface SendWhatsappOutboundMessageInput {
  tenantSlug: string;
  threadId: string;
  recipientHandle: string;
  body: string;
  template?: {
    providerTemplateName: string;
    languageCode: string;
    bodyParameterValues: string[];
  } | null;
}

export interface SendWhatsappOutboundMessageResult {
  provider: ConversationMessageProvider;
  externalMessageId: string | null;
  deliveryStatus: ConversationMessageDeliveryStatus;
  failureReason: string | null;
  providerResponseJson: string | null;
}

export interface WhatsappOutboundMessageGateway {
  send(
    input: SendWhatsappOutboundMessageInput,
  ): Promise<SendWhatsappOutboundMessageResult>;
}
