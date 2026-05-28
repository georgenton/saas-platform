import { Module } from '@nestjs/common';
import {
  PLATFORM_MODULE_REPOSITORY,
  PRODUCT_REPOSITORY,
  ListProductModulesUseCase,
} from '@saas-platform/catalog-application';
import {
  ENTITLEMENT_REPOSITORY,
  ListTenantEnabledProductsUseCase,
} from '@saas-platform/commercial-application';
import { GetTenantEcommerceLaunchWorkspaceUseCase } from '@saas-platform/ecommerce-application';
import { FEATURE_FLAG_REPOSITORY } from '@saas-platform/feature-flags-application';
import {
  CatalogPersistenceModule,
  CommercialPersistenceModule,
  FeatureFlagsPersistenceModule,
  TenancyPersistenceModule,
} from '@saas-platform/infra-prisma';
import {
  ResolveTenantAccessUseCase,
  TENANT_ACCESS_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { AuthModule } from '../auth/auth.module';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { EcommerceController } from './ecommerce.controller';

@Module({
  imports: [
    AuthModule,
    CatalogPersistenceModule,
    CommercialPersistenceModule,
    FeatureFlagsPersistenceModule,
    TenancyPersistenceModule,
  ],
  controllers: [EcommerceController],
  providers: [
    {
      provide: ListTenantEnabledProductsUseCase,
      inject: [
        TENANT_REPOSITORY,
        ENTITLEMENT_REPOSITORY,
        PRODUCT_REPOSITORY,
        FEATURE_FLAG_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        entitlementRepository,
        productRepository,
        featureFlagRepository,
      ) =>
        new ListTenantEnabledProductsUseCase(
          tenantRepository,
          entitlementRepository,
          productRepository,
          featureFlagRepository,
        ),
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
    {
      provide: GetTenantEcommerceLaunchWorkspaceUseCase,
      inject: [ListTenantEnabledProductsUseCase, ListProductModulesUseCase],
      useFactory: (
        listTenantEnabledProductsUseCase,
        listProductModulesUseCase,
      ) =>
        new GetTenantEcommerceLaunchWorkspaceUseCase(
          listTenantEnabledProductsUseCase,
          listProductModulesUseCase,
        ),
    },
    {
      provide: ResolveTenantAccessUseCase,
      inject: [TENANT_REPOSITORY, TENANT_ACCESS_REPOSITORY],
      useFactory: (tenantRepository, tenantAccessRepository) =>
        new ResolveTenantAccessUseCase(tenantRepository, tenantAccessRepository),
    },
    TenantMembershipGuard,
    TenantPermissionGuard,
  ],
  exports: [GetTenantEcommerceLaunchWorkspaceUseCase],
})
export class EcommerceModule {}
