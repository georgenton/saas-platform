import { GetTenantEcommerceProductAuthoringWorkspaceUseCase } from '@saas-platform/ecommerce-application';

describe('Ecommerce product authoring workspace use case', () => {
  it('returns a tenant-scoped starter product authoring workspace from store profile signals', async () => {
    const getTenantEcommerceStoreProfileWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T13:00:00.000Z'),
        summary: {
          tone: 'warning',
          profileReadiness: 'needs_commercial_connections',
          headline: 'Store profile is usable.',
          detail: 'Profile is ready, invoicing still pending.',
          suggestedFocus: 'Start with landing and a narrow scope.',
        },
        identityDraft: {
          storeName: 'SaaS Platform Store',
          storefrontSlug: 'saas-platform-store',
          launchNarrative: 'Draft narrative.',
          primaryChannel: 'landing',
        },
        connections: [
          {
            key: 'ecommerce',
            title: 'Ecommerce foundation',
            status: 'ready',
            detail: 'Base exists.',
          },
          {
            key: 'invoicing',
            title: 'Invoicing connection',
            status: 'warning',
            detail: 'Pending invoicing.',
          },
          {
            key: 'growth',
            title: 'Growth handoff',
            status: 'warning',
            detail: 'Can hand off later.',
          },
          {
            key: 'ai_assistant',
            title: 'AI assistant',
            status: 'ready',
            detail: 'AI is ready.',
          },
        ],
      }),
    };

    const useCase = new GetTenantEcommerceProductAuthoringWorkspaceUseCase(
      getTenantEcommerceStoreProfileWorkspaceUseCase as never,
      () => new Date('2026-05-28T14:00:00.000Z'),
    );

    await expect(useCase.execute('saas-platform')).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T14:00:00.000Z'),
      summary: {
        tone: 'warning',
        authoringReadiness: 'needs_store_profile',
        headline:
          'Ya podemos bosquejar el starter set de productos, aunque todavia conviene cerrar conexiones comerciales antes de tratarlo como catalogo operativo.',
        detail:
          'La tienda ya tiene identidad draft y canal primario, pero facturacion y handoff comercial todavia merecen una pasada mas antes del loop completo.',
        suggestedFocus:
          'Empieza por tres productos ancla y deja pricing final o automatizacion comercial para despues.',
      },
      draftCollection: {
        profileStoreName: 'SaaS Platform Store',
        collectionLabel: 'SaaS Platform Store starter set',
        primaryChannel: 'landing',
        draftCount: 3,
      },
      readinessChecklist: [
        {
          key: 'store_profile',
          title: 'Store profile',
          status: 'ready',
          detail:
            'Ya existe nombre, slug y narrativa inicial para ordenar el starter set.',
        },
        {
          key: 'catalog_foundation',
          title: 'Catalog foundation',
          status: 'ready',
          detail:
            'La base de Ecommerce permite pensar los productos como parte de una tienda real.',
        },
        {
          key: 'invoicing_connection',
          title: 'Invoicing connection',
          status: 'warning',
          detail:
            'Conviene conectar facturacion antes de tomar estos drafts como catalogo comercial final.',
        },
        {
          key: 'growth_handoff',
          title: 'Growth handoff',
          status: 'warning',
          detail:
            'Growth puede recibir despues este starter set como base de WhatsApp sales flow.',
        },
      ],
      drafts: [
        {
          id: 'saas-platform:draft:core-offer',
          title: 'SaaS Platform Store flagship offer',
          productType: 'core_offer',
          status: 'draft',
          rationale:
            'Oferta principal para sostener la promesa comercial de la tienda y anclar la landing inicial.',
          suggestedChannels: ['catalog', 'landing'],
        },
        {
          id: 'saas-platform:draft:entry-offer',
          title: 'SaaS Platform Store entry offer',
          productType: 'entry_offer',
          status: 'draft',
          rationale:
            'Oferta de entrada para bajar friccion en la primera compra o conversacion por WhatsApp.',
          suggestedChannels: ['landing', 'whatsapp'],
        },
        {
          id: 'saas-platform:draft:upsell',
          title: 'SaaS Platform Store follow-up offer',
          productType: 'upsell',
          status: 'draft',
          rationale:
            'Siguiente oferta natural para ampliar ticket o preparar una secuencia comercial simple.',
          suggestedChannels: ['catalog', 'whatsapp'],
        },
      ],
      safeActions: [
        'Usar estos drafts como base para catalogo inicial, landing y narrativa comercial.',
        'Mantener el primer set corto y enfocado antes de abrir variantes o promociones.',
        'Bajar cada draft con apoyo del asistente AI sin convertirlo todavia en producto publicado.',
      ],
      blockedActions: [
        'Tratar estos drafts como si ya fueran SKUs persistidos del tenant.',
        'Inventar pricing final, stock o variantes completas sin una superficie de productos real.',
        'Publicar el catalogo automaticamente desde este workspace de authoring.',
      ],
    });
  });
});
