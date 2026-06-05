import { TenantAccountingPeriodCloseoutPacketView } from '@saas-platform/accounting-domain';
import {
  AccountingPeriodCloseoutReadinessResponseDto,
  toAccountingPeriodCloseoutReadinessResponseDto,
} from './accounting-period-closeout-readiness.response';
import {
  AccountingTrialBalanceWorkspaceResponseDto,
  toAccountingTrialBalanceWorkspaceResponseDto,
} from './accounting-trial-balance-workspace.response';

export interface RequestAccountingPeriodCloseoutPacketRequestDto {
  period: string;
  year: number;
  decision: 'approve' | 'request_changes';
  reviewerUserId?: string | null;
  reviewerEmail?: string | null;
  note?: string | null;
}

export interface AccountingPeriodCloseoutPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  closeoutStatus: string;
  reviewerUserId: string | null;
  reviewerEmail: string | null;
  note: string | null;
  readiness: AccountingPeriodCloseoutReadinessResponseDto;
  trialBalance: AccountingTrialBalanceWorkspaceResponseDto;
  approvals: Array<{
    key: string;
    label: string;
    status: string;
    detail: string;
  }>;
  summary: {
    readyApprovalCount: number;
    needsReviewApprovalCount: number;
    blockedApprovalCount: number;
    journalEntryCount: number;
    trialBalanceBalanced: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingPeriodCloseoutPacketResponseDto(
  view: TenantAccountingPeriodCloseoutPacketView,
): AccountingPeriodCloseoutPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    closeoutStatus: view.closeoutStatus,
    reviewerUserId: view.reviewerUserId,
    reviewerEmail: view.reviewerEmail,
    note: view.note,
    readiness: toAccountingPeriodCloseoutReadinessResponseDto(view.readiness),
    trialBalance: toAccountingTrialBalanceWorkspaceResponseDto(
      view.trialBalance,
    ),
    approvals: view.approvals.map((approval) => ({ ...approval })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
