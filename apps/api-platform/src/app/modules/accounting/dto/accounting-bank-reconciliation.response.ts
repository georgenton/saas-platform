import {
  TenantAccountingBankReconciliationWorkspaceView,
  TenantAccountingPeriodReconciliationReadinessView,
  TenantAccountingReconciliationMatchPacketView,
} from '@saas-platform/accounting-domain';

export interface RequestAccountingReconciliationMatchPacketRequestDto {
  period: string;
  year: number;
  candidateKeys?: string[];
  decision: 'prepare' | 'approve';
  reviewerUserId?: string | null;
  reviewerEmail?: string | null;
  note?: string | null;
}

export interface AccountingBankReconciliationWorkspaceResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  reconciliationStatus: string;
  bankAccounts: TenantAccountingBankReconciliationWorkspaceView['bankAccounts'];
  statementLines: Array<
    Omit<
      TenantAccountingBankReconciliationWorkspaceView['statementLines'][number],
      'postedAt'
    > & { postedAt: string }
  >;
  candidates: TenantAccountingBankReconciliationWorkspaceView['candidates'];
  summary: TenantAccountingBankReconciliationWorkspaceView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface AccountingReconciliationMatchPacketResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  packetStatus: string;
  decision: string;
  reviewerUserId: string | null;
  reviewerEmail: string | null;
  note: string | null;
  selectedCandidateKeys: string[];
  approvedCandidateKeys: string[];
  workspace: AccountingBankReconciliationWorkspaceResponseDto;
  approvalChecklist: TenantAccountingReconciliationMatchPacketView['approvalChecklist'];
  summary: TenantAccountingReconciliationMatchPacketView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface AccountingPeriodReconciliationReadinessResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  checks: TenantAccountingPeriodReconciliationReadinessView['checks'];
  workspace: AccountingBankReconciliationWorkspaceResponseDto;
  summary: TenantAccountingPeriodReconciliationReadinessView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingBankReconciliationWorkspaceResponseDto(
  view: TenantAccountingBankReconciliationWorkspaceView,
): AccountingBankReconciliationWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    readinessStatus: view.readinessStatus,
    reconciliationStatus: view.reconciliationStatus,
    bankAccounts: view.bankAccounts.map((account) => ({
      ...account,
      sourceJournalEntryIds: [...account.sourceJournalEntryIds],
    })),
    statementLines: view.statementLines.map((line) => ({
      ...line,
      postedAt: line.postedAt.toISOString(),
    })),
    candidates: view.candidates.map((candidate) => ({ ...candidate })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toAccountingReconciliationMatchPacketResponseDto(
  view: TenantAccountingReconciliationMatchPacketView,
): AccountingReconciliationMatchPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    packetStatus: view.packetStatus,
    decision: view.decision,
    reviewerUserId: view.reviewerUserId,
    reviewerEmail: view.reviewerEmail,
    note: view.note,
    selectedCandidateKeys: [...view.selectedCandidateKeys],
    approvedCandidateKeys: [...view.approvedCandidateKeys],
    workspace: toAccountingBankReconciliationWorkspaceResponseDto(
      view.workspace,
    ),
    approvalChecklist: view.approvalChecklist.map((check) => ({ ...check })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toAccountingPeriodReconciliationReadinessResponseDto(
  view: TenantAccountingPeriodReconciliationReadinessView,
): AccountingPeriodReconciliationReadinessResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    readinessStatus: view.readinessStatus,
    checks: view.checks.map((check) => ({ ...check })),
    workspace: toAccountingBankReconciliationWorkspaceResponseDto(
      view.workspace,
    ),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
