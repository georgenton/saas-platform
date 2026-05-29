import {
  GetTenantEcommerceProductWorkspaceDetailUseCase,
  ListTenantEcommerceProductWorkspacesUseCase,
  PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase,
  RequestTenantEcommerceProductWorkspaceReadinessPacketUseCase,
  UpdateTenantEcommerceProductWorkspaceEditableSnapshotUseCase,
} from '@saas-platform/ecommerce-application';

describe('Ecommerce product workspace use cases', () => {
  const savedDraft = {
    id: 'saved_draft_001',
    tenantId: 'tenant_123',
    tenantSlug: 'saas-platform',
    sourceDraftId: 'saas-platform:draft:core-offer',
    title: 'SaaS Platform Store flagship offer',
    productType: 'core_offer' as const,
    status: 'saved_draft' as const,
    rationale: 'Anchor offer.',
    suggestedChannels: ['catalog', 'landing'] as Array<
      'catalog' | 'landing' | 'whatsapp'
    >,
    briefingStatus: 'needs_commercial_connections' as const,
    briefSummary: 'Brief pending commercial closure.',
    briefRequiredInputs: ['Pricing'],
    briefGuardrails: ['No auto publish.'],
    refinementStatus: 'needs_commercial_connections' as const,
    refinementSummary: 'Refinement pending commercial closure.',
    pricingBand: 'Mid-ticket anchor band',
    offerAngle: 'Primary promise',
    primaryCta: 'Explorar oferta principal',
    channelSequence: ['Catalog anchor', 'Landing conversion step'],
    refinementGuardrails: ['No final pricing yet.'],
    promotedToWorkspaceAt: new Date('2026-05-28T16:00:00.000Z'),
    createdAt: new Date('2026-05-28T15:20:00.000Z'),
    updatedAt: new Date('2026-05-28T16:00:00.000Z'),
  };

  it('promotes one saved draft into a product workspace', async () => {
    const ecommerceProductDraftRepository = {
      markPromotedToWorkspace: jest.fn().mockResolvedValue(savedDraft),
    };
    const useCase = new PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase(
      ecommerceProductDraftRepository as never,
      () => new Date('2026-05-28T16:00:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'saved_draft_001'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:00:00.000Z'),
      savedDraftId: 'saved_draft_001',
      promotedAt: new Date('2026-05-28T16:00:00.000Z'),
      status: 'needs_commercial_connections',
      headline:
        'El candidate ya vive como product workspace y puede editarse, manteniendo visibles las conexiones comerciales pendientes.',
      detail:
        'Este workspace ya fija ownership sobre el candidate, pero sigue bloqueando cualquier salto a publicacion final o pricing definitivo.',
      editableSnapshot: {
        title: 'SaaS Platform Store flagship offer',
        pricingBand: 'Mid-ticket anchor band',
        offerAngle: 'Primary promise',
        primaryCta: 'Explorar oferta principal',
        suggestedChannels: ['catalog', 'landing'],
        channelSequence: ['Catalog anchor', 'Landing conversion step'],
      },
      guardrails: ['No auto publish.', 'No final pricing yet.'],
      nextActions: [
        'Cierra conexiones comerciales pendientes antes de convertir este workspace en producto operativo.',
        'Sigue afinando CTA y pricing band sin asumir publicación ni SKU final.',
      ],
    });
  });

  it('lists the promoted product workspaces for one tenant', async () => {
    const ecommerceProductDraftRepository = {
      listByTenantSlug: jest.fn().mockResolvedValue([savedDraft]),
    };
    const promoteUseCase = new PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase(
      { markPromotedToWorkspace: jest.fn() } as never,
      () => new Date('2026-05-28T16:00:00.000Z'),
    );
    const useCase = new ListTenantEcommerceProductWorkspacesUseCase(
      ecommerceProductDraftRepository as never,
      promoteUseCase,
      () => new Date('2026-05-28T16:05:00.000Z'),
    );

    await expect(useCase.execute('saas-platform')).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:05:00.000Z'),
      summary: {
        totalProductWorkspaces: 1,
        readyForCopyEditCount: 0,
        needsCommercialConnectionsCount: 1,
        needsActivationCount: 0,
        headline:
          'Ya existe un registro de product workspaces promovidos desde catalog candidates.',
        detail:
          'Este registro marca el paso entre candidate persistido y authoring de producto con ownership propio.',
      },
      workspaces: [
        {
          tenantSlug: 'saas-platform',
          generatedAt: new Date('2026-05-28T16:00:00.000Z'),
          savedDraftId: 'saved_draft_001',
          promotedAt: new Date('2026-05-28T16:00:00.000Z'),
          status: 'needs_commercial_connections',
          headline:
            'El candidate ya vive como product workspace y puede editarse, manteniendo visibles las conexiones comerciales pendientes.',
          detail:
            'Este workspace ya fija ownership sobre el candidate, pero sigue bloqueando cualquier salto a publicacion final o pricing definitivo.',
          editableSnapshot: {
            title: 'SaaS Platform Store flagship offer',
            pricingBand: 'Mid-ticket anchor band',
            offerAngle: 'Primary promise',
            primaryCta: 'Explorar oferta principal',
            suggestedChannels: ['catalog', 'landing'],
            channelSequence: ['Catalog anchor', 'Landing conversion step'],
          },
          guardrails: ['No auto publish.', 'No final pricing yet.'],
          nextActions: [
            'Cierra conexiones comerciales pendientes antes de convertir este workspace en producto operativo.',
            'Sigue afinando CTA y pricing band sin asumir publicación ni SKU final.',
          ],
        },
      ],
    });
  });

  it('loads one promoted product workspace detail', async () => {
    const ecommerceProductDraftRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(savedDraft),
    };
    const promoteUseCase = new PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase(
      { markPromotedToWorkspace: jest.fn() } as never,
      () => new Date('2026-05-28T16:00:00.000Z'),
    );
    const useCase = new GetTenantEcommerceProductWorkspaceDetailUseCase(
      ecommerceProductDraftRepository as never,
      promoteUseCase,
      () => new Date('2026-05-28T16:10:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'saved_draft_001'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:10:00.000Z'),
      workspace: {
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T16:00:00.000Z'),
        savedDraftId: 'saved_draft_001',
        promotedAt: new Date('2026-05-28T16:00:00.000Z'),
        status: 'needs_commercial_connections',
        headline:
          'El candidate ya vive como product workspace y puede editarse, manteniendo visibles las conexiones comerciales pendientes.',
        detail:
          'Este workspace ya fija ownership sobre el candidate, pero sigue bloqueando cualquier salto a publicacion final o pricing definitivo.',
        editableSnapshot: {
          title: 'SaaS Platform Store flagship offer',
          pricingBand: 'Mid-ticket anchor band',
          offerAngle: 'Primary promise',
          primaryCta: 'Explorar oferta principal',
          suggestedChannels: ['catalog', 'landing'],
          channelSequence: ['Catalog anchor', 'Landing conversion step'],
        },
        guardrails: ['No auto publish.', 'No final pricing yet.'],
        nextActions: [
          'Cierra conexiones comerciales pendientes antes de convertir este workspace en producto operativo.',
          'Sigue afinando CTA y pricing band sin asumir publicación ni SKU final.',
        ],
      },
      sourceDraftId: 'saas-platform:draft:core-offer',
      readiness: {
        briefingStatus: 'needs_commercial_connections',
        refinementStatus: 'needs_commercial_connections',
        lastSavedAt: new Date('2026-05-28T16:00:00.000Z'),
      },
    });
  });

  it('updates the editable snapshot of one promoted product workspace', async () => {
    const updatedDraft = {
      ...savedDraft,
      title: 'SaaS Platform Store flagship offer v2',
      pricingBand: 'Upper mid-ticket band',
      offerAngle: 'Primary promise refined',
      primaryCta: 'Ver producto principal',
      channelSequence: ['Landing conversion step', 'Whatsapp follow-up'],
      updatedAt: new Date('2026-05-28T16:12:00.000Z'),
    };
    const ecommerceProductDraftRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(savedDraft),
      updateEditableSnapshot: jest.fn().mockResolvedValue(updatedDraft),
    };
    const promoteUseCase = new PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase(
      { markPromotedToWorkspace: jest.fn() } as never,
      () => new Date('2026-05-28T16:00:00.000Z'),
    );
    const detailUseCase = new GetTenantEcommerceProductWorkspaceDetailUseCase(
      ecommerceProductDraftRepository as never,
      promoteUseCase,
      () => new Date('2026-05-28T16:15:00.000Z'),
    );
    const useCase = new UpdateTenantEcommerceProductWorkspaceEditableSnapshotUseCase(
      ecommerceProductDraftRepository as never,
      detailUseCase,
      () => new Date('2026-05-28T16:15:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'saved_draft_001', {
        title: ' SaaS Platform Store flagship offer v2 ',
        pricingBand: ' Upper mid-ticket band ',
        offerAngle: ' Primary promise refined ',
        primaryCta: ' Ver producto principal ',
        channelSequence: [' Landing conversion step ', '', 'Whatsapp follow-up'],
      }),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:15:00.000Z'),
      workspace: {
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T16:00:00.000Z'),
        savedDraftId: 'saved_draft_001',
        promotedAt: new Date('2026-05-28T16:00:00.000Z'),
        status: 'needs_commercial_connections',
        headline:
          'El candidate ya vive como product workspace y puede editarse, manteniendo visibles las conexiones comerciales pendientes.',
        detail:
          'Este workspace ya fija ownership sobre el candidate, pero sigue bloqueando cualquier salto a publicacion final o pricing definitivo.',
        editableSnapshot: {
          title: 'SaaS Platform Store flagship offer v2',
          pricingBand: 'Upper mid-ticket band',
          offerAngle: 'Primary promise refined',
          primaryCta: 'Ver producto principal',
          suggestedChannels: ['catalog', 'landing'],
          channelSequence: [
            'Landing conversion step',
            'Whatsapp follow-up',
          ],
        },
        guardrails: ['No auto publish.', 'No final pricing yet.'],
        nextActions: [
          'Cierra conexiones comerciales pendientes antes de convertir este workspace en producto operativo.',
          'Sigue afinando CTA y pricing band sin asumir publicación ni SKU final.',
        ],
      },
      sourceDraftId: 'saas-platform:draft:core-offer',
      readiness: {
        briefingStatus: 'needs_commercial_connections',
        refinementStatus: 'needs_commercial_connections',
        lastSavedAt: new Date('2026-05-28T16:12:00.000Z'),
      },
    });

    expect(
      ecommerceProductDraftRepository.updateEditableSnapshot,
    ).toHaveBeenCalledWith('saas-platform', 'saved_draft_001', {
      title: 'SaaS Platform Store flagship offer v2',
      pricingBand: 'Upper mid-ticket band',
      offerAngle: 'Primary promise refined',
      primaryCta: 'Ver producto principal',
      channelSequence: ['Landing conversion step', 'Whatsapp follow-up'],
    });
  });

  it('creates one product workspace readiness packet', async () => {
    const detailUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T16:10:00.000Z'),
        workspace: {
          tenantSlug: 'saas-platform',
          generatedAt: new Date('2026-05-28T16:00:00.000Z'),
          savedDraftId: 'saved_draft_001',
          promotedAt: new Date('2026-05-28T16:00:00.000Z'),
          status: 'needs_commercial_connections',
          headline:
            'El candidate ya vive como product workspace y puede editarse, manteniendo visibles las conexiones comerciales pendientes.',
          detail:
            'Este workspace ya fija ownership sobre el candidate, pero sigue bloqueando cualquier salto a publicacion final o pricing definitivo.',
          editableSnapshot: {
            title: 'SaaS Platform Store flagship offer',
            pricingBand: 'Mid-ticket anchor band',
            offerAngle: 'Primary promise',
            primaryCta: 'Explorar oferta principal',
            suggestedChannels: ['catalog', 'landing'],
            channelSequence: ['Catalog anchor', 'Landing conversion step'],
          },
          guardrails: ['No auto publish.', 'No final pricing yet.'],
          nextActions: [
            'Cierra conexiones comerciales pendientes antes de convertir este workspace en producto operativo.',
            'Sigue afinando CTA y pricing band sin asumir publicación ni SKU final.',
          ],
        },
      }),
    };
    const useCase = new RequestTenantEcommerceProductWorkspaceReadinessPacketUseCase(
      detailUseCase as never,
      () => new Date('2026-05-28T16:18:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'saved_draft_001'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:18:00.000Z'),
      workspace: {
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T16:00:00.000Z'),
        savedDraftId: 'saved_draft_001',
        promotedAt: new Date('2026-05-28T16:00:00.000Z'),
        status: 'needs_commercial_connections',
        headline:
          'El candidate ya vive como product workspace y puede editarse, manteniendo visibles las conexiones comerciales pendientes.',
        detail:
          'Este workspace ya fija ownership sobre el candidate, pero sigue bloqueando cualquier salto a publicacion final o pricing definitivo.',
        editableSnapshot: {
          title: 'SaaS Platform Store flagship offer',
          pricingBand: 'Mid-ticket anchor band',
          offerAngle: 'Primary promise',
          primaryCta: 'Explorar oferta principal',
          suggestedChannels: ['catalog', 'landing'],
          channelSequence: ['Catalog anchor', 'Landing conversion step'],
        },
        guardrails: ['No auto publish.', 'No final pricing yet.'],
        nextActions: [
          'Cierra conexiones comerciales pendientes antes de convertir este workspace en producto operativo.',
          'Sigue afinando CTA y pricing band sin asumir publicación ni SKU final.',
        ],
      },
      readinessStatus: 'needs_commercial_connections',
      summary:
        'El workspace ya puede seguir afinandose, pero conviene cerrar algunas decisiones comerciales antes de tratarlo como producto operativo.',
      requiredDecisions: [
        'Cerrar pricing band y CTA con una postura comercial consistente.',
        'Acordar la secuencia de canal antes de abrir setup de producto.',
        'Validar ownership operativo entre Ecommerce, Growth e Invoicing.',
      ],
      blockedBy: [
        'Todavia faltan conexiones comerciales para tratar este workspace como producto real.',
      ],
      recommendedArtifacts: [
        'Product positioning note',
        'CTA and pricing confirmation',
        'Cross-channel follow-up sequence',
      ],
      guardrails: [
        'No auto publish.',
        'No final pricing yet.',
        'No convertir este packet en publicacion automatica ni en SKU final todavia.',
      ],
    });
  });
});
