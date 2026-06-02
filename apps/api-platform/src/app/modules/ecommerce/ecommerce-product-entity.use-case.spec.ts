import {
  GetTenantEcommerceCatalogAssetEntityWorkspaceUseCase,
  GetTenantEcommerceCatalogCommercialCardUseCase,
  GetTenantEcommerceCatalogListingAssetUseCase,
  GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
  GetTenantEcommerceLiveStorefrontSessionWorkspaceUseCase,
  GetTenantEcommerceStorefrontGoLiveManifestUseCase,
  GetTenantEcommerceStorefrontReleaseControlWorkspaceUseCase,
  GetTenantEcommerceStorefrontReleaseCandidateBriefUseCase,
  GetTenantEcommerceStorefrontPublishReviewWorkspaceUseCase,
  GetTenantEcommerceStorefrontPreviewWorkspaceUseCase,
  GetTenantEcommerceChannelReleaseExecutionReadinessUseCase,
  GetTenantEcommerceChannelReleaseWorkbenchUseCase,
  GetTenantEcommerceLandingAssetEntityWorkspaceUseCase,
  GetTenantEcommerceLandingPublishArtifactUseCase,
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
  RequestTenantEcommerceChannelReleaseApprovalPacketUseCase,
  RequestTenantEcommerceChannelReleaseLaunchPacketUseCase,
  RequestTenantEcommerceCatalogStorefrontPlacementPacketUseCase,
  RequestTenantEcommerceCatalogMerchandisingPacketUseCase,
  RequestTenantEcommerceCheckoutCustomerCapturePacketUseCase,
  RequestTenantEcommerceCheckoutCloseoutPacketUseCase,
  RequestTenantEcommerceOrderApprovalDecisionUseCase,
  RequestTenantEcommerceOrderHandoffDecisionUseCase,
  RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
  RequestTenantEcommerceInvoiceHandoffAcknowledgementUseCase,
  RequestTenantEcommerceInvoiceDraftOpenBridgeUseCase,
  RequestTenantEcommerceInvoiceDraftLaunchBridgeUseCase,
  RequestTenantEcommerceOrderRouteResolutionPacketUseCase,
  RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
  RequestTenantEcommerceOrderInvoicingBridgeUseCase,
  RequestTenantEcommerceOrderToGrowthConversationBridgeUseCase,
  RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
  GetTenantEcommerceInvoiceDraftHandoffWorkspaceUseCase,
  GetTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase,
  GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
  GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
  GetTenantEcommerceOrderHoldResolutionWorkspaceUseCase,
  GetTenantEcommerceOrderOpsEscalationBoardUseCase,
  GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
  GetTenantEcommerceOrderPaymentDisputeWorkspaceUseCase,
  GetTenantEcommerceOrderRevenueOpsBoardUseCase,
  GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
  GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase,
  GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
  GetTenantEcommerceOrderPostSaleReportingBoardUseCase,
  GetTenantEcommerceOrderRevenueTrackingSummaryUseCase,
  GetTenantEcommerceOrderOperatorWorkboardUseCase,
  GetTenantEcommerceOrderOpsAttentionWorkspaceUseCase,
  GetTenantEcommerceOrderOpsPriorityQueueUseCase,
  GetTenantEcommerceOrderReviewWorkspaceUseCase,
  GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
  GetTenantEcommerceOrderStatusLifecycleDetailUseCase,
  GetTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase,
  RequestTenantEcommerceOrderFulfillmentCompletionPacketUseCase,
  GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
  GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
  GetTenantEcommerceOrderPostSaleOpsBoardUseCase,
  RequestTenantEcommerceProductEntityChannelAssetPublishPacketUseCase,
  RequestTenantEcommerceProductEntityChannelDraftActionPacketUseCase,
  RequestTenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketUseCase,
  RequestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase,
  RequestTenantEcommerceProductEntityCommercializationPacketUseCase,
  RequestTenantEcommerceWhatsappGrowthHandoffUseCase,
  SaveTenantEcommerceProductEntityChannelDraftUseCase,
  SaveTenantEcommerceOrderDraftUseCase,
  ListTenantEcommerceOrderDraftsUseCase,
  GetTenantEcommerceOrderDraftDetailUseCase,
  ListTenantEcommerceOrderPostSaleLifecyclesUseCase,
  ListTenantEcommerceOrderStatusLifecyclesUseCase,
  UpdateTenantEcommerceProductEntityChannelAssetEntityEditableSnapshotUseCase,
  UpdateTenantEcommerceSavedProductEntityChannelDraftEditableSnapshotUseCase,
  GetTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase,
  GetTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase,
  RequestTenantEcommerceWhatsappGrowthActivationPacketUseCase,
  RequestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase,
  RequestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase,
  RequestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase,
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

  it('loads one storefront preview workspace', async () => {
    const landingPageStructureUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:06:00.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'landing',
        },
        structureStatus: 'needs_publish_copy',
        hero: {
          headline: 'Headline final',
          subheadline: 'Landing subheadline',
          primaryCta: 'Activar producto base',
        },
        proofStrip: ['Proof 1', 'Proof 2'],
        offerStack: [],
        ctaBand: {
          primaryCta: 'Activar producto base',
          supportLabel: 'Support label',
        },
        faqSeed: ['FAQ 1', 'FAQ 2'],
        previewGuardrails: ['Landing guardrail'],
      }),
    };
    const catalogCommercialCardUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:02:30.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'catalog',
        },
        commercialStatus: 'ready_for_storefront_card',
        card: {
          title: 'Catalog asset entity final',
          shortDescription: 'Catalog headline final',
          pricingPresentation: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
        },
        offerBullets: ['Offer bullets', 'Pricing snapshot'],
        storefrontSummary: 'Storefront summary',
        merchandisingHighlights: ['Pricing QA', 'QA final de catalogo'],
        guardrails: ['Catalog guardrail'],
      }),
    };
    const releaseReadinessUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:05:00.000Z'),
        productEntity,
        overallStatus: 'needs_channel_completion',
        summary: 'Readiness summary',
        channels: [
          {
            channelKey: 'landing',
            releaseStatus: 'needs_publish_copy',
            executionOwner: 'shared',
            executionChecklist: ['Hero QA'],
            launchWindow: 'Ajustar copy y artifacts antes de release controlado',
            blockedBy: ['Pending copy review'],
          },
        ],
        finalChecklist: ['Release final checklist'],
        blockedBy: ['Pending copy review'],
        guardrails: ['Release guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceStorefrontPreviewWorkspaceUseCase(
      landingPageStructureUseCase as never,
      catalogCommercialCardUseCase as never,
      releaseReadinessUseCase as never,
      () => new Date('2026-05-28T17:08:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      previewStatus: 'needs_publish_copy',
      landingPreview: {
        headline: 'Headline final',
      },
      catalogPreview: {
        title: 'Catalog asset entity final',
      },
      releaseSignals: [
        expect.objectContaining({
          channelKey: 'landing',
          status: 'needs_publish_copy',
        }),
      ],
    });
  });

  it('loads one storefront publish review workspace', async () => {
    const previewUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:08:00.000Z'),
        productEntity,
        previewStatus: 'needs_publish_copy',
        summary: {
          headline: 'Preview headline',
          detail: 'Preview detail',
        },
        landingPreview: {
          headline: 'Headline final',
          subheadline: 'Landing subheadline',
          primaryCta: 'Activar producto base',
          proofStrip: ['Proof 1'],
        },
        catalogPreview: {
          title: 'Catalog asset entity final',
          shortDescription: 'Catalog headline final',
          pricingPresentation: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          offerBullets: ['Offer bullets'],
        },
        releaseSignals: [
          {
            channelKey: 'landing',
            status: 'needs_publish_copy',
            detail: 'Ajustar copy antes del review final',
          },
        ],
        previewChecklist: ['FAQ 1'],
        guardrails: ['Preview guardrail'],
      }),
    };
    const approvalUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:05:45.000Z'),
        productEntity,
        approvalStatus: 'needs_channel_completion',
        summary: 'Approval summary',
        approvalOwner: 'shared',
        channels: [
          {
            channelKey: 'landing',
            readiness: 'needs_publish_copy',
            approvalDecision: 'review',
            rationale: 'Ajustar copy antes del publish review final',
          },
        ],
        requiredApprovals: ['Checklist'],
        warnings: ['Warning'],
        blockers: [],
        guardrails: ['Approval guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceStorefrontPublishReviewWorkspaceUseCase(
      previewUseCase as never,
      approvalUseCase as never,
      () => new Date('2026-05-28T17:08:15.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      reviewStatus: 'needs_operator_revision',
      approvalSnapshot: {
        approvalOwner: 'shared',
        channelDecisions: [
          expect.objectContaining({
            channelKey: 'landing',
            approvalDecision: 'review',
          }),
        ],
      },
    });
  });

  it('loads one landing publish artifact', async () => {
    const structureUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:06:00.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'landing',
        },
        structureStatus: 'needs_publish_copy',
        hero: {
          headline: 'Headline final',
          subheadline: 'Landing subheadline',
          primaryCta: 'Activar producto base',
        },
        proofStrip: ['Proof 1', 'Proof 2'],
        offerStack: [{ title: 'Offer block 1', detail: 'Hero final' }],
        ctaBand: {
          primaryCta: 'Activar producto base',
          supportLabel: 'Support label',
        },
        faqSeed: ['FAQ 1'],
        previewGuardrails: ['Landing guardrail'],
      }),
    };
    const publishReviewUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:08:15.000Z'),
        productEntity,
        reviewStatus: 'needs_operator_revision',
        summary: {
          headline: 'Review headline',
          detail: 'Review detail',
        },
        previewSnapshot: {
          tenantSlug: 'saas-platform',
          generatedAt: new Date('2026-05-28T17:08:00.000Z'),
          productEntity,
          previewStatus: 'needs_publish_copy',
          summary: { headline: 'Preview headline', detail: 'Preview detail' },
          landingPreview: {
            headline: 'Headline final',
            subheadline: 'Landing subheadline',
            primaryCta: 'Activar producto base',
            proofStrip: ['Proof 1'],
          },
          catalogPreview: {
            title: 'Catalog asset entity final',
            shortDescription: 'Catalog headline final',
            pricingPresentation: 'Operator confirmed band',
            primaryCta: 'Activar producto base',
            offerBullets: ['Offer bullets'],
          },
          releaseSignals: [],
          previewChecklist: ['FAQ 1'],
          guardrails: ['Preview guardrail'],
        },
        approvalSnapshot: {
          approvalStatus: 'needs_channel_completion',
          approvalOwner: 'shared',
          channelDecisions: [],
        },
        reviewChecklist: ['Review checklist'],
        blockers: [],
        guardrails: ['Publish review guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceLandingPublishArtifactUseCase(
      structureUseCase as never,
      publishReviewUseCase as never,
      () => new Date('2026-05-28T17:08:20.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      artifactStatus: 'needs_operator_revision',
      hero: {
        headline: 'Headline final',
      },
      finalChecklist: expect.arrayContaining(['Review checklist']),
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

  it('requests one channel release approval packet', async () => {
    const readinessUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:05:00.000Z'),
        productEntity,
        overallStatus: 'needs_channel_completion',
        summary: 'Readiness summary',
        channels: [
          {
            channelKey: 'landing',
            releaseStatus: 'needs_publish_copy',
            executionOwner: 'shared',
            executionChecklist: ['Hero QA'],
            launchWindow: 'Ajustar copy y artifacts antes de release controlado',
            blockedBy: ['Pending copy review'],
          },
        ],
        finalChecklist: ['Checklist'],
        blockedBy: ['Pending copy review'],
        guardrails: ['Release guardrail'],
      }),
    };
    const handoffUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:05:30.000Z'),
        productEntity,
        handoffStatus: 'needs_channel_completion',
        summary: 'Handoff summary',
        ownerModel: {
          primaryOwner: 'shared',
          escalationOwner: 'shared',
          releaseMode: 'controlled_release',
        },
        channels: [],
        handoffChecklist: ['Checklist'],
        warnings: ['Warning'],
        blockers: [],
        guardrails: ['Handoff guardrail'],
      }),
    };
    const useCase = new RequestTenantEcommerceChannelReleaseApprovalPacketUseCase(
      readinessUseCase as never,
      handoffUseCase as never,
      () => new Date('2026-05-28T17:05:45.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      approvalStatus: 'needs_channel_completion',
      approvalOwner: 'shared',
      channels: [
        expect.objectContaining({
          channelKey: 'landing',
          approvalDecision: 'review',
        }),
      ],
    });
  });

  it('requests one channel release launch packet', async () => {
    const readinessUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:05:00.000Z'),
        productEntity,
        overallStatus: 'needs_channel_completion',
        summary: 'Readiness summary',
        channels: [
          {
            channelKey: 'landing',
            releaseStatus: 'needs_publish_copy',
            executionOwner: 'shared',
            executionChecklist: ['Hero QA'],
            launchWindow: 'Ajustar copy y artifacts antes de release controlado',
            blockedBy: ['Pending copy review'],
          },
        ],
        finalChecklist: ['Checklist'],
        blockedBy: ['Pending copy review'],
        guardrails: ['Release guardrail'],
      }),
    };
    const approvalUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:05:45.000Z'),
        productEntity,
        approvalStatus: 'needs_channel_completion',
        summary: 'Approval summary',
        approvalOwner: 'shared',
        channels: [
          {
            channelKey: 'landing',
            readiness: 'needs_publish_copy',
            approvalDecision: 'review',
            rationale: 'Ajustar copy antes del launch final',
          },
        ],
        requiredApprovals: ['Checklist'],
        warnings: ['Warning'],
        blockers: [],
        guardrails: ['Approval guardrail'],
      }),
    };
    const useCase = new RequestTenantEcommerceChannelReleaseLaunchPacketUseCase(
      readinessUseCase as never,
      approvalUseCase as never,
      () => new Date('2026-05-28T17:06:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      launchStatus: 'needs_operator_revision',
      launchOwner: 'shared',
      channels: [
        expect.objectContaining({
          channelKey: 'landing',
          launchDecision: 'review',
        }),
      ],
    });
  });

  it('loads one catalog listing asset', async () => {
    const cardUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:02:30.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'catalog',
        },
        commercialStatus: 'ready_for_storefront_card',
        card: {
          title: 'Catalog asset entity final',
          shortDescription: 'Catalog headline final',
          pricingPresentation: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
        },
        offerBullets: ['Offer bullets', 'Pricing snapshot'],
        storefrontSummary: 'Storefront summary',
        merchandisingHighlights: ['Pricing QA'],
        guardrails: ['Catalog guardrail'],
      }),
    };
    const launchUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:06:00.000Z'),
        productEntity,
        launchStatus: 'needs_operator_revision',
        summary: 'Launch summary',
        launchOwner: 'shared',
        channels: [
          {
            channelKey: 'catalog',
            launchDecision: 'review',
            launchStep: 'Revisar catalog antes de confirmar salida',
            fallbackStep: 'Mantener catalog en review',
          },
        ],
        launchChecklist: ['Checklist'],
        warnings: ['Warning'],
        blockers: [],
        guardrails: ['Launch guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceCatalogListingAssetUseCase(
      cardUseCase as never,
      launchUseCase as never,
      () => new Date('2026-05-28T17:06:10.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      listingStatus: 'needs_operator_revision',
      card: {
        title: 'Catalog asset entity final',
      },
      launchOwner: 'shared',
    });
  });

  it('loads one storefront release candidate brief', async () => {
    const landingArtifactUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:08:20.000Z'),
        productEntity,
        assetEntity: {
          title: 'Landing asset entity final',
        },
        artifactStatus: 'needs_operator_revision',
        summary: {
          headline: 'Landing summary',
          detail: 'Landing detail',
        },
        hero: {
          headline: 'Headline final',
          subheadline: 'Landing subheadline',
          primaryCta: 'Activar producto base',
        },
        proofStrip: ['Proof 1'],
        offerStack: [{ title: 'Offer block 1', detail: 'Hero final' }],
        ctaBand: {
          primaryCta: 'Activar producto base',
          supportLabel: 'Support label',
        },
        faqSeed: ['FAQ 1'],
        finalChecklist: ['Review checklist'],
        blockers: [],
        guardrails: ['Landing guardrail'],
      }),
    };
    const catalogListingUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:06:30.000Z'),
        productEntity,
        assetEntity: {
          title: 'Catalog asset entity final',
        },
        listingStatus: 'needs_operator_revision',
        card: {
          title: 'Catalog asset entity final',
          shortDescription: 'Catalog headline final',
          pricingPresentation: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
        },
        offerBullets: ['Offer bullets'],
        storefrontSummary: 'Storefront summary',
        launchOwner: 'shared',
        placementNotes: ['Placement note'],
        finalChecklist: ['Catalog checklist'],
        blockers: [],
        guardrails: ['Catalog guardrail'],
      }),
    };
    const releaseWorkbenchUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:04:00.000Z'),
        productEntity,
        summary: {
          totalCandidates: 2,
          readyCount: 0,
          needsPublishCopyCount: 2,
          blockedCount: 0,
          headline: 'Workbench headline',
          detail: 'Workbench detail',
        },
        channels: [
          {
            channelKey: 'landing',
            status: 'needs_publish_copy',
            handoffOwner: 'shared',
            title: 'Landing asset entity final',
            nextMilestone: 'Landing QA',
            blockedBy: [],
          },
          {
            channelKey: 'catalog',
            status: 'candidate_ready',
            handoffOwner: 'shared',
            title: 'Catalog asset entity final',
            nextMilestone: 'Catalog QA',
            blockedBy: [],
          },
          {
            channelKey: 'whatsapp',
            status: 'missing',
            handoffOwner: 'growth',
            title: 'Whatsapp asset entity final',
            nextMilestone: 'Growth handoff',
            blockedBy: [],
          },
        ],
        qaChecklist: ['Workbench checklist'],
        finalArtifacts: ['Landing packet'],
        guardrails: ['Workbench guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceStorefrontReleaseCandidateBriefUseCase(
      landingArtifactUseCase as never,
      catalogListingUseCase as never,
      releaseWorkbenchUseCase as never,
      () => new Date('2026-05-28T17:09:10.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      briefStatus: 'needs_operator_revision',
      landingArtifact: {
        title: 'Landing asset entity final',
      },
      catalogListing: {
        title: 'Catalog asset entity final',
      },
      releaseSignals: expect.arrayContaining([
        expect.objectContaining({
          channelKey: 'landing',
          status: 'warning',
        }),
      ]),
    });
  });

  it('loads one storefront release control workspace', async () => {
    const briefUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:09:10.000Z'),
        productEntity,
        briefStatus: 'ready_for_storefront_release_candidate',
        summary: {
          headline: 'Brief headline',
          detail: 'Brief detail',
        },
        landingArtifact: {
          title: 'Landing asset entity final',
          artifactStatus: 'ready_for_release_candidate',
          primaryCta: 'Activar producto base',
        },
        catalogListing: {
          title: 'Catalog asset entity final',
          listingStatus: 'ready_for_storefront_listing',
          pricingPresentation: 'Operator confirmed band',
        },
        releaseSignals: [],
        finalChecklist: ['Brief checklist'],
        blockers: [],
        guardrails: ['Brief guardrail'],
      }),
    };
    const publishReviewUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:08:00.000Z'),
        productEntity,
        reviewStatus: 'needs_operator_revision',
        summary: {
          headline: 'Review headline',
          detail: 'Review detail',
        },
        previewSnapshot: {
          previewStatus: 'needs_publish_copy',
        },
        approvalSnapshot: {
          approvalStatus: 'needs_channel_completion',
          approvalOwner: 'shared',
          channelDecisions: [],
        },
        reviewChecklist: ['Review checklist'],
        blockers: [],
        guardrails: ['Review guardrail'],
      }),
    };
    const launchPacketUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:06:00.000Z'),
        productEntity,
        launchStatus: 'needs_operator_revision',
        summary: 'Launch summary',
        launchOwner: 'shared',
        channels: [
          {
            channelKey: 'landing',
            launchDecision: 'review',
            launchStep: 'Revisar landing final',
            fallbackStep: 'Mantener controlado',
          },
        ],
        launchChecklist: ['Launch checklist'],
        warnings: [],
        blockers: [],
        guardrails: ['Launch guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceStorefrontReleaseControlWorkspaceUseCase(
      briefUseCase as never,
      publishReviewUseCase as never,
      launchPacketUseCase as never,
      () => new Date('2026-05-28T17:10:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      controlStatus: 'needs_operator_revision',
      briefSnapshot: {
        landingTitle: 'Landing asset entity final',
        catalogTitle: 'Catalog asset entity final',
      },
      releaseControl: {
        reviewStatus: 'needs_operator_revision',
        approvalOwner: 'shared',
      },
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

  it('loads one whatsapp growth activation workspace', async () => {
    const handoffUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:07:30.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'whatsapp',
        },
        handoffStatus: 'ready_for_growth_workbench',
        targetWorkspace: {
          productKey: 'growth',
          channel: 'whatsapp',
          handoffMode: 'operator_assist',
        },
        payload: {
          opener: 'Mensaje de apertura final',
          qualification: 'Follow-up 1: Follow-up angle',
          objectionHandling: ['Recovery: Recovery branch'],
          closingCta: 'Activar producto base',
          fallbackEscalation: 'Escalar si se enfria la conversacion',
        },
        sequencingNotes: ['Growth note'],
        bridgeArtifacts: ['Artifact 1'],
        readinessChecks: ['Sequence QA'],
        guardrails: ['Growth guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase(
      handoffUseCase as never,
      () => new Date('2026-05-28T17:08:30.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      activationStatus: 'ready_for_growth_activation',
      targetWorkspace: {
        productKey: 'growth',
        channel: 'whatsapp',
      },
      sequencePayload: {
        opener: 'Mensaje de apertura final',
        closingCta: 'Activar producto base',
      },
    });
  });

  it('requests one whatsapp growth activation packet', async () => {
    const activationWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:08:30.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'whatsapp',
        },
        activationStatus: 'ready_for_growth_activation',
        targetWorkspace: {
          productKey: 'growth',
          channel: 'whatsapp',
          activationMode: 'operator_assist',
        },
        activationSummary: 'Activation summary',
        sequencePayload: {
          opener: 'Mensaje de apertura final',
          qualification: 'Follow-up 1: Follow-up angle',
          objectionHandling: ['Recovery: Recovery branch'],
          closingCta: 'Activar producto base',
          fallbackEscalation: 'Escalar si se enfria la conversacion',
        },
        activationChecklist: ['Sequence QA'],
        bridgeArtifacts: ['Artifact 1'],
        handoffNotes: ['Growth note'],
        guardrails: ['Growth guardrail'],
      }),
    };
    const useCase = new RequestTenantEcommerceWhatsappGrowthActivationPacketUseCase(
      activationWorkspaceUseCase as never,
      () => new Date('2026-05-28T17:08:45.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      packetStatus: 'ready_for_growth_operator_activation',
      activationTarget: {
        productKey: 'growth',
        channel: 'whatsapp',
      },
      messagePack: {
        opener: 'Mensaje de apertura final',
        closingCta: 'Activar producto base',
      },
    });
  });

  it('requests one whatsapp growth execution bridge', async () => {
    const handoffUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:07:30.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'whatsapp',
        },
        handoffStatus: 'ready_for_growth_workbench',
        targetWorkspace: {
          productKey: 'growth',
          channel: 'whatsapp',
          handoffMode: 'operator_assist',
        },
        payload: {
          opener: 'Mensaje de apertura final',
          qualification: 'Follow-up 1: Follow-up angle',
          objectionHandling: ['Recovery: Recovery branch'],
          closingCta: 'Activar producto base',
          fallbackEscalation: 'Escalar si se enfria la conversacion',
        },
        sequencingNotes: ['Growth note'],
        bridgeArtifacts: ['Artifact 1'],
        readinessChecks: ['Sequence QA'],
        guardrails: ['Growth guardrail'],
      }),
    };
    const activationPacketUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:08:45.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'whatsapp',
        },
        packetStatus: 'ready_for_growth_operator_activation',
        activationTarget: {
          productKey: 'growth',
          channel: 'whatsapp',
          activationMode: 'operator_assist',
        },
        activationSummary: 'Activation summary',
        messagePack: {
          opener: 'Mensaje de apertura final',
          qualification: 'Follow-up 1: Follow-up angle',
          objectionHandling: ['Recovery: Recovery branch'],
          closingCta: 'Activar producto base',
          fallbackEscalation: 'Escalar si se enfria la conversacion',
        },
        activationChecklist: ['Sequence QA'],
        bridgeArtifacts: ['Artifact 1'],
        operatorSteps: ['Growth revisa tono final'],
        guardrails: ['Activation guardrail'],
      }),
    };
    const useCase = new RequestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase(
      handoffUseCase as never,
      activationPacketUseCase as never,
      () => new Date('2026-05-28T17:09:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      bridgeStatus: 'ready_for_growth_execution',
      targetWorkspace: {
        productKey: 'growth',
        channel: 'whatsapp',
      },
      executionPayload: {
        opener: 'Mensaje de apertura final',
      },
    });
  });

  it('requests one catalog storefront placement packet', async () => {
    const listingUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:06:30.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'catalog',
        },
        listingStatus: 'needs_operator_revision',
        card: {
          title: 'Catalog asset entity final',
          shortDescription: 'Catalog headline final',
          pricingPresentation: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
        },
        offerBullets: ['Offer bullets'],
        storefrontSummary: 'Storefront summary',
        launchOwner: 'shared',
        placementNotes: ['Placement note'],
        finalChecklist: ['Catalog checklist'],
        blockers: [],
        guardrails: ['Catalog guardrail'],
      }),
    };
    const previewUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:08:00.000Z'),
        productEntity,
        previewStatus: 'needs_publish_copy',
        summary: { headline: 'Preview headline', detail: 'Preview detail' },
        landingPreview: {
          headline: 'Headline final',
          subheadline: 'Landing subheadline',
          primaryCta: 'Activar producto base',
          proofStrip: ['Proof 1'],
        },
        catalogPreview: {
          title: 'Catalog asset entity final',
          shortDescription: 'Catalog headline final',
          pricingPresentation: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          offerBullets: ['Offer bullets'],
        },
        releaseSignals: [],
        previewChecklist: ['Preview checklist'],
        guardrails: ['Preview guardrail'],
      }),
    };
    const approvalUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:05:45.000Z'),
        productEntity,
        approvalStatus: 'needs_channel_completion',
        summary: 'Approval summary',
        approvalOwner: 'shared',
        channels: [
          {
            channelKey: 'catalog',
            readiness: 'needs_publish_copy',
            approvalDecision: 'review',
            rationale: 'Revisar placement final',
          },
        ],
        requiredApprovals: ['Checklist'],
        warnings: ['Warning'],
        blockers: [],
        guardrails: ['Approval guardrail'],
      }),
    };
    const useCase =
      new RequestTenantEcommerceCatalogStorefrontPlacementPacketUseCase(
        listingUseCase as never,
        previewUseCase as never,
        approvalUseCase as never,
        () => new Date('2026-05-28T17:09:20.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      placementStatus: 'needs_operator_revision',
      storefrontContext: {
        previewStatus: 'needs_publish_copy',
        approvalStatus: 'needs_channel_completion',
      },
      card: {
        title: 'Catalog asset entity final',
      },
    });
  });

  it('requests one catalog merchandising packet', async () => {
    const commercialCardUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:05:00.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'catalog',
          title: 'Catalog asset entity final',
        },
        commercialStatus: 'ready_for_storefront_card',
        card: {
          title: 'Catalog asset entity final',
          shortDescription: 'Catalog headline final',
          pricingPresentation: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
        },
        offerBullets: ['Offer bullets'],
        storefrontSummary: 'Storefront summary',
        merchandisingHighlights: ['Highlight 1'],
        guardrails: ['Commercial guardrail'],
      }),
    };
    const placementUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:09:20.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'catalog',
          title: 'Catalog asset entity final',
        },
        placementStatus: 'ready_for_storefront_placement',
        card: {
          title: 'Catalog asset entity final',
          shortDescription: 'Catalog headline final',
          pricingPresentation: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
        },
        placementSummary: 'Placement summary',
        storefrontContext: {
          previewStatus: 'ready_for_preview_review',
          approvalStatus: 'ready_for_operator_approval',
        },
        placementNotes: ['Placement note'],
        placementChecklist: ['Placement checklist'],
        blockers: [],
        guardrails: ['Placement guardrail'],
      }),
    };
    const launchUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:06:00.000Z'),
        productEntity,
        launchStatus: 'needs_operator_revision',
        summary: 'Launch summary',
        launchOwner: 'shared',
        channels: [
          {
            channelKey: 'catalog',
            launchDecision: 'review',
            launchStep: 'Revisar catalog placement final',
            fallbackStep: 'Mantener catalog en storefront controlado',
          },
        ],
        launchChecklist: ['Launch checklist'],
        warnings: [],
        blockers: [],
        guardrails: ['Launch guardrail'],
      }),
    };
    const useCase = new RequestTenantEcommerceCatalogMerchandisingPacketUseCase(
      commercialCardUseCase as never,
      placementUseCase as never,
      launchUseCase as never,
      () => new Date('2026-05-28T17:11:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      merchandisingStatus: 'needs_operator_revision',
      placementContext: {
        commercialStatus: 'ready_for_storefront_card',
        placementStatus: 'ready_for_storefront_placement',
        launchDecision: 'review',
      },
      card: {
        title: 'Catalog asset entity final',
      },
    });
  });

  it('requests one whatsapp growth operator launch packet', async () => {
    const executionBridgeUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:09:00.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'whatsapp',
          title: 'Whatsapp asset entity final',
        },
        bridgeStatus: 'ready_for_growth_execution',
        summary: 'Bridge summary',
        targetWorkspace: {
          productKey: 'growth',
          channel: 'whatsapp',
          activationMode: 'operator_assist',
          handoffMode: 'operator_assist',
        },
        executionPayload: {
          opener: 'Mensaje de apertura final',
          qualification: 'Follow-up 1: Follow-up angle',
          objectionHandling: ['Recovery: Recovery branch'],
          closingCta: 'Activar producto base',
          fallbackEscalation: 'Escalar si se enfria la conversacion',
        },
        operatorChecklist: ['Sequence QA'],
        bridgeArtifacts: ['Artifact 1'],
        nextSteps: ['Growth revisa tono final antes de activar.'],
        guardrails: ['Growth guardrail'],
      }),
    };
    const launchPacketUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:06:00.000Z'),
        productEntity,
        launchStatus: 'needs_operator_revision',
        summary: 'Launch summary',
        launchOwner: 'shared',
        channels: [
          {
            channelKey: 'whatsapp',
            launchDecision: 'review',
            launchStep: 'Revisar secuencia antes de activar',
            fallbackStep: 'Mantener WhatsApp en operator assist',
          },
        ],
        launchChecklist: ['Checklist'],
        warnings: ['Warning'],
        blockers: [],
        guardrails: ['Launch guardrail'],
      }),
    };
    const useCase =
      new RequestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase(
        executionBridgeUseCase as never,
        launchPacketUseCase as never,
        () => new Date('2026-05-28T17:09:30.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      launchStatus: 'needs_operator_revision',
      targetWorkspace: {
        productKey: 'growth',
        channel: 'whatsapp',
      },
      executionPayload: {
        opener: 'Mensaje de apertura final',
      },
    });
  });

  it('requests one whatsapp growth launch acknowledgement packet', async () => {
    const activationWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:08:30.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'whatsapp',
          title: 'Whatsapp asset entity final',
        },
        activationStatus: 'ready_for_growth_activation',
        targetWorkspace: {
          productKey: 'growth',
          channel: 'whatsapp',
          activationMode: 'operator_assist',
        },
        activationSummary: 'Activation summary',
        sequencePayload: {
          opener: 'Mensaje de apertura final',
          qualification: 'Follow-up 1: Follow-up angle',
          objectionHandling: ['Recovery: Recovery branch'],
          closingCta: 'Activar producto base',
          fallbackEscalation: 'Escalar si se enfria la conversacion',
        },
        activationChecklist: ['Workspace checklist'],
        bridgeArtifacts: ['Artifact 1'],
        handoffNotes: ['Growth note'],
        guardrails: ['Workspace guardrail'],
      }),
    };
    const activationPacketUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:08:45.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'whatsapp',
          title: 'Whatsapp asset entity final',
        },
        packetStatus: 'ready_for_growth_operator_activation',
        activationTarget: {
          productKey: 'growth',
          channel: 'whatsapp',
          activationMode: 'operator_assist',
        },
        activationSummary: 'Activation packet summary',
        messagePack: {
          opener: 'Mensaje de apertura final',
          qualification: 'Follow-up 1: Follow-up angle',
          objectionHandling: ['Recovery: Recovery branch'],
          closingCta: 'Activar producto base',
          fallbackEscalation: 'Escalar si se enfria la conversacion',
        },
        activationChecklist: ['Packet checklist'],
        bridgeArtifacts: ['Artifact 1'],
        operatorSteps: ['Growth revisa tono final'],
        guardrails: ['Packet guardrail'],
      }),
    };
    const operatorLaunchPacketUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:09:30.000Z'),
        productEntity,
        assetEntity: {
          channelKey: 'whatsapp',
          title: 'Whatsapp asset entity final',
        },
        launchStatus: 'needs_operator_revision',
        summary: 'Launch summary',
        targetWorkspace: {
          productKey: 'growth',
          channel: 'whatsapp',
          activationMode: 'operator_assist',
          handoffMode: 'operator_assist',
        },
        executionPayload: {
          opener: 'Mensaje de apertura final',
          qualification: 'Follow-up 1: Follow-up angle',
          objectionHandling: ['Recovery: Recovery branch'],
          closingCta: 'Activar producto base',
          fallbackEscalation: 'Escalar si se enfria la conversacion',
        },
        launchChecklist: ['Launch checklist'],
        operatorSteps: ['Operator revisa secuencia'],
        bridgeArtifacts: ['Artifact 1'],
        blockers: [],
        guardrails: ['Launch guardrail'],
      }),
    };
    const useCase =
      new RequestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase(
        activationWorkspaceUseCase as never,
        activationPacketUseCase as never,
        operatorLaunchPacketUseCase as never,
        () => new Date('2026-05-28T17:12:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      acknowledgementStatus: 'needs_operator_revision',
      activationContext: {
        workspaceStatus: 'ready_for_growth_activation',
        packetStatus: 'ready_for_growth_operator_activation',
        launchStatus: 'needs_operator_revision',
      },
      launchPayload: {
        opener: 'Mensaje de apertura final',
        closingCta: 'Activar producto base',
      },
    });
  });

  it('loads one checkout order intake workspace', async () => {
    const storeProfileUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T16:20:00.000Z'),
        summary: {
          tone: 'healthy',
          profileReadiness: 'draft_ready',
          headline: 'Store profile listo',
          detail: 'Setup usable.',
          suggestedFocus: 'Store profile',
        },
        identityDraft: {
          storeName: 'SaaS Platform Store',
          storefrontSlug: 'saas-platform-store',
          launchNarrative: 'Narrative',
          primaryChannel: 'landing',
        },
        connections: [
          {
            key: 'invoicing',
            title: 'Invoicing',
            status: 'ready',
            detail: 'Conexión fiscal lista.',
          },
        ],
        recommendedAssets: [],
        safeActions: [],
        blockedActions: [],
      }),
    };
    const landingArtifactUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:00:00.000Z'),
        productEntity,
        assetEntity: { channelKey: 'landing', title: 'Landing asset entity final' },
        artifactStatus: 'ready_for_release_candidate',
        summary: {
          headline: 'Landing lista',
          detail: 'Landing lista para release candidate.',
        },
        hero: {
          headline: 'Hero headline',
          subheadline: 'Hero subheadline',
          primaryCta: 'Activar producto base',
        },
        proofStrip: ['Proof'],
        offerStack: [{ title: 'Offer', detail: 'Offer detail' }],
        ctaBand: {
          primaryCta: 'Activar producto base',
          supportLabel: 'Soporte',
        },
        faqSeed: ['FAQ'],
        finalChecklist: ['Checklist'],
        blockers: [],
        guardrails: ['Landing guardrail'],
      }),
    };
    const commercialCardUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:01:00.000Z'),
        productEntity,
        assetEntity: { channelKey: 'catalog', title: 'Catalog asset entity final' },
        commercialStatus: 'ready_for_storefront_card',
        card: {
          title: 'Catalog asset entity final',
          shortDescription: 'Catalog headline final',
          pricingPresentation: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
        },
        offerBullets: ['Bullet 1'],
        storefrontSummary: 'Catalog storefront summary',
        merchandisingHighlights: ['Highlight 1'],
        guardrails: ['Catalog guardrail'],
      }),
    };
    const whatsappAckUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:12:00.000Z'),
        productEntity,
        assetEntity: { channelKey: 'whatsapp', title: 'Whatsapp asset entity final' },
        acknowledgementStatus: 'ready_for_growth_launch_acknowledgement',
        summary: 'WhatsApp listo para acknowledgement final.',
        targetWorkspace: {
          productKey: 'growth',
          channel: 'whatsapp',
          activationMode: 'operator_assist',
          handoffMode: 'operator_assist',
        },
        activationContext: {
          workspaceStatus: 'ready_for_growth_activation',
          packetStatus: 'ready_for_growth_operator_activation',
          launchStatus: 'ready_for_growth_operator_launch',
        },
        launchPayload: {
          opener: 'Mensaje de apertura final',
          qualification: 'Qualify',
          objectionHandling: ['Obj'],
          closingCta: 'Activar producto base',
          fallbackEscalation: 'Escalar',
        },
        acknowledgementChecklist: ['Ack checklist'],
        operatorActions: ['Operator action'],
        bridgeArtifacts: ['Artifact'],
        blockers: [],
        guardrails: ['Ack guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase(
      storeProfileUseCase as never,
      landingArtifactUseCase as never,
      commercialCardUseCase as never,
      whatsappAckUseCase as never,
      () => new Date('2026-05-28T17:20:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      checkoutStatus: 'ready_for_order_intake',
      checkoutDraft: {
        offerTitle: 'Catalog asset entity final',
        primaryCta: 'Activar producto base',
        closingChannel: 'landing',
      },
      invoicingConnection: {
        status: 'ready',
      },
    });
  });

  it('requests one order invoicing bridge', async () => {
    const checkoutWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:20:00.000Z'),
        productEntity,
        checkoutStatus: 'ready_for_order_intake',
        summary: 'Checkout listo para intake.',
        checkoutDraft: {
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          customerPrompt: 'Pedir datos mínimos.',
          closingChannel: 'landing',
        },
        customerFields: ['full_name'],
        channelSignals: [],
        invoicingConnection: {
          status: 'ready',
          detail: 'Conexión fiscal lista.',
          nextStep: 'Handoff fiscal',
        },
        orderChecklist: ['Checklist'],
        blockedBy: [],
        guardrails: ['Checkout guardrail'],
      }),
    };
    const storeProfileUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T16:20:00.000Z'),
        summary: {
          tone: 'healthy',
          profileReadiness: 'draft_ready',
          headline: 'Store profile listo',
          detail: 'Setup usable.',
          suggestedFocus: 'Store profile',
        },
        identityDraft: {
          storeName: 'SaaS Platform Store',
          storefrontSlug: 'saas-platform-store',
          launchNarrative: 'Narrative',
          primaryChannel: 'landing',
        },
        connections: [
          {
            key: 'invoicing',
            title: 'Invoicing',
            status: 'ready',
            detail: 'Conexión fiscal lista.',
          },
        ],
        recommendedAssets: [],
        safeActions: [],
        blockedActions: [],
      }),
    };
    const useCase = new RequestTenantEcommerceOrderInvoicingBridgeUseCase(
      checkoutWorkspaceUseCase as never,
      storeProfileUseCase as never,
      () => new Date('2026-05-28T17:22:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      bridgeStatus: 'ready_for_invoice_handoff',
      targetWorkspace: {
        productKey: 'invoicing',
      },
      invoiceReadiness: {
        connectionStatus: 'ready',
        buyerProfileStatus: 'ready',
      },
    });
  });

  it('loads one storefront go-live manifest', async () => {
    const releaseControlUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:10:00.000Z'),
        productEntity,
        controlStatus: 'ready_for_release_control',
        summary: {
          headline: 'Control listo',
          detail: 'Release control listo.',
        },
        briefSnapshot: {
          briefStatus: 'ready_for_storefront_release_candidate',
          landingTitle: 'Landing',
          catalogTitle: 'Catalog',
        },
        releaseControl: {
          reviewStatus: 'ready_for_publish_review',
          approvalOwner: 'shared',
          launchOwner: 'shared',
        },
        channelDecisions: [],
        controlChecklist: ['Control checklist'],
        blockers: [],
        guardrails: ['Control guardrail'],
      }),
    };
    const merchandisingUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:11:00.000Z'),
        productEntity,
        assetEntity: { channelKey: 'catalog', title: 'Catalog asset entity final' },
        merchandisingStatus: 'ready_for_merchandising_review',
        card: {
          title: 'Catalog asset entity final',
          shortDescription: 'Catalog headline final',
          pricingPresentation: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
        },
        merchandisingSummary: 'Catalog listo.',
        placementContext: {
          commercialStatus: 'ready_for_storefront_card',
          placementStatus: 'ready_for_storefront_placement',
          launchDecision: 'launch',
        },
        merchandisingNotes: ['Note'],
        merchandisingChecklist: ['Checklist'],
        blockers: [],
        guardrails: ['Catalog guardrail'],
      }),
    };
    const whatsappAckUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:12:00.000Z'),
        productEntity,
        assetEntity: { channelKey: 'whatsapp', title: 'Whatsapp asset entity final' },
        acknowledgementStatus: 'ready_for_growth_launch_acknowledgement',
        summary: 'WhatsApp listo.',
        targetWorkspace: {
          productKey: 'growth',
          channel: 'whatsapp',
          activationMode: 'operator_assist',
          handoffMode: 'operator_assist',
        },
        activationContext: {
          workspaceStatus: 'ready_for_growth_activation',
          packetStatus: 'ready_for_growth_operator_activation',
          launchStatus: 'ready_for_growth_operator_launch',
        },
        launchPayload: {
          opener: 'Mensaje de apertura final',
          qualification: 'Qualify',
          objectionHandling: ['Obj'],
          closingCta: 'Activar producto base',
          fallbackEscalation: 'Escalar',
        },
        acknowledgementChecklist: ['Ack checklist'],
        operatorActions: ['Action'],
        bridgeArtifacts: ['Artifact'],
        blockers: [],
        guardrails: ['Ack guardrail'],
      }),
    };
    const checkoutWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:20:00.000Z'),
        productEntity,
        checkoutStatus: 'ready_for_order_intake',
        summary: 'Checkout listo.',
        checkoutDraft: {
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          customerPrompt: 'Pedir datos mínimos.',
          closingChannel: 'landing',
        },
        customerFields: ['full_name'],
        channelSignals: [],
        invoicingConnection: {
          status: 'ready',
          detail: 'Conexión fiscal lista.',
          nextStep: 'Handoff fiscal',
        },
        orderChecklist: ['Order checklist'],
        blockedBy: [],
        guardrails: ['Checkout guardrail'],
      }),
    };
    const invoicingBridgeUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:22:00.000Z'),
        productEntity,
        bridgeStatus: 'ready_for_invoice_handoff',
        summary: 'Bridge listo.',
        targetWorkspace: {
          productKey: 'invoicing',
          stage: 'electronic_invoicing_ec_mvp',
          handoffMode: 'operator_assist',
        },
        orderDraft: {
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          customerPrompt: 'Pedir datos mínimos.',
          closingChannel: 'landing',
        },
        invoiceReadiness: {
          connectionStatus: 'ready',
          buyerProfileStatus: 'ready',
          suggestedDocument: 'invoice',
        },
        fiscalRequirements: ['buyer_legal_name'],
        handoffArtifacts: ['Order intake snapshot'],
        blockedBy: [],
        guardrails: ['Bridge guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceStorefrontGoLiveManifestUseCase(
      releaseControlUseCase as never,
      merchandisingUseCase as never,
      whatsappAckUseCase as never,
      checkoutWorkspaceUseCase as never,
      invoicingBridgeUseCase as never,
      () => new Date('2026-05-28T17:24:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      manifestStatus: 'ready_for_controlled_go_live',
      orderReadiness: {
        checkoutStatus: 'ready_for_order_intake',
        invoicingStatus: 'ready_for_invoice_handoff',
      },
      operatorHandoff: {
        goLiveMode: 'controlled_go_live',
      },
    });
  });

  it('loads one live storefront session workspace', async () => {
    const manifestUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:24:00.000Z'),
        productEntity,
        manifestStatus: 'ready_for_controlled_go_live',
        summary: {
          headline: 'Manifest listo',
          detail: 'Go-live controlado.',
        },
        channelSnapshot: {
          landingStatus: 'ready_for_release_control',
          catalogStatus: 'ready_for_merchandising_review',
          whatsappStatus: 'ready_for_growth_launch_acknowledgement',
        },
        orderReadiness: {
          checkoutStatus: 'ready_for_order_intake',
          invoicingStatus: 'ready_for_invoice_handoff',
        },
        goLiveDependencies: [],
        finalChecklist: ['Manifest checklist'],
        operatorHandoff: {
          owner: 'shared',
          goLiveMode: 'controlled_go_live',
          nextWindow: 'Window',
        },
        warnings: [],
        blockers: [],
        guardrails: ['Manifest guardrail'],
      }),
    };
    const landingArtifactUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:08:00.000Z'),
        productEntity,
        artifactStatus: 'ready_for_release_candidate',
        summary: {
          headline: 'Landing lista',
          detail: 'Landing final.',
        },
        hero: {
          headline: 'Headline final',
          subheadline: 'Hero final',
          primaryCta: 'Activar producto base',
        },
        proofBlocks: [],
        offerSections: [],
        ctaBand: {
          primaryCta: 'Activar producto base',
          supportLabel: 'Support',
        },
        finalChecklist: ['Hero QA'],
        blockedBy: [],
        guardrails: ['Landing guardrail'],
      }),
    };
    const catalogListingUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:09:20.000Z'),
        productEntity,
        assetEntity: { channelKey: 'catalog', title: 'Catalog asset entity final' },
        listingStatus: 'ready_for_storefront_listing',
        card: {
          title: 'Catalog asset entity final',
          shortDescription: 'Catalog headline final',
          pricingPresentation: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
        },
        offerBullets: ['Offer bullet'],
        storefrontSummary: 'Catalog listo para storefront.',
        launchOwner: 'shared',
        placementNotes: ['Placement note'],
        finalChecklist: ['Catalog QA'],
        blockers: [],
        guardrails: ['Catalog guardrail'],
      }),
    };
    const whatsappLaunchUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:09:30.000Z'),
        productEntity,
        assetEntity: { channelKey: 'whatsapp', title: 'Whatsapp asset entity final' },
        launchStatus: 'ready_for_growth_operator_launch',
        summary: 'WhatsApp launch listo.',
        targetWorkspace: {
          productKey: 'growth',
          channel: 'whatsapp',
          activationMode: 'operator_assist',
          handoffMode: 'operator_assist',
        },
        executionPayload: {
          opener: 'Mensaje de apertura final',
          qualification: 'Qualify',
          objectionHandling: ['Obj'],
          closingCta: 'Activar producto base',
          fallbackEscalation: 'Escalar',
        },
        launchChecklist: ['Launch checklist'],
        operatorSteps: ['Operator step'],
        bridgeArtifacts: ['Artifact'],
        blockers: [],
        guardrails: ['WhatsApp guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceLiveStorefrontSessionWorkspaceUseCase(
      manifestUseCase as never,
      landingArtifactUseCase as never,
      catalogListingUseCase as never,
      whatsappLaunchUseCase as never,
      () => new Date('2026-05-28T17:26:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      sessionStatus: 'ready',
      storefrontSnapshot: {
        landingHeadline: 'Headline final',
        catalogTitle: 'Catalog asset entity final',
        closeChannel: 'whatsapp',
      },
      releaseGate: {
        goLiveStatus: 'ready_for_controlled_go_live',
      },
    });
  });

  it('requests one checkout customer capture packet', async () => {
    const checkoutWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:20:00.000Z'),
        productEntity,
        checkoutStatus: 'ready_for_order_intake',
        summary: 'Checkout listo.',
        checkoutDraft: {
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          customerPrompt: 'Pedir datos mínimos.',
          closingChannel: 'landing',
        },
        customerFields: ['full_name'],
        channelSignals: [],
        invoicingConnection: {
          status: 'ready',
          detail: 'Conexión fiscal lista.',
          nextStep: 'Handoff fiscal',
        },
        orderChecklist: ['Checklist'],
        blockedBy: [],
        guardrails: ['Checkout guardrail'],
      }),
    };
    const liveSessionUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:26:00.000Z'),
        productEntity,
        sessionStatus: 'preview',
        summary: {
          headline: 'Session preview',
          detail: 'Preview ok.',
        },
        storefrontSnapshot: {
          landingHeadline: 'Headline final',
          landingSubheadline: 'Hero final',
          primaryCta: 'Activar producto base',
          catalogTitle: 'Catalog asset entity final',
          pricingPresentation: 'Operator confirmed band',
          closeChannel: 'whatsapp',
        },
        releaseGate: {
          goLiveStatus: 'needs_checkout_foundation',
          checkoutStatus: 'ready_for_order_intake',
          invoicingStatus: 'needs_customer_fiscal_data',
        },
        channelSessions: [],
        sessionChecklist: ['Session checklist'],
        blockedBy: [],
        guardrails: ['Session guardrail'],
      }),
    };
    const invoicingBridgeUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:22:00.000Z'),
        productEntity,
        bridgeStatus: 'needs_customer_fiscal_data',
        summary: 'Bridge parcial.',
        targetWorkspace: {
          productKey: 'invoicing',
          stage: 'electronic_invoicing_ec_mvp',
          handoffMode: 'operator_assist',
        },
        orderDraft: {
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          customerPrompt: 'Pedir datos mínimos.',
          closingChannel: 'landing',
        },
        invoiceReadiness: {
          connectionStatus: 'ready',
          buyerProfileStatus: 'needs_customer_fiscal_data',
          suggestedDocument: 'invoice',
        },
        fiscalRequirements: ['buyer_legal_name'],
        handoffArtifacts: ['Artifact'],
        blockedBy: [],
        guardrails: ['Bridge guardrail'],
      }),
    };
    const useCase =
      new RequestTenantEcommerceCheckoutCustomerCapturePacketUseCase(
        checkoutWorkspaceUseCase as never,
        liveSessionUseCase as never,
        invoicingBridgeUseCase as never,
        () => new Date('2026-05-28T17:28:00.000Z'),
      );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      captureStatus: 'ready_for_order_draft',
      billingReadiness: {
        status: 'needs_customer_input',
      },
      orderDraftSeed: {
        offerTitle: 'Catalog asset entity final',
      },
    });
  });

  it('requests one order-to-invoice readiness packet', async () => {
    const capturePacketUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:28:00.000Z'),
        productEntity,
        captureStatus: 'ready_for_order_draft',
        summary: 'Capture listo.',
        orderDraftSeed: {
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          customerPrompt: 'Pedir datos mínimos.',
          closingChannel: 'landing',
        },
        captureForm: {
          requiredFields: ['full_name'],
          optionalFields: ['buyer_company'],
          validationRules: ['Rule'],
        },
        billingReadiness: {
          status: 'ready',
          hint: 'Hint',
        },
        operatorPrompts: ['Prompt'],
        blockedBy: [],
        guardrails: ['Capture guardrail'],
      }),
    };
    const invoicingBridgeUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:22:00.000Z'),
        productEntity,
        bridgeStatus: 'ready_for_invoice_handoff',
        summary: 'Bridge listo.',
        targetWorkspace: {
          productKey: 'invoicing',
          stage: 'electronic_invoicing_ec_mvp',
          handoffMode: 'operator_assist',
        },
        orderDraft: {
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          customerPrompt: 'Pedir datos mínimos.',
          closingChannel: 'landing',
        },
        invoiceReadiness: {
          connectionStatus: 'ready',
          buyerProfileStatus: 'ready',
          suggestedDocument: 'invoice',
        },
        fiscalRequirements: ['buyer_legal_name'],
        handoffArtifacts: ['Artifact'],
        blockedBy: [],
        guardrails: ['Bridge guardrail'],
      }),
    };
    const useCase = new RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase(
      capturePacketUseCase as never,
      invoicingBridgeUseCase as never,
      () => new Date('2026-05-28T17:30:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      readinessStatus: 'ready_to_invoice',
      targetWorkspace: {
        productKey: 'invoicing',
      },
      readinessSnapshot: {
        captureStatus: 'ready_for_order_draft',
        bridgeStatus: 'ready_for_invoice_handoff',
      },
    });
  });

  it('saves one ecommerce order draft', async () => {
    const tenantUseCase = {
      execute: jest.fn().mockResolvedValue({ id: 'tenant_001' }),
    };
    const capturePacketUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:28:00.000Z'),
        productEntity,
        captureStatus: 'ready_for_order_draft',
        summary: 'Capture listo.',
        orderDraftSeed: {
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          customerPrompt: 'Pedir datos mínimos.',
          closingChannel: 'landing',
        },
        captureForm: {
          requiredFields: ['full_name'],
          optionalFields: ['buyer_company'],
          validationRules: ['Rule'],
        },
        billingReadiness: {
          status: 'needs_customer_input',
          hint: 'Hint',
        },
        operatorPrompts: ['Prompt'],
        blockedBy: [],
        guardrails: ['Capture guardrail'],
      }),
    };
    const invoiceReadinessUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:30:00.000Z'),
        productEntity,
        readinessStatus: 'needs_data',
        summary: 'Readiness parcial.',
        targetWorkspace: {
          productKey: 'invoicing',
          stage: 'electronic_invoicing_ec_mvp',
          handoffMode: 'operator_assist',
        },
        readinessSnapshot: {
          captureStatus: 'ready_for_order_draft',
          bridgeStatus: 'needs_customer_fiscal_data',
          buyerProfileStatus: 'needs_customer_fiscal_data',
        },
        fiscalRequirements: ['buyer_legal_name'],
        missingFields: ['buyer_legal_name'],
        handoffArtifacts: ['Artifact'],
        operatorChecklist: ['Checklist'],
        blockedBy: [],
        guardrails: ['Readiness guardrail'],
      }),
    };
    const repository = {
      findByTenantSlugAndProductEntityId: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockImplementation(async (command) => ({
        ...command,
        customerProfile: { ...command.customerProfile },
        requiredFields: [...command.requiredFields],
        optionalFields: [...command.optionalFields],
        operatorPrompts: [...command.operatorPrompts],
        missingFields: [...command.missingFields],
        blockedBy: [...command.blockedBy],
        guardrails: [...command.guardrails],
        createdAt: new Date('2026-05-28T17:31:00.000Z'),
        updatedAt: new Date('2026-05-28T17:31:00.000Z'),
      })),
    };
    const useCase = new SaveTenantEcommerceOrderDraftUseCase(
      tenantUseCase as never,
      capturePacketUseCase as never,
      invoiceReadinessUseCase as never,
      repository as never,
      () => 'order_draft_001',
      () => new Date('2026-05-28T17:31:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      orderDraft: {
        id: 'order_draft_001',
        status: 'draft',
        offerTitle: 'Catalog asset entity final',
      },
    });
  });

  it('lists one ecommerce order draft registry', async () => {
    const repository = {
      listByTenantSlugAndProductEntityId: jest.fn().mockResolvedValue([
        {
          id: 'order_draft_001',
          tenantId: 'tenant_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          status: 'draft',
          orderLabel: 'Order draft',
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          closingChannel: 'landing',
          captureStatus: 'ready_for_order_draft',
          invoicingReadinessStatus: 'needs_data',
          customerProfile: {
            fullName: null,
            email: null,
            whatsappPhone: null,
            billingIntent: null,
            buyerCompany: null,
            buyerTaxIdOrDocument: null,
          },
          requiredFields: ['full_name'],
          optionalFields: ['buyer_company'],
          operatorPrompts: ['Prompt'],
          missingFields: ['buyer_legal_name'],
          blockedBy: [],
          guardrails: ['Guardrail'],
          createdAt: new Date('2026-05-28T17:31:00.000Z'),
          updatedAt: new Date('2026-05-28T17:31:00.000Z'),
        },
      ]),
    };
    const productEntityDetailUseCase = {
      execute: jest.fn().mockResolvedValue({ productEntity }),
    };
    const useCase = new ListTenantEcommerceOrderDraftsUseCase(
      repository as never,
      productEntityDetailUseCase as never,
      () => new Date('2026-05-28T17:32:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      summary: {
        totalOrderDrafts: 1,
        draftCount: 1,
      },
    });
  });

  it('requests one checkout closeout packet', async () => {
    const orderDraftDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:32:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          tenantId: 'tenant_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          status: 'ready_for_review',
          orderLabel: 'Order draft',
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          closingChannel: 'landing',
          captureStatus: 'ready_for_order_draft',
          invoicingReadinessStatus: 'ready_to_invoice',
          customerProfile: {
            fullName: null,
            email: null,
            whatsappPhone: null,
            billingIntent: null,
            buyerCompany: null,
            buyerTaxIdOrDocument: null,
          },
          requiredFields: ['full_name'],
          optionalFields: ['buyer_company'],
          operatorPrompts: ['Prompt'],
          missingFields: [],
          blockedBy: [],
          guardrails: ['Guardrail'],
          createdAt: new Date('2026-05-28T17:31:00.000Z'),
          updatedAt: new Date('2026-05-28T17:31:00.000Z'),
        },
        summary: 'Detail listo.',
        nextActions: ['Action'],
        blockedBy: [],
        guardrails: ['Detail guardrail'],
      }),
    };
    const invoiceReadinessUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:30:00.000Z'),
        productEntity,
        readinessStatus: 'ready_to_invoice',
        summary: 'Readiness listo.',
        targetWorkspace: {
          productKey: 'invoicing',
          stage: 'electronic_invoicing_ec_mvp',
          handoffMode: 'operator_assist',
        },
        readinessSnapshot: {
          captureStatus: 'ready_for_order_draft',
          bridgeStatus: 'ready_for_invoice_handoff',
          buyerProfileStatus: 'ready',
        },
        fiscalRequirements: ['buyer_legal_name'],
        missingFields: [],
        handoffArtifacts: ['Artifact'],
        operatorChecklist: ['Checklist'],
        blockedBy: [],
        guardrails: ['Readiness guardrail'],
      }),
    };
    const useCase = new RequestTenantEcommerceCheckoutCloseoutPacketUseCase(
      orderDraftDetailUseCase as never,
      invoiceReadinessUseCase as never,
      () => new Date('2026-05-28T17:33:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      closeoutStatus: 'ready_for_operator_closeout',
      commercialSnapshot: {
        offerTitle: 'Catalog asset entity final',
      },
    });
  });

  it('requests one order-to-growth conversation bridge', async () => {
    const orderDraftDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:32:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          tenantId: 'tenant_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          status: 'ready_for_review',
          orderLabel: 'Order draft',
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          closingChannel: 'whatsapp',
          captureStatus: 'ready_for_order_draft',
          invoicingReadinessStatus: 'ready_to_invoice',
          customerProfile: {
            fullName: 'Buyer One',
            email: null,
            whatsappPhone: null,
            billingIntent: null,
            buyerCompany: null,
            buyerTaxIdOrDocument: null,
          },
          requiredFields: ['full_name'],
          optionalFields: ['buyer_company'],
          operatorPrompts: ['Prompt'],
          missingFields: [],
          blockedBy: [],
          guardrails: ['Guardrail'],
          createdAt: new Date('2026-05-28T17:31:00.000Z'),
          updatedAt: new Date('2026-05-28T17:31:00.000Z'),
        },
        summary: 'Detail listo.',
        nextActions: ['Action'],
        blockedBy: [],
        guardrails: ['Detail guardrail'],
      }),
    };
    const whatsappBridgeUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:34:00.000Z'),
        productEntity,
        assetEntity: {
          tenantSlug: 'saas-platform',
          generatedAt: new Date('2026-05-28T17:34:00.000Z'),
          assetEntityId: 'asset_001',
          productEntityId: 'product_entity_001',
          sourceSavedChannelDraftId: 'saved_channel_draft_001',
          channelKey: 'whatsapp',
          promotedAt: new Date('2026-05-28T17:34:00.000Z'),
          status: 'draft_asset_entity',
          handoffOwner: 'growth',
          title: 'Whatsapp asset',
          headline: 'Headline',
          summary: 'Summary',
          draftBlueprint: ['Blueprint'],
          publishChecklist: ['Checklist'],
          recommendedArtifacts: ['Artifact'],
          nextMilestone: 'Milestone',
          blockedBy: [],
          guardrails: ['Guardrail'],
        },
        bridgeStatus: 'ready_for_growth_execution',
        summary: 'Bridge listo.',
        targetWorkspace: {
          productKey: 'growth',
          channel: 'whatsapp',
          activationMode: 'operator_assist',
          handoffMode: 'operator_assist',
        },
        executionPayload: {
          opener: 'Hola Buyer One',
          qualification: 'Qualify',
          objectionHandling: ['Obj'],
          closingCta: 'Activar producto base',
          fallbackEscalation: 'Escalar',
        },
        operatorChecklist: ['Checklist'],
        bridgeArtifacts: ['Artifact'],
        nextSteps: ['Step'],
        guardrails: ['Bridge guardrail'],
      }),
    };
    const useCase =
      new RequestTenantEcommerceOrderToGrowthConversationBridgeUseCase(
        orderDraftDetailUseCase as never,
        whatsappBridgeUseCase as never,
        () => new Date('2026-05-28T17:35:00.000Z'),
      );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      bridgeStatus: 'ready_for_growth_follow_up',
      conversationSeed: {
        leadLabel: 'Buyer One',
        opener: 'Hola Buyer One',
      },
    });
  });

  it('loads one ecommerce order review workspace', async () => {
    const orderDraftDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:32:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          tenantId: 'tenant_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          status: 'ready_for_review',
          orderLabel: 'Order draft',
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          closingChannel: 'whatsapp',
          captureStatus: 'ready_for_order_draft',
          invoicingReadinessStatus: 'ready_to_invoice',
          customerProfile: {
            fullName: 'Buyer One',
            email: null,
            whatsappPhone: null,
            billingIntent: null,
            buyerCompany: null,
            buyerTaxIdOrDocument: null,
          },
          requiredFields: ['full_name'],
          optionalFields: ['buyer_company'],
          operatorPrompts: ['Prompt'],
          missingFields: [],
          blockedBy: [],
          guardrails: ['Guardrail'],
          createdAt: new Date('2026-05-28T17:31:00.000Z'),
          updatedAt: new Date('2026-05-28T17:31:00.000Z'),
        },
        summary: 'Detail listo.',
        nextActions: ['Action'],
        blockedBy: [],
        guardrails: ['Detail guardrail'],
      }),
    };
    const closeoutPacketUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:33:00.000Z'),
        productEntity,
        orderDraft: { id: 'order_draft_001' },
        closeoutStatus: 'ready_for_operator_closeout',
        summary: 'Closeout listo.',
        commercialSnapshot: {
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          closingChannel: 'whatsapp',
        },
        paymentReadiness: { status: 'ready', hint: 'Hint' },
        invoicingReadiness: {
          status: 'ready_to_invoice',
          detail: 'Detail',
        },
        closeoutChecklist: ['Checklist'],
        missingFields: [],
        blockedBy: [],
        guardrails: ['Closeout guardrail'],
      }),
    };
    const growthBridgeUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:35:00.000Z'),
        productEntity,
        orderDraft: { id: 'order_draft_001' },
        bridgeStatus: 'ready_for_growth_follow_up',
        summary: 'Bridge listo.',
        targetWorkspace: {
          productKey: 'growth',
          channel: 'whatsapp',
          handoffMode: 'operator_assist',
        },
        conversationSeed: {
          leadLabel: 'Buyer One',
          opener: 'Hola Buyer One',
          closeCta: 'Activar producto base',
          followUpChannel: 'whatsapp',
        },
        handoffArtifacts: ['Artifact'],
        followUpChecklist: ['Follow-up checklist'],
        blockedBy: [],
        guardrails: ['Growth guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceOrderReviewWorkspaceUseCase(
      orderDraftDetailUseCase as never,
      closeoutPacketUseCase as never,
      growthBridgeUseCase as never,
      () => new Date('2026-05-28T17:36:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      reviewStatus: 'ready_for_operator_review',
      reviewSnapshot: {
        closeoutStatus: 'ready_for_operator_closeout',
        growthBridgeStatus: 'ready_for_growth_follow_up',
      },
    });
  });

  it('requests one order invoice draft bridge', async () => {
    const orderDraftDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:32:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          tenantId: 'tenant_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          status: 'ready_for_review',
          orderLabel: 'Order draft',
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          closingChannel: 'whatsapp',
          captureStatus: 'ready_for_order_draft',
          invoicingReadinessStatus: 'ready_to_invoice',
          customerProfile: {
            fullName: 'Buyer One',
            email: null,
            whatsappPhone: null,
            billingIntent: 'invoice',
            buyerCompany: null,
            buyerTaxIdOrDocument: null,
          },
          requiredFields: ['full_name'],
          optionalFields: ['buyer_company'],
          operatorPrompts: ['Prompt'],
          missingFields: [],
          blockedBy: [],
          guardrails: ['Guardrail'],
          createdAt: new Date('2026-05-28T17:31:00.000Z'),
          updatedAt: new Date('2026-05-28T17:31:00.000Z'),
        },
        summary: 'Detail listo.',
        nextActions: ['Action'],
        blockedBy: [],
        guardrails: ['Detail guardrail'],
      }),
    };
    const invoiceReadinessUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:30:00.000Z'),
        productEntity,
        readinessStatus: 'ready_to_invoice',
        summary: 'Readiness listo.',
        targetWorkspace: {
          productKey: 'invoicing',
          stage: 'electronic_invoicing_ec_mvp',
          handoffMode: 'operator_assist',
        },
        readinessSnapshot: {
          captureStatus: 'ready_for_order_draft',
          bridgeStatus: 'ready_for_invoice_handoff',
          buyerProfileStatus: 'ready',
        },
        fiscalRequirements: ['buyer_legal_name'],
        missingFields: [],
        handoffArtifacts: ['Artifact'],
        operatorChecklist: ['Checklist'],
        blockedBy: [],
        guardrails: ['Readiness guardrail'],
      }),
    };
    const useCase = new RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase(
      orderDraftDetailUseCase as never,
      invoiceReadinessUseCase as never,
      () => new Date('2026-05-28T17:37:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      bridgeStatus: 'ready_to_open_invoice_draft',
      invoiceDraftSeed: {
        customerLabel: 'Buyer One',
        documentHint: 'invoice',
      },
    });
  });

  it('loads one order growth follow-up workspace', async () => {
    const orderDraftDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:32:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          tenantId: 'tenant_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          status: 'ready_for_review',
          orderLabel: 'Order draft',
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          closingChannel: 'whatsapp',
          captureStatus: 'ready_for_order_draft',
          invoicingReadinessStatus: 'ready_to_invoice',
          customerProfile: {
            fullName: 'Buyer One',
            email: null,
            whatsappPhone: null,
            billingIntent: null,
            buyerCompany: null,
            buyerTaxIdOrDocument: null,
          },
          requiredFields: ['full_name'],
          optionalFields: ['buyer_company'],
          operatorPrompts: ['Prompt'],
          missingFields: [],
          blockedBy: [],
          guardrails: ['Guardrail'],
          createdAt: new Date('2026-05-28T17:31:00.000Z'),
          updatedAt: new Date('2026-05-28T17:31:00.000Z'),
        },
        summary: 'Detail listo.',
        nextActions: ['Action'],
        blockedBy: [],
        guardrails: ['Detail guardrail'],
      }),
    };
    const growthBridgeUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T17:35:00.000Z'),
        productEntity,
        orderDraft: { id: 'order_draft_001' },
        bridgeStatus: 'ready_for_growth_follow_up',
        summary: 'Bridge listo.',
        targetWorkspace: {
          productKey: 'growth',
          channel: 'whatsapp',
          handoffMode: 'operator_assist',
        },
        conversationSeed: {
          leadLabel: 'Buyer One',
          opener: 'Hola Buyer One',
          closeCta: 'Activar producto base',
          followUpChannel: 'whatsapp',
        },
        handoffArtifacts: ['Artifact'],
        followUpChecklist: ['Mantener CTA', 'Explicitar siguiente paso'],
        blockedBy: [],
        guardrails: ['Growth guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase(
      orderDraftDetailUseCase as never,
      growthBridgeUseCase as never,
      () => new Date('2026-05-28T17:38:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      workspaceStatus: 'ready_for_growth_follow_up',
      followUpPlan: {
        leadLabel: 'Buyer One',
        opener: 'Hola Buyer One',
      },
    });
  });

  it('requests one order approval decision', async () => {
    const reviewWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        productEntity,
        orderDraft: { id: 'order_draft_001', orderLabel: 'Order draft' },
        reviewStatus: 'ready_for_operator_review',
        reviewChecklist: ['Checklist'],
        blockedBy: [],
        guardrails: ['Review guardrail'],
      }),
    };
    const invoiceBridgeUseCase = {
      execute: jest.fn().mockResolvedValue({
        bridgeStatus: 'ready_to_open_invoice_draft',
        operatorChecklist: ['Invoice checklist'],
        blockedBy: [],
        guardrails: ['Invoice guardrail'],
      }),
    };
    const growthFollowUpUseCase = {
      execute: jest.fn().mockResolvedValue({
        workspaceStatus: 'ready_for_growth_follow_up',
        operatorChecklist: ['Growth checklist'],
        blockedBy: [],
        guardrails: ['Growth guardrail'],
      }),
    };
    const useCase = new RequestTenantEcommerceOrderApprovalDecisionUseCase(
      reviewWorkspaceUseCase as never,
      invoiceBridgeUseCase as never,
      growthFollowUpUseCase as never,
      () => new Date('2026-06-02T10:00:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      decision: 'approved',
      owner: { productKey: 'ecommerce', role: 'operator' },
      approvalChecklist: expect.arrayContaining([
        'Confirmar buyer intent, pricing y CTA como una sola decisión operativa.',
      ]),
    });
  });

  it('loads one order fiscal data completion workspace', async () => {
    const orderDraftDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:02:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          tenantId: 'tenant_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          status: 'draft',
          orderLabel: 'Order draft',
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          closingChannel: 'whatsapp',
          captureStatus: 'ready_for_order_draft',
          invoicingReadinessStatus: 'needs_data',
          customerProfile: {
            fullName: 'Buyer One',
            email: null,
            whatsappPhone: null,
            billingIntent: 'invoice',
            buyerCompany: null,
            buyerTaxIdOrDocument: null,
          },
          requiredFields: ['full_name'],
          optionalFields: ['buyer_company'],
          operatorPrompts: ['Prompt'],
          missingFields: ['buyer_legal_name', 'billing_email'],
          blockedBy: [],
          guardrails: ['Guardrail'],
          createdAt: new Date('2026-06-02T10:01:00.000Z'),
          updatedAt: new Date('2026-06-02T10:01:00.000Z'),
        },
        summary: 'Detail listo.',
        nextActions: ['Action'],
        blockedBy: [],
        guardrails: ['Detail guardrail'],
      }),
    };
    const invoiceBridgeUseCase = {
      execute: jest.fn().mockResolvedValue({
        bridgeStatus: 'needs_data',
        requiredFields: [
          'buyer_legal_name',
          'buyer_tax_id_or_document',
          'billing_email',
        ],
        missingFields: ['buyer_legal_name', 'billing_email'],
        blockedBy: [],
        guardrails: ['Invoice guardrail'],
      }),
    };
    const useCase =
      new GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase(
        orderDraftDetailUseCase as never,
        invoiceBridgeUseCase as never,
        () => new Date('2026-06-02T10:03:00.000Z'),
      );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      workspaceStatus: 'needs_data',
      missingFields: ['buyer_legal_name', 'billing_email'],
    });
  });

  it('requests one order handoff decision', async () => {
    const approvalDecisionUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:03:30.000Z'),
        productEntity,
        orderDraft: { id: 'order_draft_001', orderLabel: 'Order draft' },
        decision: 'approved',
        summary: 'Approval listo.',
        owner: { productKey: 'ecommerce', role: 'operator' },
        rationale: 'Buyer intent confirmado.',
        approvalChecklist: ['Checklist'],
        blockedBy: [],
        guardrails: ['Approval guardrail'],
      }),
    };
    const fiscalWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        workspaceStatus: 'ready',
        missingFields: [],
        blockedBy: [],
        guardrails: ['Fiscal guardrail'],
      }),
    };
    const growthFollowUpUseCase = {
      execute: jest.fn().mockResolvedValue({
        workspaceStatus: 'ready_for_growth_follow_up',
        blockedBy: [],
        guardrails: ['Growth guardrail'],
      }),
    };
    const invoiceDraftBridgeUseCase = {
      execute: jest.fn().mockResolvedValue({
        bridgeStatus: 'ready_to_open_invoice_draft',
        blockedBy: [],
        guardrails: ['Invoice guardrail'],
      }),
    };
    const useCase = new RequestTenantEcommerceOrderHandoffDecisionUseCase(
      approvalDecisionUseCase as never,
      fiscalWorkspaceUseCase as never,
      growthFollowUpUseCase as never,
      invoiceDraftBridgeUseCase as never,
      () => new Date('2026-06-02T10:04:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      handoffStatus: 'ready',
      route: 'invoicing',
      owner: { productKey: 'ecommerce', role: 'operator' },
    });
  });

  it('loads one invoice draft intake workspace', async () => {
    const orderDraftDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:04:30.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          tenantId: 'tenant_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          status: 'draft',
          orderLabel: 'Order draft',
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          closingChannel: 'whatsapp',
          captureStatus: 'ready_for_order_draft',
          invoicingReadinessStatus: 'ready_to_invoice',
          customerProfile: {
            fullName: 'Buyer One',
            email: 'buyer@example.com',
            whatsappPhone: '+593999999999',
            billingIntent: 'invoice',
            buyerCompany: null,
            buyerTaxIdOrDocument: '1790012345001',
          },
          requiredFields: ['full_name'],
          optionalFields: [],
          operatorPrompts: ['Prompt'],
          missingFields: [],
          blockedBy: [],
          guardrails: ['Guardrail'],
          createdAt: new Date('2026-06-02T10:04:00.000Z'),
          updatedAt: new Date('2026-06-02T10:04:00.000Z'),
        },
        summary: 'Detail listo.',
        nextActions: ['Action'],
        blockedBy: [],
        guardrails: ['Detail guardrail'],
      }),
    };
    const fiscalWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        workspaceStatus: 'ready',
        requiredFields: ['buyer_legal_name', 'billing_email'],
        missingFields: [],
        blockedBy: [],
        guardrails: ['Fiscal guardrail'],
      }),
    };
    const handoffDecisionUseCase = {
      execute: jest.fn().mockResolvedValue({
        handoffStatus: 'ready',
        route: 'invoicing',
        blockedBy: [],
        guardrails: ['Handoff guardrail'],
      }),
    };
    const invoiceDraftBridgeUseCase = {
      execute: jest.fn().mockResolvedValue({
        bridgeStatus: 'ready_to_open_invoice_draft',
        handoffArtifacts: ['Artifact'],
        operatorChecklist: ['Checklist'],
        blockedBy: [],
        guardrails: ['Invoice guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase(
      orderDraftDetailUseCase as never,
      fiscalWorkspaceUseCase as never,
      handoffDecisionUseCase as never,
      invoiceDraftBridgeUseCase as never,
      () => new Date('2026-06-02T10:05:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      workspaceStatus: 'ready_to_open_invoice_draft',
      commercialSnapshot: {
        offerTitle: 'Catalog asset entity final',
      },
    });
  });

  it('loads one order status lifecycle detail', async () => {
    const orderDraftDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:04:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          tenantId: 'tenant_001',
          tenantSlug: 'saas-platform',
          productEntityId: 'product_entity_001',
          status: 'draft',
          orderLabel: 'Order draft',
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
          closingChannel: 'whatsapp',
          captureStatus: 'ready_for_order_draft',
          invoicingReadinessStatus: 'ready_to_invoice',
          customerProfile: {
            fullName: 'Buyer One',
            email: 'buyer@example.com',
            whatsappPhone: '+593999999999',
            billingIntent: 'invoice',
            buyerCompany: null,
            buyerTaxIdOrDocument: '1790012345001',
          },
          requiredFields: ['full_name'],
          optionalFields: [],
          operatorPrompts: ['Prompt'],
          missingFields: [],
          blockedBy: [],
          guardrails: ['Guardrail'],
          createdAt: new Date('2026-06-02T10:04:00.000Z'),
          updatedAt: new Date('2026-06-02T10:04:00.000Z'),
        },
        summary: 'Detail listo.',
        nextActions: ['Action'],
        blockedBy: [],
        guardrails: ['Detail guardrail'],
      }),
    };
    const reviewWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        reviewStatus: 'ready_for_operator_review',
        blockedBy: [],
        guardrails: ['Review guardrail'],
      }),
    };
    const approvalDecisionUseCase = {
      execute: jest.fn().mockResolvedValue({
        decision: 'approved',
        blockedBy: [],
        guardrails: ['Approval guardrail'],
      }),
    };
    const invoiceBridgeUseCase = {
      execute: jest.fn().mockResolvedValue({
        bridgeStatus: 'ready_to_open_invoice_draft',
        blockedBy: [],
        guardrails: ['Invoice guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceOrderStatusLifecycleDetailUseCase(
      orderDraftDetailUseCase as never,
      reviewWorkspaceUseCase as never,
      approvalDecisionUseCase as never,
      invoiceBridgeUseCase as never,
      () => new Date('2026-06-02T10:05:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      currentStatus: 'handed_off',
      nextStep: expect.any(String),
      timeline: expect.arrayContaining([
        expect.objectContaining({
          key: 'handed_off',
          status: 'active',
        }),
      ]),
    });
  });

  it('lists order status lifecycles', async () => {
    const listOrderDraftsUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:06:00.000Z'),
        productEntity,
        summary: {
          headline: '1 order draft',
          detail: 'Detalle',
          totalOrderDrafts: 1,
        },
        orderDrafts: [
          {
            id: 'order_draft_001',
            orderLabel: 'Order draft',
            updatedAt: new Date('2026-06-02T10:06:00.000Z'),
          },
        ],
      }),
    };
    const detailUseCase = {
      execute: jest.fn().mockResolvedValue({
        orderDraft: { id: 'order_draft_001', orderLabel: 'Order draft' },
        currentStatus: 'under_review',
        nextStep: 'Completar revisión',
      }),
    };
    const useCase = new ListTenantEcommerceOrderStatusLifecyclesUseCase(
      listOrderDraftsUseCase as never,
      detailUseCase as never,
      () => new Date('2026-06-02T10:07:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      summary: {
        totalOrders: 1,
      },
      orders: [
        expect.objectContaining({
          orderDraftId: 'order_draft_001',
          currentStatus: 'under_review',
        }),
      ],
    });
  });

  it('loads one order operator workboard', async () => {
    const lifecycleRegistryUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:08:00.000Z'),
        productEntity,
        summary: {
          totalOrders: 1,
          draftCount: 0,
          underReviewCount: 1,
          approvedCount: 0,
          handedOffCount: 0,
          blockedCount: 0,
          headline: '1 order draft',
          detail: 'Detalle',
        },
        orders: [
          {
            orderDraftId: 'order_draft_001',
            orderLabel: 'Order draft',
            currentStatus: 'under_review',
            nextStep: 'Completar fiscal data',
            updatedAt: new Date('2026-06-02T10:08:00.000Z'),
          },
        ],
      }),
    };
    const handoffDecisionUseCase = {
      execute: jest.fn().mockResolvedValue({
        route: 'hold',
        summary: 'Aun falta data.',
      }),
    };
    const useCase = new GetTenantEcommerceOrderOperatorWorkboardUseCase(
      lifecycleRegistryUseCase as never,
      handoffDecisionUseCase as never,
      () => new Date('2026-06-02T10:09:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      summary: { totalOrders: 1, highPriorityCount: 0 },
      entries: [
        expect.objectContaining({
          handoffRoute: 'hold',
          priority: 'medium',
        }),
      ],
    });
  });

  it('loads one order handoff execution workspace', async () => {
    const handoffDecisionUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:10:00.000Z'),
        productEntity,
        orderDraft: { id: 'order_draft_001', orderLabel: 'Order draft' },
        handoffStatus: 'ready',
        route: 'invoicing',
        summary: 'Handoff listo.',
        owner: { productKey: 'ecommerce', role: 'operator' },
        rationale: 'Checklist completo.',
        routeChecklist: ['Checklist'],
        blockedBy: [],
        guardrails: ['Handoff guardrail'],
      }),
    };
    const invoiceIntakeUseCase = {
      execute: jest.fn().mockResolvedValue({
        workspaceStatus: 'ready_to_open_invoice_draft',
        blockedBy: [],
        handoffArtifacts: ['Invoice artifact'],
        operatorChecklist: ['Invoice checklist'],
        guardrails: ['Invoice intake guardrail'],
      }),
    };
    const growthFollowUpUseCase = {
      execute: jest.fn().mockResolvedValue({
        workspaceStatus: 'ready_for_growth_follow_up',
        blockedBy: [],
        handoffArtifacts: ['Growth artifact'],
        operatorChecklist: ['Growth checklist'],
        guardrails: ['Growth guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase(
      handoffDecisionUseCase as never,
      invoiceIntakeUseCase as never,
      growthFollowUpUseCase as never,
      () => new Date('2026-06-02T10:11:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      executionStatus: 'ready_for_execution',
      activeRoute: 'invoicing',
      owner: { productKey: 'ecommerce', role: 'operator' },
    });
  });

  it('requests one invoice draft open bridge', async () => {
    const invoiceIntakeUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:12:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          orderLabel: 'Order draft',
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          customerProfile: { fullName: 'Buyer One', billingIntent: 'invoice' },
        },
        workspaceStatus: 'ready_to_open_invoice_draft',
        summary: 'Invoice intake listo.',
        targetWorkspace: {
          productKey: 'invoicing',
          stage: 'electronic_invoicing_ec_mvp',
          handoffMode: 'operator_assist',
        },
        commercialSnapshot: {
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
        },
        fiscalSnapshot: {
          requiredFields: ['buyer_legal_name'],
          missingFields: [],
          billingIntent: 'invoice',
        },
        handoffArtifacts: ['Invoice artifact'],
        operatorChecklist: ['Invoice checklist'],
        blockedBy: [],
        guardrails: ['Invoice intake guardrail'],
      }),
    };
    const handoffExecutionUseCase = {
      execute: jest.fn().mockResolvedValue({
        executionStatus: 'ready_for_execution',
        activeRoute: 'invoicing',
        blockedBy: [],
        executionChecklist: ['Execution checklist'],
        handoffArtifacts: ['Execution artifact'],
        guardrails: ['Execution guardrail'],
      }),
    };
    const useCase = new RequestTenantEcommerceInvoiceDraftOpenBridgeUseCase(
      invoiceIntakeUseCase as never,
      handoffExecutionUseCase as never,
      () => new Date('2026-06-02T10:13:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      bridgeStatus: 'ready_to_open',
      payload: { documentHint: 'invoice' },
    });
  });

  it('loads one order ops priority queue', async () => {
    const orderOperatorWorkboardUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:14:00.000Z'),
        productEntity,
        summary: {
          totalOrders: 1,
          highPriorityCount: 1,
          readyForInvoicingCount: 0,
          growthFollowUpCount: 1,
          blockedCount: 0,
          headline: '1 order en workboard.',
          detail: 'Detalle.',
        },
        entries: [
          {
            orderDraftId: 'order_draft_001',
            orderLabel: 'Order draft',
            currentStatus: 'under_review',
            handoffRoute: 'growth_follow_up',
            priority: 'medium',
            attentionReason: 'Buyer necesita follow-up.',
            nextStep: 'Retomar conversación',
            updatedAt: new Date('2026-06-02T10:14:00.000Z'),
          },
        ],
      }),
    };
    const handoffExecutionUseCase = {
      execute: jest.fn().mockResolvedValue({
        executionStatus: 'needs_data',
        activeRoute: 'growth_follow_up',
        blockedBy: [],
      }),
    };
    const useCase = new GetTenantEcommerceOrderOpsPriorityQueueUseCase(
      orderOperatorWorkboardUseCase as never,
      handoffExecutionUseCase as never,
      () => new Date('2026-06-02T10:15:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      summary: { totalOrders: 1, growthLaneCount: 1 },
      entries: [
        expect.objectContaining({
          activeRoute: 'growth_follow_up',
          priorityBand: 'medium',
        }),
      ],
    });
  });

  it('loads one order hold resolution workspace', async () => {
    const handoffDecisionUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:16:00.000Z'),
        productEntity,
        orderDraft: { id: 'order_draft_001', orderLabel: 'Order draft' },
        handoffStatus: 'needs_data',
        route: 'hold',
        summary: 'Handoff en hold.',
        owner: { productKey: 'ecommerce', role: 'operator' },
        rationale: 'Falta data fiscal.',
        routeChecklist: ['Checklist'],
        blockedBy: [],
        guardrails: ['Handoff guardrail'],
      }),
    };
    const fiscalWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        workspaceStatus: 'needs_data',
        missingFields: ['billing_email'],
        blockedBy: [],
        guardrails: ['Fiscal guardrail'],
      }),
    };
    const growthFollowUpUseCase = {
      execute: jest.fn().mockResolvedValue({
        workspaceStatus: 'ready_for_growth_follow_up',
        blockedBy: [],
        guardrails: ['Growth guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceOrderHoldResolutionWorkspaceUseCase(
      handoffDecisionUseCase as never,
      fiscalWorkspaceUseCase as never,
      growthFollowUpUseCase as never,
      () => new Date('2026-06-02T10:17:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      resolutionStatus: 'ready_to_resolve',
      currentRoute: 'hold',
      suggestedExitRoutes: expect.arrayContaining([
        expect.objectContaining({
          route: 'growth_follow_up',
          readiness: 'ready',
        }),
      ]),
    });
  });

  it('requests one invoice draft launch bridge', async () => {
    const invoiceDraftOpenBridgeUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:18:00.000Z'),
        productEntity,
        orderDraft: { id: 'order_draft_001', orderLabel: 'Order draft' },
        bridgeStatus: 'ready_to_open',
        summary: 'Open bridge listo.',
        targetWorkspace: {
          productKey: 'invoicing',
          stage: 'electronic_invoicing_ec_mvp',
          handoffMode: 'operator_assist',
        },
        payload: {
          customerLabel: 'Buyer One',
          documentHint: 'invoice',
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          billingIntent: 'invoice',
        },
        fiscalSnapshot: {
          requiredFields: ['buyer_legal_name'],
          missingFields: [],
        },
        handoffArtifacts: ['Commercial snapshot'],
        operatorChecklist: ['Checklist'],
        blockedBy: [],
        guardrails: ['Open bridge guardrail'],
      }),
    };
    const handoffExecutionUseCase = {
      execute: jest.fn().mockResolvedValue({
        executionStatus: 'ready_for_execution',
        activeRoute: 'invoicing',
        blockedBy: [],
        guardrails: ['Execution guardrail'],
      }),
    };
    const useCase = new RequestTenantEcommerceInvoiceDraftLaunchBridgeUseCase(
      invoiceDraftOpenBridgeUseCase as never,
      handoffExecutionUseCase as never,
      () => new Date('2026-06-02T10:19:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      launchStatus: 'ready_to_launch',
      launchPayload: { routeConfirmed: true, documentHint: 'invoice' },
    });
  });

  it('loads one order ops attention workspace', async () => {
    const orderOpsPriorityQueueUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:20:00.000Z'),
        productEntity,
        summary: {
          totalOrders: 1,
          criticalCount: 0,
          invoicingLaneCount: 0,
          growthLaneCount: 1,
          holdCount: 0,
          headline: '1 order en queue.',
          detail: 'Detalle.',
        },
        entries: [
          {
            orderDraftId: 'order_draft_001',
            orderLabel: 'Order draft',
            currentStatus: 'under_review',
            activeRoute: 'growth_follow_up',
            priorityBand: 'medium',
            priorityScore: 60,
            attentionReason: 'Buyer necesita follow-up.',
            recommendedAction: 'Retomar conversación.',
            quickActions: ['open_growth_follow_up'],
            updatedAt: new Date('2026-06-02T10:20:00.000Z'),
          },
        ],
      }),
    };
    const handoffExecutionUseCase = {
      execute: jest.fn().mockResolvedValue({
        executionStatus: 'needs_data',
        activeRoute: 'growth_follow_up',
        blockedBy: [],
      }),
    };
    const useCase = new GetTenantEcommerceOrderOpsAttentionWorkspaceUseCase(
      orderOpsPriorityQueueUseCase as never,
      handoffExecutionUseCase as never,
      () => new Date('2026-06-02T10:21:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      summary: { totalAttentionItems: 1, needsDataCount: 1 },
      entries: [
        expect.objectContaining({
          attentionStatus: 'needs_data',
          activeRoute: 'growth_follow_up',
        }),
      ],
    });
  });

  it('requests one order route resolution packet', async () => {
    const holdResolutionWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:22:00.000Z'),
        productEntity,
        orderDraft: { id: 'order_draft_001', orderLabel: 'Order draft' },
        resolutionStatus: 'ready_to_resolve',
        currentRoute: 'hold',
        summary: 'Hold resolution listo.',
        owner: { productKey: 'ecommerce', role: 'operator' },
        blockerSummary: { hardBlockers: [], softBlockers: ['billing_email'] },
        suggestedExitRoutes: [
          {
            route: 'invoicing',
            readiness: 'ready',
            rationale: 'Invoicing listo.',
          },
          {
            route: 'growth_follow_up',
            readiness: 'needs_data',
            rationale: 'Growth necesita contexto.',
          },
        ],
        resolutionChecklist: ['Checklist'],
        nextStep: 'Mover a invoicing.',
        blockedBy: [],
        guardrails: ['Hold guardrail'],
      }),
    };
    const handoffExecutionUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:22:00.000Z'),
        productEntity,
        orderDraft: { id: 'order_draft_001', orderLabel: 'Order draft' },
        executionStatus: 'needs_data',
        activeRoute: 'hold',
        summary: 'Execution en hold.',
        owner: { productKey: 'ecommerce', role: 'operator' },
        routeTargets: {
          invoicingTarget: {
            productKey: 'invoicing',
            stage: 'electronic_invoicing_ec_mvp',
            handoffMode: 'operator_assist',
          },
          growthTarget: {
            productKey: 'growth',
            channel: 'whatsapp',
            handoffMode: 'operator_assist',
          },
        },
        executionChecklist: ['Checklist'],
        nextStep: 'Esperar confirmación.',
        handoffArtifacts: ['Artifact'],
        blockedBy: [],
        guardrails: ['Execution guardrail'],
      }),
    };
    const useCase = new RequestTenantEcommerceOrderRouteResolutionPacketUseCase(
      holdResolutionWorkspaceUseCase as never,
      handoffExecutionUseCase as never,
      () => new Date('2026-06-02T10:23:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      resolutionStatus: 'ready_to_reroute',
      recommendedRoute: 'invoicing',
      routeSignals: { invoicingReadiness: 'ready' },
    });
  });

  it('loads one invoice draft handoff workspace', async () => {
    const invoiceDraftLaunchBridgeUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:24:00.000Z'),
        productEntity,
        orderDraft: { id: 'order_draft_001', orderLabel: 'Order draft' },
        launchStatus: 'ready_to_launch',
        summary: 'Launch listo.',
        targetWorkspace: {
          productKey: 'invoicing',
          stage: 'electronic_invoicing_ec_mvp',
          handoffMode: 'operator_assist',
        },
        launchPayload: {
          customerLabel: 'Buyer One',
          documentHint: 'invoice',
          offerTitle: 'Catalog asset entity final',
          pricingSnapshot: 'Operator confirmed band',
          billingIntent: 'invoice',
          routeConfirmed: true,
        },
        fiscalArtifacts: ['buyer_legal_name'],
        commercialArtifacts: ['Commercial snapshot'],
        operatorChecklist: ['Checklist'],
        blockedBy: [],
        guardrails: ['Launch guardrail'],
      }),
    };
    const orderRouteResolutionPacketUseCase = {
      execute: jest.fn().mockResolvedValue({
        currentRoute: 'hold',
        recommendedRoute: 'invoicing',
        resolutionStatus: 'ready_to_reroute',
        blockedBy: [],
        guardrails: ['Route guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceInvoiceDraftHandoffWorkspaceUseCase(
      invoiceDraftLaunchBridgeUseCase as never,
      orderRouteResolutionPacketUseCase as never,
      () => new Date('2026-06-02T10:25:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      workspaceStatus: 'ready_for_invoice_handoff',
      routeSnapshot: {
        currentRoute: 'hold',
        recommendedRoute: 'invoicing',
        routeConfirmed: true,
      },
    });
  });

  it('loads one order ops escalation board', async () => {
    const orderOpsAttentionWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:26:00.000Z'),
        productEntity,
        summary: {
          totalAttentionItems: 1,
          blockedCount: 1,
          needsDataCount: 0,
          readyCount: 0,
          headline: '1 attention item.',
          detail: 'Detalle.',
        },
        focusLanes: [],
        entries: [
          {
            orderDraftId: 'order_draft_001',
            orderLabel: 'Order draft',
            attentionStatus: 'blocked',
            activeRoute: 'hold',
            attentionReason: 'Hold sin salida.',
            nextAction: 'Resolver hold.',
            ownerRole: 'operator',
            updatedAt: new Date('2026-06-02T10:26:00.000Z'),
          },
        ],
      }),
    };
    const orderOpsPriorityQueueUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:26:00.000Z'),
        productEntity,
        summary: {
          totalOrders: 1,
          criticalCount: 1,
          invoicingLaneCount: 0,
          growthLaneCount: 0,
          holdCount: 1,
          headline: '1 order en queue.',
          detail: 'Detalle.',
        },
        entries: [
          {
            orderDraftId: 'order_draft_001',
            orderLabel: 'Order draft',
            currentStatus: 'blocked',
            activeRoute: 'hold',
            priorityBand: 'critical',
            priorityScore: 90,
            attentionReason: 'Hold sin salida.',
            recommendedAction: 'Resolver hold.',
            quickActions: ['resolve_hold'],
            updatedAt: new Date('2026-06-02T10:26:00.000Z'),
          },
        ],
      }),
    };
    const useCase = new GetTenantEcommerceOrderOpsEscalationBoardUseCase(
      orderOpsAttentionWorkspaceUseCase as never,
      orderOpsPriorityQueueUseCase as never,
      () => new Date('2026-06-02T10:27:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      summary: { totalEscalations: 1, criticalCount: 1 },
      entries: [
        expect.objectContaining({
          escalationLevel: 'critical',
          activeRoute: 'hold',
        }),
      ],
    });
  });

  it('requests one invoice handoff acknowledgement', async () => {
    const invoiceDraftHandoffWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:28:00.000Z'),
        productEntity,
        orderDraft: { id: 'order_draft_001', orderLabel: 'Order draft' },
        workspaceStatus: 'ready_for_invoice_handoff',
        summary: 'Handoff listo.',
        targetWorkspace: {
          productKey: 'invoicing',
          stage: 'electronic_invoicing_ec_mvp',
          handoffMode: 'operator_assist',
        },
        routeSnapshot: {
          currentRoute: 'hold',
          recommendedRoute: 'invoicing',
          routeConfirmed: true,
        },
        handoffArtifacts: ['Order draft snapshot'],
        blockedBy: [],
        guardrails: ['Handoff guardrail'],
      }),
    };
    const useCase = new RequestTenantEcommerceInvoiceHandoffAcknowledgementUseCase(
      invoiceDraftHandoffWorkspaceUseCase as never,
      () => new Date('2026-06-02T10:29:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      acknowledgementStatus: 'accepted',
      receivedArtifacts: ['Order draft snapshot'],
    });
  });

  it('loads one order payment readiness workspace', async () => {
    const checkoutCloseoutPacketUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:30:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          orderLabel: 'Order draft',
          closingChannel: 'whatsapp_growth',
          customerProfile: { billingIntent: 'invoice' },
        },
        closeoutStatus: 'ready_for_review',
        commercialSnapshot: {
          pricingSnapshot: 'Operator confirmed band',
          primaryCta: 'Activar producto base',
        },
        paymentReadiness: {
          status: 'ready',
          hint: 'Todo listo.',
        },
        blockedBy: [],
        guardrails: ['Closeout guardrail'],
      }),
    };
    const invoiceAcknowledgementUseCase = {
      execute: jest.fn().mockResolvedValue({
        acknowledgementStatus: 'accepted',
        missingSignals: [],
        blockedBy: [],
        guardrails: ['Ack guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase(
      checkoutCloseoutPacketUseCase as never,
      invoiceAcknowledgementUseCase as never,
      () => new Date('2026-06-02T10:31:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      workspaceStatus: 'ready_for_collection',
      paymentPlan: {
        collectionChannel: 'whatsapp_growth',
      },
    });
  });

  it('loads one order post-sale lifecycle detail', async () => {
    const orderLifecycleUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:32:00.000Z'),
        productEntity,
        orderDraft: { id: 'order_draft_001', orderLabel: 'Order draft' },
        currentStatus: 'handed_off',
        blockedBy: [],
        guardrails: ['Lifecycle guardrail'],
      }),
    };
    const invoiceAcknowledgementUseCase = {
      execute: jest.fn().mockResolvedValue({
        acknowledgementStatus: 'accepted',
        blockedBy: [],
        guardrails: ['Ack guardrail'],
      }),
    };
    const paymentReadinessUseCase = {
      execute: jest.fn().mockResolvedValue({
        workspaceStatus: 'ready_for_collection',
        blockedBy: [],
        guardrails: ['Payment guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase(
      orderLifecycleUseCase as never,
      invoiceAcknowledgementUseCase as never,
      paymentReadinessUseCase as never,
      () => new Date('2026-06-02T10:33:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      currentStatus: 'awaiting_payment',
      timeline: expect.arrayContaining([
        expect.objectContaining({
          key: 'awaiting_payment',
          status: 'active',
        }),
      ]),
    });
  });

  it('lists order post-sale lifecycles', async () => {
    const listOrderDraftsUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:34:00.000Z'),
        productEntity,
        summary: {
          headline: '1 order draft',
          detail: 'Detalle',
          totalOrderDrafts: 1,
        },
        orderDrafts: [
          {
            id: 'order_draft_001',
            orderLabel: 'Order draft',
            updatedAt: new Date('2026-06-02T10:34:00.000Z'),
          },
        ],
      }),
    };
    const postSaleDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        orderDraft: { id: 'order_draft_001', orderLabel: 'Order draft' },
        currentStatus: 'invoicing',
        nextStep: 'Abrir invoice draft',
        generatedAt: new Date('2026-06-02T10:35:00.000Z'),
      }),
    };
    const useCase = new ListTenantEcommerceOrderPostSaleLifecyclesUseCase(
      listOrderDraftsUseCase as never,
      postSaleDetailUseCase as never,
      () => new Date('2026-06-02T10:36:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      summary: { totalOrders: 1, invoicingCount: 1 },
      orders: [
        expect.objectContaining({
          orderDraftId: 'order_draft_001',
          currentStatus: 'invoicing',
        }),
      ],
    });
  });

  it('loads one order payment confirmation workspace', async () => {
    const paymentReadinessUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:37:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          orderLabel: 'Order draft',
        },
        workspaceStatus: 'ready_for_collection',
        summary: 'Payment readiness listo.',
        paymentPlan: {
          collectionChannel: 'whatsapp',
          pricingSnapshot: 'Operator confirmed band',
          billingIntent: 'invoice',
          primaryCta: 'Activar producto base',
        },
        invoiceSignal: {
          acknowledgementStatus: 'accepted',
          detail: 'Ack listo.',
        },
        closeoutSignal: {
          closeoutStatus: 'ready_for_operator_closeout',
          paymentReadinessStatus: 'ready',
        },
        frictionPoints: [],
        blockedBy: [],
        guardrails: ['Payment readiness guardrail'],
      }),
    };
    const postSaleLifecycleUseCase = {
      execute: jest.fn().mockResolvedValue({
        currentStatus: 'awaiting_payment',
        blockedBy: [],
        guardrails: ['Post-sale guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase(
      paymentReadinessUseCase as never,
      postSaleLifecycleUseCase as never,
      () => new Date('2026-06-02T10:38:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      confirmationStatus: 'ready_for_confirmation',
      expectedCollection: {
        collectionChannel: 'whatsapp',
      },
    });
  });

  it('requests one order payment confirmation decision', async () => {
    const paymentConfirmationUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:38:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          orderLabel: 'Order draft',
        },
        confirmationStatus: 'ready_for_confirmation',
        blockedBy: [],
        guardrails: ['Payment confirmation guardrail'],
      }),
    };
    const fulfillmentReadinessUseCase = {
      execute: jest.fn().mockResolvedValue({
        blockedBy: [],
        guardrails: ['Fulfillment guardrail'],
      }),
    };
    const postSaleLifecycleUseCase = {
      execute: jest.fn().mockResolvedValue({
        currentStatus: 'awaiting_payment',
        blockedBy: [],
        guardrails: ['Post-sale guardrail'],
      }),
    };
    const useCase =
      new RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase(
        paymentConfirmationUseCase as never,
        fulfillmentReadinessUseCase as never,
        postSaleLifecycleUseCase as never,
        () => new Date('2026-06-02T10:39:00.000Z'),
      );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      decision: 'confirmed',
      owner: { productKey: 'ecommerce', role: 'operator' },
    });
  });

  it('loads one order fulfillment readiness workspace', async () => {
    const paymentConfirmationUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:39:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          orderLabel: 'Order draft',
          closingChannel: 'whatsapp',
          customerProfile: { email: 'buyer@example.com' },
        },
        confirmationStatus: 'needs_review',
        blockedBy: [],
        guardrails: ['Confirmation guardrail'],
      }),
    };
    const postSaleLifecycleUseCase = {
      execute: jest.fn().mockResolvedValue({
        currentStatus: 'awaiting_payment',
        blockedBy: [],
        guardrails: ['Post-sale guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase(
      paymentConfirmationUseCase as never,
      postSaleLifecycleUseCase as never,
      () => new Date('2026-06-02T10:40:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      fulfillmentStatus: 'waiting_payment_confirmation',
      fulfillmentProfile: {
        fulfillmentType: 'service',
        deliveryChannel: 'whatsapp',
      },
    });
  });

  it('loads one order fulfillment execution workspace', async () => {
    const paymentConfirmationDecisionUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:40:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          orderLabel: 'Order draft',
        },
        decision: 'confirmed',
        blockedBy: [],
        guardrails: ['Decision guardrail'],
      }),
    };
    const fulfillmentReadinessUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:41:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          orderLabel: 'Order draft',
        },
        fulfillmentStatus: 'waiting_payment_confirmation',
        summary: 'Esperando confirmación.',
        fulfillmentProfile: {
          fulfillmentType: 'service',
          deliveryChannel: 'whatsapp',
          ownerRole: 'operator',
        },
        blockedBy: [],
        nextStep: 'Coordinar entrega.',
        guardrails: ['Fulfillment guardrail'],
      }),
    };
    const postSaleLifecycleUseCase = {
      execute: jest.fn().mockResolvedValue({
        currentStatus: 'awaiting_payment',
        blockedBy: [],
        guardrails: ['Post-sale guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase(
      paymentConfirmationDecisionUseCase as never,
      fulfillmentReadinessUseCase as never,
      postSaleLifecycleUseCase as never,
      () => new Date('2026-06-02T10:42:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      executionStatus: 'ready_to_execute',
      executionSignals: {
        paymentDecision: 'confirmed',
        postSaleStatus: 'awaiting_payment',
      },
    });
  });

  it('loads one order payment confirmation log', async () => {
    const paymentDecisionUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:42:30.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          orderLabel: 'Order draft',
        },
        decision: 'confirmed',
        blockedBy: [],
        guardrails: ['Decision guardrail'],
      }),
    };
    const paymentConfirmationUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:42:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          orderLabel: 'Order draft',
        },
        expectedCollection: {
          collectionChannel: 'whatsapp',
          pricingSnapshot: 'Operator confirmed band',
          billingIntent: 'invoice',
          primaryCta: 'Activar producto base',
        },
        evidenceHints: ['Transferencia esperada'],
        blockedBy: [],
        guardrails: ['Payment confirmation guardrail'],
      }),
    };
    const postSaleLifecycleUseCase = {
      execute: jest.fn().mockResolvedValue({
        currentStatus: 'awaiting_payment',
        blockedBy: [],
        guardrails: ['Post-sale guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceOrderPaymentConfirmationLogUseCase(
      paymentDecisionUseCase as never,
      paymentConfirmationUseCase as never,
      postSaleLifecycleUseCase as never,
      () => new Date('2026-06-02T10:43:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      logStatus: 'confirmed',
      decisionSignal: {
        paymentDecision: 'confirmed',
        postSaleStatus: 'awaiting_payment',
      },
    });
  });

  it('loads one order fulfillment delivery workspace', async () => {
    const paymentConfirmationLogUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:43:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          orderLabel: 'Order draft',
        },
        logStatus: 'confirmed',
        blockedBy: [],
        guardrails: ['Payment log guardrail'],
      }),
    };
    const fulfillmentExecutionUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:44:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          orderLabel: 'Order draft',
        },
        executionStatus: 'ready_to_execute',
        fulfillmentProfile: {
          fulfillmentType: 'service',
          deliveryChannel: 'whatsapp',
          ownerRole: 'operator',
        },
        executionChecklist: ['Confirmar agenda con el buyer'],
        blockedBy: [],
        nextStep: 'Coordinar entrega.',
        guardrails: ['Fulfillment execution guardrail'],
      }),
    };
    const postSaleLifecycleUseCase = {
      execute: jest.fn().mockResolvedValue({
        currentStatus: 'awaiting_payment',
        blockedBy: [],
        guardrails: ['Post-sale guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase(
      paymentConfirmationLogUseCase as never,
      fulfillmentExecutionUseCase as never,
      postSaleLifecycleUseCase as never,
      () => new Date('2026-06-02T10:45:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      deliveryStatus: 'in_progress',
      deliveryProfile: {
        deliveryMode: 'service_activation',
      },
      executionSignals: {
        paymentLogStatus: 'confirmed',
      },
    });
  });

  it('loads one order payment dispute workspace', async () => {
    const paymentLogUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:45:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          orderLabel: 'Order draft',
        },
        logStatus: 'confirmed',
        confirmationRecord: {
          confirmationChannel: 'whatsapp',
          evidenceHints: ['Transferencia esperada'],
        },
        blockedBy: [],
        guardrails: ['Payment log guardrail'],
      }),
    };
    const paymentDecisionUseCase = {
      execute: jest.fn().mockResolvedValue({
        decision: 'confirmed',
        blockedBy: [],
        guardrails: ['Payment decision guardrail'],
      }),
    };
    const postSaleLifecycleUseCase = {
      execute: jest.fn().mockResolvedValue({
        currentStatus: 'invoicing',
        blockedBy: [],
        guardrails: ['Post-sale guardrail'],
      }),
    };
    const useCase = new GetTenantEcommerceOrderPaymentDisputeWorkspaceUseCase(
      paymentLogUseCase as never,
      paymentDecisionUseCase as never,
      postSaleLifecycleUseCase as never,
      () => new Date('2026-06-02T10:46:00.000Z'),
    );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      disputeStatus: 'confirmed',
      disputeProfile: {
        activeChannel: 'whatsapp',
      },
    });
  });

  it('requests one order fulfillment completion packet', async () => {
    const deliveryWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:46:00.000Z'),
        productEntity,
        orderDraft: {
          id: 'order_draft_001',
          orderLabel: 'Order draft',
        },
        deliveryStatus: 'in_progress',
        deliveryProfile: {
          deliveryMode: 'service_activation',
        },
        prerequisitesResolved: ['Cobro confirmado'],
        handoffNotes: ['Buyer respondió por WhatsApp'],
        blockedBy: [],
        nextStep: 'Coordinar entrega.',
        guardrails: ['Delivery guardrail'],
      }),
    };
    const paymentLogUseCase = {
      execute: jest.fn().mockResolvedValue({
        logStatus: 'confirmed',
        confirmationRecord: {
          operatorNote: 'Cobro validado por el operador.',
        },
        blockedBy: [],
        guardrails: ['Payment log guardrail'],
      }),
    };
    const postSaleLifecycleUseCase = {
      execute: jest.fn().mockResolvedValue({
        currentStatus: 'invoicing',
        blockedBy: [],
        guardrails: ['Post-sale guardrail'],
      }),
    };
    const useCase =
      new RequestTenantEcommerceOrderFulfillmentCompletionPacketUseCase(
        deliveryWorkspaceUseCase as never,
        paymentLogUseCase as never,
        postSaleLifecycleUseCase as never,
        () => new Date('2026-06-02T10:47:00.000Z'),
      );

    await expect(
      useCase.execute(
        'saas-platform',
        'product_entity_001',
        'order_draft_001',
      ),
    ).resolves.toMatchObject({
      completionStatus: 'partial',
      deliveryResult: {
        deliveryMode: 'service_activation',
      },
    });
  });

  it('loads one order revenue tracking summary', async () => {
    const postSaleRegistryUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:41:00.000Z'),
        productEntity,
        summary: {
          totalOrders: 1,
          headline: '1 order',
          detail: 'Detalle',
        },
        orders: [
          {
            orderDraftId: 'order_draft_001',
            orderLabel: 'Order draft',
            currentStatus: 'awaiting_payment',
            nextStep: 'Confirmar cobro',
            updatedAt: new Date('2026-06-02T10:41:00.000Z'),
          },
        ],
      }),
    };
    const paymentConfirmationUseCase = {
      execute: jest.fn().mockResolvedValue({
        confirmationStatus: 'ready_for_confirmation',
        expectedCollection: {
          pricingSnapshot: 'Operator confirmed band',
          billingIntent: 'invoice',
        },
      }),
    };
    const fulfillmentUseCase = {
      execute: jest.fn().mockResolvedValue({
        fulfillmentStatus: 'waiting_payment_confirmation',
        nextStep: 'Esperar confirmación.',
      }),
    };
    const useCase = new GetTenantEcommerceOrderRevenueTrackingSummaryUseCase(
      postSaleRegistryUseCase as never,
      paymentConfirmationUseCase as never,
      fulfillmentUseCase as never,
      () => new Date('2026-06-02T10:42:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      summary: { totalOrders: 1, awaitingPaymentCount: 1 },
      paymentRollup: { readyForConfirmationCount: 1 },
      entries: [
        expect.objectContaining({
          orderDraftId: 'order_draft_001',
          paymentConfirmationStatus: 'ready_for_confirmation',
        }),
      ],
    });
  });

  it('loads one order post-sale reporting board', async () => {
    const postSaleRegistryUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:47:00.000Z'),
        productEntity,
        summary: {
          totalOrders: 1,
          headline: '1 order',
          detail: 'Detalle',
        },
        orders: [
          {
            orderDraftId: 'order_draft_001',
            orderLabel: 'Order draft',
            currentStatus: 'invoicing',
            nextStep: 'Cerrar fulfillment',
            updatedAt: new Date('2026-06-02T10:47:00.000Z'),
          },
        ],
      }),
    };
    const paymentLogUseCase = {
      execute: jest.fn().mockResolvedValue({
        logStatus: 'confirmed',
      }),
    };
    const deliveryWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        deliveryStatus: 'in_progress',
      }),
    };
    const useCase = new GetTenantEcommerceOrderPostSaleReportingBoardUseCase(
      postSaleRegistryUseCase as never,
      paymentLogUseCase as never,
      deliveryWorkspaceUseCase as never,
      () => new Date('2026-06-02T10:48:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      summary: { totalOrders: 1, divergenceCount: 1 },
      entries: [
        expect.objectContaining({
          orderDraftId: 'order_draft_001',
          driftSignal: 'payment_without_delivery',
        }),
      ],
    });
  });

  it('loads one order revenue ops board', async () => {
    const revenueTrackingUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:43:00.000Z'),
        productEntity,
        summary: {
          totalOrders: 1,
          headline: '1 order',
          detail: 'Detalle',
        },
        paymentRollup: {
          readyForConfirmationCount: 1,
          needsReviewCount: 0,
          blockedCount: 0,
          confirmationBacklog: 'Hay backlog listo.',
        },
        valueSignals: {
          expectedPricingSnapshots: ['Operator confirmed band'],
          billingIntents: ['invoice'],
        },
        entries: [
          {
            orderDraftId: 'order_draft_001',
            orderLabel: 'Order draft',
            currentStatus: 'awaiting_payment',
            paymentConfirmationStatus: 'ready_for_confirmation',
            fulfillmentStatus: 'waiting_payment_confirmation',
            pricingSnapshot: 'Operator confirmed band',
            billingIntent: 'invoice',
            nextStep: 'Confirmar cobro.',
            updatedAt: new Date('2026-06-02T10:43:00.000Z'),
          },
        ],
      }),
    };
    const paymentDecisionUseCase = {
      execute: jest.fn().mockResolvedValue({
        decision: 'confirmed',
      }),
    };
    const fulfillmentExecutionUseCase = {
      execute: jest.fn().mockResolvedValue({
        executionStatus: 'ready_to_execute',
        nextStep: 'Coordinar entrega.',
      }),
    };
    const useCase = new GetTenantEcommerceOrderRevenueOpsBoardUseCase(
      revenueTrackingUseCase as never,
      paymentDecisionUseCase as never,
      fulfillmentExecutionUseCase as never,
      () => new Date('2026-06-02T10:44:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      summary: { totalOrders: 1, awaitingPaymentCount: 1, highPriorityCount: 1 },
      entries: [
        expect.objectContaining({
          orderDraftId: 'order_draft_001',
          priorityBand: 'high',
          paymentDecision: 'confirmed',
          fulfillmentExecutionStatus: 'ready_to_execute',
        }),
      ],
    });
  });

  it('loads one order post-sale ops board', async () => {
    const postSaleRegistryUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-06-02T10:45:00.000Z'),
        productEntity,
        summary: {
          totalOrders: 1,
          headline: '1 order',
          detail: 'Detalle',
        },
        orders: [
          {
            orderDraftId: 'order_draft_001',
            orderLabel: 'Order draft',
            currentStatus: 'awaiting_payment',
            nextStep: 'Confirmar cobro',
            updatedAt: new Date('2026-06-02T10:45:00.000Z'),
          },
        ],
      }),
    };
    const paymentLogUseCase = {
      execute: jest.fn().mockResolvedValue({
        logStatus: 'confirmed',
      }),
    };
    const deliveryWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        deliveryStatus: 'in_progress',
        nextStep: 'Coordinar entrega.',
      }),
    };
    const useCase = new GetTenantEcommerceOrderPostSaleOpsBoardUseCase(
      postSaleRegistryUseCase as never,
      paymentLogUseCase as never,
      deliveryWorkspaceUseCase as never,
      () => new Date('2026-06-02T10:46:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'product_entity_001'),
    ).resolves.toMatchObject({
      summary: { totalOrders: 1, readyForFulfillmentCount: 1 },
      entries: [
        expect.objectContaining({
          orderDraftId: 'order_draft_001',
          opsStatus: 'ready_for_fulfillment',
          paymentLogStatus: 'confirmed',
        }),
      ],
    });
  });
});
