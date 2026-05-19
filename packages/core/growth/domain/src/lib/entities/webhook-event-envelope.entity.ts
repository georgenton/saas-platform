export type WebhookEventProvider = 'meta_cloud_api_stub' | 'meta_cloud_api';
export type WebhookEventChannel = 'whatsapp';
export type WebhookEventEnvelopeStatus =
  | 'received'
  | 'processed'
  | 'ignored'
  | 'failed';

export interface WebhookEventEnvelopeProps {
  id: string;
  tenantId: string;
  provider: WebhookEventProvider;
  channel: WebhookEventChannel;
  eventKey: string;
  providerEventId: string | null;
  payloadHash: string;
  signatureHeader: string | null;
  objectType: string | null;
  externalAccountId: string | null;
  externalPhoneNumberId: string | null;
  status: WebhookEventEnvelopeStatus;
  replayCount: number;
  lastReplayedAt: Date | null;
  processedInboundMessages: number;
  processedDeliveryEvents: number;
  failureReason: string | null;
  payloadJson: string;
  receivedAt: Date;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class WebhookEventEnvelope {
  private constructor(private readonly props: WebhookEventEnvelopeProps) {}

  static create(props: WebhookEventEnvelopeProps): WebhookEventEnvelope {
    return new WebhookEventEnvelope(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get provider(): WebhookEventProvider {
    return this.props.provider;
  }

  get channel(): WebhookEventChannel {
    return this.props.channel;
  }

  get eventKey(): string {
    return this.props.eventKey;
  }

  get providerEventId(): string | null {
    return this.props.providerEventId;
  }

  get payloadHash(): string {
    return this.props.payloadHash;
  }

  get signatureHeader(): string | null {
    return this.props.signatureHeader;
  }

  get objectType(): string | null {
    return this.props.objectType;
  }

  get externalAccountId(): string | null {
    return this.props.externalAccountId;
  }

  get externalPhoneNumberId(): string | null {
    return this.props.externalPhoneNumberId;
  }

  get status(): WebhookEventEnvelopeStatus {
    return this.props.status;
  }

  get replayCount(): number {
    return this.props.replayCount;
  }

  get lastReplayedAt(): Date | null {
    return this.props.lastReplayedAt;
  }

  get processedInboundMessages(): number {
    return this.props.processedInboundMessages;
  }

  get processedDeliveryEvents(): number {
    return this.props.processedDeliveryEvents;
  }

  get failureReason(): string | null {
    return this.props.failureReason;
  }

  get payloadJson(): string {
    return this.props.payloadJson;
  }

  get receivedAt(): Date {
    return this.props.receivedAt;
  }

  get processedAt(): Date | null {
    return this.props.processedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): WebhookEventEnvelopeProps {
    return { ...this.props };
  }
}
