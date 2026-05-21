import {
  TenantWhatsappFailureClassReportingView,
  TenantWhatsappOperationalAlertView,
  TenantWhatsappOperationalDashboardView,
  TenantWhatsappOperationalThresholdsView,
  TenantWhatsappOutboundIntentReportingView,
  TenantWhatsappProviderErrorCodeReportingView,
  TenantWhatsappProviderReportingView,
  TenantWhatsappProviderTaxonomyReportingView,
  TenantWhatsappOutboundReportingSummaryView,
  TenantWhatsappRetryOperationsSummaryView,
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

export interface WhatsappProviderReportingResponseDto {
  provider: string;
  messageCount: number;
  pendingCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
}

export interface WhatsappProviderErrorCodeReportingResponseDto {
  provider: string;
  providerErrorCode: string;
  failureClass: string;
  failurePhase: string;
  retryDisposition: string;
  providerTaxonomyFamily: string;
  providerTaxonomyDetail: string;
  occurrenceCount: number;
  latestFailureReason: string | null;
  latestProviderStatusDetail: string | null;
}

export interface WhatsappFailureClassReportingResponseDto {
  provider: string;
  failureClass: string;
  failurePhase: string;
  messageCount: number;
  retryableCount: number;
  permanentCount: number;
}

export interface WhatsappProviderTaxonomyReportingResponseDto {
  provider: string;
  providerTaxonomyFamily: string;
  providerTaxonomyDetail: string;
  failureClass: string;
  failurePhase: string;
  messageCount: number;
  retryableCount: number;
  permanentCount: number;
}

export interface WhatsappRetryOperationsSummaryResponseDto {
  totalFailedMessageCount: number;
  retryableFailedMessageCount: number;
  permanentFailedMessageCount: number;
  cooldownBlockedCount: number;
  readyNowCount: number;
  defaultBaseBackoffMinutes: number;
  maxBackoffMinutes: number;
}

export interface WhatsappOperationalDashboardResponseDto {
  overallStatus: 'healthy' | 'warning' | 'critical';
  immediateSendRejectionRate: number;
  asynchronousDeliveryFailureRate: number;
  readyRetryQueueCount: number;
  cooldownRetryQueueCount: number;
  permanentFailureCount: number;
  leadingFailureClass: string | null;
  leadingProvider: string | null;
  leadingProviderTaxonomyFamily: string | null;
  leadingProviderTaxonomyDetail: string | null;
}

export interface WhatsappOperationalThresholdsResponseDto {
  immediateSendRejectionRateWarning: number;
  asynchronousDeliveryFailureRateWarning: number;
  readyRetryQueueWarningCount: number;
  cooldownRetryQueueWarningCount: number;
  authOrConfigurationCriticalCount: number;
  policyBlockCriticalCount: number;
  rateLimitedWarningCount: number;
  unknownFailureWarningCount: number;
}

export interface WhatsappOperationalAlertResponseDto {
  key: string;
  severity: 'warning' | 'critical';
  title: string;
  summary: string;
  thresholdKey: string;
  observedValue: number;
  thresholdValue: number;
  thresholdUnit: 'count' | 'rate';
  provider: string | null;
  failureClass: string | null;
  providerTaxonomyFamily: string | null;
  providerTaxonomyDetail: string | null;
  affectedMessageCount: number;
  recommendedAction: string;
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
    immediateSendRejectionFailedCount: number;
    asynchronousDeliveryFailedCount: number;
    retryableFailedCount: number;
    permanentFailedCount: number;
  };
  byIntent: WhatsappOutboundIntentReportingResponseDto[];
  byTemplate: WhatsappTemplateReportingResponseDto[];
  byProvider: WhatsappProviderReportingResponseDto[];
  byFailureClass: WhatsappFailureClassReportingResponseDto[];
  byProviderTaxonomy: WhatsappProviderTaxonomyReportingResponseDto[];
  topProviderErrorCodes: WhatsappProviderErrorCodeReportingResponseDto[];
  retryOperations: WhatsappRetryOperationsSummaryResponseDto;
  operationalThresholds: WhatsappOperationalThresholdsResponseDto;
  operationalDashboard: WhatsappOperationalDashboardResponseDto;
  operationalAlerts: WhatsappOperationalAlertResponseDto[];
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

const toProviderResponseDto = (
  view: TenantWhatsappProviderReportingView,
): WhatsappProviderReportingResponseDto => ({
  provider: view.provider,
  messageCount: view.messageCount,
  pendingCount: view.pendingCount,
  sentCount: view.sentCount,
  deliveredCount: view.deliveredCount,
  readCount: view.readCount,
  failedCount: view.failedCount,
});

const toProviderErrorCodeResponseDto = (
  view: TenantWhatsappProviderErrorCodeReportingView,
): WhatsappProviderErrorCodeReportingResponseDto => ({
  provider: view.provider,
  providerErrorCode: view.providerErrorCode,
  failureClass: view.failureClass,
  failurePhase: view.failurePhase,
  retryDisposition: view.retryDisposition,
  providerTaxonomyFamily: view.providerTaxonomyFamily,
  providerTaxonomyDetail: view.providerTaxonomyDetail,
  occurrenceCount: view.occurrenceCount,
  latestFailureReason: view.latestFailureReason,
  latestProviderStatusDetail: view.latestProviderStatusDetail,
});

const toFailureClassResponseDto = (
  view: TenantWhatsappFailureClassReportingView,
): WhatsappFailureClassReportingResponseDto => ({
  provider: view.provider,
  failureClass: view.failureClass,
  failurePhase: view.failurePhase,
  messageCount: view.messageCount,
  retryableCount: view.retryableCount,
  permanentCount: view.permanentCount,
});

const toProviderTaxonomyResponseDto = (
  view: TenantWhatsappProviderTaxonomyReportingView,
): WhatsappProviderTaxonomyReportingResponseDto => ({
  provider: view.provider,
  providerTaxonomyFamily: view.providerTaxonomyFamily,
  providerTaxonomyDetail: view.providerTaxonomyDetail,
  failureClass: view.failureClass,
  failurePhase: view.failurePhase,
  messageCount: view.messageCount,
  retryableCount: view.retryableCount,
  permanentCount: view.permanentCount,
});

const toRetryOperationsSummaryResponseDto = (
  view: TenantWhatsappRetryOperationsSummaryView,
): WhatsappRetryOperationsSummaryResponseDto => ({
  totalFailedMessageCount: view.totalFailedMessageCount,
  retryableFailedMessageCount: view.retryableFailedMessageCount,
  permanentFailedMessageCount: view.permanentFailedMessageCount,
  cooldownBlockedCount: view.cooldownBlockedCount,
  readyNowCount: view.readyNowCount,
  defaultBaseBackoffMinutes: view.defaultBaseBackoffMinutes,
  maxBackoffMinutes: view.maxBackoffMinutes,
});

const toOperationalDashboardResponseDto = (
  view: TenantWhatsappOperationalDashboardView,
): WhatsappOperationalDashboardResponseDto => ({
  overallStatus: view.overallStatus,
  immediateSendRejectionRate: view.immediateSendRejectionRate,
  asynchronousDeliveryFailureRate: view.asynchronousDeliveryFailureRate,
  readyRetryQueueCount: view.readyRetryQueueCount,
  cooldownRetryQueueCount: view.cooldownRetryQueueCount,
  permanentFailureCount: view.permanentFailureCount,
  leadingFailureClass: view.leadingFailureClass,
  leadingProvider: view.leadingProvider,
  leadingProviderTaxonomyFamily: view.leadingProviderTaxonomyFamily,
  leadingProviderTaxonomyDetail: view.leadingProviderTaxonomyDetail,
});

const toOperationalThresholdsResponseDto = (
  view: TenantWhatsappOperationalThresholdsView,
): WhatsappOperationalThresholdsResponseDto => ({
  immediateSendRejectionRateWarning: view.immediateSendRejectionRateWarning,
  asynchronousDeliveryFailureRateWarning:
    view.asynchronousDeliveryFailureRateWarning,
  readyRetryQueueWarningCount: view.readyRetryQueueWarningCount,
  cooldownRetryQueueWarningCount: view.cooldownRetryQueueWarningCount,
  authOrConfigurationCriticalCount: view.authOrConfigurationCriticalCount,
  policyBlockCriticalCount: view.policyBlockCriticalCount,
  rateLimitedWarningCount: view.rateLimitedWarningCount,
  unknownFailureWarningCount: view.unknownFailureWarningCount,
});

const toOperationalAlertResponseDto = (
  view: TenantWhatsappOperationalAlertView,
): WhatsappOperationalAlertResponseDto => ({
  key: view.key,
  severity: view.severity,
  title: view.title,
  summary: view.summary,
  thresholdKey: view.thresholdKey,
  observedValue: view.observedValue,
  thresholdValue: view.thresholdValue,
  thresholdUnit: view.thresholdUnit,
  provider: view.provider,
  failureClass: view.failureClass,
  providerTaxonomyFamily: view.providerTaxonomyFamily,
  providerTaxonomyDetail: view.providerTaxonomyDetail,
  affectedMessageCount: view.affectedMessageCount,
  recommendedAction: view.recommendedAction,
});

export const toWhatsappOutboundReportingSummaryResponseDto = (
  view: TenantWhatsappOutboundReportingSummaryView,
): WhatsappOutboundReportingSummaryResponseDto => ({
  tenantSlug: view.tenantSlug,
  generatedAt: view.generatedAt.toISOString(),
  totals: { ...view.totals },
  byIntent: view.byIntent.map((item) => toIntentResponseDto(item)),
  byTemplate: view.byTemplate.map((item) => toTemplateResponseDto(item)),
  byProvider: view.byProvider.map((item) => toProviderResponseDto(item)),
  byFailureClass: view.byFailureClass.map((item) =>
    toFailureClassResponseDto(item),
  ),
  byProviderTaxonomy: view.byProviderTaxonomy.map((item) =>
    toProviderTaxonomyResponseDto(item),
  ),
  topProviderErrorCodes: view.topProviderErrorCodes.map((item) =>
    toProviderErrorCodeResponseDto(item),
  ),
  retryOperations: toRetryOperationsSummaryResponseDto(view.retryOperations),
  operationalThresholds: toOperationalThresholdsResponseDto(
    view.operationalThresholds,
  ),
  operationalDashboard: toOperationalDashboardResponseDto(
    view.operationalDashboard,
  ),
  operationalAlerts: view.operationalAlerts.map((item) =>
    toOperationalAlertResponseDto(item),
  ),
});
