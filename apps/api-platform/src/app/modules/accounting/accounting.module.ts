import { Module } from '@nestjs/common';
import {
  ACCOUNTING_ACCOUNTANT_REVIEW_ID_GENERATOR,
  ACCOUNTING_ACCOUNTANT_REVIEW_REPOSITORY,
  ACCOUNTING_BANK_RECONCILIATION_CONTROL_ID_GENERATOR,
  ACCOUNTING_BANK_RECONCILIATION_CONTROL_REPOSITORY,
  ACCOUNTING_BANK_STATEMENT_BATCH_ID_GENERATOR,
  ACCOUNTING_BANK_STATEMENT_LINE_ID_GENERATOR,
  ACCOUNTING_BANK_STATEMENT_REPOSITORY,
  ACCOUNTING_CORRECTION_ID_GENERATOR,
  ACCOUNTING_CORRECTION_REPOSITORY,
  ACCOUNTING_EVIDENCE_ATTACHMENT_ID_GENERATOR,
  ACCOUNTING_EVIDENCE_ATTACHMENT_REPOSITORY,
  ACCOUNTING_EXTERNAL_CLOSEOUT_RECORD_ID_GENERATOR,
  ACCOUNTING_EXTERNAL_CLOSEOUT_RECORD_REPOSITORY,
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
  GetTenantAccountingCloseoutCertificationReadinessUseCase,
  GetTenantAccountingFoundationCloseoutSummaryUseCase,
  GetTenantAccountingLegalBooksReadinessPacketUseCase,
  GetTenantAccountingPeriodCloseoutTimelineUseCase,
  GetTenantAccountingPeriodNarrativeReportUseCase,
  GetTenantAccountingProfessionalCloseoutWorkspaceUseCase,
  GetTenantAccountingFinancialStatementPreviewUseCase,
  GetTenantAccountingIntakeWorkspaceUseCase,
  GetTenantAccountingJournalDraftPreviewUseCase,
  GetTenantAccountingLedgerRegistryWorkspaceUseCase,
  GetTenantAccountingLedgerPreviewWorkspaceUseCase,
  GetTenantAccountingOpeningBalanceWorkspaceUseCase,
  GetTenantAccountingPeriodCashCloseoutReadinessUseCase,
  GetTenantAccountingPeriodCloseoutReportUseCase,
  GetTenantAccountingPeriodCloseoutReadinessUseCase,
  GetTenantAccountingPeriodEvidenceVaultUseCase,
  GetTenantAccountingPeriodLockReadinessUseCase,
  GetTenantAccountingPeriodReconciliationReadinessUseCase,
  GetTenantAccountingTrialBalanceWorkspaceUseCase,
  ListTenantAccountingBankReconciliationControlRegistryUseCase,
  ListTenantAccountingBankStatementRegistryUseCase,
  ListTenantAccountingAccountantReviewsUseCase,
  ListTenantAccountingCorrectionsQueueUseCase,
  ListTenantAccountingEvidenceAttachmentRegistryUseCase,
  ListTenantAccountingExternalCloseoutRecordsUseCase,
  ListTenantAccountingJournalRegistryUseCase,
  ListTenantAccountingPeriodLockRegistryUseCase,
  LockTenantAccountingPeriodUseCase,
  ManageTenantAccountingChartMappingUseCase,
  RequestTenantAccountingJournalDraftApprovalPacketUseCase,
  RequestTenantAccountingAccountantReviewUseCase,
  RequestTenantAccountingAdjustmentRecommendationPacketUseCase,
  RequestTenantAccountingAiReviewAssistantPacketUseCase,
  RequestTenantAccountingFinancialStatementFinalReviewPacketUseCase,
  RequestTenantAccountingFinancialStatementReviewPacketUseCase,
  RequestTenantAccountingPeriodCloseoutPacketUseCase,
  RequestTenantAccountingPeriodReopenPacketUseCase,
  RecordTenantAccountingBankReconciliationControlUseCase,
  RecordTenantAccountingBankStatementImportUseCase,
  RecordTenantAccountingCorrectionUseCase,
  RecordTenantAccountingEvidenceAttachmentUseCase,
  RecordTenantAccountingExternalCloseoutRecordUseCase,
  RequestTenantAccountingReconciliationExceptionPacketUseCase,
  RequestTenantAccountingReconciliationExceptionResolutionPacketUseCase,
  RequestTenantAccountingReconciliationMatchPacketUseCase,
  RequestTenantAccountingProfessionalCloseoutArtifactPacketUseCase,
  RequestTenantAccountingReviewResolutionPacketUseCase,
  TransitionTenantAccountingAccountantReviewUseCase,
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
      provide: GetTenantAccountingOpeningBalanceWorkspaceUseCase,
      inject: [
        GetTenantAccountingChartOfAccountsWorkspaceUseCase,
        GetTenantAccountingLedgerRegistryWorkspaceUseCase,
      ],
      useFactory: (
        getTenantAccountingChartOfAccountsWorkspaceUseCase,
        getTenantAccountingLedgerRegistryWorkspaceUseCase,
      ) =>
        new GetTenantAccountingOpeningBalanceWorkspaceUseCase(
          getTenantAccountingChartOfAccountsWorkspaceUseCase,
          getTenantAccountingLedgerRegistryWorkspaceUseCase,
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
      provide:
        RequestTenantAccountingReconciliationExceptionResolutionPacketUseCase,
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
      provide: RequestTenantAccountingAccountantReviewUseCase,
      inject: [
        TENANT_REPOSITORY,
        ACCOUNTING_ACCOUNTANT_REVIEW_REPOSITORY,
        ACCOUNTING_ACCOUNTANT_REVIEW_ID_GENERATOR,
        GetTenantAccountingAccountantHandoffWorkspaceUseCase,
      ],
      useFactory: (
        tenantRepository,
        accountingAccountantReviewRepository,
        accountingAccountantReviewIdGenerator,
        getTenantAccountingAccountantHandoffWorkspaceUseCase,
      ) =>
        new RequestTenantAccountingAccountantReviewUseCase(
          tenantRepository,
          accountingAccountantReviewRepository,
          accountingAccountantReviewIdGenerator,
          getTenantAccountingAccountantHandoffWorkspaceUseCase,
        ),
    },
    {
      provide: ListTenantAccountingAccountantReviewsUseCase,
      inject: [TENANT_REPOSITORY, ACCOUNTING_ACCOUNTANT_REVIEW_REPOSITORY],
      useFactory: (tenantRepository, accountingAccountantReviewRepository) =>
        new ListTenantAccountingAccountantReviewsUseCase(
          tenantRepository,
          accountingAccountantReviewRepository,
        ),
    },
    {
      provide: TransitionTenantAccountingAccountantReviewUseCase,
      inject: [TENANT_REPOSITORY, ACCOUNTING_ACCOUNTANT_REVIEW_REPOSITORY],
      useFactory: (tenantRepository, accountingAccountantReviewRepository) =>
        new TransitionTenantAccountingAccountantReviewUseCase(
          tenantRepository,
          accountingAccountantReviewRepository,
        ),
    },
    {
      provide: RequestTenantAccountingReviewResolutionPacketUseCase,
      inject: [
        TENANT_REPOSITORY,
        ACCOUNTING_ACCOUNTANT_REVIEW_REPOSITORY,
        GetTenantAccountingAccountantHandoffWorkspaceUseCase,
      ],
      useFactory: (
        tenantRepository,
        accountingAccountantReviewRepository,
        getTenantAccountingAccountantHandoffWorkspaceUseCase,
      ) =>
        new RequestTenantAccountingReviewResolutionPacketUseCase(
          tenantRepository,
          accountingAccountantReviewRepository,
          getTenantAccountingAccountantHandoffWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantAccountingCloseoutCertificationReadinessUseCase,
      inject: [
        TENANT_REPOSITORY,
        ACCOUNTING_ACCOUNTANT_REVIEW_REPOSITORY,
        GetTenantAccountingAccountantHandoffWorkspaceUseCase,
        GetTenantAccountingOpeningBalanceWorkspaceUseCase,
        RequestTenantAccountingReviewResolutionPacketUseCase,
      ],
      useFactory: (
        tenantRepository,
        accountingAccountantReviewRepository,
        getTenantAccountingAccountantHandoffWorkspaceUseCase,
        getTenantAccountingOpeningBalanceWorkspaceUseCase,
        requestTenantAccountingReviewResolutionPacketUseCase,
      ) =>
        new GetTenantAccountingCloseoutCertificationReadinessUseCase(
          tenantRepository,
          accountingAccountantReviewRepository,
          getTenantAccountingAccountantHandoffWorkspaceUseCase,
          getTenantAccountingOpeningBalanceWorkspaceUseCase,
          requestTenantAccountingReviewResolutionPacketUseCase,
        ),
    },
    {
      provide: RecordTenantAccountingCorrectionUseCase,
      inject: [
        TENANT_REPOSITORY,
        ACCOUNTING_CORRECTION_REPOSITORY,
        ACCOUNTING_CORRECTION_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        accountingCorrectionRepository,
        accountingCorrectionIdGenerator,
      ) =>
        new RecordTenantAccountingCorrectionUseCase(
          tenantRepository,
          accountingCorrectionRepository,
          accountingCorrectionIdGenerator,
        ),
    },
    {
      provide: ListTenantAccountingCorrectionsQueueUseCase,
      inject: [ACCOUNTING_CORRECTION_REPOSITORY],
      useFactory: (accountingCorrectionRepository) =>
        new ListTenantAccountingCorrectionsQueueUseCase(
          accountingCorrectionRepository,
        ),
    },
    {
      provide: RequestTenantAccountingAdjustmentRecommendationPacketUseCase,
      inject: [ListTenantAccountingCorrectionsQueueUseCase],
      useFactory: (listTenantAccountingCorrectionsQueueUseCase) =>
        new RequestTenantAccountingAdjustmentRecommendationPacketUseCase(
          listTenantAccountingCorrectionsQueueUseCase,
        ),
    },
    {
      provide: RecordTenantAccountingEvidenceAttachmentUseCase,
      inject: [
        TENANT_REPOSITORY,
        ACCOUNTING_EVIDENCE_ATTACHMENT_REPOSITORY,
        ACCOUNTING_EVIDENCE_ATTACHMENT_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        accountingEvidenceAttachmentRepository,
        accountingEvidenceAttachmentIdGenerator,
      ) =>
        new RecordTenantAccountingEvidenceAttachmentUseCase(
          tenantRepository,
          accountingEvidenceAttachmentRepository,
          accountingEvidenceAttachmentIdGenerator,
        ),
    },
    {
      provide: ListTenantAccountingEvidenceAttachmentRegistryUseCase,
      inject: [
        ACCOUNTING_EVIDENCE_ATTACHMENT_REPOSITORY,
        GetTenantAccountingPeriodEvidenceVaultUseCase,
      ],
      useFactory: (
        accountingEvidenceAttachmentRepository,
        getTenantAccountingPeriodEvidenceVaultUseCase,
      ) =>
        new ListTenantAccountingEvidenceAttachmentRegistryUseCase(
          accountingEvidenceAttachmentRepository,
          getTenantAccountingPeriodEvidenceVaultUseCase,
        ),
    },
    {
      provide: GetTenantAccountingPeriodNarrativeReportUseCase,
      inject: [
        GetTenantAccountingCloseoutCertificationReadinessUseCase,
        ListTenantAccountingCorrectionsQueueUseCase,
        ListTenantAccountingEvidenceAttachmentRegistryUseCase,
      ],
      useFactory: (
        getTenantAccountingCloseoutCertificationReadinessUseCase,
        listTenantAccountingCorrectionsQueueUseCase,
        listTenantAccountingEvidenceAttachmentRegistryUseCase,
      ) =>
        new GetTenantAccountingPeriodNarrativeReportUseCase(
          getTenantAccountingCloseoutCertificationReadinessUseCase,
          listTenantAccountingCorrectionsQueueUseCase,
          listTenantAccountingEvidenceAttachmentRegistryUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAiReviewAssistantPacketUseCase,
      inject: [
        GetTenantAccountingCloseoutCertificationReadinessUseCase,
        ListTenantAccountingCorrectionsQueueUseCase,
      ],
      useFactory: (
        getTenantAccountingCloseoutCertificationReadinessUseCase,
        listTenantAccountingCorrectionsQueueUseCase,
      ) =>
        new RequestTenantAccountingAiReviewAssistantPacketUseCase(
          getTenantAccountingCloseoutCertificationReadinessUseCase,
          listTenantAccountingCorrectionsQueueUseCase,
        ),
    },
    {
      provide: GetTenantAccountingProfessionalCloseoutWorkspaceUseCase,
      inject: [
        GetTenantAccountingCloseoutCertificationReadinessUseCase,
        ListTenantAccountingCorrectionsQueueUseCase,
        RequestTenantAccountingAdjustmentRecommendationPacketUseCase,
        ListTenantAccountingEvidenceAttachmentRegistryUseCase,
        GetTenantAccountingPeriodNarrativeReportUseCase,
        RequestTenantAccountingAiReviewAssistantPacketUseCase,
      ],
      useFactory: (
        getTenantAccountingCloseoutCertificationReadinessUseCase,
        listTenantAccountingCorrectionsQueueUseCase,
        requestTenantAccountingAdjustmentRecommendationPacketUseCase,
        listTenantAccountingEvidenceAttachmentRegistryUseCase,
        getTenantAccountingPeriodNarrativeReportUseCase,
        requestTenantAccountingAiReviewAssistantPacketUseCase,
      ) =>
        new GetTenantAccountingProfessionalCloseoutWorkspaceUseCase(
          getTenantAccountingCloseoutCertificationReadinessUseCase,
          listTenantAccountingCorrectionsQueueUseCase,
          requestTenantAccountingAdjustmentRecommendationPacketUseCase,
          listTenantAccountingEvidenceAttachmentRegistryUseCase,
          getTenantAccountingPeriodNarrativeReportUseCase,
          requestTenantAccountingAiReviewAssistantPacketUseCase,
        ),
    },
    {
      provide: RecordTenantAccountingExternalCloseoutRecordUseCase,
      inject: [
        TENANT_REPOSITORY,
        ACCOUNTING_EXTERNAL_CLOSEOUT_RECORD_REPOSITORY,
        ACCOUNTING_EXTERNAL_CLOSEOUT_RECORD_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        accountingExternalCloseoutRecordRepository,
        accountingExternalCloseoutRecordIdGenerator,
      ) =>
        new RecordTenantAccountingExternalCloseoutRecordUseCase(
          tenantRepository,
          accountingExternalCloseoutRecordRepository,
          accountingExternalCloseoutRecordIdGenerator,
        ),
    },
    {
      provide: ListTenantAccountingExternalCloseoutRecordsUseCase,
      inject: [ACCOUNTING_EXTERNAL_CLOSEOUT_RECORD_REPOSITORY],
      useFactory: (accountingExternalCloseoutRecordRepository) =>
        new ListTenantAccountingExternalCloseoutRecordsUseCase(
          accountingExternalCloseoutRecordRepository,
        ),
    },
    {
      provide: RequestTenantAccountingProfessionalCloseoutArtifactPacketUseCase,
      inject: [
        GetTenantAccountingProfessionalCloseoutWorkspaceUseCase,
        ListTenantAccountingExternalCloseoutRecordsUseCase,
      ],
      useFactory: (
        getTenantAccountingProfessionalCloseoutWorkspaceUseCase,
        listTenantAccountingExternalCloseoutRecordsUseCase,
      ) =>
        new RequestTenantAccountingProfessionalCloseoutArtifactPacketUseCase(
          getTenantAccountingProfessionalCloseoutWorkspaceUseCase,
          listTenantAccountingExternalCloseoutRecordsUseCase,
        ),
    },
    {
      provide: GetTenantAccountingPeriodCloseoutTimelineUseCase,
      inject: [
        GetTenantAccountingAuditTrailWorkspaceUseCase,
        ListTenantAccountingCorrectionsQueueUseCase,
        ListTenantAccountingEvidenceAttachmentRegistryUseCase,
        ListTenantAccountingExternalCloseoutRecordsUseCase,
      ],
      useFactory: (
        getTenantAccountingAuditTrailWorkspaceUseCase,
        listTenantAccountingCorrectionsQueueUseCase,
        listTenantAccountingEvidenceAttachmentRegistryUseCase,
        listTenantAccountingExternalCloseoutRecordsUseCase,
      ) =>
        new GetTenantAccountingPeriodCloseoutTimelineUseCase(
          getTenantAccountingAuditTrailWorkspaceUseCase,
          listTenantAccountingCorrectionsQueueUseCase,
          listTenantAccountingEvidenceAttachmentRegistryUseCase,
          listTenantAccountingExternalCloseoutRecordsUseCase,
        ),
    },
    {
      provide: GetTenantAccountingLegalBooksReadinessPacketUseCase,
      inject: [
        ListTenantAccountingPeriodLockRegistryUseCase,
        ListTenantAccountingJournalRegistryUseCase,
        GetTenantAccountingLedgerRegistryWorkspaceUseCase,
        GetTenantAccountingFinancialStatementPreviewUseCase,
        GetTenantAccountingPeriodLockReadinessUseCase,
        ListTenantAccountingExternalCloseoutRecordsUseCase,
      ],
      useFactory: (
        listTenantAccountingPeriodLockRegistryUseCase,
        listTenantAccountingJournalRegistryUseCase,
        getTenantAccountingLedgerRegistryWorkspaceUseCase,
        getTenantAccountingFinancialStatementPreviewUseCase,
        getTenantAccountingPeriodLockReadinessUseCase,
        listTenantAccountingExternalCloseoutRecordsUseCase,
      ) =>
        new GetTenantAccountingLegalBooksReadinessPacketUseCase(
          listTenantAccountingPeriodLockRegistryUseCase,
          listTenantAccountingJournalRegistryUseCase,
          getTenantAccountingLedgerRegistryWorkspaceUseCase,
          getTenantAccountingFinancialStatementPreviewUseCase,
          getTenantAccountingPeriodLockReadinessUseCase,
          listTenantAccountingExternalCloseoutRecordsUseCase,
        ),
    },
    {
      provide:
        RequestTenantAccountingFinancialStatementFinalReviewPacketUseCase,
      inject: [
        GetTenantAccountingFinancialStatementPreviewUseCase,
        GetTenantAccountingProfessionalCloseoutWorkspaceUseCase,
        ListTenantAccountingExternalCloseoutRecordsUseCase,
      ],
      useFactory: (
        getTenantAccountingFinancialStatementPreviewUseCase,
        getTenantAccountingProfessionalCloseoutWorkspaceUseCase,
        listTenantAccountingExternalCloseoutRecordsUseCase,
      ) =>
        new RequestTenantAccountingFinancialStatementFinalReviewPacketUseCase(
          getTenantAccountingFinancialStatementPreviewUseCase,
          getTenantAccountingProfessionalCloseoutWorkspaceUseCase,
          listTenantAccountingExternalCloseoutRecordsUseCase,
        ),
    },
    {
      provide: GetTenantAccountingFoundationCloseoutSummaryUseCase,
      inject: [
        GetTenantAccountingProfessionalCloseoutWorkspaceUseCase,
        GetTenantAccountingLegalBooksReadinessPacketUseCase,
        RequestTenantAccountingFinancialStatementFinalReviewPacketUseCase,
        GetTenantAccountingPeriodCloseoutTimelineUseCase,
      ],
      useFactory: (
        getTenantAccountingProfessionalCloseoutWorkspaceUseCase,
        getTenantAccountingLegalBooksReadinessPacketUseCase,
        requestTenantAccountingFinancialStatementFinalReviewPacketUseCase,
        getTenantAccountingPeriodCloseoutTimelineUseCase,
      ) =>
        new GetTenantAccountingFoundationCloseoutSummaryUseCase(
          getTenantAccountingProfessionalCloseoutWorkspaceUseCase,
          getTenantAccountingLegalBooksReadinessPacketUseCase,
          requestTenantAccountingFinancialStatementFinalReviewPacketUseCase,
          getTenantAccountingPeriodCloseoutTimelineUseCase,
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
