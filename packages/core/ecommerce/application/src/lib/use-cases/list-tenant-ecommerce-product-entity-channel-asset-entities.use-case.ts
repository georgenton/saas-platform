import { TenantEcommerceProductEntityChannelAssetEntityRegistryView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityChannelDraftRepository } from '../ports/ecommerce-product-entity-channel-draft.repository';
import { GetTenantEcommerceProductEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-detail.use-case';
import { PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase } from './promote-tenant-ecommerce-product-entity-channel-asset-workspace-to-channel-asset-entity.use-case';

export class ListTenantEcommerceProductEntityChannelAssetEntitiesUseCase {
  constructor(
    private readonly ecommerceProductEntityChannelDraftRepository: EcommerceProductEntityChannelDraftRepository,
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly promoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase: PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceProductEntityChannelAssetEntityRegistryView | null> {
    const [productEntityDetail, savedChannelDrafts] = await Promise.all([
      this.getTenantEcommerceProductEntityDetailUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.ecommerceProductEntityChannelDraftRepository.listByTenantSlugAndProductEntityId(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!productEntityDetail) {
      return null;
    }

    const assetEntities = savedChannelDrafts
      .filter((entry) => entry.promotedToAssetEntityAt)
      .map((entry) =>
        this.promoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase.toAssetEntity(
          entry,
          entry.promotedToAssetEntityAt!,
        ),
      );

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: productEntityDetail.productEntity,
      summary: {
        totalAssetEntities: assetEntities.length,
        draftAssetEntityCount: assetEntities.filter(
          (entry) => entry.status === 'draft_asset_entity',
        ).length,
        needsPublishCopyCount: assetEntities.filter(
          (entry) => entry.status === 'needs_publish_copy',
        ).length,
        blockedCount: assetEntities.filter((entry) => entry.status === 'blocked')
          .length,
        headline:
          assetEntities.length > 0
            ? 'Ecommerce ya tiene entities persistidas de assets por canal.'
            : 'Todavia no hay channel asset entities promovidas.',
        detail:
          assetEntities.length > 0
            ? 'Este registro marca el paso entre workspace de asset y artifact persistido operable por canal.'
            : 'Promueve un channel asset workspace para abrir la primera entity persistida del asset.',
      },
      assetEntities,
    };
  }
}
