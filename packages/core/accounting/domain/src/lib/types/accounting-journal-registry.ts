import {
  AccountingAccountCategory,
  AccountingReadinessStatus,
} from './accounting-foundation';

export type AccountingJournalEntryStatus =
  | 'draft'
  | 'approved'
  | 'posted_preview'
  | 'voided';

export interface TenantAccountingJournalEntryView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  source: string;
  status: AccountingJournalEntryStatus;
  label: string;
  currency: string;
  lines: Array<{
    lineKey: string;
    accountCode: string;
    accountName: string;
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
  approvalStatus: string;
  approvedByUserId: string | null;
  approvedByEmail: string | null;
  approvedAt: Date | null;
  sourceDraftEntryKey: string | null;
  sourceApprovalPacketKey: string | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantAccountingJournalRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: 'ready' | 'empty' | 'needs_review';
  entries: TenantAccountingJournalEntryView[];
  summary: {
    entryCount: number;
    approvedEntryCount: number;
    postedPreviewEntryCount: number;
    voidedEntryCount: number;
    balancedEntryCount: number;
    totalDebitInCents: number;
    totalCreditInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingJournalEntryCreationResultView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  creationStatus: 'created' | 'blocked';
  createdEntries: TenantAccountingJournalEntryView[];
  approvalStatus: string;
  summary: {
    requestedDraftEntryCount: number;
    createdEntryCount: number;
    blockedDraftEntryCount: number;
    totalDebitInCents: number;
    totalCreditInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingLedgerRegistryWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: AccountingReadinessStatus;
  ledgerStatus: 'ready_for_review' | 'needs_journal_review' | 'blocked';
  accountBalances: Array<{
    accountCode: string;
    accountName: string;
    category: AccountingAccountCategory;
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

export interface TenantAccountingPeriodCloseoutReadinessView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: 'ready_for_closeout' | 'needs_review' | 'blocked';
  checks: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    detail: string;
    blockerCount: number;
  }>;
  summary: {
    checkCount: number;
    readyCheckCount: number;
    needsReviewCheckCount: number;
    blockedCheckCount: number;
    journalEntryCount: number;
    ledgerBalanced: boolean;
    taxCloseoutStatus: string | null;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}
