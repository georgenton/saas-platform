import { WhatsappOperationalMonitorRunRecord } from '@saas-platform/growth-application';
import {
  WhatsappOperationalAlertResponseDto,
  WhatsappOperationalDashboardResponseDto,
  WhatsappOperationalThresholdsResponseDto,
} from './whatsapp-outbound-reporting-summary.response';
import {
  toWhatsappRetryRunnerSummaryResponseDto,
  WhatsappRetryRunnerSummaryResponseDto,
} from './whatsapp-retry-runner.response';

export interface WhatsappOperationalMonitorRunResponseDto {
  id: string;
  triggerSource: 'manual' | 'scheduler';
  generatedAt: string;
  autoRunReadyRetriesEnabled: boolean;
  overallStatus: 'healthy' | 'warning' | 'critical';
  totalAlertCount: number;
  criticalAlertCount: number;
  warningAlertCount: number;
  operationalThresholds: WhatsappOperationalThresholdsResponseDto;
  operationalDashboard: WhatsappOperationalDashboardResponseDto;
  operationalAlerts: WhatsappOperationalAlertResponseDto[];
  retryRunnerExecuted: boolean;
  retryRunnerSummary: WhatsappRetryRunnerSummaryResponseDto | null;
  createdAt: string;
}

export const toWhatsappOperationalMonitorRunResponseDto = (
  record: WhatsappOperationalMonitorRunRecord,
): WhatsappOperationalMonitorRunResponseDto => ({
  id: record.id,
  triggerSource: record.triggerSource,
  generatedAt: record.generatedAt.toISOString(),
  autoRunReadyRetriesEnabled: record.autoRunReadyRetriesEnabled,
  overallStatus: record.overallStatus,
  totalAlertCount: record.totalAlertCount,
  criticalAlertCount: record.criticalAlertCount,
  warningAlertCount: record.warningAlertCount,
  operationalThresholds: { ...record.operationalThresholds },
  operationalDashboard: { ...record.operationalDashboard },
  operationalAlerts: record.operationalAlerts.map((alert) => ({ ...alert })),
  retryRunnerExecuted: record.retryRunnerExecuted,
  retryRunnerSummary: record.retryRunnerSummary
    ? toWhatsappRetryRunnerSummaryResponseDto(record.retryRunnerSummary)
    : null,
  createdAt: record.createdAt.toISOString(),
});
