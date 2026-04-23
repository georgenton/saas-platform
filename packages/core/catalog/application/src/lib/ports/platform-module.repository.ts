import { PlatformModule } from '@saas-platform/catalog-domain';

export interface PlatformModuleRepository {
  findByProductId(productId: string): Promise<PlatformModule[]>;
}
