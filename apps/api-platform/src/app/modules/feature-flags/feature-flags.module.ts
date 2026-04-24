import { Module } from '@nestjs/common';
import {
  FEATURE_FLAG_REPOSITORY,
  ListTenantFeatureFlagsUseCase,
  SetTenantFeatureFlagUseCase,
} from '@saas-platform/feature-flags-application';
import {
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
import { FeatureFlagsController } from './feature-flags.controller';

@Module({
  imports: [AuthModule, FeatureFlagsPersistenceModule, TenancyPersistenceModule],
  controllers: [FeatureFlagsController],
  providers: [
    {
      provide: ListTenantFeatureFlagsUseCase,
      inject: [TENANT_REPOSITORY, FEATURE_FLAG_REPOSITORY],
      useFactory: (tenantRepository, featureFlagRepository) =>
        new ListTenantFeatureFlagsUseCase(
          tenantRepository,
          featureFlagRepository,
        ),
    },
    {
      provide: SetTenantFeatureFlagUseCase,
      inject: [TENANT_REPOSITORY, FEATURE_FLAG_REPOSITORY],
      useFactory: (tenantRepository, featureFlagRepository) =>
        new SetTenantFeatureFlagUseCase(
          tenantRepository,
          featureFlagRepository,
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
})
export class FeatureFlagsModule {}
