import { TenantEcommerceCatalogCommercialCardView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceCatalogAssetEntityWorkspaceUseCase } from './get-tenant-ecommerce-catalog-asset-entity-workspace.use-case';

export class GetTenantEcommerceCatalogCommercialCardUseCase {
  constructor(
    private readonly getTenantEcommerceCatalogAssetEntityWorkspaceUseCase: GetTenantEcommerceCatalogAssetEntityWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceCatalogCommercialCardView | null> {
    const workspace =
      await this.getTenantEcommerceCatalogAssetEntityWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!workspace) {
      return null;
    }

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: workspace.productEntity,
      assetEntity: workspace.assetEntity,
      commercialStatus:
        workspace.workspaceStatus === 'ready_for_catalog_assembly'
          ? 'ready_for_storefront_card'
          : workspace.workspaceStatus === 'needs_publish_copy'
            ? 'needs_publish_copy'
            : 'blocked',
      card: {
        title: workspace.merchandisingCard.title,
        shortDescription: workspace.assetEntity.headline,
        pricingPresentation: workspace.merchandisingCard.pricingSnapshot,
        primaryCta: workspace.merchandisingCard.primaryCta,
      },
      offerBullets: [...workspace.offerBullets],
      storefrontSummary:
        workspace.workspaceStatus === 'ready_for_catalog_assembly'
          ? 'La ficha comercial ya tiene suficiente estructura para convertirse en una card visible de storefront.'
          : workspace.workspaceStatus === 'needs_publish_copy'
            ? 'La card comercial ya existe, pero todavía conviene ajustar copy antes de tratarla como storefront casi final.'
            : 'La card comercial sigue bloqueada y no conviene tratarla como storefront todavía.',
      merchandisingHighlights: [
        ...workspace.merchandisingChecks.slice(0, 2),
        workspace.nextMilestone,
      ],
      guardrails: [
        ...workspace.guardrails,
        'No tratar esta card como storefront publicado ni ficha definitiva todavía.',
      ],
    };
  }
}
