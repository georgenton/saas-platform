import { Product } from '@saas-platform/catalog-domain';
import { ProductRepository } from '../ports/product.repository';

export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
