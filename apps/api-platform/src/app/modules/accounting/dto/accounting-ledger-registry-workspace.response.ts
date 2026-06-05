import { TenantAccountingLedgerRegistryWorkspaceView } from '@saas-platform/accounting-domain';

export interface AccountingLedgerRegistryWorkspaceResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  ledgerStatus: string;
  accountBalances: Array<{
    accountCode: string;
    accountName: string;
    category: string;
    debitInCents: number;
    creditInCents: number;
    netDebitInCents: number;
    netCreditInCents: number;
    sourceJournalEntryIds: string[];
  }>;
  summary: {
    accountCount: number;
    journalEntryCount: number;
    approvedEntryCount: number;
    unapprovedEntryCount: number;
    totalDebitInCents: number;
    totalCreditInCents: number;
    balanced: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingLedgerRegistryWorkspaceResponseDto(
  view: TenantAccountingLedgerRegistryWorkspaceView,
): AccountingLedgerRegistryWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    readinessStatus: view.readinessStatus,
    ledgerStatus: view.ledgerStatus,
    accountBalances: view.accountBalances.map((account) => ({
      ...account,
      sourceJournalEntryIds: [...account.sourceJournalEntryIds],
    })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
