import { WebhookEventEnvelope } from '@saas-platform/growth-domain';

export type WebhookEventEnvelopeResponseDto = {
  id: string;
  tenantId: string;
  provider: string;
  channel: string;
  eventKey: string;
  providerEventId: string | null;
  payloadHash: string;
  signatureHeader: string | null;
  objectType: string | null;
  externalAccountId: string | null;
  externalPhoneNumberId: string | null;
  status: string;
  replayCount: number;
  lastReplayedAt: string | null;
  processedInboundMessages: number;
  processedDeliveryEvents: number;
  failureReason: string | null;
  payloadJson: string;
  receivedAt: string;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function toWebhookEventEnvelopeResponseDto(
  envelope: WebhookEventEnvelope,
): WebhookEventEnvelopeResponseDto {
  const data = envelope.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    provider: data.provider,
    channel: data.channel,
    eventKey: data.eventKey,
    providerEventId: data.providerEventId,
    payloadHash: data.payloadHash,
    signatureHeader: data.signatureHeader,
    objectType: data.objectType,
    externalAccountId: data.externalAccountId,
    externalPhoneNumberId: data.externalPhoneNumberId,
    status: data.status,
    replayCount: data.replayCount,
    lastReplayedAt: data.lastReplayedAt?.toISOString() ?? null,
    processedInboundMessages: data.processedInboundMessages,
    processedDeliveryEvents: data.processedDeliveryEvents,
    failureReason: data.failureReason,
    payloadJson: data.payloadJson,
    receivedAt: data.receivedAt.toISOString(),
    processedAt: data.processedAt?.toISOString() ?? null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
}
