import { TenantEcommerceProductEntityChannelReleaseCandidateDetailView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityChannelDraftRepository } from '../ports/ecommerce-product-entity-channel-draft.repository';
import { GetTenantEcommerceProductEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-detail.use-case';
import { PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase } from './promote-tenant-ecommerce-product-entity-channel-asset-entity-to-release-candidate.use-case';

export class GetTenantEcommerceProductEntityChannelReleaseCandidateDetailUseCase {
  constructor(
    private readonly ecommerceProductEntityChannelDraftRepository: EcommerceProductEntityChannelDraftRepository,
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly promoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase: PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ): Promise<TenantEcommerceProductEntityChannelReleaseCandidateDetailView | null> {
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
      !savedChannelDraft.promotedToReleaseCandidateAt
    ) {
      return null;
    }

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: productEntityDetail.productEntity,
      releaseCandidate:
        this.promoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase.toReleaseCandidate(
          savedChannelDraft,
          savedChannelDraft.promotedToReleaseCandidateAt,
        ),
    };
  }
}
