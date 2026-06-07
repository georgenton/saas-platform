import {
  Controller,
  Get,
  NotFoundException,
  Body,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ExecuteTenantEcuadorTaxWithholdingDraftBridgeUseCase,
  GetTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase,
  GetTenantEcuadorTaxAnnexesReadinessUseCase,
  GetTenantEcuadorTaxAnnexesWorkspaceUseCase,
  GetTenantEcuadorTaxAnnualRollupWorkspaceUseCase,
  GetTenantEcuadorTaxAccountantWorkbenchUseCase,
  GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
  GetTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase,
  GetTenantEcuadorTaxAccountingBoundaryCloseoutUseCase,
  GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
  GetTenantEcuadorTaxFilingHandoffUseCase,
  GetTenantEcuadorTaxAuditReadinessUseCase,
  GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
  GetTenantEcuadorTaxDeclarationFormCatalogUseCase,
  GetTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase,
  GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
  GetTenantEcuadorTaxCommandCenterUseCase,
  GetTenantEcuadorTaxCommandCenterV2UseCase,
  GetTenantEcuadorTaxDueMonitorUseCase,
  GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
  GetTenantEcuadorTaxExceptionCenterUseCase,
  GetTenantEcuadorTaxFormMappingCatalogUseCase,
  GetTenantEcuadorTaxFilingEvidenceVaultV2UseCase,
  GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
  GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase,
  GetTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase,
  GetTenantEcuadorTaxObligationMatrixUseCase,
  GetTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase,
  GetTenantEcuadorTaxObligationCalendarUseCase,
  GetTenantEcuadorTaxObligationSettingsUseCase,
  GetTenantEcuadorTaxOperationalCloseoutUseCase,
  GetTenantEcuadorTaxPeriodEvidenceVaultUseCase,
  GetTenantEcuadorTaxPeriodWorkspaceUseCase,
  GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
  GetTenantEcuadorTaxReconciliationWorkspaceUseCase,
  GetTenantEcuadorTaxRuleCatalogUseCase,
  GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
  GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
  GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
  GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
  GetTenantEcuadorTaxSriSourceImportCenterV2UseCase,
  GetTenantEcuadorTaxVatDeclarationApprovalUseCase,
  GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
  GetTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase,
  GetTenantEcuadorTaxVatFormContractWorkspaceUseCase,
  GetTenantEcuadorTaxpayerProfileUseCase,
  GetTenantEcuadorTaxWithholdingRegistryUseCase,
  ListTenantEcuadorTaxAccountantReviewsUseCase,
  ListTenantEcuadorTaxComplianceEventsUseCase,
  RecordTenantEcuadorTaxPurchaseExpenseEvidenceUseCase,
  RecordTenantEcuadorTaxSriFiscalEvidenceImportUseCase,
  RecordTenantEcuadorTaxFilingHandoffUseCase,
  RequestTenantEcuadorTaxAccountantReviewPacketUseCase,
  RequestTenantEcuadorTaxAccountantReviewUseCase,
  RequestTenantEcuadorTaxAccountantCollaborationPackUseCase,
  RequestTenantEcuadorTaxAccountingReadinessPacketUseCase,
  RequestTenantEcuadorTaxAccountingBridgePreviewUseCase,
  RequestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase,
  RequestTenantEcuadorTaxAiFilingAssistantPacketUseCase,
  RequestTenantEcuadorTaxDeclarationArtifactExportUseCase,
  RequestTenantEcuadorTaxGrowthReminderPacketUseCase,
  RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
  RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
  RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
  RequestTenantEcuadorTaxFilingGuidePacketUseCase,
  RequestTenantEcuadorTaxFilingAssistantV2UseCase,
  RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
  RequestTenantEcuadorTaxPeriodCloseoutPacketUseCase,
  RequestTenantEcuadorTaxPeriodCloseoutReportUseCase,
  RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
  RequestTenantEcuadorTaxComplianceCloseoutV2UseCase,
  RequestTenantEcuadorTaxProductCloseoutPackUseCase,
  RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
  RequestTenantEcuadorTaxReviewAssistantPacketUseCase,
  RequestTenantEcuadorTaxSalesBookUseCase,
  RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
  RequestTenantEcuadorTaxVatDeclarationDraftUseCase,
  RequestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase,
  RequestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase,
  RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
  TaxComplianceAccountantReviewNotFoundError,
  TransitionTenantEcuadorTaxAccountantReviewUseCase,
  TransitionTenantEcuadorTaxOperationalCloseoutUseCase,
  TransitionTenantEcuadorTaxVatDeclarationApprovalUseCase,
  UpsertTenantEcuadorTaxAccountingBridgeMappingUseCase,
  UpsertTenantEcuadorTaxObligationSettingsUseCase,
  TAX_COMPLIANCE_PERMISSIONS,
} from '@saas-platform/tax-compliance-application';
import { TenantNotFoundError } from '@saas-platform/tenancy-application';
import { EcuadorTaxDeclarationFormKey } from '@saas-platform/tax-compliance-domain';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { RequireTenantProductAccess } from '../tenancy/require-tenant-product-access.decorator';
import { TenantAccess } from '../tenancy/tenant-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import {
  EcuadorTaxObligationMatrixResponseDto,
  EcuadorTaxObligationCalendarResponseDto,
  EcuadorTaxObligationSettingsResponseDto,
  EcuadorTaxAccountingBridgeMappingResponseDto,
  EcuadorTaxAccountingBridgePreviewResponseDto,
  EcuadorTaxAccountingBridgeSuggestedAccountsResponseDto,
  EcuadorTaxAccountingReadinessPacketResponseDto,
  EcuadorTaxAccountantCollaborationPackResponseDto,
  EcuadorTaxAnnexesReadinessResponseDto,
  EcuadorTaxAnnexesWorkspaceResponseDto,
  EcuadorTaxAnnualRollupWorkspaceResponseDto,
  EcuadorTaxOperationalCloseoutResponseDto,
  EcuadorTaxAccountantReviewResponseDto,
  EcuadorTaxAccountantWorkbenchResponseDto,
  EcuadorTaxComplianceEventResponseDto,
  EcuadorTaxDeclarationApprovalPacketResponseDto,
  EcuadorTaxCommandCenterResponseDto,
  EcuadorTaxAccountantReviewPacketResponseDto,
  EcuadorTaxAuditReadinessResponseDto,
  EcuadorTaxCalendarReviewWorkspaceResponseDto,
  EcuadorTaxDeclarationDraftPacketResponseDto,
  EcuadorTaxDueMonitorResponseDto,
  EcuadorTaxEcommerceEvidenceSummaryResponseDto,
  EcuadorTaxExceptionCenterResponseDto,
  EcuadorTaxFilingEvidenceVaultV2ResponseDto,
  EcuadorTaxFilingHandoffResponseDto,
  EcuadorTaxGrowthReminderPacketResponseDto,
  EcuadorTaxIncomeTaxEvidencePacketResponseDto,
  EcuadorTaxIncomeTaxFormContractWorkspaceResponseDto,
  EcuadorTaxPeriodCloseoutPacketResponseDto,
  EcuadorTaxPeriodCloseoutReportResponseDto,
  EcuadorTaxPeriodCloseoutCertificationResponseDto,
  EcuadorTaxProductCloseoutPackResponseDto,
  EcuadorTaxPeriodEvidenceVaultResponseDto,
  EcuadorTaxPeriodWorkspaceResponseDto,
  EcuadorTaxPeriodPreparationPacketResponseDto,
  EcuadorTaxPurchaseExpenseEvidenceRecordResponseDto,
  EcuadorTaxPurchaseExpenseEvidenceWorkspaceResponseDto,
  EcuadorTaxReconciliationWorkspaceResponseDto,
  EcuadorTaxRuleCatalogResponseDto,
  EcuadorTaxReviewAssistantPacketResponseDto,
  EcuadorTaxSalesBookResponseDto,
  EcuadorTaxSupplierFiscalReadinessWorkspaceResponseDto,
  EcuadorTaxDeclarationFormCatalogResponseDto,
  EcuadorTaxDeclarationArtifactExportResponseDto,
  EcuadorTaxDeclarationFormDraftPacketResponseDto,
  EcuadorTaxDeclarationReviewLoopWorkspaceResponseDto,
  EcuadorTaxDeclarationSourceLedgerResponseDto,
  EcuadorTaxAiFilingAssistantPacketResponseDto,
  EcuadorTaxFormMappingCatalogResponseDto,
  EcuadorTaxIncomeTaxEvidenceWorkspaceResponseDto,
  EcuadorTaxObligationMatrixV2WorkspaceResponseDto,
  EcuadorTaxSriEvidenceIntakeV2WorkspaceResponseDto,
  EcuadorTaxSriFiscalEvidenceImportBatchResponseDto,
  EcuadorTaxSriFiscalEvidenceWorkspaceResponseDto,
  EcuadorTaxSriPlatformReconciliationWorkspaceResponseDto,
  EcuadorTaxFilingGuidePacketResponseDto,
  EcuadorTaxpayerProfileResponseDto,
  EcuadorTaxVatDeclarationReadinessPacketResponseDto,
  EcuadorTaxVatDeclarationDraftResponseDto,
  EcuadorTaxVatDeclarationDraftWorkspaceResponseDto,
  EcuadorTaxVatFormContractWorkspaceResponseDto,
  EcuadorTaxVatDeclarationApprovalResponseDto,
  EcuadorTaxVatInputOutputReconciliationPacketResponseDto,
  EcuadorTaxWithholdingDraftBridgePacketResponseDto,
  EcuadorTaxWithholdingDraftExecutionPacketResponseDto,
  EcuadorTaxWithholdingEvidencePacketResponseDto,
  EcuadorTaxWithholdingRegistryResponseDto,
  toEcuadorTaxAccountantWorkbenchResponseDto,
  toEcuadorTaxAccountingBridgeMappingResponseDto,
  toEcuadorTaxAccountingBridgePreviewResponseDto,
  toEcuadorTaxAccountingBridgeSuggestedAccountsResponseDto,
  toEcuadorTaxAccountingReadinessPacketResponseDto,
  toEcuadorTaxAccountantCollaborationPackResponseDto,
  toEcuadorTaxAccountantReviewResponseDto,
  toEcuadorTaxAccountantReviewPacketResponseDto,
  toEcuadorTaxAnnexesReadinessResponseDto,
  toEcuadorTaxAnnexesWorkspaceResponseDto,
  toEcuadorTaxAnnualRollupWorkspaceResponseDto,
  toEcuadorTaxAuditReadinessResponseDto,
  toEcuadorTaxCalendarReviewWorkspaceResponseDto,
  toEcuadorTaxComplianceEventResponseDto,
  toEcuadorTaxDeclarationApprovalPacketResponseDto,
  toEcuadorTaxCommandCenterResponseDto,
  toEcuadorTaxDeclarationDraftPacketResponseDto,
  toEcuadorTaxDueMonitorResponseDto,
  toEcuadorTaxEcommerceEvidenceSummaryResponseDto,
  toEcuadorTaxExceptionCenterResponseDto,
  toEcuadorTaxFilingEvidenceVaultV2ResponseDto,
  toEcuadorTaxFilingHandoffResponseDto,
  toEcuadorTaxGrowthReminderPacketResponseDto,
  toEcuadorTaxIncomeTaxEvidencePacketResponseDto,
  toEcuadorTaxIncomeTaxFormContractWorkspaceResponseDto,
  toEcuadorTaxObligationCalendarResponseDto,
  toEcuadorTaxObligationMatrixResponseDto,
  toEcuadorTaxObligationMatrixV2WorkspaceResponseDto,
  toEcuadorTaxObligationSettingsResponseDto,
  toEcuadorTaxOperationalCloseoutResponseDto,
  toEcuadorTaxPeriodCloseoutPacketResponseDto,
  toEcuadorTaxPeriodCloseoutReportResponseDto,
  toEcuadorTaxPeriodCloseoutCertificationResponseDto,
  toEcuadorTaxProductCloseoutPackResponseDto,
  toEcuadorTaxPeriodEvidenceVaultResponseDto,
  toEcuadorTaxPeriodWorkspaceResponseDto,
  toEcuadorTaxPeriodPreparationPacketResponseDto,
  toEcuadorTaxPurchaseExpenseEvidenceRecordResponseDto,
  toEcuadorTaxPurchaseExpenseEvidenceWorkspaceResponseDto,
  toEcuadorTaxReconciliationWorkspaceResponseDto,
  toEcuadorTaxRuleCatalogResponseDto,
  toEcuadorTaxReviewAssistantPacketResponseDto,
  toEcuadorTaxSalesBookResponseDto,
  toEcuadorTaxSupplierFiscalReadinessWorkspaceResponseDto,
  toEcuadorTaxDeclarationFormCatalogResponseDto,
  toEcuadorTaxDeclarationArtifactExportResponseDto,
  toEcuadorTaxDeclarationFormDraftPacketResponseDto,
  toEcuadorTaxDeclarationReviewLoopWorkspaceResponseDto,
  toEcuadorTaxDeclarationSourceLedgerResponseDto,
  toEcuadorTaxAiFilingAssistantPacketResponseDto,
  toEcuadorTaxFormMappingCatalogResponseDto,
  toEcuadorTaxIncomeTaxEvidenceWorkspaceResponseDto,
  toEcuadorTaxSriEvidenceIntakeV2WorkspaceResponseDto,
  toEcuadorTaxSriFiscalEvidenceImportBatchResponseDto,
  toEcuadorTaxSriFiscalEvidenceWorkspaceResponseDto,
  toEcuadorTaxSriPlatformReconciliationWorkspaceResponseDto,
  toEcuadorTaxFilingGuidePacketResponseDto,
  toEcuadorTaxpayerProfileResponseDto,
  toEcuadorTaxVatDeclarationReadinessPacketResponseDto,
  toEcuadorTaxVatDeclarationDraftResponseDto,
  toEcuadorTaxVatDeclarationDraftWorkspaceResponseDto,
  toEcuadorTaxVatFormContractWorkspaceResponseDto,
  toEcuadorTaxVatDeclarationApprovalResponseDto,
  toEcuadorTaxVatInputOutputReconciliationPacketResponseDto,
  toEcuadorTaxWithholdingDraftBridgePacketResponseDto,
  toEcuadorTaxWithholdingDraftExecutionPacketResponseDto,
  toEcuadorTaxWithholdingEvidencePacketResponseDto,
  toEcuadorTaxWithholdingRegistryResponseDto,
} from './dto/ecuador-tax-compliance.response';
import {
  EcuadorTaxAccountingBoundaryCloseoutResponseDto,
  EcuadorTaxAccountingEvidenceFromFoundationResponseDto,
  EcuadorTaxAssistedDeclarationReviewPackV2ResponseDto,
  EcuadorTaxCommandCenterV2ResponseDto,
  toEcuadorTaxAccountingBoundaryCloseoutResponseDto,
  toEcuadorTaxAccountingEvidenceFromFoundationResponseDto,
  toEcuadorTaxAssistedDeclarationReviewPackV2ResponseDto,
  toEcuadorTaxCommandCenterV2ResponseDto,
} from './dto/ecuador-tax-accounting-closeout.response';
import {
  EcuadorTaxAccountantEscalationServiceBoundaryResponseDto,
  EcuadorTaxComplianceCloseoutV2ResponseDto,
  EcuadorTaxFilingAssistantV2ResponseDto,
  EcuadorTaxIncomeTaxEvidenceWorkspaceV2ResponseDto,
  EcuadorTaxSriSourceImportCenterV2ResponseDto,
  EcuadorTaxVatDeclarationWorkspaceV2ResponseDto,
  toEcuadorTaxAccountantEscalationServiceBoundaryResponseDto,
  toEcuadorTaxComplianceCloseoutV2ResponseDto,
  toEcuadorTaxFilingAssistantV2ResponseDto,
  toEcuadorTaxIncomeTaxEvidenceWorkspaceV2ResponseDto,
  toEcuadorTaxSriSourceImportCenterV2ResponseDto,
  toEcuadorTaxVatDeclarationWorkspaceV2ResponseDto,
} from './dto/ecuador-tax-declaration-closeout-v2.response';

