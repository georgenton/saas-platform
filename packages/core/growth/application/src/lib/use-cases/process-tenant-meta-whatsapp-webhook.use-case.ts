import { IngestTenantWhatsappConversationMessageUseCase } from './ingest-tenant-whatsapp-conversation-message.use-case';
import { ExecuteTenantWhatsappAutomationActionsUseCase } from './execute-tenant-whatsapp-automation-actions.use-case';
import { IngestTenantWhatsappDeliveryEventUseCase } from './ingest-tenant-whatsapp-delivery-event.use-case';

export interface MetaWhatsappWebhookContact {
  profile?: {
    name?: string;
  };
  wa_id?: string;
}

export interface MetaWhatsappWebhookMessage {
  id?: string;
  from?: string;
  timestamp?: string;
  type?: string;
  text?: {
    body?: string;
  };
  button?: {
    text?: string;
  };
  interactive?: {
    type?: string;
  };
}

export interface MetaWhatsappWebhookStatus {
  id?: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp?: string;
  conversation?: {
    origin?: {
      type?: string;
    };
  };
  pricing?: {
    category?: string;
  };
  errors?: Array<{
    code?: number | string;
    title?: string;
    message?: string;
    error_data?: {
      details?: string;
    };
  }>;
}

export interface MetaWhatsappWebhookValue {
  metadata?: {
    phone_number_id?: string;
    display_phone_number?: string;
  };
  contacts?: MetaWhatsappWebhookContact[];
  messages?: MetaWhatsappWebhookMessage[];
  statuses?: MetaWhatsappWebhookStatus[];
}

export interface MetaWhatsappWebhookChange {
  field?: string;
  value?: MetaWhatsappWebhookValue;
}

export interface MetaWhatsappWebhookEntry {
  id?: string;
  changes?: MetaWhatsappWebhookChange[];
}

export interface ProcessTenantMetaWhatsappWebhookInput {
  tenantSlug: string;
  provider?: 'meta_cloud_api_stub' | 'meta_cloud_api';
  webhookEventKey?: string | null;
  rawPayloadJson?: string | null;
  payload: {
    object?: string;
    entry?: MetaWhatsappWebhookEntry[];
  };
}

export interface ProcessTenantMetaWhatsappWebhookResult {
  processedInboundMessages: number;
  processedDeliveryEvents: number;
}

export class ProcessTenantMetaWhatsappWebhookUseCase {
  constructor(
    private readonly ingestTenantWhatsappConversationMessageUseCase: IngestTenantWhatsappConversationMessageUseCase,
    private readonly ingestTenantWhatsappDeliveryEventUseCase: IngestTenantWhatsappDeliveryEventUseCase,
    private readonly executeTenantWhatsappAutomationActionsUseCase: ExecuteTenantWhatsappAutomationActionsUseCase,
  ) {}

  async execute(
    input: ProcessTenantMetaWhatsappWebhookInput,
  ): Promise<ProcessTenantMetaWhatsappWebhookResult> {
    let processedInboundMessages = 0;
    let processedDeliveryEvents = 0;

    for (const [entryIndex, entry] of (input.payload.entry ?? []).entries()) {
      for (const [changeIndex, change] of (entry.changes ?? []).entries()) {
        const value = change.value;

        if (!value) {
          continue;
        }

        const contactIndex = new Map<string, MetaWhatsappWebhookContact>();

        for (const contact of value.contacts ?? []) {
          if (contact.wa_id) {
            contactIndex.set(contact.wa_id, contact);
          }
        }

        for (const message of value.messages ?? []) {
          const from = message.from?.trim();

          if (!from) {
            continue;
          }

          const result =
            await this.ingestTenantWhatsappConversationMessageUseCase.execute({
            tenantSlug: input.tenantSlug,
            externalConversationId: from,
            participantHandle: from,
            participantDisplayName:
              contactIndex.get(from)?.profile?.name ?? null,
            body: this.extractInboundBody(message),
            externalMessageId: message.id ?? null,
            provider: input.provider ?? 'meta_cloud_api_stub',
            occurredAt: this.parseMetaTimestamp(message.timestamp),
          });
          await this.executeTenantWhatsappAutomationActionsUseCase.execute({
            tenantSlug: input.tenantSlug,
            threadId: result.thread.id,
            triggerEvent: 'inbound_message',
            triggerMessageId: result.message.id,
            triggerExternalMessageId: result.message.externalMessageId,
            executionKey: [
              input.webhookEventKey,
              result.message.externalMessageId ?? result.message.id,
            ]
              .filter((value) => !!value)
              .join(':'),
            occurredAt: result.message.createdAt,
          });

          processedInboundMessages += 1;
        }

        for (const [statusIndex, status] of (value.statuses ?? []).entries()) {
          const externalMessageId = status.id?.trim();
          const deliveryStatus = this.mapDeliveryStatus(status.status);

          if (!externalMessageId || !deliveryStatus) {
            continue;
          }

          const messageResult =
            await this.ingestTenantWhatsappDeliveryEventUseCase.execute({
            tenantSlug: input.tenantSlug,
            externalMessageId,
            deliveryStatus,
            provider: input.provider ?? 'meta_cloud_api_stub',
            providerEventId: status.id ?? null,
            payloadJson: input.rawPayloadJson ?? null,
            eventKey: this.buildDeliveryEventKey(
              input.webhookEventKey,
              externalMessageId,
              deliveryStatus,
              entryIndex,
              changeIndex,
              statusIndex,
            ),
            failureReason: this.extractFailureReason(status),
            providerStatusDetail: this.extractProviderStatusDetail(status),
            providerConversationCategory:
              status.conversation?.origin?.type?.trim() ?? null,
            providerPricingCategory:
              status.pricing?.category?.trim() ?? null,
            providerErrorCode: this.extractProviderErrorCode(status),
            occurredAt: this.parseMetaTimestamp(status.timestamp),
          });
          await this.executeTenantWhatsappAutomationActionsUseCase.execute({
            tenantSlug: input.tenantSlug,
            threadId: messageResult.threadId,
            triggerEvent: 'delivery_status_changed',
            triggerMessageId: messageResult.id,
            triggerExternalMessageId: messageResult.externalMessageId,
            triggerDeliveryStatus: messageResult.deliveryStatus,
            executionKey: this.buildDeliveryEventKey(
              input.webhookEventKey,
              externalMessageId,
              deliveryStatus,
              entryIndex,
              changeIndex,
              statusIndex,
            ),
            occurredAt: this.parseMetaTimestamp(status.timestamp),
          });

          processedDeliveryEvents += 1;
        }
      }
    }

    return {
      processedInboundMessages,
      processedDeliveryEvents,
    };
  }

