import { TenantEcommerceProductEntityChannelAssetWorkspaceRegistryView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityChannelDraftRepository } from '../ports/ecommerce-product-entity-channel-draft.repository';
import { GetTenantEcommerceProductEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-detail.use-case';
import { PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase } from './promote-tenant-ecommerce-saved-product-entity-channel-draft-to-channel-asset-workspace.use-case';

export class ListTenantEcommerceProductEntityChannelAssetWorkspacesUseCase {
  constructor(
    private readonly ecommerceProductEntityChannelDraftRepository: EcommerceProductEntityChannelDraftRepository,
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly promoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase: PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceProductEntityChannelAssetWorkspaceRegistryView | null> {
    const productEntityDetail =
      await this.getTenantEcommerceProductEntityDetailUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!productEntityDetail) {
      return null;
    }

    const drafts =
      await this.ecommerceProductEntityChannelDraftRepository.listByTenantSlugAndProductEntityId(
        tenantSlug,
        productEntityId,
      );
    const promotedDrafts = drafts.filter(
      (draft) => draft.promotedToAssetWorkspaceAt,
    );
    const workspaces = promotedDrafts.map((draft) =>
      this.promoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase.toWorkspace(
        draft,
        draft.promotedToAssetWorkspaceAt!,
      ),
    );

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: productEntityDetail.productEntity,
      summary: {
        totalWorkspaces: workspaces.length,
        readyForAssetEditCount: workspaces.filter(
          (workspace) => workspace.status === 'ready_for_asset_edit',
        ).length,
        needsCoreCopyCount: workspaces.filter(
          (workspace) => workspace.status === 'needs_core_copy',
        ).length,
        blockedCount: workspaces.filter(
          (workspace) => workspace.status === 'blocked',
        ).length,
        headline:
          workspaces.length > 0
            ? 'Ya existe un registro de channel asset workspaces promovidos desde drafts persistidos.'
            : 'Todavia no hay channel asset workspaces promovidos.',
        detail:
          workspaces.length > 0
            ? 'Este registro marca el paso entre draft persistido y asset workspace operable por canal.'
            : 'Promueve un saved channel draft para abrir el primer asset workspace de canal dentro de Ecommerce.',
      },
      workspaces,
    };
  }
}
