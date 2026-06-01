import { TenantEcommerceCatalogMerchandisingPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceCatalogCommercialCardUseCase } from './get-tenant-ecommerce-catalog-commercial-card.use-case';
import { RequestTenantEcommerceCatalogStorefrontPlacementPacketUseCase } from './request-tenant-ecommerce-catalog-storefront-placement-packet.use-case';
import { RequestTenantEcommerceChannelReleaseLaunchPacketUseCase } from './request-tenant-ecommerce-channel-release-launch-packet.use-case';

export class RequestTenantEcommerceCatalogMerchandisingPacketUseCase {
  constructor(
    private readonly getTenantEcommerceCatalogCommercialCardUseCase: GetTenantEcommerceCatalogCommercialCardUseCase,
    private readonly requestTenantEcommerceCatalogStorefrontPlacementPacketUseCase: RequestTenantEcommerceCatalogStorefrontPlacementPacketUseCase,
    private readonly requestTenantEcommerceChannelReleaseLaunchPacketUseCase: RequestTenantEcommerceChannelReleaseLaunchPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceCatalogMerchandisingPacketView | null> {
    const [commercialCard, placementPacket, launchPacket] = await Promise.all([
      this.getTenantEcommerceCatalogCommercialCardUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceCatalogStorefrontPlacementPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceChannelReleaseLaunchPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!commercialCard || !placementPacket || !launchPacket) {
      return null;
    }

    const catalogLaunch =
      launchPacket.channels.find((channel) => channel.channelKey === 'catalog') ??
      launchPacket.channels[0] ??
      null;

    const blockers = [
      ...(commercialCard.commercialStatus === 'blocked'
        ? ['La commercial card de catálogo todavía está bloqueada.']
        : []),
      ...placementPacket.blockers,
      ...launchPacket.blockers,
    ];

    const merchandisingStatus =
      blockers.length > 0
        ? 'blocked'
        : commercialCard.commercialStatus === 'ready_for_storefront_card' &&
            placementPacket.placementStatus === 'ready_for_storefront_placement' &&
            catalogLaunch?.launchDecision === 'launch'
          ? 'ready_for_merchandising_review'
          : 'needs_operator_revision';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: placementPacket.productEntity,
      assetEntity: placementPacket.assetEntity,
      merchandisingStatus,
      card: { ...commercialCard.card },
      merchandisingSummary:
        merchandisingStatus === 'ready_for_merchandising_review'
          ? 'La ficha de catálogo ya está bastante cerca de una revisión comercial final para storefront.'
          : merchandisingStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar esta ficha como merchandising casi final.'
            : 'La ficha ya tiene forma comercial, pero todavía conviene revisar placement y launch antes de storefront.',
      placementContext: {
        commercialStatus: commercialCard.commercialStatus,
        placementStatus: placementPacket.placementStatus,
        launchDecision: catalogLaunch?.launchDecision ?? 'review',
      },
      merchandisingNotes: [
        ...commercialCard.merchandisingHighlights.slice(0, 2),
        ...placementPacket.placementNotes.slice(0, 2),
        ...(catalogLaunch ? [catalogLaunch.launchStep] : []),
      ],
      merchandisingChecklist: [
        ...placementPacket.placementChecklist.slice(0, 2),
        ...(catalogLaunch ? [catalogLaunch.fallbackStep] : []),
        'Confirmar jerarquía visual, pricing y CTA antes de storefront controlado.',
      ],
      blockers,
      guardrails: [
        ...commercialCard.guardrails.slice(0, 2),
        ...placementPacket.guardrails.slice(0, 2),
        ...launchPacket.guardrails.slice(0, 1),
        'No tratar este merchandising packet como catálogo vivo ni storefront publicado todavía.',
      ],
    };
  }
}