  private extractInboundBody(message: MetaWhatsappWebhookMessage): string {
    const textBody = message.text?.body?.trim();

    if (textBody) {
      return textBody;
    }

    const buttonText = message.button?.text?.trim();

    if (buttonText) {
      return buttonText;
    }

    const messageType = message.type?.trim() ?? 'unknown';

    if (messageType === 'interactive') {
      return '[interactive message]';
    }

    return `[${messageType} message]`;
  }

  private mapDeliveryStatus(
    status?: string,
  ): 'sent' | 'delivered' | 'read' | 'failed' | null {
    if (
      status === 'sent' ||
      status === 'delivered' ||
      status === 'read' ||
      status === 'failed'
    ) {
      return status;
    }

    return null;
  }

  private extractFailureReason(
    status: MetaWhatsappWebhookStatus,
  ): string | null {
    const firstError = status.errors?.[0];

    return (
      firstError?.error_data?.details?.trim() ??
      firstError?.message?.trim() ??
      firstError?.title?.trim() ??
      null
    );
  }

  private extractProviderStatusDetail(
    status: MetaWhatsappWebhookStatus,
  ): string | null {
    const explicitDetail = this.extractFailureReason(status);

    if (explicitDetail) {
      return explicitDetail;
    }

    const conversationCategory = status.conversation?.origin?.type?.trim();
    const pricingCategory = status.pricing?.category?.trim();

    if (conversationCategory && pricingCategory) {
      return `conversation:${conversationCategory};pricing:${pricingCategory}`;
    }

    if (conversationCategory) {
      return `conversation:${conversationCategory}`;
    }

    if (pricingCategory) {
      return `pricing:${pricingCategory}`;
    }

    return null;
  }

  private extractProviderErrorCode(
    status: MetaWhatsappWebhookStatus,
  ): string | null {
    const rawCode = status.errors?.[0]?.code;

    if (rawCode === undefined || rawCode === null) {
      return null;
    }

    const code = String(rawCode).trim();

    return code ? code : null;
  }

  private parseMetaTimestamp(value?: string): Date | null {
    const timestamp = value?.trim();

    if (!timestamp) {
      return null;
    }

    const numericTimestamp = Number(timestamp);

    if (Number.isFinite(numericTimestamp)) {
      return new Date(numericTimestamp * 1000);
    }

    const parsedDate = new Date(timestamp);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  private buildDeliveryEventKey(
    webhookEventKey: string | null | undefined,
    externalMessageId: string,
    deliveryStatus: 'sent' | 'delivered' | 'read' | 'failed',
    entryIndex: number,
    changeIndex: number,
    statusIndex: number,
  ): string {
    const normalizedEnvelopeEventKey = webhookEventKey?.trim();

    if (normalizedEnvelopeEventKey) {
      return `${normalizedEnvelopeEventKey}:status:${entryIndex}:${changeIndex}:${statusIndex}:${deliveryStatus}`;
    }

    return `${externalMessageId}:${deliveryStatus}:${entryIndex}:${changeIndex}:${statusIndex}`;
  }
}
