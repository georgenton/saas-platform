import { GetTenantEcommerceStoreProfileWorkspaceUseCase } from '@saas-platform/ecommerce-application';

describe('Ecommerce store profile workspace use case', () => {
  it('returns a tenant-scoped store profile workspace from tenant identity and setup signals', async () => {
    const getTenantBySlugUseCase = {
      execute: jest.fn().mockResolvedValue({
        name: 'SaaS Platform',
        slug: 'saas-platform',
      }),
    };
    const getTenantEcommerceStoreSetupWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T12:00:00.000Z'),
        summary: {
          tone: 'warning',
          setupReadiness: 'ready_to_configure',
          headline: 'Store setup is ready to configure.',
          detail: 'Setup is usable, but invoicing is still pending.',
          suggestedFocus: 'Start with store identity and product anchors.',
        },
        productSnapshot: {
          ecommerceEnabled: true,
          invoicingEnabled: false,
          enabledProductKeys: ['ecommerce'],
        },
        moduleSnapshot: {
          productEnabled: true,
          activeModuleCount: 5,
          coreModuleCount: 5,
          optionalModuleCount: 0,
          inactiveModuleKeys: ['promotions'],
        },
        capabilities: [
          {
            key: 'landing_readiness',
            title: 'Landing readiness',
            status: 'ready',
            detail: 'Landing is ready.',
            nextStep: 'Ship a short landing.',
          },
        ],
      }),
    };

    const useCase = new GetTenantEcommerceStoreProfileWorkspaceUseCase(
      getTenantBySlugUseCase as never,
      getTenantEcommerceStoreSetupWorkspaceUseCase as never,
      () => new Date('2026-05-28T13:00:00.000Z'),
    );

    await expect(useCase.execute('saas-platform')).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T13:00:00.000Z'),
      summary: {
        tone: 'warning',
        profileReadiness: 'needs_commercial_connections',
        headline:
          'SaaS Platform Store ya puede perfilarse como tienda, aunque todavia conviene cerrar conexiones comerciales antes del flujo completo.',
        detail:
          'La identidad draft ya sirve para catalogo y landing, pero la historia comercial queda mas coherente cuando facturacion acompana desde el inicio.',
        suggestedFocus:
          'Empieza por landing como canal primario y conecta facturacion antes de escalar el funnel.',
      },
      identityDraft: {
        storeName: 'SaaS Platform Store',
        storefrontSlug: 'saas-platform-store',
        launchNarrative:
          'SaaS Platform Store puede lanzar una identidad inicial y preparar landing, aunque conviene conectar facturacion antes del cierre comercial completo.',
        primaryChannel: 'landing',
      },
      connections: [
        {
          key: 'ecommerce',
          title: 'Ecommerce foundation',
          status: 'ready',
          detail: 'La base del producto ya existe para anclar una tienda real.',
        },
        {
          key: 'invoicing',
          title: 'Invoicing connection',
          status: 'warning',
          detail:
            'Conviene conectar facturacion antes de tratar la tienda como circuito comercial completo.',
        },
        {
          key: 'growth',
          title: 'Growth handoff',
          status: 'warning',
          detail:
            'Growth puede actuar luego como canal de WhatsApp sales flow y seguimiento.',
        },
        {
          key: 'ai_assistant',
          title: 'AI assistant',
          status: 'ready',
          detail:
            'La capa AI ya puede ayudar a bajar catalogo, landing y narrativa sobre esta identidad draft.',
        },
      ],
      recommendedAssets: [
        'Store identity brief',
        'Starter catalog set',
        'Primary landing outline',
        'WhatsApp offer flow draft',
      ],
      safeActions: [
        'Refinar el nombre comercial, la promesa de valor y el canal primario antes de abrir storefront real.',
        'Usar esta identidad draft como base para catalogo, landing y asistente AI.',
        'Conectar facturacion y Growth como capas de operacion comercial despues de la identidad inicial.',
      ],
      blockedActions: [
        'Tratar este profile como si ya fuera una tienda publicada con catalogo final.',
        'Prometer automatizacion total de ventas por WhatsApp sin handoff operativo hacia Growth.',
        'Asumir que el slug draft ya esta reservado como storefront publico definitivo.',
      ],
    });
  });
});
