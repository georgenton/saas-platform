import {
  TenantWhatsappOutboundIntentReportingView,
  TenantWhatsappOutboundReportingSummaryView,
  TenantWhatsappTemplateReportingView,
} from '@saas-platform/growth-application';

export interface WhatsappOutboundIntentReportingResponseDto {
  outboundIntentKey: string;
  messageCount: number;
  pendingCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
}

export interface WhatsappTemplateReportingResponseDto {
  templateId: string;
  templateKey: string | null;
  templateName: string | null;
  providerTemplateName: string | null;
  providerApprovalStatus: string | null;
  messageCount: number;
  pendingCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
}

export interface WhatsappOutboundReportingSummaryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  totals: {
    outboundMessageCount: number;
    freeformMessageCount: number;
    templateMessageCount: number;
    approvedTemplateMessageCount: number;
    pendingCount: number;
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    failedCount: number;
  };
  byIntent: WhatsappOutboundIntentReportingResponseDto[];
  byTemplate: WhatsappTemplateReportingResponseDto[];
}

const toIntentResponseDto = (
  view: TenantWhatsappOutboundIntentReportingView,
): WhatsappOutboundIntentReportingResponseDto => ({
  outboundIntentKey: view.outboundIntentKey,
  messageCount: view.messageCount,
  pendingCount: view.pendingCount,
  sentCount: view.sentCount,
  deliveredCount: view.deliveredCount,
  readCount: view.readCount,
  failedCount: view.failedCount,
});

const toTemplateResponseDto = (
  view: TenantWhatsappTemplateReportingView,
): WhatsappTemplateReportingResponseDto => ({
  templateId: view.templateId,
  templateKey: view.templateKey,
  templateName: view.templateName,
  providerTemplateName: view.providerTemplateName,
  providerApprovalStatus: view.providerApprovalStatus,
  messageCount: view.messageCount,
  pendingCount: view.pendingCount,
  sentCount: view.sentCount,
  deliveredCount: view.deliveredCount,
  readCount: view.readCount,
  failedCount: view.failedCount,
});

export const toWhatsappOutboundReportingSummaryResponseDto = (
  view: TenantWhatsappOutboundReportingSummaryView,
): WhatsappOutboundReportingSummaryResponseDto => ({
  tenantSlug: view.tenantSlug,
  generatedAt: view.generatedAt.toISOString(),
  totals: { ...view.totals },
  byIntent: view.byIntent.map((item) => toIntentResponseDto(item)),
  byTemplate: view.byTemplate.map((item) => toTemplateResponseDto(item)),
});
