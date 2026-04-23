import { Product } from '@saas-platform/catalog-domain';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findByKey(key: string): Promise<Product | null>;
}
