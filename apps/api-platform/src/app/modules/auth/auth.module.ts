import { Module } from '@nestjs/common';
import {
  USER_REPOSITORY,
} from '@saas-platform/identity-application';
import {
  AcceptTenantInvitationUseCase,
  GetAuthenticatedUserInvitationUseCase,
  INVITATION_REPOSITORY,
  INVITATION_ACCEPTANCE_REPOSITORY,
  ListUserTenanciesUseCase,
  ListUserPendingInvitationsUseCase,
  MEMBERSHIP_ID_GENERATOR,
  MEMBERSHIP_REPOSITORY,
  TENANT_ACCESS_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import {
  IdentityPersistenceModule,
  TenancyPersistenceModule,
} from '@saas-platform/infra-prisma';
import { AuthController } from './auth.controller';
import { AcceptAuthenticatedUserInvitationUseCase } from './accept-authenticated-user-invitation.use-case';
import { ResolveAuthenticatedSessionUseCase } from './resolve-authenticated-session.use-case';
import { PersistAuthenticatedSessionTenancyPreferenceUseCase } from './persist-authenticated-session-tenancy-preference.use-case';
import { JWT_VERIFIER } from './jwt-verifier';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';
import { LocalJwtVerifier } from './local-jwt-verifier';
import { ProviderJwtVerifier } from './provider-jwt-verifier';

@Module({
  imports: [IdentityPersistenceModule, TenancyPersistenceModule],
  controllers: [AuthController],
  providers: [
    LocalJwtVerifier,
    ProviderJwtVerifier,
    {
      provide: ListUserTenanciesUseCase,
      inject: [
        TENANT_REPOSITORY,
        MEMBERSHIP_REPOSITORY,
        TENANT_ACCESS_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        membershipRepository,
        tenantAccessRepository,
      ) =>
        new ListUserTenanciesUseCase(
          tenantRepository,
          membershipRepository,
          tenantAccessRepository,
        ),
    },
    {
      provide: GetAuthenticatedUserInvitationUseCase,
      inject: [TENANT_REPOSITORY, INVITATION_REPOSITORY],
      useFactory: (tenantRepository, invitationRepository) =>
        new GetAuthenticatedUserInvitationUseCase(
          tenantRepository,
          invitationRepository,
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
      provide: ListUserPendingInvitationsUseCase,
      inject: [TENANT_REPOSITORY, INVITATION_REPOSITORY],
      useFactory: (tenantRepository, invitationRepository) =>
        new ListUserPendingInvitationsUseCase(
          tenantRepository,
          invitationRepository,
        ),
    },
    {
      provide: ResolveAuthenticatedSessionUseCase,
      inject: [
        USER_REPOSITORY,
        ListUserTenanciesUseCase,
        ListUserPendingInvitationsUseCase,
      ],
      useFactory: (
        userRepository,
        listUserTenanciesUseCase,
        listUserPendingInvitationsUseCase,
      ) =>
        new ResolveAuthenticatedSessionUseCase(
          userRepository,
          listUserTenanciesUseCase,
          listUserPendingInvitationsUseCase,
        ),
    },
    {
      provide: PersistAuthenticatedSessionTenancyPreferenceUseCase,
      inject: [USER_REPOSITORY, ListUserTenanciesUseCase],
      useFactory: (userRepository, listUserTenanciesUseCase) =>
        new PersistAuthenticatedSessionTenancyPreferenceUseCase(
          userRepository,
          listUserTenanciesUseCase,
        ),
    },
    {
      provide: AcceptAuthenticatedUserInvitationUseCase,
      inject: [
        USER_REPOSITORY,
        TENANT_REPOSITORY,
        AcceptTenantInvitationUseCase,
        ResolveAuthenticatedSessionUseCase,
      ],
      useFactory: (
        userRepository,
        tenantRepository,
        acceptTenantInvitationUseCase,
        resolveAuthenticatedSessionUseCase,
      ) =>
        new AcceptAuthenticatedUserInvitationUseCase(
          userRepository,
          tenantRepository,
          acceptTenantInvitationUseCase,
          resolveAuthenticatedSessionUseCase,
        ),
    },
    {
      provide: JWT_VERIFIER,
      inject: [LocalJwtVerifier, ProviderJwtVerifier],
      useFactory: (
        localJwtVerifier: LocalJwtVerifier,
        providerJwtVerifier: ProviderJwtVerifier,
      ) => {
        const mode = process.env.AUTH_JWT_VERIFIER_MODE ?? 'local';

        return mode === 'provider'
          ? providerJwtVerifier
          : localJwtVerifier;
      },
    },
    JwtAuthenticationGuard,
  ],
  exports: [
    JWT_VERIFIER,
    JwtAuthenticationGuard,
    ListUserTenanciesUseCase,
    ListUserPendingInvitationsUseCase,
    GetAuthenticatedUserInvitationUseCase,
    ResolveAuthenticatedSessionUseCase,
    PersistAuthenticatedSessionTenancyPreferenceUseCase,
    AcceptAuthenticatedUserInvitationUseCase,
  ],
})
export class AuthModule {}