type TenantAccessContext = {
  tenantSlug?: string;
};

interface RequestAccountantReviewBodyDto {
  period?: string;
  year?: number;
  requestedByUserId?: string | null;
  requestedByEmail?: string | null;
}

interface TransitionAccountantReviewBodyDto {
  status: 'pending_accountant' | 'in_review' | 'changes_requested' | 'approved';
  transitionedByUserId?: string | null;
  note?: string | null;
}

interface RecordPurchaseExpenseEvidenceBodyDto {
  period?: string;
  year?: number;
  supplierPartyId?: string | null;
  supplierName: string;
  supplierTaxpayerId?: string | null;
  documentNumber?: string | null;
  documentCode?: string | null;
  issuedAt?: string | null;
  category?:
    | 'inventory'
    | 'services'
    | 'operating_expense'
    | 'asset'
    | 'non_deductible'
    | 'uncategorized';
  currency?: string;
  subtotalInCents: number;
  vatInCents?: number;
  totalInCents?: number;
  deductible?: boolean | null;
  supportReference?: string | null;
}

interface RequestWithholdingDraftBridgeBodyDto {
  period?: string;
  year?: number;
  candidateType?: 'sale' | 'purchase';
  candidateId?: string | null;
  taxRateId?: string | null;
}

interface ExecuteWithholdingDraftBridgeBodyDto
  extends RequestWithholdingDraftBridgeBodyDto {
  number?: string | null;
  issuedAt?: string | null;
}

