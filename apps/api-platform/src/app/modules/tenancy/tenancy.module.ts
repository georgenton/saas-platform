import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import {
  AssignMembershipRoleUseCase,
  CreateTenantUseCase,
  GetTenantBySlugUseCase,
  GetTenantMemberAccessUseCase,
  GetTenantMembershipByUserUseCase,
  ListTenantMembershipsUseCase,
  MEMBERSHIP_ID_GENERATOR,
  MEMBERSHIP_ROLE_REPOSITORY,
  MEMBERSHIP_REPOSITORY,
  RemoveMembershipRoleUseCase,
  ResolveTenantAccessUseCase,
  TENANT_ACCESS_REPOSITORY,
  TENANT_ID_GENERATOR,
  TENANT_PROVISIONING_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { TenancyPersistenceModule } from '@saas-platform/infra-prisma';
import { TenantMembershipGuard } from './tenant-membership.guard';
import { TenantPermissionGuard } from './tenant-permission.guard';
import { TenancyController } from './tenancy.controller';

@Module({
  imports: [AuthModule, TenancyPersistenceModule],
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
      provide: GetTenantMemberAccessUseCase,
      inject: [TENANT_REPOSITORY, TENANT_ACCESS_REPOSITORY],
      useFactory: (tenantRepository, tenantAccessRepository) =>
        new GetTenantMemberAccessUseCase(
          tenantRepository,
          tenantAccessRepository,
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
      inject: [TENANT_REPOSITORY, TENANT_ACCESS_REPOSITORY],
      useFactory: (tenantRepository, tenantAccessRepository) =>
        new ResolveTenantAccessUseCase(tenantRepository, tenantAccessRepository),
    },
    {
      provide: AssignMembershipRoleUseCase,
      inject: [
        TENANT_REPOSITORY,
        MEMBERSHIP_REPOSITORY,
        MEMBERSHIP_ROLE_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        membershipRepository,
        membershipRoleRepository,
      ) =>
        new AssignMembershipRoleUseCase(
          tenantRepository,
          membershipRepository,
          membershipRoleRepository,
        ),
    },
    {
      provide: RemoveMembershipRoleUseCase,
      inject: [
        TENANT_REPOSITORY,
        MEMBERSHIP_REPOSITORY,
        MEMBERSHIP_ROLE_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        membershipRepository,
        membershipRoleRepository,
      ) =>
        new RemoveMembershipRoleUseCase(
          tenantRepository,
          membershipRepository,
          membershipRoleRepository,
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
    TenantPermissionGuard,
  ],
  exports: [
    AssignMembershipRoleUseCase,
    CreateTenantUseCase,
    GetTenantBySlugUseCase,
    GetTenantMemberAccessUseCase,
    GetTenantMembershipByUserUseCase,
    ListTenantMembershipsUseCase,
    RemoveMembershipRoleUseCase,
    ResolveTenantAccessUseCase,
  ],
})
export class TenancyModule {}
