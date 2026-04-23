import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import {
  AcceptTenantInvitationUseCase,
  AssignMembershipRoleUseCase,
  CancelTenantInvitationUseCase,
  CreateTenantUseCase,
  GetTenantInvitationByIdUseCase,
  GetTenantBySlugUseCase,
  GetTenantMemberAccessUseCase,
  GetTenantMembershipByUserUseCase,
  INVITATION_ACCEPTANCE_REPOSITORY,
  INVITATION_EMAIL_SENDER,
  INVITATION_ID_GENERATOR,
  INVITATION_REPOSITORY,
  ListTenantMembershipsUseCase,
  ListTenantInvitationsUseCase,
  InviteUserToTenantUseCase,
  MEMBERSHIP_ID_GENERATOR,
  MEMBERSHIP_ROLE_REPOSITORY,
  MEMBERSHIP_REPOSITORY,
  RemoveMembershipRoleUseCase,
  ResendTenantInvitationUseCase,
  ResolveTenantAccessUseCase,
  TENANT_ACCESS_REPOSITORY,
  TENANT_ID_GENERATOR,
  TENANT_PROVISIONING_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { IdentityPersistenceModule, TenancyPersistenceModule } from '@saas-platform/infra-prisma';
import { TenantMembershipGuard } from './tenant-membership.guard';
import { TenantPermissionGuard } from './tenant-permission.guard';
import { TenancyInvitationsController } from './tenancy-invitations.controller';
import { TenancyController } from './tenancy.controller';
import { USER_REPOSITORY } from '@saas-platform/identity-application';
import { SmtpInvitationEmailSender } from './smtp-invitation-email-sender';

@Module({
  imports: [AuthModule, IdentityPersistenceModule, TenancyPersistenceModule],
  controllers: [TenancyController, TenancyInvitationsController],
  providers: [
    {
      provide: INVITATION_EMAIL_SENDER,
      useFactory: () =>
        new SmtpInvitationEmailSender({
          fromAddress: process.env.INVITATION_EMAIL_FROM,
          smtpHost: process.env.INVITATION_SMTP_HOST,
          smtpPassword: process.env.INVITATION_SMTP_PASSWORD,
          smtpPort: process.env.INVITATION_SMTP_PORT,
          smtpSecure: process.env.INVITATION_SMTP_SECURE,
          smtpUser: process.env.INVITATION_SMTP_USER,
          webBaseUrl: process.env.WEB_PLATFORM_BASE_URL,
        }),
    },
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
    {
      provide: InviteUserToTenantUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVITATION_REPOSITORY,
        INVITATION_ID_GENERATOR,
        INVITATION_EMAIL_SENDER,
      ],
      useFactory: (
        tenantRepository,
        invitationRepository,
        invitationIdGenerator,
        invitationEmailSender,
      ) =>
        new InviteUserToTenantUseCase(
          tenantRepository,
          invitationRepository,
          invitationIdGenerator,
          invitationEmailSender,
        ),
    },
    {
      provide: GetTenantInvitationByIdUseCase,
      inject: [TENANT_REPOSITORY, INVITATION_REPOSITORY],
      useFactory: (tenantRepository, invitationRepository) =>
        new GetTenantInvitationByIdUseCase(
          tenantRepository,
          invitationRepository,
        ),
    },
    {
      provide: ListTenantInvitationsUseCase,
      inject: [TENANT_REPOSITORY, INVITATION_REPOSITORY],
      useFactory: (tenantRepository, invitationRepository) =>
        new ListTenantInvitationsUseCase(
          tenantRepository,
          invitationRepository,
        ),
    },
    {
      provide: ResendTenantInvitationUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVITATION_REPOSITORY,
        INVITATION_EMAIL_SENDER,
      ],
      useFactory: (
        tenantRepository,
        invitationRepository,
        invitationEmailSender,
      ) =>
        new ResendTenantInvitationUseCase(
          tenantRepository,
          invitationRepository,
          invitationEmailSender,
        ),
    },
    {
      provide: AcceptTenantInvitationUseCase,
      inject: [
        TENANT_REPOSITORY,
        USER_REPOSITORY,
        MEMBERSHIP_REPOSITORY,
        INVITATION_REPOSITORY,
        INVITATION_ACCEPTANCE_REPOSITORY,
        MEMBERSHIP_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        userRepository,
        membershipRepository,
        invitationRepository,
        invitationAcceptanceRepository,
        membershipIdGenerator,
      ) =>
        new AcceptTenantInvitationUseCase(
          tenantRepository,
          userRepository,
          membershipRepository,
          invitationRepository,
          invitationAcceptanceRepository,
          membershipIdGenerator,
        ),
    },
    {
      provide: CancelTenantInvitationUseCase,
      inject: [TENANT_REPOSITORY, INVITATION_REPOSITORY],
      useFactory: (tenantRepository, invitationRepository) =>
        new CancelTenantInvitationUseCase(
          tenantRepository,
          invitationRepository,
        ),
    },
    TenantMembershipGuard,
    TenantPermissionGuard,
  ],
  exports: [
    AcceptTenantInvitationUseCase,
    AssignMembershipRoleUseCase,
    CancelTenantInvitationUseCase,
    CreateTenantUseCase,
    GetTenantInvitationByIdUseCase,
    GetTenantBySlugUseCase,
    GetTenantMemberAccessUseCase,
    GetTenantMembershipByUserUseCase,
    InviteUserToTenantUseCase,
    ListTenantInvitationsUseCase,
    ListTenantMembershipsUseCase,
    RemoveMembershipRoleUseCase,
    ResendTenantInvitationUseCase,
    ResolveTenantAccessUseCase,
  ],
})
export class TenancyModule {}
