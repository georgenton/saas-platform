import { TenantEcommerceLandingPageStructureView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceLandingAssetEntityWorkspaceUseCase } from './get-tenant-ecommerce-landing-asset-entity-workspace.use-case';

export class GetTenantEcommerceLandingPageStructureUseCase {
  constructor(
    private readonly getTenantEcommerceLandingAssetEntityWorkspaceUseCase: GetTenantEcommerceLandingAssetEntityWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceLandingPageStructureView | null> {
    const workspace =
      await this.getTenantEcommerceLandingAssetEntityWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!workspace) {
      return null;
    }

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: workspace.productEntity,
      assetEntity: workspace.assetEntity,
      structureStatus:
        workspace.workspaceStatus === 'ready_for_landing_assembly'
          ? 'ready_for_preview'
          : workspace.workspaceStatus === 'needs_publish_copy'
            ? 'needs_publish_copy'
            : 'blocked',
      hero: { ...workspace.hero },
      proofStrip: [...workspace.proofBlocks],
      offerStack: workspace.offerSections.map((section, index) => ({
        title: `Offer block ${index + 1}`,
        detail: section,
      })),
      ctaBand: {
        primaryCta: workspace.hero.primaryCta,
        supportLabel: 'Resolver objeciones y reforzar promesa antes de publish',
      },
      faqSeed: [
        '¿Qué problema principal resuelve esta oferta?',
        '¿Cómo se activa o implementa?',
        '¿Qué resultado se puede esperar en el primer tramo?',
      ],
      previewGuardrails: [
        ...workspace.guardrails,
        'No tratar esta estructura como landing publicada ni checkout vivo todavía.',
      ],
    };
  }
}
