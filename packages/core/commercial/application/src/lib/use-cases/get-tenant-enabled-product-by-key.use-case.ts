import { ProductNotFoundError, ProductRepository } from '@saas-platform/catalog-application';
import { Product } from '@saas-platform/catalog-domain';
import { TenantProductAccessDeniedError } from '../errors/tenant-product-access-denied.error';
import { ListTenantEnabledProductsUseCase } from './list-tenant-enabled-products.use-case';

export class GetTenantEnabledProductByKeyUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly listTenantEnabledProductsUseCase: ListTenantEnabledProductsUseCase,
  ) {}

  async execute(tenantSlug: string, productKey: string): Promise<Product> {
    const product = await this.productRepository.findByKey(productKey);

    if (!product || !product.isActive) {
      throw new ProductNotFoundError(productKey);
    }

    const enabledProducts = await this.listTenantEnabledProductsUseCase.execute(
      tenantSlug,
    );
    const enabledProduct = enabledProducts.find(
      (currentProduct) => currentProduct.key === productKey,
    );

    if (!enabledProduct) {
      throw new TenantProductAccessDeniedError(tenantSlug, productKey);
    }

    return enabledProduct;
  }
}
