import {
  GetTenantEcommerceCatalogAssetEntityWorkspaceUseCase,
  GetTenantEcommerceCatalogCommercialCardUseCase,
  GetTenantEcommerceChannelReleaseExecutionReadinessUseCase,
  GetTenantEcommerceChannelReleaseWorkbenchUseCase,
  GetTenantEcommerceLandingAssetEntityWorkspaceUseCase,
  GetTenantEcommerceLandingPageStructureUseCase,
  GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase,
  GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
  GetTenantEcommerceProductEntityChannelReleaseCandidateDetailUseCase,
  GetTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase,
  GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase,
  GetTenantEcommerceProductEntityChannelDraftDetailUseCase,
  GetTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase,
  GetTenantEcommerceProductEntityDetailUseCase,
  GetTenantEcommerceSavedProductEntityChannelDraftDetailUseCase,
  ListTenantEcommerceProductEntityChannelAssetWorkspacesUseCase,
  ListTenantEcommerceProductEntityChannelAssetEntitiesUseCase,
  ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase,
  ListTenantEcommerceProductEntitiesUseCase,
  ListTenantEcommerceSavedProductEntityChannelDraftsUseCase,
  PromoteTenantEcommerceProductSetupToProductEntityUseCase,
  PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase,
  PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase,
  PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase,
  RequestTenantEcommerceChannelReleaseHandoffPacketUseCase,
  RequestTenantEcommerceProductEntityChannelAssetPublishPacketUseCase,
  RequestTenantEcommerceProductEntityChannelDraftActionPacketUseCase,
  RequestTenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketUseCase,
  RequestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase,
  RequestTenantEcommerceProductEntityCommercializationPacketUseCase,
  RequestTenantEcommerceWhatsappGrowthHandoffUseCase,
  SaveTenantEcommerceProductEntityChannelDraftUseCase,
  UpdateTenantEcommerceProductEntityChannelAssetEntityEditableSnapshotUseCase,
  UpdateTenantEcommerceSavedProductEntityChannelDraftEditableSnapshotUseCase,
  GetTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase,
  GetTenantEcommerceWhatsappSalesFlowUseCase,
} from '@saas-platform/ecommerce-application';

