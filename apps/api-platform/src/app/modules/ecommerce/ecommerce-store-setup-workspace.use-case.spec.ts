import { GetTenantEcommerceStoreSetupWorkspaceUseCase } from '@saas-platform/ecommerce-application';

describe('Ecommerce store setup workspace use case', () => {
  it('returns a tenant-scoped store setup workspace from launch signals and enabled products', async () => {
    const getTenantEcommerceLaunchWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-28T11:00:00.000Z'),
        summary: {
          tone: 'warning',
          launchReadiness: 'launch_ready',
          headline: 'Launch ready with narrow scope',
          detail: 'Catalog, landing, and campaign can move in shadow review.',
          suggestedFocus: 'Keep the first launch intentionally small.',
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
          {
            key: 'products',
            label: 'Products',
            isCore: true,
            status: 'ready',
            detail: 'Disponible para el launch base del tenant.',
          },
          {
            key: 'checkout',
            label: 'Checkout',
            isCore: true,
            status: 'ready',
            detail: 'Disponible para el launch base del tenant.',
          },
        ],
      }),
    };
    const listTenantEnabledProductsUseCase = {
      execute: jest.fn().mockResolvedValue([
        { key: 'ecommerce' },
        { key: 'invoicing' },
      ]),
    };

    const useCase = new GetTenantEcommerceStoreSetupWorkspaceUseCase(
      getTenantEcommerceLaunchWorkspaceUseCase as never,
      listTenantEnabledProductsUseCase as never,
      () => new Date('2026-05-28T12:00:00.000Z'),
    );

    await expect(useCase.execute('saas-platform')).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T12:00:00.000Z'),
      summary: {
        tone: 'healthy',
        setupReadiness: 'ready_to_configure',
        headline:
          'La base de Ecommerce ya permite configurar la tienda inicial con un alcance pequeno pero coherente.',
        detail:
          'La plataforma todavia no publica storefront final por si sola, pero ya puede ordenar identidad, catalogo, landing y preparacion comercial.',
        suggestedFocus:
          'Define primero una tienda corta, un catalogo ancla y una landing simple antes de escalar el resto del funnel.',
      },
      productSnapshot: {
        ecommerceEnabled: true,
        invoicingEnabled: true,
        enabledProductKeys: ['ecommerce', 'invoicing'],
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
          key: 'store_identity',
          title: 'Store identity',
          status: 'ready',
          detail:
            'Ya puedes definir nombre comercial, promesa inicial y criterio de lanzamiento de la tienda.',
          nextStep:
            'Aterriza una identidad simple y una promesa comercial entendible para el primer release.',
        },
        {
          key: 'catalog_authoring',
          title: 'Catalog authoring',
          status: 'ready',
          detail:
            'La base ya permite empezar con un catalogo ancla y productos iniciales sin inventar estructura.',
          nextStep:
            'Empieza por pocos productos ancla, categorias cortas y una nomenclatura estable.',
        },
        {
          key: 'landing_readiness',
          title: 'Landing readiness',
          status: 'ready',
          detail:
            'La landing ya puede plantearse como superficie real de conversion simple.',
          nextStep:
            'Disena una landing corta con una sola promesa y CTA principal.',
        },
        {
          key: 'invoicing_connection',
          title: 'Invoicing connection',
          status: 'ready',
          detail:
            'Facturacion ya acompana la base de tienda y habilita una historia comercial mas completa.',
          nextStep:
            'Usa facturacion como siguiente capa para pedidos, comprobantes y seguimiento comercial.',
        },
        {
          key: 'whatsapp_sales_flow',
          title: 'WhatsApp sales flow',
          status: 'warning',
          detail:
            'Ya puedes disenar el flujo de ventas por WhatsApp, aunque su operacion real sigue apoyandose en Growth y AI.',
          nextStep:
            'Usa esta base para definir el handoff posterior hacia Growth y el asistente AI.',
        },
      ],
      safeActions: [
        'Definir nombre comercial, tono y promesa inicial de la tienda antes de abrir publish real.',
        'Preparar un primer catalogo corto usando solo la base deterministica ya activa en Ecommerce.',
        'Conectar facturacion antes de automatizar promesas comerciales mas complejas.',
        'Diseñar el flujo de venta por WhatsApp como siguiente fase guiada, no como canal ya publicado.',
      ],
      blockedActions: [
        'Prometer storefront, checkout o catalogo publicados automaticamente desde este workspace.',
        'Inventar productos, variantes o precios que todavia no existen en la base operativa.',
        'Asumir integracion completa con WhatsApp como si Ecommerce ya fuera dueno del canal conversacional.',
        'Tratar este setup como reemplazo del trabajo posterior de catalogo, landing y ventas.',
      ],
    });

    expect(
      getTenantEcommerceLaunchWorkspaceUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform');
    expect(listTenantEnabledProductsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });
});
