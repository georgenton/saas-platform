import { TenantEcommerceSavedProductEntityChannelDraftDetailView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityChannelDraftRepository } from '../ports/ecommerce-product-entity-channel-draft.repository';
import { GetTenantEcommerceSavedProductEntityChannelDraftDetailUseCase } from './get-tenant-ecommerce-saved-product-entity-channel-draft-detail.use-case';

export class UpdateTenantEcommerceSavedProductEntityChannelDraftEditableSnapshotUseCase {
  constructor(
    private readonly ecommerceProductEntityChannelDraftRepository: EcommerceProductEntityChannelDraftRepository,
    private readonly getTenantEcommerceSavedProductEntityChannelDraftDetailUseCase: GetTenantEcommerceSavedProductEntityChannelDraftDetailUseCase,
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
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftDetailView | null> {
    const currentDraft =
      await this.ecommerceProductEntityChannelDraftRepository.findByTenantSlugAndProductEntityIdAndChannelKey(
        tenantSlug,
        productEntityId,
        channelKey,
      );

    if (!currentDraft) {
      return null;
    }

    const updatedDraft =
      await this.ecommerceProductEntityChannelDraftRepository.updateEditableSnapshot(
        tenantSlug,
        productEntityId,
        channelKey,
        {
          title: patch.title.trim(),
          headline: patch.headline.trim(),
          draftBlueprint: patch.draftBlueprint
            .map((entry) => entry.trim())
            .filter((entry) => entry.length > 0),
          recommendedArtifacts: patch.recommendedArtifacts
            .map((entry) => entry.trim())
            .filter((entry) => entry.length > 0),
          nextMilestone: patch.nextMilestone.trim(),
        },
      );

    if (!updatedDraft) {
      return null;
    }

    return this.getTenantEcommerceSavedProductEntityChannelDraftDetailUseCase.execute(
      tenantSlug,
      productEntityId,
      channelKey,
    );
  }
}
