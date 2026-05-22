import { GetTenantGrowthAssistDailyAgendaUseCase } from '@saas-platform/growth-application';

describe('Growth assist daily agenda use case', () => {
  const getTenantGrowthConversationWorkbenchUseCase = {
    execute: jest.fn(),
  };
  const getTenantWhatsappOutboundReportingSummaryUseCase = {
    execute: jest.fn(),
  };
  const listTenantGrowthOperationalCasesUseCase = {
    execute: jest.fn(),
  };
  const getTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    getTenantGrowthConversationWorkbenchUseCase.execute.mockResolvedValue({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-21T12:00:00.000Z'),
      policy: {
        firstResponseSlaHours: 1,
        followUpSlaHours: 12,
        staleThreadHours: 48,
      },
      summary: {
        openThreadCount: 2,
        unassignedThreadCount: 1,
        waitingOnTeamCount: 1,
        waitingOnCustomerCount: 1,
        overdueFirstResponseCount: 1,
        overdueFollowUpCount: 0,
        staleThreadCount: 0,
      },
      threads: [
        {
          threadId: 'thread_001',
          leadId: 'lead_001',
          assigneeUserId: null,
          subject: 'Maria Perez',
          channel: 'whatsapp',
          status: 'open',
          latestMessagePreview: 'Hola, quiero info.',
          nextActionOwner: 'team',
          firstResponseStatus: 'overdue',
          followUpStatus: 'pending',
          staleStatus: 'fresh',
          priority: 'critical',
          messageCount: 1,
          hoursSinceLastActivity: 3,
          hoursSinceLastInbound: 3,
          hoursSinceOpened: 3,
          openedAt: new Date('2026-05-21T09:00:00.000Z'),
          lastActivityAt: new Date('2026-05-21T09:00:00.000Z'),
          lastInboundAt: new Date('2026-05-21T09:00:00.000Z'),
          lastOutboundAt: null,
        },
      ],
    });
    getTenantWhatsappOutboundReportingSummaryUseCase.execute.mockResolvedValue({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-21T12:00:00.000Z'),
      totals: {
        outboundMessageCount: 0,
        freeformMessageCount: 0,
        templateMessageCount: 0,
        approvedTemplateMessageCount: 0,
        pendingCount: 0,
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        failedCount: 0,
        immediateSendRejectionFailedCount: 0,
        asynchronousDeliveryFailedCount: 0,
        retryableFailedCount: 0,
        permanentFailedCount: 0,
      },
      byIntent: [],
      byTemplate: [],
      byProvider: [],
      byFailureClass: [],
      byProviderTaxonomy: [],
      topProviderErrorCodes: [],
      retryOperations: {
        totalFailedMessageCount: 0,
        retryableFailedMessageCount: 0,
        permanentFailedMessageCount: 0,
        cooldownBlockedCount: 0,
        readyNowCount: 0,
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
    });
    listTenantGrowthOperationalCasesUseCase.execute.mockResolvedValue([
      {
        id: 'case_001',
        tenantId: 'tenant_123',
        sourceKey: 'follow-up:thread_002',
        caseType: 'follow_up',
        status: 'open',
        priority: 'warning',
        title: 'Retomar propuesta',
        summary: 'El cliente recibio propuesta pero falta retomar.',
        nextAction: 'Escribir hoy para confirmar interes.',
        followUpState: 'pending_team',
        routingPolicyKey: 'follow_up_team',
        threadId: 'thread_002',
        alertKey: null,
        dueAt: new Date('2026-05-21T15:00:00.000Z'),
        assignedUserId: null,
        assignedUserEmail: null,
        createdByUserId: 'user_001',
        createdByEmail: 'owner@saas-platform.dev',
        resolvedAt: null,
        resolvedByUserId: null,
        resolvedByEmail: null,
        createdAt: new Date('2026-05-21T10:00:00.000Z'),
        updatedAt: new Date('2026-05-21T10:00:00.000Z'),
      },
    ]);
    getTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase.execute.mockResolvedValue(
      {
        id: 'tenant_123:growth-operational-case-auto-assignment-settings',
        tenantId: 'tenant_123',
        defaultPolicyKey: 'follow_up_first',
        createdAt: new Date('2026-05-21T08:00:00.000Z'),
        updatedAt: new Date('2026-05-21T08:00:00.000Z'),
      },
    );
  });

  it('builds a simplified agenda from workbench, operational cases, and channel health', async () => {
    const useCase = new GetTenantGrowthAssistDailyAgendaUseCase(
      getTenantGrowthConversationWorkbenchUseCase as any,
      getTenantWhatsappOutboundReportingSummaryUseCase as any,
      listTenantGrowthOperationalCasesUseCase as any,
      getTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase as any,
      () => new Date('2026-05-21T12:00:00.000Z'),
    );

    const result = await useCase.execute('saas-platform');

    expect(result.summary).toEqual(
      expect.objectContaining({
        tone: 'critical',
        replyNowCount: 1,
        followUpNowCount: 1,
        savedPolicyKey: 'follow_up_first',
      }),
    );
    expect(result.tasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'reply_now',
          title: 'Responder a Maria Perez',
          threadId: 'thread_001',
        }),
        expect.objectContaining({
          category: 'follow_up',
          title: 'No dejar enfriar: Retomar propuesta',
          operationalCaseId: 'case_001',
        }),
      ]),
    );
    expect(result.conversationCues[0]).toEqual(
      expect.objectContaining({
        title: 'Maria Perez',
        warmth: 'hot',
      }),
    );
    expect(result.replySuggestions[0]).toEqual(
      expect.objectContaining({
        key: 'reply-suggestion:thread_001',
        title: 'Maria Perez',
        goal: 'Reconocer el contacto, retomar confianza y proponer el siguiente paso.',
        checklist: expect.arrayContaining([
          'Deja un owner claro antes de cerrar el siguiente paso.',
          'Agradece el contacto y reconoce la espera si aplica.',
        ]),
      }),
    );
    expect(result.nextActions[0]).toEqual(
      expect.objectContaining({
        key: 'next-action:reply:thread_001',
        emphasis: 'do_now',
        actionType: 'reply_now',
        title: 'Responder a Maria Perez',
      }),
    );
    expect(result.leadWarmthSummary).toEqual(
      expect.objectContaining({
        hotCount: 1,
        warmCount: 0,
        watchCount: 0,
        dominantWarmth: 'hot',
      }),
    );
    expect(result.leadWarmthHints[0]).toEqual(
      expect.objectContaining({
        key: 'warmth:thread_001',
        warmth: 'hot',
        title: 'Maria Perez',
      }),
    );
    expect(result.playbooks[0]).toEqual(
      expect.objectContaining({
        key: 'reply-now',
        goal:
          'Recuperar velocidad de respuesta y dejar un siguiente paso claro sin sonar robotico.',
        avoid:
          'No contestes con un texto generico que ignore el contexto ni dejes la conversacion abierta sin siguiente paso.',
        successSignal:
          'El lead responde o acepta el siguiente paso dentro de la misma ventana de seguimiento.',
        whenToUse: 'Cuando hay conversaciones sin primera respuesta o follow-up vencido.',
        steps: expect.arrayContaining([
          'Agradece el contacto y retoma el contexto en una frase simple.',
        ]),
      }),
    );
  });
});
