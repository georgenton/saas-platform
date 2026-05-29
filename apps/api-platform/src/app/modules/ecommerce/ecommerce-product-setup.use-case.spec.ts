import {
  GetTenantEcommerceProductSetupDetailUseCase,
  ListTenantEcommerceProductSetupsUseCase,
  PromoteTenantEcommerceProductWorkspaceToProductSetupUseCase,
  RequestTenantEcommerceProductSetupDefinitionPacketUseCase,
  UpdateTenantEcommerceProductSetupEditableSnapshotUseCase,
} from '@saas-platform/ecommerce-application';

describe('Ecommerce product setup use cases', () => {
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
    updatedAt: new Date('2026-05-28T16:12:00.000Z'),
  };

  const productSetup = {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-05-28T16:20:00.000Z'),
    productSetupId: 'product_setup_001',
    savedDraftId: 'saved_draft_001',
    sourceDraftId: 'saas-platform:draft:core-offer',
    status: 'needs_commercial_connections' as const,
    title: 'SaaS Platform Store flagship offer',
    productType: 'core_offer' as const,
    pricingBand: 'Mid-ticket anchor band',
    offerAngle: 'Primary promise',
    primaryCta: 'Explorar oferta principal',
    suggestedChannels: ['catalog', 'landing'] as Array<
      'catalog' | 'landing' | 'whatsapp'
    >,
    channelSequence: ['Catalog anchor', 'Landing conversion step'],
    promotedFromWorkspaceAt: new Date('2026-05-28T16:20:00.000Z'),
  };

  it('promotes one product workspace into a persisted product setup', async () => {
    const ecommerceProductDraftRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(savedDraft),
    };
    const ecommerceProductSetupRepository = {
      save: jest.fn().mockResolvedValue(productSetup),
    };
    const useCase = new PromoteTenantEcommerceProductWorkspaceToProductSetupUseCase(
      ecommerceProductDraftRepository as never,
      ecommerceProductSetupRepository as never,
      () => new Date('2026-05-28T16:20:00.000Z'),
      () => 'product_setup_001',
    );

    await expect(
      useCase.execute('saas-platform', 'saved_draft_001'),
    ).resolves.toEqual(productSetup);
  });

  it('lists the persisted product setups for one tenant', async () => {
    const ecommerceProductSetupRepository = {
      listByTenantSlug: jest.fn().mockResolvedValue([productSetup]),
    };
    const useCase = new ListTenantEcommerceProductSetupsUseCase(
      ecommerceProductSetupRepository as never,
      () => new Date('2026-05-28T16:25:00.000Z'),
    );

    await expect(useCase.execute('saas-platform')).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:25:00.000Z'),
      summary: {
        totalProductSetups: 1,
        draftSetupCount: 0,
        needsCommercialConnectionsCount: 1,
        needsActivationCount: 0,
        headline:
          'Ya existe un registro propio de product setups dentro de Ecommerce.',
        detail:
          'Este registro marca el paso entre workspace editable y configuracion persistida del primer producto de tienda.',
      },
      productSetups: [productSetup],
    });
  });

  it('loads one product setup detail', async () => {
    const ecommerceProductSetupRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productSetup),
    };
    const useCase = new GetTenantEcommerceProductSetupDetailUseCase(
      ecommerceProductSetupRepository as never,
      () => new Date('2026-05-28T16:26:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_setup_001'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:26:00.000Z'),
      productSetup,
      summary:
        'El setup ya existe, pero todavia conviene cerrar conexiones comerciales antes de tratarlo como producto operativo.',
      nextActions: [
        'Cerrar pricing y CTA antes de abrir un producto mas operativo.',
        'Mantener la configuracion en modo seguro, sin publicacion final.',
      ],
      blockedBy: [
        'Todavia faltan conexiones comerciales para avanzar con seguridad.',
      ],
      guardrails: [
        'No tratar este setup como publicacion final ni como catalogo expuesto.',
        'Mantener la preparacion comercial separada de inventario y checkout por ahora.',
      ],
    });
  });

  it('requests one product setup definition packet', async () => {
    const ecommerceProductSetupRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productSetup),
    };
    const getDetailUseCase = new GetTenantEcommerceProductSetupDetailUseCase(
      ecommerceProductSetupRepository as never,
      () => new Date('2026-05-28T16:26:00.000Z'),
    );
    const useCase = new RequestTenantEcommerceProductSetupDefinitionPacketUseCase(
      getDetailUseCase,
      () => new Date('2026-05-28T16:27:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_setup_001'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:27:00.000Z'),
      productSetup,
      definitionStatus: 'needs_commercial_connections',
      summary:
        'El product setup ya existe, pero conviene cerrar algunas definiciones comerciales antes de tratarlo como producto mas operativo.',
      requiredDecisions: [
        'Cerrar pricing y CTA con una postura comercial mas estable.',
        'Alinear ownership entre Ecommerce, Growth e Invoicing.',
        'Definir que artefactos se vuelven obligatorios antes de abrir catalogo mas operativo.',
      ],
      blockedBy: [
        'Todavia faltan conexiones comerciales antes de tratar este setup como producto mas operativo.',
      ],
      recommendedArtifacts: [
        'Product definition note',
        'Commercial promise and CTA confirmation',
        'Channel rollout outline',
      ],
      guardrails: [
        'No tratar este setup como publicacion final ni como catalogo expuesto.',
        'Mantener la preparacion comercial separada de inventario y checkout por ahora.',
        'No convertir este packet en publicacion final, inventario ni checkout real todavia.',
      ],
    });
  });

  it('updates one product setup editable snapshot', async () => {
    const updatedProductSetup = {
      ...productSetup,
      generatedAt: new Date('2026-05-28T16:28:00.000Z'),
      title: 'SaaS Platform Store flagship offer setup v2',
      pricingBand: 'Operator confirmed band',
      offerAngle: 'Promesa refinada para setup persistido',
      primaryCta: 'Activar producto base',
      channelSequence: ['Landing step', 'Whatsapp close'],
    };
    const ecommerceProductSetupRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productSetup),
      updateEditableSnapshot: jest.fn().mockResolvedValue(updatedProductSetup),
    };
    const getDetailUseCase = new GetTenantEcommerceProductSetupDetailUseCase(
      {
        findByTenantSlugAndId: jest.fn().mockResolvedValue(updatedProductSetup),
      } as never,
      () => new Date('2026-05-28T16:29:00.000Z'),
    );
    const useCase = new UpdateTenantEcommerceProductSetupEditableSnapshotUseCase(
      ecommerceProductSetupRepository as never,
      getDetailUseCase,
    );

    await expect(
      useCase.execute('saas-platform', 'product_setup_001', {
        title: ' SaaS Platform Store flagship offer setup v2 ',
        pricingBand: ' Operator confirmed band ',
        offerAngle: ' Promesa refinada para setup persistido ',
        primaryCta: ' Activar producto base ',
        channelSequence: [' Landing step ', ' ', 'Whatsapp close'],
      }),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:29:00.000Z'),
      productSetup: updatedProductSetup,
      summary:
        'El setup ya existe, pero todavia conviene cerrar conexiones comerciales antes de tratarlo como producto operativo.',
      nextActions: [
        'Cerrar pricing y CTA antes de abrir un producto mas operativo.',
        'Mantener la configuracion en modo seguro, sin publicacion final.',
      ],
      blockedBy: [
        'Todavia faltan conexiones comerciales para avanzar con seguridad.',
      ],
      guardrails: [
        'No tratar este setup como publicacion final ni como catalogo expuesto.',
        'Mantener la preparacion comercial separada de inventario y checkout por ahora.',
      ],
    });
  });
});
