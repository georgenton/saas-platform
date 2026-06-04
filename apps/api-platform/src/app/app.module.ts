import { Module } from '@nestjs/common';
import { PrismaModule } from '@saas-platform/infra-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { CommercialModule } from './modules/commercial/commercial.module';
import { EcommerceModule } from './modules/ecommerce/ecommerce.module';
import { FeatureFlagsModule } from './modules/feature-flags/feature-flags.module';
import { GrowthModule } from './modules/growth/growth.module';
import { IdentityModule } from './modules/identity/identity.module';
import { InvoicingModule } from './modules/invoicing/invoicing.module';
import { PartiesModule } from './modules/parties/parties.module';
import { TaxComplianceModule } from './modules/tax-compliance/tax-compliance.module';
import { TenancyModule } from './modules/tenancy/tenancy.module';

@Module({
  imports: [
    PrismaModule,
    AiModule,
    AuthModule,
    CatalogModule,
    CommercialModule,
    EcommerceModule,
    FeatureFlagsModule,
    GrowthModule,
    IdentityModule,
    InvoicingModule,
    PartiesModule,
    TaxComplianceModule,
    TenancyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
