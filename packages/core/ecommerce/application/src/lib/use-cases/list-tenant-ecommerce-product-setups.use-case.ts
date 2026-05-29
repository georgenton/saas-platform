import { TenantEcommerceProductSetupRegistryView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductSetupRepository } from '../ports/ecommerce-product-setup.repository';

export class ListTenantEcommerceProductSetupsUseCase {
  constructor(
    private readonly ecommerceProductSetupRepository: EcommerceProductSetupRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantEcommerceProductSetupRegistryView> {
    const productSetups =
      await this.ecommerceProductSetupRepository.listByTenantSlug(tenantSlug);

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      summary: {
        totalProductSetups: productSetups.length,
        draftSetupCount: productSetups.filter(
          (entry) => entry.status === 'draft_setup',
        ).length,
        needsCommercialConnectionsCount: productSetups.filter(
          (entry) => entry.status === 'needs_commercial_connections',
        ).length,
        needsActivationCount: productSetups.filter(
          (entry) => entry.status === 'needs_activation',
        ).length,
        headline:
          productSetups.length > 0
            ? 'Ya existe un registro propio de product setups dentro de Ecommerce.'
            : 'Todavia no hay product setups persistidos.',
        detail:
          productSetups.length > 0
            ? 'Este registro marca el paso entre workspace editable y configuracion persistida del primer producto de tienda.'
            : 'Promueve un product workspace para abrir el primer setup persistido de producto.',
      },
      productSetups,
    };
  }
}
