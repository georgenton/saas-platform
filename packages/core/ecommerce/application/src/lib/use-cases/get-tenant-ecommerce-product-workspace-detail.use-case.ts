import {
  TenantEcommerceProductWorkspaceDetailView,
  TenantEcommerceSavedProductAuthoringDraftView,
} from '@saas-platform/ecommerce-domain';
import { EcommerceProductDraftRepository } from '../ports/ecommerce-product-draft.repository';
import { PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase } from './promote-tenant-ecommerce-saved-draft-to-product-workspace.use-case';

export class GetTenantEcommerceProductWorkspaceDetailUseCase {
  constructor(
    private readonly ecommerceProductDraftRepository: EcommerceProductDraftRepository,
    private readonly promoteTenantEcommerceSavedDraftToProductWorkspaceUseCase: PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    savedDraftId: string,
  ): Promise<TenantEcommerceProductWorkspaceDetailView | null> {
    const savedDraft =
      await this.ecommerceProductDraftRepository.findByTenantSlugAndId(
        tenantSlug,
        savedDraftId,
      );

    if (!savedDraft || !savedDraft.promotedToWorkspaceAt) {
      return null;
    }

    return this.toDetail(savedDraft, this.nowProvider());
  }

  toDetail(
    savedDraft: TenantEcommerceSavedProductAuthoringDraftView,
    generatedAt: Date,
  ): TenantEcommerceProductWorkspaceDetailView {
    return {
      tenantSlug: savedDraft.tenantSlug,
      generatedAt,
      workspace:
        this.promoteTenantEcommerceSavedDraftToProductWorkspaceUseCase.toWorkspace(
          savedDraft,
          savedDraft.promotedToWorkspaceAt ?? generatedAt,
        ),
      sourceDraftId: savedDraft.sourceDraftId,
      readiness: {
        briefingStatus: savedDraft.briefingStatus,
        refinementStatus: savedDraft.refinementStatus,
        lastSavedAt: savedDraft.updatedAt,
      },
    };
  }
}
