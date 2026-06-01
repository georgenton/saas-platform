import { TenantEcommerceLandingPublishArtifactView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceLandingPageStructureUseCase } from './get-tenant-ecommerce-landing-page-structure.use-case';
import { GetTenantEcommerceStorefrontPublishReviewWorkspaceUseCase } from './get-tenant-ecommerce-storefront-publish-review-workspace.use-case';

export class GetTenantEcommerceLandingPublishArtifactUseCase {
  constructor(
    private readonly getTenantEcommerceLandingPageStructureUseCase: GetTenantEcommerceLandingPageStructureUseCase,
    private readonly getTenantEcommerceStorefrontPublishReviewWorkspaceUseCase: GetTenantEcommerceStorefrontPublishReviewWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceLandingPublishArtifactView | null> {
    const [structure, publishReview] = await Promise.all([
      this.getTenantEcommerceLandingPageStructureUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.getTenantEcommerceStorefrontPublishReviewWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!structure || !publishReview) {
      return null;
    }

    const blockers = [
      ...publishReview.blockers,
      ...(structure.structureStatus === 'blocked'
        ? ['La estructura de landing todavía está bloqueada para salida final.']
        : []),
    ];

    const artifactStatus =
      blockers.length > 0
        ? 'blocked'
        : structure.structureStatus === 'ready_for_preview' &&
            publishReview.reviewStatus === 'ready_for_publish_review'
          ? 'ready_for_release_candidate'
          : 'needs_operator_revision';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: structure.productEntity,
      assetEntity: structure.assetEntity,
      artifactStatus,
      summary:
        artifactStatus === 'ready_for_release_candidate'
          ? {
              headline:
                'La landing ya tiene forma de artifact listo para release candidate.',
              detail:
                'La estructura y el publish review ya convergen en una versión bastante cercana a salida controlada.',
            }
          : artifactStatus === 'blocked'
            ? {
                headline:
                  'Todavía hay bloqueos y no conviene tratar la landing como artifact casi publicable.',
                detail:
                  'Conviene cerrar blockers del review o de la estructura antes de empaquetar esta página como salida final.',
              }
            : {
                headline:
                  'La landing ya se puede empaquetar, aunque todavía conviene una revisión operativa más.',
                detail:
                  'La página ya tiene esqueleto claro, pero todavía no conviene tratarla como artifact final de release.',
              },
      hero: { ...structure.hero },
      proofStrip: [...structure.proofStrip],
      offerStack: structure.offerStack.map((entry) => ({ ...entry })),
      ctaBand: { ...structure.ctaBand },
      faqSeed: [...structure.faqSeed],
      finalChecklist: [
        ...publishReview.reviewChecklist.slice(0, 2),
        ...structure.previewGuardrails.slice(0, 1),
        'Verificar hero, proof y CTA como una sola narrativa antes del release candidate',
      ],
      blockers,
      guardrails: [
        ...structure.previewGuardrails,
        ...publishReview.guardrails.slice(0, 2),
        'No tratar este artifact como landing viva ni checkout publicado todavía.',
      ],
    };
  }
}
