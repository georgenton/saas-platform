import {
  GetTenantWhatsappOperationalMonitorAnalyticsUseCase,
  WhatsappOperationalMonitorRunRepository,
} from '@saas-platform/growth-application';
import { TenantRepository } from '@saas-platform/tenancy-application';

describe('Growth WhatsApp operational monitor analytics use case', () => {
  const tenantRepository: jest.Mocked<TenantRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findBySlug: jest.fn(),
  };
  const whatsappOperationalMonitorRunRepository: jest.Mocked<WhatsappOperationalMonitorRunRepository> =
    {
      create: jest.fn(),
      findByTenantId: jest.fn(),
    };

  beforeEach(() => {
    jest.resetAllMocks();
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      name: 'SaaS Platform',
      slug: 'saas-platform',
      status: 'active',
    } as any);
    whatsappOperationalMonitorRunRepository.findByTenantId.mockResolvedValue([
      {
        id: 'run_003',
        tenantId: 'tenant_123',
        triggerSource: 'scheduler',
        generatedAt: new Date('2026-05-21T12:00:00.000Z'),
        autoRunReadyRetriesEnabled: true,
        overallStatus: 'warning',
        totalAlertCount: 2,
        criticalAlertCount: 0,
        warningAlertCount: 2,
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
          overallStatus: 'warning',
          immediateSendRejectionRate: 0.06,
          asynchronousDeliveryFailureRate: 0.01,
          readyRetryQueueCount: 2,
          cooldownRetryQueueCount: 1,
          permanentFailureCount: 0,
          leadingFailureClass: 'rate_limited',
          leadingProvider: 'meta_cloud_api_stub',
          leadingProviderTaxonomyFamily: 'throughput_limit',
          leadingProviderTaxonomyDetail: 'meta_pair_rate_limit',
        },
        operationalAlerts: [
          {
            key: 'retry_queue_ready',
            severity: 'warning',
            title: 'Retry queue has ready-now messages',
            summary: '2 failed outbound messages are ready for retry execution now.',
            thresholdKey: 'readyRetryQueueWarningCount',
            observedValue: 2,
            thresholdValue: 1,
            thresholdUnit: 'count',
            provider: null,
            failureClass: null,
            providerTaxonomyFamily: null,
            providerTaxonomyDetail: null,
            affectedMessageCount: 2,
            recommendedAction: 'Run retries.',
          },
        ],
        retryRunnerExecuted: true,
        retryRunnerSummary: null,
        createdAt: new Date('2026-05-21T12:00:00.000Z'),
      },
      {
        id: 'run_002',
        tenantId: 'tenant_123',
        triggerSource: 'scheduler',
        generatedAt: new Date('2026-05-21T11:00:00.000Z'),
        autoRunReadyRetriesEnabled: true,
        overallStatus: 'critical',
        totalAlertCount: 1,
        criticalAlertCount: 1,
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
          overallStatus: 'critical',
          immediateSendRejectionRate: 0.09,
          asynchronousDeliveryFailureRate: 0.04,
          readyRetryQueueCount: 3,
          cooldownRetryQueueCount: 4,
          permanentFailureCount: 1,
          leadingFailureClass: 'auth_or_configuration',
          leadingProvider: 'meta_cloud_api_stub',
          leadingProviderTaxonomyFamily: 'auth_token',
          leadingProviderTaxonomyDetail: 'meta_account_block',
        },
        operationalAlerts: [
          {
            key: 'auth_config_critical',
            severity: 'critical',
            title: 'Authentication/configuration failures need intervention',
            summary: 'Configuration failures were observed.',
            thresholdKey: 'authOrConfigurationCriticalCount',
            observedValue: 1,
            thresholdValue: 1,
            thresholdUnit: 'count',
            provider: 'meta_cloud_api_stub',
            failureClass: 'auth_or_configuration',
            providerTaxonomyFamily: 'auth_token',
            providerTaxonomyDetail: 'meta_account_block',
            affectedMessageCount: 1,
            recommendedAction: 'Fix configuration.',
          },
        ],
        retryRunnerExecuted: false,
        retryRunnerSummary: null,
        createdAt: new Date('2026-05-21T11:00:00.000Z'),
      },
      {
        id: 'run_001',
        tenantId: 'tenant_123',
        triggerSource: 'manual',
        generatedAt: new Date('2026-05-21T10:00:00.000Z'),
        autoRunReadyRetriesEnabled: false,
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
          immediateSendRejectionRate: 0.01,
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
        createdAt: new Date('2026-05-21T10:00:00.000Z'),
      },
    ] as any);
  });

  it('summarizes run history and produces calibration suggestions', async () => {
    const useCase = new GetTenantWhatsappOperationalMonitorAnalyticsUseCase(
      tenantRepository,
      whatsappOperationalMonitorRunRepository,
      () => new Date('2026-05-21T12:30:00.000Z'),
    );

    const result = await useCase.execute('saas-platform');

    expect(result.runCount).toBe(3);
    expect(result.latestOverallStatus).toBe('warning');
    expect(result.statusCounts).toEqual({
      healthy: 1,
      warning: 1,
      critical: 1,
    });
    expect(result.triggerSourceCounts).toEqual({
      manual: 1,
      scheduler: 2,
    });
    expect(result.alertFrequency[0]).toEqual(
      expect.objectContaining({
        alertKey: 'retry_queue_ready',
        occurrenceCount: 1,
      }),
    );
    expect(result.thresholdCalibration).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          thresholdKey: 'immediateSendRejectionRateWarning',
          currentValue: 0.05,
          direction: 'raise',
        }),
      ]),
    );
  });
});
