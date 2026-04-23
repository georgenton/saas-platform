import { PlatformModule } from '@saas-platform/catalog-domain';
import { ProductNotFoundError } from '../errors/product-not-found.error';
import { PlatformModuleRepository } from '../ports/platform-module.repository';
import { ProductRepository } from '../ports/product.repository';

export class ListProductModulesUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly platformModuleRepository: PlatformModuleRepository,
  ) {}

  async execute(productKey: string): Promise<PlatformModule[]> {
    const product = await this.productRepository.findByKey(productKey);

    if (!product) {
      throw new ProductNotFoundError(productKey);
    }

    return this.platformModuleRepository.findByProductId(product.id);
  }
}
