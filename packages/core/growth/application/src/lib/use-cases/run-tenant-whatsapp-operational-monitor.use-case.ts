import {
  GetTenantWhatsappOutboundReportingSummaryUseCase,
  TenantWhatsappOperationalAlertView,
  TenantWhatsappOperationalDashboardView,
  TenantWhatsappOperationalThresholdsView,
  TenantWhatsappOutboundReportingSummaryView,
} from './get-tenant-whatsapp-outbound-reporting-summary.use-case';
import {
  RunTenantWhatsappReadyRetriesUseCase,
  TenantWhatsappRetryRunnerSummaryView,
} from './run-tenant-whatsapp-ready-retries.use-case';

export interface RunTenantWhatsappOperationalMonitorInput {
  tenantSlug: string;
  occurredAt?: Date | null;
  autoRunReadyRetries?: boolean | null;
  retryReadyLimit?: number | null;
}

export interface TenantWhatsappOperationalMonitorSummaryView {
  tenantSlug: string;
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

export class RunTenantWhatsappOperationalMonitorUseCase {
  constructor(
    private readonly getTenantWhatsappOutboundReportingSummaryUseCase: GetTenantWhatsappOutboundReportingSummaryUseCase,
    private readonly runTenantWhatsappReadyRetriesUseCase: RunTenantWhatsappReadyRetriesUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: RunTenantWhatsappOperationalMonitorInput,
  ): Promise<TenantWhatsappOperationalMonitorSummaryView> {
    const occurredAt = input.occurredAt ?? this.nowProvider();
    const reportingSummary =
      await this.getTenantWhatsappOutboundReportingSummaryUseCase.execute(
        input.tenantSlug,
      );
    const autoRunReadyRetriesEnabled = input.autoRunReadyRetries === true;
    const shouldRunRetries =
      autoRunReadyRetriesEnabled &&
      reportingSummary.retryOperations.readyNowCount > 0;
    const retryRunnerSummary = shouldRunRetries
      ? await this.runTenantWhatsappReadyRetriesUseCase.execute({
          tenantSlug: input.tenantSlug,
          limit: input.retryReadyLimit ?? null,
          occurredAt,
        })
      : null;

    return this.buildSummaryView(
      reportingSummary,
      occurredAt,
      autoRunReadyRetriesEnabled,
      retryRunnerSummary,
    );
  }

  private buildSummaryView(
    reportingSummary: TenantWhatsappOutboundReportingSummaryView,
    generatedAt: Date,
    autoRunReadyRetriesEnabled: boolean,
    retryRunnerSummary: TenantWhatsappRetryRunnerSummaryView | null,
  ): TenantWhatsappOperationalMonitorSummaryView {
    const criticalAlertCount = reportingSummary.operationalAlerts.filter(
      (alert) => alert.severity === 'critical',
    ).length;
    const warningAlertCount = reportingSummary.operationalAlerts.filter(
      (alert) => alert.severity === 'warning',
    ).length;

    return {
      tenantSlug: reportingSummary.tenantSlug,
      generatedAt,
      autoRunReadyRetriesEnabled,
      overallStatus: reportingSummary.operationalDashboard.overallStatus,
      totalAlertCount: reportingSummary.operationalAlerts.length,
      criticalAlertCount,
      warningAlertCount,
      operationalThresholds: reportingSummary.operationalThresholds,
      operationalDashboard: reportingSummary.operationalDashboard,
      operationalAlerts: reportingSummary.operationalAlerts,
      retryRunnerExecuted: !!retryRunnerSummary,
      retryRunnerSummary,
    };
  }
}
