import { TenantEcommerceProductEntityChannelReleaseCandidateRegistryView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityChannelDraftRepository } from '../ports/ecommerce-product-entity-channel-draft.repository';
import { GetTenantEcommerceProductEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-detail.use-case';
import { PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase } from './promote-tenant-ecommerce-product-entity-channel-asset-entity-to-release-candidate.use-case';

export class ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase {
  constructor(
    private readonly ecommerceProductEntityChannelDraftRepository: EcommerceProductEntityChannelDraftRepository,
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly promoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase: PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceProductEntityChannelReleaseCandidateRegistryView | null> {
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

    const releaseCandidates = savedChannelDrafts
      .filter((entry) => entry.promotedToReleaseCandidateAt)
      .map((entry) =>
        this.promoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase.toReleaseCandidate(
          entry,
          entry.promotedToReleaseCandidateAt!,
        ),
      );

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: productEntityDetail.productEntity,
      summary: {
        totalCandidates: releaseCandidates.length,
        readyCount: releaseCandidates.filter(
          (entry) => entry.status === 'candidate_ready',
        ).length,
        needsPublishCopyCount: releaseCandidates.filter(
          (entry) => entry.status === 'needs_publish_copy',
        ).length,
        blockedCount: releaseCandidates.filter((entry) => entry.status === 'blocked')
          .length,
        headline:
          releaseCandidates.length > 0
            ? 'Ecommerce ya tiene release candidates persistidos por canal.'
            : 'Todavia no hay release candidates promovidos.',
        detail:
          releaseCandidates.length > 0
            ? 'Este registro marca el paso entre entity de asset y candidate listo para QA final.'
            : 'Promueve una entity de asset para abrir el primer release candidate del canal.',
      },
      releaseCandidates,
    };
  }
}
