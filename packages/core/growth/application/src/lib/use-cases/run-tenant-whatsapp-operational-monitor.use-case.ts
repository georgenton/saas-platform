import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
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
import {
  WhatsappOperationalMonitorRunRepository,
  WhatsappOperationalMonitorRunTriggerSource,
} from '../ports/whatsapp-operational-monitor-run.repository';

export interface RunTenantWhatsappOperationalMonitorInput {
  tenantSlug: string;
  occurredAt?: Date | null;
  autoRunReadyRetries?: boolean | null;
  retryReadyLimit?: number | null;
  triggerSource?: WhatsappOperationalMonitorRunTriggerSource | null;
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
    private readonly tenantRepository: TenantRepository,
    private readonly getTenantWhatsappOutboundReportingSummaryUseCase: GetTenantWhatsappOutboundReportingSummaryUseCase,
    private readonly runTenantWhatsappReadyRetriesUseCase: RunTenantWhatsappReadyRetriesUseCase,
    private readonly whatsappOperationalMonitorRunRepository: WhatsappOperationalMonitorRunRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: RunTenantWhatsappOperationalMonitorInput,
  ): Promise<TenantWhatsappOperationalMonitorSummaryView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

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
    const summary = this.buildSummaryView(
      reportingSummary,
      occurredAt,
      autoRunReadyRetriesEnabled,
      retryRunnerSummary,
    );

    await this.whatsappOperationalMonitorRunRepository.create({
      tenantId: tenant.id,
      triggerSource: input.triggerSource ?? 'manual',
      generatedAt: summary.generatedAt,
      autoRunReadyRetriesEnabled: summary.autoRunReadyRetriesEnabled,
      overallStatus: summary.overallStatus,
      totalAlertCount: summary.totalAlertCount,
      criticalAlertCount: summary.criticalAlertCount,
      warningAlertCount: summary.warningAlertCount,
      operationalThresholds: summary.operationalThresholds,
      operationalDashboard: summary.operationalDashboard,
      operationalAlerts: summary.operationalAlerts,
      retryRunnerExecuted: summary.retryRunnerExecuted,
      retryRunnerSummary: summary.retryRunnerSummary,
    });

    return summary;
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