interface UpsertObligationSettingsBodyDto {
  regime?: 'general' | 'rimpe_entrepreneur' | 'rimpe_popular_business' | 'unknown';
  accountingObligated?: boolean | null;
  specialTaxpayerCode?: string | null;
  ninthDigit?: string | null;
  obligations?: Array<{
    key: 'vat' | 'income_tax' | 'withholding' | 'annexes';
    applies: boolean;
    frequency: 'monthly' | 'semiannual' | 'annual' | 'event_driven' | 'unknown';
    notes?: string[];
  }>;
  updatedByUserId?: string | null;
  updatedByEmail?: string | null;
}

interface TransitionTaxWorkflowBodyDto {
  period?: string;
  year?: number;
  status: string;
  transitionedByUserId?: string | null;
  transitionedByEmail?: string | null;
  note?: string | null;
}

interface RecordFilingHandoffBodyDto {
  period?: string;
  year?: number;
  status: string;
  externalReference?: string | null;
  filedAt?: string | null;
  paidAt?: string | null;
  amountPaidInCents?: number | null;
  currency?: string | null;
  responsibleUserId?: string | null;
  responsibleEmail?: string | null;
  note?: string | null;
}

interface UpsertAccountingBridgeMappingBodyDto {
  period?: string;
  year?: number;
  mappings?: Array<{
    accountHint: string;
    suggestedAccountCode?: string | null;
    suggestedAccountName?: string | null;
  }>;
  updatedByUserId?: string | null;
  updatedByEmail?: string | null;
}

interface RecordSriFiscalEvidenceImportBodyDto {
  period?: string;
  year?: number;
  source?: 'sri_report' | 'sri_xml' | 'manual_summary';
  importedByUserId?: string | null;
  importedByEmail?: string | null;
  vouchers: Array<{
    direction: 'issued' | 'received';
    voucherType:
      | 'invoice'
      | 'credit_note'
      | 'debit_note'
      | 'withholding'
      | 'purchase_settlement'
      | 'remission_guide'
      | 'other';
    accessKey?: string | null;
    authorizationNumber?: string | null;
    authorizationDate?: string | null;
    issuedAt?: string | null;
    emitterTaxpayerId?: string | null;
    emitterName?: string | null;
    receiverTaxpayerId?: string | null;
    receiverName?: string | null;
    establishment?: string | null;
    emissionPoint?: string | null;
    sequential?: string | null;
    documentNumber?: string | null;
    currency?: string;
    subtotalInCents?: number;
    vatInCents?: number;
    incomeTaxWithholdingInCents?: number;
    vatWithholdingInCents?: number;
    totalInCents?: number;
    relatedAccessKey?: string | null;
    xmlReference?: string | null;
    rideReference?: string | null;
  }>;
}

