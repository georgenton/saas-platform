import {
  AccountingCorrectionSource,
  AccountingCorrectionStatus,
  AccountingEvidenceAttachmentStatus,
  TenantAccountingAdjustmentRecommendationPacketView,
  TenantAccountingAiReviewAssistantPacketView,
  TenantAccountingCorrectionView,
  TenantAccountingCorrectionsQueueView,
  TenantAccountingEvidenceAttachmentRegistryView,
  TenantAccountingEvidenceAttachmentView,
  TenantAccountingPeriodNarrativeReportView,
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
