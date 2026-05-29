import {
  TenantEcommerceProductAuthoringDraftView,
  TenantEcommerceProductAuthoringWorkspaceView,
  TenantEcommerceStoreProfileWorkspaceView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceStoreProfileWorkspaceUseCase } from './get-tenant-ecommerce-store-profile-workspace.use-case';

export class GetTenantEcommerceProductAuthoringWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceStoreProfileWorkspaceUseCase: GetTenantEcommerceStoreProfileWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantEcommerceProductAuthoringWorkspaceView> {
    const profileWorkspace =
      await this.getTenantEcommerceStoreProfileWorkspaceUseCase.execute(
        tenantSlug,
      );

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      summary: this.buildSummary(profileWorkspace),
      draftCollection: {
        profileStoreName: profileWorkspace.identityDraft.storeName,
        collectionLabel: `${profileWorkspace.identityDraft.storeName} starter set`,
        primaryChannel: profileWorkspace.identityDraft.primaryChannel,
        draftCount: this.buildDrafts(profileWorkspace).length,
      },
      readinessChecklist: this.buildReadinessChecklist(profileWorkspace),
      drafts: this.buildDrafts(profileWorkspace),
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
    };
  }

  private buildSummary(
    profileWorkspace: TenantEcommerceStoreProfileWorkspaceView,
  ): TenantEcommerceProductAuthoringWorkspaceView['summary'] {
    if (profileWorkspace.summary.profileReadiness === 'needs_activation') {
      return {
        tone: 'critical',
        authoringReadiness: 'needs_activation',
        headline:
          'Todavia no conviene bajar productos de tienda porque Ecommerce no esta activo como base operativa.',
        detail:
          'Podemos pensar en categorias y promesas, pero el primer set de productos todavia necesita una tienda habilitada y con ownership claro.',
        suggestedFocus:
          'Activa Ecommerce y vuelve primero por store setup y store profile antes de authoring.',
      };
    }

    if (
      profileWorkspace.summary.profileReadiness ===
      'needs_commercial_connections'
    ) {
      return {
        tone: 'warning',
        authoringReadiness: 'needs_store_profile',
        headline:
          'Ya podemos bosquejar el starter set de productos, aunque todavia conviene cerrar conexiones comerciales antes de tratarlo como catalogo operativo.',
        detail:
          'La tienda ya tiene identidad draft y canal primario, pero facturacion y handoff comercial todavia merecen una pasada mas antes del loop completo.',
        suggestedFocus:
          'Empieza por tres productos ancla y deja pricing final o automatizacion comercial para despues.',
      };
    }

    return {
      tone: 'healthy',
      authoringReadiness: 'starter_set_ready',
      headline:
        'La tienda ya tiene suficiente contexto para bajar un primer starter set de productos.',
      detail:
        'Todavia no estamos persistiendo productos reales, pero ya podemos ordenar un set inicial consistente con la identidad, el canal y el funnel esperado.',
      suggestedFocus:
        'Construye un set corto: oferta principal, puerta de entrada y siguiente oferta natural.',
    };
  }

  private buildReadinessChecklist(
    profileWorkspace: TenantEcommerceStoreProfileWorkspaceView,
  ): TenantEcommerceProductAuthoringWorkspaceView['readinessChecklist'] {
    return [
      {
        key: 'store_profile',
        title: 'Store profile',
        status:
          profileWorkspace.summary.profileReadiness === 'needs_activation'
            ? 'blocked'
            : 'ready',
        detail:
          profileWorkspace.summary.profileReadiness === 'needs_activation'
            ? 'Todavia no hay una identidad draft confiable de tienda para anclar los productos.'
            : 'Ya existe nombre, slug y narrativa inicial para ordenar el starter set.',
      },
      {
        key: 'catalog_foundation',
        title: 'Catalog foundation',
        status:
          profileWorkspace.connections.find((entry) => entry.key === 'ecommerce')
            ?.status === 'ready'
            ? 'ready'
            : 'blocked',
        detail:
          profileWorkspace.connections.find((entry) => entry.key === 'ecommerce')
            ?.status === 'ready'
            ? 'La base de Ecommerce permite pensar los productos como parte de una tienda real.'
            : 'Sin Ecommerce listo, authoring sigue siendo solo una idea de planning.',
      },
      {
        key: 'invoicing_connection',
        title: 'Invoicing connection',
        status:
          profileWorkspace.connections.find((entry) => entry.key === 'invoicing')
            ?.status === 'ready'
            ? 'ready'
            : 'warning',
        detail:
          profileWorkspace.connections.find((entry) => entry.key === 'invoicing')
            ?.status === 'ready'
            ? 'Facturacion ya puede acompanar el catalogo despues del authoring.'
            : 'Conviene conectar facturacion antes de tomar estos drafts como catalogo comercial final.',
      },
      {
        key: 'growth_handoff',
        title: 'Growth handoff',
        status:
          profileWorkspace.connections.find((entry) => entry.key === 'growth')
            ?.status === 'blocked'
            ? 'blocked'
            : 'warning',
        detail:
          profileWorkspace.connections.find((entry) => entry.key === 'growth')
            ?.status === 'blocked'
            ? 'Todavia no hay base suficiente para conectar el starter set a ventas por WhatsApp.'
            : 'Growth puede recibir despues este starter set como base de WhatsApp sales flow.',
      },
    ];
  }

  private buildDrafts(
    profileWorkspace: TenantEcommerceStoreProfileWorkspaceView,
  ): TenantEcommerceProductAuthoringDraftView[] {
    if (profileWorkspace.summary.profileReadiness === 'needs_activation') {
      return [
        {
          id: `${profileWorkspace.tenantSlug}:draft:core-offer`,
          title: 'Core offer draft',
          productType: 'core_offer',
          status: 'blocked',
          rationale:
            'Primero hace falta activar Ecommerce y consolidar la base de tienda antes de bajar el producto principal.',
          suggestedChannels: ['catalog', 'landing'],
        },
      ];
    }

    const storeName = profileWorkspace.identityDraft.storeName;

    return [
      {
        id: `${profileWorkspace.tenantSlug}:draft:core-offer`,
        title: `${storeName} flagship offer`,
        productType: 'core_offer',
        status: 'draft',
        rationale:
          'Oferta principal para sostener la promesa comercial de la tienda y anclar la landing inicial.',
        suggestedChannels: ['catalog', 'landing'],
      },
      {
        id: `${profileWorkspace.tenantSlug}:draft:entry-offer`,
        title: `${storeName} entry offer`,
        productType: 'entry_offer',
        status: 'draft',
        rationale:
          'Oferta de entrada para bajar friccion en la primera compra o conversacion por WhatsApp.',
        suggestedChannels: ['landing', 'whatsapp'],
      },
      {
        id: `${profileWorkspace.tenantSlug}:draft:upsell`,
        title: `${storeName} follow-up offer`,
        productType: 'upsell',
        status: 'draft',
        rationale:
          'Siguiente oferta natural para ampliar ticket o preparar una secuencia comercial simple.',
        suggestedChannels: ['catalog', 'whatsapp'],
      },
    ];
  }
}
