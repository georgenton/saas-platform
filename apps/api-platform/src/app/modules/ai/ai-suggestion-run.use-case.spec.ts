import {
  GetTenantAiSuggestionRunDetailUseCase,
  ListTenantAiSuggestionRunsUseCase,
  PrepareTenantAiSuggestionRunUseCase,
} from '@saas-platform/ai-application';

describe('AI suggestion run use cases', () => {
  const tenantRepository = {
    findBySlug: jest.fn(),
  };
  const aiSuggestionRunRepository = {
    create: jest.fn(),
    findByTenantIdAndAgentKey: jest.fn(),
    findByIdAndTenantIdAndAgentKey: jest.fn(),
  };
  const aiApprovalRequestRepository = {
    findBySuggestionRunIds: jest.fn(),
  };
  const getTenantAiSuggestionEnvelopeUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      slug: 'saas-platform',
    });
    const envelope = {
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-22T12:00:00.000Z'),
      mode: 'suggestion',
      agent: {
        key: 'growth-assist-coach',
        title: 'Growth Assist Coach',
        summary: 'summary',
        domainKey: 'growth',
        productKey: 'growth',
        availability: 'ready',
        defaultMode: 'suggestion',
        supportedSurfaceKeys: ['growth_assist_daily_agenda'],
      },
      surface: {
        key: 'growth_assist_daily_agenda',
        title: 'Growth Assist daily agenda',
        sourceContractKey: 'growth.assist.daily_agenda',
        sourceGeneratedAt: new Date('2026-05-22T12:00:00.000Z'),
      },
      promptPack: {
        key: 'growth-assist-coach-core',
        version: 'v1',
        agentKey: 'growth-assist-coach',
        mode: 'suggestion',
        title: 'Growth Assist Coach Core',
        summary: 'summary',
        objective: 'objective',
        styleGuidance: ['short'],
        constraints: ['suggestion only'],
        suggestedOutputs: [
          {
            key: 'reply_draft',
            label: 'Reply draft',
            description: 'desc',
          },
        ],
      },
      contextBlocks: [
        {
          key: 'agenda_summary',
          title: 'Agenda summary',
          detail: 'detail',
          bullets: ['Reply now count: 1'],
        },
      ],
    };
    getTenantAiSuggestionEnvelopeUseCase.execute.mockResolvedValue(envelope);
    aiSuggestionRunRepository.create.mockImplementation(async (command) => ({
      id: 'ai-run-001',
      ...command,
      createdAt: new Date('2026-05-22T12:01:00.000Z'),
    }));
    const suggestionRunRecord = {
      id: 'ai-run-001',
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      agentKey: 'growth-assist-coach',
      mode: 'suggestion',
      status: 'prepared',
      surfaceKey: 'growth_assist_daily_agenda',
      sourceContractKey: 'growth.assist.daily_agenda',
      sourceGeneratedAt: new Date('2026-05-22T12:00:00.000Z'),
      promptPackKey: 'growth-assist-coach-core',
      promptPackVersion: 'v1',
      generatedAt: new Date('2026-05-22T12:00:00.000Z'),
      requestedByUserId: 'user_123',
      requestedByEmail: 'owner@saas-platform.dev',
      summary:
        'Growth Assist Coach prepared a suggestion-mode handoff for Growth Assist daily agenda using prompt pack growth-assist-coach-core@v1.',
      suggestedOutputKeys: ['reply_draft'],
      envelope,
      createdAt: new Date('2026-05-22T12:01:00.000Z'),
    };
    aiSuggestionRunRepository.findByTenantIdAndAgentKey.mockResolvedValue([
      suggestionRunRecord,
    ]);
    aiSuggestionRunRepository.findByIdAndTenantIdAndAgentKey.mockResolvedValue(
      suggestionRunRecord,
    );
    aiApprovalRequestRepository.findBySuggestionRunIds.mockResolvedValue([
      {
        id: 'ai-approval-001',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        agentKey: 'growth-assist-coach',
        policyKey: 'growth-assist-suggestion-review',
        scope: 'suggestion_review',
        suggestionRunId: 'ai-run-001',
        requestedByUserId: 'user_123',
        requestedByEmail: 'owner@saas-platform.dev',
        rationale: 'revision humana',
        summary: 'summary',
        status: 'pending',
        reviewedAt: null,
        reviewedByUserId: null,
        reviewedByEmail: null,
        reviewNote: null,
        createdAt: new Date('2026-05-22T12:02:00.000Z'),
        updatedAt: new Date('2026-05-22T12:02:00.000Z'),
      },
    ]);
  });

  it('prepares a tenant-scoped auditable suggestion run from the envelope', async () => {
    const useCase = new PrepareTenantAiSuggestionRunUseCase(
      tenantRepository as any,
      aiSuggestionRunRepository as any,
      getTenantAiSuggestionEnvelopeUseCase as any,
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      agentKey: 'growth-assist-coach',
      requestedByUserId: 'user_123',
      requestedByEmail: 'owner@saas-platform.dev',
    });

    expect(getTenantAiSuggestionEnvelopeUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
    );
    expect(aiSuggestionRunRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        agentKey: 'growth-assist-coach',
        promptPackKey: 'growth-assist-coach-core',
        promptPackVersion: 'v1',
        requestedByUserId: 'user_123',
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 'ai-run-001',
        status: 'prepared',
      }),
    );
  });

  it('lists tenant-scoped auditable suggestion runs', async () => {
    const useCase = new ListTenantAiSuggestionRunsUseCase(
      tenantRepository as any,
      aiSuggestionRunRepository as any,
      aiApprovalRequestRepository as any,
    );

    const result = await useCase.execute(
      'saas-platform',
      'growth-assist-coach',
      5,
    );

    expect(aiSuggestionRunRepository.findByTenantIdAndAgentKey).toHaveBeenCalledWith(
      'tenant_123',
      'growth-assist-coach',
      5,
    );
    expect(aiApprovalRequestRepository.findBySuggestionRunIds).toHaveBeenCalledWith(
      'tenant_123',
      'growth-assist-coach',
      ['ai-run-001'],
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: 'ai-run-001',
        agentKey: 'growth-assist-coach',
        approvalSummary: expect.objectContaining({
          status: 'pending',
          totalRequests: 1,
          latestRequestId: 'ai-approval-001',
        }),
      }),
    );
  });

  it('returns one tenant-scoped suggestion run detail with approval timeline', async () => {
    const useCase = new GetTenantAiSuggestionRunDetailUseCase(
      tenantRepository as any,
      aiSuggestionRunRepository as any,
      aiApprovalRequestRepository as any,
    );

    const result = await useCase.execute(
      'saas-platform',
      'growth-assist-coach',
      'ai-run-001',
    );

    expect(
      aiSuggestionRunRepository.findByIdAndTenantIdAndAgentKey,
    ).toHaveBeenCalledWith('ai-run-001', 'tenant_123', 'growth-assist-coach');
    expect(aiApprovalRequestRepository.findBySuggestionRunIds).toHaveBeenCalledWith(
      'tenant_123',
      'growth-assist-coach',
      ['ai-run-001'],
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 'ai-run-001',
        approvalSummary: expect.objectContaining({
          status: 'pending',
        }),
        approvalRequests: [
          expect.objectContaining({
            id: 'ai-approval-001',
            suggestionRunId: 'ai-run-001',
          }),
        ],
      }),
    );
  });
});
