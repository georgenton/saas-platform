export type AccountingReadinessStatus = 'ready' | 'needs_review' | 'blocked';
export type AccountingAccountCategory =
  | 'asset'
  | 'liability'
  | 'equity'
  | 'income'
  | 'expense'
  | 'tax'
  | 'uncategorized';
export type AccountingAccountSource =
  | 'tax_bridge_mapping'
  | 'tax_bridge_suggestion'
  | 'accounting_seed';
export type AccountingJournalDraftStatus =
  | 'ready_for_review'
  | 'needs_mapping'
  | 'blocked';

export interface TenantAccountingChartOfAccountsWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: AccountingReadinessStatus;
  accounts: Array<{
    accountKey: string;
    code: string;
    name: string;
    category: AccountingAccountCategory;
    source: AccountingAccountSource;
    mappedAccountHint: string | null;
    status: 'mapped' | 'suggested' | 'needs_mapping';
    appliesToEntryKeys: string[];
    notes: string[];
  }>;
  summary: {
    accountCount: number;
    mappedAccountCount: number;
    suggestedAccountCount: number;
    needsMappingCount: number;
    sourceHintCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingJournalDraftPreviewView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: AccountingReadinessStatus;
  journalStatus: AccountingJournalDraftStatus;
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