@Controller('tax-compliance/tenants')
@UseGuards(
  JwtAuthenticationGuard,
  TenantMembershipGuard,
  TenantPermissionGuard,
  TenantProductAccessGuard,
)
@RequireTenantProductAccess({ productKey: 'tax-compliance-ec' })
export class TaxComplianceController {
  constructor(
    private readonly getTenantEcuadorTaxpayerProfileUseCase: GetTenantEcuadorTaxpayerProfileUseCase,
    private readonly getTenantEcuadorTaxObligationMatrixUseCase: GetTenantEcuadorTaxObligationMatrixUseCase,
    private readonly getTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase: GetTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase,
    private readonly getTenantEcuadorTaxObligationCalendarUseCase: GetTenantEcuadorTaxObligationCalendarUseCase,
    private readonly getTenantEcuadorTaxObligationSettingsUseCase: GetTenantEcuadorTaxObligationSettingsUseCase,
    private readonly upsertTenantEcuadorTaxObligationSettingsUseCase: UpsertTenantEcuadorTaxObligationSettingsUseCase,
    private readonly getTenantEcuadorTaxCalendarReviewWorkspaceUseCase: GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
    private readonly getTenantEcuadorTaxDueMonitorUseCase: GetTenantEcuadorTaxDueMonitorUseCase,
    private readonly getTenantEcuadorTaxEcommerceEvidenceSummaryUseCase: GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
    private readonly getTenantEcuadorTaxPeriodWorkspaceUseCase: GetTenantEcuadorTaxPeriodWorkspaceUseCase,
    private readonly getTenantEcuadorTaxAuditReadinessUseCase: GetTenantEcuadorTaxAuditReadinessUseCase,
    private readonly requestTenantEcuadorTaxPeriodPreparationPacketUseCase: RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
    private readonly requestTenantEcuadorTaxDeclarationDraftPacketUseCase: RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
    private readonly requestTenantEcuadorTaxAccountantReviewPacketUseCase: RequestTenantEcuadorTaxAccountantReviewPacketUseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly requestTenantEcuadorTaxAccountantReviewUseCase: RequestTenantEcuadorTaxAccountantReviewUseCase,
    private readonly listTenantEcuadorTaxAccountantReviewsUseCase: ListTenantEcuadorTaxAccountantReviewsUseCase,
    private readonly transitionTenantEcuadorTaxAccountantReviewUseCase: TransitionTenantEcuadorTaxAccountantReviewUseCase,
    private readonly requestTenantEcuadorTaxDeclarationApprovalPacketUseCase: RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
    private readonly requestTenantEcuadorTaxSalesBookUseCase: RequestTenantEcuadorTaxSalesBookUseCase,
    private readonly getTenantEcuadorTaxReconciliationWorkspaceUseCase: GetTenantEcuadorTaxReconciliationWorkspaceUseCase,
    private readonly recordTenantEcuadorTaxSriFiscalEvidenceImportUseCase: RecordTenantEcuadorTaxSriFiscalEvidenceImportUseCase,
    private readonly getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase: GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
    private readonly getTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase: GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
    private readonly getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase: GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
    private readonly getTenantEcuadorTaxDeclarationFormCatalogUseCase: GetTenantEcuadorTaxDeclarationFormCatalogUseCase,
    private readonly requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase: RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
    private readonly getTenantEcuadorTaxDeclarationSourceLedgerUseCase: GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
    private readonly getTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase: GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
    private readonly getTenantEcuadorTaxFormMappingCatalogUseCase: GetTenantEcuadorTaxFormMappingCatalogUseCase,
    private readonly getTenantEcuadorTaxVatFormContractWorkspaceUseCase: GetTenantEcuadorTaxVatFormContractWorkspaceUseCase,
    private readonly requestTenantEcuadorTaxFilingGuidePacketUseCase: RequestTenantEcuadorTaxFilingGuidePacketUseCase,
    private readonly requestTenantEcuadorTaxDeclarationArtifactExportUseCase: RequestTenantEcuadorTaxDeclarationArtifactExportUseCase,
    private readonly requestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase: RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
    private readonly requestTenantEcuadorTaxVatDeclarationDraftUseCase: RequestTenantEcuadorTaxVatDeclarationDraftUseCase,
    private readonly requestTenantEcuadorTaxPeriodCloseoutPacketUseCase: RequestTenantEcuadorTaxPeriodCloseoutPacketUseCase,
    private readonly getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase: GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
    private readonly requestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase: RequestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase,
    private readonly requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase: RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
    private readonly getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase: GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
    private readonly getTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase: GetTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase,
    private readonly requestTenantEcuadorTaxAiFilingAssistantPacketUseCase: RequestTenantEcuadorTaxAiFilingAssistantPacketUseCase,
    private readonly recordTenantEcuadorTaxPurchaseExpenseEvidenceUseCase: RecordTenantEcuadorTaxPurchaseExpenseEvidenceUseCase,
    private readonly getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase: GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
    private readonly requestTenantEcuadorTaxWithholdingEvidencePacketUseCase: RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
    private readonly requestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase: RequestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase,
    private readonly executeTenantEcuadorTaxWithholdingDraftBridgeUseCase: ExecuteTenantEcuadorTaxWithholdingDraftBridgeUseCase,
    private readonly getTenantEcuadorTaxRuleCatalogUseCase: GetTenantEcuadorTaxRuleCatalogUseCase,
    private readonly getTenantEcuadorTaxAccountantWorkbenchUseCase: GetTenantEcuadorTaxAccountantWorkbenchUseCase,
    private readonly getTenantEcuadorTaxPeriodEvidenceVaultUseCase: GetTenantEcuadorTaxPeriodEvidenceVaultUseCase,
    private readonly getTenantEcuadorTaxVatDeclarationApprovalUseCase: GetTenantEcuadorTaxVatDeclarationApprovalUseCase,
    private readonly transitionTenantEcuadorTaxVatDeclarationApprovalUseCase: TransitionTenantEcuadorTaxVatDeclarationApprovalUseCase,
    private readonly getTenantEcuadorTaxWithholdingRegistryUseCase: GetTenantEcuadorTaxWithholdingRegistryUseCase,
    private readonly getTenantEcuadorTaxOperationalCloseoutUseCase: GetTenantEcuadorTaxOperationalCloseoutUseCase,
    private readonly transitionTenantEcuadorTaxOperationalCloseoutUseCase: TransitionTenantEcuadorTaxOperationalCloseoutUseCase,
    private readonly getTenantEcuadorTaxFilingHandoffUseCase: GetTenantEcuadorTaxFilingHandoffUseCase,
    private readonly recordTenantEcuadorTaxFilingHandoffUseCase: RecordTenantEcuadorTaxFilingHandoffUseCase,
    private readonly getTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase: GetTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase,
    private readonly getTenantEcuadorTaxAnnexesReadinessUseCase: GetTenantEcuadorTaxAnnexesReadinessUseCase,
    private readonly getTenantEcuadorTaxAnnexesWorkspaceUseCase: GetTenantEcuadorTaxAnnexesWorkspaceUseCase,
    private readonly requestTenantEcuadorTaxAccountingBridgePreviewUseCase: RequestTenantEcuadorTaxAccountingBridgePreviewUseCase,
    private readonly getTenantEcuadorTaxAccountingBridgeMappingUseCase: GetTenantEcuadorTaxAccountingBridgeMappingUseCase,
    private readonly upsertTenantEcuadorTaxAccountingBridgeMappingUseCase: UpsertTenantEcuadorTaxAccountingBridgeMappingUseCase,
    private readonly getTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase: GetTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase,
    private readonly requestTenantEcuadorTaxGrowthReminderPacketUseCase: RequestTenantEcuadorTaxGrowthReminderPacketUseCase,
    private readonly requestTenantEcuadorTaxReviewAssistantPacketUseCase: RequestTenantEcuadorTaxReviewAssistantPacketUseCase,
    private readonly requestTenantEcuadorTaxPeriodCloseoutReportUseCase: RequestTenantEcuadorTaxPeriodCloseoutReportUseCase,
    private readonly requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase: RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
    private readonly getTenantEcuadorTaxCommandCenterUseCase: GetTenantEcuadorTaxCommandCenterUseCase,
    private readonly requestTenantEcuadorTaxAccountantCollaborationPackUseCase: RequestTenantEcuadorTaxAccountantCollaborationPackUseCase,
    private readonly getTenantEcuadorTaxFilingEvidenceVaultV2UseCase: GetTenantEcuadorTaxFilingEvidenceVaultV2UseCase,
    private readonly getTenantEcuadorTaxExceptionCenterUseCase: GetTenantEcuadorTaxExceptionCenterUseCase,
    private readonly getTenantEcuadorTaxAnnualRollupWorkspaceUseCase: GetTenantEcuadorTaxAnnualRollupWorkspaceUseCase,
    private readonly requestTenantEcuadorTaxProductCloseoutPackUseCase: RequestTenantEcuadorTaxProductCloseoutPackUseCase,
    private readonly requestTenantEcuadorTaxAccountingReadinessPacketUseCase: RequestTenantEcuadorTaxAccountingReadinessPacketUseCase,
    private readonly getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase: GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
    private readonly getTenantEcuadorTaxCommandCenterV2UseCase: GetTenantEcuadorTaxCommandCenterV2UseCase,
    private readonly requestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase: RequestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase,
    private readonly getTenantEcuadorTaxAccountingBoundaryCloseoutUseCase: GetTenantEcuadorTaxAccountingBoundaryCloseoutUseCase,
    private readonly getTenantEcuadorTaxSriSourceImportCenterV2UseCase: GetTenantEcuadorTaxSriSourceImportCenterV2UseCase,
    private readonly getTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase: GetTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase,
    private readonly getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase: GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase,
    private readonly requestTenantEcuadorTaxFilingAssistantV2UseCase: RequestTenantEcuadorTaxFilingAssistantV2UseCase,
    private readonly getTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase: GetTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase,
    private readonly requestTenantEcuadorTaxComplianceCloseoutV2UseCase: RequestTenantEcuadorTaxComplianceCloseoutV2UseCase,
  ) {}

