import {
  ConversationMessageDeliveryStatus,
} from './conversation-message.entity';
import { WhatsappAutomationTriggerEvent } from './whatsapp-automation-rule.entity';

export type WhatsappAutomationExecutionStatus =
  | 'sent'
  | 'skipped'
  | 'failed';

export interface WhatsappAutomationExecutionProps {
  id: string;
  tenantId: string;
  threadId: string;
  ruleId: string;
  triggerEvent: WhatsappAutomationTriggerEvent;
  triggerMessageId: string | null;
  triggerExternalMessageId: string | null;
  triggerDeliveryStatus: ConversationMessageDeliveryStatus | null;
  executionKey: string;
  status: WhatsappAutomationExecutionStatus;
  reason: string | null;
  outputMessageId: string | null;
  createdAt: Date;
}

export class WhatsappAutomationExecution {
  private constructor(
    private readonly props: WhatsappAutomationExecutionProps,
  ) {}

  static create(
    props: WhatsappAutomationExecutionProps,
  ): WhatsappAutomationExecution {
    return new WhatsappAutomationExecution(props);
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

  get ruleId(): string {
    return this.props.ruleId;
  }

  get triggerEvent(): WhatsappAutomationTriggerEvent {
    return this.props.triggerEvent;
  }

  get triggerMessageId(): string | null {
    return this.props.triggerMessageId;
  }

  get triggerExternalMessageId(): string | null {
    return this.props.triggerExternalMessageId;
  }

  get triggerDeliveryStatus(): ConversationMessageDeliveryStatus | null {
    return this.props.triggerDeliveryStatus;
  }

  get executionKey(): string {
    return this.props.executionKey;
  }

  get status(): WhatsappAutomationExecutionStatus {
    return this.props.status;
  }

  get reason(): string | null {
    return this.props.reason;
  }

  get outputMessageId(): string | null {
    return this.props.outputMessageId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toPrimitives(): WhatsappAutomationExecutionProps {
    return { ...this.props };
  }
}
