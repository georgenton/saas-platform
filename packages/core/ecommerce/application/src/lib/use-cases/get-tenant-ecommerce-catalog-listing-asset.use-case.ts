import { TenantEcommerceCatalogListingAssetView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceCatalogCommercialCardUseCase } from './get-tenant-ecommerce-catalog-commercial-card.use-case';
import { RequestTenantEcommerceChannelReleaseLaunchPacketUseCase } from './request-tenant-ecommerce-channel-release-launch-packet.use-case';

export class GetTenantEcommerceCatalogListingAssetUseCase {
  constructor(
    private readonly getTenantEcommerceCatalogCommercialCardUseCase: GetTenantEcommerceCatalogCommercialCardUseCase,
    private readonly requestTenantEcommerceChannelReleaseLaunchPacketUseCase: RequestTenantEcommerceChannelReleaseLaunchPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceCatalogListingAssetView | null> {
    const [card, launchPacket] = await Promise.all([
      this.getTenantEcommerceCatalogCommercialCardUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceChannelReleaseLaunchPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!card || !launchPacket) {
      return null;
    }

    const catalogLaunch =
      launchPacket.channels.find((channel) => channel.channelKey === 'catalog') ??
      launchPacket.channels[0] ??
      null;

    const blockers = [
      ...launchPacket.blockers,
      ...(card.commercialStatus === 'blocked'
        ? ['La ficha comercial de catálogo todavía está bloqueada.']
        : []),
    ];

    const listingStatus =
      blockers.length > 0
        ? 'blocked'
        : card.commercialStatus === 'ready_for_storefront_card' &&
            launchPacket.launchStatus === 'ready_for_controlled_launch' &&
            catalogLaunch?.launchDecision === 'launch'
          ? 'ready_for_storefront_listing'
          : 'needs_operator_revision';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: card.productEntity,
      assetEntity: card.assetEntity,
      listingStatus,
      card: { ...card.card },
      offerBullets: [...card.offerBullets],
      storefrontSummary: card.storefrontSummary,
      launchOwner: launchPacket.launchOwner,
      placementNotes: [
        ...(catalogLaunch ? [catalogLaunch.launchStep, catalogLaunch.fallbackStep] : []),
        ...card.merchandisingHighlights.slice(0, 2),
      ],
      finalChecklist: [
        ...launchPacket.launchChecklist.slice(0, 2),
        'Verificar pricing, bullets y CTA antes de tratar esta ficha como listing casi final',
      ],
      blockers,
      guardrails: [
        ...card.guardrails,
        ...launchPacket.guardrails.slice(0, 2),
        'No tratar este listing como catálogo vivo ni placement definitivo todavía.',
      ],
    };
  }
}
