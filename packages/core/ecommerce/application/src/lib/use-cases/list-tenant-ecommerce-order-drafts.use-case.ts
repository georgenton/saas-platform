import { TenantEcommerceOrderDraftRegistryView } from '@saas-platform/ecommerce-domain';
import { EcommerceOrderDraftRepository } from '../ports/ecommerce-order-draft.repository';
import { GetTenantEcommerceProductEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-detail.use-case';

export class ListTenantEcommerceOrderDraftsUseCase {
  constructor(
    private readonly ecommerceOrderDraftRepository: EcommerceOrderDraftRepository,
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderDraftRegistryView | null> {
    const productEntityDetail =
      await this.getTenantEcommerceProductEntityDetailUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!productEntityDetail) {
      return null;
    }

    const orderDrafts =
      await this.ecommerceOrderDraftRepository.listByTenantSlugAndProductEntityId(
        tenantSlug,
        productEntityId,
      );

    const draftCount = orderDrafts.filter((entry) => entry.status === 'draft').length;
    const needsDataCount = orderDrafts.filter(
      (entry) => entry.status === 'needs_data',
    ).length;
    const readyForReviewCount = orderDrafts.filter(
      (entry) => entry.status === 'ready_for_review',
    ).length;
    const blockedCount = orderDrafts.filter(
      (entry) => entry.status === 'blocked',
    ).length;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: productEntityDetail.productEntity,
      summary: {
        totalOrderDrafts: orderDrafts.length,
        draftCount,
        needsDataCount,
        readyForReviewCount,
        blockedCount,
        headline:
          orderDrafts.length > 0
            ? 'Ya existe al menos un order draft persistido para esta product entity.'
            : 'Todavía no hay order drafts persistidos para esta product entity.',
        detail:
          orderDrafts.length > 0
            ? 'Usa este registro para retomar cierres comerciales, handoff fiscal y seguimiento conversacional sin volver al estado efímero.'
            : 'Guarda un order draft para empezar a operar cierres comerciales más reales dentro de Ecommerce.',
      },
      orderDrafts,
    };
  }
}
