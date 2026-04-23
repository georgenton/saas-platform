import { Module } from '@nestjs/common';
import {
  GetProductByKeyUseCase,
  ListProductModulesUseCase,
  ListProductsUseCase,
  PLATFORM_MODULE_REPOSITORY,
  PRODUCT_REPOSITORY,
} from '@saas-platform/catalog-application';
import { CatalogPersistenceModule } from '@saas-platform/infra-prisma';
import { CatalogController } from './catalog.controller';

@Module({
  imports: [CatalogPersistenceModule],
  controllers: [CatalogController],
  providers: [
    {
      provide: ListProductsUseCase,
      inject: [PRODUCT_REPOSITORY],
      useFactory: (productRepository) =>
        new ListProductsUseCase(productRepository),
    },
    {
      provide: GetProductByKeyUseCase,
      inject: [PRODUCT_REPOSITORY],
      useFactory: (productRepository) =>
        new GetProductByKeyUseCase(productRepository),
    },
    {
      provide: ListProductModulesUseCase,
      inject: [PRODUCT_REPOSITORY, PLATFORM_MODULE_REPOSITORY],
      useFactory: (productRepository, platformModuleRepository) =>
        new ListProductModulesUseCase(
          productRepository,
          platformModuleRepository,
        ),
    },
  ],
})
export class CatalogModule {}
