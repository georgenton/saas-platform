import { TenantAccountingTrialBalanceWorkspaceView } from '@saas-platform/accounting-domain';

export interface AccountingTrialBalanceWorkspaceResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  trialBalanceStatus: string;
  accounts: Array<{
    accountCode: string;
    accountName: string;
    category: string;
    debitBalanceInCents: number;
    creditBalanceInCents: number;
    sourceJournalEntryIds: string[];
  }>;
  sections: Array<{
    category: string;
    accountCount: number;
    debitBalanceInCents: number;
    creditBalanceInCents: number;
  }>;
  summary: {
    accountCount: number;
    journalEntryCount: number;
    totalDebitBalanceInCents: number;
    totalCreditBalanceInCents: number;
    balanced: boolean;
    netIncomeInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingTrialBalanceWorkspaceResponseDto(
  view: TenantAccountingTrialBalanceWorkspaceView,
): AccountingTrialBalanceWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    readinessStatus: view.readinessStatus,
    trialBalanceStatus: view.trialBalanceStatus,
    accounts: view.accounts.map((account) => ({
      ...account,
      sourceJournalEntryIds: [...account.sourceJournalEntryIds],
    })),
    sections: view.sections.map((section) => ({ ...section })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