  @Get(':slug/ec/taxpayer-profile')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getTaxpayerProfile(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxpayerProfileResponseDto> {
    try {
      const profile = await this.getTenantEcuadorTaxpayerProfileUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return toEcuadorTaxpayerProfileResponseDto(profile);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/calendar-review-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getCalendarReviewWorkspace(
    @Param('slug') slug: string,
    @Query('year') year?: string,
    @Query('asOfDate') asOfDate?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxCalendarReviewWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxCalendarReviewWorkspaceUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          resolveCalendarYear(year),
          asOfDate,
        );

      return toEcuadorTaxCalendarReviewWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/due-monitor')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getDueMonitor(
    @Param('slug') slug: string,
    @Query('year') year?: string,
    @Query('asOfDate') asOfDate?: string,
    @Query('windowDays') windowDays?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxDueMonitorResponseDto> {
    try {
      const monitor = await this.getTenantEcuadorTaxDueMonitorUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        year: resolveCalendarYear(year),
        asOfDate,
        windowDays: resolveWindowDays(windowDays),
      });

      return toEcuadorTaxDueMonitorResponseDto(monitor);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/growth-reminder-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getGrowthReminderPacket(
    @Param('slug') slug: string,
    @Query('year') year?: string,
    @Query('asOfDate') asOfDate?: string,
    @Query('windowDays') windowDays?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxGrowthReminderPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxGrowthReminderPacketUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          year: resolveCalendarYear(year),
          asOfDate,
          windowDays: resolveWindowDays(windowDays),
        });

      return toEcuadorTaxGrowthReminderPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/obligation-calendar')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getObligationCalendar(
    @Param('slug') slug: string,
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxObligationCalendarResponseDto> {
    try {
      const resolvedYear = resolveCalendarYear(year);
      const calendar =
        await this.getTenantEcuadorTaxObligationCalendarUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          resolvedYear,
        );

      return toEcuadorTaxObligationCalendarResponseDto(calendar);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/obligation-matrix')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getObligationMatrix(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxObligationMatrixResponseDto> {
    try {
      const matrix =
        await this.getTenantEcuadorTaxObligationMatrixUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toEcuadorTaxObligationMatrixResponseDto(matrix);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/obligation-matrix-v2-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getObligationMatrixV2Workspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxObligationMatrixV2WorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxObligationMatrixV2WorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/obligation-settings')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getObligationSettings(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxObligationSettingsResponseDto> {
    try {
      const settings =
        await this.getTenantEcuadorTaxObligationSettingsUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
        });

      return toEcuadorTaxObligationSettingsResponseDto(settings);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/obligation-settings')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_MANAGE)
  async upsertObligationSettings(
    @Param('slug') slug: string,
    @Body() body: UpsertObligationSettingsBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxObligationSettingsResponseDto> {
    try {
      const settings =
        await this.upsertTenantEcuadorTaxObligationSettingsUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          regime: body.regime,
          accountingObligated: body.accountingObligated,
          specialTaxpayerCode: body.specialTaxpayerCode,
          ninthDigit: body.ninthDigit,
          obligations: body.obligations,
          updatedByUserId: body.updatedByUserId,
          updatedByEmail: body.updatedByEmail,
        });

      return toEcuadorTaxObligationSettingsResponseDto(settings);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/period-preparation-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getPeriodPreparationPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxPeriodPreparationPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxPeriodPreparationPacketUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          period,
        );

      return toEcuadorTaxPeriodPreparationPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/period-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getPeriodWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @Query('asOfDate') asOfDate?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxPeriodWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxPeriodWorkspaceUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
          asOfDate,
        });

      return toEcuadorTaxPeriodWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/ecommerce-evidence')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getEcommerceEvidence(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxEcommerceEvidenceSummaryResponseDto> {
    try {
      const summary =
        await this.getTenantEcuadorTaxEcommerceEvidenceSummaryUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
        });

