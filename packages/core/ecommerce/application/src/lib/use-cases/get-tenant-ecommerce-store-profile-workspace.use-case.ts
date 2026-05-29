import {
  TenantEcommerceStoreProfileWorkspaceView,
  TenantEcommerceStoreSetupWorkspaceView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantBySlugUseCase } from '@saas-platform/tenancy-application';
import { GetTenantEcommerceStoreSetupWorkspaceUseCase } from './get-tenant-ecommerce-store-setup-workspace.use-case';

export class GetTenantEcommerceStoreProfileWorkspaceUseCase {
  constructor(
    private readonly getTenantBySlugUseCase: GetTenantBySlugUseCase,
    private readonly getTenantEcommerceStoreSetupWorkspaceUseCase: GetTenantEcommerceStoreSetupWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantEcommerceStoreProfileWorkspaceView> {
    const [tenant, setupWorkspace] = await Promise.all([
      this.getTenantBySlugUseCase.execute(tenantSlug),
      this.getTenantEcommerceStoreSetupWorkspaceUseCase.execute(tenantSlug),
    ]);

    const profileReadiness = this.resolveProfileReadiness(setupWorkspace);
    const storeName = this.buildStoreName(tenant.name);
    const storefrontSlug = `${tenant.slug}-store`;
    const primaryChannel = this.resolvePrimaryChannel(setupWorkspace);

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      summary: this.buildSummary(profileReadiness, storeName, primaryChannel),
      identityDraft: {
        storeName,
        storefrontSlug,
        launchNarrative: this.buildLaunchNarrative(
          storeName,
          primaryChannel,
          setupWorkspace,
        ),
        primaryChannel,
      },
      connections: this.buildConnections(setupWorkspace),
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
    };
  }

  private resolveProfileReadiness(
    setupWorkspace: TenantEcommerceStoreSetupWorkspaceView,
  ): TenantEcommerceStoreProfileWorkspaceView['summary']['profileReadiness'] {
    if (!setupWorkspace.productSnapshot.ecommerceEnabled) {
      return 'needs_activation';
    }

    if (!setupWorkspace.productSnapshot.invoicingEnabled) {
      return 'needs_commercial_connections';
    }

    return 'draft_ready';
  }

  private buildStoreName(tenantName: string): string {
    return tenantName.endsWith(' Store') ? tenantName : `${tenantName} Store`;
  }

  private resolvePrimaryChannel(
    setupWorkspace: TenantEcommerceStoreSetupWorkspaceView,
  ): TenantEcommerceStoreProfileWorkspaceView['identityDraft']['primaryChannel'] {
    const landingCapability = setupWorkspace.capabilities.find(
      (entry) => entry.key === 'landing_readiness',
    );

    if (landingCapability?.status === 'ready') {
      return 'landing';
    }

    const catalogCapability = setupWorkspace.capabilities.find(
      (entry) => entry.key === 'catalog_authoring',
    );

    if (catalogCapability?.status === 'ready') {
      return 'catalog';
    }

    return 'whatsapp';
  }

  private buildSummary(
    profileReadiness: TenantEcommerceStoreProfileWorkspaceView['summary']['profileReadiness'],
    storeName: string,
    primaryChannel: TenantEcommerceStoreProfileWorkspaceView['identityDraft']['primaryChannel'],
  ): TenantEcommerceStoreProfileWorkspaceView['summary'] {
    if (profileReadiness === 'needs_activation') {
      return {
        tone: 'critical',
        profileReadiness,
        headline:
          'Todavia no conviene definir la identidad publica de la tienda porque Ecommerce no esta activo para este tenant.',
        detail:
          'La idea de tienda ya puede bosquejarse, pero primero hace falta abrir la base real del producto antes de hablar de storefront o canal comercial.',
        suggestedFocus:
          'Activa Ecommerce y luego vuelve a bajar el perfil inicial de la tienda.',
      };
    }

    if (profileReadiness === 'needs_commercial_connections') {
      return {
        tone: 'warning',
        profileReadiness,
        headline: `${storeName} ya puede perfilarse como tienda, aunque todavia conviene cerrar conexiones comerciales antes del flujo completo.`,
        detail:
          'La identidad draft ya sirve para catalogo y landing, pero la historia comercial queda mas coherente cuando facturacion acompana desde el inicio.',
        suggestedFocus: `Empieza por ${primaryChannel} como canal primario y conecta facturacion antes de escalar el funnel.`,
      };
    }

    return {
      tone: 'healthy',
      profileReadiness,
      headline: `${storeName} ya tiene base suficiente para una primera identidad comercial coherente.`,
      detail:
        'La tienda todavia no esta publicada automaticamente, pero ya puede bajar una narrativa, un slug operativo y una secuencia inicial de activos comerciales.',
      suggestedFocus: `Construye primero ${primaryChannel}, catalogo ancla y handoff comercial antes de ampliar canales.`,
    };
  }

  private buildLaunchNarrative(
    storeName: string,
    primaryChannel: TenantEcommerceStoreProfileWorkspaceView['identityDraft']['primaryChannel'],
    setupWorkspace: TenantEcommerceStoreSetupWorkspaceView,
  ): string {
    if (!setupWorkspace.productSnapshot.ecommerceEnabled) {
      return `${storeName} todavia esta en fase de planning y necesita activar Ecommerce antes de prometer una tienda operativa.`;
    }

    if (!setupWorkspace.productSnapshot.invoicingEnabled) {
      return `${storeName} puede lanzar una identidad inicial y preparar ${primaryChannel}, aunque conviene conectar facturacion antes del cierre comercial completo.`;
    }

    return `${storeName} puede abrir un primer frente comercial apoyado en ${primaryChannel}, un catalogo corto y una secuencia controlada de ventas asistidas.`;
  }

  private buildConnections(
    setupWorkspace: TenantEcommerceStoreSetupWorkspaceView,
  ): TenantEcommerceStoreProfileWorkspaceView['connections'] {
    return [
      {
        key: 'ecommerce',
        title: 'Ecommerce foundation',
        status: setupWorkspace.productSnapshot.ecommerceEnabled
          ? 'ready'
          : 'blocked',
        detail: setupWorkspace.productSnapshot.ecommerceEnabled
          ? 'La base del producto ya existe para anclar una tienda real.'
          : 'Sin Ecommerce activo, el perfil de tienda sigue siendo solo una idea de planning.',
      },
      {
        key: 'invoicing',
        title: 'Invoicing connection',
        status: setupWorkspace.productSnapshot.invoicingEnabled
          ? 'ready'
          : 'warning',
        detail: setupWorkspace.productSnapshot.invoicingEnabled
          ? 'Facturacion ya puede acompanar el ciclo comercial de la tienda.'
          : 'Conviene conectar facturacion antes de tratar la tienda como circuito comercial completo.',
      },
      {
        key: 'growth',
        title: 'Growth handoff',
        status: setupWorkspace.productSnapshot.ecommerceEnabled
          ? 'warning'
          : 'blocked',
        detail: setupWorkspace.productSnapshot.ecommerceEnabled
          ? 'Growth puede actuar luego como canal de WhatsApp sales flow y seguimiento.'
          : 'Sin tienda base, Growth todavia no tiene un frente comercial claro al que conectarse.',
      },
      {
        key: 'ai_assistant',
        title: 'AI assistant',
        status: 'ready',
        detail:
          'La capa AI ya puede ayudar a bajar catalogo, landing y narrativa sobre esta identidad draft.',
      },
    ];
  }
}
