import { Module } from '@nestjs/common';
import {
  ENTITLEMENT_REPOSITORY,
  PLAN_ENTITLEMENT_REPOSITORY,
  PLAN_REPOSITORY,
  SUBSCRIPTION_ID_GENERATOR,
  SUBSCRIPTION_REPOSITORY,
  TENANT_COMMERCIAL_PROVISIONING_REPOSITORY,
} from '@saas-platform/commercial-application';
import { PrismaModule } from '../prisma.module';
import { PrismaEntitlementRepository } from './prisma-entitlement.repository';
import { PrismaPlanEntitlementRepository } from './prisma-plan-entitlement.repository';
import { PrismaPlanRepository } from './prisma-plan.repository';
import { PrismaSubscriptionRepository } from './prisma-subscription.repository';
import { PrismaTenantCommercialProvisioningRepository } from './prisma-tenant-commercial-provisioning.repository';
import { UuidSubscriptionIdGenerator } from './uuid-subscription-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaEntitlementRepository,
    PrismaPlanEntitlementRepository,
    PrismaPlanRepository,
    PrismaSubscriptionRepository,
    PrismaTenantCommercialProvisioningRepository,
    UuidSubscriptionIdGenerator,
    {
      provide: PLAN_REPOSITORY,
      useExisting: PrismaPlanRepository,
    },
    {
      provide: PLAN_ENTITLEMENT_REPOSITORY,
      useExisting: PrismaPlanEntitlementRepository,
    },
    {
      provide: SUBSCRIPTION_REPOSITORY,
      useExisting: PrismaSubscriptionRepository,
    },
    {
      provide: ENTITLEMENT_REPOSITORY,
      useExisting: PrismaEntitlementRepository,
    },
    {
      provide: SUBSCRIPTION_ID_GENERATOR,
      useExisting: UuidSubscriptionIdGenerator,
    },
    {
      provide: TENANT_COMMERCIAL_PROVISIONING_REPOSITORY,
      useExisting: PrismaTenantCommercialProvisioningRepository,
    },
  ],
  exports: [
    PLAN_REPOSITORY,
    PLAN_ENTITLEMENT_REPOSITORY,
    SUBSCRIPTION_REPOSITORY,
    ENTITLEMENT_REPOSITORY,
    SUBSCRIPTION_ID_GENERATOR,
    TENANT_COMMERCIAL_PROVISIONING_REPOSITORY,
  ],
})
export class CommercialPersistenceModule {}
