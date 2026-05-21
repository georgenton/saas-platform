import {
  GetTenantWhatsappOutboundReportingSummaryUseCase,
  RunTenantWhatsappOperationalMonitorUseCase,
  RunTenantWhatsappReadyRetriesUseCase,
  WhatsappOperationalMonitorRunRepository,
} from '@saas-platform/growth-application';
import { TenantRepository } from '@saas-platform/tenancy-application';

describe('Growth WhatsApp operational monitor use case', () => {
  const reportingSummary = {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-05-20T09:00:00.000Z'),
    totals: {
      outboundMessageCount: 3,
      freeformMessageCount: 1,
      templateMessageCount: 2,
      approvedTemplateMessageCount: 1,
      pendingCount: 1,
      sentCount: 0,
      deliveredCount: 1,
      readCount: 0,
      failedCount: 1,
      immediateSendRejectionFailedCount: 1,
      asynchronousDeliveryFailedCount: 0,
      retryableFailedCount: 1,
      permanentFailedCount: 0,
    },
    byIntent: [],
    byTemplate: [],
    byProvider: [],
    byFailureClass: [],
    byProviderTaxonomy: [],
    topProviderErrorCodes: [],
    retryOperations: {
      totalFailedMessageCount: 1,
      retryableFailedMessageCount: 1,
      permanentFailedMessageCount: 0,
      cooldownBlockedCount: 0,
      readyNowCount: 1,
      defaultBaseBackoffMinutes: 5,
      maxBackoffMinutes: 180,
    },
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
      immediateSendRejectionRate: 0.3333,
      asynchronousDeliveryFailureRate: 0,
      readyRetryQueueCount: 1,
      cooldownRetryQueueCount: 0,
      permanentFailureCount: 0,
      leadingFailureClass: 'rate_limited',
      leadingProvider: 'meta_cloud_api',
      leadingProviderTaxonomyFamily: 'throughput_limit',
      leadingProviderTaxonomyDetail: 'meta_pair_rate_limit',
    },
    operationalAlerts: [
      {
        key: 'retry_queue_ready',
        severity: 'warning',
        title: 'Retry queue has ready-now messages',
        summary:
          '1 failed outbound messages are ready for retry execution now.',
        thresholdKey: 'readyRetryQueueWarningCount',
        observedValue: 1,
        thresholdValue: 1,
        thresholdUnit: 'count',
        provider: null,
        failureClass: null,
        providerTaxonomyFamily: null,
        providerTaxonomyDetail: null,
        affectedMessageCount: 1,
        recommendedAction:
          'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
      },
    ],
  };

  const getTenantWhatsappOutboundReportingSummaryUseCase: jest.Mocked<GetTenantWhatsappOutboundReportingSummaryUseCase> =
    {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetTenantWhatsappOutboundReportingSummaryUseCase>;
  const runTenantWhatsappReadyRetriesUseCase: jest.Mocked<RunTenantWhatsappReadyRetriesUseCase> =
    {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RunTenantWhatsappReadyRetriesUseCase>;
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
    getTenantWhatsappOutboundReportingSummaryUseCase.execute.mockResolvedValue(
      reportingSummary as any,
    );
    runTenantWhatsappReadyRetriesUseCase.execute.mockResolvedValue({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-20T09:05:00.000Z'),
      limitApplied: 10,
      candidateFailedMessageCount: 1,
      leafFailedMessageCount: 1,
      supersededFailedMessageCount: 0,
      readyNowCount: 1,
      retriedCount: 1,
      skippedCooldownCount: 0,
      skippedPermanentCount: 0,
      executions: [],
    } as any);
    whatsappOperationalMonitorRunRepository.create.mockImplementation(
      async (command) =>
        ({
          id: 'run_001',
          createdAt: new Date('2026-05-20T09:10:00.000Z'),
          ...command,
        }) as any,
    );
  });

  it('returns the operational snapshot without running retries by default', async () => {
    const useCase = new RunTenantWhatsappOperationalMonitorUseCase(
      tenantRepository,
      getTenantWhatsappOutboundReportingSummaryUseCase,
      runTenantWhatsappReadyRetriesUseCase,
      whatsappOperationalMonitorRunRepository,
      () => new Date('2026-05-20T09:10:00.000Z'),
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
    });

    expect(result.retryRunnerExecuted).toBe(false);
    expect(result.retryRunnerSummary).toBeNull();
    expect(result.totalAlertCount).toBe(1);
    expect(runTenantWhatsappReadyRetriesUseCase.execute).not.toHaveBeenCalled();
    expect(whatsappOperationalMonitorRunRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: 'tenant_123',
        triggerSource: 'manual',
        totalAlertCount: 1,
      }),
    );
  });

  it('runs ready retries when auto mode is enabled and queue is ready', async () => {
    const useCase = new RunTenantWhatsappOperationalMonitorUseCase(
      tenantRepository,
      getTenantWhatsappOutboundReportingSummaryUseCase,
      runTenantWhatsappReadyRetriesUseCase,
      whatsappOperationalMonitorRunRepository,
      () => new Date('2026-05-20T09:10:00.000Z'),
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      autoRunReadyRetries: true,
      retryReadyLimit: 10,
      occurredAt: new Date('2026-05-20T09:10:00.000Z'),
    });

    expect(result.retryRunnerExecuted).toBe(true);
    expect(result.retryRunnerSummary?.retriedCount).toBe(1);
    expect(runTenantWhatsappReadyRetriesUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      limit: 10,
      occurredAt: new Date('2026-05-20T09:10:00.000Z'),
    });
  });
});
