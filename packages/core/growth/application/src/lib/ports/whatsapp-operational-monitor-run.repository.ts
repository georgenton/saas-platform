import {
  TenantWhatsappOperationalAlertView,
  TenantWhatsappOperationalDashboardView,
  TenantWhatsappOperationalThresholdsView,
} from '../use-cases/get-tenant-whatsapp-outbound-reporting-summary.use-case';
import { TenantWhatsappRetryRunnerSummaryView } from '../use-cases/run-tenant-whatsapp-ready-retries.use-case';

export type WhatsappOperationalMonitorRunTriggerSource =
  | 'manual'
  | 'scheduler';

export interface CreateWhatsappOperationalMonitorRunCommand {
  tenantId: string;
  triggerSource: WhatsappOperationalMonitorRunTriggerSource;
  generatedAt: Date;
  autoRunReadyRetriesEnabled: boolean;
  overallStatus: 'healthy' | 'warning' | 'critical';
  totalAlertCount: number;
  criticalAlertCount: number;
  warningAlertCount: number;
  operationalThresholds: TenantWhatsappOperationalThresholdsView;
  operationalDashboard: TenantWhatsappOperationalDashboardView;
  operationalAlerts: TenantWhatsappOperationalAlertView[];
  retryRunnerExecuted: boolean;
  retryRunnerSummary: TenantWhatsappRetryRunnerSummaryView | null;
}

export interface WhatsappOperationalMonitorRunRecord
  extends CreateWhatsappOperationalMonitorRunCommand {
  id: string;
  createdAt: Date;
}

export interface WhatsappOperationalMonitorRunRepository {
  create(
    command: CreateWhatsappOperationalMonitorRunCommand,
  ): Promise<WhatsappOperationalMonitorRunRecord>;
  findByTenantId(
    tenantId: string,
    limit?: number | null,
  ): Promise<WhatsappOperationalMonitorRunRecord[]>;
}
