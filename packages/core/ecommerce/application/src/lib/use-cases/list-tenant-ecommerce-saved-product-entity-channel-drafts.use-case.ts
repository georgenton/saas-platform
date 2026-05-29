import { TenantEcommerceSavedProductEntityChannelDraftRegistryView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityChannelDraftRepository } from '../ports/ecommerce-product-entity-channel-draft.repository';
import { GetTenantEcommerceProductEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-detail.use-case';

export class ListTenantEcommerceSavedProductEntityChannelDraftsUseCase {
  constructor(
    private readonly ecommerceProductEntityChannelDraftRepository: EcommerceProductEntityChannelDraftRepository,
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftRegistryView | null> {
    const productEntity =
      await this.getTenantEcommerceProductEntityDetailUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!productEntity) {
      return null;
    }

    const drafts =
      await this.ecommerceProductEntityChannelDraftRepository.listByTenantSlugAndProductEntityId(
        tenantSlug,
        productEntityId,
      );

    const readyToStageCount = drafts.filter(
      (draft) => draft.preparationStatus === 'ready_to_stage',
    ).length;
    const needsCoreCopyCount = drafts.filter(
      (draft) => draft.preparationStatus === 'needs_core_copy',
    ).length;
    const blockedCount = drafts.filter(
      (draft) => draft.preparationStatus === 'blocked',
    ).length;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: productEntity.productEntity,
      summary: {
        totalSavedDrafts: drafts.length,
        readyToStageCount,
        needsCoreCopyCount,
        blockedCount,
        headline:
          drafts.length > 0
            ? 'Ya existe un registro persistido de channel drafts para esta product entity.'
            : 'Todavia no hay channel drafts persistidos para esta product entity.',
        detail:
          drafts.length > 0
            ? 'Usa este registro para retomar staging y preparación de landing, catálogo y WhatsApp sin volver al estado efímero.'
            : 'Guarda al menos un channel draft para empezar a construir artifacts persistidos por canal.',
      },
      drafts,
    };
  }
}
