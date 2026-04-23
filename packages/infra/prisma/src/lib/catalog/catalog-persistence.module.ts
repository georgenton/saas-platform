import { Module } from '@nestjs/common';
import {
  PLATFORM_MODULE_REPOSITORY,
  PRODUCT_REPOSITORY,
} from '@saas-platform/catalog-application';
import { PrismaModule } from '../prisma.module';
import { PrismaPlatformModuleRepository } from './prisma-platform-module.repository';
import { PrismaProductRepository } from './prisma-product.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaProductRepository,
    PrismaPlatformModuleRepository,
    {
      provide: PRODUCT_REPOSITORY,
      useExisting: PrismaProductRepository,
    },
    {
      provide: PLATFORM_MODULE_REPOSITORY,
      useExisting: PrismaPlatformModuleRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY, PLATFORM_MODULE_REPOSITORY],
})
export class CatalogPersistenceModule {}
