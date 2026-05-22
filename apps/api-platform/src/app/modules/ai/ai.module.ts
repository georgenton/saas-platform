import { Module } from '@nestjs/common';
import {
  GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
  ListAiAgentCatalogUseCase,
} from '@saas-platform/ai-application';
import {
  GrowthPersistenceModule,
  IdentityPersistenceModule,
  TenancyPersistenceModule,
} from '@saas-platform/infra-prisma';
import {
  ResolveTenantAccessUseCase,
  TENANT_ACCESS_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { AuthModule } from '../auth/auth.module';
import { GrowthModule } from '../growth/growth.module';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { AiController } from './ai.controller';
import { GetTenantGrowthAssistDailyAgendaUseCase } from '@saas-platform/growth-application';

@Module({
  imports: [
    AuthModule,
    GrowthModule,
    GrowthPersistenceModule,
    IdentityPersistenceModule,
    TenancyPersistenceModule,
  ],
  controllers: [AiController],
  providers: [
    {
      provide: ListAiAgentCatalogUseCase,
      useFactory: () => new ListAiAgentCatalogUseCase(),
    },
    {
      provide: GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
      inject: [GetTenantGrowthAssistDailyAgendaUseCase],
      useFactory: (getTenantGrowthAssistDailyAgendaUseCase) =>
        new GetTenantGrowthAssistAiSuggestionEnvelopeUseCase(
          getTenantGrowthAssistDailyAgendaUseCase,
        ),
    },
    {
      provide: ResolveTenantAccessUseCase,
      inject: [TENANT_REPOSITORY, TENANT_ACCESS_REPOSITORY],
      useFactory: (tenantRepository, tenantAccessRepository) =>
        new ResolveTenantAccessUseCase(tenantRepository, tenantAccessRepository),
    },
    TenantMembershipGuard,
    TenantPermissionGuard,
  ],
})
export class AiModule {}
