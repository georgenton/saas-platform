import { TenantEcommerceProductWorkspaceRegistryView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductDraftRepository } from '../ports/ecommerce-product-draft.repository';
import { PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase } from './promote-tenant-ecommerce-saved-draft-to-product-workspace.use-case';

export class ListTenantEcommerceProductWorkspacesUseCase {
  constructor(
    private readonly ecommerceProductDraftRepository: EcommerceProductDraftRepository,
    private readonly promoteTenantEcommerceSavedDraftToProductWorkspaceUseCase: PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantEcommerceProductWorkspaceRegistryView> {
    const drafts =
      await this.ecommerceProductDraftRepository.listByTenantSlug(tenantSlug);
    const promotedDrafts = drafts.filter((draft) => draft.promotedToWorkspaceAt);
    const workspaces = promotedDrafts.map((draft) =>
      this.promoteTenantEcommerceSavedDraftToProductWorkspaceUseCase.toWorkspace(
        draft,
        draft.promotedToWorkspaceAt!,
      ),
    );

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      summary: {
        totalProductWorkspaces: workspaces.length,
        readyForCopyEditCount: workspaces.filter(
          (workspace) => workspace.status === 'ready_for_copy_edit',
        ).length,
        needsCommercialConnectionsCount: workspaces.filter(
          (workspace) => workspace.status === 'needs_commercial_connections',
        ).length,
        needsActivationCount: workspaces.filter(
          (workspace) => workspace.status === 'needs_activation',
        ).length,
        headline:
          workspaces.length > 0
            ? 'Ya existe un registro de product workspaces promovidos desde catalog candidates.'
            : 'Todavia no hay product workspaces promovidos.',
        detail:
          workspaces.length > 0
            ? 'Este registro marca el paso entre candidate persistido y authoring de producto con ownership propio.'
            : 'Promueve un catalog candidate guardado para abrir el primer workspace de producto editable.',
      },
      workspaces,
    };
  }
}
