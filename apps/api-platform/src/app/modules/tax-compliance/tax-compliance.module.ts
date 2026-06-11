import { Module } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '@saas-platform/catalog-application';
import {
  ENTITLEMENT_REPOSITORY,
  GetTenantEnabledProductByKeyUseCase,
  ListTenantEnabledProductsUseCase,
} from '@saas-platform/commercial-application';
import { FEATURE_FLAG_REPOSITORY } from '@saas-platform/feature-flags-application';
import {
  CreateTenantWithholdingUseCase,
  CUSTOMER_REPOSITORY,
  GetTenantInvoicingReportSummaryUseCase,
  INVOICE_ID_GENERATOR,
  INVOICE_ITEM_REPOSITORY,
  INVOICE_ITEM_ID_GENERATOR,
  INVOICE_NUMBERING_SETTINGS_REPOSITORY,
  INVOICE_REPOSITORY,
  ISSUER_PROFILE_REPOSITORY,
  PAYMENT_REPOSITORY,
  TAX_RATE_REPOSITORY,
} from '@saas-platform/invoicing-application';
import {
  GetTenantPartyDirectoryCoreV2WorkspaceUseCase,
  GetTenantPartyDuplicateMergeReadinessWorkspaceUseCase,
  GetTenantPartyFiscalCleanupWorkspaceUseCase,
  GetTenantPartyFiscalIdentityProfileWorkspaceUseCase,
  GetTenantPartyFiscalReadinessSummaryUseCase,
  GetTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase,
  ListTenantPartiesUseCase,
  PARTY_DIRECTORY_REPOSITORY,
} from '@saas-platform/parties-application';
import {
  ExecuteTenantEcuadorTaxWithholdingDraftBridgeUseCase,
  GetTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase,
  GetTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase,
  GetTenantEcuadorTaxAccountantDecisionRecordV73UseCase,
  GetTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase,
  GetTenantEcuadorTaxAccountingAdvancedEvidenceGateV71UseCase,
  GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase,
  GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
  GetTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase,
  GetTenantEcuadorTaxAccountantFilingReviewRoomV3UseCase,
  GetTenantEcuadorTaxAccountantHandoffRoomV2UseCase,
  GetTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase,
  GetTenantEcuadorTaxAnnexesReadinessUseCase,
  GetTenantEcuadorTaxAnnexesReadinessV2UseCase,
  GetTenantEcuadorTaxAnnexesWorkspaceUseCase,
  GetTenantEcuadorTaxAccountingAdvancedDiscoveryGateUseCase,
  GetTenantEcuadorTaxAnnualFiscalYearWorkspaceUseCase,
  GetTenantEcuadorTaxAnnualIncomeTaxReconciliationV2UseCase,
  GetTenantEcuadorTaxAnnualRollupWorkspaceUseCase,
  GetTenantEcuadorTaxAccountantWorkbenchUseCase,
  GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
  GetTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase,
  GetTenantEcuadorTaxAccountingBoundaryAiReviewUseCase,
  GetTenantEcuadorTaxAccountingBoundaryCloseoutUseCase,
  GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
  GetTenantEcuadorTaxAuditReadinessUseCase,
  GetTenantEcuadorTaxAuditReadinessBinderUseCase,
  GetTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase,
  GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
  GetTenantEcuadorTaxDeclarationFormCatalogUseCase,
  GetTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase,
  GetTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase,
  GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
  GetTenantEcuadorTaxCommandCenterUseCase,
  GetTenantEcuadorTaxCommandCenterV2UseCase,
  GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
  GetTenantEcuadorTaxDueMonitorUseCase,
  GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
  GetTenantEcuadorTaxEvidenceQualityCenterUseCase,
  GetTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase,
  GetTenantEcuadorTaxFilingHandoffUseCase,
  GetTenantEcuadorTaxFilingEvidenceVaultV2UseCase,
  GetTenantEcuadorTaxFormBoxEvidenceBinderUseCase,
  GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
  GetTenantEcuadorTaxFormMappingCatalogUseCase,
  GetTenantEcuadorTaxExceptionCenterUseCase,
  GetTenantEcuadorTaxExternalAccountantAnnualReviewRoomUseCase,
  GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
  GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase,
  GetTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase,
  GetTenantEcuadorTaxObligationMatrixUseCase,
  GetTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase,
  GetTenantEcuadorTaxObligationCalendarUseCase,
  GetTenantEcuadorTaxObligationFilingWorkspaceUseCase,
  GetTenantEcuadorTaxObligationSettingsUseCase,
  GetTenantEcuadorTaxObligationRiskMonitorUseCase,
  GetTenantEcuadorTaxOperationalCloseoutUseCase,
  GetTenantEcuadorTaxOperatingDashboardV3UseCase,
  GetTenantEcuadorTaxOperatorActionCenterV62UseCase,
  GetTenantEcuadorTaxPaymentObligationTrackerUseCase,
  GetTenantEcuadorTaxPartyEvidenceBridgeUseCase,
  GetTenantEcuadorTaxPartyFiscalValidationLedgerUseCase,
  GetTenantEcuadorTaxPartiesOperationalCommandCenterUseCase,
  GetTenantEcuadorTaxPeriodEvidenceVaultUseCase,
  GetTenantEcuadorTaxPeriodWorkspaceUseCase,
  GetTenantEcuadorTaxPilotCohortRegistryV71UseCase,
  GetTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase,
  GetTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase,
  GetTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase,
  GetTenantEcuadorTaxPilotLearningBacklogV71UseCase,
  GetTenantEcuadorTaxPilotMultiTenantCohortV72UseCase,
  GetTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase,
  GetTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase,
  GetTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase,
  GetTenantEcuadorTaxPostFilingExceptionCenterUseCase,
  GetTenantEcuadorTaxProfessionalHandoffV6UseCase,
  GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
  GetTenantEcuadorTaxReconciliationWorkspaceUseCase,
  GetTenantEcuadorTaxRuleCatalogUseCase,
  GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
  GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
  GetTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase,
  GetTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase,
  GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
  GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
  GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
  GetTenantEcuadorTaxSriSourceImportCenterV2UseCase,
  GetTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase,
  GetTenantEcuadorTaxVatDeclarationApprovalUseCase,
  GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
  GetTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase,
  GetTenantEcuadorTaxVatFormContractWorkspaceUseCase,
  GetTenantEcuadorTaxpayerProfileUseCase,
  GetTenantEcuadorTaxWithholdingRegistryUseCase,
  ListTenantEcuadorTaxAccountantReviewsUseCase,
  ListTenantEcuadorTaxComplianceEventsUseCase,
  ListTenantEcuadorTaxExternalFilingResultsUseCase,
  RecordTenantEcuadorTaxComplianceEventUseCase,
  RecordTenantEcuadorTaxExternalFilingResultUseCase,
  RecordTenantEcuadorTaxFilingHandoffUseCase,
  RecordTenantEcuadorTaxPartySriEvidenceImportUseCase,
  RecordTenantEcuadorTaxPurchaseExpenseEvidenceUseCase,
  RecordTenantEcuadorTaxSriFiscalEvidenceImportUseCase,
  RequestTenantEcuadorTaxAccountantPartyRiskReviewExecutionUseCase,
  RequestTenantEcuadorTaxAccountantReviewPacketUseCase,
  RequestTenantEcuadorTaxAccountantReviewUseCase,
  RequestTenantEcuadorTaxAccountantCollaborationPackUseCase,
  RequestTenantEcuadorTaxAccountantPacketExportV62UseCase,
  RequestTenantEcuadorTaxAccountingReadinessPacketUseCase,
  RequestTenantEcuadorTaxAccountingBridgePreviewUseCase,
  RequestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase,
  RequestTenantEcuadorTaxAiFilingAssistantPacketUseCase,
  RequestTenantEcuadorTaxDeclarationArtifactExportUseCase,
  RequestTenantEcuadorTaxDeclarationArtifactExportV2UseCase,
  RequestTenantEcuadorTaxGrowthReminderPacketUseCase,
  RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
  RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
  RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
  RequestTenantEcuadorTaxFilingGuidePacketUseCase,
  RequestTenantEcuadorTaxFilingAssistantV2UseCase,
  RequestTenantEcuadorTaxFilingReadinessCertificateUseCase,
  RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
  RequestTenantEcuadorTaxPeriodCloseoutPacketUseCase,
  RequestTenantEcuadorTaxPeriodCloseoutReportUseCase,
  RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
  RequestTenantEcuadorTaxPeriodPostFilingCertificateUseCase,
  RequestTenantEcuadorTaxComplianceCloseoutV2UseCase,
  RequestTenantEcuadorTaxComplianceDeclarationCloseoutV3UseCase,
  RequestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase,
  RequestTenantEcuadorTaxCompliancePostFilingCloseoutV4UseCase,
  RequestTenantEcuadorTaxComplianceAnnualCloseoutV5UseCase,
  RequestTenantEcuadorTaxOperationalHardeningCloseoutV62UseCase,
  RequestTenantEcuadorTaxAiPilotAssistantPacketV72UseCase,
  RequestTenantEcuadorTaxAiPilotDecisionExplainerV73UseCase,
  RequestTenantEcuadorTaxPilotCloseoutV72UseCase,
  RequestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase,
  RequestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase,
  RequestTenantEcuadorTaxPilotFeedbackCloseoutV70UseCase,
  RequestTenantEcuadorTaxPilotOperationsCloseoutV71UseCase,
  RequestTenantEcuadorTaxComplianceProductCloseoutV3UseCase,
  RequestTenantEcuadorTaxDeclarationPartyRecalculationPacketUseCase,
  RequestTenantEcuadorTaxPartiesPersistenceDecisionPackUseCase,
  RequestTenantEcuadorTaxProductCloseoutPackUseCase,
  RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
  RequestTenantEcuadorTaxReviewAssistantPacketUseCase,
  RequestTenantEcuadorTaxSalesBookUseCase,
  RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
  RequestTenantEcuadorTaxVatDeclarationDraftUseCase,
  RequestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase,
  RequestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase,
  RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
  TAX_COMPLIANCE_ACCOUNTANT_REVIEW_ID_GENERATOR,
  TAX_COMPLIANCE_ACCOUNTANT_REVIEW_REPOSITORY,
  TAX_COMPLIANCE_ECOMMERCE_EVIDENCE_REPOSITORY,
  TAX_COMPLIANCE_EVENT_ID_GENERATOR,
  TAX_COMPLIANCE_EVENT_REPOSITORY,
  TAX_COMPLIANCE_PURCHASE_EXPENSE_EVIDENCE_REPOSITORY,
  TAX_COMPLIANCE_WITHHOLDING_DRAFT_EXECUTOR,
  TransitionTenantEcuadorTaxAccountantReviewUseCase,
  TransitionTenantEcuadorTaxOperationalCloseoutUseCase,
  TransitionTenantEcuadorTaxVatDeclarationApprovalUseCase,
  UpsertTenantEcuadorTaxAccountingBridgeMappingUseCase,
  UpsertTenantEcuadorTaxObligationSettingsUseCase,
} from '@saas-platform/tax-compliance-application';
import {
  CatalogPersistenceModule,
  CommercialPersistenceModule,
  FeatureFlagsPersistenceModule,
  InvoicingPersistenceModule,
  TaxCompliancePersistenceModule,
  TenancyPersistenceModule,
} from '@saas-platform/infra-prisma';
import {
  ResolveTenantAccessUseCase,
  TENANT_ACCESS_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { AuthModule } from '../auth/auth.module';
import { InvoicingCustomerPartyDirectoryRepository } from '../parties/invoicing-customer-party-directory.repository';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import { TaxComplianceController } from './tax-compliance.controller';
import { InvoicingWithholdingDraftExecutor } from './invoicing-withholding-draft-executor';

@Module({
  imports: [
    AuthModule,
    CatalogPersistenceModule,
    CommercialPersistenceModule,
    FeatureFlagsPersistenceModule,
    InvoicingPersistenceModule,
    TaxCompliancePersistenceModule,
    TenancyPersistenceModule,
  ],
  controllers: [TaxComplianceController],
  providers: [
    {
      provide: PARTY_DIRECTORY_REPOSITORY,
      inject: [CUSTOMER_REPOSITORY],
      useFactory: (customerRepository) =>
        new InvoicingCustomerPartyDirectoryRepository(customerRepository),
    },
    {
      provide: GetTenantEcuadorTaxpayerProfileUseCase,
      inject: [
        TENANT_REPOSITORY,
        ISSUER_PROFILE_REPOSITORY,
        PARTY_DIRECTORY_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        issuerProfileRepository,
        partyDirectoryRepository,
      ) =>
        new GetTenantEcuadorTaxpayerProfileUseCase(
          tenantRepository,
          issuerProfileRepository,
          partyDirectoryRepository,
        ),
    },
    {
      provide: GetTenantEcuadorTaxObligationSettingsUseCase,
      inject: [
        GetTenantEcuadorTaxpayerProfileUseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxpayerProfileUseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
      ) =>
        new GetTenantEcuadorTaxObligationSettingsUseCase(
          getTenantEcuadorTaxpayerProfileUseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
        ),
    },
    {
      provide: UpsertTenantEcuadorTaxObligationSettingsUseCase,
      inject: [
        GetTenantEcuadorTaxObligationSettingsUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxObligationSettingsUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new UpsertTenantEcuadorTaxObligationSettingsUseCase(
          getTenantEcuadorTaxObligationSettingsUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxObligationMatrixUseCase,
      inject: [
        GetTenantEcuadorTaxpayerProfileUseCase,
        GetTenantEcuadorTaxObligationSettingsUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxpayerProfileUseCase,
        getTenantEcuadorTaxObligationSettingsUseCase,
      ) =>
        new GetTenantEcuadorTaxObligationMatrixUseCase(
          getTenantEcuadorTaxpayerProfileUseCase,
          getTenantEcuadorTaxObligationSettingsUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxObligationCalendarUseCase,
      inject: [GetTenantEcuadorTaxObligationMatrixUseCase],
      useFactory: (getTenantEcuadorTaxObligationMatrixUseCase) =>
        new GetTenantEcuadorTaxObligationCalendarUseCase(
          getTenantEcuadorTaxObligationMatrixUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
      inject: [GetTenantEcuadorTaxObligationCalendarUseCase],
      useFactory: (getTenantEcuadorTaxObligationCalendarUseCase) =>
        new GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase(
          getTenantEcuadorTaxObligationCalendarUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase,
      inject: [
        GetTenantEcuadorTaxObligationMatrixUseCase,
        GetTenantEcuadorTaxDeclarationFormCatalogUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxObligationMatrixUseCase,
        getTenantEcuadorTaxDeclarationFormCatalogUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase(
          getTenantEcuadorTaxObligationMatrixUseCase,
          getTenantEcuadorTaxDeclarationFormCatalogUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxDueMonitorUseCase,
      inject: [GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase],
      useFactory: (getTenantEcuadorTaxCalendarReviewWorkspaceUseCase) =>
        new GetTenantEcuadorTaxDueMonitorUseCase(
          getTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantPartyFiscalReadinessSummaryUseCase,
      inject: [TENANT_REPOSITORY, PARTY_DIRECTORY_REPOSITORY],
      useFactory: (tenantRepository, partyDirectoryRepository) =>
        new GetTenantPartyFiscalReadinessSummaryUseCase(
          tenantRepository,
          partyDirectoryRepository,
        ),
    },
    {
      provide: ListTenantPartiesUseCase,
      inject: [TENANT_REPOSITORY, PARTY_DIRECTORY_REPOSITORY],
      useFactory: (tenantRepository, partyDirectoryRepository) =>
        new ListTenantPartiesUseCase(
          tenantRepository,
          partyDirectoryRepository,
        ),
    },
    {
      provide: GetTenantPartyFiscalCleanupWorkspaceUseCase,
      inject: [
        GetTenantPartyFiscalReadinessSummaryUseCase,
        ListTenantPartiesUseCase,
      ],
      useFactory: (
        getTenantPartyFiscalReadinessSummaryUseCase,
        listTenantPartiesUseCase,
      ) =>
        new GetTenantPartyFiscalCleanupWorkspaceUseCase(
          getTenantPartyFiscalReadinessSummaryUseCase,
          listTenantPartiesUseCase,
        ),
    },
    {
      provide: GetTenantPartyDirectoryCoreV2WorkspaceUseCase,
      inject: [
        ListTenantPartiesUseCase,
        GetTenantPartyFiscalReadinessSummaryUseCase,
      ],
      useFactory: (
        listTenantPartiesUseCase,
        getTenantPartyFiscalReadinessSummaryUseCase,
      ) =>
        new GetTenantPartyDirectoryCoreV2WorkspaceUseCase(
          listTenantPartiesUseCase,
          getTenantPartyFiscalReadinessSummaryUseCase,
        ),
    },
    {
      provide: GetTenantPartyDuplicateMergeReadinessWorkspaceUseCase,
      inject: [ListTenantPartiesUseCase],
      useFactory: (listTenantPartiesUseCase) =>
        new GetTenantPartyDuplicateMergeReadinessWorkspaceUseCase(
          listTenantPartiesUseCase,
        ),
    },
    {
      provide: GetTenantPartyFiscalIdentityProfileWorkspaceUseCase,
      inject: [
        ListTenantPartiesUseCase,
        GetTenantPartyFiscalReadinessSummaryUseCase,
      ],
      useFactory: (
        listTenantPartiesUseCase,
        getTenantPartyFiscalReadinessSummaryUseCase,
      ) =>
        new GetTenantPartyFiscalIdentityProfileWorkspaceUseCase(
          listTenantPartiesUseCase,
          getTenantPartyFiscalReadinessSummaryUseCase,
        ),
    },
    {
      provide: GetTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase,
      inject: [ListTenantPartiesUseCase],
      useFactory: (listTenantPartiesUseCase) =>
        new GetTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase(
          listTenantPartiesUseCase,
        ),
    },
    {
      provide: GetTenantInvoicingReportSummaryUseCase,
      inject: [
        TENANT_REPOSITORY,
        CUSTOMER_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        PAYMENT_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        customerRepository,
        invoiceRepository,
        invoiceItemRepository,
        paymentRepository,
      ) =>
        new GetTenantInvoicingReportSummaryUseCase(
          tenantRepository,
          customerRepository,
          invoiceRepository,
          invoiceItemRepository,
          paymentRepository,
        ),
    },
    {
      provide: GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
      inject: [TENANT_REPOSITORY, TAX_COMPLIANCE_ECOMMERCE_EVIDENCE_REPOSITORY],
      useFactory: (tenantRepository, ecommerceEvidenceRepository) =>
        new GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase(
          tenantRepository,
          ecommerceEvidenceRepository,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxSalesBookUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        PAYMENT_REPOSITORY,
        GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
        paymentRepository,
        getTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxSalesBookUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
          paymentRepository,
          getTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
      inject: [
        GetTenantEcuadorTaxObligationMatrixUseCase,
        GetTenantInvoicingReportSummaryUseCase,
        GetTenantPartyFiscalReadinessSummaryUseCase,
        GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxObligationMatrixUseCase,
        getTenantInvoicingReportSummaryUseCase,
        getTenantPartyFiscalReadinessSummaryUseCase,
        getTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
      ) =>
        new RequestTenantEcuadorTaxPeriodPreparationPacketUseCase(
          getTenantEcuadorTaxObligationMatrixUseCase,
          getTenantInvoicingReportSummaryUseCase,
          getTenantPartyFiscalReadinessSummaryUseCase,
          getTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
      inject: [
        RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
        GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxPeriodPreparationPacketUseCase,
        getTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
      ) =>
        new RequestTenantEcuadorTaxDeclarationDraftPacketUseCase(
          requestTenantEcuadorTaxPeriodPreparationPacketUseCase,
          getTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPeriodWorkspaceUseCase,
      inject: [
        GetTenantEcuadorTaxObligationCalendarUseCase,
        GetTenantEcuadorTaxDueMonitorUseCase,
        RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
        RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
        RequestTenantEcuadorTaxSalesBookUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxObligationCalendarUseCase,
        getTenantEcuadorTaxDueMonitorUseCase,
        requestTenantEcuadorTaxPeriodPreparationPacketUseCase,
        requestTenantEcuadorTaxDeclarationDraftPacketUseCase,
        requestTenantEcuadorTaxSalesBookUseCase,
      ) =>
        new GetTenantEcuadorTaxPeriodWorkspaceUseCase(
          getTenantEcuadorTaxObligationCalendarUseCase,
          getTenantEcuadorTaxDueMonitorUseCase,
          requestTenantEcuadorTaxPeriodPreparationPacketUseCase,
          requestTenantEcuadorTaxDeclarationDraftPacketUseCase,
          requestTenantEcuadorTaxSalesBookUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxReconciliationWorkspaceUseCase,
      inject: [
        RequestTenantEcuadorTaxSalesBookUseCase,
        RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
        ListTenantEcuadorTaxAccountantReviewsUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxSalesBookUseCase,
        requestTenantEcuadorTaxPeriodPreparationPacketUseCase,
        listTenantEcuadorTaxAccountantReviewsUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxReconciliationWorkspaceUseCase(
          requestTenantEcuadorTaxSalesBookUseCase,
          requestTenantEcuadorTaxPeriodPreparationPacketUseCase,
          listTenantEcuadorTaxAccountantReviewsUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RecordTenantEcuadorTaxSriFiscalEvidenceImportUseCase,
      inject: [RecordTenantEcuadorTaxComplianceEventUseCase],
      useFactory: (recordTenantEcuadorTaxComplianceEventUseCase) =>
        new RecordTenantEcuadorTaxSriFiscalEvidenceImportUseCase(
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
      inject: [
        ListTenantEcuadorTaxComplianceEventsUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        listTenantEcuadorTaxComplianceEventsUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase(
          listTenantEcuadorTaxComplianceEventsUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
      inject: [
        TENANT_REPOSITORY,
        TAX_COMPLIANCE_PURCHASE_EXPENSE_EVIDENCE_REPOSITORY,
        GetTenantPartyFiscalReadinessSummaryUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        tenantRepository,
        purchaseExpenseEvidenceRepository,
        getTenantPartyFiscalReadinessSummaryUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase(
          tenantRepository,
          purchaseExpenseEvidenceRepository,
          getTenantPartyFiscalReadinessSummaryUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
      inject: [
        GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
        RequestTenantEcuadorTaxSalesBookUseCase,
        GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
        requestTenantEcuadorTaxSalesBookUseCase,
        getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase(
          getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
          requestTenantEcuadorTaxSalesBookUseCase,
          getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxDeclarationFormCatalogUseCase,
      inject: [
        GetTenantEcuadorTaxObligationMatrixUseCase,
        GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxObligationMatrixUseCase,
        getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxDeclarationFormCatalogUseCase(
          getTenantEcuadorTaxObligationMatrixUseCase,
          getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
      inject: [
        GetTenantEcuadorTaxDeclarationFormCatalogUseCase,
        GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
        GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxDeclarationFormCatalogUseCase,
        getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
        getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase(
          getTenantEcuadorTaxDeclarationFormCatalogUseCase,
          getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
          getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxFilingGuidePacketUseCase,
      inject: [
        RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxFilingGuidePacketUseCase(
          requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxDeclarationArtifactExportUseCase,
      inject: [
        RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxDeclarationArtifactExportUseCase(
          requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
      inject: [
        RequestTenantEcuadorTaxSalesBookUseCase,
        GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxSalesBookUseCase,
        getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
      ) =>
        new GetTenantEcuadorTaxDeclarationSourceLedgerUseCase(
          requestTenantEcuadorTaxSalesBookUseCase,
          getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
          getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
      inject: [
        GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
      ) =>
        new GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase(
          getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
          requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
      inject: [
        GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
        GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
        getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase(
          getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
          getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxFormMappingCatalogUseCase,
      inject: [
        GetTenantEcuadorTaxDeclarationFormCatalogUseCase,
        GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxDeclarationFormCatalogUseCase,
        getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
      ) =>
        new GetTenantEcuadorTaxFormMappingCatalogUseCase(
          getTenantEcuadorTaxDeclarationFormCatalogUseCase,
          getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxVatFormContractWorkspaceUseCase,
      inject: [
        GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
        GetTenantEcuadorTaxFormMappingCatalogUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
        getTenantEcuadorTaxFormMappingCatalogUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxVatFormContractWorkspaceUseCase(
          getTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
          getTenantEcuadorTaxFormMappingCatalogUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxAccountantReviewPacketUseCase,
      inject: [GetTenantEcuadorTaxPeriodWorkspaceUseCase],
      useFactory: (getTenantEcuadorTaxPeriodWorkspaceUseCase) =>
        new RequestTenantEcuadorTaxAccountantReviewPacketUseCase(
          getTenantEcuadorTaxPeriodWorkspaceUseCase,
        ),
    },
    {
      provide: RecordTenantEcuadorTaxComplianceEventUseCase,
      inject: [
        TENANT_REPOSITORY,
        TAX_COMPLIANCE_EVENT_REPOSITORY,
        TAX_COMPLIANCE_EVENT_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        taxComplianceEventRepository,
        eventIdGenerator,
      ) =>
        new RecordTenantEcuadorTaxComplianceEventUseCase(
          tenantRepository,
          taxComplianceEventRepository,
          eventIdGenerator,
        ),
    },
    {
      provide: ListTenantEcuadorTaxComplianceEventsUseCase,
      inject: [TENANT_REPOSITORY, TAX_COMPLIANCE_EVENT_REPOSITORY],
      useFactory: (tenantRepository, taxComplianceEventRepository) =>
        new ListTenantEcuadorTaxComplianceEventsUseCase(
          tenantRepository,
          taxComplianceEventRepository,
        ),
    },
    {
      provide: RecordTenantEcuadorTaxPurchaseExpenseEvidenceUseCase,
      inject: [
        TENANT_REPOSITORY,
        TAX_COMPLIANCE_PURCHASE_EXPENSE_EVIDENCE_REPOSITORY,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        tenantRepository,
        purchaseExpenseEvidenceRepository,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RecordTenantEcuadorTaxPurchaseExpenseEvidenceUseCase(
          tenantRepository,
          purchaseExpenseEvidenceRepository,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxRuleCatalogUseCase,
      inject: [RecordTenantEcuadorTaxComplianceEventUseCase],
      useFactory: (recordTenantEcuadorTaxComplianceEventUseCase) =>
        new GetTenantEcuadorTaxRuleCatalogUseCase(
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxAccountantReviewUseCase,
      inject: [
        TENANT_REPOSITORY,
        TAX_COMPLIANCE_ACCOUNTANT_REVIEW_REPOSITORY,
        TAX_COMPLIANCE_ACCOUNTANT_REVIEW_ID_GENERATOR,
        RequestTenantEcuadorTaxAccountantReviewPacketUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        tenantRepository,
        taxComplianceAccountantReviewRepository,
        reviewIdGenerator,
        requestTenantEcuadorTaxAccountantReviewPacketUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxAccountantReviewUseCase(
          tenantRepository,
          taxComplianceAccountantReviewRepository,
          reviewIdGenerator,
          requestTenantEcuadorTaxAccountantReviewPacketUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: ListTenantEcuadorTaxAccountantReviewsUseCase,
      inject: [TENANT_REPOSITORY, TAX_COMPLIANCE_ACCOUNTANT_REVIEW_REPOSITORY],
      useFactory: (tenantRepository, taxComplianceAccountantReviewRepository) =>
        new ListTenantEcuadorTaxAccountantReviewsUseCase(
          tenantRepository,
          taxComplianceAccountantReviewRepository,
        ),
    },
    {
      provide: TransitionTenantEcuadorTaxAccountantReviewUseCase,
      inject: [
        TENANT_REPOSITORY,
        TAX_COMPLIANCE_ACCOUNTANT_REVIEW_REPOSITORY,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        tenantRepository,
        taxComplianceAccountantReviewRepository,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new TransitionTenantEcuadorTaxAccountantReviewUseCase(
          tenantRepository,
          taxComplianceAccountantReviewRepository,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
      inject: [
        TENANT_REPOSITORY,
        TAX_COMPLIANCE_ACCOUNTANT_REVIEW_REPOSITORY,
        TAX_COMPLIANCE_EVENT_REPOSITORY,
        RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
      ],
      useFactory: (
        tenantRepository,
        taxComplianceAccountantReviewRepository,
        taxComplianceEventRepository,
        requestTenantEcuadorTaxDeclarationDraftPacketUseCase,
      ) =>
        new RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase(
          tenantRepository,
          taxComplianceAccountantReviewRepository,
          taxComplianceEventRepository,
          requestTenantEcuadorTaxDeclarationDraftPacketUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
      inject: [
        RequestTenantEcuadorTaxSalesBookUseCase,
        GetTenantEcuadorTaxReconciliationWorkspaceUseCase,
        GetTenantEcuadorTaxObligationCalendarUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxSalesBookUseCase,
        getTenantEcuadorTaxReconciliationWorkspaceUseCase,
        getTenantEcuadorTaxObligationCalendarUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase(
          requestTenantEcuadorTaxSalesBookUseCase,
          getTenantEcuadorTaxReconciliationWorkspaceUseCase,
          getTenantEcuadorTaxObligationCalendarUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxPeriodCloseoutPacketUseCase,
      inject: [
        GetTenantEcuadorTaxPeriodWorkspaceUseCase,
        RequestTenantEcuadorTaxSalesBookUseCase,
        GetTenantEcuadorTaxReconciliationWorkspaceUseCase,
        RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
        ListTenantEcuadorTaxAccountantReviewsUseCase,
        RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPeriodWorkspaceUseCase,
        requestTenantEcuadorTaxSalesBookUseCase,
        getTenantEcuadorTaxReconciliationWorkspaceUseCase,
        requestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
        listTenantEcuadorTaxAccountantReviewsUseCase,
        requestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxPeriodCloseoutPacketUseCase(
          getTenantEcuadorTaxPeriodWorkspaceUseCase,
          requestTenantEcuadorTaxSalesBookUseCase,
          getTenantEcuadorTaxReconciliationWorkspaceUseCase,
          requestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
          listTenantEcuadorTaxAccountantReviewsUseCase,
          requestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase,
      inject: [
        GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        requestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase(
          getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
          requestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
      inject: [
        RequestTenantEcuadorTaxSalesBookUseCase,
        GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        GetTenantEcuadorTaxObligationCalendarUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxSalesBookUseCase,
        getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        getTenantEcuadorTaxObligationCalendarUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase(
          requestTenantEcuadorTaxSalesBookUseCase,
          getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
          getTenantEcuadorTaxObligationCalendarUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
      inject: [
        GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
      ) =>
        new GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase(
          getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
          requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase,
      inject: [
        GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
        GetTenantEcuadorTaxFormMappingCatalogUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
        getTenantEcuadorTaxFormMappingCatalogUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase(
          getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
          getTenantEcuadorTaxFormMappingCatalogUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxAiFilingAssistantPacketUseCase,
      inject: [
        GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
        GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        getTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
        getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
      ) =>
        new RequestTenantEcuadorTaxAiFilingAssistantPacketUseCase(
          getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
          getTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
          getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxVatDeclarationDraftUseCase,
      inject: [
        RequestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxVatDeclarationDraftUseCase(
          requestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxVatDeclarationApprovalUseCase,
      inject: [
        RequestTenantEcuadorTaxVatDeclarationDraftUseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxVatDeclarationDraftUseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
      ) =>
        new GetTenantEcuadorTaxVatDeclarationApprovalUseCase(
          requestTenantEcuadorTaxVatDeclarationDraftUseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
        ),
    },
    {
      provide: TransitionTenantEcuadorTaxVatDeclarationApprovalUseCase,
      inject: [
        GetTenantEcuadorTaxVatDeclarationApprovalUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxVatDeclarationApprovalUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new TransitionTenantEcuadorTaxVatDeclarationApprovalUseCase(
          getTenantEcuadorTaxVatDeclarationApprovalUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
      inject: [
        TENANT_REPOSITORY,
        TAX_COMPLIANCE_PURCHASE_EXPENSE_EVIDENCE_REPOSITORY,
        GetTenantPartyFiscalReadinessSummaryUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        tenantRepository,
        purchaseExpenseEvidenceRepository,
        getTenantPartyFiscalReadinessSummaryUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase(
          tenantRepository,
          purchaseExpenseEvidenceRepository,
          getTenantPartyFiscalReadinessSummaryUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
      inject: [
        RequestTenantEcuadorTaxSalesBookUseCase,
        GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
        GetTenantEcuadorTaxObligationCalendarUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxSalesBookUseCase,
        getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
        getTenantEcuadorTaxObligationCalendarUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase(
          requestTenantEcuadorTaxSalesBookUseCase,
          getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
          getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
          getTenantEcuadorTaxObligationCalendarUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase,
      inject: [
        RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase(
          requestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxWithholdingRegistryUseCase,
      inject: [
        RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxWithholdingRegistryUseCase(
          requestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: CreateTenantWithholdingUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        INVOICE_ID_GENERATOR,
        INVOICE_ITEM_ID_GENERATOR,
        INVOICE_NUMBERING_SETTINGS_REPOSITORY,
        TAX_RATE_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
        invoiceIdGenerator,
        invoiceItemIdGenerator,
        invoiceNumberingSettingsRepository,
        taxRateRepository,
      ) =>
        new CreateTenantWithholdingUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
          invoiceIdGenerator,
          invoiceItemIdGenerator,
          invoiceNumberingSettingsRepository,
          taxRateRepository,
        ),
    },
    {
      provide: TAX_COMPLIANCE_WITHHOLDING_DRAFT_EXECUTOR,
      inject: [CreateTenantWithholdingUseCase],
      useFactory: (createTenantWithholdingUseCase) =>
        new InvoicingWithholdingDraftExecutor(createTenantWithholdingUseCase),
    },
    {
      provide: ExecuteTenantEcuadorTaxWithholdingDraftBridgeUseCase,
      inject: [
        RequestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase,
        TAX_COMPLIANCE_WITHHOLDING_DRAFT_EXECUTOR,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase,
        taxComplianceWithholdingDraftExecutor,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new ExecuteTenantEcuadorTaxWithholdingDraftBridgeUseCase(
          requestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase,
          taxComplianceWithholdingDraftExecutor,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountantWorkbenchUseCase,
      inject: [
        RequestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase,
        RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
        RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
        GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
        GetTenantEcuadorTaxRuleCatalogUseCase,
        ListTenantEcuadorTaxAccountantReviewsUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase,
        requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
        requestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
        getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
        getTenantEcuadorTaxRuleCatalogUseCase,
        listTenantEcuadorTaxAccountantReviewsUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxAccountantWorkbenchUseCase(
          requestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase,
          requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
          requestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
          getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
          getTenantEcuadorTaxRuleCatalogUseCase,
          listTenantEcuadorTaxAccountantReviewsUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAuditReadinessUseCase,
      inject: [
        GetTenantEcuadorTaxPeriodWorkspaceUseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPeriodWorkspaceUseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
      ) =>
        new GetTenantEcuadorTaxAuditReadinessUseCase(
          getTenantEcuadorTaxPeriodWorkspaceUseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPeriodEvidenceVaultUseCase,
      inject: [
        RequestTenantEcuadorTaxSalesBookUseCase,
        GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
        RequestTenantEcuadorTaxVatDeclarationDraftUseCase,
        GetTenantEcuadorTaxAccountantWorkbenchUseCase,
        RequestTenantEcuadorTaxPeriodCloseoutPacketUseCase,
        GetTenantEcuadorTaxAuditReadinessUseCase,
        ListTenantEcuadorTaxAccountantReviewsUseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxSalesBookUseCase,
        getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        requestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
        requestTenantEcuadorTaxVatDeclarationDraftUseCase,
        getTenantEcuadorTaxAccountantWorkbenchUseCase,
        requestTenantEcuadorTaxPeriodCloseoutPacketUseCase,
        getTenantEcuadorTaxAuditReadinessUseCase,
        listTenantEcuadorTaxAccountantReviewsUseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxPeriodEvidenceVaultUseCase(
          requestTenantEcuadorTaxSalesBookUseCase,
          getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
          requestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
          requestTenantEcuadorTaxVatDeclarationDraftUseCase,
          getTenantEcuadorTaxAccountantWorkbenchUseCase,
          requestTenantEcuadorTaxPeriodCloseoutPacketUseCase,
          getTenantEcuadorTaxAuditReadinessUseCase,
          listTenantEcuadorTaxAccountantReviewsUseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxOperationalCloseoutUseCase,
      inject: [
        GetTenantEcuadorTaxVatDeclarationApprovalUseCase,
        GetTenantEcuadorTaxWithholdingRegistryUseCase,
        GetTenantEcuadorTaxPeriodEvidenceVaultUseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxVatDeclarationApprovalUseCase,
        getTenantEcuadorTaxWithholdingRegistryUseCase,
        getTenantEcuadorTaxPeriodEvidenceVaultUseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
      ) =>
        new GetTenantEcuadorTaxOperationalCloseoutUseCase(
          getTenantEcuadorTaxVatDeclarationApprovalUseCase,
          getTenantEcuadorTaxWithholdingRegistryUseCase,
          getTenantEcuadorTaxPeriodEvidenceVaultUseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
        ),
    },
    {
      provide: TransitionTenantEcuadorTaxOperationalCloseoutUseCase,
      inject: [
        GetTenantEcuadorTaxOperationalCloseoutUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxOperationalCloseoutUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new TransitionTenantEcuadorTaxOperationalCloseoutUseCase(
          getTenantEcuadorTaxOperationalCloseoutUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxFilingHandoffUseCase,
      inject: [
        GetTenantEcuadorTaxOperationalCloseoutUseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxOperationalCloseoutUseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
      ) =>
        new GetTenantEcuadorTaxFilingHandoffUseCase(
          getTenantEcuadorTaxOperationalCloseoutUseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
        ),
    },
    {
      provide: RecordTenantEcuadorTaxFilingHandoffUseCase,
      inject: [
        GetTenantEcuadorTaxFilingHandoffUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxFilingHandoffUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RecordTenantEcuadorTaxFilingHandoffUseCase(
          getTenantEcuadorTaxFilingHandoffUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase,
      inject: [
        ListTenantEcuadorTaxAccountantReviewsUseCase,
        GetTenantEcuadorTaxFilingHandoffUseCase,
        GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
      ],
      useFactory: (
        listTenantEcuadorTaxAccountantReviewsUseCase,
        getTenantEcuadorTaxFilingHandoffUseCase,
        getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
      ) =>
        new GetTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase(
          listTenantEcuadorTaxAccountantReviewsUseCase,
          getTenantEcuadorTaxFilingHandoffUseCase,
          getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAnnexesReadinessUseCase,
      inject: [
        GetTenantEcuadorTaxObligationSettingsUseCase,
        GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
        GetTenantEcuadorTaxWithholdingRegistryUseCase,
        GetTenantEcuadorTaxPeriodEvidenceVaultUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxObligationSettingsUseCase,
        getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
        getTenantEcuadorTaxWithholdingRegistryUseCase,
        getTenantEcuadorTaxPeriodEvidenceVaultUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxAnnexesReadinessUseCase(
          getTenantEcuadorTaxObligationSettingsUseCase,
          getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
          getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
          getTenantEcuadorTaxWithholdingRegistryUseCase,
          getTenantEcuadorTaxPeriodEvidenceVaultUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAnnexesWorkspaceUseCase,
      inject: [
        GetTenantEcuadorTaxAnnexesReadinessUseCase,
        GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxAnnexesReadinessUseCase,
        getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxAnnexesWorkspaceUseCase(
          getTenantEcuadorTaxAnnexesReadinessUseCase,
          getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxAccountingBridgePreviewUseCase,
      inject: [
        RequestTenantEcuadorTaxSalesBookUseCase,
        GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        GetTenantEcuadorTaxWithholdingRegistryUseCase,
        RequestTenantEcuadorTaxVatDeclarationDraftUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxSalesBookUseCase,
        getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
        getTenantEcuadorTaxWithholdingRegistryUseCase,
        requestTenantEcuadorTaxVatDeclarationDraftUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxAccountingBridgePreviewUseCase(
          requestTenantEcuadorTaxSalesBookUseCase,
          getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
          getTenantEcuadorTaxWithholdingRegistryUseCase,
          requestTenantEcuadorTaxVatDeclarationDraftUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
      inject: [
        RequestTenantEcuadorTaxAccountingBridgePreviewUseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxAccountingBridgePreviewUseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
      ) =>
        new GetTenantEcuadorTaxAccountingBridgeMappingUseCase(
          requestTenantEcuadorTaxAccountingBridgePreviewUseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase,
      inject: [RequestTenantEcuadorTaxAccountingBridgePreviewUseCase],
      useFactory: (requestTenantEcuadorTaxAccountingBridgePreviewUseCase) =>
        new GetTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase(
          requestTenantEcuadorTaxAccountingBridgePreviewUseCase,
        ),
    },
    {
      provide: UpsertTenantEcuadorTaxAccountingBridgeMappingUseCase,
      inject: [
        GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxAccountingBridgeMappingUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new UpsertTenantEcuadorTaxAccountingBridgeMappingUseCase(
          getTenantEcuadorTaxAccountingBridgeMappingUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxGrowthReminderPacketUseCase,
      inject: [GetTenantEcuadorTaxDueMonitorUseCase],
      useFactory: (getTenantEcuadorTaxDueMonitorUseCase) =>
        new RequestTenantEcuadorTaxGrowthReminderPacketUseCase(
          getTenantEcuadorTaxDueMonitorUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxReviewAssistantPacketUseCase,
      inject: [
        GetTenantEcuadorTaxVatDeclarationApprovalUseCase,
        GetTenantEcuadorTaxWithholdingRegistryUseCase,
        GetTenantEcuadorTaxPeriodEvidenceVaultUseCase,
        GetTenantEcuadorTaxOperationalCloseoutUseCase,
        GetTenantEcuadorTaxFilingHandoffUseCase,
        GetTenantEcuadorTaxAnnexesReadinessUseCase,
        GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
        RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxVatDeclarationApprovalUseCase,
        getTenantEcuadorTaxWithholdingRegistryUseCase,
        getTenantEcuadorTaxPeriodEvidenceVaultUseCase,
        getTenantEcuadorTaxOperationalCloseoutUseCase,
        getTenantEcuadorTaxFilingHandoffUseCase,
        getTenantEcuadorTaxAnnexesReadinessUseCase,
        getTenantEcuadorTaxAccountingBridgeMappingUseCase,
        requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxReviewAssistantPacketUseCase(
          getTenantEcuadorTaxVatDeclarationApprovalUseCase,
          getTenantEcuadorTaxWithholdingRegistryUseCase,
          getTenantEcuadorTaxPeriodEvidenceVaultUseCase,
          getTenantEcuadorTaxOperationalCloseoutUseCase,
          getTenantEcuadorTaxFilingHandoffUseCase,
          getTenantEcuadorTaxAnnexesReadinessUseCase,
          getTenantEcuadorTaxAccountingBridgeMappingUseCase,
          requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxPeriodCloseoutReportUseCase,
      inject: [
        RequestTenantEcuadorTaxSalesBookUseCase,
        GetTenantEcuadorTaxVatDeclarationApprovalUseCase,
        RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
        GetTenantEcuadorTaxWithholdingRegistryUseCase,
        GetTenantEcuadorTaxPeriodEvidenceVaultUseCase,
        GetTenantEcuadorTaxOperationalCloseoutUseCase,
        GetTenantEcuadorTaxFilingHandoffUseCase,
        GetTenantEcuadorTaxAnnexesReadinessUseCase,
        GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
        GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
        GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
        GetTenantEcuadorTaxDeclarationFormCatalogUseCase,
        RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
        RequestTenantEcuadorTaxFilingGuidePacketUseCase,
        RequestTenantEcuadorTaxDeclarationArtifactExportUseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxSalesBookUseCase,
        getTenantEcuadorTaxVatDeclarationApprovalUseCase,
        requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
        getTenantEcuadorTaxWithholdingRegistryUseCase,
        getTenantEcuadorTaxPeriodEvidenceVaultUseCase,
        getTenantEcuadorTaxOperationalCloseoutUseCase,
        getTenantEcuadorTaxFilingHandoffUseCase,
        getTenantEcuadorTaxAnnexesReadinessUseCase,
        getTenantEcuadorTaxAccountingBridgeMappingUseCase,
        getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
        getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
        getTenantEcuadorTaxDeclarationFormCatalogUseCase,
        requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
        requestTenantEcuadorTaxFilingGuidePacketUseCase,
        requestTenantEcuadorTaxDeclarationArtifactExportUseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxPeriodCloseoutReportUseCase(
          requestTenantEcuadorTaxSalesBookUseCase,
          getTenantEcuadorTaxVatDeclarationApprovalUseCase,
          requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
          getTenantEcuadorTaxWithholdingRegistryUseCase,
          getTenantEcuadorTaxPeriodEvidenceVaultUseCase,
          getTenantEcuadorTaxOperationalCloseoutUseCase,
          getTenantEcuadorTaxFilingHandoffUseCase,
          getTenantEcuadorTaxAnnexesReadinessUseCase,
          getTenantEcuadorTaxAccountingBridgeMappingUseCase,
          getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
          getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
          getTenantEcuadorTaxDeclarationFormCatalogUseCase,
          requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
          requestTenantEcuadorTaxFilingGuidePacketUseCase,
          requestTenantEcuadorTaxDeclarationArtifactExportUseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
      inject: [
        RequestTenantEcuadorTaxPeriodCloseoutReportUseCase,
        GetTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase,
        GetTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxPeriodCloseoutReportUseCase,
        getTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase,
        getTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase(
          requestTenantEcuadorTaxPeriodCloseoutReportUseCase,
          getTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase,
          getTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxCommandCenterUseCase,
      inject: [
        RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
        GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
        GetTenantEcuadorTaxVatFormContractWorkspaceUseCase,
        GetTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase,
        GetTenantEcuadorTaxAnnexesWorkspaceUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
        getTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
        getTenantEcuadorTaxVatFormContractWorkspaceUseCase,
        getTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase,
        getTenantEcuadorTaxAnnexesWorkspaceUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxCommandCenterUseCase(
          requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
          getTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
          getTenantEcuadorTaxVatFormContractWorkspaceUseCase,
          getTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase,
          getTenantEcuadorTaxAnnexesWorkspaceUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxAccountantCollaborationPackUseCase,
      inject: [
        RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
        GetTenantEcuadorTaxVatFormContractWorkspaceUseCase,
        GetTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
        getTenantEcuadorTaxVatFormContractWorkspaceUseCase,
        getTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxAccountantCollaborationPackUseCase(
          requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
          getTenantEcuadorTaxVatFormContractWorkspaceUseCase,
          getTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxFilingEvidenceVaultV2UseCase,
      inject: [
        GetTenantEcuadorTaxPeriodEvidenceVaultUseCase,
        RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPeriodEvidenceVaultUseCase,
        requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxFilingEvidenceVaultV2UseCase(
          getTenantEcuadorTaxPeriodEvidenceVaultUseCase,
          requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxExceptionCenterUseCase,
      inject: [
        RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
        GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
        GetTenantEcuadorTaxAnnexesWorkspaceUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
        getTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
        getTenantEcuadorTaxAnnexesWorkspaceUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxExceptionCenterUseCase(
          requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
          getTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
          getTenantEcuadorTaxAnnexesWorkspaceUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAnnualRollupWorkspaceUseCase,
      inject: [
        RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
        GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
        getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxAnnualRollupWorkspaceUseCase(
          requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
          getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxProductCloseoutPackUseCase,
      inject: [
        GetTenantEcuadorTaxCommandCenterUseCase,
        GetTenantEcuadorTaxAnnualRollupWorkspaceUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxCommandCenterUseCase,
        getTenantEcuadorTaxAnnualRollupWorkspaceUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxProductCloseoutPackUseCase(
          getTenantEcuadorTaxCommandCenterUseCase,
          getTenantEcuadorTaxAnnualRollupWorkspaceUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxAccountingReadinessPacketUseCase,
      inject: [
        GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
        RequestTenantEcuadorTaxPeriodCloseoutReportUseCase,
        RequestTenantEcuadorTaxReviewAssistantPacketUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxAccountingBridgeMappingUseCase,
        requestTenantEcuadorTaxPeriodCloseoutReportUseCase,
        requestTenantEcuadorTaxReviewAssistantPacketUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxAccountingReadinessPacketUseCase(
          getTenantEcuadorTaxAccountingBridgeMappingUseCase,
          requestTenantEcuadorTaxPeriodCloseoutReportUseCase,
          requestTenantEcuadorTaxReviewAssistantPacketUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
      inject: [
        RequestTenantEcuadorTaxAccountingReadinessPacketUseCase,
        RequestTenantEcuadorTaxPeriodCloseoutReportUseCase,
        GetTenantEcuadorTaxCommandCenterUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxAccountingReadinessPacketUseCase,
        requestTenantEcuadorTaxPeriodCloseoutReportUseCase,
        getTenantEcuadorTaxCommandCenterUseCase,
      ) =>
        new GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase(
          requestTenantEcuadorTaxAccountingReadinessPacketUseCase,
          requestTenantEcuadorTaxPeriodCloseoutReportUseCase,
          getTenantEcuadorTaxCommandCenterUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxCommandCenterV2UseCase,
      inject: [
        GetTenantEcuadorTaxCommandCenterUseCase,
        GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxCommandCenterUseCase,
        getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
      ) =>
        new GetTenantEcuadorTaxCommandCenterV2UseCase(
          getTenantEcuadorTaxCommandCenterUseCase,
          getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase,
      inject: [
        GetTenantEcuadorTaxCommandCenterV2UseCase,
        GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
        RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxCommandCenterV2UseCase,
        getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
        requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
      ) =>
        new RequestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase(
          getTenantEcuadorTaxCommandCenterV2UseCase,
          getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
          requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountingBoundaryCloseoutUseCase,
      inject: [GetTenantEcuadorTaxCommandCenterV2UseCase],
      useFactory: (getTenantEcuadorTaxCommandCenterV2UseCase) =>
        new GetTenantEcuadorTaxAccountingBoundaryCloseoutUseCase(
          getTenantEcuadorTaxCommandCenterV2UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxSriSourceImportCenterV2UseCase,
      inject: [
        GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
        GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
        getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
      ) =>
        new GetTenantEcuadorTaxSriSourceImportCenterV2UseCase(
          getTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
          getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase,
      inject: [
        GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
        GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
        getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
      ) =>
        new GetTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase(
          getTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
          getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase,
      inject: [
        GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
        GetTenantEcuadorTaxAnnualRollupWorkspaceUseCase,
        GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
        getTenantEcuadorTaxAnnualRollupWorkspaceUseCase,
        getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
      ) =>
        new GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase(
          getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
          getTenantEcuadorTaxAnnualRollupWorkspaceUseCase,
          getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxFilingAssistantV2UseCase,
      inject: [
        RequestTenantEcuadorTaxAiFilingAssistantPacketUseCase,
        RequestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxAiFilingAssistantPacketUseCase,
        requestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase,
      ) =>
        new RequestTenantEcuadorTaxFilingAssistantV2UseCase(
          requestTenantEcuadorTaxAiFilingAssistantPacketUseCase,
          requestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase,
      inject: [
        GetTenantEcuadorTaxAccountingBoundaryCloseoutUseCase,
        GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxAccountingBoundaryCloseoutUseCase,
        getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase,
      ) =>
        new GetTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase(
          getTenantEcuadorTaxAccountingBoundaryCloseoutUseCase,
          getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxComplianceCloseoutV2UseCase,
      inject: [
        GetTenantEcuadorTaxSriSourceImportCenterV2UseCase,
        GetTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase,
        GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase,
        RequestTenantEcuadorTaxFilingAssistantV2UseCase,
        GetTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase,
        GetTenantEcuadorTaxCommandCenterV2UseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxSriSourceImportCenterV2UseCase,
        getTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase,
        getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase,
        requestTenantEcuadorTaxFilingAssistantV2UseCase,
        getTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase,
        getTenantEcuadorTaxCommandCenterV2UseCase,
      ) =>
        new RequestTenantEcuadorTaxComplianceCloseoutV2UseCase(
          getTenantEcuadorTaxSriSourceImportCenterV2UseCase,
          getTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase,
          getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase,
          requestTenantEcuadorTaxFilingAssistantV2UseCase,
          getTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase,
          getTenantEcuadorTaxCommandCenterV2UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxEvidenceQualityCenterUseCase,
      inject: [RequestTenantEcuadorTaxComplianceCloseoutV2UseCase],
      useFactory: (requestTenantEcuadorTaxComplianceCloseoutV2UseCase) =>
        new GetTenantEcuadorTaxEvidenceQualityCenterUseCase(
          requestTenantEcuadorTaxComplianceCloseoutV2UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxObligationRiskMonitorUseCase,
      inject: [GetTenantEcuadorTaxEvidenceQualityCenterUseCase],
      useFactory: (getTenantEcuadorTaxEvidenceQualityCenterUseCase) =>
        new GetTenantEcuadorTaxObligationRiskMonitorUseCase(
          getTenantEcuadorTaxEvidenceQualityCenterUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountantHandoffRoomV2UseCase,
      inject: [
        GetTenantEcuadorTaxObligationRiskMonitorUseCase,
        GetTenantEcuadorTaxFilingHandoffUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxObligationRiskMonitorUseCase,
        getTenantEcuadorTaxFilingHandoffUseCase,
      ) =>
        new GetTenantEcuadorTaxAccountantHandoffRoomV2UseCase(
          getTenantEcuadorTaxObligationRiskMonitorUseCase,
          getTenantEcuadorTaxFilingHandoffUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxFilingReadinessCertificateUseCase,
      inject: [GetTenantEcuadorTaxAccountantHandoffRoomV2UseCase],
      useFactory: (getTenantEcuadorTaxAccountantHandoffRoomV2UseCase) =>
        new RequestTenantEcuadorTaxFilingReadinessCertificateUseCase(
          getTenantEcuadorTaxAccountantHandoffRoomV2UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxOperatingDashboardV3UseCase,
      inject: [
        GetTenantEcuadorTaxCommandCenterV2UseCase,
        GetTenantEcuadorTaxEvidenceQualityCenterUseCase,
        GetTenantEcuadorTaxObligationRiskMonitorUseCase,
        RequestTenantEcuadorTaxFilingReadinessCertificateUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxCommandCenterV2UseCase,
        getTenantEcuadorTaxEvidenceQualityCenterUseCase,
        getTenantEcuadorTaxObligationRiskMonitorUseCase,
        requestTenantEcuadorTaxFilingReadinessCertificateUseCase,
      ) =>
        new GetTenantEcuadorTaxOperatingDashboardV3UseCase(
          getTenantEcuadorTaxCommandCenterV2UseCase,
          getTenantEcuadorTaxEvidenceQualityCenterUseCase,
          getTenantEcuadorTaxObligationRiskMonitorUseCase,
          requestTenantEcuadorTaxFilingReadinessCertificateUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxComplianceProductCloseoutV3UseCase,
      inject: [GetTenantEcuadorTaxOperatingDashboardV3UseCase],
      useFactory: (getTenantEcuadorTaxOperatingDashboardV3UseCase) =>
        new RequestTenantEcuadorTaxComplianceProductCloseoutV3UseCase(
          getTenantEcuadorTaxOperatingDashboardV3UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPartyEvidenceBridgeUseCase,
      inject: [
        GetTenantPartyDirectoryCoreV2WorkspaceUseCase,
        GetTenantPartyDuplicateMergeReadinessWorkspaceUseCase,
        GetTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase,
      ],
      useFactory: (
        getTenantPartyDirectoryCoreV2WorkspaceUseCase,
        getTenantPartyDuplicateMergeReadinessWorkspaceUseCase,
        getTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase,
      ) =>
        new GetTenantEcuadorTaxPartyEvidenceBridgeUseCase(
          getTenantPartyDirectoryCoreV2WorkspaceUseCase,
          getTenantPartyDuplicateMergeReadinessWorkspaceUseCase,
          getTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase,
      inject: [GetTenantPartyFiscalIdentityProfileWorkspaceUseCase],
      useFactory: (getTenantPartyFiscalIdentityProfileWorkspaceUseCase) =>
        new GetTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase(
          getTenantPartyFiscalIdentityProfileWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
      inject: [GetTenantEcuadorTaxPartyEvidenceBridgeUseCase],
      useFactory: (getTenantEcuadorTaxPartyEvidenceBridgeUseCase) =>
        new GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase(
          getTenantEcuadorTaxPartyEvidenceBridgeUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase,
      inject: [
        GetTenantPartyFiscalCleanupWorkspaceUseCase,
        GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
      ],
      useFactory: (
        getTenantPartyFiscalCleanupWorkspaceUseCase,
        getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
      ) =>
        new GetTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase(
          getTenantPartyFiscalCleanupWorkspaceUseCase,
          getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase,
      inject: [
        GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
        GetTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
        getTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase,
      ) =>
        new GetTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase(
          getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
          getTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase,
      inject: [
        GetTenantEcuadorTaxPartyEvidenceBridgeUseCase,
        GetTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase,
        GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
        GetTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase,
        GetTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase,
        RequestTenantEcuadorTaxComplianceProductCloseoutV3UseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPartyEvidenceBridgeUseCase,
        getTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase,
        getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
        getTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase,
        getTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase,
        requestTenantEcuadorTaxComplianceProductCloseoutV3UseCase,
      ) =>
        new RequestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase(
          getTenantEcuadorTaxPartyEvidenceBridgeUseCase,
          getTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase,
          getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
          getTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase,
          getTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase,
          requestTenantEcuadorTaxComplianceProductCloseoutV3UseCase,
        ),
    },
    {
      provide: RecordTenantEcuadorTaxPartySriEvidenceImportUseCase,
      inject: [
        GetTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RecordTenantEcuadorTaxPartySriEvidenceImportUseCase(
          getTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPartyFiscalValidationLedgerUseCase,
      inject: [
        GetTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxPartyFiscalValidationLedgerUseCase(
          getTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide:
        RequestTenantEcuadorTaxDeclarationPartyRecalculationPacketUseCase,
      inject: [
        GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
        GetTenantEcuadorTaxPartyFiscalValidationLedgerUseCase,
        GetTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
        getTenantEcuadorTaxPartyFiscalValidationLedgerUseCase,
        getTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxDeclarationPartyRecalculationPacketUseCase(
          getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
          getTenantEcuadorTaxPartyFiscalValidationLedgerUseCase,
          getTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxAccountantPartyRiskReviewExecutionUseCase,
      inject: [
        GetTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase,
        RequestTenantEcuadorTaxAccountantReviewUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase,
        requestTenantEcuadorTaxAccountantReviewUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxAccountantPartyRiskReviewExecutionUseCase(
          getTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase,
          requestTenantEcuadorTaxAccountantReviewUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxPartiesPersistenceDecisionPackUseCase,
      inject: [
        RequestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase,
        GetTenantEcuadorTaxPartyFiscalValidationLedgerUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase,
        getTenantEcuadorTaxPartyFiscalValidationLedgerUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxPartiesPersistenceDecisionPackUseCase(
          requestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase,
          getTenantEcuadorTaxPartyFiscalValidationLedgerUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPartiesOperationalCommandCenterUseCase,
      inject: [
        GetTenantEcuadorTaxPartyFiscalValidationLedgerUseCase,
        RequestTenantEcuadorTaxDeclarationPartyRecalculationPacketUseCase,
        RequestTenantEcuadorTaxAccountantPartyRiskReviewExecutionUseCase,
        RequestTenantEcuadorTaxPartiesPersistenceDecisionPackUseCase,
        RequestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPartyFiscalValidationLedgerUseCase,
        requestTenantEcuadorTaxDeclarationPartyRecalculationPacketUseCase,
        requestTenantEcuadorTaxAccountantPartyRiskReviewExecutionUseCase,
        requestTenantEcuadorTaxPartiesPersistenceDecisionPackUseCase,
        requestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxPartiesOperationalCommandCenterUseCase(
          getTenantEcuadorTaxPartyFiscalValidationLedgerUseCase,
          requestTenantEcuadorTaxDeclarationPartyRecalculationPacketUseCase,
          requestTenantEcuadorTaxAccountantPartyRiskReviewExecutionUseCase,
          requestTenantEcuadorTaxPartiesPersistenceDecisionPackUseCase,
          requestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxObligationFilingWorkspaceUseCase,
      inject: [
        GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        GetTenantEcuadorTaxDeclarationFormCatalogUseCase,
        GetTenantEcuadorTaxPartiesOperationalCommandCenterUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        getTenantEcuadorTaxDeclarationFormCatalogUseCase,
        getTenantEcuadorTaxPartiesOperationalCommandCenterUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxObligationFilingWorkspaceUseCase(
          getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
          getTenantEcuadorTaxDeclarationFormCatalogUseCase,
          getTenantEcuadorTaxPartiesOperationalCommandCenterUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxFormBoxEvidenceBinderUseCase,
      inject: [
        RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
        GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        GetTenantEcuadorTaxPartiesOperationalCommandCenterUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
        getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
        getTenantEcuadorTaxPartiesOperationalCommandCenterUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxFormBoxEvidenceBinderUseCase(
          requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
          getTenantEcuadorTaxDeclarationSourceLedgerUseCase,
          getTenantEcuadorTaxPartiesOperationalCommandCenterUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase,
      inject: [
        GetTenantEcuadorTaxSriSourceImportCenterV2UseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxSriSourceImportCenterV2UseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
      ) =>
        new GetTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase(
          getTenantEcuadorTaxSriSourceImportCenterV2UseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
      inject: [
        GetTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase,
        GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
        GetTenantEcuadorTaxExceptionCenterUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase,
        getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
        getTenantEcuadorTaxExceptionCenterUseCase,
      ) =>
        new GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase(
          getTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase,
          getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
          getTenantEcuadorTaxExceptionCenterUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
      inject: [
        GetTenantEcuadorTaxFormBoxEvidenceBinderUseCase,
        GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxFormBoxEvidenceBinderUseCase,
        getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
      ) =>
        new GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase(
          getTenantEcuadorTaxFormBoxEvidenceBinderUseCase,
          getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxAccountantPacketExportV62UseCase,
      inject: [
        GetTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase,
        GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
        GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase,
        getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
        getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
      ) =>
        new RequestTenantEcuadorTaxAccountantPacketExportV62UseCase(
          getTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase,
          getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
          getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxOperatorActionCenterV62UseCase,
      inject: [
        GetTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase,
        GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
        GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
        RequestTenantEcuadorTaxAccountantPacketExportV62UseCase,
        GetTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase,
        getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
        getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
        requestTenantEcuadorTaxAccountantPacketExportV62UseCase,
        getTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase,
      ) =>
        new GetTenantEcuadorTaxOperatorActionCenterV62UseCase(
          getTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase,
          getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
          getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
          requestTenantEcuadorTaxAccountantPacketExportV62UseCase,
          getTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxOperationalHardeningCloseoutV62UseCase,
      inject: [
        GetTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase,
        GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
        GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
        RequestTenantEcuadorTaxAccountantPacketExportV62UseCase,
        GetTenantEcuadorTaxOperatorActionCenterV62UseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase,
        getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
        getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
        requestTenantEcuadorTaxAccountantPacketExportV62UseCase,
        getTenantEcuadorTaxOperatorActionCenterV62UseCase,
      ) =>
        new RequestTenantEcuadorTaxOperationalHardeningCloseoutV62UseCase(
          getTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase,
          getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
          getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
          requestTenantEcuadorTaxAccountantPacketExportV62UseCase,
          getTenantEcuadorTaxOperatorActionCenterV62UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase,
      inject: [RequestTenantEcuadorTaxOperationalHardeningCloseoutV62UseCase],
      useFactory: (requestTenantEcuadorTaxOperationalHardeningCloseoutV62UseCase) =>
        new GetTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase(
          requestTenantEcuadorTaxOperationalHardeningCloseoutV62UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
      inject: [
        GetTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase,
        RequestTenantEcuadorTaxAccountantPacketExportV62UseCase,
        GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
        GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase,
        requestTenantEcuadorTaxAccountantPacketExportV62UseCase,
        getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
        getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
      ) =>
        new GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase(
          getTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase,
          requestTenantEcuadorTaxAccountantPacketExportV62UseCase,
          getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
          getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase,
      inject: [GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase],
      useFactory: (
        getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
      ) =>
        new GetTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase(
          getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase,
      inject: [
        GetTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase,
        GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
        GetTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase,
        GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase,
        getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
        getTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase,
        getTenantEcuadorTaxAccountingAdvancedGateV2UseCase,
      ) =>
        new RequestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase(
          getTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase,
          getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
          getTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase,
          getTenantEcuadorTaxAccountingAdvancedGateV2UseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxPilotFeedbackCloseoutV70UseCase,
      inject: [
        GetTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase,
        GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
        GetTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase,
        RequestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase,
        getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
        getTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase,
        requestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase,
      ) =>
        new RequestTenantEcuadorTaxPilotFeedbackCloseoutV70UseCase(
          getTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase,
          getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
          getTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase,
          requestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPilotCohortRegistryV71UseCase,
      inject: [RequestTenantEcuadorTaxPilotFeedbackCloseoutV70UseCase],
      useFactory: (requestTenantEcuadorTaxPilotFeedbackCloseoutV70UseCase) =>
        new GetTenantEcuadorTaxPilotCohortRegistryV71UseCase(
          requestTenantEcuadorTaxPilotFeedbackCloseoutV70UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase,
      inject: [GetTenantEcuadorTaxPilotCohortRegistryV71UseCase],
      useFactory: (getTenantEcuadorTaxPilotCohortRegistryV71UseCase) =>
        new GetTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase(
          getTenantEcuadorTaxPilotCohortRegistryV71UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase,
      inject: [GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase],
      useFactory: (
        getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
      ) =>
        new GetTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase(
          getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPilotLearningBacklogV71UseCase,
      inject: [
        GetTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase,
        GetTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase,
        getTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase,
      ) =>
        new GetTenantEcuadorTaxPilotLearningBacklogV71UseCase(
          getTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase,
          getTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountingAdvancedEvidenceGateV71UseCase,
      inject: [
        RequestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase,
        GetTenantEcuadorTaxPilotLearningBacklogV71UseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase,
        getTenantEcuadorTaxPilotLearningBacklogV71UseCase,
      ) =>
        new GetTenantEcuadorTaxAccountingAdvancedEvidenceGateV71UseCase(
          requestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase,
          getTenantEcuadorTaxPilotLearningBacklogV71UseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxPilotOperationsCloseoutV71UseCase,
      inject: [
        GetTenantEcuadorTaxPilotCohortRegistryV71UseCase,
        GetTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase,
        GetTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase,
        GetTenantEcuadorTaxPilotLearningBacklogV71UseCase,
        GetTenantEcuadorTaxAccountingAdvancedEvidenceGateV71UseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPilotCohortRegistryV71UseCase,
        getTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase,
        getTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase,
        getTenantEcuadorTaxPilotLearningBacklogV71UseCase,
        getTenantEcuadorTaxAccountingAdvancedEvidenceGateV71UseCase,
      ) =>
        new RequestTenantEcuadorTaxPilotOperationsCloseoutV71UseCase(
          getTenantEcuadorTaxPilotCohortRegistryV71UseCase,
          getTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase,
          getTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase,
          getTenantEcuadorTaxPilotLearningBacklogV71UseCase,
          getTenantEcuadorTaxAccountingAdvancedEvidenceGateV71UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase,
      inject: [
        RequestTenantEcuadorTaxPilotOperationsCloseoutV71UseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxPilotOperationsCloseoutV71UseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
      ) =>
        new GetTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase(
          requestTenantEcuadorTaxPilotOperationsCloseoutV71UseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPilotMultiTenantCohortV72UseCase,
      inject: [GetTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase],
      useFactory: (getTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase) =>
        new GetTenantEcuadorTaxPilotMultiTenantCohortV72UseCase(
          getTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase,
      inject: [GetTenantEcuadorTaxPilotMultiTenantCohortV72UseCase],
      useFactory: (getTenantEcuadorTaxPilotMultiTenantCohortV72UseCase) =>
        new GetTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase(
          getTenantEcuadorTaxPilotMultiTenantCohortV72UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase,
      inject: [GetTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase],
      useFactory: (getTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase) =>
        new GetTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase(
          getTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxAiPilotAssistantPacketV72UseCase,
      inject: [GetTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase],
      useFactory: (getTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase) =>
        new RequestTenantEcuadorTaxAiPilotAssistantPacketV72UseCase(
          getTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxPilotCloseoutV72UseCase,
      inject: [
        GetTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase,
        GetTenantEcuadorTaxPilotMultiTenantCohortV72UseCase,
        GetTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase,
        GetTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase,
        RequestTenantEcuadorTaxAiPilotAssistantPacketV72UseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase,
        getTenantEcuadorTaxPilotMultiTenantCohortV72UseCase,
        getTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase,
        getTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase,
        requestTenantEcuadorTaxAiPilotAssistantPacketV72UseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxPilotCloseoutV72UseCase(
          getTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase,
          getTenantEcuadorTaxPilotMultiTenantCohortV72UseCase,
          getTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase,
          getTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase,
          requestTenantEcuadorTaxAiPilotAssistantPacketV72UseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase,
      inject: [RequestTenantEcuadorTaxPilotCloseoutV72UseCase],
      useFactory: (requestTenantEcuadorTaxPilotCloseoutV72UseCase) =>
        new GetTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase(
          requestTenantEcuadorTaxPilotCloseoutV72UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase,
      inject: [GetTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase],
      useFactory: (getTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase) =>
        new GetTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase(
          getTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountantDecisionRecordV73UseCase,
      inject: [GetTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase],
      useFactory: (
        getTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase,
      ) =>
        new GetTenantEcuadorTaxAccountantDecisionRecordV73UseCase(
          getTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase,
      inject: [GetTenantEcuadorTaxAccountantDecisionRecordV73UseCase],
      useFactory: (getTenantEcuadorTaxAccountantDecisionRecordV73UseCase) =>
        new GetTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase(
          getTenantEcuadorTaxAccountantDecisionRecordV73UseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxAiPilotDecisionExplainerV73UseCase,
      inject: [GetTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase],
      useFactory: (
        getTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase,
      ) =>
        new RequestTenantEcuadorTaxAiPilotDecisionExplainerV73UseCase(
          getTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase,
      inject: [
        GetTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase,
        GetTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase,
        GetTenantEcuadorTaxAccountantDecisionRecordV73UseCase,
        GetTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase,
        RequestTenantEcuadorTaxAiPilotDecisionExplainerV73UseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase,
        getTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase,
        getTenantEcuadorTaxAccountantDecisionRecordV73UseCase,
        getTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase,
        requestTenantEcuadorTaxAiPilotDecisionExplainerV73UseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase(
          getTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase,
          getTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase,
          getTenantEcuadorTaxAccountantDecisionRecordV73UseCase,
          getTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase,
          requestTenantEcuadorTaxAiPilotDecisionExplainerV73UseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAnnexesReadinessV2UseCase,
      inject: [
        GetTenantEcuadorTaxAnnexesWorkspaceUseCase,
        GetTenantEcuadorTaxPartiesOperationalCommandCenterUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxAnnexesWorkspaceUseCase,
        getTenantEcuadorTaxPartiesOperationalCommandCenterUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxAnnexesReadinessV2UseCase(
          getTenantEcuadorTaxAnnexesWorkspaceUseCase,
          getTenantEcuadorTaxPartiesOperationalCommandCenterUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountantFilingReviewRoomV3UseCase,
      inject: [
        GetTenantEcuadorTaxObligationFilingWorkspaceUseCase,
        GetTenantEcuadorTaxFormBoxEvidenceBinderUseCase,
        GetTenantEcuadorTaxAnnexesReadinessV2UseCase,
        GetTenantEcuadorTaxAccountantHandoffRoomV2UseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxObligationFilingWorkspaceUseCase,
        getTenantEcuadorTaxFormBoxEvidenceBinderUseCase,
        getTenantEcuadorTaxAnnexesReadinessV2UseCase,
        getTenantEcuadorTaxAccountantHandoffRoomV2UseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxAccountantFilingReviewRoomV3UseCase(
          getTenantEcuadorTaxObligationFilingWorkspaceUseCase,
          getTenantEcuadorTaxFormBoxEvidenceBinderUseCase,
          getTenantEcuadorTaxAnnexesReadinessV2UseCase,
          getTenantEcuadorTaxAccountantHandoffRoomV2UseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxDeclarationArtifactExportV2UseCase,
      inject: [
        RequestTenantEcuadorTaxDeclarationArtifactExportUseCase,
        GetTenantEcuadorTaxFormBoxEvidenceBinderUseCase,
        GetTenantEcuadorTaxAnnexesReadinessV2UseCase,
        GetTenantEcuadorTaxAccountantFilingReviewRoomV3UseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxDeclarationArtifactExportUseCase,
        getTenantEcuadorTaxFormBoxEvidenceBinderUseCase,
        getTenantEcuadorTaxAnnexesReadinessV2UseCase,
        getTenantEcuadorTaxAccountantFilingReviewRoomV3UseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxDeclarationArtifactExportV2UseCase(
          requestTenantEcuadorTaxDeclarationArtifactExportUseCase,
          getTenantEcuadorTaxFormBoxEvidenceBinderUseCase,
          getTenantEcuadorTaxAnnexesReadinessV2UseCase,
          getTenantEcuadorTaxAccountantFilingReviewRoomV3UseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxComplianceDeclarationCloseoutV3UseCase,
      inject: [
        RequestTenantEcuadorTaxDeclarationArtifactExportV2UseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxDeclarationArtifactExportV2UseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxComplianceDeclarationCloseoutV3UseCase(
          requestTenantEcuadorTaxDeclarationArtifactExportV2UseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: ListTenantEcuadorTaxExternalFilingResultsUseCase,
      inject: [
        ListTenantEcuadorTaxComplianceEventsUseCase,
        GetTenantEcuadorTaxFilingHandoffUseCase,
      ],
      useFactory: (
        listTenantEcuadorTaxComplianceEventsUseCase,
        getTenantEcuadorTaxFilingHandoffUseCase,
      ) =>
        new ListTenantEcuadorTaxExternalFilingResultsUseCase(
          listTenantEcuadorTaxComplianceEventsUseCase,
          getTenantEcuadorTaxFilingHandoffUseCase,
        ),
    },
    {
      provide: RecordTenantEcuadorTaxExternalFilingResultUseCase,
      inject: [
        RecordTenantEcuadorTaxComplianceEventUseCase,
        RecordTenantEcuadorTaxFilingHandoffUseCase,
        ListTenantEcuadorTaxExternalFilingResultsUseCase,
      ],
      useFactory: (
        recordTenantEcuadorTaxComplianceEventUseCase,
        recordTenantEcuadorTaxFilingHandoffUseCase,
        listTenantEcuadorTaxExternalFilingResultsUseCase,
      ) =>
        new RecordTenantEcuadorTaxExternalFilingResultUseCase(
          recordTenantEcuadorTaxComplianceEventUseCase,
          recordTenantEcuadorTaxFilingHandoffUseCase,
          listTenantEcuadorTaxExternalFilingResultsUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPaymentObligationTrackerUseCase,
      inject: [
        ListTenantEcuadorTaxExternalFilingResultsUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        listTenantEcuadorTaxExternalFilingResultsUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxPaymentObligationTrackerUseCase(
          listTenantEcuadorTaxExternalFilingResultsUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase,
      inject: [
        ListTenantEcuadorTaxExternalFilingResultsUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        listTenantEcuadorTaxExternalFilingResultsUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase(
          listTenantEcuadorTaxExternalFilingResultsUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPostFilingExceptionCenterUseCase,
      inject: [
        GetTenantEcuadorTaxPaymentObligationTrackerUseCase,
        GetTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPaymentObligationTrackerUseCase,
        getTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxPostFilingExceptionCenterUseCase(
          getTenantEcuadorTaxPaymentObligationTrackerUseCase,
          getTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxPeriodPostFilingCertificateUseCase,
      inject: [
        RequestTenantEcuadorTaxComplianceDeclarationCloseoutV3UseCase,
        GetTenantEcuadorTaxPaymentObligationTrackerUseCase,
        GetTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase,
        GetTenantEcuadorTaxPostFilingExceptionCenterUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxComplianceDeclarationCloseoutV3UseCase,
        getTenantEcuadorTaxPaymentObligationTrackerUseCase,
        getTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase,
        getTenantEcuadorTaxPostFilingExceptionCenterUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxPeriodPostFilingCertificateUseCase(
          requestTenantEcuadorTaxComplianceDeclarationCloseoutV3UseCase,
          getTenantEcuadorTaxPaymentObligationTrackerUseCase,
          getTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase,
          getTenantEcuadorTaxPostFilingExceptionCenterUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxCompliancePostFilingCloseoutV4UseCase,
      inject: [
        ListTenantEcuadorTaxExternalFilingResultsUseCase,
        GetTenantEcuadorTaxPaymentObligationTrackerUseCase,
        GetTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase,
        GetTenantEcuadorTaxPostFilingExceptionCenterUseCase,
        RequestTenantEcuadorTaxPeriodPostFilingCertificateUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        listTenantEcuadorTaxExternalFilingResultsUseCase,
        getTenantEcuadorTaxPaymentObligationTrackerUseCase,
        getTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase,
        getTenantEcuadorTaxPostFilingExceptionCenterUseCase,
        requestTenantEcuadorTaxPeriodPostFilingCertificateUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxCompliancePostFilingCloseoutV4UseCase(
          listTenantEcuadorTaxExternalFilingResultsUseCase,
          getTenantEcuadorTaxPaymentObligationTrackerUseCase,
          getTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase,
          getTenantEcuadorTaxPostFilingExceptionCenterUseCase,
          requestTenantEcuadorTaxPeriodPostFilingCertificateUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    ...[
      GetTenantEcuadorTaxAnnualFiscalYearWorkspaceUseCase,
      GetTenantEcuadorTaxAnnualIncomeTaxReconciliationV2UseCase,
      GetTenantEcuadorTaxAuditReadinessBinderUseCase,
      GetTenantEcuadorTaxExternalAccountantAnnualReviewRoomUseCase,
      GetTenantEcuadorTaxAccountingAdvancedDiscoveryGateUseCase,
    ].map((useCase) => ({
      provide: useCase,
      inject: [ListTenantEcuadorTaxComplianceEventsUseCase],
      useFactory: (listEventsUseCase) => new useCase(listEventsUseCase),
    })),
    {
      provide: RequestTenantEcuadorTaxComplianceAnnualCloseoutV5UseCase,
      inject: [
        GetTenantEcuadorTaxAnnualFiscalYearWorkspaceUseCase,
        GetTenantEcuadorTaxAnnualIncomeTaxReconciliationV2UseCase,
        GetTenantEcuadorTaxAuditReadinessBinderUseCase,
        GetTenantEcuadorTaxExternalAccountantAnnualReviewRoomUseCase,
        GetTenantEcuadorTaxAccountingAdvancedDiscoveryGateUseCase,
      ],
      useFactory: (
        getAnnualFiscalYearWorkspaceUseCase,
        getAnnualIncomeTaxReconciliationUseCase,
        getAuditReadinessBinderUseCase,
        getExternalAccountantAnnualReviewRoomUseCase,
        getAccountingAdvancedDiscoveryGateUseCase,
      ) =>
        new RequestTenantEcuadorTaxComplianceAnnualCloseoutV5UseCase(
          getAnnualFiscalYearWorkspaceUseCase,
          getAnnualIncomeTaxReconciliationUseCase,
          getAuditReadinessBinderUseCase,
          getExternalAccountantAnnualReviewRoomUseCase,
          getAccountingAdvancedDiscoveryGateUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxProfessionalHandoffV6UseCase,
      inject: [
        GetTenantEcuadorTaxAccountantHandoffRoomV2UseCase,
        RequestTenantEcuadorTaxComplianceAnnualCloseoutV5UseCase,
      ],
      useFactory: (getAccountantHandoffRoomUseCase, getAnnualCloseoutUseCase) =>
        new GetTenantEcuadorTaxProfessionalHandoffV6UseCase(
          getAccountantHandoffRoomUseCase,
          getAnnualCloseoutUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase,
      inject: [
        GetTenantEcuadorTaxAccountingAdvancedDiscoveryGateUseCase,
        GetTenantEcuadorTaxProfessionalHandoffV6UseCase,
      ],
      useFactory: (
        getAccountingAdvancedDiscoveryGateUseCase,
        getProfessionalHandoffUseCase,
      ) =>
        new GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase(
          getAccountingAdvancedDiscoveryGateUseCase,
          getProfessionalHandoffUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAccountingBoundaryAiReviewUseCase,
      inject: [
        GetTenantEcuadorTaxProfessionalHandoffV6UseCase,
        GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase,
      ],
      useFactory: (
        getProfessionalHandoffUseCase,
        getAccountingAdvancedGateV2UseCase,
      ) =>
        new GetTenantEcuadorTaxAccountingBoundaryAiReviewUseCase(
          getProfessionalHandoffUseCase,
          getAccountingAdvancedGateV2UseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase,
      inject: [
        RequestTenantEcuadorTaxComplianceCloseoutV2UseCase,
        GetTenantEcuadorTaxProfessionalHandoffV6UseCase,
        GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase,
        GetTenantEcuadorTaxAccountingBoundaryAiReviewUseCase,
      ],
      useFactory: (
        requestTaxComplianceCloseoutV2UseCase,
        getProfessionalHandoffUseCase,
        getAccountingAdvancedGateV2UseCase,
        getAccountingBoundaryAiReviewUseCase,
      ) =>
        new GetTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase(
          requestTaxComplianceCloseoutV2UseCase,
          getProfessionalHandoffUseCase,
          getAccountingAdvancedGateV2UseCase,
          getAccountingBoundaryAiReviewUseCase,
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
  exports: [
    GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
    GetTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase,
    GetTenantEcuadorTaxAccountingBoundaryAiReviewUseCase,
    GetTenantEcuadorTaxOperationalCloseoutUseCase,
    RequestTenantEcuadorTaxAccountingBridgePreviewUseCase,
    RequestTenantEcuadorTaxAccountingReadinessPacketUseCase,
    RequestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase,
    UpsertTenantEcuadorTaxAccountingBridgeMappingUseCase,
  ],
})
export class TaxComplianceModule {}
