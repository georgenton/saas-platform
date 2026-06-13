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
  CreateTenantAccountingOpeningBalanceJournalEntryUseCase,
  GetTenantAccountingAccountantDiscoveryWorkspaceUseCase,
  GetTenantAccountingAccountantHandoffWorkspaceUseCase,
  GetTenantAccountingAdvancedMvpScopeDecisionRecordUseCase,
  GetTenantAccountingAdvancedMvpScopeRegistryUseCase,
  GetTenantAccountingAdvancedMvpCommandCenterUseCase,
  GetTenantAccountingAdvancedMvpExecutionAnchorUseCase,
  GetTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase,
  GetTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase,
  GetTenantAccountingAdvancedPilotAccountantReviewRoomUseCase,
  GetTenantAccountingAdvancedPilotEnrollmentUseCase,
  GetTenantAccountingAdvancedPilotEvidenceSnapshotUseCase,
  GetTenantAccountingAdvancedPilotRunbookUseCase,
  GetTenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintUseCase,
  GetTenantAccountingAdvancedExternalAccountantAcceptanceCriteriaUseCase,
  GetTenantAccountingAdvancedFormalBooksBoundaryBlueprintUseCase,
  GetTenantAccountingAdvancedPilotLearningRegistryUseCase,
  GetTenantAccountingAdvancedProductGraduationMatrixUseCase,
  GetTenantAccountingAdvancedAdjustmentAutomationWorkbenchUseCase,
  GetTenantAccountingAdvancedExternalAccountantPortalShellUseCase,
  GetTenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceUseCase,
  GetTenantAccountingAdvancedPoliciesClosingTemplateRegistryUseCase,
  GetTenantAccountingAdvancedFormalArtifactDraftRegistryUseCase,
  GetTenantAccountingAdvancedFormalArtifactDraftingAnchorUseCase,
  GetTenantAccountingAdvancedAdjustmentDraftPackUseCase,
  GetTenantAccountingAdvancedCertifiedReconciliationDraftPackUseCase,
  GetTenantAccountingAdvancedFinancialStatementsDraftPackUseCase,
  GetTenantAccountingAdvancedFormalBooksDraftWorkspaceUseCase,
  GetTenantAccountingAdvancedAccountantDraftReviewRoomUseCase,
  GetTenantAccountingAdvancedProfessionalReviewExecutionAnchorUseCase,
  GetTenantAccountingAdvancedReviewChangeRequestPackUseCase,
  GetTenantAccountingAdvancedReviewExecutionCommandCenterUseCase,
  GetTenantAccountingAdvancedApprovalAuthorityMatrixUseCase,
  GetTenantAccountingAdvancedApprovalDecisionWorkspaceUseCase,
  GetTenantAccountingAdvancedFormalApprovalCommandCenterUseCase,
  GetTenantAccountingAdvancedFormalApprovalEvidencePackUseCase,
  GetTenantAccountingAdvancedFormalApprovalWorkflowAnchorUseCase,
  GetTenantAccountingAdvancedCertificationRequirementWorkspaceUseCase,
  GetTenantAccountingAdvancedFormalSignatoryRegistryUseCase,
  GetTenantAccountingAdvancedLegalizationBoundaryPacketUseCase,
  GetTenantAccountingAdvancedSignatureCertificationBoundaryAnchorUseCase,
  GetTenantAccountingAdvancedSignatureEvidenceReadinessPackUseCase,
  GetTenantAccountingAdvancedExternalExecutionHandoffAnchorUseCase,
  GetTenantAccountingAdvancedExternalExecutorAssignmentMatrixUseCase,
  GetTenantAccountingAdvancedExecutionHandoffEvidenceBundleUseCase,
  GetTenantAccountingAdvancedExternalExecutionInstructionPackUseCase,
  GetTenantAccountingAdvancedExecutionReturnEvidenceIntakeUseCase,
  GetTenantAccountingAdvancedExternalExecutionTrackingAnchorUseCase,
  GetTenantAccountingAdvancedExternalExecutionStatusLedgerUseCase,
  GetTenantAccountingAdvancedReturnedEvidenceValidationWorkspaceUseCase,
  GetTenantAccountingAdvancedExternalObservationResolutionQueueUseCase,
  GetTenantAccountingAdvancedExternalExecutionTrackingCommandCenterUseCase,
  GetTenantAccountingAdvancedExternalResultIntakeAnchorUseCase,
  GetTenantAccountingAdvancedReturnedArtifactRegistryUseCase,
  GetTenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceUseCase,
  GetTenantAccountingAdvancedAcceptanceDecisionWorkspaceUseCase,
  GetTenantAccountingAdvancedInternalAcceptanceCommandCenterUseCase,
  GetTenantAccountingAdvancedFormalRecordAssemblyAnchorUseCase,
  GetTenantAccountingAdvancedAcceptedArtifactBinderUseCase,
  GetTenantAccountingAdvancedFormalRecordIndexWorkspaceUseCase,
  GetTenantAccountingAdvancedRecordConsistencyReviewWorkspaceUseCase,
  GetTenantAccountingAdvancedFormalRecordAssemblyCommandCenterUseCase,
  GetTenantAccountingAdvancedFormalRecordCloseoutAnchorUseCase,
  GetTenantAccountingAdvancedArchiveReadinessWorkspaceUseCase,
  GetTenantAccountingAdvancedFormalCloseoutEvidencePacketUseCase,
  GetTenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryUseCase,
  GetTenantAccountingAdvancedFormalRecordCloseoutCommandCenterUseCase,
  GetTenantAccountingAdvancedGraduationArchiveHandoffAnchorUseCase,
  GetTenantAccountingAdvancedArchiveHandoffPackageUseCase,
  GetTenantAccountingAdvancedGraduationSignalMatrixUseCase,
  GetTenantAccountingAdvancedProductScopeDecisionWorkspaceUseCase,
  GetTenantAccountingAdvancedGraduationArchiveHandoffCommandCenterUseCase,
  GetTenantFullAccountingCandidateAnchorUseCase,
  GetTenantFullAccountingCoreLedgerScopeBlueprintUseCase,
  GetTenantFullAccountingBankReconciliationBoundaryUseCase,
  GetTenantFullAccountingFinancialStatementsBlueprintUseCase,
  GetTenantFullAccountingLegalBooksStatutoryBoundaryUseCase,
  GetTenantFullAccountingMvpReadinessAnchorUseCase,
  GetTenantFullAccountingLedgerPersistenceDesignWorkspaceUseCase,
  GetTenantFullAccountingPostingPolicyApprovalBoundaryUseCase,
  GetTenantFullAccountingBankFeedReconciliationMvpReadinessUseCase,
  GetTenantFullAccountingTrialBalanceStatementReadinessUseCase,
  GetTenantFullAccountingMvpOperationsAnchorUseCase,
  GetTenantFullAccountingLedgerWorkbenchMvpUseCase,
  GetTenantFullAccountingPostingDraftLaneUseCase,
  GetTenantFullAccountingBankReconciliationWorkbenchMvpUseCase,
  GetTenantFullAccountingTrialBalancePreviewWorkbenchUseCase,
  GetTenantFullAccountingControlledPilotAnchorUseCase,
  GetTenantFullAccountingPilotEnrollmentPeriodFreezeUseCase,
  GetTenantFullAccountingPilotRunbookWorkspaceUseCase,
  GetTenantFullAccountingPilotAccountantReviewRoomUseCase,
  GetTenantFullAccountingPilotOutcomePacketUseCase,
  GetTenantFullAccountingGraduationAnchorUseCase,
  GetTenantFullAccountingGraduationEvidenceDossierUseCase,
  GetTenantFullAccountingProductScopeGraduationMatrixUseCase,
  GetTenantFullAccountingProfessionalOperatingModelUseCase,
  GetTenantFullAccountingGraduationRiskControlPackUseCase,
  GetTenantFullAccountingProductDesignAnchorUseCase,
  GetTenantFullAccountingProductScopeContractUseCase,
  GetTenantFullAccountingProductProfessionalResponsibilityMatrixUseCase,
  GetTenantFullAccountingOfficialArtifactBoundaryRegistryUseCase,
  GetTenantFullAccountingWorkflowControlBlueprintUseCase,
  GetTenantFullAccountingFormalReadinessAnchorUseCase,
  GetTenantFullAccountingPolicyTemplateRegistryUseCase,
  GetTenantFullAccountingProfessionalPortalReadinessShellUseCase,
  GetTenantFullAccountingFormalLedgerPostingReadinessPackUseCase,
  GetTenantFullAccountingStatementBankFormalBoundaryPackUseCase,
  GetTenantFullAccountingFormalArtifactDraftingAnchorUseCase,
  GetTenantFullAccountingFormalLedgerDraftPackUseCase,
  GetTenantFullAccountingPostingApprovalDraftPackUseCase,
  GetTenantFullAccountingBankReconciliationEvidenceDraftPackUseCase,
  GetTenantFullAccountingTrialBalanceFinancialStatementDraftPackUseCase,
  GetTenantFullAccountingProfessionalReviewExecutionAnchorUseCase,
  GetTenantFullAccountingAccountantDraftReviewRoomUseCase,
  GetTenantFullAccountingReviewChangeRequestPackUseCase,
  GetTenantFullAccountingReviewExecutionCommandCenterUseCase,
  GetTenantFullAccountingFormalApprovalWorkflowAnchorUseCase,
  GetTenantFullAccountingApprovalAuthorityMatrixUseCase,
  GetTenantFullAccountingFormalApprovalEvidencePackUseCase,
  GetTenantFullAccountingApprovalDecisionWorkspaceUseCase,
  GetTenantFullAccountingFormalApprovalCommandCenterUseCase,
  GetTenantFullAccountingCertificationRequirementWorkspaceUseCase,
  GetTenantFullAccountingExecutionHandoffEvidenceBundleUseCase,
  GetTenantFullAccountingExecutionReturnEvidenceIntakeUseCase,
  GetTenantFullAccountingExternalExecutionHandoffAnchorUseCase,
  GetTenantFullAccountingExternalExecutionInstructionPackUseCase,
  GetTenantFullAccountingExternalExecutionStatusLedgerUseCase,
  GetTenantFullAccountingExternalExecutionTrackingAnchorUseCase,
  GetTenantFullAccountingExternalExecutionTrackingCommandCenterUseCase,
  GetTenantFullAccountingExternalObservationResolutionQueueUseCase,
  GetTenantFullAccountingExternalExecutorAssignmentMatrixUseCase,
  GetTenantFullAccountingExternalResultIntakeAnchorUseCase,
  GetTenantFullAccountingFormalSignatoryRegistryUseCase,
  GetTenantFullAccountingLegalizationBoundaryPacketUseCase,
  GetTenantFullAccountingSignatureCertificationBoundaryAnchorUseCase,
  GetTenantFullAccountingSignatureEvidenceReadinessPackUseCase,
  GetTenantFullAccountingReturnedEvidenceValidationWorkspaceUseCase,
  GetTenantFullAccountingReturnedArtifactRegistryUseCase,
  GetTenantFullAccountingInternalAcceptanceCriteriaWorkspaceUseCase,
  GetTenantFullAccountingAcceptanceDecisionWorkspaceUseCase,
  GetTenantFullAccountingInternalAcceptanceCommandCenterUseCase,
  GetTenantFullAccountingFormalRecordAssemblyAnchorUseCase,
  GetTenantFullAccountingAcceptedArtifactBinderUseCase,
  GetTenantFullAccountingFormalRecordIndexWorkspaceUseCase,
  GetTenantFullAccountingRecordConsistencyReviewWorkspaceUseCase,
  GetTenantFullAccountingFormalRecordAssemblyCommandCenterUseCase,
  GetTenantFullAccountingFormalRecordCloseoutAnchorUseCase,
  GetTenantFullAccountingArchiveReadinessWorkspaceUseCase,
  GetTenantFullAccountingFormalCloseoutEvidencePacketUseCase,
  GetTenantFullAccountingProfessionalCloseoutAttestationBoundaryUseCase,
  GetTenantFullAccountingFormalRecordCloseoutCommandCenterUseCase,
  GetTenantAccountingAdvancedFormalProductScopeContractUseCase,
  GetTenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixUseCase,
  GetTenantAccountingAdvancedProfessionalReviewWorkflowDesignUseCase,
  GetTenantAccountingAdvancedDiscoveryAnchorUseCase,
  GetTenantAccountingAdvancedDiscoveryIntakeUseCase,
  GetTenantAccountingAuditTrailWorkspaceUseCase,
  GetTenantAccountingBankAccountRegistryWorkspaceUseCase,
  GetTenantAccountingBankReconciliationWorkspaceUseCase,
  GetTenantAccountingBankStatementImportProfileWorkspaceUseCase,
  GetTenantAccountingBankStatementImportWorkspaceUseCase,
  GetTenantAccountingChartOfAccountsWorkspaceUseCase,
  GetTenantAccountingCloseoutCertificationReadinessUseCase,
  GetTenantAccountingFoundationCloseoutSummaryUseCase,
  GetTenantAccountingFormalNeedsClassifierUseCase,
  GetTenantAccountingCertifiedBankEvidenceBoundaryUseCase,
  GetTenantAccountingLegalBooksReadinessPacketUseCase,
  GetTenantAccountingPeriodCloseoutTimelineUseCase,
  GetTenantAccountingPeriodNarrativeReportUseCase,
  GetTenantAccountingProfessionalCloseoutWorkspaceUseCase,
  GetTenantAccountingFinancialStatementPreviewUseCase,
  GetTenantAccountingIntakeWorkspaceUseCase,
  GetTenantAccountingJournalDraftPreviewUseCase,
  GetTenantAccountingLedgerRegistryWorkspaceUseCase,
  GetTenantAccountingLedgerPreviewWorkspaceUseCase,
  GetTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase,
  GetTenantAccountingOpeningBalanceControlRegistryUseCase,
  GetTenantAccountingOpeningBalanceWorkspaceUseCase,
  GetTenantAccountingOperationalCommandCenterUseCase,
  GetTenantAccountingTaxDeclarationEvidenceBridgeUseCase,
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
  RequestTenantAccountingOpeningBalanceApprovalPacketUseCase,
  RequestTenantAccountingAccountantReviewUseCase,
  RequestTenantAccountingAdjustmentRecommendationPacketUseCase,
  RequestTenantAccountingAdvancedDiscoveryCloseoutUseCase,
  RequestTenantAccountingAdvancedDiscoveryReadinessPacketUseCase,
  RequestTenantAccountingAdvancedAuditTrailReadinessPacketUseCase,
  RequestTenantAccountingAdvancedMvpAccountantReviewPacketUseCase,
  RequestTenantAccountingAdvancedMvpOperatingCloseoutUseCase,
  RequestTenantAccountingAdvancedMvpReadinessCloseoutUseCase,
  RequestTenantAccountingAdvancedPilotCloseoutUseCase,
  RequestTenantAccountingAdvancedPilotOutcomePacketUseCase,
  RequestTenantAccountingAdvancedGraduationCloseoutUseCase,
  RequestTenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutUseCase,
  RequestTenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketUseCase,
  RequestTenantAccountingAdvancedFormalProductDesignCloseoutUseCase,
  RequestTenantAccountingAdvancedFormalProductRiskGuardrailPackUseCase,
  RequestTenantAccountingAdvancedFormalArtifactDraftingCloseoutUseCase,
  RequestTenantAccountingAdvancedProfessionalApprovalRecommendationPackUseCase,
  RequestTenantAccountingAdvancedProfessionalReviewExecutionCloseoutUseCase,
  RequestTenantAccountingAdvancedFormalApprovalWorkflowCloseoutUseCase,
  RequestTenantAccountingAdvancedSignatureCertificationBoundaryCloseoutUseCase,
  RequestTenantAccountingAdvancedExternalExecutionHandoffCloseoutUseCase,
  RequestTenantAccountingAdvancedExternalExecutionTrackingCloseoutUseCase,
  RequestTenantAccountingAdvancedExternalResultIntakeCloseoutUseCase,
  RequestTenantAccountingAdvancedFormalRecordAssemblyCloseoutUseCase,
  RequestTenantAccountingAdvancedFormalRecordCloseoutCloseoutUseCase,
  RequestTenantAccountingAdvancedGraduationArchiveHandoffCloseoutUseCase,
  RequestTenantFullAccountingCandidateCloseoutUseCase,
  RequestTenantFullAccountingMvpReadinessCloseoutUseCase,
  RequestTenantFullAccountingMvpOperationsCloseoutUseCase,
  RequestTenantFullAccountingControlledPilotCloseoutUseCase,
  RequestTenantFullAccountingGraduationCloseoutUseCase,
  RequestTenantFullAccountingProductDesignCloseoutUseCase,
  RequestTenantFullAccountingFormalReadinessCloseoutUseCase,
  RequestTenantFullAccountingFormalArtifactDraftingCloseoutUseCase,
  RequestTenantFullAccountingProfessionalApprovalRecommendationPackUseCase,
  RequestTenantFullAccountingProfessionalReviewExecutionCloseoutUseCase,
  RequestTenantFullAccountingFormalApprovalWorkflowCloseoutUseCase,
  RequestTenantFullAccountingSignatureCertificationBoundaryCloseoutUseCase,
  RequestTenantFullAccountingExternalExecutionHandoffCloseoutUseCase,
  RequestTenantFullAccountingExternalExecutionTrackingCloseoutUseCase,
  RequestTenantFullAccountingExternalResultIntakeCloseoutUseCase,
  RequestTenantFullAccountingFormalRecordAssemblyCloseoutUseCase,
  RequestTenantFullAccountingFormalRecordCloseoutCloseoutUseCase,
  RequestTenantAccountingAiReviewAssistantPacketUseCase,
  RequestTenantAccountingFinancialStatementFinalReviewPacketUseCase,
  RequestTenantAccountingFinancialStatementReviewPacketUseCase,
  RequestTenantAccountingFoundationCloseoutPackV2UseCase,
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
  RequestTenantAccountingTaxComplianceFeedbackBridgeUseCase,
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
  RequestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase,
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
      provide: GetTenantAccountingAdvancedDiscoveryAnchorUseCase,
      inject: [RequestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase],
      useFactory: (requestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase) =>
        new GetTenantAccountingAdvancedDiscoveryAnchorUseCase(
          requestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedDiscoveryIntakeUseCase,
      inject: [
        GetTenantAccountingAdvancedDiscoveryAnchorUseCase,
        RequestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedDiscoveryAnchorUseCase,
        requestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase,
      ) =>
        new GetTenantAccountingAdvancedDiscoveryIntakeUseCase(
          getTenantAccountingAdvancedDiscoveryAnchorUseCase,
          requestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase,
        ),
    },
    {
      provide: GetTenantAccountingFormalNeedsClassifierUseCase,
      inject: [GetTenantAccountingAdvancedDiscoveryIntakeUseCase],
      useFactory: (getTenantAccountingAdvancedDiscoveryIntakeUseCase) =>
        new GetTenantAccountingFormalNeedsClassifierUseCase(
          getTenantAccountingAdvancedDiscoveryIntakeUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAccountantDiscoveryWorkspaceUseCase,
      inject: [GetTenantAccountingFormalNeedsClassifierUseCase],
      useFactory: (getTenantAccountingFormalNeedsClassifierUseCase) =>
        new GetTenantAccountingAccountantDiscoveryWorkspaceUseCase(
          getTenantAccountingFormalNeedsClassifierUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAdvancedDiscoveryReadinessPacketUseCase,
      inject: [GetTenantAccountingAccountantDiscoveryWorkspaceUseCase],
      useFactory: (getTenantAccountingAccountantDiscoveryWorkspaceUseCase) =>
        new RequestTenantAccountingAdvancedDiscoveryReadinessPacketUseCase(
          getTenantAccountingAccountantDiscoveryWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAdvancedDiscoveryCloseoutUseCase,
      inject: [
        GetTenantAccountingAdvancedDiscoveryAnchorUseCase,
        GetTenantAccountingAdvancedDiscoveryIntakeUseCase,
        GetTenantAccountingFormalNeedsClassifierUseCase,
        GetTenantAccountingAccountantDiscoveryWorkspaceUseCase,
        RequestTenantAccountingAdvancedDiscoveryReadinessPacketUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedDiscoveryAnchorUseCase,
        getTenantAccountingAdvancedDiscoveryIntakeUseCase,
        getTenantAccountingFormalNeedsClassifierUseCase,
        getTenantAccountingAccountantDiscoveryWorkspaceUseCase,
        requestTenantAccountingAdvancedDiscoveryReadinessPacketUseCase,
      ) =>
        new RequestTenantAccountingAdvancedDiscoveryCloseoutUseCase(
          getTenantAccountingAdvancedDiscoveryAnchorUseCase,
          getTenantAccountingAdvancedDiscoveryIntakeUseCase,
          getTenantAccountingFormalNeedsClassifierUseCase,
          getTenantAccountingAccountantDiscoveryWorkspaceUseCase,
          requestTenantAccountingAdvancedDiscoveryReadinessPacketUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedMvpScopeRegistryUseCase,
      inject: [RequestTenantAccountingAdvancedDiscoveryCloseoutUseCase],
      useFactory: (requestTenantAccountingAdvancedDiscoveryCloseoutUseCase) =>
        new GetTenantAccountingAdvancedMvpScopeRegistryUseCase(
          requestTenantAccountingAdvancedDiscoveryCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedMvpScopeDecisionRecordUseCase,
      inject: [GetTenantAccountingAdvancedMvpScopeRegistryUseCase],
      useFactory: (getTenantAccountingAdvancedMvpScopeRegistryUseCase) =>
        new GetTenantAccountingAdvancedMvpScopeDecisionRecordUseCase(
          getTenantAccountingAdvancedMvpScopeRegistryUseCase,
        ),
    },
    {
      provide: GetTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase,
      inject: [GetTenantAccountingAdvancedMvpScopeDecisionRecordUseCase],
      useFactory: (
        getTenantAccountingAdvancedMvpScopeDecisionRecordUseCase,
      ) =>
        new GetTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase(
          getTenantAccountingAdvancedMvpScopeDecisionRecordUseCase,
        ),
    },
    {
      provide: GetTenantAccountingCertifiedBankEvidenceBoundaryUseCase,
      inject: [GetTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase],
      useFactory: (
        getTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase,
      ) =>
        new GetTenantAccountingCertifiedBankEvidenceBoundaryUseCase(
          getTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAdvancedAuditTrailReadinessPacketUseCase,
      inject: [GetTenantAccountingCertifiedBankEvidenceBoundaryUseCase],
      useFactory: (getTenantAccountingCertifiedBankEvidenceBoundaryUseCase) =>
        new RequestTenantAccountingAdvancedAuditTrailReadinessPacketUseCase(
          getTenantAccountingCertifiedBankEvidenceBoundaryUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAdvancedMvpReadinessCloseoutUseCase,
      inject: [
        GetTenantAccountingAdvancedMvpScopeRegistryUseCase,
        GetTenantAccountingAdvancedMvpScopeDecisionRecordUseCase,
        GetTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase,
        GetTenantAccountingCertifiedBankEvidenceBoundaryUseCase,
        RequestTenantAccountingAdvancedAuditTrailReadinessPacketUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedMvpScopeRegistryUseCase,
        getTenantAccountingAdvancedMvpScopeDecisionRecordUseCase,
        getTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase,
        getTenantAccountingCertifiedBankEvidenceBoundaryUseCase,
        requestTenantAccountingAdvancedAuditTrailReadinessPacketUseCase,
      ) =>
        new RequestTenantAccountingAdvancedMvpReadinessCloseoutUseCase(
          getTenantAccountingAdvancedMvpScopeRegistryUseCase,
          getTenantAccountingAdvancedMvpScopeDecisionRecordUseCase,
          getTenantAccountingMinimumLedgerCloseoutDesignWorkspaceUseCase,
          getTenantAccountingCertifiedBankEvidenceBoundaryUseCase,
          requestTenantAccountingAdvancedAuditTrailReadinessPacketUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedMvpExecutionAnchorUseCase,
      inject: [RequestTenantAccountingAdvancedMvpReadinessCloseoutUseCase],
      useFactory: (requestTenantAccountingAdvancedMvpReadinessCloseoutUseCase) =>
        new GetTenantAccountingAdvancedMvpExecutionAnchorUseCase(
          requestTenantAccountingAdvancedMvpReadinessCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase,
      inject: [GetTenantAccountingAdvancedMvpExecutionAnchorUseCase],
      useFactory: (getTenantAccountingAdvancedMvpExecutionAnchorUseCase) =>
        new GetTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase(
          getTenantAccountingAdvancedMvpExecutionAnchorUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase,
      inject: [GetTenantAccountingAdvancedMvpExecutionAnchorUseCase],
      useFactory: (getTenantAccountingAdvancedMvpExecutionAnchorUseCase) =>
        new GetTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase(
          getTenantAccountingAdvancedMvpExecutionAnchorUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAdvancedMvpAccountantReviewPacketUseCase,
      inject: [
        GetTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase,
        GetTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase,
        getTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase,
      ) =>
        new RequestTenantAccountingAdvancedMvpAccountantReviewPacketUseCase(
          getTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase,
          getTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedMvpCommandCenterUseCase,
      inject: [
        GetTenantAccountingAdvancedMvpExecutionAnchorUseCase,
        GetTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase,
        GetTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase,
        RequestTenantAccountingAdvancedMvpAccountantReviewPacketUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedMvpExecutionAnchorUseCase,
        getTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase,
        getTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase,
        requestTenantAccountingAdvancedMvpAccountantReviewPacketUseCase,
      ) =>
        new GetTenantAccountingAdvancedMvpCommandCenterUseCase(
          getTenantAccountingAdvancedMvpExecutionAnchorUseCase,
          getTenantAccountingAdvancedBankReconciliationMvpWorkbenchUseCase,
          getTenantAccountingAdvancedLedgerCloseoutMvpWorkbenchUseCase,
          requestTenantAccountingAdvancedMvpAccountantReviewPacketUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAdvancedMvpOperatingCloseoutUseCase,
      inject: [GetTenantAccountingAdvancedMvpCommandCenterUseCase],
      useFactory: (getTenantAccountingAdvancedMvpCommandCenterUseCase) =>
        new RequestTenantAccountingAdvancedMvpOperatingCloseoutUseCase(
          getTenantAccountingAdvancedMvpCommandCenterUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedPilotEnrollmentUseCase,
      inject: [RequestTenantAccountingAdvancedMvpOperatingCloseoutUseCase],
      useFactory: (
        requestTenantAccountingAdvancedMvpOperatingCloseoutUseCase,
      ) =>
        new GetTenantAccountingAdvancedPilotEnrollmentUseCase(
          requestTenantAccountingAdvancedMvpOperatingCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedPilotEvidenceSnapshotUseCase,
      inject: [GetTenantAccountingAdvancedPilotEnrollmentUseCase],
      useFactory: (getTenantAccountingAdvancedPilotEnrollmentUseCase) =>
        new GetTenantAccountingAdvancedPilotEvidenceSnapshotUseCase(
          getTenantAccountingAdvancedPilotEnrollmentUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedPilotAccountantReviewRoomUseCase,
      inject: [GetTenantAccountingAdvancedPilotEvidenceSnapshotUseCase],
      useFactory: (
        getTenantAccountingAdvancedPilotEvidenceSnapshotUseCase,
      ) =>
        new GetTenantAccountingAdvancedPilotAccountantReviewRoomUseCase(
          getTenantAccountingAdvancedPilotEvidenceSnapshotUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedPilotRunbookUseCase,
      inject: [GetTenantAccountingAdvancedPilotAccountantReviewRoomUseCase],
      useFactory: (
        getTenantAccountingAdvancedPilotAccountantReviewRoomUseCase,
      ) =>
        new GetTenantAccountingAdvancedPilotRunbookUseCase(
          getTenantAccountingAdvancedPilotAccountantReviewRoomUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAdvancedPilotOutcomePacketUseCase,
      inject: [GetTenantAccountingAdvancedPilotRunbookUseCase],
      useFactory: (getTenantAccountingAdvancedPilotRunbookUseCase) =>
        new RequestTenantAccountingAdvancedPilotOutcomePacketUseCase(
          getTenantAccountingAdvancedPilotRunbookUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAdvancedPilotCloseoutUseCase,
      inject: [RequestTenantAccountingAdvancedPilotOutcomePacketUseCase],
      useFactory: (
        requestTenantAccountingAdvancedPilotOutcomePacketUseCase,
      ) =>
        new RequestTenantAccountingAdvancedPilotCloseoutUseCase(
          requestTenantAccountingAdvancedPilotOutcomePacketUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedPilotLearningRegistryUseCase,
      inject: [RequestTenantAccountingAdvancedPilotCloseoutUseCase],
      useFactory: (requestTenantAccountingAdvancedPilotCloseoutUseCase) =>
        new GetTenantAccountingAdvancedPilotLearningRegistryUseCase(
          requestTenantAccountingAdvancedPilotCloseoutUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedExternalAccountantAcceptanceCriteriaUseCase,
      inject: [GetTenantAccountingAdvancedPilotLearningRegistryUseCase],
      useFactory: (getTenantAccountingAdvancedPilotLearningRegistryUseCase) =>
        new GetTenantAccountingAdvancedExternalAccountantAcceptanceCriteriaUseCase(
          getTenantAccountingAdvancedPilotLearningRegistryUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedProductGraduationMatrixUseCase,
      inject: [
        GetTenantAccountingAdvancedExternalAccountantAcceptanceCriteriaUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedExternalAccountantAcceptanceCriteriaUseCase,
      ) =>
        new GetTenantAccountingAdvancedProductGraduationMatrixUseCase(
          getTenantAccountingAdvancedExternalAccountantAcceptanceCriteriaUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFormalBooksBoundaryBlueprintUseCase,
      inject: [GetTenantAccountingAdvancedProductGraduationMatrixUseCase],
      useFactory: (
        getTenantAccountingAdvancedProductGraduationMatrixUseCase,
      ) =>
        new GetTenantAccountingAdvancedFormalBooksBoundaryBlueprintUseCase(
          getTenantAccountingAdvancedProductGraduationMatrixUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintUseCase,
      inject: [GetTenantAccountingAdvancedFormalBooksBoundaryBlueprintUseCase],
      useFactory: (
        getTenantAccountingAdvancedFormalBooksBoundaryBlueprintUseCase,
      ) =>
        new GetTenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintUseCase(
          getTenantAccountingAdvancedFormalBooksBoundaryBlueprintUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAdvancedGraduationCloseoutUseCase,
      inject: [
        GetTenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintUseCase,
      ) =>
        new RequestTenantAccountingAdvancedGraduationCloseoutUseCase(
          getTenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedPoliciesClosingTemplateRegistryUseCase,
      inject: [RequestTenantAccountingAdvancedGraduationCloseoutUseCase],
      useFactory: (requestTenantAccountingAdvancedGraduationCloseoutUseCase) =>
        new GetTenantAccountingAdvancedPoliciesClosingTemplateRegistryUseCase(
          requestTenantAccountingAdvancedGraduationCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedExternalAccountantPortalShellUseCase,
      inject: [GetTenantAccountingAdvancedPoliciesClosingTemplateRegistryUseCase],
      useFactory: (
        getTenantAccountingAdvancedPoliciesClosingTemplateRegistryUseCase,
      ) =>
        new GetTenantAccountingAdvancedExternalAccountantPortalShellUseCase(
          getTenantAccountingAdvancedPoliciesClosingTemplateRegistryUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedAdjustmentAutomationWorkbenchUseCase,
      inject: [GetTenantAccountingAdvancedExternalAccountantPortalShellUseCase],
      useFactory: (
        getTenantAccountingAdvancedExternalAccountantPortalShellUseCase,
      ) =>
        new GetTenantAccountingAdvancedAdjustmentAutomationWorkbenchUseCase(
          getTenantAccountingAdvancedExternalAccountantPortalShellUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceUseCase,
      inject: [GetTenantAccountingAdvancedAdjustmentAutomationWorkbenchUseCase],
      useFactory: (
        getTenantAccountingAdvancedAdjustmentAutomationWorkbenchUseCase,
      ) =>
        new GetTenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceUseCase(
          getTenantAccountingAdvancedAdjustmentAutomationWorkbenchUseCase,
        ),
    },
    {
      provide:
        RequestTenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketUseCase,
      inject: [
        GetTenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceUseCase,
      ) =>
        new RequestTenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketUseCase(
          getTenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceUseCase,
        ),
    },
    {
      provide:
        RequestTenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutUseCase,
      inject: [
        RequestTenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketUseCase,
      ) =>
        new RequestTenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutUseCase(
          requestTenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFormalProductScopeContractUseCase,
      inject: [
        RequestTenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutUseCase,
      ) =>
        new GetTenantAccountingAdvancedFormalProductScopeContractUseCase(
          requestTenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixUseCase,
      inject: [GetTenantAccountingAdvancedFormalProductScopeContractUseCase],
      useFactory: (
        getTenantAccountingAdvancedFormalProductScopeContractUseCase,
      ) =>
        new GetTenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixUseCase(
          getTenantAccountingAdvancedFormalProductScopeContractUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFormalArtifactDraftRegistryUseCase,
      inject: [
        GetTenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixUseCase,
      ) =>
        new GetTenantAccountingAdvancedFormalArtifactDraftRegistryUseCase(
          getTenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedProfessionalReviewWorkflowDesignUseCase,
      inject: [GetTenantAccountingAdvancedFormalArtifactDraftRegistryUseCase],
      useFactory: (
        getTenantAccountingAdvancedFormalArtifactDraftRegistryUseCase,
      ) =>
        new GetTenantAccountingAdvancedProfessionalReviewWorkflowDesignUseCase(
          getTenantAccountingAdvancedFormalArtifactDraftRegistryUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAdvancedFormalProductRiskGuardrailPackUseCase,
      inject: [
        GetTenantAccountingAdvancedProfessionalReviewWorkflowDesignUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedProfessionalReviewWorkflowDesignUseCase,
      ) =>
        new RequestTenantAccountingAdvancedFormalProductRiskGuardrailPackUseCase(
          getTenantAccountingAdvancedProfessionalReviewWorkflowDesignUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAdvancedFormalProductDesignCloseoutUseCase,
      inject: [
        RequestTenantAccountingAdvancedFormalProductRiskGuardrailPackUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedFormalProductRiskGuardrailPackUseCase,
      ) =>
        new RequestTenantAccountingAdvancedFormalProductDesignCloseoutUseCase(
          requestTenantAccountingAdvancedFormalProductRiskGuardrailPackUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFormalArtifactDraftingAnchorUseCase,
      inject: [
        RequestTenantAccountingAdvancedFormalProductDesignCloseoutUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedFormalProductDesignCloseoutUseCase,
      ) =>
        new GetTenantAccountingAdvancedFormalArtifactDraftingAnchorUseCase(
          requestTenantAccountingAdvancedFormalProductDesignCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedAdjustmentDraftPackUseCase,
      inject: [GetTenantAccountingAdvancedFormalArtifactDraftingAnchorUseCase],
      useFactory: (
        getTenantAccountingAdvancedFormalArtifactDraftingAnchorUseCase,
      ) =>
        new GetTenantAccountingAdvancedAdjustmentDraftPackUseCase(
          getTenantAccountingAdvancedFormalArtifactDraftingAnchorUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFormalBooksDraftWorkspaceUseCase,
      inject: [GetTenantAccountingAdvancedAdjustmentDraftPackUseCase],
      useFactory: (getTenantAccountingAdvancedAdjustmentDraftPackUseCase) =>
        new GetTenantAccountingAdvancedFormalBooksDraftWorkspaceUseCase(
          getTenantAccountingAdvancedAdjustmentDraftPackUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFinancialStatementsDraftPackUseCase,
      inject: [GetTenantAccountingAdvancedFormalBooksDraftWorkspaceUseCase],
      useFactory: (
        getTenantAccountingAdvancedFormalBooksDraftWorkspaceUseCase,
      ) =>
        new GetTenantAccountingAdvancedFinancialStatementsDraftPackUseCase(
          getTenantAccountingAdvancedFormalBooksDraftWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedCertifiedReconciliationDraftPackUseCase,
      inject: [GetTenantAccountingAdvancedFinancialStatementsDraftPackUseCase],
      useFactory: (
        getTenantAccountingAdvancedFinancialStatementsDraftPackUseCase,
      ) =>
        new GetTenantAccountingAdvancedCertifiedReconciliationDraftPackUseCase(
          getTenantAccountingAdvancedFinancialStatementsDraftPackUseCase,
        ),
    },
    {
      provide:
        RequestTenantAccountingAdvancedFormalArtifactDraftingCloseoutUseCase,
      inject: [
        GetTenantAccountingAdvancedCertifiedReconciliationDraftPackUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedCertifiedReconciliationDraftPackUseCase,
      ) =>
        new RequestTenantAccountingAdvancedFormalArtifactDraftingCloseoutUseCase(
          getTenantAccountingAdvancedCertifiedReconciliationDraftPackUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedProfessionalReviewExecutionAnchorUseCase,
      inject: [
        RequestTenantAccountingAdvancedFormalArtifactDraftingCloseoutUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedFormalArtifactDraftingCloseoutUseCase,
      ) =>
        new GetTenantAccountingAdvancedProfessionalReviewExecutionAnchorUseCase(
          requestTenantAccountingAdvancedFormalArtifactDraftingCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedAccountantDraftReviewRoomUseCase,
      inject: [
        GetTenantAccountingAdvancedProfessionalReviewExecutionAnchorUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedProfessionalReviewExecutionAnchorUseCase,
      ) =>
        new GetTenantAccountingAdvancedAccountantDraftReviewRoomUseCase(
          getTenantAccountingAdvancedProfessionalReviewExecutionAnchorUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedReviewChangeRequestPackUseCase,
      inject: [GetTenantAccountingAdvancedAccountantDraftReviewRoomUseCase],
      useFactory: (
        getTenantAccountingAdvancedAccountantDraftReviewRoomUseCase,
      ) =>
        new GetTenantAccountingAdvancedReviewChangeRequestPackUseCase(
          getTenantAccountingAdvancedAccountantDraftReviewRoomUseCase,
        ),
    },
    {
      provide:
        RequestTenantAccountingAdvancedProfessionalApprovalRecommendationPackUseCase,
      inject: [GetTenantAccountingAdvancedReviewChangeRequestPackUseCase],
      useFactory: (
        getTenantAccountingAdvancedReviewChangeRequestPackUseCase,
      ) =>
        new RequestTenantAccountingAdvancedProfessionalApprovalRecommendationPackUseCase(
          getTenantAccountingAdvancedReviewChangeRequestPackUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedReviewExecutionCommandCenterUseCase,
      inject: [
        RequestTenantAccountingAdvancedProfessionalApprovalRecommendationPackUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedProfessionalApprovalRecommendationPackUseCase,
      ) =>
        new GetTenantAccountingAdvancedReviewExecutionCommandCenterUseCase(
          requestTenantAccountingAdvancedProfessionalApprovalRecommendationPackUseCase,
        ),
    },
    {
      provide:
        RequestTenantAccountingAdvancedProfessionalReviewExecutionCloseoutUseCase,
      inject: [GetTenantAccountingAdvancedReviewExecutionCommandCenterUseCase],
      useFactory: (
        getTenantAccountingAdvancedReviewExecutionCommandCenterUseCase,
      ) =>
        new RequestTenantAccountingAdvancedProfessionalReviewExecutionCloseoutUseCase(
          getTenantAccountingAdvancedReviewExecutionCommandCenterUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFormalApprovalWorkflowAnchorUseCase,
      inject: [
        RequestTenantAccountingAdvancedProfessionalReviewExecutionCloseoutUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedProfessionalReviewExecutionCloseoutUseCase,
      ) =>
        new GetTenantAccountingAdvancedFormalApprovalWorkflowAnchorUseCase(
          requestTenantAccountingAdvancedProfessionalReviewExecutionCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedApprovalAuthorityMatrixUseCase,
      inject: [GetTenantAccountingAdvancedFormalApprovalWorkflowAnchorUseCase],
      useFactory: (
        getTenantAccountingAdvancedFormalApprovalWorkflowAnchorUseCase,
      ) =>
        new GetTenantAccountingAdvancedApprovalAuthorityMatrixUseCase(
          getTenantAccountingAdvancedFormalApprovalWorkflowAnchorUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFormalApprovalEvidencePackUseCase,
      inject: [GetTenantAccountingAdvancedApprovalAuthorityMatrixUseCase],
      useFactory: (getTenantAccountingAdvancedApprovalAuthorityMatrixUseCase) =>
        new GetTenantAccountingAdvancedFormalApprovalEvidencePackUseCase(
          getTenantAccountingAdvancedApprovalAuthorityMatrixUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedApprovalDecisionWorkspaceUseCase,
      inject: [GetTenantAccountingAdvancedFormalApprovalEvidencePackUseCase],
      useFactory: (
        getTenantAccountingAdvancedFormalApprovalEvidencePackUseCase,
      ) =>
        new GetTenantAccountingAdvancedApprovalDecisionWorkspaceUseCase(
          getTenantAccountingAdvancedFormalApprovalEvidencePackUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFormalApprovalCommandCenterUseCase,
      inject: [GetTenantAccountingAdvancedApprovalDecisionWorkspaceUseCase],
      useFactory: (
        getTenantAccountingAdvancedApprovalDecisionWorkspaceUseCase,
      ) =>
        new GetTenantAccountingAdvancedFormalApprovalCommandCenterUseCase(
          getTenantAccountingAdvancedApprovalDecisionWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAdvancedFormalApprovalWorkflowCloseoutUseCase,
      inject: [GetTenantAccountingAdvancedFormalApprovalCommandCenterUseCase],
      useFactory: (
        getTenantAccountingAdvancedFormalApprovalCommandCenterUseCase,
      ) =>
        new RequestTenantAccountingAdvancedFormalApprovalWorkflowCloseoutUseCase(
          getTenantAccountingAdvancedFormalApprovalCommandCenterUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedSignatureCertificationBoundaryAnchorUseCase,
      inject: [
        RequestTenantAccountingAdvancedFormalApprovalWorkflowCloseoutUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedFormalApprovalWorkflowCloseoutUseCase,
      ) =>
        new GetTenantAccountingAdvancedSignatureCertificationBoundaryAnchorUseCase(
          requestTenantAccountingAdvancedFormalApprovalWorkflowCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFormalSignatoryRegistryUseCase,
      inject: [
        GetTenantAccountingAdvancedSignatureCertificationBoundaryAnchorUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedSignatureCertificationBoundaryAnchorUseCase,
      ) =>
        new GetTenantAccountingAdvancedFormalSignatoryRegistryUseCase(
          getTenantAccountingAdvancedSignatureCertificationBoundaryAnchorUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedSignatureEvidenceReadinessPackUseCase,
      inject: [GetTenantAccountingAdvancedFormalSignatoryRegistryUseCase],
      useFactory: (
        getTenantAccountingAdvancedFormalSignatoryRegistryUseCase,
      ) =>
        new GetTenantAccountingAdvancedSignatureEvidenceReadinessPackUseCase(
          getTenantAccountingAdvancedFormalSignatoryRegistryUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedCertificationRequirementWorkspaceUseCase,
      inject: [
        GetTenantAccountingAdvancedSignatureEvidenceReadinessPackUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedSignatureEvidenceReadinessPackUseCase,
      ) =>
        new GetTenantAccountingAdvancedCertificationRequirementWorkspaceUseCase(
          getTenantAccountingAdvancedSignatureEvidenceReadinessPackUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedLegalizationBoundaryPacketUseCase,
      inject: [
        GetTenantAccountingAdvancedCertificationRequirementWorkspaceUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedCertificationRequirementWorkspaceUseCase,
      ) =>
        new GetTenantAccountingAdvancedLegalizationBoundaryPacketUseCase(
          getTenantAccountingAdvancedCertificationRequirementWorkspaceUseCase,
        ),
    },
    {
      provide:
        RequestTenantAccountingAdvancedSignatureCertificationBoundaryCloseoutUseCase,
      inject: [GetTenantAccountingAdvancedLegalizationBoundaryPacketUseCase],
      useFactory: (
        getTenantAccountingAdvancedLegalizationBoundaryPacketUseCase,
      ) =>
        new RequestTenantAccountingAdvancedSignatureCertificationBoundaryCloseoutUseCase(
          getTenantAccountingAdvancedLegalizationBoundaryPacketUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedExternalExecutionHandoffAnchorUseCase,
      inject: [
        RequestTenantAccountingAdvancedSignatureCertificationBoundaryCloseoutUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedSignatureCertificationBoundaryCloseoutUseCase,
      ) =>
        new GetTenantAccountingAdvancedExternalExecutionHandoffAnchorUseCase(
          requestTenantAccountingAdvancedSignatureCertificationBoundaryCloseoutUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedExternalExecutorAssignmentMatrixUseCase,
      inject: [
        GetTenantAccountingAdvancedExternalExecutionHandoffAnchorUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedExternalExecutionHandoffAnchorUseCase,
      ) =>
        new GetTenantAccountingAdvancedExternalExecutorAssignmentMatrixUseCase(
          getTenantAccountingAdvancedExternalExecutionHandoffAnchorUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedExecutionHandoffEvidenceBundleUseCase,
      inject: [
        GetTenantAccountingAdvancedExternalExecutorAssignmentMatrixUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedExternalExecutorAssignmentMatrixUseCase,
      ) =>
        new GetTenantAccountingAdvancedExecutionHandoffEvidenceBundleUseCase(
          getTenantAccountingAdvancedExternalExecutorAssignmentMatrixUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedExternalExecutionInstructionPackUseCase,
      inject: [
        GetTenantAccountingAdvancedExecutionHandoffEvidenceBundleUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedExecutionHandoffEvidenceBundleUseCase,
      ) =>
        new GetTenantAccountingAdvancedExternalExecutionInstructionPackUseCase(
          getTenantAccountingAdvancedExecutionHandoffEvidenceBundleUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedExecutionReturnEvidenceIntakeUseCase,
      inject: [
        GetTenantAccountingAdvancedExternalExecutionInstructionPackUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedExternalExecutionInstructionPackUseCase,
      ) =>
        new GetTenantAccountingAdvancedExecutionReturnEvidenceIntakeUseCase(
          getTenantAccountingAdvancedExternalExecutionInstructionPackUseCase,
        ),
    },
    {
      provide:
        RequestTenantAccountingAdvancedExternalExecutionHandoffCloseoutUseCase,
      inject: [
        GetTenantAccountingAdvancedExecutionReturnEvidenceIntakeUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedExecutionReturnEvidenceIntakeUseCase,
      ) =>
        new RequestTenantAccountingAdvancedExternalExecutionHandoffCloseoutUseCase(
          getTenantAccountingAdvancedExecutionReturnEvidenceIntakeUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedExternalExecutionTrackingAnchorUseCase,
      inject: [
        RequestTenantAccountingAdvancedExternalExecutionHandoffCloseoutUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedExternalExecutionHandoffCloseoutUseCase,
      ) =>
        new GetTenantAccountingAdvancedExternalExecutionTrackingAnchorUseCase(
          requestTenantAccountingAdvancedExternalExecutionHandoffCloseoutUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedExternalExecutionStatusLedgerUseCase,
      inject: [
        GetTenantAccountingAdvancedExternalExecutionTrackingAnchorUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedExternalExecutionTrackingAnchorUseCase,
      ) =>
        new GetTenantAccountingAdvancedExternalExecutionStatusLedgerUseCase(
          getTenantAccountingAdvancedExternalExecutionTrackingAnchorUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedReturnedEvidenceValidationWorkspaceUseCase,
      inject: [
        GetTenantAccountingAdvancedExternalExecutionStatusLedgerUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedExternalExecutionStatusLedgerUseCase,
      ) =>
        new GetTenantAccountingAdvancedReturnedEvidenceValidationWorkspaceUseCase(
          getTenantAccountingAdvancedExternalExecutionStatusLedgerUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedExternalObservationResolutionQueueUseCase,
      inject: [
        GetTenantAccountingAdvancedReturnedEvidenceValidationWorkspaceUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedReturnedEvidenceValidationWorkspaceUseCase,
      ) =>
        new GetTenantAccountingAdvancedExternalObservationResolutionQueueUseCase(
          getTenantAccountingAdvancedReturnedEvidenceValidationWorkspaceUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedExternalExecutionTrackingCommandCenterUseCase,
      inject: [
        GetTenantAccountingAdvancedExternalObservationResolutionQueueUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedExternalObservationResolutionQueueUseCase,
      ) =>
        new GetTenantAccountingAdvancedExternalExecutionTrackingCommandCenterUseCase(
          getTenantAccountingAdvancedExternalObservationResolutionQueueUseCase,
        ),
    },
    {
      provide:
        RequestTenantAccountingAdvancedExternalExecutionTrackingCloseoutUseCase,
      inject: [
        GetTenantAccountingAdvancedExternalExecutionTrackingCommandCenterUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedExternalExecutionTrackingCommandCenterUseCase,
      ) =>
        new RequestTenantAccountingAdvancedExternalExecutionTrackingCloseoutUseCase(
          getTenantAccountingAdvancedExternalExecutionTrackingCommandCenterUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedExternalResultIntakeAnchorUseCase,
      inject: [
        RequestTenantAccountingAdvancedExternalExecutionTrackingCloseoutUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedExternalExecutionTrackingCloseoutUseCase,
      ) =>
        new GetTenantAccountingAdvancedExternalResultIntakeAnchorUseCase(
          requestTenantAccountingAdvancedExternalExecutionTrackingCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedReturnedArtifactRegistryUseCase,
      inject: [GetTenantAccountingAdvancedExternalResultIntakeAnchorUseCase],
      useFactory: (
        getTenantAccountingAdvancedExternalResultIntakeAnchorUseCase,
      ) =>
        new GetTenantAccountingAdvancedReturnedArtifactRegistryUseCase(
          getTenantAccountingAdvancedExternalResultIntakeAnchorUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceUseCase,
      inject: [GetTenantAccountingAdvancedReturnedArtifactRegistryUseCase],
      useFactory: (
        getTenantAccountingAdvancedReturnedArtifactRegistryUseCase,
      ) =>
        new GetTenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceUseCase(
          getTenantAccountingAdvancedReturnedArtifactRegistryUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedAcceptanceDecisionWorkspaceUseCase,
      inject: [
        GetTenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceUseCase,
      ) =>
        new GetTenantAccountingAdvancedAcceptanceDecisionWorkspaceUseCase(
          getTenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedInternalAcceptanceCommandCenterUseCase,
      inject: [GetTenantAccountingAdvancedAcceptanceDecisionWorkspaceUseCase],
      useFactory: (
        getTenantAccountingAdvancedAcceptanceDecisionWorkspaceUseCase,
      ) =>
        new GetTenantAccountingAdvancedInternalAcceptanceCommandCenterUseCase(
          getTenantAccountingAdvancedAcceptanceDecisionWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAdvancedExternalResultIntakeCloseoutUseCase,
      inject: [GetTenantAccountingAdvancedInternalAcceptanceCommandCenterUseCase],
      useFactory: (
        getTenantAccountingAdvancedInternalAcceptanceCommandCenterUseCase,
      ) =>
        new RequestTenantAccountingAdvancedExternalResultIntakeCloseoutUseCase(
          getTenantAccountingAdvancedInternalAcceptanceCommandCenterUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFormalRecordAssemblyAnchorUseCase,
      inject: [
        RequestTenantAccountingAdvancedExternalResultIntakeCloseoutUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedExternalResultIntakeCloseoutUseCase,
      ) =>
        new GetTenantAccountingAdvancedFormalRecordAssemblyAnchorUseCase(
          requestTenantAccountingAdvancedExternalResultIntakeCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedAcceptedArtifactBinderUseCase,
      inject: [GetTenantAccountingAdvancedFormalRecordAssemblyAnchorUseCase],
      useFactory: (
        getTenantAccountingAdvancedFormalRecordAssemblyAnchorUseCase,
      ) =>
        new GetTenantAccountingAdvancedAcceptedArtifactBinderUseCase(
          getTenantAccountingAdvancedFormalRecordAssemblyAnchorUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFormalRecordIndexWorkspaceUseCase,
      inject: [GetTenantAccountingAdvancedAcceptedArtifactBinderUseCase],
      useFactory: (
        getTenantAccountingAdvancedAcceptedArtifactBinderUseCase,
      ) =>
        new GetTenantAccountingAdvancedFormalRecordIndexWorkspaceUseCase(
          getTenantAccountingAdvancedAcceptedArtifactBinderUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedRecordConsistencyReviewWorkspaceUseCase,
      inject: [GetTenantAccountingAdvancedFormalRecordIndexWorkspaceUseCase],
      useFactory: (
        getTenantAccountingAdvancedFormalRecordIndexWorkspaceUseCase,
      ) =>
        new GetTenantAccountingAdvancedRecordConsistencyReviewWorkspaceUseCase(
          getTenantAccountingAdvancedFormalRecordIndexWorkspaceUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedFormalRecordAssemblyCommandCenterUseCase,
      inject: [
        GetTenantAccountingAdvancedRecordConsistencyReviewWorkspaceUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedRecordConsistencyReviewWorkspaceUseCase,
      ) =>
        new GetTenantAccountingAdvancedFormalRecordAssemblyCommandCenterUseCase(
          getTenantAccountingAdvancedRecordConsistencyReviewWorkspaceUseCase,
        ),
    },
    {
      provide:
        RequestTenantAccountingAdvancedFormalRecordAssemblyCloseoutUseCase,
      inject: [
        GetTenantAccountingAdvancedFormalRecordAssemblyCommandCenterUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedFormalRecordAssemblyCommandCenterUseCase,
      ) =>
        new RequestTenantAccountingAdvancedFormalRecordAssemblyCloseoutUseCase(
          getTenantAccountingAdvancedFormalRecordAssemblyCommandCenterUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFormalRecordCloseoutAnchorUseCase,
      inject: [
        RequestTenantAccountingAdvancedFormalRecordAssemblyCloseoutUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedFormalRecordAssemblyCloseoutUseCase,
      ) =>
        new GetTenantAccountingAdvancedFormalRecordCloseoutAnchorUseCase(
          requestTenantAccountingAdvancedFormalRecordAssemblyCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedArchiveReadinessWorkspaceUseCase,
      inject: [GetTenantAccountingAdvancedFormalRecordCloseoutAnchorUseCase],
      useFactory: (
        getTenantAccountingAdvancedFormalRecordCloseoutAnchorUseCase,
      ) =>
        new GetTenantAccountingAdvancedArchiveReadinessWorkspaceUseCase(
          getTenantAccountingAdvancedFormalRecordCloseoutAnchorUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFormalCloseoutEvidencePacketUseCase,
      inject: [GetTenantAccountingAdvancedArchiveReadinessWorkspaceUseCase],
      useFactory: (
        getTenantAccountingAdvancedArchiveReadinessWorkspaceUseCase,
      ) =>
        new GetTenantAccountingAdvancedFormalCloseoutEvidencePacketUseCase(
          getTenantAccountingAdvancedArchiveReadinessWorkspaceUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryUseCase,
      inject: [GetTenantAccountingAdvancedFormalCloseoutEvidencePacketUseCase],
      useFactory: (
        getTenantAccountingAdvancedFormalCloseoutEvidencePacketUseCase,
      ) =>
        new GetTenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryUseCase(
          getTenantAccountingAdvancedFormalCloseoutEvidencePacketUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedFormalRecordCloseoutCommandCenterUseCase,
      inject: [
        GetTenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryUseCase,
      ) =>
        new GetTenantAccountingAdvancedFormalRecordCloseoutCommandCenterUseCase(
          getTenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingAdvancedFormalRecordCloseoutCloseoutUseCase,
      inject: [
        GetTenantAccountingAdvancedFormalRecordCloseoutCommandCenterUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedFormalRecordCloseoutCommandCenterUseCase,
      ) =>
        new RequestTenantAccountingAdvancedFormalRecordCloseoutCloseoutUseCase(
          getTenantAccountingAdvancedFormalRecordCloseoutCommandCenterUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedGraduationArchiveHandoffAnchorUseCase,
      inject: [
        RequestTenantAccountingAdvancedFormalRecordCloseoutCloseoutUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedFormalRecordCloseoutCloseoutUseCase,
      ) =>
        new GetTenantAccountingAdvancedGraduationArchiveHandoffAnchorUseCase(
          requestTenantAccountingAdvancedFormalRecordCloseoutCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedArchiveHandoffPackageUseCase,
      inject: [
        GetTenantAccountingAdvancedGraduationArchiveHandoffAnchorUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedGraduationArchiveHandoffAnchorUseCase,
      ) =>
        new GetTenantAccountingAdvancedArchiveHandoffPackageUseCase(
          getTenantAccountingAdvancedGraduationArchiveHandoffAnchorUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedGraduationSignalMatrixUseCase,
      inject: [GetTenantAccountingAdvancedArchiveHandoffPackageUseCase],
      useFactory: (
        getTenantAccountingAdvancedArchiveHandoffPackageUseCase,
      ) =>
        new GetTenantAccountingAdvancedGraduationSignalMatrixUseCase(
          getTenantAccountingAdvancedArchiveHandoffPackageUseCase,
        ),
    },
    {
      provide: GetTenantAccountingAdvancedProductScopeDecisionWorkspaceUseCase,
      inject: [GetTenantAccountingAdvancedGraduationSignalMatrixUseCase],
      useFactory: (
        getTenantAccountingAdvancedGraduationSignalMatrixUseCase,
      ) =>
        new GetTenantAccountingAdvancedProductScopeDecisionWorkspaceUseCase(
          getTenantAccountingAdvancedGraduationSignalMatrixUseCase,
        ),
    },
    {
      provide:
        GetTenantAccountingAdvancedGraduationArchiveHandoffCommandCenterUseCase,
      inject: [
        GetTenantAccountingAdvancedProductScopeDecisionWorkspaceUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedProductScopeDecisionWorkspaceUseCase,
      ) =>
        new GetTenantAccountingAdvancedGraduationArchiveHandoffCommandCenterUseCase(
          getTenantAccountingAdvancedProductScopeDecisionWorkspaceUseCase,
        ),
    },
    {
      provide:
        RequestTenantAccountingAdvancedGraduationArchiveHandoffCloseoutUseCase,
      inject: [
        GetTenantAccountingAdvancedGraduationArchiveHandoffCommandCenterUseCase,
      ],
      useFactory: (
        getTenantAccountingAdvancedGraduationArchiveHandoffCommandCenterUseCase,
      ) =>
        new RequestTenantAccountingAdvancedGraduationArchiveHandoffCloseoutUseCase(
          getTenantAccountingAdvancedGraduationArchiveHandoffCommandCenterUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingCandidateAnchorUseCase,
      inject: [
        RequestTenantAccountingAdvancedGraduationArchiveHandoffCloseoutUseCase,
      ],
      useFactory: (
        requestTenantAccountingAdvancedGraduationArchiveHandoffCloseoutUseCase,
      ) =>
        new GetTenantFullAccountingCandidateAnchorUseCase(
          requestTenantAccountingAdvancedGraduationArchiveHandoffCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingCoreLedgerScopeBlueprintUseCase,
      inject: [GetTenantFullAccountingCandidateAnchorUseCase],
      useFactory: (getTenantFullAccountingCandidateAnchorUseCase) =>
        new GetTenantFullAccountingCoreLedgerScopeBlueprintUseCase(
          getTenantFullAccountingCandidateAnchorUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingBankReconciliationBoundaryUseCase,
      inject: [GetTenantFullAccountingCoreLedgerScopeBlueprintUseCase],
      useFactory: (
        getTenantFullAccountingCoreLedgerScopeBlueprintUseCase,
      ) =>
        new GetTenantFullAccountingBankReconciliationBoundaryUseCase(
          getTenantFullAccountingCoreLedgerScopeBlueprintUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingFinancialStatementsBlueprintUseCase,
      inject: [GetTenantFullAccountingBankReconciliationBoundaryUseCase],
      useFactory: (
        getTenantFullAccountingBankReconciliationBoundaryUseCase,
      ) =>
        new GetTenantFullAccountingFinancialStatementsBlueprintUseCase(
          getTenantFullAccountingBankReconciliationBoundaryUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingLegalBooksStatutoryBoundaryUseCase,
      inject: [GetTenantFullAccountingFinancialStatementsBlueprintUseCase],
      useFactory: (
        getTenantFullAccountingFinancialStatementsBlueprintUseCase,
      ) =>
        new GetTenantFullAccountingLegalBooksStatutoryBoundaryUseCase(
          getTenantFullAccountingFinancialStatementsBlueprintUseCase,
        ),
    },
    {
      provide: RequestTenantFullAccountingCandidateCloseoutUseCase,
      inject: [GetTenantFullAccountingLegalBooksStatutoryBoundaryUseCase],
      useFactory: (
        getTenantFullAccountingLegalBooksStatutoryBoundaryUseCase,
      ) =>
        new RequestTenantFullAccountingCandidateCloseoutUseCase(
          getTenantFullAccountingLegalBooksStatutoryBoundaryUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingMvpReadinessAnchorUseCase,
      inject: [RequestTenantFullAccountingCandidateCloseoutUseCase],
      useFactory: (requestTenantFullAccountingCandidateCloseoutUseCase) =>
        new GetTenantFullAccountingMvpReadinessAnchorUseCase(
          requestTenantFullAccountingCandidateCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingLedgerPersistenceDesignWorkspaceUseCase,
      inject: [GetTenantFullAccountingMvpReadinessAnchorUseCase],
      useFactory: (getTenantFullAccountingMvpReadinessAnchorUseCase) =>
        new GetTenantFullAccountingLedgerPersistenceDesignWorkspaceUseCase(
          getTenantFullAccountingMvpReadinessAnchorUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingPostingPolicyApprovalBoundaryUseCase,
      inject: [GetTenantFullAccountingLedgerPersistenceDesignWorkspaceUseCase],
      useFactory: (
        getTenantFullAccountingLedgerPersistenceDesignWorkspaceUseCase,
      ) =>
        new GetTenantFullAccountingPostingPolicyApprovalBoundaryUseCase(
          getTenantFullAccountingLedgerPersistenceDesignWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingBankFeedReconciliationMvpReadinessUseCase,
      inject: [GetTenantFullAccountingPostingPolicyApprovalBoundaryUseCase],
      useFactory: (
        getTenantFullAccountingPostingPolicyApprovalBoundaryUseCase,
      ) =>
        new GetTenantFullAccountingBankFeedReconciliationMvpReadinessUseCase(
          getTenantFullAccountingPostingPolicyApprovalBoundaryUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingTrialBalanceStatementReadinessUseCase,
      inject: [
        GetTenantFullAccountingBankFeedReconciliationMvpReadinessUseCase,
      ],
      useFactory: (
        getTenantFullAccountingBankFeedReconciliationMvpReadinessUseCase,
      ) =>
        new GetTenantFullAccountingTrialBalanceStatementReadinessUseCase(
          getTenantFullAccountingBankFeedReconciliationMvpReadinessUseCase,
        ),
    },
    {
      provide: RequestTenantFullAccountingMvpReadinessCloseoutUseCase,
      inject: [GetTenantFullAccountingTrialBalanceStatementReadinessUseCase],
      useFactory: (
        getTenantFullAccountingTrialBalanceStatementReadinessUseCase,
      ) =>
        new RequestTenantFullAccountingMvpReadinessCloseoutUseCase(
          getTenantFullAccountingTrialBalanceStatementReadinessUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingMvpOperationsAnchorUseCase,
      inject: [RequestTenantFullAccountingMvpReadinessCloseoutUseCase],
      useFactory: (requestTenantFullAccountingMvpReadinessCloseoutUseCase) =>
        new GetTenantFullAccountingMvpOperationsAnchorUseCase(
          requestTenantFullAccountingMvpReadinessCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingLedgerWorkbenchMvpUseCase,
      inject: [GetTenantFullAccountingMvpOperationsAnchorUseCase],
      useFactory: (getTenantFullAccountingMvpOperationsAnchorUseCase) =>
        new GetTenantFullAccountingLedgerWorkbenchMvpUseCase(
          getTenantFullAccountingMvpOperationsAnchorUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingPostingDraftLaneUseCase,
      inject: [GetTenantFullAccountingLedgerWorkbenchMvpUseCase],
      useFactory: (getTenantFullAccountingLedgerWorkbenchMvpUseCase) =>
        new GetTenantFullAccountingPostingDraftLaneUseCase(
          getTenantFullAccountingLedgerWorkbenchMvpUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingBankReconciliationWorkbenchMvpUseCase,
      inject: [GetTenantFullAccountingPostingDraftLaneUseCase],
      useFactory: (getTenantFullAccountingPostingDraftLaneUseCase) =>
        new GetTenantFullAccountingBankReconciliationWorkbenchMvpUseCase(
          getTenantFullAccountingPostingDraftLaneUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingTrialBalancePreviewWorkbenchUseCase,
      inject: [GetTenantFullAccountingBankReconciliationWorkbenchMvpUseCase],
      useFactory: (
        getTenantFullAccountingBankReconciliationWorkbenchMvpUseCase,
      ) =>
        new GetTenantFullAccountingTrialBalancePreviewWorkbenchUseCase(
          getTenantFullAccountingBankReconciliationWorkbenchMvpUseCase,
        ),
    },
    {
      provide: RequestTenantFullAccountingMvpOperationsCloseoutUseCase,
      inject: [GetTenantFullAccountingTrialBalancePreviewWorkbenchUseCase],
      useFactory: (
        getTenantFullAccountingTrialBalancePreviewWorkbenchUseCase,
      ) =>
        new RequestTenantFullAccountingMvpOperationsCloseoutUseCase(
          getTenantFullAccountingTrialBalancePreviewWorkbenchUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingControlledPilotAnchorUseCase,
      inject: [RequestTenantFullAccountingMvpOperationsCloseoutUseCase],
      useFactory: (requestTenantFullAccountingMvpOperationsCloseoutUseCase) =>
        new GetTenantFullAccountingControlledPilotAnchorUseCase(
          requestTenantFullAccountingMvpOperationsCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingPilotEnrollmentPeriodFreezeUseCase,
      inject: [GetTenantFullAccountingControlledPilotAnchorUseCase],
      useFactory: (getTenantFullAccountingControlledPilotAnchorUseCase) =>
        new GetTenantFullAccountingPilotEnrollmentPeriodFreezeUseCase(
          getTenantFullAccountingControlledPilotAnchorUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingPilotRunbookWorkspaceUseCase,
      inject: [GetTenantFullAccountingPilotEnrollmentPeriodFreezeUseCase],
      useFactory: (
        getTenantFullAccountingPilotEnrollmentPeriodFreezeUseCase,
      ) =>
        new GetTenantFullAccountingPilotRunbookWorkspaceUseCase(
          getTenantFullAccountingPilotEnrollmentPeriodFreezeUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingPilotAccountantReviewRoomUseCase,
      inject: [GetTenantFullAccountingPilotRunbookWorkspaceUseCase],
      useFactory: (getTenantFullAccountingPilotRunbookWorkspaceUseCase) =>
        new GetTenantFullAccountingPilotAccountantReviewRoomUseCase(
          getTenantFullAccountingPilotRunbookWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingPilotOutcomePacketUseCase,
      inject: [GetTenantFullAccountingPilotAccountantReviewRoomUseCase],
      useFactory: (
        getTenantFullAccountingPilotAccountantReviewRoomUseCase,
      ) =>
        new GetTenantFullAccountingPilotOutcomePacketUseCase(
          getTenantFullAccountingPilotAccountantReviewRoomUseCase,
        ),
    },
    {
      provide: RequestTenantFullAccountingControlledPilotCloseoutUseCase,
      inject: [GetTenantFullAccountingPilotOutcomePacketUseCase],
      useFactory: (getTenantFullAccountingPilotOutcomePacketUseCase) =>
        new RequestTenantFullAccountingControlledPilotCloseoutUseCase(
          getTenantFullAccountingPilotOutcomePacketUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingGraduationAnchorUseCase,
      inject: [RequestTenantFullAccountingControlledPilotCloseoutUseCase],
      useFactory: (requestTenantFullAccountingControlledPilotCloseoutUseCase) =>
        new GetTenantFullAccountingGraduationAnchorUseCase(
          requestTenantFullAccountingControlledPilotCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingGraduationEvidenceDossierUseCase,
      inject: [GetTenantFullAccountingGraduationAnchorUseCase],
      useFactory: (getTenantFullAccountingGraduationAnchorUseCase) =>
        new GetTenantFullAccountingGraduationEvidenceDossierUseCase(
          getTenantFullAccountingGraduationAnchorUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingProductScopeGraduationMatrixUseCase,
      inject: [GetTenantFullAccountingGraduationEvidenceDossierUseCase],
      useFactory: (getTenantFullAccountingGraduationEvidenceDossierUseCase) =>
        new GetTenantFullAccountingProductScopeGraduationMatrixUseCase(
          getTenantFullAccountingGraduationEvidenceDossierUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingProfessionalOperatingModelUseCase,
      inject: [GetTenantFullAccountingProductScopeGraduationMatrixUseCase],
      useFactory: (
        getTenantFullAccountingProductScopeGraduationMatrixUseCase,
      ) =>
        new GetTenantFullAccountingProfessionalOperatingModelUseCase(
          getTenantFullAccountingProductScopeGraduationMatrixUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingGraduationRiskControlPackUseCase,
      inject: [GetTenantFullAccountingProfessionalOperatingModelUseCase],
      useFactory: (getTenantFullAccountingProfessionalOperatingModelUseCase) =>
        new GetTenantFullAccountingGraduationRiskControlPackUseCase(
          getTenantFullAccountingProfessionalOperatingModelUseCase,
        ),
    },
    {
      provide: RequestTenantFullAccountingGraduationCloseoutUseCase,
      inject: [GetTenantFullAccountingGraduationRiskControlPackUseCase],
      useFactory: (getTenantFullAccountingGraduationRiskControlPackUseCase) =>
        new RequestTenantFullAccountingGraduationCloseoutUseCase(
          getTenantFullAccountingGraduationRiskControlPackUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingProductDesignAnchorUseCase,
      inject: [RequestTenantFullAccountingGraduationCloseoutUseCase],
      useFactory: (requestTenantFullAccountingGraduationCloseoutUseCase) =>
        new GetTenantFullAccountingProductDesignAnchorUseCase(
          requestTenantFullAccountingGraduationCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingProductScopeContractUseCase,
      inject: [GetTenantFullAccountingProductDesignAnchorUseCase],
      useFactory: (getTenantFullAccountingProductDesignAnchorUseCase) =>
        new GetTenantFullAccountingProductScopeContractUseCase(
          getTenantFullAccountingProductDesignAnchorUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingProductProfessionalResponsibilityMatrixUseCase,
      inject: [GetTenantFullAccountingProductScopeContractUseCase],
      useFactory: (getTenantFullAccountingProductScopeContractUseCase) =>
        new GetTenantFullAccountingProductProfessionalResponsibilityMatrixUseCase(
          getTenantFullAccountingProductScopeContractUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingOfficialArtifactBoundaryRegistryUseCase,
      inject: [GetTenantFullAccountingProductProfessionalResponsibilityMatrixUseCase],
      useFactory: (
        getTenantFullAccountingProductProfessionalResponsibilityMatrixUseCase,
      ) =>
        new GetTenantFullAccountingOfficialArtifactBoundaryRegistryUseCase(
          getTenantFullAccountingProductProfessionalResponsibilityMatrixUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingWorkflowControlBlueprintUseCase,
      inject: [GetTenantFullAccountingOfficialArtifactBoundaryRegistryUseCase],
      useFactory: (
        getTenantFullAccountingOfficialArtifactBoundaryRegistryUseCase,
      ) =>
        new GetTenantFullAccountingWorkflowControlBlueprintUseCase(
          getTenantFullAccountingOfficialArtifactBoundaryRegistryUseCase,
        ),
    },
    {
      provide: RequestTenantFullAccountingProductDesignCloseoutUseCase,
      inject: [GetTenantFullAccountingWorkflowControlBlueprintUseCase],
      useFactory: (getTenantFullAccountingWorkflowControlBlueprintUseCase) =>
        new RequestTenantFullAccountingProductDesignCloseoutUseCase(
          getTenantFullAccountingWorkflowControlBlueprintUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingFormalReadinessAnchorUseCase,
      inject: [RequestTenantFullAccountingProductDesignCloseoutUseCase],
      useFactory: (requestTenantFullAccountingProductDesignCloseoutUseCase) =>
        new GetTenantFullAccountingFormalReadinessAnchorUseCase(
          requestTenantFullAccountingProductDesignCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingPolicyTemplateRegistryUseCase,
      inject: [GetTenantFullAccountingFormalReadinessAnchorUseCase],
      useFactory: (getTenantFullAccountingFormalReadinessAnchorUseCase) =>
        new GetTenantFullAccountingPolicyTemplateRegistryUseCase(
          getTenantFullAccountingFormalReadinessAnchorUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingProfessionalPortalReadinessShellUseCase,
      inject: [GetTenantFullAccountingPolicyTemplateRegistryUseCase],
      useFactory: (getTenantFullAccountingPolicyTemplateRegistryUseCase) =>
        new GetTenantFullAccountingProfessionalPortalReadinessShellUseCase(
          getTenantFullAccountingPolicyTemplateRegistryUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingFormalLedgerPostingReadinessPackUseCase,
      inject: [GetTenantFullAccountingProfessionalPortalReadinessShellUseCase],
      useFactory: (
        getTenantFullAccountingProfessionalPortalReadinessShellUseCase,
      ) =>
        new GetTenantFullAccountingFormalLedgerPostingReadinessPackUseCase(
          getTenantFullAccountingProfessionalPortalReadinessShellUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingStatementBankFormalBoundaryPackUseCase,
      inject: [GetTenantFullAccountingFormalLedgerPostingReadinessPackUseCase],
      useFactory: (
        getTenantFullAccountingFormalLedgerPostingReadinessPackUseCase,
      ) =>
        new GetTenantFullAccountingStatementBankFormalBoundaryPackUseCase(
          getTenantFullAccountingFormalLedgerPostingReadinessPackUseCase,
        ),
    },
    {
      provide: RequestTenantFullAccountingFormalReadinessCloseoutUseCase,
      inject: [GetTenantFullAccountingStatementBankFormalBoundaryPackUseCase],
      useFactory: (
        getTenantFullAccountingStatementBankFormalBoundaryPackUseCase,
      ) =>
        new RequestTenantFullAccountingFormalReadinessCloseoutUseCase(
          getTenantFullAccountingStatementBankFormalBoundaryPackUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingFormalArtifactDraftingAnchorUseCase,
      inject: [RequestTenantFullAccountingFormalReadinessCloseoutUseCase],
      useFactory: (
        requestTenantFullAccountingFormalReadinessCloseoutUseCase,
      ) =>
        new GetTenantFullAccountingFormalArtifactDraftingAnchorUseCase(
          requestTenantFullAccountingFormalReadinessCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingFormalLedgerDraftPackUseCase,
      inject: [GetTenantFullAccountingFormalArtifactDraftingAnchorUseCase],
      useFactory: (
        getTenantFullAccountingFormalArtifactDraftingAnchorUseCase,
      ) =>
        new GetTenantFullAccountingFormalLedgerDraftPackUseCase(
          getTenantFullAccountingFormalArtifactDraftingAnchorUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingPostingApprovalDraftPackUseCase,
      inject: [GetTenantFullAccountingFormalLedgerDraftPackUseCase],
      useFactory: (getTenantFullAccountingFormalLedgerDraftPackUseCase) =>
        new GetTenantFullAccountingPostingApprovalDraftPackUseCase(
          getTenantFullAccountingFormalLedgerDraftPackUseCase,
        ),
    },
    {
      provide:
        GetTenantFullAccountingBankReconciliationEvidenceDraftPackUseCase,
      inject: [GetTenantFullAccountingPostingApprovalDraftPackUseCase],
      useFactory: (getTenantFullAccountingPostingApprovalDraftPackUseCase) =>
        new GetTenantFullAccountingBankReconciliationEvidenceDraftPackUseCase(
          getTenantFullAccountingPostingApprovalDraftPackUseCase,
        ),
    },
    {
      provide:
        GetTenantFullAccountingTrialBalanceFinancialStatementDraftPackUseCase,
      inject: [
        GetTenantFullAccountingBankReconciliationEvidenceDraftPackUseCase,
      ],
      useFactory: (
        getTenantFullAccountingBankReconciliationEvidenceDraftPackUseCase,
      ) =>
        new GetTenantFullAccountingTrialBalanceFinancialStatementDraftPackUseCase(
          getTenantFullAccountingBankReconciliationEvidenceDraftPackUseCase,
        ),
    },
    {
      provide: RequestTenantFullAccountingFormalArtifactDraftingCloseoutUseCase,
      inject: [
        GetTenantFullAccountingTrialBalanceFinancialStatementDraftPackUseCase,
      ],
      useFactory: (
        getTenantFullAccountingTrialBalanceFinancialStatementDraftPackUseCase,
      ) =>
        new RequestTenantFullAccountingFormalArtifactDraftingCloseoutUseCase(
          getTenantFullAccountingTrialBalanceFinancialStatementDraftPackUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingProfessionalReviewExecutionAnchorUseCase,
      inject: [RequestTenantFullAccountingFormalArtifactDraftingCloseoutUseCase],
      useFactory: (
        requestTenantFullAccountingFormalArtifactDraftingCloseoutUseCase,
      ) =>
        new GetTenantFullAccountingProfessionalReviewExecutionAnchorUseCase(
          requestTenantFullAccountingFormalArtifactDraftingCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingAccountantDraftReviewRoomUseCase,
      inject: [GetTenantFullAccountingProfessionalReviewExecutionAnchorUseCase],
      useFactory: (
        getTenantFullAccountingProfessionalReviewExecutionAnchorUseCase,
      ) =>
        new GetTenantFullAccountingAccountantDraftReviewRoomUseCase(
          getTenantFullAccountingProfessionalReviewExecutionAnchorUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingReviewChangeRequestPackUseCase,
      inject: [GetTenantFullAccountingAccountantDraftReviewRoomUseCase],
      useFactory: (getTenantFullAccountingAccountantDraftReviewRoomUseCase) =>
        new GetTenantFullAccountingReviewChangeRequestPackUseCase(
          getTenantFullAccountingAccountantDraftReviewRoomUseCase,
        ),
    },
    {
      provide:
        RequestTenantFullAccountingProfessionalApprovalRecommendationPackUseCase,
      inject: [GetTenantFullAccountingReviewChangeRequestPackUseCase],
      useFactory: (getTenantFullAccountingReviewChangeRequestPackUseCase) =>
        new RequestTenantFullAccountingProfessionalApprovalRecommendationPackUseCase(
          getTenantFullAccountingReviewChangeRequestPackUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingReviewExecutionCommandCenterUseCase,
      inject: [
        RequestTenantFullAccountingProfessionalApprovalRecommendationPackUseCase,
      ],
      useFactory: (
        requestTenantFullAccountingProfessionalApprovalRecommendationPackUseCase,
      ) =>
        new GetTenantFullAccountingReviewExecutionCommandCenterUseCase(
          requestTenantFullAccountingProfessionalApprovalRecommendationPackUseCase,
        ),
    },
    {
      provide:
        RequestTenantFullAccountingProfessionalReviewExecutionCloseoutUseCase,
      inject: [GetTenantFullAccountingReviewExecutionCommandCenterUseCase],
      useFactory: (
        getTenantFullAccountingReviewExecutionCommandCenterUseCase,
      ) =>
        new RequestTenantFullAccountingProfessionalReviewExecutionCloseoutUseCase(
          getTenantFullAccountingReviewExecutionCommandCenterUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingFormalApprovalWorkflowAnchorUseCase,
      inject: [
        RequestTenantFullAccountingProfessionalReviewExecutionCloseoutUseCase,
      ],
      useFactory: (
        requestTenantFullAccountingProfessionalReviewExecutionCloseoutUseCase,
      ) =>
        new GetTenantFullAccountingFormalApprovalWorkflowAnchorUseCase(
          requestTenantFullAccountingProfessionalReviewExecutionCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingApprovalAuthorityMatrixUseCase,
      inject: [GetTenantFullAccountingFormalApprovalWorkflowAnchorUseCase],
      useFactory: (
        getTenantFullAccountingFormalApprovalWorkflowAnchorUseCase,
      ) =>
        new GetTenantFullAccountingApprovalAuthorityMatrixUseCase(
          getTenantFullAccountingFormalApprovalWorkflowAnchorUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingFormalApprovalEvidencePackUseCase,
      inject: [GetTenantFullAccountingApprovalAuthorityMatrixUseCase],
      useFactory: (getTenantFullAccountingApprovalAuthorityMatrixUseCase) =>
        new GetTenantFullAccountingFormalApprovalEvidencePackUseCase(
          getTenantFullAccountingApprovalAuthorityMatrixUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingApprovalDecisionWorkspaceUseCase,
      inject: [GetTenantFullAccountingFormalApprovalEvidencePackUseCase],
      useFactory: (
        getTenantFullAccountingFormalApprovalEvidencePackUseCase,
      ) =>
        new GetTenantFullAccountingApprovalDecisionWorkspaceUseCase(
          getTenantFullAccountingFormalApprovalEvidencePackUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingFormalApprovalCommandCenterUseCase,
      inject: [GetTenantFullAccountingApprovalDecisionWorkspaceUseCase],
      useFactory: (getTenantFullAccountingApprovalDecisionWorkspaceUseCase) =>
        new GetTenantFullAccountingFormalApprovalCommandCenterUseCase(
          getTenantFullAccountingApprovalDecisionWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantFullAccountingFormalApprovalWorkflowCloseoutUseCase,
      inject: [GetTenantFullAccountingFormalApprovalCommandCenterUseCase],
      useFactory: (
        getTenantFullAccountingFormalApprovalCommandCenterUseCase,
      ) =>
        new RequestTenantFullAccountingFormalApprovalWorkflowCloseoutUseCase(
          getTenantFullAccountingFormalApprovalCommandCenterUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingSignatureCertificationBoundaryAnchorUseCase,
      inject: [RequestTenantFullAccountingFormalApprovalWorkflowCloseoutUseCase],
      useFactory: (
        requestTenantFullAccountingFormalApprovalWorkflowCloseoutUseCase,
      ) =>
        new GetTenantFullAccountingSignatureCertificationBoundaryAnchorUseCase(
          requestTenantFullAccountingFormalApprovalWorkflowCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingFormalSignatoryRegistryUseCase,
      inject: [GetTenantFullAccountingSignatureCertificationBoundaryAnchorUseCase],
      useFactory: (
        getTenantFullAccountingSignatureCertificationBoundaryAnchorUseCase,
      ) =>
        new GetTenantFullAccountingFormalSignatoryRegistryUseCase(
          getTenantFullAccountingSignatureCertificationBoundaryAnchorUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingSignatureEvidenceReadinessPackUseCase,
      inject: [GetTenantFullAccountingFormalSignatoryRegistryUseCase],
      useFactory: (getTenantFullAccountingFormalSignatoryRegistryUseCase) =>
        new GetTenantFullAccountingSignatureEvidenceReadinessPackUseCase(
          getTenantFullAccountingFormalSignatoryRegistryUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingCertificationRequirementWorkspaceUseCase,
      inject: [GetTenantFullAccountingSignatureEvidenceReadinessPackUseCase],
      useFactory: (
        getTenantFullAccountingSignatureEvidenceReadinessPackUseCase,
      ) =>
        new GetTenantFullAccountingCertificationRequirementWorkspaceUseCase(
          getTenantFullAccountingSignatureEvidenceReadinessPackUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingLegalizationBoundaryPacketUseCase,
      inject: [GetTenantFullAccountingCertificationRequirementWorkspaceUseCase],
      useFactory: (
        getTenantFullAccountingCertificationRequirementWorkspaceUseCase,
      ) =>
        new GetTenantFullAccountingLegalizationBoundaryPacketUseCase(
          getTenantFullAccountingCertificationRequirementWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantFullAccountingSignatureCertificationBoundaryCloseoutUseCase,
      inject: [GetTenantFullAccountingLegalizationBoundaryPacketUseCase],
      useFactory: (getTenantFullAccountingLegalizationBoundaryPacketUseCase) =>
        new RequestTenantFullAccountingSignatureCertificationBoundaryCloseoutUseCase(
          getTenantFullAccountingLegalizationBoundaryPacketUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingExternalExecutionHandoffAnchorUseCase,
      inject: [
        RequestTenantFullAccountingSignatureCertificationBoundaryCloseoutUseCase,
      ],
      useFactory: (
        requestTenantFullAccountingSignatureCertificationBoundaryCloseoutUseCase,
      ) =>
        new GetTenantFullAccountingExternalExecutionHandoffAnchorUseCase(
          requestTenantFullAccountingSignatureCertificationBoundaryCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingExternalExecutorAssignmentMatrixUseCase,
      inject: [GetTenantFullAccountingExternalExecutionHandoffAnchorUseCase],
      useFactory: (
        getTenantFullAccountingExternalExecutionHandoffAnchorUseCase,
      ) =>
        new GetTenantFullAccountingExternalExecutorAssignmentMatrixUseCase(
          getTenantFullAccountingExternalExecutionHandoffAnchorUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingExecutionHandoffEvidenceBundleUseCase,
      inject: [GetTenantFullAccountingExternalExecutorAssignmentMatrixUseCase],
      useFactory: (
        getTenantFullAccountingExternalExecutorAssignmentMatrixUseCase,
      ) =>
        new GetTenantFullAccountingExecutionHandoffEvidenceBundleUseCase(
          getTenantFullAccountingExternalExecutorAssignmentMatrixUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingExternalExecutionInstructionPackUseCase,
      inject: [GetTenantFullAccountingExecutionHandoffEvidenceBundleUseCase],
      useFactory: (
        getTenantFullAccountingExecutionHandoffEvidenceBundleUseCase,
      ) =>
        new GetTenantFullAccountingExternalExecutionInstructionPackUseCase(
          getTenantFullAccountingExecutionHandoffEvidenceBundleUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingExecutionReturnEvidenceIntakeUseCase,
      inject: [GetTenantFullAccountingExternalExecutionInstructionPackUseCase],
      useFactory: (
        getTenantFullAccountingExternalExecutionInstructionPackUseCase,
      ) =>
        new GetTenantFullAccountingExecutionReturnEvidenceIntakeUseCase(
          getTenantFullAccountingExternalExecutionInstructionPackUseCase,
        ),
    },
    {
      provide: RequestTenantFullAccountingExternalExecutionHandoffCloseoutUseCase,
      inject: [GetTenantFullAccountingExecutionReturnEvidenceIntakeUseCase],
      useFactory: (
        getTenantFullAccountingExecutionReturnEvidenceIntakeUseCase,
      ) =>
        new RequestTenantFullAccountingExternalExecutionHandoffCloseoutUseCase(
          getTenantFullAccountingExecutionReturnEvidenceIntakeUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingExternalExecutionTrackingAnchorUseCase,
      inject: [
        RequestTenantFullAccountingExternalExecutionHandoffCloseoutUseCase,
      ],
      useFactory: (
        requestTenantFullAccountingExternalExecutionHandoffCloseoutUseCase,
      ) =>
        new GetTenantFullAccountingExternalExecutionTrackingAnchorUseCase(
          requestTenantFullAccountingExternalExecutionHandoffCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingExternalExecutionStatusLedgerUseCase,
      inject: [GetTenantFullAccountingExternalExecutionTrackingAnchorUseCase],
      useFactory: (
        getTenantFullAccountingExternalExecutionTrackingAnchorUseCase,
      ) =>
        new GetTenantFullAccountingExternalExecutionStatusLedgerUseCase(
          getTenantFullAccountingExternalExecutionTrackingAnchorUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingReturnedEvidenceValidationWorkspaceUseCase,
      inject: [GetTenantFullAccountingExternalExecutionStatusLedgerUseCase],
      useFactory: (
        getTenantFullAccountingExternalExecutionStatusLedgerUseCase,
      ) =>
        new GetTenantFullAccountingReturnedEvidenceValidationWorkspaceUseCase(
          getTenantFullAccountingExternalExecutionStatusLedgerUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingExternalObservationResolutionQueueUseCase,
      inject: [GetTenantFullAccountingReturnedEvidenceValidationWorkspaceUseCase],
      useFactory: (
        getTenantFullAccountingReturnedEvidenceValidationWorkspaceUseCase,
      ) =>
        new GetTenantFullAccountingExternalObservationResolutionQueueUseCase(
          getTenantFullAccountingReturnedEvidenceValidationWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingExternalExecutionTrackingCommandCenterUseCase,
      inject: [GetTenantFullAccountingExternalObservationResolutionQueueUseCase],
      useFactory: (
        getTenantFullAccountingExternalObservationResolutionQueueUseCase,
      ) =>
        new GetTenantFullAccountingExternalExecutionTrackingCommandCenterUseCase(
          getTenantFullAccountingExternalObservationResolutionQueueUseCase,
        ),
    },
    {
      provide: RequestTenantFullAccountingExternalExecutionTrackingCloseoutUseCase,
      inject: [GetTenantFullAccountingExternalExecutionTrackingCommandCenterUseCase],
      useFactory: (
        getTenantFullAccountingExternalExecutionTrackingCommandCenterUseCase,
      ) =>
        new RequestTenantFullAccountingExternalExecutionTrackingCloseoutUseCase(
          getTenantFullAccountingExternalExecutionTrackingCommandCenterUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingExternalResultIntakeAnchorUseCase,
      inject: [
        RequestTenantFullAccountingExternalExecutionTrackingCloseoutUseCase,
      ],
      useFactory: (
        requestTenantFullAccountingExternalExecutionTrackingCloseoutUseCase,
      ) =>
        new GetTenantFullAccountingExternalResultIntakeAnchorUseCase(
          requestTenantFullAccountingExternalExecutionTrackingCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingReturnedArtifactRegistryUseCase,
      inject: [GetTenantFullAccountingExternalResultIntakeAnchorUseCase],
      useFactory: (getTenantFullAccountingExternalResultIntakeAnchorUseCase) =>
        new GetTenantFullAccountingReturnedArtifactRegistryUseCase(
          getTenantFullAccountingExternalResultIntakeAnchorUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingInternalAcceptanceCriteriaWorkspaceUseCase,
      inject: [GetTenantFullAccountingReturnedArtifactRegistryUseCase],
      useFactory: (getTenantFullAccountingReturnedArtifactRegistryUseCase) =>
        new GetTenantFullAccountingInternalAcceptanceCriteriaWorkspaceUseCase(
          getTenantFullAccountingReturnedArtifactRegistryUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingAcceptanceDecisionWorkspaceUseCase,
      inject: [
        GetTenantFullAccountingInternalAcceptanceCriteriaWorkspaceUseCase,
      ],
      useFactory: (
        getTenantFullAccountingInternalAcceptanceCriteriaWorkspaceUseCase,
      ) =>
        new GetTenantFullAccountingAcceptanceDecisionWorkspaceUseCase(
          getTenantFullAccountingInternalAcceptanceCriteriaWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantFullAccountingInternalAcceptanceCommandCenterUseCase,
      inject: [GetTenantFullAccountingAcceptanceDecisionWorkspaceUseCase],
      useFactory: (getTenantFullAccountingAcceptanceDecisionWorkspaceUseCase) =>
        new GetTenantFullAccountingInternalAcceptanceCommandCenterUseCase(
          getTenantFullAccountingAcceptanceDecisionWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantFullAccountingExternalResultIntakeCloseoutUseCase,
      inject: [GetTenantFullAccountingInternalAcceptanceCommandCenterUseCase],
      useFactory: (
        getTenantFullAccountingInternalAcceptanceCommandCenterUseCase,
      ) =>
        new RequestTenantFullAccountingExternalResultIntakeCloseoutUseCase(
          getTenantFullAccountingInternalAcceptanceCommandCenterUseCase,
        ),
    },

    {
      provide: GetTenantFullAccountingFormalRecordAssemblyAnchorUseCase,
      inject: [RequestTenantFullAccountingExternalResultIntakeCloseoutUseCase],
      useFactory: (requestTenantFullAccountingExternalResultIntakeCloseoutUseCase) => new GetTenantFullAccountingFormalRecordAssemblyAnchorUseCase(requestTenantFullAccountingExternalResultIntakeCloseoutUseCase),
    },
    {
      provide: GetTenantFullAccountingAcceptedArtifactBinderUseCase,
      inject: [GetTenantFullAccountingFormalRecordAssemblyAnchorUseCase],
      useFactory: (getTenantFullAccountingFormalRecordAssemblyAnchorUseCase) => new GetTenantFullAccountingAcceptedArtifactBinderUseCase(getTenantFullAccountingFormalRecordAssemblyAnchorUseCase),
    },
    {
      provide: GetTenantFullAccountingFormalRecordIndexWorkspaceUseCase,
      inject: [GetTenantFullAccountingAcceptedArtifactBinderUseCase],
      useFactory: (getTenantFullAccountingAcceptedArtifactBinderUseCase) => new GetTenantFullAccountingFormalRecordIndexWorkspaceUseCase(getTenantFullAccountingAcceptedArtifactBinderUseCase),
    },
    {
      provide: GetTenantFullAccountingRecordConsistencyReviewWorkspaceUseCase,
      inject: [GetTenantFullAccountingFormalRecordIndexWorkspaceUseCase],
      useFactory: (getTenantFullAccountingFormalRecordIndexWorkspaceUseCase) => new GetTenantFullAccountingRecordConsistencyReviewWorkspaceUseCase(getTenantFullAccountingFormalRecordIndexWorkspaceUseCase),
    },
    {
      provide: GetTenantFullAccountingFormalRecordAssemblyCommandCenterUseCase,
      inject: [GetTenantFullAccountingRecordConsistencyReviewWorkspaceUseCase],
      useFactory: (getTenantFullAccountingRecordConsistencyReviewWorkspaceUseCase) => new GetTenantFullAccountingFormalRecordAssemblyCommandCenterUseCase(getTenantFullAccountingRecordConsistencyReviewWorkspaceUseCase),
    },
    {
      provide: RequestTenantFullAccountingFormalRecordAssemblyCloseoutUseCase,
      inject: [GetTenantFullAccountingFormalRecordAssemblyCommandCenterUseCase],
      useFactory: (getTenantFullAccountingFormalRecordAssemblyCommandCenterUseCase) => new RequestTenantFullAccountingFormalRecordAssemblyCloseoutUseCase(getTenantFullAccountingFormalRecordAssemblyCommandCenterUseCase),
    },

    { provide: GetTenantFullAccountingFormalRecordCloseoutAnchorUseCase, inject: [RequestTenantFullAccountingFormalRecordAssemblyCloseoutUseCase], useFactory: (uc) => new GetTenantFullAccountingFormalRecordCloseoutAnchorUseCase(uc) },
    { provide: GetTenantFullAccountingArchiveReadinessWorkspaceUseCase, inject: [GetTenantFullAccountingFormalRecordCloseoutAnchorUseCase], useFactory: (uc) => new GetTenantFullAccountingArchiveReadinessWorkspaceUseCase(uc) },
    { provide: GetTenantFullAccountingFormalCloseoutEvidencePacketUseCase, inject: [GetTenantFullAccountingArchiveReadinessWorkspaceUseCase], useFactory: (uc) => new GetTenantFullAccountingFormalCloseoutEvidencePacketUseCase(uc) },
    { provide: GetTenantFullAccountingProfessionalCloseoutAttestationBoundaryUseCase, inject: [GetTenantFullAccountingFormalCloseoutEvidencePacketUseCase], useFactory: (uc) => new GetTenantFullAccountingProfessionalCloseoutAttestationBoundaryUseCase(uc) },
    { provide: GetTenantFullAccountingFormalRecordCloseoutCommandCenterUseCase, inject: [GetTenantFullAccountingProfessionalCloseoutAttestationBoundaryUseCase], useFactory: (uc) => new GetTenantFullAccountingFormalRecordCloseoutCommandCenterUseCase(uc) },
    { provide: RequestTenantFullAccountingFormalRecordCloseoutCloseoutUseCase, inject: [GetTenantFullAccountingFormalRecordCloseoutCommandCenterUseCase], useFactory: (uc) => new RequestTenantFullAccountingFormalRecordCloseoutCloseoutUseCase(uc) },
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
      provide: RequestTenantAccountingOpeningBalanceApprovalPacketUseCase,
      inject: [GetTenantAccountingOpeningBalanceWorkspaceUseCase],
      useFactory: (getTenantAccountingOpeningBalanceWorkspaceUseCase) =>
        new RequestTenantAccountingOpeningBalanceApprovalPacketUseCase(
          getTenantAccountingOpeningBalanceWorkspaceUseCase,
        ),
    },
    {
      provide: CreateTenantAccountingOpeningBalanceJournalEntryUseCase,
      inject: [
        RequestTenantAccountingOpeningBalanceApprovalPacketUseCase,
        ACCOUNTING_JOURNAL_ENTRY_REPOSITORY,
        ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR,
        TENANT_REPOSITORY,
      ],
      useFactory: (
        requestTenantAccountingOpeningBalanceApprovalPacketUseCase,
        accountingJournalEntryRepository,
        accountingJournalEntryIdGenerator,
        tenantRepository,
      ) =>
        new CreateTenantAccountingOpeningBalanceJournalEntryUseCase(
          requestTenantAccountingOpeningBalanceApprovalPacketUseCase,
          accountingJournalEntryRepository,
          accountingJournalEntryIdGenerator,
          tenantRepository,
        ),
    },
    {
      provide: GetTenantAccountingOpeningBalanceControlRegistryUseCase,
      inject: [
        RequestTenantAccountingOpeningBalanceApprovalPacketUseCase,
        ACCOUNTING_JOURNAL_ENTRY_REPOSITORY,
      ],
      useFactory: (
        requestTenantAccountingOpeningBalanceApprovalPacketUseCase,
        accountingJournalEntryRepository,
      ) =>
        new GetTenantAccountingOpeningBalanceControlRegistryUseCase(
          requestTenantAccountingOpeningBalanceApprovalPacketUseCase,
          accountingJournalEntryRepository,
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
      provide: GetTenantAccountingBankAccountRegistryWorkspaceUseCase,
      inject: [
        GetTenantAccountingLedgerRegistryWorkspaceUseCase,
        ListTenantAccountingBankStatementRegistryUseCase,
        GetTenantAccountingOpeningBalanceWorkspaceUseCase,
      ],
      useFactory: (
        getTenantAccountingLedgerRegistryWorkspaceUseCase,
        listTenantAccountingBankStatementRegistryUseCase,
        getTenantAccountingOpeningBalanceWorkspaceUseCase,
      ) =>
        new GetTenantAccountingBankAccountRegistryWorkspaceUseCase(
          getTenantAccountingLedgerRegistryWorkspaceUseCase,
          listTenantAccountingBankStatementRegistryUseCase,
          getTenantAccountingOpeningBalanceWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantAccountingBankStatementImportProfileWorkspaceUseCase,
      inject: [
        GetTenantAccountingBankAccountRegistryWorkspaceUseCase,
        GetTenantAccountingBankStatementImportWorkspaceUseCase,
        ListTenantAccountingBankStatementRegistryUseCase,
      ],
      useFactory: (
        getTenantAccountingBankAccountRegistryWorkspaceUseCase,
        getTenantAccountingBankStatementImportWorkspaceUseCase,
        listTenantAccountingBankStatementRegistryUseCase,
      ) =>
        new GetTenantAccountingBankStatementImportProfileWorkspaceUseCase(
          getTenantAccountingBankAccountRegistryWorkspaceUseCase,
          getTenantAccountingBankStatementImportWorkspaceUseCase,
          listTenantAccountingBankStatementRegistryUseCase,
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
      provide: GetTenantAccountingOperationalCommandCenterUseCase,
      inject: [
        GetTenantAccountingOpeningBalanceControlRegistryUseCase,
        GetTenantAccountingBankAccountRegistryWorkspaceUseCase,
        GetTenantAccountingBankStatementImportProfileWorkspaceUseCase,
        GetTenantAccountingBankReconciliationWorkspaceUseCase,
        GetTenantAccountingCloseoutCertificationReadinessUseCase,
        GetTenantAccountingFinancialStatementPreviewUseCase,
      ],
      useFactory: (
        getTenantAccountingOpeningBalanceControlRegistryUseCase,
        getTenantAccountingBankAccountRegistryWorkspaceUseCase,
        getTenantAccountingBankStatementImportProfileWorkspaceUseCase,
        getTenantAccountingBankReconciliationWorkspaceUseCase,
        getTenantAccountingCloseoutCertificationReadinessUseCase,
        getTenantAccountingFinancialStatementPreviewUseCase,
      ) =>
        new GetTenantAccountingOperationalCommandCenterUseCase(
          getTenantAccountingOpeningBalanceControlRegistryUseCase,
          getTenantAccountingBankAccountRegistryWorkspaceUseCase,
          getTenantAccountingBankStatementImportProfileWorkspaceUseCase,
          getTenantAccountingBankReconciliationWorkspaceUseCase,
          getTenantAccountingCloseoutCertificationReadinessUseCase,
          getTenantAccountingFinancialStatementPreviewUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingFoundationCloseoutPackV2UseCase,
      inject: [
        GetTenantAccountingFoundationCloseoutSummaryUseCase,
        GetTenantAccountingOperationalCommandCenterUseCase,
      ],
      useFactory: (
        getTenantAccountingFoundationCloseoutSummaryUseCase,
        getTenantAccountingOperationalCommandCenterUseCase,
      ) =>
        new RequestTenantAccountingFoundationCloseoutPackV2UseCase(
          getTenantAccountingFoundationCloseoutSummaryUseCase,
          getTenantAccountingOperationalCommandCenterUseCase,
        ),
    },
    {
      provide: RequestTenantAccountingTaxComplianceFeedbackBridgeUseCase,
      inject: [RequestTenantAccountingFoundationCloseoutPackV2UseCase],
      useFactory: (requestTenantAccountingFoundationCloseoutPackV2UseCase) =>
        new RequestTenantAccountingTaxComplianceFeedbackBridgeUseCase(
          requestTenantAccountingFoundationCloseoutPackV2UseCase,
        ),
    },
    {
      provide: GetTenantAccountingTaxDeclarationEvidenceBridgeUseCase,
      inject: [RequestTenantAccountingTaxComplianceFeedbackBridgeUseCase],
      useFactory: (requestTenantAccountingTaxComplianceFeedbackBridgeUseCase) =>
        new GetTenantAccountingTaxDeclarationEvidenceBridgeUseCase(
          requestTenantAccountingTaxComplianceFeedbackBridgeUseCase,
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
