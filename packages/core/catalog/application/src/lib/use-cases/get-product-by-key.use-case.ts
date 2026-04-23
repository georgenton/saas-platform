import { Product } from '@saas-platform/catalog-domain';
import { ProductNotFoundError } from '../errors/product-not-found.error';
import { ProductRepository } from '../ports/product.repository';

export class GetProductByKeyUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(productKey: string): Promise<Product> {
    const product = await this.productRepository.findByKey(productKey);

    if (!product) {
      throw new ProductNotFoundError(productKey);
    }

    return product;
  }
}
