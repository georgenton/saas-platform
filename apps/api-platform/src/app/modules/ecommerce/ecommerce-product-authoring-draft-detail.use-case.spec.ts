import {
  GetTenantEcommerceProductAuthoringDraftDetailUseCase,
  RequestTenantEcommerceProductAuthoringDraftBriefUseCase,
  RequestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase,
  SaveTenantEcommerceProductAuthoringDraftUseCase,
} from '@saas-platform/ecommerce-application';

describe('Ecommerce product authoring draft detail use cases', () => {
  const workspace = {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-05-28T14:00:00.000Z'),
    summary: {
      tone: 'warning',
      authoringReadiness: 'needs_store_profile' as const,
      headline: 'Starter set needs connections.',
      detail: 'Pending connections remain.',
      suggestedFocus: 'Keep the starter set intentionally small.',
    },
    draftCollection: {
      profileStoreName: 'SaaS Platform Store',
      collectionLabel: 'SaaS Platform Store starter set',
      primaryChannel: 'landing' as const,
      draftCount: 3,
    },
    readinessChecklist: [],
    drafts: [
      {
        id: 'saas-platform:draft:core-offer',
        title: 'SaaS Platform Store flagship offer',
        productType: 'core_offer' as const,
        status: 'draft' as const,
        rationale: 'Anchor offer.',
        suggestedChannels: ['catalog', 'landing'] as Array<
          'catalog' | 'landing' | 'whatsapp'
        >,
      },
    ],
    safeActions: ['Use this draft as the first commercial anchor.'],
    blockedActions: ['Do not publish automatically.'],
  };

  it('returns one tenant-scoped draft detail from the authoring workspace', async () => {
    const getTenantEcommerceProductAuthoringWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue(workspace),
    };

    const useCase = new GetTenantEcommerceProductAuthoringDraftDetailUseCase(
      getTenantEcommerceProductAuthoringWorkspaceUseCase as never,
    );

    await expect(
      useCase.execute('saas-platform', 'saas-platform:draft:core-offer'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T14:00:00.000Z'),
      workspaceSummary: workspace.summary,
      draftCollection: workspace.draftCollection,
      readinessChecklist: [],
      safeActions: ['Use this draft as the first commercial anchor.'],
      blockedActions: ['Do not publish automatically.'],
      draft: workspace.drafts[0],
      savedDraft: null,
    });
  });

  it('returns an ai brief request packet for one draft', async () => {
    const getTenantEcommerceProductAuthoringDraftDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T14:00:00.000Z'),
        workspaceSummary: workspace.summary,
        draftCollection: workspace.draftCollection,
        readinessChecklist: [],
        safeActions: workspace.safeActions,
        blockedActions: workspace.blockedActions,
        draft: workspace.drafts[0],
      }),
    };

    const useCase = new RequestTenantEcommerceProductAuthoringDraftBriefUseCase(
      getTenantEcommerceProductAuthoringDraftDetailUseCase as never,
      () => new Date('2026-05-28T15:00:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'saas-platform:draft:core-offer'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T15:00:00.000Z'),
      draft: workspace.drafts[0],
      briefingStatus: 'needs_commercial_connections',
      summary:
        'El draft ya puede bajar a brief AI, pero conviene cerrarlo con conexiones comerciales pendientes todavia visibles.',
      requiredInputs: [
        'Propuesta de pricing inicial',
        'Primary benefit statement',
        'Operational owner for follow-up',
      ],
      guardrails: [
        'No asumir pricing final ni publicacion automatica.',
        'Mantener el brief alineado con la identidad y el canal primario del profile.',
      ],
    });
  });

  it('returns a refinement packet for one draft', async () => {
    const getTenantEcommerceProductAuthoringDraftDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T14:00:00.000Z'),
        workspaceSummary: workspace.summary,
        draftCollection: workspace.draftCollection,
        readinessChecklist: [],
        safeActions: workspace.safeActions,
        blockedActions: workspace.blockedActions,
        draft: workspace.drafts[0],
      }),
    };

    const useCase =
      new RequestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase(
        getTenantEcommerceProductAuthoringDraftDetailUseCase as never,
        () => new Date('2026-05-28T15:15:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'saas-platform:draft:core-offer'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T15:15:00.000Z'),
      draft: workspace.drafts[0],
      refinementStatus: 'needs_commercial_connections',
      summary:
        'El draft ya puede refinarse, pero conviene mantener visibles las conexiones comerciales pendientes mientras bajas pricing y CTA.',
      pricingBand: 'Mid-ticket anchor band',
      offerAngle:
        'Oferta principal con promesa clara y beneficio central inmediato.',
      primaryCta: 'Explorar oferta principal',
      channelSequence: ['Catalog anchor', 'Landing conversion step'],
      guardrails: [
        'No convertir esta refinacion en pricing definitivo persistido.',
        'Mantener el refinement packet dentro del starter set y sin publicacion automatica.',
      ],
    });
  });

  it('saves one draft as a tenant catalog candidate snapshot', async () => {
    const getTenantBySlugUseCase = {
      execute: jest.fn().mockResolvedValue({
        id: 'tenant_123',
        slug: 'saas-platform',
      }),
    };
    const getTenantEcommerceProductAuthoringDraftDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T14:00:00.000Z'),
        workspaceSummary: workspace.summary,
        draftCollection: workspace.draftCollection,
        readinessChecklist: [],
        safeActions: workspace.safeActions,
        blockedActions: workspace.blockedActions,
        draft: workspace.drafts[0],
        savedDraft: null,
      }),
    };
    const requestTenantEcommerceProductAuthoringDraftBriefUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T15:00:00.000Z'),
        draft: workspace.drafts[0],
        briefingStatus: 'needs_commercial_connections',
        summary:
          'El draft ya puede bajar a brief AI, pero conviene cerrarlo con conexiones comerciales pendientes todavia visibles.',
        requiredInputs: [
          'Propuesta de pricing inicial',
          'Primary benefit statement',
          'Operational owner for follow-up',
        ],
        guardrails: [
          'No asumir pricing final ni publicacion automatica.',
          'Mantener el brief alineado con la identidad y el canal primario del profile.',
        ],
      }),
    };
    const requestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T15:15:00.000Z'),
        draft: workspace.drafts[0],
        refinementStatus: 'needs_commercial_connections',
        summary:
          'El draft ya puede refinarse, pero conviene mantener visibles las conexiones comerciales pendientes mientras bajas pricing y CTA.',
        pricingBand: 'Mid-ticket anchor band',
        offerAngle:
          'Oferta principal con promesa clara y beneficio central inmediato.',
        primaryCta: 'Explorar oferta principal',
        channelSequence: ['Catalog anchor', 'Landing conversion step'],
        guardrails: [
          'No convertir esta refinacion en pricing definitivo persistido.',
          'Mantener el refinement packet dentro del starter set y sin publicacion automatica.',
        ],
      }),
    };
    const ecommerceProductDraftRepository = {
      findByTenantSlugAndSourceDraftId: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue({
        id: 'saved_draft_001',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        sourceDraftId: 'saas-platform:draft:core-offer',
        title: 'SaaS Platform Store flagship offer',
        productType: 'core_offer',
        status: 'saved_draft',
        rationale: 'Anchor offer.',
        suggestedChannels: ['catalog', 'landing'],
        briefingStatus: 'needs_commercial_connections',
        briefSummary:
          'El draft ya puede bajar a brief AI, pero conviene cerrarlo con conexiones comerciales pendientes todavia visibles.',
        briefRequiredInputs: [
          'Propuesta de pricing inicial',
          'Primary benefit statement',
          'Operational owner for follow-up',
        ],
        briefGuardrails: [
          'No asumir pricing final ni publicacion automatica.',
          'Mantener el brief alineado con la identidad y el canal primario del profile.',
        ],
        refinementStatus: 'needs_commercial_connections',
        refinementSummary:
          'El draft ya puede refinarse, pero conviene mantener visibles las conexiones comerciales pendientes mientras bajas pricing y CTA.',
        pricingBand: 'Mid-ticket anchor band',
        offerAngle:
          'Oferta principal con promesa clara y beneficio central inmediato.',
        primaryCta: 'Explorar oferta principal',
        channelSequence: ['Catalog anchor', 'Landing conversion step'],
        refinementGuardrails: [
          'No convertir esta refinacion en pricing definitivo persistido.',
          'Mantener el refinement packet dentro del starter set y sin publicacion automatica.',
        ],
        createdAt: new Date('2026-05-28T15:20:00.000Z'),
        updatedAt: new Date('2026-05-28T15:20:00.000Z'),
      }),
    };

    const useCase = new SaveTenantEcommerceProductAuthoringDraftUseCase(
      getTenantBySlugUseCase as never,
      getTenantEcommerceProductAuthoringDraftDetailUseCase as never,
      requestTenantEcommerceProductAuthoringDraftBriefUseCase as never,
      requestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase as never,
      ecommerceProductDraftRepository as never,
      () => 'saved_draft_001',
      () => new Date('2026-05-28T15:21:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'saas-platform:draft:core-offer'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T15:21:00.000Z'),
      summary:
        'El draft quedo guardado como catalog candidate con sus packets comerciales actuales, manteniendo visibles las conexiones pendientes antes de abrir publicacion o pricing final.',
      savedDraft: {
        id: 'saved_draft_001',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        sourceDraftId: 'saas-platform:draft:core-offer',
        title: 'SaaS Platform Store flagship offer',
        productType: 'core_offer',
        status: 'saved_draft',
        rationale: 'Anchor offer.',
        suggestedChannels: ['catalog', 'landing'],
        briefingStatus: 'needs_commercial_connections',
        briefSummary:
          'El draft ya puede bajar a brief AI, pero conviene cerrarlo con conexiones comerciales pendientes todavia visibles.',
        briefRequiredInputs: [
          'Propuesta de pricing inicial',
          'Primary benefit statement',
          'Operational owner for follow-up',
        ],
        briefGuardrails: [
          'No asumir pricing final ni publicacion automatica.',
          'Mantener el brief alineado con la identidad y el canal primario del profile.',
        ],
        refinementStatus: 'needs_commercial_connections',
        refinementSummary:
          'El draft ya puede refinarse, pero conviene mantener visibles las conexiones comerciales pendientes mientras bajas pricing y CTA.',
        pricingBand: 'Mid-ticket anchor band',
        offerAngle:
          'Oferta principal con promesa clara y beneficio central inmediato.',
        primaryCta: 'Explorar oferta principal',
        channelSequence: ['Catalog anchor', 'Landing conversion step'],
        refinementGuardrails: [
          'No convertir esta refinacion en pricing definitivo persistido.',
          'Mantener el refinement packet dentro del starter set y sin publicacion automatica.',
        ],
        createdAt: new Date('2026-05-28T15:20:00.000Z'),
        updatedAt: new Date('2026-05-28T15:20:00.000Z'),
      },
    });
  });
});