      return toEcuadorTaxEcommerceEvidenceSummaryResponseDto(summary);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/sales-book')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getSalesBook(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxSalesBookResponseDto> {
    try {
      const book = await this.requestTenantEcuadorTaxSalesBookUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        period,
        year: resolveCalendarYear(year),
      });

      return toEcuadorTaxSalesBookResponseDto(book);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/reconciliation-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getReconciliationWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxReconciliationWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxReconciliationWorkspaceUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxReconciliationWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/sri-fiscal-evidence-import')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_MANAGE)
  async recordSriFiscalEvidenceImport(
    @Param('slug') slug: string,
    @Body() body: RecordSriFiscalEvidenceImportBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxSriFiscalEvidenceImportBatchResponseDto> {
    try {
      const batch =
        await this.recordTenantEcuadorTaxSriFiscalEvidenceImportUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period: body.period ?? 'current',
            year: body.year ?? resolveCalendarYear(undefined),
            source: body.source,
            importedByUserId: body.importedByUserId ?? null,
            importedByEmail: body.importedByEmail ?? null,
            vouchers: body.vouchers ?? [],
          },
        );

      return toEcuadorTaxSriFiscalEvidenceImportBatchResponseDto(batch);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/sri-fiscal-evidence-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getSriFiscalEvidenceWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxSriFiscalEvidenceWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxSriFiscalEvidenceWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/sri-evidence-intake-v2-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getSriEvidenceIntakeV2Workspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxSriEvidenceIntakeV2WorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxSriEvidenceIntakeV2WorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/sri-platform-reconciliation-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getSriPlatformReconciliationWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxSriPlatformReconciliationWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxSriPlatformReconciliationWorkspaceResponseDto(
        workspace,
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/declaration-form-catalog')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getDeclarationFormCatalog(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxDeclarationFormCatalogResponseDto> {
    try {
      const catalog =
        await this.getTenantEcuadorTaxDeclarationFormCatalogUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxDeclarationFormCatalogResponseDto(catalog);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/declaration-form-draft-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getDeclarationFormDraftPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @Query('formKey') formKey?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxDeclarationFormDraftPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
            formKey: normalizeDeclarationFormKey(formKey),
          },
        );

      return toEcuadorTaxDeclarationFormDraftPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/declaration-source-ledger')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getDeclarationSourceLedger(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxDeclarationSourceLedgerResponseDto> {
    try {
      const ledger =
        await this.getTenantEcuadorTaxDeclarationSourceLedgerUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxDeclarationSourceLedgerResponseDto(ledger);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/vat-declaration-draft-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getVatDeclarationDraftWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxVatDeclarationDraftWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxVatDeclarationDraftWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/vat-form-contract-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getVatFormContractWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxVatFormContractWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxVatFormContractWorkspaceUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxVatFormContractWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/form-mapping-catalog')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getFormMappingCatalog(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxFormMappingCatalogResponseDto> {
    try {
      const catalog =
        await this.getTenantEcuadorTaxFormMappingCatalogUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxFormMappingCatalogResponseDto(catalog);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/filing-guide-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getFilingGuidePacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @Query('formKey') formKey?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxFilingGuidePacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxFilingGuidePacketUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
          formKey: normalizeDeclarationFormKey(formKey),
        });

      return toEcuadorTaxFilingGuidePacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/declaration-artifact-export')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getDeclarationArtifactExport(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @Query('formKey') formKey?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxDeclarationArtifactExportResponseDto> {
    try {
      const artifactExport =
        await this.requestTenantEcuadorTaxDeclarationArtifactExportUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
            formKey: normalizeDeclarationFormKey(formKey),
          },
        );

      return toEcuadorTaxDeclarationArtifactExportResponseDto(artifactExport);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/vat-declaration-readiness-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getVatDeclarationReadinessPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxVatDeclarationReadinessPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxVatDeclarationReadinessPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/purchase-expense-evidence-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getPurchaseExpenseEvidenceWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxPurchaseExpenseEvidenceWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxPurchaseExpenseEvidenceWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/purchase-expense-evidence')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async recordPurchaseExpenseEvidence(
    @Param('slug') slug: string,
    @Body() body: RecordPurchaseExpenseEvidenceBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxPurchaseExpenseEvidenceRecordResponseDto> {
    try {
      const evidence =
        await this.recordTenantEcuadorTaxPurchaseExpenseEvidenceUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period: body.period ?? 'current',
            year: body.year ?? resolveCalendarYear(),
            supplierPartyId: body.supplierPartyId,
            supplierName: body.supplierName,
            supplierTaxpayerId: body.supplierTaxpayerId,
            documentNumber: body.documentNumber,
            documentCode: body.documentCode,
            issuedAt: body.issuedAt,
            category: body.category,
            currency: body.currency,
            subtotalInCents: body.subtotalInCents,
            vatInCents: body.vatInCents,
            totalInCents: body.totalInCents,
            deductible: body.deductible,
            supportReference: body.supportReference,
          },
        );

      return toEcuadorTaxPurchaseExpenseEvidenceRecordResponseDto(evidence);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/supplier-fiscal-readiness-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getSupplierFiscalReadinessWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxSupplierFiscalReadinessWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxSupplierFiscalReadinessWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/vat-input-output-reconciliation-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getVatInputOutputReconciliationPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxVatInputOutputReconciliationPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxVatInputOutputReconciliationPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/vat-declaration-draft')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getVatDeclarationDraft(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxVatDeclarationDraftResponseDto> {
    try {
      const draft =
        await this.requestTenantEcuadorTaxVatDeclarationDraftUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxVatDeclarationDraftResponseDto(draft);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/vat-declaration-approval')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getVatDeclarationApproval(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxVatDeclarationApprovalResponseDto> {
    try {
      const approval =
        await this.getTenantEcuadorTaxVatDeclarationApprovalUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxVatDeclarationApprovalResponseDto(approval);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/vat-declaration-approval/transitions')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_MANAGE)
  async transitionVatDeclarationApproval(
    @Param('slug') slug: string,
    @Body() body: TransitionTaxWorkflowBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxVatDeclarationApprovalResponseDto> {
    try {
      const approval =
        await this.transitionTenantEcuadorTaxVatDeclarationApprovalUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period: body.period ?? 'current',
            year: body.year ?? resolveCalendarYear(),
            status: body.status,
            transitionedByUserId: body.transitionedByUserId,
            transitionedByEmail: body.transitionedByEmail,
            note: body.note,
          },
        );

      return toEcuadorTaxVatDeclarationApprovalResponseDto(approval);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/withholding-evidence-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getWithholdingEvidencePacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxWithholdingEvidencePacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxWithholdingEvidencePacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxWithholdingEvidencePacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/withholding-registry')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getWithholdingRegistry(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxWithholdingRegistryResponseDto> {
    try {
      const registry =
        await this.getTenantEcuadorTaxWithholdingRegistryUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxWithholdingRegistryResponseDto(registry);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/withholding-draft-bridge-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async requestWithholdingDraftBridgePacket(
    @Param('slug') slug: string,
    @Body() body: RequestWithholdingDraftBridgeBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxWithholdingDraftBridgePacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period: body.period ?? 'current',
            year: body.year ?? resolveCalendarYear(),
            candidateType: body.candidateType,
            candidateId: body.candidateId,
            taxRateId: body.taxRateId,
          },
        );

      return toEcuadorTaxWithholdingDraftBridgePacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/withholding-draft-bridge/execute')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_MANAGE)
  async executeWithholdingDraftBridge(
    @Param('slug') slug: string,
    @Body() body: ExecuteWithholdingDraftBridgeBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxWithholdingDraftExecutionPacketResponseDto> {
    try {
      const packet =
        await this.executeTenantEcuadorTaxWithholdingDraftBridgeUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period: body.period ?? 'current',
            year: body.year ?? resolveCalendarYear(),
            candidateType: body.candidateType,
            candidateId: body.candidateId,
            taxRateId: body.taxRateId,
            number: body.number,
            issuedAt: body.issuedAt ? new Date(body.issuedAt) : null,
          },
        );

      return toEcuadorTaxWithholdingDraftExecutionPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/tax-rule-catalog')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getTaxRuleCatalog(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxRuleCatalogResponseDto> {
    try {
      const catalog = await this.getTenantEcuadorTaxRuleCatalogUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        period,
        year: resolveCalendarYear(year),
      });

      return toEcuadorTaxRuleCatalogResponseDto(catalog);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/accountant-workbench')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAccountantWorkbench(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountantWorkbenchResponseDto> {
    try {
      const workbench =
        await this.getTenantEcuadorTaxAccountantWorkbenchUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxAccountantWorkbenchResponseDto(workbench);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/income-tax-evidence-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getIncomeTaxEvidencePacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxIncomeTaxEvidencePacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxIncomeTaxEvidencePacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/income-tax-evidence-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getIncomeTaxEvidenceWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxIncomeTaxEvidenceWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxIncomeTaxEvidenceWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/income-tax-form-contract-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getIncomeTaxFormContractWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxIncomeTaxFormContractWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxIncomeTaxFormContractWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/ai-filing-assistant-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAiFilingAssistantPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @Query('formKey') formKey?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAiFilingAssistantPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxAiFilingAssistantPacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
            formKey: normalizeDeclarationFormKey(formKey),
          },
        );

      return toEcuadorTaxAiFilingAssistantPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/declaration-review-loop-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getDeclarationReviewLoopWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxDeclarationReviewLoopWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxDeclarationReviewLoopWorkspaceUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxDeclarationReviewLoopWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/period-closeout-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getPeriodCloseoutPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxPeriodCloseoutPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxPeriodCloseoutPacketUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxPeriodCloseoutPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/declaration-draft-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getDeclarationDraftPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxDeclarationDraftPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxDeclarationDraftPacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxDeclarationDraftPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/accountant-review-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAccountantReviewPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountantReviewPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxAccountantReviewPacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxAccountantReviewPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/period-evidence-vault')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getPeriodEvidenceVault(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxPeriodEvidenceVaultResponseDto> {
    try {
      const vault =
        await this.getTenantEcuadorTaxPeriodEvidenceVaultUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxPeriodEvidenceVaultResponseDto(vault);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/operational-closeout')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getOperationalCloseout(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxOperationalCloseoutResponseDto> {
    try {
      const closeout =
        await this.getTenantEcuadorTaxOperationalCloseoutUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxOperationalCloseoutResponseDto(closeout);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/operational-closeout/transitions')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_MANAGE)
  async transitionOperationalCloseout(
    @Param('slug') slug: string,
    @Body() body: TransitionTaxWorkflowBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxOperationalCloseoutResponseDto> {
    try {
      const closeout =
        await this.transitionTenantEcuadorTaxOperationalCloseoutUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period: body.period ?? 'current',
          year: body.year ?? resolveCalendarYear(),
          status: body.status,
          transitionedByUserId: body.transitionedByUserId,
          transitionedByEmail: body.transitionedByEmail,
          note: body.note,
        });

      return toEcuadorTaxOperationalCloseoutResponseDto(closeout);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/filing-handoff')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getFilingHandoff(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxFilingHandoffResponseDto> {
    try {
      const handoff =
        await this.getTenantEcuadorTaxFilingHandoffUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxFilingHandoffResponseDto(handoff);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/filing-handoff')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_MANAGE)
  async recordFilingHandoff(
    @Param('slug') slug: string,
    @Body() body: RecordFilingHandoffBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxFilingHandoffResponseDto> {
    try {
      const handoff =
        await this.recordTenantEcuadorTaxFilingHandoffUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period: body.period ?? 'current',
          year: body.year ?? resolveCalendarYear(),
          status: body.status,
          externalReference: body.externalReference,
          filedAt: body.filedAt ? new Date(body.filedAt) : null,
          paidAt: body.paidAt ? new Date(body.paidAt) : null,
          amountPaidInCents: body.amountPaidInCents,
          currency: body.currency,
          responsibleUserId: body.responsibleUserId,
          responsibleEmail: body.responsibleEmail,
          note: body.note,
        });

      return toEcuadorTaxFilingHandoffResponseDto(handoff);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/annexes-readiness')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAnnexesReadiness(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAnnexesReadinessResponseDto> {
    try {
      const readiness =
        await this.getTenantEcuadorTaxAnnexesReadinessUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxAnnexesReadinessResponseDto(readiness);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/annexes-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAnnexesWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAnnexesWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxAnnexesWorkspaceUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxAnnexesWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/accounting-bridge-preview')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAccountingBridgePreview(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountingBridgePreviewResponseDto> {
    try {
      const preview =
        await this.requestTenantEcuadorTaxAccountingBridgePreviewUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxAccountingBridgePreviewResponseDto(preview);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/accounting-bridge-mapping')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAccountingBridgeMapping(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountingBridgeMappingResponseDto> {
    try {
      const mapping =
        await this.getTenantEcuadorTaxAccountingBridgeMappingUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxAccountingBridgeMappingResponseDto(mapping);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/accounting-bridge-suggested-accounts')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAccountingBridgeSuggestedAccounts(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountingBridgeSuggestedAccountsResponseDto> {
    try {
      const catalog =
        await this.getTenantEcuadorTaxAccountingBridgeSuggestedAccountsUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxAccountingBridgeSuggestedAccountsResponseDto(catalog);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/accounting-bridge-mapping')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_MANAGE)
  async upsertAccountingBridgeMapping(
    @Param('slug') slug: string,
    @Body() body: UpsertAccountingBridgeMappingBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountingBridgeMappingResponseDto> {
    try {
      const mapping =
        await this.upsertTenantEcuadorTaxAccountingBridgeMappingUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period: body.period ?? 'current',
          year: resolveCalendarYear(
            body.year === undefined ? undefined : String(body.year),
          ),
          mappings: body.mappings ?? [],
          updatedByUserId: body.updatedByUserId ?? null,
          updatedByEmail: body.updatedByEmail ?? null,
        });

      return toEcuadorTaxAccountingBridgeMappingResponseDto(mapping);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/tax-review-assistant-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getTaxReviewAssistantPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxReviewAssistantPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxReviewAssistantPacketUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxReviewAssistantPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/period-closeout-report')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getPeriodCloseoutReport(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxPeriodCloseoutReportResponseDto> {
    try {
      const report =
        await this.requestTenantEcuadorTaxPeriodCloseoutReportUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxPeriodCloseoutReportResponseDto(report);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/period-closeout-certification')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getPeriodCloseoutCertification(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxPeriodCloseoutCertificationResponseDto> {
    try {
      const certification =
        await this.requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxPeriodCloseoutCertificationResponseDto(certification);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/command-center')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getCommandCenter(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxCommandCenterResponseDto> {
    try {
      const commandCenter =
        await this.getTenantEcuadorTaxCommandCenterUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxCommandCenterResponseDto(commandCenter);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/accounting-evidence-from-foundation')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAccountingEvidenceFromFoundation(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountingEvidenceFromFoundationResponseDto> {
    try {
      const evidence =
        await this.getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxAccountingEvidenceFromFoundationResponseDto(evidence);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/command-center-v2')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getCommandCenterV2(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxCommandCenterV2ResponseDto> {
    try {
      const commandCenter =
        await this.getTenantEcuadorTaxCommandCenterV2UseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxCommandCenterV2ResponseDto(commandCenter);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/assisted-declaration-review-pack-v2')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAssistedDeclarationReviewPackV2(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @Query('formKey') formKey?: EcuadorTaxDeclarationFormKey,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAssistedDeclarationReviewPackV2ResponseDto> {
    try {
      const pack =
        await this.requestTenantEcuadorTaxAssistedDeclarationReviewPackV2UseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
            formKey,
          },
        );

      return toEcuadorTaxAssistedDeclarationReviewPackV2ResponseDto(pack);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/accounting-boundary-closeout')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAccountingBoundaryCloseout(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountingBoundaryCloseoutResponseDto> {
    try {
      const closeout =
        await this.getTenantEcuadorTaxAccountingBoundaryCloseoutUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxAccountingBoundaryCloseoutResponseDto(closeout);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/sri-source-import-center-v2')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getSriSourceImportCenterV2(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxSriSourceImportCenterV2ResponseDto> {
    try {
      const center =
        await this.getTenantEcuadorTaxSriSourceImportCenterV2UseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxSriSourceImportCenterV2ResponseDto(center);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/vat-declaration-workspace-v2')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getVatDeclarationWorkspaceV2(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxVatDeclarationWorkspaceV2ResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxVatDeclarationWorkspaceV2ResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/income-tax-evidence-workspace-v2')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getIncomeTaxEvidenceWorkspaceV2(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxIncomeTaxEvidenceWorkspaceV2ResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxIncomeTaxEvidenceWorkspaceV2ResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/filing-assistant-v2')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getFilingAssistantV2(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @Query('formKey') formKey?: EcuadorTaxDeclarationFormKey,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxFilingAssistantV2ResponseDto> {
    try {
      const assistant =
        await this.requestTenantEcuadorTaxFilingAssistantV2UseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
          formKey,
        });

      return toEcuadorTaxFilingAssistantV2ResponseDto(assistant);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/accountant-escalation-service-boundary')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAccountantEscalationServiceBoundary(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountantEscalationServiceBoundaryResponseDto> {
    try {
      const boundary =
        await this.getTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxAccountantEscalationServiceBoundaryResponseDto(
        boundary,
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/compliance-closeout-v2')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getComplianceCloseoutV2(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxComplianceCloseoutV2ResponseDto> {
    try {
      const closeout =
        await this.requestTenantEcuadorTaxComplianceCloseoutV2UseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxComplianceCloseoutV2ResponseDto(closeout);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/accountant-collaboration-pack')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAccountantCollaborationPack(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountantCollaborationPackResponseDto> {
    try {
      const pack =
        await this.requestTenantEcuadorTaxAccountantCollaborationPackUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxAccountantCollaborationPackResponseDto(pack);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/filing-evidence-vault-v2')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getFilingEvidenceVaultV2(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxFilingEvidenceVaultV2ResponseDto> {
    try {
      const vault =
        await this.getTenantEcuadorTaxFilingEvidenceVaultV2UseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxFilingEvidenceVaultV2ResponseDto(vault);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/exception-center')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getExceptionCenter(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxExceptionCenterResponseDto> {
    try {
      const center =
        await this.getTenantEcuadorTaxExceptionCenterUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxExceptionCenterResponseDto(center);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/annual-rollup-workspace')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAnnualRollupWorkspace(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAnnualRollupWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcuadorTaxAnnualRollupWorkspaceUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxAnnualRollupWorkspaceResponseDto(workspace);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/product-closeout-pack')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getProductCloseoutPack(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxProductCloseoutPackResponseDto> {
    try {
      const pack =
        await this.requestTenantEcuadorTaxProductCloseoutPackUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxProductCloseoutPackResponseDto(pack);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/accounting-readiness-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAccountingReadinessPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountingReadinessPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxAccountingReadinessPacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxAccountingReadinessPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/events')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async listComplianceEvents(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('limit') limit?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxComplianceEventResponseDto[]> {
    try {
      const events =
        await this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          limit: resolveLimit(limit),
        });

      return events.map((event) =>
        toEcuadorTaxComplianceEventResponseDto(event),
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/accountant-review/request')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async requestAccountantReview(
    @Param('slug') slug: string,
    @Body() body: RequestAccountantReviewBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountantReviewResponseDto> {
    try {
      const review =
        await this.requestTenantEcuadorTaxAccountantReviewUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period: body.period ?? 'current',
          year: body.year ?? resolveCalendarYear(),
          requestedByUserId: body.requestedByUserId,
          requestedByEmail: body.requestedByEmail,
        });

      return toEcuadorTaxAccountantReviewResponseDto(review);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/accountant-reviews')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async listAccountantReviews(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountantReviewResponseDto[]> {
    try {
      const reviews =
        await this.listTenantEcuadorTaxAccountantReviewsUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
        });

      return reviews.map((review) =>
        toEcuadorTaxAccountantReviewResponseDto(review),
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/ec/accountant-review/:reviewId/transition')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async transitionAccountantReview(
    @Param('slug') slug: string,
    @Param('reviewId') reviewId: string,
    @Body() body: TransitionAccountantReviewBodyDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAccountantReviewResponseDto> {
    try {
      const review =
        await this.transitionTenantEcuadorTaxAccountantReviewUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          reviewId,
          status: body.status,
          transitionedByUserId: body.transitionedByUserId,
          note: body.note,
        });

      return toEcuadorTaxAccountantReviewResponseDto(review);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof TaxComplianceAccountantReviewNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/declaration-approval-packet')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getDeclarationApprovalPacket(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxDeclarationApprovalPacketResponseDto> {
    try {
      const packet =
        await this.requestTenantEcuadorTaxDeclarationApprovalPacketUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            period,
            year: resolveCalendarYear(year),
          },
        );

      return toEcuadorTaxDeclarationApprovalPacketResponseDto(packet);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/ec/audit-readiness')
  @RequireTenantPermission(TAX_COMPLIANCE_PERMISSIONS.EC_READ)
  async getAuditReadiness(
    @Param('slug') slug: string,
    @Query('period') period = 'current',
    @Query('year') year?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcuadorTaxAuditReadinessResponseDto> {
    try {
      const readiness =
        await this.getTenantEcuadorTaxAuditReadinessUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          period,
          year: resolveCalendarYear(year),
        });

      return toEcuadorTaxAuditReadinessResponseDto(readiness);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}

function resolveCalendarYear(year?: string): number {
  const parsed = year ? Number.parseInt(year, 10) : new Date().getUTCFullYear();

  return Number.isFinite(parsed) ? parsed : new Date().getUTCFullYear();
}

function resolveWindowDays(windowDays?: string): number | undefined {
  if (!windowDays) {
    return undefined;
  }

  const parsed = Number.parseInt(windowDays, 10);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeDeclarationFormKey(
  formKey?: string,
):
  | 'iva'
  | 'income_tax_natural_person'
  | 'income_tax_company'
  | 'withholding_income_tax'
  | 'multiple_payments'
  | 'multiple_declarations'
  | undefined {
  return formKey === 'iva' ||
    formKey === 'income_tax_natural_person' ||
    formKey === 'income_tax_company' ||
    formKey === 'withholding_income_tax' ||
    formKey === 'multiple_payments' ||
    formKey === 'multiple_declarations'
    ? formKey
    : undefined;
}

function resolveLimit(limit?: string): number | undefined {
  if (!limit) {
    return undefined;
  }

  const parsed = Number.parseInt(limit, 10);

  return Number.isFinite(parsed) ? parsed : undefined;
}
