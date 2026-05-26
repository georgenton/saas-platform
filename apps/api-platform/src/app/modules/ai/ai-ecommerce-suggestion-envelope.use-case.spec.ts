import { GetTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase } from '@saas-platform/ai-application';

describe('AI ecommerce suggestion envelope use case', () => {
  const getTenantEcommerceLaunchWorkspaceUseCase = {
    execute: jest.fn(),
  };
  const getTenantAiMemoryRetrievalUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    getTenantAiMemoryRetrievalUseCase.execute.mockResolvedValue({
      retrievedAt: new Date('2026-05-24T11:00:00.000Z'),
      recordCount: 0,
      policy: {
        version: 'v1',
        limit: 5,
        suppressedDuplicateCount: 0,
        archivedRecordCount: 0,
        prioritizedRecordIds: [],
        archivalSummary:
          'Operator notes are never auto-archived; working guarded-execution memory archives after 7 days; working approval memory archives after 14 days; durable automated memory archives after 45 days.',
        rankingSummary:
          'operator_note > guarded_execution_memory > approval_memory; agent > domain > tenant; working_memory > durable_memory; recency breaks ties.',
      },
      records: [],
      notes: ['No persisted memory record matched this agent context yet.'],
    });
    getTenantEcommerceLaunchWorkspaceUseCase.execute.mockResolvedValue({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-24T11:00:00.000Z'),
      summary: {
        tone: 'warning',
        launchReadiness: 'launch_ready',
        headline: 'Ya existe una base suficiente para un launch inicial.',
        detail: 'Conviene empezar con un alcance estrecho.',
        suggestedFocus: 'Empieza por un launch simple.',
      },
      moduleSnapshot: {
        productEnabled: true,
        activeModuleCount: 5,
        coreModuleCount: 5,
        optionalModuleCount: 0,
        inactiveModuleKeys: ['promotions'],
      },
      checklist: [
        {
          key: 'catalog',
          label: 'Catalog',
          isCore: true,
          status: 'ready',
          detail: 'Disponible para el launch base del tenant.',
        },
      ],
      channelGuidance: [
        {
          key: 'campaign',
          title: 'Campaign scope',
          status: 'warning',
          detail: 'Conviene partir con una campaña simple.',
          recommendedUse: 'Prioriza una campaña de validacion.',
        },
      ],
      launchHints: [
        {
          key: 'launch-angle',
          title: 'Launch angle',
          objective: 'Bajar el lanzamiento a una promesa comercial concreta.',
          whenToUse: 'Cuando ya hay base para escribir el primer brief comercial.',
          recommendedInputs: ['Enabled product list', 'Active ecommerce modules'],
          caution: 'No conviertas el angle en promesas que todavia no existen.',
        },
      ],
      safeActions: ['Resumir el launch scope inicial.'],
      blockedActions: ['Publicar catalogo automaticamente.'],
    });
  });

  it('builds a tenant-scoped suggestion envelope from the ecommerce launch workspace', async () => {
    const useCase =
      new GetTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase(
        getTenantEcommerceLaunchWorkspaceUseCase as any,
        getTenantAiMemoryRetrievalUseCase as any,
      );

    const result = await useCase.execute('saas-platform');

    expect(result.generatedAt).toEqual(new Date('2026-05-24T11:00:00.000Z'));
    expect(result.agent).toEqual(
      expect.objectContaining({
        key: 'ecommerce-launch-assistant',
        availability: 'ready',
        defaultMode: 'suggestion',
      }),
    );
    expect(result.surface).toEqual(
      expect.objectContaining({
        key: 'ecommerce_launch_workspace',
        sourceContractKey: 'ecommerce.launch.workspace',
      }),
    );
    expect(result.promptPack).toEqual(
      expect.objectContaining({
        key: 'ecommerce-launch-assistant-core',
        version: 'v1',
      }),
    );
    expect(result.toolAccess).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          accessLevel: 'approval_required',
          tool: expect.objectContaining({
            key: 'ecommerce_launch_briefing',
            availability: 'ready',
            executionBoundary: expect.objectContaining({
              executionMode: 'suggestion_only',
            }),
          }),
        }),
      ]),
    );
    expect(result.contextBlocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'launch_summary',
          bullets: expect.arrayContaining([
            'Launch readiness: launch_ready',
            'Product enabled: true',
          ]),
        }),
        expect.objectContaining({
          key: 'launch_lanes',
          bullets: expect.arrayContaining([
            expect.stringContaining('Campaign scope: status=warning'),
          ]),
        }),
      ]),
    );
  });
});
