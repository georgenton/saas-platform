import { Module } from '@nestjs/common';
import {
  INVITATION_ACCEPTANCE_REPOSITORY,
  INVITATION_ID_GENERATOR,
  INVITATION_REPOSITORY,
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
import { PrismaInvitationAcceptanceRepository } from './prisma-invitation-acceptance.repository';
import { PrismaInvitationRepository } from './prisma-invitation.repository';
import { PrismaMembershipRepository } from './prisma-membership.repository';
import { PrismaMembershipRoleRepository } from './prisma-membership-role.repository';
import { PrismaTenantProvisioningRepository } from './prisma-tenant-provisioning.repository';
import { PrismaTenantRepository } from './prisma-tenant.repository';
import { UuidInvitationIdGenerator } from './uuid-invitation-id.generator';
import { UuidMembershipIdGenerator } from './uuid-membership-id.generator';
import { UuidTenantIdGenerator } from './uuid-tenant-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaTenantRepository,
    PrismaInvitationRepository,
    PrismaInvitationAcceptanceRepository,
    PrismaMembershipRepository,
    PrismaMembershipRoleRepository,
    PrismaTenantAccessRepository,
    PrismaTenantProvisioningRepository,
    UuidTenantIdGenerator,
    UuidMembershipIdGenerator,
    UuidInvitationIdGenerator,
    {
      provide: TENANT_REPOSITORY,
      useExisting: PrismaTenantRepository,
    },
    {
      provide: MEMBERSHIP_REPOSITORY,
      useExisting: PrismaMembershipRepository,
    },
    {
      provide: INVITATION_REPOSITORY,
      useExisting: PrismaInvitationRepository,
    },
    {
      provide: INVITATION_ACCEPTANCE_REPOSITORY,
      useExisting: PrismaInvitationAcceptanceRepository,
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
      provide: INVITATION_ID_GENERATOR,
      useExisting: UuidInvitationIdGenerator,
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
    INVITATION_REPOSITORY,
    INVITATION_ACCEPTANCE_REPOSITORY,
    MEMBERSHIP_ROLE_REPOSITORY,
    TENANT_ACCESS_REPOSITORY,
    TENANT_ID_GENERATOR,
    MEMBERSHIP_ID_GENERATOR,
    INVITATION_ID_GENERATOR,
    TENANT_PROVISIONING_REPOSITORY,
  ],
})
export class TenancyPersistenceModule {}
