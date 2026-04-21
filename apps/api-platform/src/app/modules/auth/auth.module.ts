import { Module } from '@nestjs/common';
import {
  USER_REPOSITORY,
} from '@saas-platform/identity-application';
import {
  ListUserTenanciesUseCase,
  MEMBERSHIP_REPOSITORY,
  TENANT_ACCESS_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import {
  IdentityPersistenceModule,
  TenancyPersistenceModule,
} from '@saas-platform/infra-prisma';
import { AuthController } from './auth.controller';
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
      provide: ResolveAuthenticatedSessionUseCase,
      inject: [USER_REPOSITORY, ListUserTenanciesUseCase],
      useFactory: (userRepository, listUserTenanciesUseCase) =>
        new ResolveAuthenticatedSessionUseCase(
          userRepository,
          listUserTenanciesUseCase,
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
    ResolveAuthenticatedSessionUseCase,
    PersistAuthenticatedSessionTenancyPreferenceUseCase,
  ],
})
export class AuthModule {}
