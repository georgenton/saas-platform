import { Module } from '@nestjs/common';
import {
  AI_SUGGESTION_RUN_REPOSITORY,
  GetAiPromptRegistryEntryByAgentKeyUseCase,
  GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
  ListTenantAiSuggestionRunsUseCase,
  ListAiAgentCatalogUseCase,
  ListAiPromptRegistryUseCase,
  PrepareTenantAiSuggestionRunUseCase,
} from '@saas-platform/ai-application';
import {
  AiPersistenceModule,
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
    AiPersistenceModule,
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
      provide: ListAiPromptRegistryUseCase,
      useFactory: () => new ListAiPromptRegistryUseCase(),
    },
    {
      provide: GetAiPromptRegistryEntryByAgentKeyUseCase,
      useFactory: () => new GetAiPromptRegistryEntryByAgentKeyUseCase(),
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
      provide: ListTenantAiSuggestionRunsUseCase,
      inject: [TENANT_REPOSITORY, AI_SUGGESTION_RUN_REPOSITORY],
      useFactory: (tenantRepository, aiSuggestionRunRepository) =>
        new ListTenantAiSuggestionRunsUseCase(
          tenantRepository,
          aiSuggestionRunRepository,
        ),
    },
    {
      provide: PrepareTenantAiSuggestionRunUseCase,
      inject: [
        TENANT_REPOSITORY,
        AI_SUGGESTION_RUN_REPOSITORY,
        GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
      ],
      useFactory: (
        tenantRepository,
        aiSuggestionRunRepository,
        getTenantGrowthAssistAiSuggestionEnvelopeUseCase,
      ) =>
        new PrepareTenantAiSuggestionRunUseCase(
          tenantRepository,
          aiSuggestionRunRepository,
          getTenantGrowthAssistAiSuggestionEnvelopeUseCase,
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
