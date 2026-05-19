import { WhatsappAutomationRule } from '@saas-platform/growth-domain';

export interface WhatsappAutomationRuleResponseDto {
  id: string;
  tenantId: string;
  key: string;
  name: string;
  triggerEvent: string;
  matchOutboundIntentKey: string | null;
  matchDeliveryStatus: string | null;
  matchAssigneeMode: string;
  templateId: string | null;
  actionType: string;
  actionOutboundIntentKey: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const toWhatsappAutomationRuleResponseDto = (
  rule: WhatsappAutomationRule,
): WhatsappAutomationRuleResponseDto => {
  const data = rule.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    key: data.key,
    name: data.name,
    triggerEvent: data.triggerEvent,
    matchOutboundIntentKey: data.matchOutboundIntentKey,
    matchDeliveryStatus: data.matchDeliveryStatus,
    matchAssigneeMode: data.matchAssigneeMode,
    templateId: data.templateId,
    actionType: data.actionType,
    actionOutboundIntentKey: data.actionOutboundIntentKey,
    status: data.status,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
