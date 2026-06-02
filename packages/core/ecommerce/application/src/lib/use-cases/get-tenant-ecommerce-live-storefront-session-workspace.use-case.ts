import { TenantEcommerceLiveStorefrontSessionWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceCatalogListingAssetUseCase } from './get-tenant-ecommerce-catalog-listing-asset.use-case';
import { GetTenantEcommerceLandingPublishArtifactUseCase } from './get-tenant-ecommerce-landing-publish-artifact.use-case';
import { GetTenantEcommerceStorefrontGoLiveManifestUseCase } from './get-tenant-ecommerce-storefront-go-live-manifest.use-case';
import { RequestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase } from './request-tenant-ecommerce-whatsapp-growth-operator-launch-packet.use-case';

export class GetTenantEcommerceLiveStorefrontSessionWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceStorefrontGoLiveManifestUseCase: GetTenantEcommerceStorefrontGoLiveManifestUseCase,
    private readonly getTenantEcommerceLandingPublishArtifactUseCase: GetTenantEcommerceLandingPublishArtifactUseCase,
    private readonly getTenantEcommerceCatalogListingAssetUseCase: GetTenantEcommerceCatalogListingAssetUseCase,
    private readonly requestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase: RequestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceLiveStorefrontSessionWorkspaceView | null> {
    const [manifest, landingArtifact, catalogListing, whatsappLaunch] =
      await Promise.all([
        this.getTenantEcommerceStorefrontGoLiveManifestUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
        this.getTenantEcommerceLandingPublishArtifactUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
        this.getTenantEcommerceCatalogListingAssetUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
        this.requestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
      ]);

    if (!manifest || !landingArtifact || !catalogListing || !whatsappLaunch) {
      return null;
    }

    const channelSessions = [
      {
        channelKey: 'landing' as const,
        status:
          landingArtifact.artifactStatus === 'ready_for_release_candidate'
            ? 'ready'
            : landingArtifact.artifactStatus === 'blocked'
              ? 'blocked'
              : 'warning',
        role: 'Storefront hero',
        detail: landingArtifact.summary.detail,
      },
      {
        channelKey: 'catalog' as const,
        status:
          catalogListing.listingStatus === 'ready_for_storefront_listing'
            ? 'ready'
            : catalogListing.listingStatus === 'blocked'
              ? 'blocked'
              : 'warning',
        role: 'Commercial listing card',
        detail: catalogListing.storefrontSummary,
      },
      {
        channelKey: 'whatsapp' as const,
        status:
          whatsappLaunch.launchStatus === 'ready_for_growth_operator_launch'
            ? 'ready'
            : whatsappLaunch.launchStatus === 'blocked'
              ? 'blocked'
              : 'warning',
        role: 'Closing channel',
        detail: whatsappLaunch.summary,
      },
    ] satisfies TenantEcommerceLiveStorefrontSessionWorkspaceView['channelSessions'];

    const blockedBy = [
      ...manifest.blockers,
      ...channelSessions
        .filter((entry) => entry.status === 'blocked')
        .map(
          (entry) =>
            `${entry.channelKey} todavía no está listo para una sesión viva de storefront.`,
        ),
    ];

    const sessionStatus =
      blockedBy.length > 0
        ? 'blocked'
        : manifest.manifestStatus === 'ready_for_controlled_go_live' &&
            channelSessions.every((entry) => entry.status === 'ready')
          ? 'ready'
          : 'preview';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: manifest.productEntity,
      sessionStatus,
      summary:
        sessionStatus === 'ready'
          ? {
              headline:
                'La tienda ya tiene una sesión viva razonable para operar un go-live controlado.',
              detail:
                'Landing, catálogo, CTA y canal de cierre ya se pueden leer como una sola experiencia comercial.',
            }
          : sessionStatus === 'blocked'
            ? {
                headline:
                  'Todavía hay bloqueos y no conviene tratar esta sesión como storefront listo para venta.',
                detail:
                  'Conviene resolver blockers de canales o release antes de simular una experiencia viva de la tienda.',
              }
            : {
                headline:
                  'La tienda ya se puede leer como sesión viva, aunque todavía conviene operarla en modo preview.',
                detail:
                  'El storefront ya tiene narrativa y cierre, pero todavía conviene revisar salida, captura y handoff fiscal.',
              },
      storefrontSnapshot: {
        landingHeadline: landingArtifact.hero.headline,
        landingSubheadline: landingArtifact.hero.subheadline,
        primaryCta: landingArtifact.ctaBand.primaryCta,
        catalogTitle: catalogListing.card.title,
        pricingPresentation: catalogListing.card.pricingPresentation,
        closeChannel: whatsappLaunch.targetWorkspace.channel,
      },
      releaseGate: {
        goLiveStatus: manifest.manifestStatus,
        checkoutStatus: manifest.orderReadiness.checkoutStatus,
        invoicingStatus: manifest.orderReadiness.invoicingStatus,
      },
      channelSessions,
      sessionChecklist: [
        ...manifest.finalChecklist.slice(0, 2),
        ...catalogListing.finalChecklist.slice(0, 1),
        ...whatsappLaunch.launchChecklist.slice(0, 1),
      ],
      blockedBy,
      guardrails: [
        ...manifest.guardrails.slice(0, 2),
        ...landingArtifact.guardrails.slice(0, 1),
        ...catalogListing.guardrails.slice(0, 1),
        'No tratar esta sesión como storefront publicado ni checkout real todavía.',
      ],
    };
  }
}
