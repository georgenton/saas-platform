import { Module } from '@nestjs/common';
import {
  PLATFORM_MODULE_REPOSITORY,
  PRODUCT_REPOSITORY,
  ListProductModulesUseCase,
} from '@saas-platform/catalog-application';
import {
  AI_APPROVAL_REQUEST_REPOSITORY,
  AI_GUARDED_EXECUTION_EVENT_REPOSITORY,
  AI_MEMORY_RECORD_REPOSITORY,
  AI_SUGGESTION_RUN_REPOSITORY,
  ApplyTenantAiMemoryArchivalPolicyUseCase,
  CreateTenantAiGuardedExecutionEventUseCase,
  CreateTenantAiMemoryRecordUseCase,
  GetAiApprovalPoliciesByAgentKeyUseCase,
  GetAiAgentToolAccessByAgentKeyUseCase,
  GetAiOperatingModelManifestUseCase,
  GetAiPromptRegistryEntryByAgentKeyUseCase,
  GetTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase,
  GetAiToolRegistryEntryByKeyUseCase,
  GetTenantAiMemoryRecordDetailUseCase,
  GetTenantAiMemoryRetrievalUseCase,
  GetTenantAiSuggestionRunDetailUseCase,
  GetTenantAiSuggestionEnvelopeUseCase,
  GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
  GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
  ListTenantAiApprovalRequestsUseCase,
  ListTenantAiGuardedExecutionEventsUseCase,
  ListTenantAiMemoryRecordsUseCase,
  ListTenantAiSuggestionRunsUseCase,
  ListAiApprovalPoliciesUseCase,
  ListAiAgentCatalogUseCase,
  ListAiPromptRegistryUseCase,
  ListAiToolRegistryUseCase,
  PrepareTenantAiSuggestionRunUseCase,
  RequestTenantAiSuggestionRunApprovalUseCase,
  ReviewTenantAiApprovalRequestUseCase,
  UpdateTenantAiMemoryRecordUseCase,
} from '@saas-platform/ai-application';
import {
  ENTITLEMENT_REPOSITORY,
  ListTenantEnabledProductsUseCase,
} from '@saas-platform/commercial-application';
import { GetTenantEcommerceLaunchWorkspaceUseCase } from '@saas-platform/ecommerce-application';
import { FEATURE_FLAG_REPOSITORY } from '@saas-platform/feature-flags-application';
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
  CatalogPersistenceModule,
  CommercialPersistenceModule,
  FeatureFlagsPersistenceModule,
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
    CatalogPersistenceModule,
    CommercialPersistenceModule,
    FeatureFlagsPersistenceModule,
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
      provide: GetAiOperatingModelManifestUseCase,
      useFactory: () => new GetAiOperatingModelManifestUseCase(),
    },
    {
      provide: ListTenantEnabledProductsUseCase,
      inject: [
        TENANT_REPOSITORY,
        ENTITLEMENT_REPOSITORY,
        PRODUCT_REPOSITORY,
        FEATURE_FLAG_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        entitlementRepository,
        productRepository,
        featureFlagRepository,
      ) =>
        new ListTenantEnabledProductsUseCase(
          tenantRepository,
          entitlementRepository,
          productRepository,
          featureFlagRepository,
        ),
    },
    {
      provide: ListProductModulesUseCase,
      inject: [PRODUCT_REPOSITORY, PLATFORM_MODULE_REPOSITORY],
      useFactory: (productRepository, platformModuleRepository) =>
        new ListProductModulesUseCase(
          productRepository,
          platformModuleRepository,
        ),
    },
    {
      provide: GetTenantEcommerceLaunchWorkspaceUseCase,
      inject: [ListTenantEnabledProductsUseCase, ListProductModulesUseCase],
      useFactory: (
        listTenantEnabledProductsUseCase,
        listProductModulesUseCase,
      ) =>
        new GetTenantEcommerceLaunchWorkspaceUseCase(
          listTenantEnabledProductsUseCase,
          listProductModulesUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase,
      inject: [
        GetTenantEcommerceLaunchWorkspaceUseCase,
        GetTenantAiMemoryRetrievalUseCase,
      ],
      useFactory: (
        getTenantEcommerceLaunchWorkspaceUseCase,
        getTenantAiMemoryRetrievalUseCase,
      ) =>
        new GetTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase(
          getTenantEcommerceLaunchWorkspaceUseCase,
          getTenantAiMemoryRetrievalUseCase,
        ),
    },
    {
      provide: GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
      inject: [
        GetTenantGrowthAssistDailyAgendaUseCase,
        GetTenantAiMemoryRetrievalUseCase,
      ],
      useFactory: (
        getTenantGrowthAssistDailyAgendaUseCase,
        getTenantAiMemoryRetrievalUseCase,
      ) =>
        new GetTenantGrowthAssistAiSuggestionEnvelopeUseCase(
          getTenantGrowthAssistDailyAgendaUseCase,
          getTenantAiMemoryRetrievalUseCase,
        ),
    },
    {
      provide: GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
      inject: [
        GetTenantInvoiceDocumentDraftingAssistUseCase,
        GetTenantAiMemoryRetrievalUseCase,
      ],
      useFactory: (
        getTenantInvoiceDocumentDraftingAssistUseCase,
        getTenantAiMemoryRetrievalUseCase,
      ) =>
        new GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase(
          getTenantInvoiceDocumentDraftingAssistUseCase,
          getTenantAiMemoryRetrievalUseCase,
        ),
    },
    {
      provide: GetTenantAiSuggestionEnvelopeUseCase,
      inject: [
        GetTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase,
        GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
        GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
      ],
      useFactory: (
        getTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase,
        getTenantGrowthAssistAiSuggestionEnvelopeUseCase,
        getTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
      ) =>
        new GetTenantAiSuggestionEnvelopeUseCase(
          getTenantGrowthAssistAiSuggestionEnvelopeUseCase,
          getTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
          getTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase,
        ),
    },
    {
      provide: ApplyTenantAiMemoryArchivalPolicyUseCase,
      inject: [TENANT_REPOSITORY, AI_MEMORY_RECORD_REPOSITORY],
      useFactory: (tenantRepository, aiMemoryRecordRepository) =>
        new ApplyTenantAiMemoryArchivalPolicyUseCase(
          tenantRepository,
          aiMemoryRecordRepository,
        ),
    },
    {
      provide: CreateTenantAiMemoryRecordUseCase,
      inject: [TENANT_REPOSITORY, AI_MEMORY_RECORD_REPOSITORY],
      useFactory: (tenantRepository, aiMemoryRecordRepository) =>
        new CreateTenantAiMemoryRecordUseCase(
          tenantRepository,
          aiMemoryRecordRepository,
        ),
    },
    {
      provide: ListTenantAiMemoryRecordsUseCase,
      inject: [TENANT_REPOSITORY, AI_MEMORY_RECORD_REPOSITORY],
      useFactory: (tenantRepository, aiMemoryRecordRepository) =>
        new ListTenantAiMemoryRecordsUseCase(
          tenantRepository,
          aiMemoryRecordRepository,
        ),
    },
    {
      provide: GetTenantAiMemoryRetrievalUseCase,
      inject: [TENANT_REPOSITORY, AI_MEMORY_RECORD_REPOSITORY],
      useFactory: (tenantRepository, aiMemoryRecordRepository) =>
        new GetTenantAiMemoryRetrievalUseCase(
          tenantRepository,
          aiMemoryRecordRepository,
        ),
    },
    {
      provide: GetTenantAiMemoryRecordDetailUseCase,
      inject: [
        TENANT_REPOSITORY,
        AI_MEMORY_RECORD_REPOSITORY,
        AI_SUGGESTION_RUN_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        aiMemoryRecordRepository,
        aiSuggestionRunRepository,
      ) =>
        new GetTenantAiMemoryRecordDetailUseCase(
          tenantRepository,
          aiMemoryRecordRepository,
          aiSuggestionRunRepository,
        ),
    },
    {
      provide: UpdateTenantAiMemoryRecordUseCase,
      inject: [TENANT_REPOSITORY, AI_MEMORY_RECORD_REPOSITORY],
      useFactory: (tenantRepository, aiMemoryRecordRepository) =>
        new UpdateTenantAiMemoryRecordUseCase(
          tenantRepository,
          aiMemoryRecordRepository,
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
