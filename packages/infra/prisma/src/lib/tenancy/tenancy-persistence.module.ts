import { Module } from '@nestjs/common';
import {
  MEMBERSHIP_ID_GENERATOR,
  MEMBERSHIP_REPOSITORY,
  TENANT_ID_GENERATOR,
  TENANT_PROVISIONING_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { PrismaModule } from '../prisma.module';
import { PrismaMembershipRepository } from './prisma-membership.repository';
import { PrismaTenantProvisioningRepository } from './prisma-tenant-provisioning.repository';
import { PrismaTenantRepository } from './prisma-tenant.repository';
import { UuidMembershipIdGenerator } from './uuid-membership-id.generator';
import { UuidTenantIdGenerator } from './uuid-tenant-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaTenantRepository,
    PrismaMembershipRepository,
    PrismaTenantProvisioningRepository,
    UuidTenantIdGenerator,
    UuidMembershipIdGenerator,
    {
      provide: TENANT_REPOSITORY,
      useExisting: PrismaTenantRepository,
    },
    {
      provide: MEMBERSHIP_REPOSITORY,
      useExisting: PrismaMembershipRepository,
    },
    {
      provide: TENANT_ID_GENERATOR,
      useExisting: UuidTenantIdGenerator,
    },
    {
      provide: MEMBERSHIP_ID_GENERATOR,
      useExisting: UuidMembershipIdGenerator,
    },
    {
      provide: TENANT_PROVISIONING_REPOSITORY,
      useExisting: PrismaTenantProvisioningRepository,
    },
  ],
  exports: [
    TENANT_REPOSITORY,
    MEMBERSHIP_REPOSITORY,
    TENANT_ID_GENERATOR,
    MEMBERSHIP_ID_GENERATOR,
    TENANT_PROVISIONING_REPOSITORY,
  ],
})
export class TenancyPersistenceModule {}