describe('Ecommerce product entity use cases', () => {
  const productSetup = {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-05-28T16:28:00.000Z'),
    productSetupId: 'product_setup_001',
    savedDraftId: 'saved_draft_001',
    sourceDraftId: 'saas-platform:draft:core-offer',
    status: 'needs_commercial_connections' as const,
    title: 'SaaS Platform Store flagship offer setup v2',
    productType: 'core_offer' as const,
    pricingBand: 'Operator confirmed band',
    offerAngle: 'Promesa refinada para setup persistido',
    primaryCta: 'Activar producto base',
    suggestedChannels: ['catalog', 'landing'] as Array<
      'catalog' | 'landing' | 'whatsapp'
    >,
    channelSequence: ['Landing step', 'Whatsapp close'],
    promotedFromWorkspaceAt: new Date('2026-05-28T16:20:00.000Z'),
  };

  const productEntity = {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-05-28T16:31:00.000Z'),
    productEntityId: 'product_entity_001',
    productSetupId: 'product_setup_001',
    savedDraftId: 'saved_draft_001',
    sourceDraftId: 'saas-platform:draft:core-offer',
    status: 'needs_channel_assets' as const,
    title: 'SaaS Platform Store flagship offer setup v2',
    productType: 'core_offer' as const,
    pricingBand: 'Operator confirmed band',
    offerAngle: 'Promesa refinada para setup persistido',
    primaryCta: 'Activar producto base',
    suggestedChannels: ['catalog', 'landing'] as Array<
      'catalog' | 'landing' | 'whatsapp'
    >,
    channelSequence: ['Landing step', 'Whatsapp close'],
    promotedFromSetupAt: new Date('2026-05-28T16:31:00.000Z'),
  };

  it('promotes one product setup into a persisted product entity', async () => {
    const ecommerceProductSetupRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productSetup),
    };
    const ecommerceProductEntityRepository = {
      save: jest.fn().mockResolvedValue(productEntity),
    };
    const useCase = new PromoteTenantEcommerceProductSetupToProductEntityUseCase(
      ecommerceProductSetupRepository as never,
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:31:00.000Z'),
      () => 'product_entity_001',
    );

    await expect(
      useCase.execute('saas-platform', 'product_setup_001'),
    ).resolves.toEqual(productEntity);
  });

  it('lists the persisted product entities for one tenant', async () => {
    const ecommerceProductEntityRepository = {
      listByTenantSlug: jest.fn().mockResolvedValue([productEntity]),
    };
    const useCase = new ListTenantEcommerceProductEntitiesUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:32:00.000Z'),
    );

    await expect(useCase.execute('saas-platform')).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:32:00.000Z'),
      summary: {
        totalProductEntities: 1,
        draftCatalogProductCount: 0,
        needsChannelAssetsCount: 1,
        needsActivationCount: 0,
        headline:
          'Ecommerce ya tiene entidades propias de producto dentro del catalogo operativo.',
        detail:
          'Este registro marca el paso entre setup persistido y producto catalogable dentro de Ecommerce.',
      },
      productEntities: [productEntity],
    });
  });

  it('loads one product entity detail', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const useCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:33:00.000Z'),
      productEntity,
      summary:
        'La entidad ya existe, pero todavia conviene cerrar assets de canal antes de tratarla como producto mas operable.',
      nextActions: [
        'Cerrar assets de canal y CTA antes de asumir operacion mas amplia.',
        'Mantener la entidad separada de checkout real por ahora.',
      ],
      blockedBy: ['Todavia faltan assets de canal para avanzar con seguridad.'],
      guardrails: [
        'No tratar esta entidad como checkout ni inventario final todavia.',
        'Mantener la salida comercial separada de publicacion automatica por ahora.',
      ],
    });
  });

  it('requests one product entity commercialization packet', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const useCase =
      new RequestTenantEcommerceProductEntityCommercializationPacketUseCase(
        getDetailUseCase,
        () => new Date('2026-05-28T16:34:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:34:00.000Z'),
      productEntity,
      commercializationStatus: 'needs_channel_assets',
      summary:
        'La entidad ya existe, pero conviene cerrar assets de canal antes de tratarla como salida comercial mas operable.',
      requiredDecisions: [
        'Cerrar assets de canal y secuencia comercial antes del rollout.',
        'Alinear el uso de landing, catalogo y WhatsApp con una sola narrativa.',
        'Confirmar que no hay dependencias abiertas con activation.',
      ],
      blockedBy: [
        'Todavia faltan assets de canal para tratar esta entidad como salida comercial mas operable.',
      ],
      recommendedArtifacts: [
        'Channel rollout brief',
        'Landing and CTA QA checklist',
        'WhatsApp follow-up sequence',
      ],
      guardrails: [
        'No tratar esta entidad como checkout ni inventario final todavia.',
        'Mantener la salida comercial separada de publicacion automatica por ahora.',
        'No convertir este packet en checkout real ni publicacion automatica todavia.',
      ],
    });
  });

  it('loads one product entity channel assets workspace', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const useCase =
      new GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase(
        getDetailUseCase,
        () => new Date('2026-05-28T16:38:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:38:00.000Z'),
      productEntity,
      workspaceStatus: 'needs_channel_assets',
      summary:
        'La entidad ya existe, pero todavia conviene cerrar narrativa y assets base antes de abrir drafts por canal.',
      channels: {
        landing: {
          status: 'needs_core_copy',
          headline:
            'Todavia falta cerrar promesa principal y CTA para aterrizar la landing.',
          recommendedAssets: [
            'Hero headline',
            'Primary CTA block',
            'Trust proof section',
          ],
        },
        catalog: {
          status: 'needs_core_copy',
          headline:
            'Todavia falta cerrar oferta y framing para abrir la ficha de catálogo.',
          recommendedAssets: [
            'Catalog title',
            'Pricing snapshot',
            'Short conversion copy',
          ],
        },
        whatsapp: {
          status: 'needs_core_copy',
          headline:
            'Todavia falta cerrar narrativa y CTA para abrir la secuencia de WhatsApp.',
          recommendedAssets: [
            'Opening message',
            'Follow-up branch',
            'Recovery CTA',
          ],
        },
      },
      nextActions: [
        'Cerrar promesa, CTA y secuencia base antes de abrir drafts por canal.',
        'Mantener los assets como preparación operativa, no como publicación final.',
      ],
      blockedBy: [
        'Todavia faltan assets base de canal para abrir drafts comerciales consistentes.',
      ],
      guardrails: [
        'No tratar esta entidad como checkout ni inventario final todavia.',
        'Mantener la salida comercial separada de publicacion automatica por ahora.',
        'No tratar este workspace como publicación final ni como flujo vivo de WhatsApp todavia.',
      ],
    });
  });

  it('loads one product entity channel asset drafts workspace', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const getChannelAssetsWorkspaceUseCase =
      new GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase(
        getDetailUseCase,
        () => new Date('2026-05-28T16:38:00.000Z'),
      );
    const useCase =
      new GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase(
        getChannelAssetsWorkspaceUseCase,
        () => new Date('2026-05-28T16:39:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:39:00.000Z'),
      productEntity,
      workspaceStatus: 'needs_channel_assets',
      summary:
        'Todavia conviene cerrar narrativa y assets base antes de abrir drafts operativos por canal.',
      drafts: {
        landing: {
          status: 'needs_core_copy',
          headline:
            'Todavia falta cerrar promesa y CTA antes de abrir el draft de landing.',
          sections: [
            'Hero promise',
            'Primary CTA band',
            'Trust proof strip',
            'Offer breakdown',
          ],
          recommendedOwner: 'shared',
        },
        catalog: {
          status: 'needs_core_copy',
          headline:
            'Todavia falta cerrar framing y pricing antes de abrir el draft de catálogo.',
          blocks: [
            'Product title',
            'Pricing snapshot',
            'Short conversion copy',
            'Primary CTA label',
          ],
          recommendedOwner: 'ecommerce',
        },
        whatsapp: {
          status: 'needs_core_copy',
          headline:
            'Todavia falta cerrar narrativa y recovery CTA antes de abrir la secuencia draft de WhatsApp.',
          sequence: [
            'Opening message',
            'Follow-up branch',
            'Recovery CTA',
          ],
          recommendedOwner: 'growth',
        },
      },
      nextActions: [
        'Cerrar promesa, CTA y framing antes de abrir drafts comerciales.',
        'Mantener estos drafts como preparación operativa, no como publicación final.',
      ],
      blockedBy: [
        'Todavia faltan assets base de canal para abrir drafts operativos consistentes.',
      ],
      guardrails: [
        'No tratar esta entidad como checkout ni inventario final todavia.',
        'Mantener la salida comercial separada de publicacion automatica por ahora.',
        'No tratar este workspace como publicación final ni como flujo vivo de WhatsApp todavia.',
        'No tratar estos drafts como publicación real ni como flujo vivo todavia.',
      ],
    });
  });

  it('loads one product entity channel draft detail', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const getChannelAssetsWorkspaceUseCase =
      new GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase(
        getDetailUseCase,
        () => new Date('2026-05-28T16:38:00.000Z'),
      );
    const getChannelAssetDraftsWorkspaceUseCase =
      new GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase(
        getChannelAssetsWorkspaceUseCase,
        () => new Date('2026-05-28T16:39:00.000Z'),
      );
    const useCase = new GetTenantEcommerceProductEntityChannelDraftDetailUseCase(
      getChannelAssetDraftsWorkspaceUseCase,
      () => new Date('2026-05-28T16:40:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:40:00.000Z'),
      productEntity,
      channelKey: 'landing',
      draftStatus: 'needs_core_copy',
      summary:
        'Todavia conviene cerrar copy base antes de abrir el draft de landing.',
      headline:
        'Todavia falta cerrar promesa y CTA antes de abrir el draft de landing.',
      recommendedOwner: 'shared',
      structure: [
        'Hero promise',
        'Primary CTA band',
        'Trust proof strip',
        'Offer breakdown',
      ],
      requiredInputs: ['Hero promise', 'Primary CTA', 'Trust proof'],
      blockedBy: [
        'Todavia faltan assets base de canal para abrir drafts operativos consistentes.',
      ],
      guardrails: [
        'No tratar esta entidad como checkout ni inventario final todavia.',
        'Mantener la salida comercial separada de publicacion automatica por ahora.',
        'No tratar este workspace como publicación final ni como flujo vivo de WhatsApp todavia.',
        'No tratar estos drafts como publicación real ni como flujo vivo todavia.',
      ],
    });
  });

  it('requests one product entity channel draft action packet', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const getChannelAssetsWorkspaceUseCase =
      new GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase(
        getDetailUseCase,
        () => new Date('2026-05-28T16:38:00.000Z'),
      );
    const getChannelAssetDraftsWorkspaceUseCase =
      new GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase(
        getChannelAssetsWorkspaceUseCase,
        () => new Date('2026-05-28T16:39:00.000Z'),
      );
    const getChannelDraftDetailUseCase =
      new GetTenantEcommerceProductEntityChannelDraftDetailUseCase(
        getChannelAssetDraftsWorkspaceUseCase,
        () => new Date('2026-05-28T16:40:00.000Z'),
      );
    const useCase =
      new RequestTenantEcommerceProductEntityChannelDraftActionPacketUseCase(
        getChannelDraftDetailUseCase,
        () => new Date('2026-05-28T16:41:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:41:00.000Z'),
      productEntity,
      channelKey: 'landing',
      actionStatus: 'needs_core_copy',
      summary:
        'Todavia conviene cerrar inputs clave antes de abrir el draft de landing.',
      requiredInputs: ['Hero promise', 'Primary CTA', 'Trust proof'],
      recommendedArtifacts: [
        'Landing copy sheet',
        'CTA QA checklist',
        'Trust proof references',
      ],
      nextStep:
        'Cerrar los inputs base de landing antes de abrir el draft operativo.',
      blockedBy: [
        'Todavia faltan assets base de canal para abrir drafts operativos consistentes.',
      ],
      guardrails: [
        'No tratar esta entidad como checkout ni inventario final todavia.',
        'Mantener la salida comercial separada de publicacion automatica por ahora.',
        'No tratar este workspace como publicación final ni como flujo vivo de WhatsApp todavia.',
        'No tratar estos drafts como publicación real ni como flujo vivo todavia.',
        'No tratar este packet como publicación final ni automatización viva todavia.',
      ],
    });
  });

  it('requests one product entity channel draft publish readiness packet', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const getChannelAssetsWorkspaceUseCase =
      new GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase(
        getDetailUseCase,
        () => new Date('2026-05-28T16:38:00.000Z'),
      );
    const getChannelAssetDraftsWorkspaceUseCase =
      new GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase(
        getChannelAssetsWorkspaceUseCase,
        () => new Date('2026-05-28T16:39:00.000Z'),
      );
    const getChannelDraftDetailUseCase =
      new GetTenantEcommerceProductEntityChannelDraftDetailUseCase(
        getChannelAssetDraftsWorkspaceUseCase,
        () => new Date('2026-05-28T16:40:00.000Z'),
      );
    const useCase =
      new RequestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase(
        getChannelDraftDetailUseCase,
        () => new Date('2026-05-28T16:42:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:42:00.000Z'),
      productEntity,
      channelKey: 'landing',
      readinessStatus: 'needs_core_copy',
      summary:
        'Todavia conviene cerrar copy y checks base antes de tratar el draft de landing como casi publicable.',
      requiredChecks: ['Hero QA', 'CTA clarity', 'Trust proof review'],
      recommendedArtifacts: [
        'Landing publish checklist',
        'Hero copy review',
        'CTA review note',
      ],
      blockedBy: [
        'Todavia faltan assets base de canal para abrir drafts operativos consistentes.',
      ],
      guardrails: [
        'No tratar esta entidad como checkout ni inventario final todavia.',
        'Mantener la salida comercial separada de publicacion automatica por ahora.',
        'No tratar este workspace como publicación final ni como flujo vivo de WhatsApp todavia.',
        'No tratar estos drafts como publicación real ni como flujo vivo todavia.',
        'No tratar este packet como publicación real ni activación viva todavia.',
      ],
    });
  });

  it('loads one product entity channel draft publish preparation workspace', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const getChannelAssetsWorkspaceUseCase =
      new GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase(
        getDetailUseCase,
        () => new Date('2026-05-28T16:38:00.000Z'),
      );
    const getChannelAssetDraftsWorkspaceUseCase =
      new GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase(
        getChannelAssetsWorkspaceUseCase,
        () => new Date('2026-05-28T16:39:00.000Z'),
      );
    const getChannelDraftDetailUseCase =
      new GetTenantEcommerceProductEntityChannelDraftDetailUseCase(
        getChannelAssetDraftsWorkspaceUseCase,
        () => new Date('2026-05-28T16:40:00.000Z'),
      );
    const requestPublishReadinessPacketUseCase =
      new RequestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase(
        getChannelDraftDetailUseCase,
        () => new Date('2026-05-28T16:42:00.000Z'),
      );
    const useCase =
      new GetTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase(
        getChannelDraftDetailUseCase,
        requestPublishReadinessPacketUseCase,
        () => new Date('2026-05-28T16:43:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:43:00.000Z'),
      productEntity,
      channelKey: 'landing',
      preparationStatus: 'needs_core_copy',
      summary:
        'Todavia conviene cerrar copy base antes de preparar el staging del draft de landing.',
      handoffOwner: 'shared',
      draftBlueprint: [
        'Hero promise',
        'Primary CTA band',
        'Trust proof strip',
        'Offer breakdown',
      ],
      publishChecklist: ['Hero QA', 'CTA clarity', 'Trust proof review'],
      recommendedArtifacts: [
        'Landing publish checklist',
        'Hero copy review',
        'CTA review note',
      ],
      nextMilestone:
        'Cerrar copy base y checks de landing antes de tratar el draft como staging operable.',
      blockedBy: [
        'Todavia faltan assets base de canal para abrir drafts operativos consistentes.',
      ],
      guardrails: [
        'No tratar esta entidad como checkout ni inventario final todavia.',
        'Mantener la salida comercial separada de publicacion automatica por ahora.',
        'No tratar este workspace como publicación final ni como flujo vivo de WhatsApp todavia.',
        'No tratar estos drafts como publicación real ni como flujo vivo todavia.',
        'No tratar este packet como publicación real ni activación viva todavia.',
        'No tratar este workspace como publicación real ni como asset vivo todavía.',
      ],
    });
  });

  it('saves one product entity channel draft', async () => {
    const tenant = { id: 'tenant_001', slug: 'saas-platform' };
    const getTenantBySlugUseCase = {
      execute: jest.fn().mockResolvedValue(tenant),
    };
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const getChannelAssetsWorkspaceUseCase =
      new GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase(
        getDetailUseCase,
        () => new Date('2026-05-28T16:38:00.000Z'),
      );
    const getChannelAssetDraftsWorkspaceUseCase =
      new GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase(
        getChannelAssetsWorkspaceUseCase,
        () => new Date('2026-05-28T16:39:00.000Z'),
      );
    const getChannelDraftDetailUseCase =
      new GetTenantEcommerceProductEntityChannelDraftDetailUseCase(
        getChannelAssetDraftsWorkspaceUseCase,
        () => new Date('2026-05-28T16:40:00.000Z'),
      );
    const requestPublishReadinessPacketUseCase =
      new RequestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase(
        getChannelDraftDetailUseCase,
        () => new Date('2026-05-28T16:42:00.000Z'),
      );
    const getPublishPreparationWorkspaceUseCase =
      new GetTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase(
        getChannelDraftDetailUseCase,
        requestPublishReadinessPacketUseCase,
        () => new Date('2026-05-28T16:43:00.000Z'),
      );
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest
        .fn()
        .mockResolvedValue(null),
      save: jest.fn().mockResolvedValue({
        id: 'channel_draft_001',
        tenantId: 'tenant_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        status: 'saved_channel_draft',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'SaaS Platform Store flagship offer setup v2 landing draft',
        summary:
          'Todavia conviene cerrar copy base antes de preparar el staging del draft de landing.',
        headline:
          'Todavia falta cerrar promesa y CTA antes de abrir el draft de landing.',
        draftBlueprint: [
          'Hero promise',
          'Primary CTA band',
          'Trust proof strip',
          'Offer breakdown',
        ],
        publishChecklist: ['Hero QA', 'CTA clarity', 'Trust proof review'],
        recommendedArtifacts: [
          'Landing publish checklist',
          'Hero copy review',
          'CTA review note',
        ],
        nextMilestone:
          'Cerrar copy base y checks de landing antes de tratar el draft como staging operable.',
        blockedBy: [
          'Todavia faltan assets base de canal para abrir drafts operativos consistentes.',
        ],
        guardrails: [
          'No tratar esta entidad como checkout ni inventario final todavia.',
        ],
        createdAt: new Date('2026-05-28T16:44:00.000Z'),
        updatedAt: new Date('2026-05-28T16:44:00.000Z'),
      }),
    };
    const useCase = new SaveTenantEcommerceProductEntityChannelDraftUseCase(
      getTenantBySlugUseCase as never,
      getChannelDraftDetailUseCase,
      getPublishPreparationWorkspaceUseCase,
      ecommerceProductEntityChannelDraftRepository as never,
      () => 'channel_draft_001',
      () => new Date('2026-05-28T16:44:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:44:00.000Z'),
      summary:
        'El channel draft quedó guardado como asset candidate, manteniendo copy pendiente y checklist visible antes de staging más real.',
      savedChannelDraft: {
        id: 'channel_draft_001',
        tenantId: 'tenant_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        status: 'saved_channel_draft',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'SaaS Platform Store flagship offer setup v2 landing draft',
        summary:
          'Todavia conviene cerrar copy base antes de preparar el staging del draft de landing.',
        headline:
          'Todavia falta cerrar promesa y CTA antes de abrir el draft de landing.',
        draftBlueprint: [
          'Hero promise',
          'Primary CTA band',
          'Trust proof strip',
          'Offer breakdown',
        ],
        publishChecklist: ['Hero QA', 'CTA clarity', 'Trust proof review'],
        recommendedArtifacts: [
          'Landing publish checklist',
          'Hero copy review',
          'CTA review note',
        ],
        nextMilestone:
          'Cerrar copy base y checks de landing antes de tratar el draft como staging operable.',
        blockedBy: [
          'Todavia faltan assets base de canal para abrir drafts operativos consistentes.',
        ],
        guardrails: [
          'No tratar esta entidad como checkout ni inventario final todavia.',
        ],
        createdAt: new Date('2026-05-28T16:44:00.000Z'),
        updatedAt: new Date('2026-05-28T16:44:00.000Z'),
      },
    });
  });

  it('lists saved product entity channel drafts', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      listByTenantSlugAndProductEntityId: jest.fn().mockResolvedValue([
        {
          id: 'channel_draft_001',
          tenantId: 'tenant_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          channelKey: 'landing',
          status: 'saved_channel_draft',
          preparationStatus: 'needs_core_copy',
          handoffOwner: 'shared',
          title: 'SaaS Platform Store flagship offer setup v2 landing draft',
          summary:
            'Todavia conviene cerrar copy base antes de preparar el staging del draft de landing.',
          headline:
            'Todavia falta cerrar promesa y CTA antes de abrir el draft de landing.',
          draftBlueprint: ['Hero promise'],
          publishChecklist: ['Hero QA'],
          recommendedArtifacts: ['Landing publish checklist'],
          nextMilestone:
            'Cerrar copy base y checks de landing antes de tratar el draft como staging operable.',
          blockedBy: [
            'Todavia faltan assets base de canal para abrir drafts operativos consistentes.',
          ],
          guardrails: [
            'No tratar esta entidad como checkout ni inventario final todavia.',
          ],
          createdAt: new Date('2026-05-28T16:44:00.000Z'),
          updatedAt: new Date('2026-05-28T16:44:00.000Z'),
        },
      ]),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const useCase = new ListTenantEcommerceSavedProductEntityChannelDraftsUseCase(
      ecommerceProductEntityChannelDraftRepository as never,
      getDetailUseCase,
      () => new Date('2026-05-28T16:45:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:45:00.000Z'),
      productEntity,
      summary: {
        totalSavedDrafts: 1,
        readyToStageCount: 0,
        needsCoreCopyCount: 1,
        blockedCount: 0,
        headline:
          'Ya existe un registro persistido de channel drafts para esta product entity.',
        detail:
          'Usa este registro para retomar staging y preparación de landing, catálogo y WhatsApp sin volver al estado efímero.',
      },
      drafts: [
        {
          id: 'channel_draft_001',
          tenantId: 'tenant_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          channelKey: 'landing',
          status: 'saved_channel_draft',
          preparationStatus: 'needs_core_copy',
          handoffOwner: 'shared',
          title: 'SaaS Platform Store flagship offer setup v2 landing draft',
          summary:
            'Todavia conviene cerrar copy base antes de preparar el staging del draft de landing.',
          headline:
            'Todavia falta cerrar promesa y CTA antes de abrir el draft de landing.',
          draftBlueprint: ['Hero promise'],
          publishChecklist: ['Hero QA'],
          recommendedArtifacts: ['Landing publish checklist'],
          nextMilestone:
            'Cerrar copy base y checks de landing antes de tratar el draft como staging operable.',
          blockedBy: [
            'Todavia faltan assets base de canal para abrir drafts operativos consistentes.',
          ],
          guardrails: [
            'No tratar esta entidad como checkout ni inventario final todavia.',
          ],
          createdAt: new Date('2026-05-28T16:44:00.000Z'),
          updatedAt: new Date('2026-05-28T16:44:00.000Z'),
        },
      ],
    });
  });

  it('loads one saved product entity channel draft detail', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest.fn().mockResolvedValue({
        id: 'channel_draft_001',
        tenantId: 'tenant_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        status: 'saved_channel_draft',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'SaaS Platform Store flagship offer setup v2 landing draft',
        summary:
          'Todavia conviene cerrar copy base antes de preparar el staging del draft de landing.',
        headline:
          'Todavia falta cerrar promesa y CTA antes de abrir el draft de landing.',
        draftBlueprint: ['Hero promise'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['Landing publish checklist'],
        nextMilestone:
          'Cerrar copy base y checks de landing antes de tratar el draft como staging operable.',
        blockedBy: [
          'Todavia faltan assets base de canal para abrir drafts operativos consistentes.',
        ],
        guardrails: [
          'No tratar esta entidad como checkout ni inventario final todavia.',
        ],
        createdAt: new Date('2026-05-28T16:44:00.000Z'),
        updatedAt: new Date('2026-05-28T16:44:00.000Z'),
      }),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const useCase = new GetTenantEcommerceSavedProductEntityChannelDraftDetailUseCase(
      ecommerceProductEntityChannelDraftRepository as never,
      getDetailUseCase,
      () => new Date('2026-05-28T16:46:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:46:00.000Z'),
      productEntity,
      savedChannelDraft: {
        id: 'channel_draft_001',
        tenantId: 'tenant_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        status: 'saved_channel_draft',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'SaaS Platform Store flagship offer setup v2 landing draft',
        summary:
          'Todavia conviene cerrar copy base antes de preparar el staging del draft de landing.',
        headline:
          'Todavia falta cerrar promesa y CTA antes de abrir el draft de landing.',
        draftBlueprint: ['Hero promise'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['Landing publish checklist'],
        nextMilestone:
          'Cerrar copy base y checks de landing antes de tratar el draft como staging operable.',
        blockedBy: [
          'Todavia faltan assets base de canal para abrir drafts operativos consistentes.',
        ],
        guardrails: [
          'No tratar esta entidad como checkout ni inventario final todavia.',
        ],
        createdAt: new Date('2026-05-28T16:44:00.000Z'),
        updatedAt: new Date('2026-05-28T16:44:00.000Z'),
      },
      summary:
        'El channel draft ya quedó persistido, pero todavía conviene cerrar copy base antes de empujarlo a staging más real.',
      nextActions: [
        'Cerrar copy base y blueprint antes de empujar este asset a staging más real.',
        'Mantener el draft separado de publicación viva por ahora.',
      ],
      blockedBy: [
        'Todavia faltan assets base de canal para abrir drafts operativos consistentes.',
      ],
      guardrails: [
        'No tratar esta entidad como checkout ni inventario final todavia.',
      ],
    });
  });

  it('updates one saved product entity channel draft editable snapshot', async () => {
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest
        .fn()
        .mockResolvedValue({
          id: 'channel_draft_001',
          tenantId: 'tenant_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          channelKey: 'landing',
          status: 'saved_channel_draft',
          preparationStatus: 'needs_core_copy',
          handoffOwner: 'shared',
          title: 'Original draft',
          summary: 'Original summary',
          headline: 'Original headline',
          draftBlueprint: ['Hero promise'],
          publishChecklist: ['Hero QA'],
          recommendedArtifacts: ['Landing publish checklist'],
          nextMilestone: 'Original next milestone',
          blockedBy: [],
          guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
          createdAt: new Date('2026-05-28T16:44:00.000Z'),
          updatedAt: new Date('2026-05-28T16:44:00.000Z'),
        }),
      updateEditableSnapshot: jest.fn().mockResolvedValue({
        id: 'channel_draft_001',
        tenantId: 'tenant_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        status: 'saved_channel_draft',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'Updated landing draft',
        summary: 'Original summary',
        headline: 'Updated headline',
        draftBlueprint: ['New hero', 'New CTA'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['New artifact'],
        nextMilestone: 'Updated next milestone',
        blockedBy: [],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        createdAt: new Date('2026-05-28T16:44:00.000Z'),
        updatedAt: new Date('2026-05-28T16:47:00.000Z'),
      }),
    };
    const expectedDetail = {
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:47:00.000Z'),
      productEntity,
      savedChannelDraft: {
        id: 'channel_draft_001',
        tenantId: 'tenant_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        status: 'saved_channel_draft',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'Updated landing draft',
        summary: 'Original summary',
        headline: 'Updated headline',
        draftBlueprint: ['New hero', 'New CTA'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['New artifact'],
        nextMilestone: 'Updated next milestone',
        blockedBy: [],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        createdAt: new Date('2026-05-28T16:44:00.000Z'),
        updatedAt: new Date('2026-05-28T16:47:00.000Z'),
      },
      summary:
        'El channel draft ya quedó persistido, pero todavía conviene cerrar copy base antes de empujarlo a staging más real.',
      nextActions: [
        'Cerrar copy base y blueprint antes de empujar este asset a staging más real.',
        'Mantener el draft separado de publicación viva por ahora.',
      ],
      blockedBy: [],
      guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
    };
    const getSavedDraftDetailUseCase = {
      execute: jest.fn().mockResolvedValue(expectedDetail),
    };
    const useCase =
      new UpdateTenantEcommerceSavedProductEntityChannelDraftEditableSnapshotUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getSavedDraftDetailUseCase as never,
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing', {
        title: '  Updated landing draft  ',
        headline: ' Updated headline ',
        draftBlueprint: [' New hero ', ' ', 'New CTA'],
        recommendedArtifacts: [' New artifact ', ' '],
        nextMilestone: ' Updated next milestone ',
      }),
    ).resolves.toEqual(expectedDetail);

    expect(
      ecommerceProductEntityChannelDraftRepository.updateEditableSnapshot,
    ).toHaveBeenCalledWith('saas-platform', 'product_entity_001', 'landing', {
      title: 'Updated landing draft',
      headline: 'Updated headline',
      draftBlueprint: ['New hero', 'New CTA'],
      recommendedArtifacts: ['New artifact'],
      nextMilestone: 'Updated next milestone',
    });
  });

  it('promotes one saved product entity channel draft to channel asset workspace', async () => {
    const ecommerceProductEntityChannelDraftRepository = {
      markPromotedToAssetWorkspace: jest.fn().mockResolvedValue({
        id: 'channel_draft_001',
        tenantId: 'tenant_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        status: 'saved_channel_draft',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'Landing staging draft actualizado',
        summary: 'Original summary',
        headline: 'Updated headline',
        draftBlueprint: ['New hero', 'New CTA'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['New artifact'],
        nextMilestone: 'Updated next milestone',
        blockedBy: [],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToAssetWorkspaceAt: new Date('2026-05-28T16:48:00.000Z'),
        createdAt: new Date('2026-05-28T16:44:00.000Z'),
        updatedAt: new Date('2026-05-28T16:48:00.000Z'),
      }),
    };
    const useCase =
      new PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:48:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:48:00.000Z'),
      productEntityId: 'product_entity_001',
      channelKey: 'landing',
      promotedAt: new Date('2026-05-28T16:48:00.000Z'),
      status: 'needs_core_copy',
      handoffOwner: 'shared',
      headline:
        'El asset workspace de landing ya existe, pero todavía necesita copy base antes de tratarlo como artifact más operable.',
      detail:
        'Este workspace ya fija ownership del canal, pero mantiene explícito que todavía no estamos publicando un asset vivo.',
      editableSnapshot: {
        title: 'Landing staging draft actualizado',
        headline: 'Updated headline',
        draftBlueprint: ['New hero', 'New CTA'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['New artifact'],
        nextMilestone: 'Updated next milestone',
      },
      guardrails: [
        'No tratar esta entidad como checkout ni inventario final todavia.',
      ],
      nextActions: [
        'Cerrar copy y artifacts base antes de tratar este asset como staging operable.',
        'Mantener este workspace separado de publicación real por ahora.',
      ],
    });
  });

  it('lists product entity channel asset workspaces', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      listByTenantSlugAndProductEntityId: jest.fn().mockResolvedValue([
        {
          id: 'channel_draft_001',
          tenantId: 'tenant_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          channelKey: 'landing',
          status: 'saved_channel_draft',
          preparationStatus: 'needs_core_copy',
          handoffOwner: 'shared',
          title: 'Landing staging draft actualizado',
          summary: 'Original summary',
          headline: 'Updated headline',
          draftBlueprint: ['New hero', 'New CTA'],
          publishChecklist: ['Hero QA'],
          recommendedArtifacts: ['New artifact'],
          nextMilestone: 'Updated next milestone',
          blockedBy: [],
          guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
          promotedToAssetWorkspaceAt: new Date('2026-05-28T16:48:00.000Z'),
          createdAt: new Date('2026-05-28T16:44:00.000Z'),
          updatedAt: new Date('2026-05-28T16:48:00.000Z'),
        },
      ]),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:48:00.000Z'),
      );
    const useCase =
      new ListTenantEcommerceProductEntityChannelAssetWorkspacesUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        promoteUseCase,
        () => new Date('2026-05-28T16:49:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:49:00.000Z'),
      productEntity,
      summary: {
        totalWorkspaces: 1,
        readyForAssetEditCount: 0,
        needsCoreCopyCount: 1,
        blockedCount: 0,
        headline:
          'Ya existe un registro de channel asset workspaces promovidos desde drafts persistidos.',
        detail:
          'Este registro marca el paso entre draft persistido y asset workspace operable por canal.',
      },
      workspaces: [
        {
          tenantSlug: 'saas-platform',
          generatedAt: new Date('2026-05-28T16:48:00.000Z'),
          productEntityId: 'product_entity_001',
          channelKey: 'landing',
          promotedAt: new Date('2026-05-28T16:48:00.000Z'),
          status: 'needs_core_copy',
          handoffOwner: 'shared',
          headline:
            'El asset workspace de landing ya existe, pero todavía necesita copy base antes de tratarlo como artifact más operable.',
          detail:
            'Este workspace ya fija ownership del canal, pero mantiene explícito que todavía no estamos publicando un asset vivo.',
          editableSnapshot: {
            title: 'Landing staging draft actualizado',
            headline: 'Updated headline',
            draftBlueprint: ['New hero', 'New CTA'],
            publishChecklist: ['Hero QA'],
            recommendedArtifacts: ['New artifact'],
            nextMilestone: 'Updated next milestone',
          },
          guardrails: [
            'No tratar esta entidad como checkout ni inventario final todavia.',
          ],
          nextActions: [
            'Cerrar copy y artifacts base antes de tratar este asset como staging operable.',
            'Mantener este workspace separado de publicación real por ahora.',
          ],
        },
      ],
    });
  });

  it('loads one product entity channel asset workspace detail', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest.fn().mockResolvedValue({
        id: 'channel_draft_001',
        tenantId: 'tenant_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        status: 'saved_channel_draft',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'Landing staging draft actualizado',
        summary: 'Original summary',
        headline: 'Updated headline',
        draftBlueprint: ['New hero', 'New CTA'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['New artifact'],
        nextMilestone: 'Updated next milestone',
        blockedBy: ['Pending copy review'],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToAssetWorkspaceAt: new Date('2026-05-28T16:48:00.000Z'),
        createdAt: new Date('2026-05-28T16:44:00.000Z'),
        updatedAt: new Date('2026-05-28T16:48:00.000Z'),
      }),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:48:00.000Z'),
      );
    const useCase =
      new GetTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        promoteUseCase,
        () => new Date('2026-05-28T16:50:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:50:00.000Z'),
      productEntity,
      workspace: {
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T16:48:00.000Z'),
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        promotedAt: new Date('2026-05-28T16:48:00.000Z'),
        status: 'needs_core_copy',
        handoffOwner: 'shared',
        headline:
          'El asset workspace de landing ya existe, pero todavía necesita copy base antes de tratarlo como artifact más operable.',
        detail:
          'Este workspace ya fija ownership del canal, pero mantiene explícito que todavía no estamos publicando un asset vivo.',
        editableSnapshot: {
          title: 'Landing staging draft actualizado',
          headline: 'Updated headline',
          draftBlueprint: ['New hero', 'New CTA'],
          publishChecklist: ['Hero QA'],
          recommendedArtifacts: ['New artifact'],
          nextMilestone: 'Updated next milestone',
        },
        guardrails: [
          'No tratar esta entidad como checkout ni inventario final todavia.',
        ],
        nextActions: [
          'Cerrar copy y artifacts base antes de tratar este asset como staging operable.',
          'Mantener este workspace separado de publicación real por ahora.',
        ],
      },
      sourceSavedChannelDraftId: 'channel_draft_001',
      blockedBy: ['Pending copy review'],
    });
  });

  it('requests one product entity channel asset publish packet', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest.fn().mockResolvedValue({
        id: 'channel_draft_001',
        tenantId: 'tenant_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        status: 'saved_channel_draft',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'Landing staging draft actualizado',
        summary: 'Original summary',
        headline: 'Updated headline',
        draftBlueprint: ['New hero', 'New CTA'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['New artifact'],
        nextMilestone: 'Updated next milestone',
        blockedBy: ['Pending copy review'],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToAssetWorkspaceAt: new Date('2026-05-28T16:48:00.000Z'),
        createdAt: new Date('2026-05-28T16:44:00.000Z'),
        updatedAt: new Date('2026-05-28T16:48:00.000Z'),
      }),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:48:00.000Z'),
      );
    const getWorkspaceDetailUseCase =
      new GetTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        promoteUseCase,
        () => new Date('2026-05-28T16:50:00.000Z'),
      );
    const useCase =
      new RequestTenantEcommerceProductEntityChannelAssetPublishPacketUseCase(
        getWorkspaceDetailUseCase,
        () => new Date('2026-05-28T16:51:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:51:00.000Z'),
      productEntity,
      channelKey: 'landing',
      publishStatus: 'needs_core_copy',
      handoffOwner: 'shared',
      summary:
        'Todavia conviene cerrar copy y checklist base antes de tratar el asset workspace de landing como staging publicable.',
      requiredChecks: ['Hero QA'],
      recommendedArtifacts: ['New artifact'],
      nextMilestone: 'Updated next milestone',
      blockedBy: ['Pending copy review'],
      guardrails: [
        'No tratar esta entidad como checkout ni inventario final todavia.',
        'No tratar este packet como publicación real ni como asset vivo todavía.',
      ],
    });
  });

  it('promotes one product entity channel asset workspace to channel asset entity', async () => {
    const ecommerceProductEntityChannelDraftRepository = {
      markPromotedToAssetEntity: jest.fn().mockResolvedValue({
        id: 'channel_draft_001',
        tenantId: 'tenant_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        status: 'saved_channel_draft',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'Landing staging draft actualizado',
        summary: 'Original summary',
        headline: 'Updated headline',
        draftBlueprint: ['New hero', 'New CTA'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['New artifact'],
        nextMilestone: 'Updated next milestone',
        blockedBy: ['Pending copy review'],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToAssetEntityAt: new Date('2026-05-28T16:53:00.000Z'),
        createdAt: new Date('2026-05-28T16:44:00.000Z'),
        updatedAt: new Date('2026-05-28T16:53:00.000Z'),
      }),
    };
    const useCase =
      new PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:53:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:53:00.000Z'),
      assetEntityId: 'channel_draft_001',
      productEntityId: 'product_entity_001',
      sourceSavedChannelDraftId: 'channel_draft_001',
      channelKey: 'landing',
      promotedAt: new Date('2026-05-28T16:53:00.000Z'),
      status: 'needs_publish_copy',
      handoffOwner: 'shared',
      title: 'Landing staging draft actualizado',
      headline: 'Updated headline',
      summary:
        'La entity de asset de landing ya existe, pero todavía necesita copy base antes de tratarla como artifact operable.',
      draftBlueprint: ['New hero', 'New CTA'],
      publishChecklist: ['Hero QA'],
      recommendedArtifacts: ['New artifact'],
      nextMilestone: 'Updated next milestone',
      blockedBy: ['Pending copy review'],
      guardrails: [
        'No tratar esta entidad como checkout ni inventario final todavia.',
        'No tratar esta entity de asset como publicación viva ni checkout real todavía.',
      ],
    });
  });

  it('lists product entity channel asset entities', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      listByTenantSlugAndProductEntityId: jest.fn().mockResolvedValue([
        {
          id: 'channel_draft_001',
          tenantId: 'tenant_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          channelKey: 'landing',
          status: 'saved_channel_draft',
          preparationStatus: 'needs_core_copy',
          handoffOwner: 'shared',
          title: 'Landing staging draft actualizado',
          summary: 'Original summary',
          headline: 'Updated headline',
          draftBlueprint: ['New hero', 'New CTA'],
          publishChecklist: ['Hero QA'],
          recommendedArtifacts: ['New artifact'],
          nextMilestone: 'Updated next milestone',
          blockedBy: ['Pending copy review'],
          guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
          promotedToAssetEntityAt: new Date('2026-05-28T16:53:00.000Z'),
          createdAt: new Date('2026-05-28T16:44:00.000Z'),
          updatedAt: new Date('2026-05-28T16:53:00.000Z'),
        },
      ]),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:53:00.000Z'),
      );
    const useCase =
      new ListTenantEcommerceProductEntityChannelAssetEntitiesUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        promoteUseCase,
        () => new Date('2026-05-28T16:54:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:54:00.000Z'),
      productEntity,
      summary: {
        totalAssetEntities: 1,
        draftAssetEntityCount: 0,
        needsPublishCopyCount: 1,
        blockedCount: 0,
        headline: 'Ecommerce ya tiene entities persistidas de assets por canal.',
        detail:
          'Este registro marca el paso entre workspace de asset y artifact persistido operable por canal.',
      },
      assetEntities: [
        {
          tenantSlug: 'saas-platform',
          generatedAt: new Date('2026-05-28T16:53:00.000Z'),
          assetEntityId: 'channel_draft_001',
          productEntityId: 'product_entity_001',
          sourceSavedChannelDraftId: 'channel_draft_001',
          channelKey: 'landing',
          promotedAt: new Date('2026-05-28T16:53:00.000Z'),
          status: 'needs_publish_copy',
          handoffOwner: 'shared',
          title: 'Landing staging draft actualizado',
          headline: 'Updated headline',
          summary:
            'La entity de asset de landing ya existe, pero todavía necesita copy base antes de tratarla como artifact operable.',
          draftBlueprint: ['New hero', 'New CTA'],
          publishChecklist: ['Hero QA'],
          recommendedArtifacts: ['New artifact'],
          nextMilestone: 'Updated next milestone',
          blockedBy: ['Pending copy review'],
          guardrails: [
            'No tratar esta entidad como checkout ni inventario final todavia.',
            'No tratar esta entity de asset como publicación viva ni checkout real todavía.',
          ],
        },
      ],
    });
  });

  it('loads one product entity channel asset entity detail', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest.fn().mockResolvedValue({
        id: 'channel_draft_001',
        tenantId: 'tenant_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        status: 'saved_channel_draft',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'Landing staging draft actualizado',
        summary: 'Original summary',
        headline: 'Updated headline',
        draftBlueprint: ['New hero', 'New CTA'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['New artifact'],
        nextMilestone: 'Updated next milestone',
        blockedBy: ['Pending copy review'],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToAssetEntityAt: new Date('2026-05-28T16:53:00.000Z'),
        createdAt: new Date('2026-05-28T16:44:00.000Z'),
        updatedAt: new Date('2026-05-28T16:53:00.000Z'),
      }),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:53:00.000Z'),
      );
    const useCase =
      new GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        promoteUseCase,
        () => new Date('2026-05-28T16:55:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:55:00.000Z'),
      productEntity,
      assetEntity: {
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T16:53:00.000Z'),
        assetEntityId: 'channel_draft_001',
        productEntityId: 'product_entity_001',
        sourceSavedChannelDraftId: 'channel_draft_001',
        channelKey: 'landing',
        promotedAt: new Date('2026-05-28T16:53:00.000Z'),
        status: 'needs_publish_copy',
        handoffOwner: 'shared',
        title: 'Landing staging draft actualizado',
        headline: 'Updated headline',
        summary:
          'La entity de asset de landing ya existe, pero todavía necesita copy base antes de tratarla como artifact operable.',
        draftBlueprint: ['New hero', 'New CTA'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['New artifact'],
        nextMilestone: 'Updated next milestone',
        blockedBy: ['Pending copy review'],
        guardrails: [
          'No tratar esta entidad como checkout ni inventario final todavia.',
          'No tratar esta entity de asset como publicación viva ni checkout real todavía.',
        ],
      },
    });
  });

  it('updates one product entity channel asset entity editable snapshot', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      updateEditableSnapshot: jest.fn().mockResolvedValue({}),
      findByTenantSlugAndProductEntityIdAndChannelKey: jest.fn().mockResolvedValue({
        id: 'channel_draft_001',
        tenantId: 'tenant_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        status: 'saved_channel_draft',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'Landing asset entity final',
        summary: 'Original summary',
        headline: 'Headline final',
        draftBlueprint: ['Hero final', 'CTA final'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['Landing packet'],
        nextMilestone: 'QA final de landing',
        blockedBy: ['Pending copy review'],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToAssetEntityAt: new Date('2026-05-28T16:53:00.000Z'),
        createdAt: new Date('2026-05-28T16:44:00.000Z'),
        updatedAt: new Date('2026-05-28T16:56:00.000Z'),
      }),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:53:00.000Z'),
      );
    const getAssetEntityDetailUseCase =
      new GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        promoteUseCase,
        () => new Date('2026-05-28T16:55:00.000Z'),
      );
    const useCase =
      new UpdateTenantEcommerceProductEntityChannelAssetEntityEditableSnapshotUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getAssetEntityDetailUseCase,
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing', {
        title: 'Landing asset entity final',
        headline: 'Headline final',
        draftBlueprint: ['Hero final', 'CTA final'],
        recommendedArtifacts: ['Landing packet'],
        nextMilestone: 'QA final de landing',
      }),
    ).resolves.toMatchObject({
      assetEntity: {
        channelKey: 'landing',
        title: 'Landing asset entity final',
        headline: 'Headline final',
      },
    });
  });

  it('requests one product entity channel asset entity publish preparation packet', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest.fn().mockResolvedValue({
        id: 'channel_draft_001',
        tenantId: 'tenant_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        status: 'saved_channel_draft',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'Landing asset entity final',
        summary: 'Original summary',
        headline: 'Headline final',
        draftBlueprint: ['Hero final', 'CTA final'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['Landing packet'],
        nextMilestone: 'QA final de landing',
        blockedBy: ['Pending copy review'],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToAssetEntityAt: new Date('2026-05-28T16:53:00.000Z'),
        createdAt: new Date('2026-05-28T16:44:00.000Z'),
        updatedAt: new Date('2026-05-28T16:56:00.000Z'),
      }),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:53:00.000Z'),
      );
    const getAssetEntityDetailUseCase =
      new GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        promoteUseCase,
        () => new Date('2026-05-28T16:55:00.000Z'),
      );
    const useCase =
      new RequestTenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketUseCase(
        getAssetEntityDetailUseCase,
        () => new Date('2026-05-28T16:57:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T16:57:00.000Z'),
      productEntity,
      channelKey: 'landing',
      preparationStatus: 'needs_publish_copy',
      handoffOwner: 'shared',
      summary:
        'Todavia conviene cerrar publish copy antes de promover la entity de asset de landing.',
      requiredChecks: ['Hero QA'],
      recommendedArtifacts: ['Landing packet'],
      nextMilestone: 'QA final de landing',
      blockedBy: ['Pending copy review'],
      guardrails: [
        'No tratar esta entidad como checkout ni inventario final todavia.',
        'No tratar esta entity de asset como publicación viva ni checkout real todavía.',
        'No tratar este packet como publicación viva ni activación automática todavía.',
      ],
    });
  });

  it('promotes one product entity channel asset entity to release candidate', async () => {
    const ecommerceProductEntityChannelDraftRepository = {
      markPromotedToReleaseCandidate: jest.fn().mockResolvedValue({
        id: 'channel_draft_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'Landing asset entity final',
        headline: 'Headline final',
        draftBlueprint: ['Hero final', 'CTA final'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['Landing packet'],
        nextMilestone: 'QA final de landing',
        blockedBy: ['Pending copy review'],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
      }),
    };
    const useCase =
      new PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:58:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing'),
    ).resolves.toMatchObject({
      channelKey: 'landing',
      status: 'needs_publish_copy',
      promotedAt: new Date('2026-05-28T16:58:00.000Z'),
    });
  });

  it('lists product entity channel release candidates', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      listByTenantSlugAndProductEntityId: jest.fn().mockResolvedValue([
        {
          id: 'channel_draft_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          channelKey: 'landing',
          preparationStatus: 'needs_core_copy',
          handoffOwner: 'shared',
          title: 'Landing asset entity final',
          headline: 'Headline final',
          publishChecklist: ['Hero QA'],
          recommendedArtifacts: ['Landing packet'],
          nextMilestone: 'QA final de landing',
          blockedBy: ['Pending copy review'],
          guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
          promotedToReleaseCandidateAt: new Date('2026-05-28T16:58:00.000Z'),
        },
      ]),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:58:00.000Z'),
      );
    const useCase =
      new ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        promoteUseCase,
        () => new Date('2026-05-28T16:59:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      summary: { totalCandidates: 1 },
      releaseCandidates: [{ channelKey: 'landing' }],
    });
  });

  it('loads one product entity channel release candidate detail', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest.fn().mockResolvedValue({
        id: 'channel_draft_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'Landing asset entity final',
        headline: 'Headline final',
        draftBlueprint: ['Hero final', 'CTA final'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['Landing packet'],
        nextMilestone: 'QA final de landing',
        blockedBy: ['Pending copy review'],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToReleaseCandidateAt: new Date('2026-05-28T16:58:00.000Z'),
      }),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:58:00.000Z'),
      );
    const useCase =
      new GetTenantEcommerceProductEntityChannelReleaseCandidateDetailUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        promoteUseCase,
        () => new Date('2026-05-28T17:00:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001', 'landing'),
    ).resolves.toMatchObject({
      productEntity,
      releaseCandidate: {
        channelKey: 'landing',
        status: 'needs_publish_copy',
      },
    });
  });

  it('loads one landing asset entity workspace', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest.fn().mockResolvedValue({
        id: 'channel_draft_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'Landing asset entity final',
        headline: 'Headline final',
        draftBlueprint: ['Hero final', 'CTA final'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['Landing packet'],
        nextMilestone: 'QA final de landing',
        blockedBy: ['Pending copy review'],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToAssetEntityAt: new Date('2026-05-28T16:53:00.000Z'),
      }),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:53:00.000Z'),
      );
    const getAssetEntityDetailUseCase =
      new GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        promoteUseCase,
        () => new Date('2026-05-28T16:55:00.000Z'),
      );
    const useCase = new GetTenantEcommerceLandingAssetEntityWorkspaceUseCase(
      getAssetEntityDetailUseCase,
      () => new Date('2026-05-28T17:01:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      workspaceStatus: 'needs_publish_copy',
      hero: {
        headline: 'Headline final',
        primaryCta: 'Activar producto base',
      },
      proofBlocks: [
        'SaaS Platform Store flagship offer setup v2 como oferta principal',
        'Landing packet',
      ],
      publishChecklist: ['Hero QA'],
    });
  });

  it('loads one catalog asset entity workspace', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest.fn().mockResolvedValue({
        id: 'channel_draft_002',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'catalog',
        preparationStatus: 'ready_to_stage',
        handoffOwner: 'ecommerce',
        title: 'Catalog asset entity final',
        headline: 'Catalog headline final',
        publishChecklist: ['Pricing QA'],
        recommendedArtifacts: ['Catalog pricing card'],
        draftBlueprint: ['Offer bullets', 'Pricing snapshot'],
        nextMilestone: 'QA final de catalogo',
        blockedBy: [],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToAssetEntityAt: new Date('2026-05-28T16:53:00.000Z'),
      }),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:53:00.000Z'),
      );
    const getAssetEntityDetailUseCase =
      new GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        promoteUseCase,
        () => new Date('2026-05-28T16:55:00.000Z'),
      );
    const useCase = new GetTenantEcommerceCatalogAssetEntityWorkspaceUseCase(
      getAssetEntityDetailUseCase,
      () => new Date('2026-05-28T17:02:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      workspaceStatus: 'ready_for_catalog_assembly',
      merchandisingCard: {
        title: 'Catalog asset entity final',
        pricingSnapshot: 'Operator confirmed band',
        primaryCta: 'Activar producto base',
      },
      offerBullets: ['Offer bullets', 'Pricing snapshot'],
      merchandisingChecks: ['Pricing QA'],
    });
  });

  it('loads one catalog commercial card', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest.fn().mockResolvedValue({
        id: 'channel_draft_002',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'catalog',
        preparationStatus: 'ready_to_stage',
        handoffOwner: 'ecommerce',
        title: 'Catalog asset entity final',
        headline: 'Catalog headline final',
        publishChecklist: ['Pricing QA'],
        recommendedArtifacts: ['Catalog pricing card'],
        draftBlueprint: ['Offer bullets', 'Pricing snapshot'],
        nextMilestone: 'QA final de catalogo',
        blockedBy: [],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToAssetEntityAt: new Date('2026-05-28T16:53:00.000Z'),
      }),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:53:00.000Z'),
      );
    const getAssetEntityDetailUseCase =
      new GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        promoteUseCase,
        () => new Date('2026-05-28T16:55:00.000Z'),
      );
    const getWorkspaceUseCase =
      new GetTenantEcommerceCatalogAssetEntityWorkspaceUseCase(
        getAssetEntityDetailUseCase,
        () => new Date('2026-05-28T17:02:00.000Z'),
      );
    const useCase = new GetTenantEcommerceCatalogCommercialCardUseCase(
      getWorkspaceUseCase,
      () => new Date('2026-05-28T17:02:30.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      commercialStatus: 'ready_for_storefront_card',
      card: {
        title: 'Catalog asset entity final',
        shortDescription: 'Catalog headline final',
        pricingPresentation: 'Operator confirmed band',
        primaryCta: 'Activar producto base',
      },
      offerBullets: ['Offer bullets', 'Pricing snapshot'],
    });
  });

  it('loads one whatsapp channel sequence workspace', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest.fn().mockResolvedValue({
        id: 'channel_draft_003',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'whatsapp',
        preparationStatus: 'ready_to_stage',
        handoffOwner: 'growth',
        title: 'Whatsapp asset entity final',
        headline: 'Mensaje de apertura final',
        publishChecklist: ['Sequence QA'],
        recommendedArtifacts: ['Recovery branch', 'Close note'],
        draftBlueprint: ['Follow-up angle', 'Recovery CTA'],
        nextMilestone: 'QA final de whatsapp',
        blockedBy: [],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToAssetEntityAt: new Date('2026-05-28T16:53:00.000Z'),
      }),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:53:00.000Z'),
      );
    const getAssetEntityDetailUseCase =
      new GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        promoteUseCase,
        () => new Date('2026-05-28T16:55:00.000Z'),
      );
    const useCase =
      new GetTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase(
        getAssetEntityDetailUseCase,
        () => new Date('2026-05-28T17:03:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      workspaceStatus: 'ready_for_sequence_assembly',
      opener: 'Mensaje de apertura final',
      followUpSequence: [
        'Mensaje de apertura final',
        'Follow-up 1: Follow-up angle',
        'Follow-up 2: Recovery CTA',
      ],
      recoveryBranch: ['Recovery: Recovery branch', 'Recovery: Close note'],
      closeCta: 'Activar producto base',
    });
  });

  it('loads one channel release workbench', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      listByTenantSlugAndProductEntityId: jest.fn().mockResolvedValue([
        {
          id: 'channel_draft_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          channelKey: 'landing',
          preparationStatus: 'needs_core_copy',
          handoffOwner: 'shared',
          title: 'Landing asset entity final',
          headline: 'Headline final',
          publishChecklist: ['Hero QA'],
          recommendedArtifacts: ['Landing packet'],
          nextMilestone: 'QA final de landing',
          blockedBy: ['Pending copy review'],
          guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
          promotedToReleaseCandidateAt: new Date('2026-05-28T16:58:00.000Z'),
        },
      ]),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const listReleaseCandidatesUseCase =
      new ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        new PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase(
          ecommerceProductEntityChannelDraftRepository as never,
          () => new Date('2026-05-28T16:58:00.000Z'),
        ),
        () => new Date('2026-05-28T16:59:00.000Z'),
      );
    const useCase = new GetTenantEcommerceChannelReleaseWorkbenchUseCase(
      getDetailUseCase,
      listReleaseCandidatesUseCase,
      () => new Date('2026-05-28T17:04:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      summary: {
        totalCandidates: 1,
        headline: 'Ecommerce ya puede revisar release final por canal.',
      },
      channels: [
        {
          channelKey: 'landing',
          status: 'needs_publish_copy',
        },
        {
          channelKey: 'catalog',
          status: 'missing',
        },
        {
          channelKey: 'whatsapp',
          status: 'missing',
        },
      ],
      qaChecklist: [
        'Verificar copy final y CTA por canal',
        'Confirmar artifacts mínimos de landing, catálogo y WhatsApp',
        'Mantener rollout como controlado, no como publicación viva automática',
      ],
      finalArtifacts: ['Landing packet'],
    });
  });

  it('loads one channel release execution readiness workspace', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      listByTenantSlugAndProductEntityId: jest.fn().mockResolvedValue([
        {
          id: 'channel_draft_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          channelKey: 'landing',
          preparationStatus: 'needs_core_copy',
          handoffOwner: 'shared',
          title: 'Landing asset entity final',
          headline: 'Headline final',
          publishChecklist: ['Hero QA'],
          recommendedArtifacts: ['Landing packet'],
          nextMilestone: 'QA final de landing',
          blockedBy: ['Pending copy review'],
          guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
          promotedToReleaseCandidateAt: new Date('2026-05-28T16:58:00.000Z'),
        },
      ]),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const listReleaseCandidatesUseCase =
      new ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        new PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase(
          ecommerceProductEntityChannelDraftRepository as never,
          () => new Date('2026-05-28T16:58:00.000Z'),
        ),
        () => new Date('2026-05-28T16:59:00.000Z'),
      );
    const useCase =
      new GetTenantEcommerceChannelReleaseExecutionReadinessUseCase(
        getDetailUseCase,
        listReleaseCandidatesUseCase,
        () => new Date('2026-05-28T17:05:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      overallStatus: 'needs_channel_completion',
      channels: [
        expect.objectContaining({
          channelKey: 'landing',
          releaseStatus: 'needs_publish_copy',
        }),
        expect.objectContaining({
          channelKey: 'catalog',
          releaseStatus: 'missing',
        }),
        expect.objectContaining({
          channelKey: 'whatsapp',
          releaseStatus: 'missing',
        }),
      ],
      finalChecklist: [
        'Verificar copy final y CTA por canal',
        'Confirmar artifacts mínimos para landing, catálogo y WhatsApp',
        'Mantener el rollout como controlado con owner explícito por canal',
      ],
    });
  });

  it('requests one channel release handoff packet', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      listByTenantSlugAndProductEntityId: jest.fn().mockResolvedValue([
        {
          id: 'channel_draft_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          channelKey: 'landing',
          preparationStatus: 'needs_core_copy',
          handoffOwner: 'shared',
          title: 'Landing asset entity final',
          headline: 'Headline final',
          publishChecklist: ['Hero QA'],
          recommendedArtifacts: ['Landing packet'],
          nextMilestone: 'QA final de landing',
          blockedBy: ['Pending copy review'],
          guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
          promotedToReleaseCandidateAt: new Date('2026-05-28T16:58:00.000Z'),
        },
      ]),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const listReleaseCandidatesUseCase =
      new ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        new PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase(
          ecommerceProductEntityChannelDraftRepository as never,
          () => new Date('2026-05-28T16:58:00.000Z'),
        ),
        () => new Date('2026-05-28T16:59:00.000Z'),
      );
    const getWorkbenchUseCase = new GetTenantEcommerceChannelReleaseWorkbenchUseCase(
      getDetailUseCase,
      listReleaseCandidatesUseCase,
      () => new Date('2026-05-28T17:04:00.000Z'),
    );
    const getReadinessUseCase =
      new GetTenantEcommerceChannelReleaseExecutionReadinessUseCase(
        getDetailUseCase,
        listReleaseCandidatesUseCase,
        () => new Date('2026-05-28T17:05:00.000Z'),
      );
    const useCase = new RequestTenantEcommerceChannelReleaseHandoffPacketUseCase(
      getReadinessUseCase,
      getWorkbenchUseCase,
      () => new Date('2026-05-28T17:05:30.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      handoffStatus: 'needs_channel_completion',
      ownerModel: {
        primaryOwner: 'shared',
        releaseMode: 'controlled_release',
      },
      channels: expect.arrayContaining([
        expect.objectContaining({
          channelKey: 'landing',
          blockerType: 'warning',
        }),
      ]),
    });
  });

  it('loads one landing page structure', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest.fn().mockResolvedValue({
        id: 'channel_draft_001',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'landing',
        preparationStatus: 'needs_core_copy',
        handoffOwner: 'shared',
        title: 'Landing asset entity final',
        headline: 'Headline final',
        draftBlueprint: ['Hero final', 'CTA final'],
        publishChecklist: ['Hero QA'],
        recommendedArtifacts: ['Landing packet'],
        nextMilestone: 'QA final de landing',
        blockedBy: ['Pending copy review'],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToAssetEntityAt: new Date('2026-05-28T16:53:00.000Z'),
      }),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:53:00.000Z'),
      );
    const getAssetEntityDetailUseCase =
      new GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        getDetailUseCase,
        promoteUseCase,
        () => new Date('2026-05-28T16:55:00.000Z'),
      );
    const getLandingWorkspaceUseCase =
      new GetTenantEcommerceLandingAssetEntityWorkspaceUseCase(
        getAssetEntityDetailUseCase,
        () => new Date('2026-05-28T17:01:00.000Z'),
      );
    const useCase = new GetTenantEcommerceLandingPageStructureUseCase(
      getLandingWorkspaceUseCase,
      () => new Date('2026-05-28T17:06:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      structureStatus: 'needs_publish_copy',
      ctaBand: {
        primaryCta: 'Activar producto base',
      },
      faqSeed: [
        '¿Qué problema principal resuelve esta oferta?',
        '¿Cómo se activa o implementa?',
        '¿Qué resultado se puede esperar en el primer tramo?',
      ],
    });
  });

  it('loads one whatsapp sales flow', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest.fn().mockResolvedValue({
        id: 'channel_draft_003',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'whatsapp',
        preparationStatus: 'ready_to_stage',
        handoffOwner: 'growth',
        title: 'Whatsapp asset entity final',
        headline: 'Mensaje de apertura final',
        draftBlueprint: ['Follow-up angle', 'Recovery CTA'],
        publishChecklist: ['Sequence QA'],
        recommendedArtifacts: ['Recovery branch', 'Close note'],
        nextMilestone: 'QA final de whatsapp',
        blockedBy: [],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToAssetEntityAt: new Date('2026-05-28T16:53:00.000Z'),
      }),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:53:00.000Z'),
      );
    const getWhatsappWorkspaceUseCase =
      new GetTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase(
        new GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase(
          ecommerceProductEntityChannelDraftRepository as never,
          getDetailUseCase,
          promoteUseCase,
          () => new Date('2026-05-28T16:55:00.000Z'),
        ),
        () => new Date('2026-05-28T17:03:00.000Z'),
      );
    const useCase = new GetTenantEcommerceWhatsappSalesFlowUseCase(
      getWhatsappWorkspaceUseCase,
      () => new Date('2026-05-28T17:07:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      flowStatus: 'ready_for_operator_flow',
      stages: {
        opener: 'Mensaje de apertura final',
        qualification: 'Follow-up 1: Follow-up angle',
        closingCta: 'Activar producto base',
      },
      operatorChecklist: ['Sequence QA'],
    });
  });

  it('requests one whatsapp growth handoff', async () => {
    const ecommerceProductEntityRepository = {
      findByTenantSlugAndId: jest.fn().mockResolvedValue(productEntity),
    };
    const ecommerceProductEntityChannelDraftRepository = {
      findByTenantSlugAndProductEntityIdAndChannelKey: jest.fn().mockResolvedValue({
        id: 'channel_draft_003',
        tenantSlug: 'saas-platform',
        productEntityId: 'product_entity_001',
        channelKey: 'whatsapp',
        preparationStatus: 'ready_to_stage',
        handoffOwner: 'growth',
        title: 'Whatsapp asset entity final',
        headline: 'Mensaje de apertura final',
        publishChecklist: ['Sequence QA'],
        recommendedArtifacts: ['Recovery branch', 'Close note'],
        draftBlueprint: ['Follow-up angle', 'Recovery CTA'],
        nextMilestone: 'QA final de whatsapp',
        blockedBy: [],
        guardrails: ['No tratar esta entidad como checkout ni inventario final todavia.'],
        promotedToAssetEntityAt: new Date('2026-05-28T16:53:00.000Z'),
      }),
    };
    const getDetailUseCase = new GetTenantEcommerceProductEntityDetailUseCase(
      ecommerceProductEntityRepository as never,
      () => new Date('2026-05-28T16:33:00.000Z'),
    );
    const promoteUseCase =
      new PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase(
        ecommerceProductEntityChannelDraftRepository as never,
        () => new Date('2026-05-28T16:53:00.000Z'),
      );
    const getWhatsappWorkspaceUseCase =
      new GetTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase(
        new GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase(
          ecommerceProductEntityChannelDraftRepository as never,
          getDetailUseCase,
          promoteUseCase,
          () => new Date('2026-05-28T16:55:00.000Z'),
        ),
        () => new Date('2026-05-28T17:03:00.000Z'),
      );
    const getFlowUseCase = new GetTenantEcommerceWhatsappSalesFlowUseCase(
      getWhatsappWorkspaceUseCase,
      () => new Date('2026-05-28T17:07:00.000Z'),
    );
    const useCase = new RequestTenantEcommerceWhatsappGrowthHandoffUseCase(
      getFlowUseCase,
      () => new Date('2026-05-28T17:07:30.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      handoffStatus: 'ready_for_growth_workbench',
      targetWorkspace: {
        productKey: 'growth',
        channel: 'whatsapp',
      },
      payload: {
        opener: 'Mensaje de apertura final',
        closingCta: 'Activar producto base',
      },
    });
  });
});
