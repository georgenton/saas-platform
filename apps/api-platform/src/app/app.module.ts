import { Module } from '@nestjs/common';
import { PrismaModule } from '@saas-platform/infra-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentityModule } from './modules/identity/identity.module';
import { TenancyModule } from './modules/tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, IdentityModule, TenancyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
