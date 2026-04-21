import { Module } from '@nestjs/common';
import {
  MEMBERSHIP_ID_GENERATOR,
  MEMBERSHIP_ROLE_REPOSITORY,
  MEMBERSHIP_REPOSITORY,
  TENANT_ACCESS_REPOSITORY,
  TENANT_ID_GENERATOR,
  TENANT_PROVISIONING_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { PrismaModule } from '../prisma.module';
import { PrismaTenantAccessRepository } from './prisma-tenant-access.repository';
import { PrismaMembershipRepository } from './prisma-membership.repository';
import { PrismaMembershipRoleRepository } from './prisma-membership-role.repository';
import { PrismaTenantProvisioningRepository } from './prisma-tenant-provisioning.repository';
import { PrismaTenantRepository } from './prisma-tenant.repository';
import { UuidMembershipIdGenerator } from './uuid-membership-id.generator';
import { UuidTenantIdGenerator } from './uuid-tenant-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaTenantRepository,
    PrismaMembershipRepository,
    PrismaMembershipRoleRepository,
    PrismaTenantAccessRepository,
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
      provide: MEMBERSHIP_ROLE_REPOSITORY,
      useExisting: PrismaMembershipRoleRepository,
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
    {
      provide: TENANT_ACCESS_REPOSITORY,
      useExisting: PrismaTenantAccessRepository,
    },
  ],
  exports: [
    TENANT_REPOSITORY,
    MEMBERSHIP_REPOSITORY,
    MEMBERSHIP_ROLE_REPOSITORY,
    TENANT_ACCESS_REPOSITORY,
    TENANT_ID_GENERATOR,
    MEMBERSHIP_ID_GENERATOR,
    TENANT_PROVISIONING_REPOSITORY,
  ],
})
export class TenancyPersistenceModule {}
