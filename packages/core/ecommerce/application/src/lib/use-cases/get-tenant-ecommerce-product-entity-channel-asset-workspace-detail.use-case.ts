import { TenantEcommerceProductEntityChannelAssetWorkspaceDetailView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityChannelDraftRepository } from '../ports/ecommerce-product-entity-channel-draft.repository';
import { GetTenantEcommerceProductEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-detail.use-case';
import { PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase } from './promote-tenant-ecommerce-saved-product-entity-channel-draft-to-channel-asset-workspace.use-case';

export class GetTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase {
  constructor(
    private readonly ecommerceProductEntityChannelDraftRepository: EcommerceProductEntityChannelDraftRepository,
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly promoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase: PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ): Promise<TenantEcommerceProductEntityChannelAssetWorkspaceDetailView | null> {
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
      !savedChannelDraft.promotedToAssetWorkspaceAt
    ) {
      return null;
    }

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: productEntityDetail.productEntity,
      workspace:
        this.promoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase.toWorkspace(
          savedChannelDraft,
          savedChannelDraft.promotedToAssetWorkspaceAt,
        ),
      sourceSavedChannelDraftId: savedChannelDraft.id,
      blockedBy: [...savedChannelDraft.blockedBy],
    };
  }
}
