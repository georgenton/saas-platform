import {
  TenantWhatsappAutomationSuggestionView,
  TenantWhatsappAutomationSuggestionsView,
} from '@saas-platform/growth-application';

export interface WhatsappAutomationSuggestionResponseDto {
  ruleId: string;
  ruleKey: string;
  ruleName: string;
  triggerEvent: string;
  actionType: string;
  actionOutboundIntentKey: string | null;
  templateId: string | null;
  templateKey: string | null;
  templateName: string | null;
  providerTemplateName: string | null;
  providerApprovalStatus: string | null;
  bodyTemplatePreview: string | null;
}

export interface WhatsappAutomationSuggestionsResponseDto {
  tenantSlug: string;
  threadId: string;
  generatedAt: string;
  suggestions: WhatsappAutomationSuggestionResponseDto[];
}

const toSuggestionResponseDto = (
  view: TenantWhatsappAutomationSuggestionView,
): WhatsappAutomationSuggestionResponseDto => ({
  ruleId: view.ruleId,
  ruleKey: view.ruleKey,
  ruleName: view.ruleName,
  triggerEvent: view.triggerEvent,
  actionType: view.actionType,
  actionOutboundIntentKey: view.actionOutboundIntentKey,
  templateId: view.templateId,
  templateKey: view.templateKey,
  templateName: view.templateName,
  providerTemplateName: view.providerTemplateName,
  providerApprovalStatus: view.providerApprovalStatus,
  bodyTemplatePreview: view.bodyTemplatePreview,
});

export const toWhatsappAutomationSuggestionsResponseDto = (
  view: TenantWhatsappAutomationSuggestionsView,
): WhatsappAutomationSuggestionsResponseDto => ({
  tenantSlug: view.tenantSlug,
  threadId: view.threadId,
  generatedAt: view.generatedAt.toISOString(),
  suggestions: view.suggestions.map((suggestion) =>
    toSuggestionResponseDto(suggestion),
  ),
});
