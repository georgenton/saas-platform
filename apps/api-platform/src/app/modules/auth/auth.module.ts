import { Module } from '@nestjs/common';
import { DevelopmentAuthenticationGuard } from './development-authentication.guard';

@Module({
  providers: [DevelopmentAuthenticationGuard],
  exports: [DevelopmentAuthenticationGuard],
})
export class AuthModule {}
