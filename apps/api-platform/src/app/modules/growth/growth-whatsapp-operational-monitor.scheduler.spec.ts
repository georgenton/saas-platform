import { RunTenantWhatsappOperationalMonitorUseCase } from '@saas-platform/growth-application';
import { Logger } from '@nestjs/common';
import { GrowthWhatsappOperationalMonitorScheduler } from './growth-whatsapp-operational-monitor.scheduler';

describe('GrowthWhatsappOperationalMonitorScheduler', () => {
  const originalEnv = process.env;
  const runTenantWhatsappOperationalMonitorUseCase: jest.Mocked<RunTenantWhatsappOperationalMonitorUseCase> =
    {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RunTenantWhatsappOperationalMonitorUseCase>;
  const whatsappOperationalMonitorObservabilitySink = {
    publish: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv };
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    whatsappOperationalMonitorObservabilitySink.publish.mockResolvedValue(
      undefined,
    );
    runTenantWhatsappOperationalMonitorUseCase.execute.mockResolvedValue({
      tenantSlug: 'tenant-a',
      generatedAt: new Date('2026-05-20T11:00:00.000Z'),
      autoRunReadyRetriesEnabled: true,
      overallStatus: 'healthy',
      totalAlertCount: 0,
      criticalAlertCount: 0,
      warningAlertCount: 0,
      operationalThresholds: {
        immediateSendRejectionRateWarning: 0.05,
        asynchronousDeliveryFailureRateWarning: 0.03,
        readyRetryQueueWarningCount: 1,
        cooldownRetryQueueWarningCount: 3,
        authOrConfigurationCriticalCount: 1,
        policyBlockCriticalCount: 1,
        rateLimitedWarningCount: 1,
        unknownFailureWarningCount: 1,
      },
      operationalDashboard: {
        overallStatus: 'healthy',
        immediateSendRejectionRate: 0,
        asynchronousDeliveryFailureRate: 0,
        readyRetryQueueCount: 0,
        cooldownRetryQueueCount: 0,
        permanentFailureCount: 0,
        leadingFailureClass: null,
        leadingProvider: null,
        leadingProviderTaxonomyFamily: null,
        leadingProviderTaxonomyDetail: null,
      },
      operationalAlerts: [],
      retryRunnerExecuted: false,
      retryRunnerSummary: null,
    } as any);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('does not start when the scheduler is disabled', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const scheduler = new GrowthWhatsappOperationalMonitorScheduler(
      runTenantWhatsappOperationalMonitorUseCase,
      whatsappOperationalMonitorObservabilitySink as any,
    );

    scheduler.onModuleInit();

    expect(setIntervalSpy).not.toHaveBeenCalled();
  });

  it('runs one monitoring cycle for each configured tenant with auto retry settings', async () => {
    process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_SCHEDULER_ENABLED = 'true';
    process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_TENANT_SLUGS =
      'tenant-a, tenant-b';
    process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_AUTO_RUN_READY_RETRIES =
      'true';
    process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_RETRY_READY_LIMIT = '12';

    const scheduler = new GrowthWhatsappOperationalMonitorScheduler(
      runTenantWhatsappOperationalMonitorUseCase,
      whatsappOperationalMonitorObservabilitySink as any,
    );

    await scheduler.runScheduledCycle();

    expect(runTenantWhatsappOperationalMonitorUseCase.execute).toHaveBeenNthCalledWith(
      1,
      {
        tenantSlug: 'tenant-a',
        autoRunReadyRetries: true,
        retryReadyLimit: 12,
        triggerSource: 'scheduler',
      },
    );
    expect(runTenantWhatsappOperationalMonitorUseCase.execute).toHaveBeenNthCalledWith(
      2,
      {
        tenantSlug: 'tenant-b',
        autoRunReadyRetries: true,
        retryReadyLimit: 12,
        triggerSource: 'scheduler',
      },
    );
    expect(
      whatsappOperationalMonitorObservabilitySink.publish,
    ).toHaveBeenCalledTimes(2);
  });

  it('registers an interval and triggers an immediate run when enabled', () => {
    jest.useFakeTimers();
    process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_SCHEDULER_ENABLED = 'true';
    process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_TENANT_SLUGS = 'tenant-a';
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const scheduler = new GrowthWhatsappOperationalMonitorScheduler(
      runTenantWhatsappOperationalMonitorUseCase,
      whatsappOperationalMonitorObservabilitySink as any,
    );

    scheduler.onModuleInit();

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(runTenantWhatsappOperationalMonitorUseCase.execute).toHaveBeenCalledWith(
      {
        tenantSlug: 'tenant-a',
        autoRunReadyRetries: false,
        retryReadyLimit: null,
        triggerSource: 'scheduler',
      },
    );

    scheduler.onModuleDestroy();
  });
});
