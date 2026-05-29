import { TenantEcommerceProductEntityRegistryView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityRepository } from '../ports/ecommerce-product-entity.repository';

export class ListTenantEcommerceProductEntitiesUseCase {
  constructor(
    private readonly ecommerceProductEntityRepository: EcommerceProductEntityRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantEcommerceProductEntityRegistryView> {
    const productEntities =
      await this.ecommerceProductEntityRepository.listByTenantSlug(tenantSlug);

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      summary: {
        totalProductEntities: productEntities.length,
        draftCatalogProductCount: productEntities.filter(
          (entry) => entry.status === 'draft_catalog_product',
        ).length,
        needsChannelAssetsCount: productEntities.filter(
          (entry) => entry.status === 'needs_channel_assets',
        ).length,
        needsActivationCount: productEntities.filter(
          (entry) => entry.status === 'needs_activation',
        ).length,
        headline:
          productEntities.length > 0
            ? 'Ecommerce ya tiene entidades propias de producto dentro del catalogo operativo.'
            : 'Todavia no hay product entities persistidas.',
        detail:
          productEntities.length > 0
            ? 'Este registro marca el paso entre setup persistido y producto catalogable dentro de Ecommerce.'
            : 'Promueve un product setup para abrir la primera entidad propia de producto.',
      },
      productEntities,
    };
  }
}
