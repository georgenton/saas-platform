import { randomUUID } from 'node:crypto';
import { TenantEcommerceProductSetupView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductDraftRepository } from '../ports/ecommerce-product-draft.repository';
import { EcommerceProductSetupRepository } from '../ports/ecommerce-product-setup.repository';

export class PromoteTenantEcommerceProductWorkspaceToProductSetupUseCase {
  constructor(
    private readonly ecommerceProductDraftRepository: EcommerceProductDraftRepository,
    private readonly ecommerceProductSetupRepository: EcommerceProductSetupRepository,
    private readonly nowProvider: () => Date = () => new Date(),
    private readonly idProvider: () => string = () => randomUUID(),
  ) {}

  async execute(
    tenantSlug: string,
    savedDraftId: string,
  ): Promise<TenantEcommerceProductSetupView | null> {
    const savedDraft =
      await this.ecommerceProductDraftRepository.findByTenantSlugAndId(
        tenantSlug,
        savedDraftId,
      );

    if (!savedDraft || !savedDraft.promotedToWorkspaceAt) {
      return null;
    }

    const status =
      savedDraft.refinementStatus === 'needs_activation' ||
      savedDraft.briefingStatus === 'needs_activation'
        ? 'needs_activation'
        : savedDraft.refinementStatus === 'needs_commercial_connections' ||
            savedDraft.briefingStatus === 'needs_commercial_connections'
          ? 'needs_commercial_connections'
          : 'draft_setup';

    return this.ecommerceProductSetupRepository.save({
      id: this.idProvider(),
      tenantId: savedDraft.tenantId,
      tenantSlug: savedDraft.tenantSlug,
      savedDraftId: savedDraft.id,
      sourceDraftId: savedDraft.sourceDraftId,
      title: savedDraft.title,
      productType: savedDraft.productType,
      status,
      pricingBand: savedDraft.pricingBand,
      offerAngle: savedDraft.offerAngle,
      primaryCta: savedDraft.primaryCta,
      suggestedChannels: [...savedDraft.suggestedChannels],
      channelSequence: [...savedDraft.channelSequence],
      promotedFromWorkspaceAt: this.nowProvider(),
    });
  }
}
