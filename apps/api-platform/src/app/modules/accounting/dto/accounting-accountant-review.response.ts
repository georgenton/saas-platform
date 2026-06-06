import {
  TenantAccountingAccountantReviewView,
  TenantAccountingCloseoutCertificationReadinessView,
  TenantAccountingReviewResolutionPacketView,
} from '@saas-platform/accounting-domain';

export interface RequestAccountingAccountantReviewRequestDto {
  period: string;
  year: number;
  requestedByUserId?: string | null;
  requestedByEmail?: string | null;
}

export interface TransitionAccountingAccountantReviewRequestDto {
  status: 'requested' | 'in_review' | 'changes_requested' | 'approved' | 'rejected';
  transitionedByUserId?: string | null;
  note?: string | null;
}

export interface RequestAccountingReviewResolutionPacketRequestDto {
  period: string;
  year: number;
  reviewId?: string | null;
}

export interface AccountingAccountantReviewResponseDto
  extends TenantAccountingAccountantReviewView {}

export interface AccountingReviewResolutionPacketResponseDto
  extends TenantAccountingReviewResolutionPacketView {}

export interface AccountingCloseoutCertificationReadinessResponseDto
  extends TenantAccountingCloseoutCertificationReadinessView {}

export function toAccountingAccountantReviewResponseDto(
  view: TenantAccountingAccountantReviewView,
): AccountingAccountantReviewResponseDto {
  return view;
}

export function toAccountingReviewResolutionPacketResponseDto(
  view: TenantAccountingReviewResolutionPacketView,
): AccountingReviewResolutionPacketResponseDto {
  return view;
}

export function toAccountingCloseoutCertificationReadinessResponseDto(
  view: TenantAccountingCloseoutCertificationReadinessView,
): AccountingCloseoutCertificationReadinessResponseDto {
  return view;
}
