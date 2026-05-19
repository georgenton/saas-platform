import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  ConversationMessageDeliveryStatus,
  WhatsappAutomationAssigneeMode,
  WhatsappAutomationTriggerEvent,
} from '@saas-platform/growth-domain';

const triggerEvents: WhatsappAutomationTriggerEvent[] = [
  'inbound_message',
  'delivery_status_changed',
];
const assigneeModes: WhatsappAutomationAssigneeMode[] = [
  'any',
  'unassigned',
  'assigned',
];
const deliveryStatuses: ConversationMessageDeliveryStatus[] = [
  'pending',
  'sent',
  'delivered',
  'read',
  'failed',
];

export class CreateWhatsappAutomationRuleRequestDto {
  @IsString()
  @MaxLength(80)
  key!: string;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsIn(triggerEvents)
  triggerEvent!: WhatsappAutomationTriggerEvent;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  matchOutboundIntentKey?: string | null;

  @IsOptional()
  @IsIn(deliveryStatuses)
  matchDeliveryStatus?: ConversationMessageDeliveryStatus | null;

  @IsOptional()
  @IsIn(assigneeModes)
  matchAssigneeMode?: WhatsappAutomationAssigneeMode | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  templateId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  actionOutboundIntentKey?: string | null;
}
