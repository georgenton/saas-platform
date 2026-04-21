import { Module } from '@nestjs/common';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';

@Module({
  providers: [JwtAuthenticationGuard],
  exports: [JwtAuthenticationGuard],
})
export class AuthModule {}
