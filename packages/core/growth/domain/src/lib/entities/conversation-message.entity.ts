export type ConversationMessageDirection = 'inbound' | 'outbound' | 'internal';
export type ConversationMessageProvider =
  | 'meta_cloud_api_stub'
  | 'meta_cloud_api';
export type ConversationMessageDeliveryStatus =
  | 'pending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed';

export interface ConversationMessageProps {
  id: string;
  tenantId: string;
  threadId: string;
  direction: ConversationMessageDirection;
  body: string;
  templateId: string | null;
  outboundIntentKey: string | null;
  provider: ConversationMessageProvider | null;
  deliveryStatus: ConversationMessageDeliveryStatus | null;
  externalMessageId: string | null;
  failureReason: string | null;
  deliveredAt: Date | null;
  readAt: Date | null;
  createdAt: Date;
}

export class ConversationMessage {
  private constructor(private readonly props: ConversationMessageProps) {}

  static create(props: ConversationMessageProps): ConversationMessage {
    return new ConversationMessage(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get threadId(): string {
    return this.props.threadId;
  }

  get direction(): ConversationMessageDirection {
    return this.props.direction;
  }

  get body(): string {
    return this.props.body;
  }

  get templateId(): string | null {
    return this.props.templateId;
  }

  get outboundIntentKey(): string | null {
    return this.props.outboundIntentKey;
  }

  get provider(): ConversationMessageProvider | null {
    return this.props.provider;
  }

  get deliveryStatus(): ConversationMessageDeliveryStatus | null {
    return this.props.deliveryStatus;
  }

  get externalMessageId(): string | null {
    return this.props.externalMessageId;
  }

  get failureReason(): string | null {
    return this.props.failureReason;
  }

  get deliveredAt(): Date | null {
    return this.props.deliveredAt;
  }

  get readAt(): Date | null {
    return this.props.readAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toPrimitives(): ConversationMessageProps {
    return { ...this.props };
  }
}
