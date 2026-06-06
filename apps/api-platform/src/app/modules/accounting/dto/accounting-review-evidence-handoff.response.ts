import {
  TenantAccountingAccountantHandoffWorkspaceView,
  TenantAccountingFinancialStatementReviewPacketView,
  TenantAccountingPeriodEvidenceVaultView,
} from '@saas-platform/accounting-domain';

export interface RequestAccountingFinancialStatementReviewPacketRequestDto {
  period: string;
  year: number;
  decision: 'prepare' | 'approve' | 'flag';
  reviewerUserId?: string | null;
  reviewerEmail?: string | null;
  note?: string | null;
  evidenceReference?: string | null;
}

export interface AccountingFinancialStatementReviewPacketResponseDto
  extends TenantAccountingFinancialStatementReviewPacketView {}

export interface AccountingPeriodEvidenceVaultResponseDto
  extends TenantAccountingPeriodEvidenceVaultView {}

export interface AccountingAccountantHandoffWorkspaceResponseDto
  extends TenantAccountingAccountantHandoffWorkspaceView {}

export function toAccountingFinancialStatementReviewPacketResponseDto(
  view: TenantAccountingFinancialStatementReviewPacketView,
): AccountingFinancialStatementReviewPacketResponseDto {
  return view;
}

export function toAccountingPeriodEvidenceVaultResponseDto(
  view: TenantAccountingPeriodEvidenceVaultView,
): AccountingPeriodEvidenceVaultResponseDto {
  return view;
}

export function toAccountingAccountantHandoffWorkspaceResponseDto(
  view: TenantAccountingAccountantHandoffWorkspaceView,
): AccountingAccountantHandoffWorkspaceResponseDto {
  return view;
}
