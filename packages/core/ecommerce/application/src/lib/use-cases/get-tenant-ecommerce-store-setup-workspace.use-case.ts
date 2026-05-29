import { ListTenantEnabledProductsUseCase } from '@saas-platform/commercial-application';
import {
  TenantEcommerceStoreSetupCapabilityView,
  TenantEcommerceStoreSetupWorkspaceView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceLaunchWorkspaceUseCase } from './get-tenant-ecommerce-launch-workspace.use-case';

const REQUIRED_STORE_FOUNDATION_MODULE_KEYS = [
  'catalog',
  'products',
  'checkout',
] as const;

export class GetTenantEcommerceStoreSetupWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceLaunchWorkspaceUseCase: GetTenantEcommerceLaunchWorkspaceUseCase,
    private readonly listTenantEnabledProductsUseCase: ListTenantEnabledProductsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantEcommerceStoreSetupWorkspaceView> {
    const [launchWorkspace, enabledProducts] = await Promise.all([
      this.getTenantEcommerceLaunchWorkspaceUseCase.execute(tenantSlug),
      this.listTenantEnabledProductsUseCase.execute(tenantSlug),
    ]);

    const enabledProductKeys = enabledProducts.map((entry) => entry.key);
    const enabledProductKeySet = new Set(enabledProductKeys);
    const ecommerceEnabled = launchWorkspace.moduleSnapshot.productEnabled;
    const invoicingEnabled = enabledProductKeySet.has('invoicing');
    const missingFoundationModuleKeys =
      REQUIRED_STORE_FOUNDATION_MODULE_KEYS.filter((key) =>
        launchWorkspace.checklist.some(
          (entry) => entry.key === key && entry.status !== 'ready',
        ),
      );

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      summary: this.buildSummary(
        ecommerceEnabled,
        invoicingEnabled,
        missingFoundationModuleKeys,
      ),
      productSnapshot: {
        ecommerceEnabled,
        invoicingEnabled,
        enabledProductKeys,
      },
      moduleSnapshot: {
        ...launchWorkspace.moduleSnapshot,
        inactiveModuleKeys: [...launchWorkspace.moduleSnapshot.inactiveModuleKeys],
      },
      capabilities: this.buildCapabilities(
        ecommerceEnabled,
        invoicingEnabled,
        missingFoundationModuleKeys,
      ),
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
    };
  }

  private buildSummary(
    ecommerceEnabled: boolean,
    invoicingEnabled: boolean,
    missingFoundationModuleKeys: string[],
  ): TenantEcommerceStoreSetupWorkspaceView['summary'] {
    if (!ecommerceEnabled) {
      return {
        tone: 'critical',
        setupReadiness: 'needs_activation',
        headline:
          'El tenant todavia no tiene Ecommerce habilitado como base real de tienda.',
        detail:
          'Antes de crear storefront, catalogo o landing conviene activar Ecommerce para que la tienda tenga ownership claro.',
        suggestedFocus:
          'Activa Ecommerce y confirma el alcance inicial de la tienda antes de bajar catalogo o identidad comercial.',
      };
    }

    if (missingFoundationModuleKeys.length > 0) {
      return {
        tone: 'warning',
        setupReadiness: 'needs_store_foundation',
        headline:
          'La tienda puede empezar a definirse, pero la base operativa todavia no cubre todo el setup esencial.',
        detail:
          'Conviene completar primero catalogo, productos y checkout antes de tratar la tienda como superficie lista para vender.',
        suggestedFocus: `Cierra primero la base faltante del setup: ${missingFoundationModuleKeys.join(', ')}.`,
      };
    }

    if (!invoicingEnabled) {
      return {
        tone: 'warning',
        setupReadiness: 'ready_to_configure',
        headline:
          'La tienda ya tiene base suficiente para configurarse, aunque todavia conviene conectar facturacion antes del flujo comercial completo.',
        detail:
          'Puedes bajar identidad, catalogo y landing inicial, pero la operacion comercial queda mas sana cuando Invoicing acompana desde el inicio.',
        suggestedFocus:
          'Configura primero la identidad y el catalogo inicial, y luego conecta facturacion para cerrar el loop comercial.',
      };
    }

    return {
      tone: 'healthy',
      setupReadiness: 'ready_to_configure',
      headline:
        'La base de Ecommerce ya permite configurar la tienda inicial con un alcance pequeno pero coherente.',
      detail:
        'La plataforma todavia no publica storefront final por si sola, pero ya puede ordenar identidad, catalogo, landing y preparacion comercial.',
      suggestedFocus:
        'Define primero una tienda corta, un catalogo ancla y una landing simple antes de escalar el resto del funnel.',
    };
  }

  private buildCapabilities(
    ecommerceEnabled: boolean,
    invoicingEnabled: boolean,
    missingFoundationModuleKeys: string[],
  ): TenantEcommerceStoreSetupCapabilityView[] {
    const missingFoundation = new Set(missingFoundationModuleKeys);
    const foundationReady = missingFoundation.size === 0;
    const catalogReady =
      !missingFoundation.has('catalog') && !missingFoundation.has('products');
    const landingReady = !missingFoundation.has('checkout');

    return [
      {
        key: 'store_identity',
        title: 'Store identity',
        status: ecommerceEnabled ? 'ready' : 'blocked',
        detail: ecommerceEnabled
          ? 'Ya puedes definir nombre comercial, promesa inicial y criterio de lanzamiento de la tienda.'
          : 'Primero hace falta habilitar Ecommerce para que la tienda exista como superficie operativa real.',
        nextStep: ecommerceEnabled
          ? 'Aterriza una identidad simple y una promesa comercial entendible para el primer release.'
          : 'Activa Ecommerce para abrir una base de tienda con ownership claro.',
      },
      {
        key: 'catalog_authoring',
        title: 'Catalog authoring',
        status: !ecommerceEnabled
          ? 'blocked'
          : catalogReady
            ? 'ready'
            : 'blocked',
        detail: !ecommerceEnabled
          ? 'Sin Ecommerce activo, el catalogo sigue solo como planning surface.'
          : catalogReady
            ? 'La base ya permite empezar con un catalogo ancla y productos iniciales sin inventar estructura.'
            : 'Todavia faltan piezas core para bajar productos y catalogo como superficie estable.',
        nextStep: !ecommerceEnabled
          ? 'Habilita Ecommerce antes de modelar el primer catalogo.'
          : catalogReady
            ? 'Empieza por pocos productos ancla, categorias cortas y una nomenclatura estable.'
            : `Completa primero la base de catalogo y productos: ${missingFoundationModuleKeys.join(', ')}.`,
      },
      {
        key: 'landing_readiness',
        title: 'Landing readiness',
        status: !ecommerceEnabled
          ? 'blocked'
          : landingReady
            ? 'ready'
            : 'warning',
        detail: !ecommerceEnabled
          ? 'Sin tienda activa, la landing seguiria desconectada del resto de la operacion.'
          : landingReady
            ? 'La landing ya puede plantearse como superficie real de conversion simple.'
            : 'La landing puede bosquejarse, pero conviene no prometer cierre de venta final hasta completar checkout.',
        nextStep: !ecommerceEnabled
          ? 'Activa Ecommerce antes de bajar una landing con ownership real.'
          : landingReady
            ? 'Disena una landing corta con una sola promesa y CTA principal.'
            : 'Cierra primero checkout para que la landing no quede desconectada del cierre comercial.',
      },
      {
        key: 'invoicing_connection',
        title: 'Invoicing connection',
        status: !ecommerceEnabled
          ? 'blocked'
          : invoicingEnabled
            ? 'ready'
            : 'warning',
        detail: !ecommerceEnabled
          ? 'Todavia no conviene hablar de cierre comercial mientras la tienda no exista operativamente.'
          : invoicingEnabled
            ? 'Facturacion ya acompana la base de tienda y habilita una historia comercial mas completa.'
            : 'La tienda puede configurarse, pero todavia conviene conectar Invoicing antes de cerrar el loop comercial.',
        nextStep: !ecommerceEnabled
          ? 'Activa primero Ecommerce.'
          : invoicingEnabled
            ? 'Usa facturacion como siguiente capa para pedidos, comprobantes y seguimiento comercial.'
            : 'Habilita Invoicing para que la tienda no quede aislada del ciclo comercial real.',
      },
      {
        key: 'whatsapp_sales_flow',
        title: 'WhatsApp sales flow',
        status: !ecommerceEnabled
          ? 'blocked'
          : foundationReady
            ? 'warning'
            : 'blocked',
        detail: !ecommerceEnabled
          ? 'Todavia no existe una tienda operativa a la que valga la pena conectar un flujo conversacional.'
          : foundationReady
            ? 'Ya puedes disenar el flujo de ventas por WhatsApp, aunque su operacion real sigue apoyandose en Growth y AI.'
            : 'Conviene terminar primero la base de tienda antes de conectar un canal conversacional de ventas.',
        nextStep: !ecommerceEnabled
          ? 'Activa Ecommerce antes de bajar el canal conversacional.'
          : foundationReady
            ? 'Usa esta base para definir el handoff posterior hacia Growth y el asistente AI.'
            : `Completa primero la base de tienda: ${missingFoundationModuleKeys.join(', ')}.`,
      },
    ];
  }
}
