import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JWT_VERIFIER } from './jwt-verifier';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';
import { LocalJwtVerifier } from './local-jwt-verifier';
import { ProviderJwtVerifier } from './provider-jwt-verifier';

@Module({
  controllers: [AuthController],
  providers: [
    LocalJwtVerifier,
    ProviderJwtVerifier,
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
  exports: [JWT_VERIFIER, JwtAuthenticationGuard],
})
export class AuthModule {}
