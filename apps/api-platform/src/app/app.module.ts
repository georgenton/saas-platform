import { Module } from '@nestjs/common';
import { PrismaModule } from '@saas-platform/infra-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { IdentityModule } from './modules/identity/identity.module';
import { TenancyModule } from './modules/tenancy/tenancy.module';

@Module({
  imports: [PrismaModule, AuthModule, CatalogModule, IdentityModule, TenancyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
