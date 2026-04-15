import { Module } from '@nestjs/common';
import {
  CreateTenantUseCase,
  GetTenantBySlugUseCase,
  GetTenantMembershipByUserUseCase,
  ListTenantMembershipsUseCase,
  MEMBERSHIP_ID_GENERATOR,
  MEMBERSHIP_REPOSITORY,
  ResolveTenantAccessUseCase,
  TENANT_ID_GENERATOR,
  TENANT_PROVISIONING_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { TenancyPersistenceModule } from '@saas-platform/infra-prisma';
import { TenantMembershipGuard } from './tenant-membership.guard';
import { TenantRoleGuard } from './tenant-role.guard';
import { TenancyController } from './tenancy.controller';

@Module({
  imports: [TenancyPersistenceModule],
  controllers: [TenancyController],
  providers: [
    {
      provide: GetTenantBySlugUseCase,
      inject: [TENANT_REPOSITORY],
      useFactory: (tenantRepository) =>
        new GetTenantBySlugUseCase(tenantRepository),
    },
    {
      provide: ListTenantMembershipsUseCase,
      inject: [TENANT_REPOSITORY, MEMBERSHIP_REPOSITORY],
      useFactory: (tenantRepository, membershipRepository) =>
        new ListTenantMembershipsUseCase(
          tenantRepository,
          membershipRepository,
        ),
    },
    {
      provide: GetTenantMembershipByUserUseCase,
      inject: [TENANT_REPOSITORY, MEMBERSHIP_REPOSITORY],
      useFactory: (tenantRepository, membershipRepository) =>
        new GetTenantMembershipByUserUseCase(
          tenantRepository,
          membershipRepository,
        ),
    },
    {
      provide: ResolveTenantAccessUseCase,
      inject: [TENANT_REPOSITORY, MEMBERSHIP_REPOSITORY],
      useFactory: (tenantRepository, membershipRepository) =>
        new ResolveTenantAccessUseCase(
          tenantRepository,
          membershipRepository,
        ),
    },
    {
      provide: CreateTenantUseCase,
      inject: [
        TENANT_REPOSITORY,
        TENANT_ID_GENERATOR,
        MEMBERSHIP_ID_GENERATOR,
        TENANT_PROVISIONING_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        tenantIdGenerator,
        membershipIdGenerator,
        tenantProvisioningRepository,
      ) =>
        new CreateTenantUseCase(
          tenantRepository,
          tenantIdGenerator,
          membershipIdGenerator,
          tenantProvisioningRepository,
        ),
    },
    TenantMembershipGuard,
    TenantRoleGuard,
  ],
  exports: [
    CreateTenantUseCase,
    GetTenantBySlugUseCase,
    GetTenantMembershipByUserUseCase,
    ListTenantMembershipsUseCase,
    ResolveTenantAccessUseCase,
  ],
})
export class TenancyModule {}
