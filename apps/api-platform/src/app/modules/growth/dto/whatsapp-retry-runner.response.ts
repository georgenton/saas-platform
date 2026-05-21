import {
  TenantWhatsappRetryRunnerExecutionView,
  TenantWhatsappRetryRunnerSummaryView,
} from '@saas-platform/growth-application';

export interface WhatsappRetryRunnerExecutionResponseDto {
  sourceMessageId: string;
  sourceExternalMessageId: string | null;
  disposition: string;
  status: string;
  failedAttemptCount: number;
  backoffMinutes: number;
  nextRetryAt: string;
  retryMessageId: string | null;
  retryExternalMessageId: string | null;
}

export interface WhatsappRetryRunnerSummaryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  limitApplied: number;
  candidateFailedMessageCount: number;
  leafFailedMessageCount: number;
  supersededFailedMessageCount: number;
  readyNowCount: number;
  retriedCount: number;
  skippedCooldownCount: number;
  skippedPermanentCount: number;
  executions: WhatsappRetryRunnerExecutionResponseDto[];
}

const toExecutionResponseDto = (
  view: TenantWhatsappRetryRunnerExecutionView,
): WhatsappRetryRunnerExecutionResponseDto => ({
  sourceMessageId: view.sourceMessageId,
  sourceExternalMessageId: view.sourceExternalMessageId,
  disposition: view.disposition,
  status: view.status,
  failedAttemptCount: view.failedAttemptCount,
  backoffMinutes: view.backoffMinutes,
  nextRetryAt: view.nextRetryAt.toISOString(),
  retryMessageId: view.retryMessageId,
  retryExternalMessageId: view.retryExternalMessageId,
});

export const toWhatsappRetryRunnerSummaryResponseDto = (
  view: TenantWhatsappRetryRunnerSummaryView,
): WhatsappRetryRunnerSummaryResponseDto => ({
  tenantSlug: view.tenantSlug,
  generatedAt: view.generatedAt.toISOString(),
  limitApplied: view.limitApplied,
  candidateFailedMessageCount: view.candidateFailedMessageCount,
  leafFailedMessageCount: view.leafFailedMessageCount,
  supersededFailedMessageCount: view.supersededFailedMessageCount,
  readyNowCount: view.readyNowCount,
  retriedCount: view.retriedCount,
  skippedCooldownCount: view.skippedCooldownCount,
  skippedPermanentCount: view.skippedPermanentCount,
  executions: view.executions.map((item) => toExecutionResponseDto(item)),
});
