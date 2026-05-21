import {
  TenantWhatsappOperationalMonitorSummaryView,
} from '@saas-platform/growth-application';
import {
  WhatsappOperationalAlertResponseDto,
  WhatsappOperationalDashboardResponseDto,
  WhatsappOperationalThresholdsResponseDto,
} from './whatsapp-outbound-reporting-summary.response';
import { toWhatsappRetryRunnerSummaryResponseDto, WhatsappRetryRunnerSummaryResponseDto } from './whatsapp-retry-runner.response';

export interface WhatsappOperationalMonitorSummaryResponseDto {
  tenantSlug: string;
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
}

export const toWhatsappOperationalMonitorSummaryResponseDto = (
  view: TenantWhatsappOperationalMonitorSummaryView,
): WhatsappOperationalMonitorSummaryResponseDto => ({
  tenantSlug: view.tenantSlug,
  generatedAt: view.generatedAt.toISOString(),
  autoRunReadyRetriesEnabled: view.autoRunReadyRetriesEnabled,
  overallStatus: view.overallStatus,
  totalAlertCount: view.totalAlertCount,
  criticalAlertCount: view.criticalAlertCount,
  warningAlertCount: view.warningAlertCount,
  operationalThresholds: { ...view.operationalThresholds },
  operationalDashboard: { ...view.operationalDashboard },
  operationalAlerts: view.operationalAlerts.map((item) => ({ ...item })),
  retryRunnerExecuted: view.retryRunnerExecuted,
  retryRunnerSummary: view.retryRunnerSummary
    ? toWhatsappRetryRunnerSummaryResponseDto(view.retryRunnerSummary)
    : null,
});
