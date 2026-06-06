import {
  AccountingCorrectionSource,
  AccountingCorrectionStatus,
  AccountingEvidenceAttachmentStatus,
  AccountingExternalCloseoutStatus,
  TenantAccountingAdjustmentRecommendationPacketView,
  TenantAccountingAiReviewAssistantPacketView,
  TenantAccountingCorrectionView,
  TenantAccountingCorrectionsQueueView,
  TenantAccountingEvidenceAttachmentRegistryView,
  TenantAccountingEvidenceAttachmentView,
  TenantAccountingExternalCloseoutRecordView,
  TenantAccountingFinancialStatementFinalReviewPacketView,
  TenantAccountingFoundationCloseoutSummaryView,
  TenantAccountingLegalBooksReadinessPacketView,
  TenantAccountingPeriodCloseoutTimelineView,
  TenantAccountingPeriodNarrativeReportView,
  TenantAccountingProfessionalCloseoutArtifactPacketView,
  TenantAccountingProfessionalCloseoutWorkspaceView,
} from '@saas-platform/accounting-domain';

export interface RecordAccountingCorrectionRequestDto {
  period: string;
  year: number;
  source: AccountingCorrectionSource;
  status: AccountingCorrectionStatus;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  detail: string;
  recommendedAction: string;
  ownerUserId?: string | null;
  ownerEmail?: string | null;
  evidenceReference?: string | null;
}

export interface RecordAccountingEvidenceAttachmentRequestDto {
  period: string;
  year: number;
  attachmentType:
    | 'pdf'
    | 'xml'
    | 'ride'
    | 'bank_statement'
    | 'report'
    | 'accountant_note'
    | 'other';
  source: string;
  label: string;
  reference: string;
  ownerUserId?: string | null;
  ownerEmail?: string | null;
  status: AccountingEvidenceAttachmentStatus;
  hash?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface RecordAccountingExternalCloseoutRecordRequestDto {
  period: string;
  year: number;
  status: AccountingExternalCloseoutStatus;
  accountantName: string;
  accountantEmail?: string | null;
  confirmedByUserId?: string | null;
  confirmedByEmail?: string | null;
  confirmedAt?: string | Date | null;
  evidenceReference?: string | null;
  notes?: string | null;
}

export interface AccountingCorrectionResponseDto
  extends TenantAccountingCorrectionView {}

export interface AccountingCorrectionsQueueResponseDto
  extends TenantAccountingCorrectionsQueueView {}

export interface AccountingEvidenceAttachmentResponseDto
  extends TenantAccountingEvidenceAttachmentView {}

export interface AccountingEvidenceAttachmentRegistryResponseDto
  extends TenantAccountingEvidenceAttachmentRegistryView {}

export interface AccountingAdjustmentRecommendationPacketResponseDto
  extends TenantAccountingAdjustmentRecommendationPacketView {}

export interface AccountingPeriodNarrativeReportResponseDto
  extends TenantAccountingPeriodNarrativeReportView {}

export interface AccountingAiReviewAssistantPacketResponseDto
  extends TenantAccountingAiReviewAssistantPacketView {}

export interface AccountingProfessionalCloseoutWorkspaceResponseDto
  extends TenantAccountingProfessionalCloseoutWorkspaceView {}

export interface AccountingExternalCloseoutRecordResponseDto
  extends TenantAccountingExternalCloseoutRecordView {}

export interface AccountingProfessionalCloseoutArtifactPacketResponseDto
  extends TenantAccountingProfessionalCloseoutArtifactPacketView {}

export interface AccountingPeriodCloseoutTimelineResponseDto
  extends TenantAccountingPeriodCloseoutTimelineView {}

export interface AccountingLegalBooksReadinessPacketResponseDto
  extends TenantAccountingLegalBooksReadinessPacketView {}

export interface AccountingFinancialStatementFinalReviewPacketResponseDto
  extends TenantAccountingFinancialStatementFinalReviewPacketView {}

export interface AccountingFoundationCloseoutSummaryResponseDto
  extends TenantAccountingFoundationCloseoutSummaryView {}

export function toAccountingCorrectionResponseDto(
  view: TenantAccountingCorrectionView,
): AccountingCorrectionResponseDto {
  return view;
}

export function toAccountingCorrectionsQueueResponseDto(
  view: TenantAccountingCorrectionsQueueView,
): AccountingCorrectionsQueueResponseDto {
  return view;
}

export function toAccountingEvidenceAttachmentResponseDto(
  view: TenantAccountingEvidenceAttachmentView,
): AccountingEvidenceAttachmentResponseDto {
  return view;
}

export function toAccountingEvidenceAttachmentRegistryResponseDto(
  view: TenantAccountingEvidenceAttachmentRegistryView,
): AccountingEvidenceAttachmentRegistryResponseDto {
  return view;
}

export function toAccountingAdjustmentRecommendationPacketResponseDto(
  view: TenantAccountingAdjustmentRecommendationPacketView,
): AccountingAdjustmentRecommendationPacketResponseDto {
  return view;
}

export function toAccountingPeriodNarrativeReportResponseDto(
  view: TenantAccountingPeriodNarrativeReportView,
): AccountingPeriodNarrativeReportResponseDto {
  return view;
}

export function toAccountingAiReviewAssistantPacketResponseDto(
  view: TenantAccountingAiReviewAssistantPacketView,
): AccountingAiReviewAssistantPacketResponseDto {
  return view;
}

export function toAccountingProfessionalCloseoutWorkspaceResponseDto(
  view: TenantAccountingProfessionalCloseoutWorkspaceView,
): AccountingProfessionalCloseoutWorkspaceResponseDto {
  return view;
}

export function toAccountingExternalCloseoutRecordResponseDto(
  view: TenantAccountingExternalCloseoutRecordView,
): AccountingExternalCloseoutRecordResponseDto {
  return view;
}

export function toAccountingProfessionalCloseoutArtifactPacketResponseDto(
  view: TenantAccountingProfessionalCloseoutArtifactPacketView,
): AccountingProfessionalCloseoutArtifactPacketResponseDto {
  return view;
}

export function toAccountingPeriodCloseoutTimelineResponseDto(
  view: TenantAccountingPeriodCloseoutTimelineView,
): AccountingPeriodCloseoutTimelineResponseDto {
  return view;
}

export function toAccountingLegalBooksReadinessPacketResponseDto(
  view: TenantAccountingLegalBooksReadinessPacketView,
): AccountingLegalBooksReadinessPacketResponseDto {
  return view;
}

export function toAccountingFinancialStatementFinalReviewPacketResponseDto(
  view: TenantAccountingFinancialStatementFinalReviewPacketView,
): AccountingFinancialStatementFinalReviewPacketResponseDto {
  return view;
}

export function toAccountingFoundationCloseoutSummaryResponseDto(
  view: TenantAccountingFoundationCloseoutSummaryView,
): AccountingFoundationCloseoutSummaryResponseDto {
  return view;
}
