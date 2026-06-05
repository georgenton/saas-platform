import { TenantAccountingLedgerPreviewWorkspaceView } from '@saas-platform/accounting-domain';

export interface AccountingLedgerPreviewWorkspaceResponseDto {
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
    sourceDraftEntryKeys: string[];
  }>;
  summary: {
    accountCount: number;
    draftEntryCount: number;
    approvedPreviewEntryCount: number;
    unreviewedDraftEntryCount: number;
    totalDebitInCents: number;
    totalCreditInCents: number;
    balanced: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingLedgerPreviewWorkspaceResponseDto(
  view: TenantAccountingLedgerPreviewWorkspaceView,
): AccountingLedgerPreviewWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    readinessStatus: view.readinessStatus,
    ledgerStatus: view.ledgerStatus,
    accountBalances: view.accountBalances.map((account) => ({
      ...account,
      sourceDraftEntryKeys: [...account.sourceDraftEntryKeys],
    })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
