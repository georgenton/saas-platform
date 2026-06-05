import { TenantAccountingJournalDraftPreviewView } from '@saas-platform/accounting-domain';

export interface AccountingJournalDraftPreviewResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  journalStatus: string;
  draftEntries: Array<{
    draftEntryKey: string;
    label: string;
    source: string;
    currency: string;
    lines: Array<{
      lineKey: string;
      accountCode: string | null;
      accountName: string | null;
      debitInCents: number;
      creditInCents: number;
      sourceEntryKey: string;
      accountHint: string;
      notes: string[];
    }>;
    totals: {
      debitInCents: number;
      creditInCents: number;
      balanced: boolean;
    };
    blockers: string[];
  }>;
  summary: {
    draftEntryCount: number;
    draftLineCount: number;
    balancedDraftCount: number;
    needsMappingDraftCount: number;
    totalDebitInCents: number;
    totalCreditInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingJournalDraftPreviewResponseDto(
  view: TenantAccountingJournalDraftPreviewView,
): AccountingJournalDraftPreviewResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    readinessStatus: view.readinessStatus,
    journalStatus: view.journalStatus,
    draftEntries: view.draftEntries.map((entry) => ({
      ...entry,
      lines: entry.lines.map((line) => ({
        ...line,
        notes: [...line.notes],
      })),
      totals: { ...entry.totals },
      blockers: [...entry.blockers],
    })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
