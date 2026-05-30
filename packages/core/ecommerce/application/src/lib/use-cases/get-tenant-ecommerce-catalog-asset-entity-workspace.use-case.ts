import { TenantEcommerceCatalogAssetEntityWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-channel-asset-entity-detail.use-case';

export class GetTenantEcommerceCatalogAssetEntityWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase: GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceCatalogAssetEntityWorkspaceView | null> {
    const detail =
      await this.getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        'catalog',
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
          ? 'ready_for_catalog_assembly'
          : assetEntity.status === 'needs_publish_copy'
            ? 'needs_publish_copy'
            : 'blocked',
      merchandisingCard: {
        title: assetEntity.title,
        pricingSnapshot:
          detail.productEntity.pricingBand ?? 'Pricing band pendiente de confirmación',
        primaryCta:
          detail.productEntity.primaryCta ?? 'Abrir ficha y validar catálogo',
      },
      offerBullets: [...assetEntity.draftBlueprint],
      merchandisingChecks: [...assetEntity.publishChecklist],
      nextMilestone: assetEntity.nextMilestone,
      blockedBy: [...assetEntity.blockedBy],
      guardrails: [
        ...assetEntity.guardrails,
        'No tratar este workspace como catálogo publicado ni ficha definitiva todavía.',
      ],
    };
  }
}
