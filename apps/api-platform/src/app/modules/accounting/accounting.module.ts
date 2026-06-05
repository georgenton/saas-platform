import { Module } from '@nestjs/common';
import {
  ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR,
  ACCOUNTING_JOURNAL_ENTRY_REPOSITORY,
  CreateTenantAccountingJournalEntriesFromApprovalUseCase,
  GetTenantAccountingChartOfAccountsWorkspaceUseCase,
  GetTenantAccountingIntakeWorkspaceUseCase,
  GetTenantAccountingJournalDraftPreviewUseCase,
  GetTenantAccountingLedgerRegistryWorkspaceUseCase,
  GetTenantAccountingLedgerPreviewWorkspaceUseCase,
  GetTenantAccountingPeriodCloseoutReportUseCase,
  GetTenantAccountingPeriodCloseoutReadinessUseCase,
  GetTenantAccountingTrialBalanceWorkspaceUseCase,
  ListTenantAccountingJournalRegistryUseCase,
  ManageTenantAccountingChartMappingUseCase,
  RequestTenantAccountingJournalDraftApprovalPacketUseCase,
  RequestTenantAccountingPeriodCloseoutPacketUseCase,
} from '@saas-platform/accounting-application';
import { PRODUCT_REPOSITORY } from '@saas-platform/catalog-application';
import {
  ENTITLEMENT_REPOSITORY,
  GetTenantEnabledProductByKeyUseCase,
  ListTenantEnabledProductsUseCase,
} from '@saas-platform/commercial-application';
import { FEATURE_FLAG_REPOSITORY } from '@saas-platform/feature-flags-application';
import {
  AccountingPersistenceModule,
  CatalogPersistenceModule,
  CommercialPersistenceModule,
  FeatureFlagsPersistenceModule,
  TenancyPersistenceModule,
} from '@saas-platform/infra-prisma';
import {
  GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
  GetTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase,
  GetTenantEcuadorTaxOperationalCloseoutUseCase,
  RequestTenantEcuadorTaxAccountingBridgePreviewUseCase,
  RequestTenantEcuadorTaxAccountingReadinessPacketUseCase,
  UpsertTenantEcuadorTaxAccountingBridgeMappingUseCase,
} from '@saas-platform/tax-compliance-application';
import {
  ResolveTenantAccessUseCase,
  TENANT_ACCESS_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { AuthModule } from '../auth/auth.module';
import { TaxComplianceModule } from '../tax-compliance/tax-compliance.module';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import { AccountingController } from './accounting.controller';

@Module({
  imports: [
    AuthModule,
    AccountingPersistenceModule,
    CatalogPersistenceModule,
    CommercialPersistenceModule,
    FeatureFlagsPersistenceModule,
    TaxComplianceModule,
    TenancyPersistenceModule,
  ],
  controllers: [AccountingController],
  providers: [
    {
      provide: GetTenantAccountingIntakeWorkspaceUseCase,
      inject: [RequestTenantEcuadorTaxAccountingReadinessPacketUseCase],
      useFactory: (requestTenantEcuadorTaxAccountingReadinessPacketUseCase) =>
        new GetTenantAccountingIntakeWorkspaceUseCase(
          requestTenantEcuadorTaxAccountingReadinessPacketUseCase,
        ),
    },
    {
      provide: GetTenantAccountingChartOfAccountsWorkspaceUseCase,
      inject: [
        GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
        GetTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxAccountingBridgeMappingUseCase,
        getTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase,
      ) =>
        new GetTenantAccountingChartOfAccountsWorkspaceUseCase(
          getTenantEcuadorTaxAccountingBridgeMappingUseCase,
          getTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase,
        ),
    },
    {
      provide: GetTenantAccountingJournalDraftPreviewUseCase,
      inject: [
        RequestTenantEcuadorTaxAccountingBridgePreviewUseCase,
        GetTenantAccountingChartOfAccountsWorkspaceUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxAccountingBridgePreviewUseCase,
        getTenantAccountingChartOfAccountsWorkspaceUseCase,
      ) =>
        new GetTenantAccountingJournalDraftPreviewUseCase(
          requestTenantEcuadorTaxAccountingBridgePreviewUseCase,
          getTenantAccountingChartOfAccountsWorkspaceUseCase,
        ),
    },
    {
      provide: ManageTenantAccountingChartMappingUseCase,
      inject: [
        UpsertTenantEcuadorTaxAccountingBridgeMappingUseCase,
        GetTenantAccountingChartOfAccountsWorkspaceUseCase,
      ],
      useFactory: (
        upsertTenantEcuadorTaxAccountingBridgeMappingUseCase,
        getTenantAccountingChartOfAccountsWorkspaceUseCase,
      ) =>
        new ManageTenantAccountingChartMappingUseCase(
          upsertTenantEcuadorTaxAccountingBridgeMappingUseCase,
          getTenantAccountingChartOfAccountsWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingJournalDraftApprovalPacketUseCase,
      inject: [GetTenantAccountingJournalDraftPreviewUseCase],
      useFactory: (getTenantAccountingJournalDraftPreviewUseCase) =>
        new RequestTenantAccountingJournalDraftApprovalPacketUseCase(
          getTenantAccountingJournalDraftPreviewUseCase,
        ),
    },
    {
      provide: GetTenantAccountingLedgerPreviewWorkspaceUseCase,
      inject: [
        GetTenantAccountingJournalDraftPreviewUseCase,
        GetTenantAccountingChartOfAccountsWorkspaceUseCase,
      ],
      useFactory: (
        getTenantAccountingJournalDraftPreviewUseCase,
        getTenantAccountingChartOfAccountsWorkspaceUseCase,
      ) =>
        new GetTenantAccountingLedgerPreviewWorkspaceUseCase(
          getTenantAccountingJournalDraftPreviewUseCase,
          getTenantAccountingChartOfAccountsWorkspaceUseCase,
        ),
    },
    {
      provide: CreateTenantAccountingJournalEntriesFromApprovalUseCase,
      inject: [
        RequestTenantAccountingJournalDraftApprovalPacketUseCase,
        ACCOUNTING_JOURNAL_ENTRY_REPOSITORY,
        ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR,
        TENANT_REPOSITORY,
      ],
      useFactory: (
        requestTenantAccountingJournalDraftApprovalPacketUseCase,
        accountingJournalEntryRepository,
        accountingJournalEntryIdGenerator,
        tenantRepository,
      ) =>
        new CreateTenantAccountingJournalEntriesFromApprovalUseCase(
          requestTenantAccountingJournalDraftApprovalPacketUseCase,
          accountingJournalEntryRepository,
          accountingJournalEntryIdGenerator,
          tenantRepository,
        ),
    },
    {
      provide: ListTenantAccountingJournalRegistryUseCase,
      inject: [ACCOUNTING_JOURNAL_ENTRY_REPOSITORY],
      useFactory: (accountingJournalEntryRepository) =>
        new ListTenantAccountingJournalRegistryUseCase(
          accountingJournalEntryRepository,
        ),
    },
    {
      provide: GetTenantAccountingLedgerRegistryWorkspaceUseCase,
      inject: [
        ListTenantAccountingJournalRegistryUseCase,
        GetTenantAccountingChartOfAccountsWorkspaceUseCase,
      ],
      useFactory: (
        listTenantAccountingJournalRegistryUseCase,
        getTenantAccountingChartOfAccountsWorkspaceUseCase,
      ) =>
        new GetTenantAccountingLedgerRegistryWorkspaceUseCase(
          listTenantAccountingJournalRegistryUseCase,
          getTenantAccountingChartOfAccountsWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantAccountingPeriodCloseoutReadinessUseCase,
      inject: [
        GetTenantAccountingChartOfAccountsWorkspaceUseCase,
        ListTenantAccountingJournalRegistryUseCase,
        GetTenantAccountingLedgerRegistryWorkspaceUseCase,
        GetTenantEcuadorTaxOperationalCloseoutUseCase,
      ],
      useFactory: (
        getTenantAccountingChartOfAccountsWorkspaceUseCase,
        listTenantAccountingJournalRegistryUseCase,
        getTenantAccountingLedgerRegistryWorkspaceUseCase,
        getTenantEcuadorTaxOperationalCloseoutUseCase,
      ) =>
        new GetTenantAccountingPeriodCloseoutReadinessUseCase(
          getTenantAccountingChartOfAccountsWorkspaceUseCase,
          listTenantAccountingJournalRegistryUseCase,
          getTenantAccountingLedgerRegistryWorkspaceUseCase,
          getTenantEcuadorTaxOperationalCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantAccountingTrialBalanceWorkspaceUseCase,
      inject: [GetTenantAccountingLedgerRegistryWorkspaceUseCase],
      useFactory: (getTenantAccountingLedgerRegistryWorkspaceUseCase) =>
        new GetTenantAccountingTrialBalanceWorkspaceUseCase(
          getTenantAccountingLedgerRegistryWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingPeriodCloseoutPacketUseCase,
      inject: [
        GetTenantAccountingPeriodCloseoutReadinessUseCase,
        GetTenantAccountingTrialBalanceWorkspaceUseCase,
      ],
      useFactory: (
        getTenantAccountingPeriodCloseoutReadinessUseCase,
        getTenantAccountingTrialBalanceWorkspaceUseCase,
      ) =>
        new RequestTenantAccountingPeriodCloseoutPacketUseCase(
          getTenantAccountingPeriodCloseoutReadinessUseCase,
          getTenantAccountingTrialBalanceWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantAccountingPeriodCloseoutReportUseCase,
      inject: [
        ListTenantAccountingJournalRegistryUseCase,
        GetTenantAccountingLedgerRegistryWorkspaceUseCase,
        GetTenantAccountingTrialBalanceWorkspaceUseCase,
        GetTenantAccountingPeriodCloseoutReadinessUseCase,
      ],
      useFactory: (
        listTenantAccountingJournalRegistryUseCase,
        getTenantAccountingLedgerRegistryWorkspaceUseCase,
        getTenantAccountingTrialBalanceWorkspaceUseCase,
        getTenantAccountingPeriodCloseoutReadinessUseCase,
      ) =>
        new GetTenantAccountingPeriodCloseoutReportUseCase(
          listTenantAccountingJournalRegistryUseCase,
          getTenantAccountingLedgerRegistryWorkspaceUseCase,
          getTenantAccountingTrialBalanceWorkspaceUseCase,
          getTenantAccountingPeriodCloseoutReadinessUseCase,
        ),
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
      provide: GetTenantEnabledProductByKeyUseCase,
      inject: [PRODUCT_REPOSITORY, ListTenantEnabledProductsUseCase],
      useFactory: (productRepository, listTenantEnabledProductsUseCase) =>
        new GetTenantEnabledProductByKeyUseCase(
          productRepository,
          listTenantEnabledProductsUseCase,
        ),
    },
    {
      provide: ResolveTenantAccessUseCase,
      inject: [TENANT_REPOSITORY, TENANT_ACCESS_REPOSITORY],
      useFactory: (tenantRepository, tenantAccessRepository) =>
        new ResolveTenantAccessUseCase(
          tenantRepository,
          tenantAccessRepository,
        ),
    },
    TenantMembershipGuard,
    TenantPermissionGuard,
    TenantProductAccessGuard,
  ],
})
export class AccountingModule {}
