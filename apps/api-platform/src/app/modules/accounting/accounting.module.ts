import { Module } from '@nestjs/common';
import {
  ACCOUNTING_BANK_RECONCILIATION_CONTROL_ID_GENERATOR,
  ACCOUNTING_BANK_RECONCILIATION_CONTROL_REPOSITORY,
  ACCOUNTING_BANK_STATEMENT_BATCH_ID_GENERATOR,
  ACCOUNTING_BANK_STATEMENT_LINE_ID_GENERATOR,
  ACCOUNTING_BANK_STATEMENT_REPOSITORY,
  ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR,
  ACCOUNTING_JOURNAL_ENTRY_REPOSITORY,
  ACCOUNTING_PERIOD_CONTROL_ID_GENERATOR,
  ACCOUNTING_PERIOD_CONTROL_REPOSITORY,
  CreateTenantAccountingAdjustingJournalEntryUseCase,
  CreateTenantAccountingJournalEntriesFromApprovalUseCase,
  GetTenantAccountingAccountantHandoffWorkspaceUseCase,
  GetTenantAccountingAuditTrailWorkspaceUseCase,
  GetTenantAccountingBankReconciliationWorkspaceUseCase,
  GetTenantAccountingBankStatementImportWorkspaceUseCase,
  GetTenantAccountingChartOfAccountsWorkspaceUseCase,
  GetTenantAccountingFinancialStatementPreviewUseCase,
  GetTenantAccountingIntakeWorkspaceUseCase,
  GetTenantAccountingJournalDraftPreviewUseCase,
  GetTenantAccountingLedgerRegistryWorkspaceUseCase,
  GetTenantAccountingLedgerPreviewWorkspaceUseCase,
  GetTenantAccountingPeriodCashCloseoutReadinessUseCase,
  GetTenantAccountingPeriodCloseoutReportUseCase,
  GetTenantAccountingPeriodCloseoutReadinessUseCase,
  GetTenantAccountingPeriodEvidenceVaultUseCase,
  GetTenantAccountingPeriodLockReadinessUseCase,
  GetTenantAccountingPeriodReconciliationReadinessUseCase,
  GetTenantAccountingTrialBalanceWorkspaceUseCase,
  ListTenantAccountingBankReconciliationControlRegistryUseCase,
  ListTenantAccountingBankStatementRegistryUseCase,
  ListTenantAccountingJournalRegistryUseCase,
  ListTenantAccountingPeriodLockRegistryUseCase,
  LockTenantAccountingPeriodUseCase,
  ManageTenantAccountingChartMappingUseCase,
  RequestTenantAccountingJournalDraftApprovalPacketUseCase,
  RequestTenantAccountingFinancialStatementReviewPacketUseCase,
  RequestTenantAccountingPeriodCloseoutPacketUseCase,
  RequestTenantAccountingPeriodReopenPacketUseCase,
  RecordTenantAccountingBankReconciliationControlUseCase,
  RecordTenantAccountingBankStatementImportUseCase,
  RequestTenantAccountingReconciliationExceptionPacketUseCase,
  RequestTenantAccountingReconciliationExceptionResolutionPacketUseCase,
  RequestTenantAccountingReconciliationMatchPacketUseCase,
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
      provide: GetTenantAccountingBankStatementImportWorkspaceUseCase,
      useFactory: () =>
        new GetTenantAccountingBankStatementImportWorkspaceUseCase(),
    },
    {
      provide: RecordTenantAccountingBankStatementImportUseCase,
      inject: [
        ACCOUNTING_BANK_STATEMENT_REPOSITORY,
        ACCOUNTING_BANK_STATEMENT_BATCH_ID_GENERATOR,
        ACCOUNTING_BANK_STATEMENT_LINE_ID_GENERATOR,
        TENANT_REPOSITORY,
        GetTenantAccountingBankStatementImportWorkspaceUseCase,
      ],
      useFactory: (
        accountingBankStatementRepository,
        accountingBankStatementBatchIdGenerator,
        accountingBankStatementLineIdGenerator,
        tenantRepository,
        getTenantAccountingBankStatementImportWorkspaceUseCase,
      ) =>
        new RecordTenantAccountingBankStatementImportUseCase(
          accountingBankStatementRepository,
          accountingBankStatementBatchIdGenerator,
          accountingBankStatementLineIdGenerator,
          tenantRepository,
          getTenantAccountingBankStatementImportWorkspaceUseCase,
        ),
    },
    {
      provide: ListTenantAccountingBankStatementRegistryUseCase,
      inject: [ACCOUNTING_BANK_STATEMENT_REPOSITORY],
      useFactory: (accountingBankStatementRepository) =>
        new ListTenantAccountingBankStatementRegistryUseCase(
          accountingBankStatementRepository,
        ),
    },
    {
      provide: GetTenantAccountingBankReconciliationWorkspaceUseCase,
      inject: [
        GetTenantAccountingLedgerRegistryWorkspaceUseCase,
        ListTenantAccountingJournalRegistryUseCase,
        ListTenantAccountingBankStatementRegistryUseCase,
      ],
      useFactory: (
        getTenantAccountingLedgerRegistryWorkspaceUseCase,
        listTenantAccountingJournalRegistryUseCase,
        listTenantAccountingBankStatementRegistryUseCase,
      ) =>
        new GetTenantAccountingBankReconciliationWorkspaceUseCase(
          getTenantAccountingLedgerRegistryWorkspaceUseCase,
          listTenantAccountingJournalRegistryUseCase,
          listTenantAccountingBankStatementRegistryUseCase,
        ),
    },
    {
      provide: RecordTenantAccountingBankReconciliationControlUseCase,
      inject: [
        ACCOUNTING_BANK_RECONCILIATION_CONTROL_REPOSITORY,
        ACCOUNTING_BANK_RECONCILIATION_CONTROL_ID_GENERATOR,
        TENANT_REPOSITORY,
      ],
      useFactory: (
        accountingBankReconciliationControlRepository,
        accountingBankReconciliationControlIdGenerator,
        tenantRepository,
      ) =>
        new RecordTenantAccountingBankReconciliationControlUseCase(
          accountingBankReconciliationControlRepository,
          accountingBankReconciliationControlIdGenerator,
          tenantRepository,
        ),
    },
    {
      provide: ListTenantAccountingBankReconciliationControlRegistryUseCase,
      inject: [ACCOUNTING_BANK_RECONCILIATION_CONTROL_REPOSITORY],
      useFactory: (accountingBankReconciliationControlRepository) =>
        new ListTenantAccountingBankReconciliationControlRegistryUseCase(
          accountingBankReconciliationControlRepository,
        ),
    },
    {
      provide: RequestTenantAccountingReconciliationMatchPacketUseCase,
      inject: [
        GetTenantAccountingBankReconciliationWorkspaceUseCase,
        RecordTenantAccountingBankReconciliationControlUseCase,
      ],
      useFactory: (
        getTenantAccountingBankReconciliationWorkspaceUseCase,
        recordTenantAccountingBankReconciliationControlUseCase,
      ) =>
        new RequestTenantAccountingReconciliationMatchPacketUseCase(
          getTenantAccountingBankReconciliationWorkspaceUseCase,
          recordTenantAccountingBankReconciliationControlUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingReconciliationExceptionPacketUseCase,
      inject: [
        GetTenantAccountingBankReconciliationWorkspaceUseCase,
        ListTenantAccountingJournalRegistryUseCase,
      ],
      useFactory: (
        getTenantAccountingBankReconciliationWorkspaceUseCase,
        listTenantAccountingJournalRegistryUseCase,
      ) =>
        new RequestTenantAccountingReconciliationExceptionPacketUseCase(
          getTenantAccountingBankReconciliationWorkspaceUseCase,
          listTenantAccountingJournalRegistryUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingReconciliationExceptionResolutionPacketUseCase,
      inject: [
        RequestTenantAccountingReconciliationExceptionPacketUseCase,
        RecordTenantAccountingBankReconciliationControlUseCase,
      ],
      useFactory: (
        requestTenantAccountingReconciliationExceptionPacketUseCase,
        recordTenantAccountingBankReconciliationControlUseCase,
      ) =>
        new RequestTenantAccountingReconciliationExceptionResolutionPacketUseCase(
          requestTenantAccountingReconciliationExceptionPacketUseCase,
          recordTenantAccountingBankReconciliationControlUseCase,
        ),
    },
    {
      provide: GetTenantAccountingPeriodCashCloseoutReadinessUseCase,
      inject: [
        ListTenantAccountingBankStatementRegistryUseCase,
        GetTenantAccountingBankReconciliationWorkspaceUseCase,
        ListTenantAccountingBankReconciliationControlRegistryUseCase,
        RequestTenantAccountingReconciliationExceptionPacketUseCase,
      ],
      useFactory: (
        listTenantAccountingBankStatementRegistryUseCase,
        getTenantAccountingBankReconciliationWorkspaceUseCase,
        listTenantAccountingBankReconciliationControlRegistryUseCase,
        requestTenantAccountingReconciliationExceptionPacketUseCase,
      ) =>
        new GetTenantAccountingPeriodCashCloseoutReadinessUseCase(
          listTenantAccountingBankStatementRegistryUseCase,
          getTenantAccountingBankReconciliationWorkspaceUseCase,
          listTenantAccountingBankReconciliationControlRegistryUseCase,
          requestTenantAccountingReconciliationExceptionPacketUseCase,
        ),
    },
    {
      provide: GetTenantAccountingPeriodReconciliationReadinessUseCase,
      inject: [GetTenantAccountingBankReconciliationWorkspaceUseCase],
      useFactory: (getTenantAccountingBankReconciliationWorkspaceUseCase) =>
        new GetTenantAccountingPeriodReconciliationReadinessUseCase(
          getTenantAccountingBankReconciliationWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantAccountingPeriodCloseoutReadinessUseCase,
      inject: [
        GetTenantAccountingChartOfAccountsWorkspaceUseCase,
        ListTenantAccountingJournalRegistryUseCase,
        GetTenantAccountingLedgerRegistryWorkspaceUseCase,
        GetTenantAccountingPeriodReconciliationReadinessUseCase,
        GetTenantEcuadorTaxOperationalCloseoutUseCase,
      ],
      useFactory: (
        getTenantAccountingChartOfAccountsWorkspaceUseCase,
        listTenantAccountingJournalRegistryUseCase,
        getTenantAccountingLedgerRegistryWorkspaceUseCase,
        getTenantAccountingPeriodReconciliationReadinessUseCase,
        getTenantEcuadorTaxOperationalCloseoutUseCase,
      ) =>
        new GetTenantAccountingPeriodCloseoutReadinessUseCase(
          getTenantAccountingChartOfAccountsWorkspaceUseCase,
          listTenantAccountingJournalRegistryUseCase,
          getTenantAccountingLedgerRegistryWorkspaceUseCase,
          getTenantAccountingPeriodReconciliationReadinessUseCase,
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
      provide: CreateTenantAccountingAdjustingJournalEntryUseCase,
      inject: [
        ACCOUNTING_JOURNAL_ENTRY_REPOSITORY,
        ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR,
        TENANT_REPOSITORY,
      ],
      useFactory: (
        accountingJournalEntryRepository,
        accountingJournalEntryIdGenerator,
        tenantRepository,
      ) =>
        new CreateTenantAccountingAdjustingJournalEntryUseCase(
          accountingJournalEntryRepository,
          accountingJournalEntryIdGenerator,
          tenantRepository,
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
      provide: GetTenantAccountingPeriodLockReadinessUseCase,
      inject: [
        ListTenantAccountingJournalRegistryUseCase,
        GetTenantAccountingTrialBalanceWorkspaceUseCase,
        GetTenantAccountingPeriodCloseoutReadinessUseCase,
        RequestTenantAccountingPeriodCloseoutPacketUseCase,
        GetTenantAccountingPeriodCloseoutReportUseCase,
        GetTenantAccountingPeriodCashCloseoutReadinessUseCase,
      ],
      useFactory: (
        listTenantAccountingJournalRegistryUseCase,
        getTenantAccountingTrialBalanceWorkspaceUseCase,
        getTenantAccountingPeriodCloseoutReadinessUseCase,
        requestTenantAccountingPeriodCloseoutPacketUseCase,
        getTenantAccountingPeriodCloseoutReportUseCase,
        getTenantAccountingPeriodCashCloseoutReadinessUseCase,
      ) =>
        new GetTenantAccountingPeriodLockReadinessUseCase(
          listTenantAccountingJournalRegistryUseCase,
          getTenantAccountingTrialBalanceWorkspaceUseCase,
          getTenantAccountingPeriodCloseoutReadinessUseCase,
          requestTenantAccountingPeriodCloseoutPacketUseCase,
          getTenantAccountingPeriodCloseoutReportUseCase,
          getTenantAccountingPeriodCashCloseoutReadinessUseCase,
        ),
    },
    {
      provide: GetTenantAccountingFinancialStatementPreviewUseCase,
      inject: [GetTenantAccountingTrialBalanceWorkspaceUseCase],
      useFactory: (getTenantAccountingTrialBalanceWorkspaceUseCase) =>
        new GetTenantAccountingFinancialStatementPreviewUseCase(
          getTenantAccountingTrialBalanceWorkspaceUseCase,
        ),
    },
    {
      provide: ListTenantAccountingPeriodLockRegistryUseCase,
      inject: [
        ACCOUNTING_PERIOD_CONTROL_REPOSITORY,
        GetTenantAccountingPeriodLockReadinessUseCase,
      ],
      useFactory: (
        accountingPeriodControlRepository,
        getTenantAccountingPeriodLockReadinessUseCase,
      ) =>
        new ListTenantAccountingPeriodLockRegistryUseCase(
          accountingPeriodControlRepository,
          getTenantAccountingPeriodLockReadinessUseCase,
        ),
    },
    {
      provide: LockTenantAccountingPeriodUseCase,
      inject: [
        ACCOUNTING_PERIOD_CONTROL_REPOSITORY,
        ACCOUNTING_PERIOD_CONTROL_ID_GENERATOR,
        TENANT_REPOSITORY,
        GetTenantAccountingPeriodLockReadinessUseCase,
        GetTenantAccountingPeriodCloseoutReportUseCase,
        GetTenantAccountingFinancialStatementPreviewUseCase,
        ListTenantAccountingPeriodLockRegistryUseCase,
      ],
      useFactory: (
        accountingPeriodControlRepository,
        accountingPeriodControlIdGenerator,
        tenantRepository,
        getTenantAccountingPeriodLockReadinessUseCase,
        getTenantAccountingPeriodCloseoutReportUseCase,
        getTenantAccountingFinancialStatementPreviewUseCase,
        listTenantAccountingPeriodLockRegistryUseCase,
      ) =>
        new LockTenantAccountingPeriodUseCase(
          accountingPeriodControlRepository,
          accountingPeriodControlIdGenerator,
          tenantRepository,
          getTenantAccountingPeriodLockReadinessUseCase,
          getTenantAccountingPeriodCloseoutReportUseCase,
          getTenantAccountingFinancialStatementPreviewUseCase,
          listTenantAccountingPeriodLockRegistryUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingPeriodReopenPacketUseCase,
      inject: [
        ACCOUNTING_PERIOD_CONTROL_REPOSITORY,
        ACCOUNTING_PERIOD_CONTROL_ID_GENERATOR,
        TENANT_REPOSITORY,
        ListTenantAccountingPeriodLockRegistryUseCase,
        ListTenantAccountingJournalRegistryUseCase,
        GetTenantAccountingTrialBalanceWorkspaceUseCase,
        GetTenantAccountingFinancialStatementPreviewUseCase,
        GetTenantAccountingPeriodCloseoutReadinessUseCase,
      ],
      useFactory: (
        accountingPeriodControlRepository,
        accountingPeriodControlIdGenerator,
        tenantRepository,
        listTenantAccountingPeriodLockRegistryUseCase,
        listTenantAccountingJournalRegistryUseCase,
        getTenantAccountingTrialBalanceWorkspaceUseCase,
        getTenantAccountingFinancialStatementPreviewUseCase,
        getTenantAccountingPeriodCloseoutReadinessUseCase,
      ) =>
        new RequestTenantAccountingPeriodReopenPacketUseCase(
          accountingPeriodControlRepository,
          accountingPeriodControlIdGenerator,
          tenantRepository,
          listTenantAccountingPeriodLockRegistryUseCase,
          listTenantAccountingJournalRegistryUseCase,
          getTenantAccountingTrialBalanceWorkspaceUseCase,
          getTenantAccountingFinancialStatementPreviewUseCase,
          getTenantAccountingPeriodCloseoutReadinessUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAuditTrailWorkspaceUseCase,
      inject: [
        ACCOUNTING_PERIOD_CONTROL_REPOSITORY,
        ListTenantAccountingJournalRegistryUseCase,
      ],
      useFactory: (
        accountingPeriodControlRepository,
        listTenantAccountingJournalRegistryUseCase,
      ) =>
        new GetTenantAccountingAuditTrailWorkspaceUseCase(
          accountingPeriodControlRepository,
          listTenantAccountingJournalRegistryUseCase,
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
      provide: RequestTenantAccountingFinancialStatementReviewPacketUseCase,
      inject: [
        GetTenantAccountingFinancialStatementPreviewUseCase,
        GetTenantAccountingPeriodCloseoutReportUseCase,
      ],
      useFactory: (
        getTenantAccountingFinancialStatementPreviewUseCase,
        getTenantAccountingPeriodCloseoutReportUseCase,
      ) =>
        new RequestTenantAccountingFinancialStatementReviewPacketUseCase(
          getTenantAccountingFinancialStatementPreviewUseCase,
          getTenantAccountingPeriodCloseoutReportUseCase,
        ),
    },
    {
      provide: GetTenantAccountingPeriodEvidenceVaultUseCase,
      inject: [
        ListTenantAccountingJournalRegistryUseCase,
        GetTenantAccountingLedgerRegistryWorkspaceUseCase,
        GetTenantAccountingTrialBalanceWorkspaceUseCase,
        GetTenantAccountingPeriodCloseoutReportUseCase,
        GetTenantAccountingFinancialStatementPreviewUseCase,
        ListTenantAccountingBankStatementRegistryUseCase,
        ListTenantAccountingBankReconciliationControlRegistryUseCase,
        GetTenantAccountingPeriodCashCloseoutReadinessUseCase,
        ListTenantAccountingPeriodLockRegistryUseCase,
        GetTenantAccountingAuditTrailWorkspaceUseCase,
      ],
      useFactory: (
        listTenantAccountingJournalRegistryUseCase,
        getTenantAccountingLedgerRegistryWorkspaceUseCase,
        getTenantAccountingTrialBalanceWorkspaceUseCase,
        getTenantAccountingPeriodCloseoutReportUseCase,
        getTenantAccountingFinancialStatementPreviewUseCase,
        listTenantAccountingBankStatementRegistryUseCase,
        listTenantAccountingBankReconciliationControlRegistryUseCase,
        getTenantAccountingPeriodCashCloseoutReadinessUseCase,
        listTenantAccountingPeriodLockRegistryUseCase,
        getTenantAccountingAuditTrailWorkspaceUseCase,
      ) =>
        new GetTenantAccountingPeriodEvidenceVaultUseCase(
          listTenantAccountingJournalRegistryUseCase,
          getTenantAccountingLedgerRegistryWorkspaceUseCase,
          getTenantAccountingTrialBalanceWorkspaceUseCase,
          getTenantAccountingPeriodCloseoutReportUseCase,
          getTenantAccountingFinancialStatementPreviewUseCase,
          listTenantAccountingBankStatementRegistryUseCase,
          listTenantAccountingBankReconciliationControlRegistryUseCase,
          getTenantAccountingPeriodCashCloseoutReadinessUseCase,
          listTenantAccountingPeriodLockRegistryUseCase,
          getTenantAccountingAuditTrailWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAccountantHandoffWorkspaceUseCase,
      inject: [
        GetTenantAccountingPeriodEvidenceVaultUseCase,
        RequestTenantAccountingFinancialStatementReviewPacketUseCase,
      ],
      useFactory: (
        getTenantAccountingPeriodEvidenceVaultUseCase,
        requestTenantAccountingFinancialStatementReviewPacketUseCase,
      ) =>
        new GetTenantAccountingAccountantHandoffWorkspaceUseCase(
          getTenantAccountingPeriodEvidenceVaultUseCase,
          requestTenantAccountingFinancialStatementReviewPacketUseCase,
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
