import { TenantEcommerceProductEntityChannelAssetEntityDetailView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityChannelDraftRepository } from '../ports/ecommerce-product-entity-channel-draft.repository';
import { GetTenantEcommerceProductEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-detail.use-case';
import { PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase } from './promote-tenant-ecommerce-product-entity-channel-asset-workspace-to-channel-asset-entity.use-case';

export class GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase {
  constructor(
    private readonly ecommerceProductEntityChannelDraftRepository: EcommerceProductEntityChannelDraftRepository,
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly promoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase: PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ): Promise<TenantEcommerceProductEntityChannelAssetEntityDetailView | null> {
    const [productEntityDetail, savedChannelDraft] = await Promise.all([
      this.getTenantEcommerceProductEntityDetailUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.ecommerceProductEntityChannelDraftRepository.findByTenantSlugAndProductEntityIdAndChannelKey(
        tenantSlug,
        productEntityId,
        channelKey,
      ),
    ]);

    if (
      !productEntityDetail ||
      !savedChannelDraft ||
      !savedChannelDraft.promotedToAssetEntityAt
    ) {
      return null;
    }

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: productEntityDetail.productEntity,
      assetEntity:
        this.promoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase.toAssetEntity(
          savedChannelDraft,
          savedChannelDraft.promotedToAssetEntityAt,
        ),
    };
  }
}
