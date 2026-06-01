import { TenantEcommerceStorefrontReleaseCandidateBriefView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceCatalogListingAssetUseCase } from './get-tenant-ecommerce-catalog-listing-asset.use-case';
import { GetTenantEcommerceChannelReleaseWorkbenchUseCase } from './get-tenant-ecommerce-channel-release-workbench.use-case';
import { GetTenantEcommerceLandingPublishArtifactUseCase } from './get-tenant-ecommerce-landing-publish-artifact.use-case';

export class GetTenantEcommerceStorefrontReleaseCandidateBriefUseCase {
  constructor(
    private readonly getTenantEcommerceLandingPublishArtifactUseCase: GetTenantEcommerceLandingPublishArtifactUseCase,
    private readonly getTenantEcommerceCatalogListingAssetUseCase: GetTenantEcommerceCatalogListingAssetUseCase,
    private readonly getTenantEcommerceChannelReleaseWorkbenchUseCase: GetTenantEcommerceChannelReleaseWorkbenchUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceStorefrontReleaseCandidateBriefView | null> {
    const [landingArtifact, catalogListing, releaseWorkbench] =
      await Promise.all([
        this.getTenantEcommerceLandingPublishArtifactUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
        this.getTenantEcommerceCatalogListingAssetUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
        this.getTenantEcommerceChannelReleaseWorkbenchUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
      ]);

    if (!landingArtifact || !catalogListing || !releaseWorkbench) {
      return null;
    }

    const blockers = [
      ...landingArtifact.blockers,
      ...catalogListing.blockers,
      ...releaseWorkbench.channels
        .filter((channel) => channel.status === 'blocked')
        .map((channel) => `${channel.channelKey}: ${channel.blockedBy.join(', ')}`),
    ];

    const briefStatus =
      blockers.length > 0
        ? 'blocked'
        : landingArtifact.artifactStatus === 'ready_for_release_candidate' &&
            catalogListing.listingStatus === 'ready_for_storefront_listing' &&
            releaseWorkbench.channels.every(
              (channel) =>
                channel.channelKey === 'whatsapp' ||
                channel.status === 'candidate_ready',
            )
          ? 'ready_for_storefront_release_candidate'
          : 'needs_operator_revision';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: landingArtifact.productEntity,
      briefStatus,
      summary:
        briefStatus === 'ready_for_storefront_release_candidate'
          ? {
              headline:
                'El storefront ya tiene una base bastante cercana a release candidate.',
              detail:
                'Landing, catálogo y señales de release ya convergen en una salida que se puede revisar como storefront casi final.',
            }
          : briefStatus === 'blocked'
            ? {
                headline:
                  'Todavía hay bloqueos y no conviene tratar el storefront como release candidate.',
                detail:
                  'Conviene cerrar bloqueos de landing, catálogo o release antes de consolidar esta salida.',
              }
            : {
                headline:
                  'El storefront ya se puede consolidar, aunque todavía conviene una revisión operativa más.',
                detail:
                  'La base ya está alineada, pero todavía no conviene tratarla como salida casi final sin una última pasada de canal.',
              },
      landingArtifact: {
        title: landingArtifact.assetEntity.title,
        artifactStatus: landingArtifact.artifactStatus,
        primaryCta: landingArtifact.hero.primaryCta,
      },
      catalogListing: {
        title: catalogListing.card.title,
        listingStatus: catalogListing.listingStatus,
        pricingPresentation: catalogListing.card.pricingPresentation,
      },
      releaseSignals: releaseWorkbench.channels.map((channel) => ({
        channelKey: channel.channelKey,
        status:
          channel.status === 'candidate_ready'
            ? 'ready'
            : channel.status === 'needs_publish_copy'
              ? 'warning'
              : channel.status,
        detail: channel.nextMilestone,
      })),
      finalChecklist: [
        ...landingArtifact.finalChecklist.slice(0, 2),
        ...catalogListing.finalChecklist.slice(0, 2),
        ...releaseWorkbench.qaChecklist.slice(0, 2),
      ],
      blockers,
      guardrails: [
        ...landingArtifact.guardrails.slice(0, 2),
        ...catalogListing.guardrails.slice(0, 2),
        ...releaseWorkbench.guardrails.slice(0, 1),
        'No tratar este brief como publicación viva ni checkout real todavía.',
      ],
    };
  }
}
