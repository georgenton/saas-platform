import { TenantEcommerceLandingAssetEntityWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-channel-asset-entity-detail.use-case';

export class GetTenantEcommerceLandingAssetEntityWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase: GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceLandingAssetEntityWorkspaceView | null> {
    const detail =
      await this.getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        'landing',
      );

    if (!detail) {
      return null;
    }

    const { assetEntity } = detail;
    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: detail.productEntity,
      assetEntity,
      workspaceStatus:
        assetEntity.status === 'draft_asset_entity'
          ? 'ready_for_landing_assembly'
          : assetEntity.status === 'needs_publish_copy'
            ? 'needs_publish_copy'
            : 'blocked',
      hero: {
        headline: assetEntity.headline,
        subheadline: assetEntity.summary,
        primaryCta:
          detail.productEntity.primaryCta ??
          'Abrir landing y validar intención comercial',
      },
      proofBlocks: [
        `${detail.productEntity.title} como oferta principal`,
        ...assetEntity.recommendedArtifacts.slice(0, 2),
      ],
      offerSections: [...assetEntity.draftBlueprint],
      publishChecklist: [...assetEntity.publishChecklist],
      nextMilestone: assetEntity.nextMilestone,
      blockedBy: [...assetEntity.blockedBy],
      guardrails: [
        ...assetEntity.guardrails,
        'No tratar este workspace como landing publicada ni checkout vivo todavía.',
      ],
    };
  }
}
