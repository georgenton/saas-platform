export type ConversationDeliveryEventProvider =
  | 'meta_cloud_api_stub'
  | 'meta_cloud_api';

export interface ConversationDeliveryEventProps {
  id: string;
  tenantId: string;
  messageId: string | null;
  provider: ConversationDeliveryEventProvider;
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
  occurredAt: Date;
  createdAt: Date;
}

export class ConversationDeliveryEvent {
  private constructor(private readonly props: ConversationDeliveryEventProps) {}

  static create(
    props: ConversationDeliveryEventProps,
  ): ConversationDeliveryEvent {
    return new ConversationDeliveryEvent(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get messageId(): string | null {
    return this.props.messageId;
  }

  get provider(): ConversationDeliveryEventProvider {
    return this.props.provider;
  }

  get eventKey(): string {
    return this.props.eventKey;
  }

  get providerEventId(): string | null {
    return this.props.providerEventId;
  }

  get externalMessageId(): string {
    return this.props.externalMessageId;
  }

  get deliveryStatus(): string {
    return this.props.deliveryStatus;
  }

  get failureReason(): string | null {
    return this.props.failureReason;
  }

  get providerStatusDetail(): string | null {
    return this.props.providerStatusDetail;
  }

  get providerConversationCategory(): string | null {
    return this.props.providerConversationCategory;
  }

  get providerPricingCategory(): string | null {
    return this.props.providerPricingCategory;
  }

  get providerErrorCode(): string | null {
    return this.props.providerErrorCode;
  }

  get payloadJson(): string | null {
    return this.props.payloadJson;
  }

  get occurredAt(): Date {
    return this.props.occurredAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toPrimitives(): ConversationDeliveryEventProps {
    return { ...this.props };
  }
}
