import { ConversationMessageDeliveryStatus } from './conversation-message.entity';

export type WhatsappAutomationTriggerEvent =
  | 'inbound_message'
  | 'delivery_status_changed';
export type WhatsappAutomationAssigneeMode =
  | 'any'
  | 'unassigned'
  | 'assigned';
export type WhatsappAutomationActionType =
  | 'suggest_template'
  | 'send_template';
export type WhatsappAutomationRuleStatus = 'active' | 'archived';

export interface WhatsappAutomationRuleProps {
  id: string;
  tenantId: string;
  key: string;
  name: string;
  triggerEvent: WhatsappAutomationTriggerEvent;
  matchOutboundIntentKey: string | null;
  matchDeliveryStatus: ConversationMessageDeliveryStatus | null;
  matchAssigneeMode: WhatsappAutomationAssigneeMode;
  templateId: string | null;
  actionType: WhatsappAutomationActionType;
  actionOutboundIntentKey: string | null;
  status: WhatsappAutomationRuleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class WhatsappAutomationRule {
  private constructor(private readonly props: WhatsappAutomationRuleProps) {}

  static create(props: WhatsappAutomationRuleProps): WhatsappAutomationRule {
    return new WhatsappAutomationRule(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get key(): string {
    return this.props.key;
  }

  get name(): string {
    return this.props.name;
  }

  get triggerEvent(): WhatsappAutomationTriggerEvent {
    return this.props.triggerEvent;
  }

  get matchOutboundIntentKey(): string | null {
    return this.props.matchOutboundIntentKey;
  }

  get matchDeliveryStatus(): ConversationMessageDeliveryStatus | null {
    return this.props.matchDeliveryStatus;
  }

  get matchAssigneeMode(): WhatsappAutomationAssigneeMode {
    return this.props.matchAssigneeMode;
  }

  get templateId(): string | null {
    return this.props.templateId;
  }

  get actionType(): WhatsappAutomationActionType {
    return this.props.actionType;
  }

  get actionOutboundIntentKey(): string | null {
    return this.props.actionOutboundIntentKey;
  }

  get status(): WhatsappAutomationRuleStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): WhatsappAutomationRuleProps {
    return { ...this.props };
  }
}
