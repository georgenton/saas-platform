import { TenantEcommerceProductEntityChannelAssetEntityDetailView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityChannelDraftRepository } from '../ports/ecommerce-product-entity-channel-draft.repository';
import { GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-channel-asset-entity-detail.use-case';

export class UpdateTenantEcommerceProductEntityChannelAssetEntityEditableSnapshotUseCase {
  constructor(
    private readonly ecommerceProductEntityChannelDraftRepository: EcommerceProductEntityChannelDraftRepository,
    private readonly getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase: GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
    patch: {
      title: string;
      headline: string;
      draftBlueprint: string[];
      recommendedArtifacts: string[];
      nextMilestone: string;
    },
  ): Promise<TenantEcommerceProductEntityChannelAssetEntityDetailView | null> {
    await this.ecommerceProductEntityChannelDraftRepository.updateEditableSnapshot(
      tenantSlug,
      productEntityId,
      channelKey,
      {
        title: patch.title.trim(),
        headline: patch.headline.trim(),
        draftBlueprint: patch.draftBlueprint.map((entry) => entry.trim()).filter(Boolean),
        recommendedArtifacts: patch.recommendedArtifacts
          .map((entry) => entry.trim())
          .filter(Boolean),
        nextMilestone: patch.nextMilestone.trim(),
      },
    );

    return this.getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase.execute(
      tenantSlug,
      productEntityId,
      channelKey,
    );
  }
}
