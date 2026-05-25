import { Module } from '@nestjs/common';
import {
  AI_APPROVAL_REQUEST_REPOSITORY,
  AI_GUARDED_EXECUTION_EVENT_REPOSITORY,
  AI_SUGGESTION_RUN_REPOSITORY,
  CreateTenantAiGuardedExecutionEventUseCase,
  GetAiApprovalPoliciesByAgentKeyUseCase,
  GetAiAgentToolAccessByAgentKeyUseCase,
  GetAiPromptRegistryEntryByAgentKeyUseCase,
  GetAiToolRegistryEntryByKeyUseCase,
  GetTenantAiSuggestionRunDetailUseCase,
  GetTenantAiSuggestionEnvelopeUseCase,
  GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
  GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
  ListTenantAiApprovalRequestsUseCase,
  ListTenantAiGuardedExecutionEventsUseCase,
  ListTenantAiSuggestionRunsUseCase,
  ListAiApprovalPoliciesUseCase,
  ListAiAgentCatalogUseCase,
  ListAiPromptRegistryUseCase,
  ListAiToolRegistryUseCase,
  PrepareTenantAiSuggestionRunUseCase,
  RequestTenantAiSuggestionRunApprovalUseCase,
  ReviewTenantAiApprovalRequestUseCase,
} from '@saas-platform/ai-application';
import {
  GetTenantGrowthAssistDailyAgendaUseCase,
  GROWTH_OPERATIONAL_CASE_REPOSITORY,
  ReleaseTenantGrowthOperationalCaseUseCase,
  TakeTenantGrowthOperationalCaseUseCase,
} from '@saas-platform/growth-application';
import {
  GetTenantInvoiceDocumentDraftingAssistUseCase,
} from '@saas-platform/invoicing-application';
import {
  AiPersistenceModule,
  GrowthPersistenceModule,
  IdentityPersistenceModule,
  InvoicingPersistenceModule,
  TenancyPersistenceModule,
} from '@saas-platform/infra-prisma';
import {
  ResolveTenantAccessUseCase,
  TENANT_ACCESS_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { AuthModule } from '../auth/auth.module';
import { GrowthModule } from '../growth/growth.module';
import { InvoicingModule } from '../invoicing/invoicing.module';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { AiController } from './ai.controller';

@Module({
  imports: [
    AuthModule,
    AiPersistenceModule,
    GrowthModule,
    GrowthPersistenceModule,
    IdentityPersistenceModule,
    InvoicingModule,
    InvoicingPersistenceModule,
    TenancyPersistenceModule,
  ],
  controllers: [AiController],
  providers: [
    {
      provide: ListAiAgentCatalogUseCase,
      useFactory: () => new ListAiAgentCatalogUseCase(),
    },
    {
      provide: ListAiApprovalPoliciesUseCase,
      useFactory: () => new ListAiApprovalPoliciesUseCase(),
    },
    {
      provide: ListAiPromptRegistryUseCase,
      useFactory: () => new ListAiPromptRegistryUseCase(),
    },
    {
      provide: ListAiToolRegistryUseCase,
      useFactory: () => new ListAiToolRegistryUseCase(),
    },
    {
      provide: GetAiApprovalPoliciesByAgentKeyUseCase,
      useFactory: () => new GetAiApprovalPoliciesByAgentKeyUseCase(),
    },
    {
      provide: GetAiPromptRegistryEntryByAgentKeyUseCase,
      useFactory: () => new GetAiPromptRegistryEntryByAgentKeyUseCase(),
    },
    {
      provide: GetAiToolRegistryEntryByKeyUseCase,
      useFactory: () => new GetAiToolRegistryEntryByKeyUseCase(),
    },
    {
      provide: GetAiAgentToolAccessByAgentKeyUseCase,
      useFactory: () => new GetAiAgentToolAccessByAgentKeyUseCase(),
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
      provide: GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
      inject: [GetTenantInvoiceDocumentDraftingAssistUseCase],
      useFactory: (getTenantInvoiceDocumentDraftingAssistUseCase) =>
        new GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase(
          getTenantInvoiceDocumentDraftingAssistUseCase,
        ),
    },
    {
      provide: GetTenantAiSuggestionEnvelopeUseCase,
      inject: [
        GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
        GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
      ],
      useFactory: (
        getTenantGrowthAssistAiSuggestionEnvelopeUseCase,
        getTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
      ) =>
        new GetTenantAiSuggestionEnvelopeUseCase(
          getTenantGrowthAssistAiSuggestionEnvelopeUseCase,
          getTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
        ),
    },
    {
      provide: ListTenantAiApprovalRequestsUseCase,
      inject: [TENANT_REPOSITORY, AI_APPROVAL_REQUEST_REPOSITORY],
      useFactory: (tenantRepository, aiApprovalRequestRepository) =>
        new ListTenantAiApprovalRequestsUseCase(
          tenantRepository,
          aiApprovalRequestRepository,
        ),
    },
    {
      provide: ListTenantAiSuggestionRunsUseCase,
      inject: [
        TENANT_REPOSITORY,
        AI_SUGGESTION_RUN_REPOSITORY,
        AI_APPROVAL_REQUEST_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        aiSuggestionRunRepository,
        aiApprovalRequestRepository,
      ) =>
        new ListTenantAiSuggestionRunsUseCase(
          tenantRepository,
          aiSuggestionRunRepository,
          aiApprovalRequestRepository,
        ),
    },
    {
      provide: GetTenantAiSuggestionRunDetailUseCase,
      inject: [
        TENANT_REPOSITORY,
        AI_SUGGESTION_RUN_REPOSITORY,
        AI_APPROVAL_REQUEST_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        aiSuggestionRunRepository,
        aiApprovalRequestRepository,
      ) =>
        new GetTenantAiSuggestionRunDetailUseCase(
          tenantRepository,
          aiSuggestionRunRepository,
          aiApprovalRequestRepository,
        ),
    },
    {
      provide: PrepareTenantAiSuggestionRunUseCase,
      inject: [
        TENANT_REPOSITORY,
        AI_SUGGESTION_RUN_REPOSITORY,
        GetTenantAiSuggestionEnvelopeUseCase,
      ],
      useFactory: (
        tenantRepository,
        aiSuggestionRunRepository,
        getTenantAiSuggestionEnvelopeUseCase,
      ) =>
        new PrepareTenantAiSuggestionRunUseCase(
          tenantRepository,
          aiSuggestionRunRepository,
          getTenantAiSuggestionEnvelopeUseCase,
        ),
    },
    {
      provide: RequestTenantAiSuggestionRunApprovalUseCase,
      inject: [
        TENANT_REPOSITORY,
        AI_SUGGESTION_RUN_REPOSITORY,
        AI_APPROVAL_REQUEST_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        aiSuggestionRunRepository,
        aiApprovalRequestRepository,
      ) =>
        new RequestTenantAiSuggestionRunApprovalUseCase(
          tenantRepository,
          aiSuggestionRunRepository,
          aiApprovalRequestRepository,
        ),
    },
    {
      provide: ReviewTenantAiApprovalRequestUseCase,
      inject: [TENANT_REPOSITORY, AI_APPROVAL_REQUEST_REPOSITORY],
      useFactory: (tenantRepository, aiApprovalRequestRepository) =>
        new ReviewTenantAiApprovalRequestUseCase(
          tenantRepository,
          aiApprovalRequestRepository,
        ),
    },
    {
      provide: CreateTenantAiGuardedExecutionEventUseCase,
      inject: [TENANT_REPOSITORY, AI_GUARDED_EXECUTION_EVENT_REPOSITORY],
      useFactory: (tenantRepository, aiGuardedExecutionEventRepository) =>
        new CreateTenantAiGuardedExecutionEventUseCase(
          tenantRepository,
          aiGuardedExecutionEventRepository,
        ),
    },
    {
      provide: ListTenantAiGuardedExecutionEventsUseCase,
      inject: [TENANT_REPOSITORY, AI_GUARDED_EXECUTION_EVENT_REPOSITORY],
      useFactory: (tenantRepository, aiGuardedExecutionEventRepository) =>
        new ListTenantAiGuardedExecutionEventsUseCase(
          tenantRepository,
          aiGuardedExecutionEventRepository,
        ),
    },
    {
      provide: TakeTenantGrowthOperationalCaseUseCase,
      inject: [TENANT_REPOSITORY, GROWTH_OPERATIONAL_CASE_REPOSITORY],
      useFactory: (tenantRepository, growthOperationalCaseRepository) =>
        new TakeTenantGrowthOperationalCaseUseCase(
          tenantRepository,
          growthOperationalCaseRepository,
        ),
    },
    {
      provide: ReleaseTenantGrowthOperationalCaseUseCase,
      inject: [TENANT_REPOSITORY, GROWTH_OPERATIONAL_CASE_REPOSITORY],
      useFactory: (tenantRepository, growthOperationalCaseRepository) =>
        new ReleaseTenantGrowthOperationalCaseUseCase(
          tenantRepository,
          growthOperationalCaseRepository,
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
