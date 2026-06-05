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

export interface TenantAccountingTrialBalanceWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: AccountingReadinessStatus;
  trialBalanceStatus: 'ready_for_review' | 'needs_ledger_review' | 'blocked';
  accounts: Array<{
    accountCode: string;
    accountName: string;
    category: AccountingAccountCategory;
    debitBalanceInCents: number;
    creditBalanceInCents: number;
    sourceJournalEntryIds: string[];
  }>;
  sections: Array<{
    category: AccountingAccountCategory;
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

export interface TenantAccountingPeriodCloseoutPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus:
    | 'approved_for_closeout'
    | 'needs_review'
    | 'blocked'
    | 'changes_requested';
  reviewerUserId: string | null;
  reviewerEmail: string | null;
  note: string | null;
  readiness: TenantAccountingPeriodCloseoutReadinessView;
  trialBalance: TenantAccountingTrialBalanceWorkspaceView;
  approvals: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
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

export interface TenantAccountingPeriodCloseoutReportView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  reportStatus: 'ready' | 'needs_review' | 'blocked';
  sections: Array<{
    key: string;
    title: string;
    status: AccountingReadinessStatus;
    metrics: Array<{
      key: string;
      label: string;
      value: string | number | boolean | null;
    }>;
    notes: string[];
  }>;
  summary: {
    sectionCount: number;
    readySectionCount: number;
    needsReviewSectionCount: number;
    blockedSectionCount: number;
    journalEntryCount: number;
    trialBalanceAccountCount: number;
    netIncomeInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingPeriodLockReadinessView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  lockReadinessStatus: 'ready_to_lock' | 'needs_review' | 'blocked';
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
    trialBalanceBalanced: boolean;
    closeoutReportStatus: string;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdjustingJournalEntryCreationResultView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  creationStatus: 'created' | 'blocked';
  createdEntry: TenantAccountingJournalEntryView | null;
  adjustmentType:
    | 'reclassification'
    | 'rounding'
    | 'accrual'
    | 'manual_adjustment';
  summary: {
    lineCount: number;
    totalDebitInCents: number;
    totalCreditInCents: number;
    balanced: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingFinancialStatementPreviewView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  previewStatus: 'ready_for_review' | 'needs_trial_balance_review' | 'blocked';
  incomeStatement: {
    revenueInCents: number;
    expenseInCents: number;
    taxExpenseInCents: number;
    netIncomeInCents: number;
    sections: Array<{
      key: string;
      label: string;
      amountInCents: number;
      accountCodes: string[];
    }>;
  };
  balanceSheet: {
    assetsInCents: number;
    liabilitiesInCents: number;
    equityInCents: number;
    retainedEarningsPreviewInCents: number;
    balanced: boolean;
    sections: Array<{
      key: string;
      label: string;
      amountInCents: number;
      accountCodes: string[];
    }>;
  };
  summary: {
    trialBalanceAccountCount: number;
    journalEntryCount: number;
    netIncomeInCents: number;
    balanceSheetBalanced: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export type AccountingPeriodControlStatus =
  | 'open'
  | 'ready_to_lock'
  | 'locked'
  | 'reopened';

export type AccountingPeriodControlAction =
  | 'lock_requested'
  | 'locked'
  | 'reopen_requested'
  | 'reopened';

export interface TenantAccountingPeriodControlView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  status: AccountingPeriodControlStatus;
  action: AccountingPeriodControlAction;
  actionByUserId: string | null;
  actionByEmail: string | null;
  actionAt: Date;
  reason: string | null;
  evidenceReference: string | null;
  blockers: string[];
  snapshot: {
    lockReadinessStatus?: string;
    closeoutReportStatus?: string;
    journalEntryCount?: number;
    trialBalanceBalanced?: boolean;
    financialPreviewStatus?: string;
  };
  impactChecklist: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantAccountingPeriodLockRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: AccountingPeriodControlStatus;
  latestControl: TenantAccountingPeriodControlView | null;
  controls: TenantAccountingPeriodControlView[];
  lockReadiness: TenantAccountingPeriodLockReadinessView;
  summary: {
    controlCount: number;
    lockCount: number;
    reopenCount: number;
    journalEntryCount: number;
    readyLockCheckCount: number;
    blockedLockCheckCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingPeriodLockResultView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  lockStatus: 'locked' | 'blocked';
  control: TenantAccountingPeriodControlView | null;
  registry: TenantAccountingPeriodLockRegistryView;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingPeriodReopenPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  reopenStatus: 'ready_to_reopen' | 'reopened' | 'blocked';
  control: TenantAccountingPeriodControlView | null;
  latestLock: TenantAccountingPeriodControlView | null;
  impactChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    detail: string;
  }>;
  summary: {
    impactCount: number;
    blockedImpactCount: number;
    journalEntryCount: number;
    latestStatus: AccountingPeriodControlStatus;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAuditTrailWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  auditStatus: 'ready' | 'empty' | 'needs_review';
  timeline: Array<{
    eventKey: string;
    eventType: string;
    source: 'journal_registry' | 'period_control';
    status: string;
    actorEmail: string | null;
    occurredAt: Date;
    summary: string;
    metadata: Record<string, string | number | boolean | null>;
  }>;
  summary: {
    eventCount: number;
    journalEventCount: number;
    controlEventCount: number;
    lockedCount: number;
    reopenedCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}
