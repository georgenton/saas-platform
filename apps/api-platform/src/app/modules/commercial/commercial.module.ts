import { Module } from '@nestjs/common';
import {
  ChangeTenantPlanUseCase,
  ENTITLEMENT_REPOSITORY,
  GetPlanByKeyUseCase,
  GetTenantSubscriptionUseCase,
  ListPlanEntitlementsUseCase,
  ListPlansUseCase,
  ListTenantEntitlementsUseCase,
  PLAN_ENTITLEMENT_REPOSITORY,
  PLAN_REPOSITORY,
  SUBSCRIPTION_ID_GENERATOR,
  SUBSCRIPTION_REPOSITORY,
  TENANT_COMMERCIAL_PROVISIONING_REPOSITORY,
} from '@saas-platform/commercial-application';
import {
  CommercialPersistenceModule,
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
import { PlatformCommercialController } from './platform-commercial.controller';
import { TenantCommercialController } from './tenant-commercial.controller';

@Module({
  imports: [AuthModule, CommercialPersistenceModule, TenancyPersistenceModule],
  controllers: [PlatformCommercialController, TenantCommercialController],
  providers: [
    {
      provide: ListPlansUseCase,
      inject: [PLAN_REPOSITORY],
      useFactory: (planRepository) => new ListPlansUseCase(planRepository),
    },
    {
      provide: GetPlanByKeyUseCase,
      inject: [PLAN_REPOSITORY],
      useFactory: (planRepository) => new GetPlanByKeyUseCase(planRepository),
    },
    {
      provide: ListPlanEntitlementsUseCase,
      inject: [PLAN_REPOSITORY, PLAN_ENTITLEMENT_REPOSITORY],
      useFactory: (planRepository, planEntitlementRepository) =>
        new ListPlanEntitlementsUseCase(
          planRepository,
          planEntitlementRepository,
        ),
    },
    {
      provide: GetTenantSubscriptionUseCase,
      inject: [TENANT_REPOSITORY, SUBSCRIPTION_REPOSITORY],
      useFactory: (tenantRepository, subscriptionRepository) =>
        new GetTenantSubscriptionUseCase(
          tenantRepository,
          subscriptionRepository,
        ),
    },
    {
      provide: ListTenantEntitlementsUseCase,
      inject: [TENANT_REPOSITORY, ENTITLEMENT_REPOSITORY],
      useFactory: (tenantRepository, entitlementRepository) =>
        new ListTenantEntitlementsUseCase(
          tenantRepository,
          entitlementRepository,
        ),
    },
    {
      provide: ChangeTenantPlanUseCase,
      inject: [
        TENANT_REPOSITORY,
        PLAN_REPOSITORY,
        PLAN_ENTITLEMENT_REPOSITORY,
        SUBSCRIPTION_ID_GENERATOR,
        TENANT_COMMERCIAL_PROVISIONING_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        planRepository,
        planEntitlementRepository,
        subscriptionIdGenerator,
        tenantCommercialProvisioningRepository,
      ) =>
        new ChangeTenantPlanUseCase(
          tenantRepository,
          planRepository,
          planEntitlementRepository,
          subscriptionIdGenerator,
          tenantCommercialProvisioningRepository,
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
export class CommercialModule {}
