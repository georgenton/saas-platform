import { TenantEcommerceSavedProductAuthoringDraftRegistryView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductDraftRepository } from '../ports/ecommerce-product-draft.repository';

export class ListTenantEcommerceSavedProductDraftsUseCase {
  constructor(
    private readonly ecommerceProductDraftRepository: EcommerceProductDraftRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantEcommerceSavedProductAuthoringDraftRegistryView> {
    const drafts =
      await this.ecommerceProductDraftRepository.listByTenantSlug(tenantSlug);

    const readyForRefinementCount = drafts.filter(
      (draft) => draft.refinementStatus === 'ready_for_refinement',
    ).length;
    const needsCommercialConnectionsCount = drafts.filter(
      (draft) =>
        draft.refinementStatus === 'needs_commercial_connections' ||
        draft.briefingStatus === 'needs_commercial_connections',
    ).length;
    const needsActivationCount = drafts.filter(
      (draft) =>
        draft.refinementStatus === 'needs_activation' ||
        draft.briefingStatus === 'needs_activation',
    ).length;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      summary: {
        totalSavedDrafts: drafts.length,
        readyForRefinementCount,
        needsCommercialConnectionsCount,
        needsActivationCount,
        headline:
          drafts.length > 0
            ? 'Ya existe un registro persistido de catalog candidates para esta tienda.'
            : 'Todavia no hay catalog candidates guardados para esta tienda.',
        detail:
          drafts.length > 0
            ? 'Usa este registro para retomar drafts refinados sin depender solo del starter set efimero.'
            : 'Guarda al menos un draft del starter set para empezar a construir memoria operativa de catalogo.',
      },
      drafts,
    };
  }
}
