import { TenantEcommerceProductWorkspaceDetailView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductDraftRepository } from '../ports/ecommerce-product-draft.repository';
import { GetTenantEcommerceProductWorkspaceDetailUseCase } from './get-tenant-ecommerce-product-workspace-detail.use-case';

export class UpdateTenantEcommerceProductWorkspaceEditableSnapshotUseCase {
  constructor(
    private readonly ecommerceProductDraftRepository: EcommerceProductDraftRepository,
    private readonly getTenantEcommerceProductWorkspaceDetailUseCase: GetTenantEcommerceProductWorkspaceDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    savedDraftId: string,
    patch: {
      title: string;
      pricingBand: string | null;
      offerAngle: string | null;
      primaryCta: string | null;
      channelSequence: string[];
    },
  ): Promise<TenantEcommerceProductWorkspaceDetailView | null> {
    const currentDraft =
      await this.ecommerceProductDraftRepository.findByTenantSlugAndId(
        tenantSlug,
        savedDraftId,
      );

    if (!currentDraft || !currentDraft.promotedToWorkspaceAt) {
      return null;
    }

    const updatedDraft =
      await this.ecommerceProductDraftRepository.updateEditableSnapshot(
        tenantSlug,
        savedDraftId,
        {
          title: patch.title.trim(),
          pricingBand: this.normalizeNullableText(patch.pricingBand),
          offerAngle: this.normalizeNullableText(patch.offerAngle),
          primaryCta: this.normalizeNullableText(patch.primaryCta),
          channelSequence: patch.channelSequence
            .map((entry) => entry.trim())
            .filter((entry) => entry.length > 0),
        },
      );

    if (!updatedDraft) {
      return null;
    }

    return this.getTenantEcommerceProductWorkspaceDetailUseCase.toDetail(
      updatedDraft,
      this.nowProvider(),
    );
  }

  private normalizeNullableText(value: string | null): string | null {
    if (value === null) {
      return null;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }
}
