import { TenantEcommerceStorefrontPreviewWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceCatalogCommercialCardUseCase } from './get-tenant-ecommerce-catalog-commercial-card.use-case';
import { GetTenantEcommerceChannelReleaseExecutionReadinessUseCase } from './get-tenant-ecommerce-channel-release-execution-readiness.use-case';
import { GetTenantEcommerceLandingPageStructureUseCase } from './get-tenant-ecommerce-landing-page-structure.use-case';

export class GetTenantEcommerceStorefrontPreviewWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceLandingPageStructureUseCase: GetTenantEcommerceLandingPageStructureUseCase,
    private readonly getTenantEcommerceCatalogCommercialCardUseCase: GetTenantEcommerceCatalogCommercialCardUseCase,
    private readonly getTenantEcommerceChannelReleaseExecutionReadinessUseCase: GetTenantEcommerceChannelReleaseExecutionReadinessUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceStorefrontPreviewWorkspaceView | null> {
    const [landing, catalog, readiness] = await Promise.all([
      this.getTenantEcommerceLandingPageStructureUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.getTenantEcommerceCatalogCommercialCardUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.getTenantEcommerceChannelReleaseExecutionReadinessUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!landing || !catalog || !readiness) {
      return null;
    }

    const previewStatus =
      landing.structureStatus === 'blocked' ||
      catalog.commercialStatus === 'blocked' ||
      readiness.overallStatus === 'blocked'
        ? 'blocked'
        : landing.structureStatus === 'needs_publish_copy' ||
            catalog.commercialStatus === 'needs_publish_copy' ||
            readiness.overallStatus === 'needs_channel_completion'
          ? 'needs_publish_copy'
          : 'ready_for_preview_review';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: landing.productEntity,
      previewStatus,
      summary:
        previewStatus === 'ready_for_preview_review'
          ? {
              headline: 'El storefront ya tiene suficiente forma para una revisión integrada.',
              detail:
                'Landing, card comercial y señales de release ya están alineadas para revisar la experiencia como storefront previo.',
            }
          : previewStatus === 'needs_publish_copy'
            ? {
                headline:
                  'El storefront ya se puede revisar, pero todavía conviene ajustar copy y release notes.',
                detail:
                  'La base ya existe, aunque todavía hay señales de publish copy o completion por cerrar.',
              }
            : {
                headline:
                  'Todavía hay bloqueos que hacen prematuro revisar este storefront como casi final.',
                detail:
                  'Conviene resolver bloqueos de landing, catálogo o release antes de tratar esta vista como storefront integrado.',
              },
      landingPreview: {
        headline: landing.hero.headline,
        subheadline: landing.hero.subheadline,
        primaryCta: landing.hero.primaryCta,
        proofStrip: [...landing.proofStrip],
      },
      catalogPreview: {
        title: catalog.card.title,
        shortDescription: catalog.card.shortDescription,
        pricingPresentation: catalog.card.pricingPresentation,
        primaryCta: catalog.card.primaryCta,
        offerBullets: [...catalog.offerBullets],
      },
      releaseSignals: readiness.channels.map((channel) => ({
        channelKey: channel.channelKey,
        status: channel.releaseStatus,
        detail: channel.launchWindow,
      })),
      previewChecklist: [
        ...landing.faqSeed.slice(0, 2),
        ...catalog.merchandisingHighlights.slice(0, 2),
        ...readiness.finalChecklist.slice(0, 2),
      ],
      guardrails: [
        ...landing.previewGuardrails.slice(0, 2),
        ...catalog.guardrails.slice(0, 1),
        ...readiness.guardrails.slice(0, 1),
        'No tratar este preview como storefront publicado ni flujo de checkout vivo todavía.',
      ],
    };
  }
}
