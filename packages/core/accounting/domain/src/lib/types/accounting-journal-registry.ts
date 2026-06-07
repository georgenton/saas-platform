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

export interface TenantAccountingBankReconciliationWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: AccountingReadinessStatus;
  reconciliationStatus: 'ready_for_review' | 'needs_review' | 'blocked';
  bankAccounts: Array<{
    accountKey: string;
    accountCode: string;
    accountName: string;
    currency: string;
    ledgerBalanceInCents: number;
    statementBalanceInCents: number;
    differenceInCents: number;
    sourceJournalEntryIds: string[];
  }>;
  statementLines: Array<{
    lineKey: string;
    accountKey: string;
    postedAt: Date;
    description: string;
    direction: 'inflow' | 'outflow';
    amountInCents: number;
    currency: string;
    reference: string;
    sourceJournalEntryId: string | null;
  }>;
  candidates: Array<{
    candidateKey: string;
    statementLineKey: string;
    journalEntryId: string | null;
    accountCode: string;
    accountName: string;
    matchStatus: 'exact_match' | 'needs_review' | 'unmatched';
    confidence: number;
    amountInCents: number;
    differenceInCents: number;
    rationale: string;
  }>;
  summary: {
    bankAccountCount: number;
    statementLineCount: number;
    candidateCount: number;
    exactMatchCount: number;
    needsReviewCount: number;
    unmatchedCount: number;
    totalStatementAmountInCents: number;
    totalLedgerBankAmountInCents: number;
    totalDifferenceInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingOpeningBalanceWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: AccountingReadinessStatus;
  openingBalanceStatus: 'ready_for_review' | 'needs_opening_review' | 'blocked';
  previousPeriod: string;
  balanceLines: Array<{
    lineKey: string;
    accountCode: string;
    accountName: string;
    category: AccountingAccountCategory;
    debitInCents: number;
    creditInCents: number;
    source:
      | 'current_ledger_baseline'
      | 'chart_account_placeholder'
      | 'manual_required';
    reviewStatus: AccountingReadinessStatus;
    sourceJournalEntryIds: string[];
    notes: string[];
  }>;
  suggestedAdjustment: {
    adjustmentKey: string;
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
  } | null;
  summary: {
    lineCount: number;
    readyLineCount: number;
    needsReviewLineCount: number;
    blockedLineCount: number;
    totalDebitInCents: number;
    totalCreditInCents: number;
    balanced: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingBankStatementLineView {
  id: string;
  batchId: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  accountKey: string;
  accountCode: string;
  accountName: string;
  postedAt: Date;
  description: string;
  direction: 'inflow' | 'outflow';
  amountInCents: number;
  currency: string;
  reference: string;
  externalLineId: string | null;
  raw: Record<string, string | number | boolean | null>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantAccountingBankStatementBatchView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  source: 'manual' | 'json' | 'csv';
  status: 'recorded' | 'blocked';
  importedByUserId: string | null;
  importedByEmail: string | null;
  importedAt: Date;
  originalFileName: string | null;
  notes: string | null;
  lineCount: number;
  totalInflowInCents: number;
  totalOutflowInCents: number;
  blockers: string[];
  lines: TenantAccountingBankStatementLineView[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantAccountingBankStatementImportWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  importStatus: 'ready_to_record' | 'needs_review' | 'blocked';
  source: 'manual' | 'json' | 'csv';
  originalFileName: string | null;
  previewLines: Array<{
    lineKey: string;
    accountKey: string;
    accountCode: string;
    accountName: string;
    postedAt: Date | null;
    description: string;
    direction: 'inflow' | 'outflow' | 'unknown';
    amountInCents: number;
    currency: string;
    reference: string;
    externalLineId: string | null;
    validationStatus: AccountingReadinessStatus;
    blockers: string[];
  }>;
  summary: {
    lineCount: number;
    validLineCount: number;
    blockedLineCount: number;
    totalInflowInCents: number;
    totalOutflowInCents: number;
    currencyCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingBankStatementImportResultView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  recordStatus: 'recorded' | 'blocked';
  batch: TenantAccountingBankStatementBatchView | null;
  preview: TenantAccountingBankStatementImportWorkspaceView;
  summary: {
    requestedLineCount: number;
    recordedLineCount: number;
    totalInflowInCents: number;
    totalOutflowInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingBankStatementRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: 'ready' | 'empty' | 'needs_review';
  batches: TenantAccountingBankStatementBatchView[];
  lines: TenantAccountingBankStatementLineView[];
  summary: {
    batchCount: number;
    lineCount: number;
    totalInflowInCents: number;
    totalOutflowInCents: number;
    blockedBatchCount: number;
    currencyCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingReconciliationMatchPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packetStatus: 'ready_for_approval' | 'approved' | 'blocked';
  decision: 'prepare' | 'approve';
  reviewerUserId: string | null;
  reviewerEmail: string | null;
  note: string | null;
  selectedCandidateKeys: string[];
  approvedCandidateKeys: string[];
  workspace: TenantAccountingBankReconciliationWorkspaceView;
  approvalChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    detail: string;
  }>;
  summary: {
    selectedCandidateCount: number;
    approvedCandidateCount: number;
    exactMatchCount: number;
    needsReviewCount: number;
    approvedAmountInCents: number;
    remainingDifferenceInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingReconciliationExceptionPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  exceptionStatus: 'ready_for_review' | 'blocked' | 'empty';
  workspace: TenantAccountingBankReconciliationWorkspaceView;
  exceptions: Array<{
    exceptionKey: string;
    exceptionType:
      | 'bank_line_without_journal'
      | 'journal_without_bank_line'
      | 'amount_difference'
      | 'account_mismatch';
    severity: 'info' | 'warning' | 'critical';
    statementLineKey: string | null;
    journalEntryId: string | null;
    amountInCents: number;
    differenceInCents: number;
    recommendation:
      | 'create_adjustment'
      | 'review_bank_statement'
      | 'review_journal'
      | 'mark_timing_difference';
    rationale: string;
  }>;
  summary: {
    exceptionCount: number;
    criticalCount: number;
    warningCount: number;
    bankLineWithoutJournalCount: number;
    journalWithoutBankLineCount: number;
    totalDifferenceInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export type AccountingBankReconciliationControlEventType =
  | 'match_packet_approved'
  | 'exception_packet_requested'
  | 'exception_resolution_prepared'
  | 'exception_resolved';

export type AccountingBankReconciliationControlStatus =
  | 'recorded'
  | 'resolved'
  | 'needs_review'
  | 'blocked';

export interface TenantAccountingBankReconciliationControlView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  eventType: AccountingBankReconciliationControlEventType;
  status: AccountingBankReconciliationControlStatus;
  source: string;
  actorUserId: string | null;
  actorEmail: string | null;
  occurredAt: Date;
  reason: string | null;
  evidenceReference: string | null;
  payload: Record<string, string | number | boolean | null>;
  blockers: string[];
  impactChecklist: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantAccountingBankReconciliationControlRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: 'ready' | 'empty' | 'needs_review' | 'blocked';
  controls: TenantAccountingBankReconciliationControlView[];
  latestControl: TenantAccountingBankReconciliationControlView | null;
  summary: {
    controlCount: number;
    matchApprovedCount: number;
    exceptionPacketCount: number;
    exceptionResolvedCount: number;
    blockedControlCount: number;
    needsReviewControlCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingReconciliationExceptionResolutionPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  resolutionStatus: 'ready_to_resolve' | 'resolved' | 'blocked';
  decision: 'prepare' | 'resolve';
  resolutionType:
    | 'create_adjustment_recommended'
    | 'mark_timing_difference'
    | 'mark_external_bank_issue'
    | 'mark_journal_review_required';
  exceptionKeys: string[];
  resolvedExceptionKeys: string[];
  exceptionPacket: TenantAccountingReconciliationExceptionPacketView;
  control: TenantAccountingBankReconciliationControlView | null;
  impactChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    detail: string;
  }>;
  summary: {
    requestedExceptionCount: number;
    resolvedExceptionCount: number;
    unresolvedExceptionCount: number;
    totalDifferenceInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingPeriodCashCloseoutReadinessView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: 'ready_for_lock' | 'needs_review' | 'blocked';
  checks: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    detail: string;
    blockerCount: number;
  }>;
  statementRegistry: TenantAccountingBankStatementRegistryView;
  reconciliationWorkspace: TenantAccountingBankReconciliationWorkspaceView;
  controlRegistry: TenantAccountingBankReconciliationControlRegistryView;
  exceptionPacket: TenantAccountingReconciliationExceptionPacketView;
  summary: {
    checkCount: number;
    readyCheckCount: number;
    needsReviewCheckCount: number;
    blockedCheckCount: number;
    statementLineCount: number;
    exactMatchCount: number;
    exceptionCount: number;
    resolvedExceptionCount: number;
    totalDifferenceInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingPeriodReconciliationReadinessView {
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
  workspace: TenantAccountingBankReconciliationWorkspaceView;
  summary: {
    checkCount: number;
    readyCheckCount: number;
    needsReviewCheckCount: number;
    blockedCheckCount: number;
    bankAccountCount: number;
    exactMatchCount: number;
    unmatchedCount: number;
    totalDifferenceInCents: number;
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

export interface TenantAccountingFinancialStatementReviewPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  reviewStatus: 'ready_for_approval' | 'approved' | 'flagged' | 'blocked';
  decision: 'prepare' | 'approve' | 'flag';
  reviewerUserId: string | null;
  reviewerEmail: string | null;
  note: string | null;
  evidenceReference: string | null;
  preview: TenantAccountingFinancialStatementPreviewView;
  closeoutReport: TenantAccountingPeriodCloseoutReportView;
  reviewChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    detail: string;
  }>;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    netIncomeInCents: number;
    balanceSheetBalanced: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingPeriodEvidenceVaultView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  vaultStatus: 'ready' | 'needs_review' | 'blocked';
  artifacts: Array<{
    key: string;
    label: string;
    artifactType:
      | 'registry'
      | 'workspace'
      | 'packet'
      | 'report'
      | 'control'
      | 'preview';
    status: AccountingReadinessStatus;
    reference: string;
    metricCount: number;
    blockerCount: number;
  }>;
  journalRegistry: TenantAccountingJournalRegistryView;
  ledgerRegistry: TenantAccountingLedgerRegistryWorkspaceView;
  trialBalance: TenantAccountingTrialBalanceWorkspaceView;
  closeoutReport: TenantAccountingPeriodCloseoutReportView;
  financialPreview: TenantAccountingFinancialStatementPreviewView;
  bankStatementRegistry: TenantAccountingBankStatementRegistryView;
  bankControlRegistry: TenantAccountingBankReconciliationControlRegistryView;
  cashCloseoutReadiness: TenantAccountingPeriodCashCloseoutReadinessView;
  periodLockRegistry: TenantAccountingPeriodLockRegistryView;
  auditTrail: TenantAccountingAuditTrailWorkspaceView;
  summary: {
    artifactCount: number;
    readyArtifactCount: number;
    needsReviewArtifactCount: number;
    blockedArtifactCount: number;
    journalEntryCount: number;
    bankControlCount: number;
    auditEventCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAccountantHandoffWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  handoffStatus: 'ready_for_accountant' | 'needs_review' | 'blocked';
  executiveSummary: string;
  evidenceVault: TenantAccountingPeriodEvidenceVaultView;
  financialReviewPacket: TenantAccountingFinancialStatementReviewPacketView;
  riskFlags: Array<{
    key: string;
    severity: 'info' | 'warning' | 'critical';
    detail: string;
  }>;
  accountantQuestions: string[];
  recommendedActions: string[];
  summary: {
    evidenceArtifactCount: number;
    readyArtifactCount: number;
    riskFlagCount: number;
    criticalRiskFlagCount: number;
    accountantQuestionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export type AccountingAccountantReviewStatus =
  | 'requested'
  | 'in_review'
  | 'changes_requested'
  | 'approved'
  | 'rejected';

export interface TenantAccountingAccountantReviewView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  status: AccountingAccountantReviewStatus;
  requestedByUserId: string | null;
  requestedByEmail: string | null;
  summary: string;
  questions: string[];
  riskFlags: TenantAccountingAccountantHandoffWorkspaceView['riskFlags'];
  evidenceReferences: string[];
  transitionHistory: Array<{
    status: AccountingAccountantReviewStatus;
    transitionedAt: Date;
    transitionedByUserId: string | null;
    note: string | null;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantAccountingReviewResolutionPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  resolutionStatus:
    | 'ready_to_resolve'
    | 'needs_review'
    | 'blocked'
    | 'no_review_changes_requested';
  review: TenantAccountingAccountantReviewView | null;
  handoff: TenantAccountingAccountantHandoffWorkspaceView;
  recommendedActions: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    detail: string;
  }>;
  summary: {
    actionCount: number;
    readyActionCount: number;
    blockedActionCount: number;
    riskFlagCount: number;
    accountantQuestionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingCloseoutCertificationReadinessView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  certificationStatus:
    | 'ready_for_professional_closeout'
    | 'needs_review'
    | 'blocked';
  checks: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    detail: string;
    blockerCount: number;
  }>;
  latestAccountantReview: TenantAccountingAccountantReviewView | null;
  handoff: TenantAccountingAccountantHandoffWorkspaceView;
  resolutionPacket: TenantAccountingReviewResolutionPacketView;
  summary: {
    checkCount: number;
    readyCheckCount: number;
    needsReviewCheckCount: number;
    blockedCheckCount: number;
    accountantReviewCount: number;
    unresolvedResolutionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export type AccountingCorrectionStatus =
  | 'open'
  | 'in_progress'
  | 'resolved'
  | 'dismissed';

export type AccountingCorrectionSource =
  | 'accountant_review'
  | 'review_resolution'
  | 'cash_closeout'
  | 'financial_review'
  | 'audit_trail'
  | 'certification_readiness';

export interface TenantAccountingCorrectionView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  source: AccountingCorrectionSource;
  status: AccountingCorrectionStatus;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  detail: string;
  recommendedAction: string;
  ownerUserId: string | null;
  ownerEmail: string | null;
  evidenceReference: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantAccountingCorrectionsQueueView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  queueStatus: 'empty' | 'ready' | 'needs_review' | 'blocked';
  corrections: TenantAccountingCorrectionView[];
  summary: {
    correctionCount: number;
    openCount: number;
    inProgressCount: number;
    resolvedCount: number;
    dismissedCount: number;
    criticalCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdjustmentRecommendationPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  recommendationStatus:
    | 'ready_for_review'
    | 'needs_corrections'
    | 'blocked'
    | 'empty';
  correctionsQueue: TenantAccountingCorrectionsQueueView;
  recommendedAdjustments: Array<{
    key: string;
    adjustmentType:
      | 'reclassification'
      | 'rounding'
      | 'accrual'
      | 'manual_adjustment';
    label: string;
    rationale: string;
    suggestedLines: Array<{
      accountCode: string;
      accountName: string;
      debitInCents: number;
      creditInCents: number;
      notes: string[];
    }>;
    sourceCorrectionIds: string[];
  }>;
  summary: {
    recommendationCount: number;
    sourceCorrectionCount: number;
    criticalCorrectionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export type AccountingEvidenceAttachmentStatus =
  | 'draft'
  | 'ready'
  | 'needs_review'
  | 'archived';

export interface TenantAccountingEvidenceAttachmentView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  attachmentType:
    | 'pdf'
    | 'xml'
    | 'ride'
    | 'bank_statement'
    | 'report'
    | 'accountant_note'
    | 'other';
  source: string;
  label: string;
  reference: string;
  ownerUserId: string | null;
  ownerEmail: string | null;
  status: AccountingEvidenceAttachmentStatus;
  hash: string | null;
  metadata: Record<string, string | number | boolean | null>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantAccountingEvidenceAttachmentRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: 'empty' | 'ready' | 'needs_review';
  attachments: TenantAccountingEvidenceAttachmentView[];
  evidenceVault: TenantAccountingPeriodEvidenceVaultView;
  summary: {
    attachmentCount: number;
    readyAttachmentCount: number;
    needsReviewAttachmentCount: number;
    archivedAttachmentCount: number;
    vaultArtifactCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingPeriodNarrativeReportView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  reportStatus: 'ready' | 'needs_review' | 'blocked';
  headline: string;
  sections: Array<{
    key: string;
    title: string;
    status: AccountingReadinessStatus;
    narrative: string;
    metrics: Array<{
      key: string;
      label: string;
      value: string | number | boolean | null;
    }>;
  }>;
  summary: {
    sectionCount: number;
    readySectionCount: number;
    riskFlagCount: number;
    correctionCount: number;
    attachmentCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAiReviewAssistantPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  assistantStatus: 'ready' | 'needs_review' | 'blocked';
  explanation: string;
  checklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    detail: string;
  }>;
  draftedResponses: Array<{
    question: string;
    draftResponse: string;
    source: string;
  }>;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    draftedResponseCount: number;
    blockerCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingProfessionalCloseoutWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  workspaceStatus:
    | 'draft'
    | 'ready_for_accountant'
    | 'changes_requested'
    | 'ready_for_closeout'
    | 'closed_externally';
  certificationReadiness: TenantAccountingCloseoutCertificationReadinessView;
  correctionsQueue: TenantAccountingCorrectionsQueueView;
  adjustmentRecommendationPacket: TenantAccountingAdjustmentRecommendationPacketView;
  evidenceAttachmentRegistry: TenantAccountingEvidenceAttachmentRegistryView;
  narrativeReport: TenantAccountingPeriodNarrativeReportView;
  aiReviewAssistantPacket: TenantAccountingAiReviewAssistantPacketView;
  summary: {
    correctionCount: number;
    attachmentCount: number;
    recommendationCount: number;
    certificationReady: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export type AccountingExternalCloseoutStatus =
  | 'draft'
  | 'confirmed_by_accountant'
  | 'rejected'
  | 'voided';

export interface TenantAccountingExternalCloseoutRecordView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  status: AccountingExternalCloseoutStatus;
  accountantName: string;
  accountantEmail: string | null;
  confirmedByUserId: string | null;
  confirmedByEmail: string | null;
  confirmedAt: Date | null;
  evidenceReference: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantAccountingProfessionalCloseoutArtifactPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packetStatus: 'draft' | 'ready_for_share' | 'closed_externally' | 'blocked';
  workspace: TenantAccountingProfessionalCloseoutWorkspaceView;
  externalCloseoutRecord: TenantAccountingExternalCloseoutRecordView | null;
  artifactSections: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    reference: string | null;
    detail: string;
  }>;
  summary: {
    sectionCount: number;
    readySectionCount: number;
    evidenceAttachmentCount: number;
    correctionCount: number;
    externalCloseoutRecorded: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingPeriodCloseoutTimelineView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  timelineStatus: 'empty' | 'ready' | 'needs_review';
  events: Array<{
    eventKey: string;
    eventType: string;
    source: string;
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
    correctionEventCount: number;
    evidenceEventCount: number;
    externalCloseoutEventCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingLegalBooksReadinessPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus:
    | 'ready_for_legal_book_preparation'
    | 'needs_review'
    | 'blocked';
  checks: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    detail: string;
  }>;
  externalCloseoutRecord: TenantAccountingExternalCloseoutRecordView | null;
  summary: {
    checkCount: number;
    readyCheckCount: number;
    blockedCheckCount: number;
    externalCloseoutRecorded: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingFinancialStatementFinalReviewPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  reviewStatus: 'ready_for_final_review' | 'needs_review' | 'blocked';
  financialStatementPreview: TenantAccountingFinancialStatementPreviewView;
  professionalCloseoutWorkspace: TenantAccountingProfessionalCloseoutWorkspaceView;
  externalCloseoutRecord: TenantAccountingExternalCloseoutRecordView | null;
  checklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    detail: string;
  }>;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    correctionCount: number;
    netIncomeInCents: number;
    externalCloseoutRecorded: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingFoundationCloseoutSummaryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  summaryStatus: 'foundation_complete' | 'needs_review' | 'blocked';
  professionalCloseoutWorkspace: TenantAccountingProfessionalCloseoutWorkspaceView;
  legalBooksReadiness: TenantAccountingLegalBooksReadinessPacketView;
  financialStatementFinalReview: TenantAccountingFinancialStatementFinalReviewPacketView;
  closeoutTimeline: TenantAccountingPeriodCloseoutTimelineView;
  completedScope: string[];
  advancedAccountingBacklog: string[];
  recommendedNextProduct:
    | 'tax_compliance_deeper'
    | 'parties_2_0'
    | 'accounting_advanced';
  summary: {
    completedScopeCount: number;
    backlogItemCount: number;
    timelineEventCount: number;
    legalBooksReady: boolean;
    finalReviewReady: boolean;
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

export interface TenantAccountingOpeningBalanceApprovalPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  approvalStatus:
    | 'ready_for_approval'
    | 'approved'
    | 'needs_review'
    | 'blocked';
  decision: 'prepare' | 'approve' | 'reject';
  reviewerUserId: string | null;
  reviewerEmail: string | null;
  note: string | null;
  evidenceReference: string | null;
  workspace: TenantAccountingOpeningBalanceWorkspaceView;
  approvedLineKeys: string[];
  rejectedLineKeys: string[];
  checklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    detail: string;
  }>;
  summary: {
    lineCount: number;
    approvedLineCount: number;
    rejectedLineCount: number;
    blockedLineCount: number;
    totalDebitInCents: number;
    totalCreditInCents: number;
    balanced: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingOpeningBalanceControlRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: 'ready' | 'empty' | 'needs_review' | 'blocked';
  latestControl: {
    controlKey: string;
    eventType:
      | 'approval_prepared'
      | 'approval_approved'
      | 'approval_rejected'
      | 'journal_materialized';
    status: AccountingReadinessStatus;
    actorEmail: string | null;
    occurredAt: Date;
    evidenceReference: string | null;
    summary: string;
  } | null;
  controls: Array<{
    controlKey: string;
    eventType:
      | 'approval_prepared'
      | 'approval_approved'
      | 'approval_rejected'
      | 'journal_materialized';
    status: AccountingReadinessStatus;
    actorEmail: string | null;
    occurredAt: Date;
    evidenceReference: string | null;
    summary: string;
  }>;
  approvalPacket: TenantAccountingOpeningBalanceApprovalPacketView;
  materializedJournalEntries: TenantAccountingJournalEntryView[];
  summary: {
    controlCount: number;
    approvedControlCount: number;
    materializedEntryCount: number;
    openingLineCount: number;
    blockedLineCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingOpeningBalanceJournalMaterializationView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  materializationStatus: 'created' | 'already_materialized' | 'blocked';
  approvalPacket: TenantAccountingOpeningBalanceApprovalPacketView;
  createdEntry: TenantAccountingJournalEntryView | null;
  existingEntries: TenantAccountingJournalEntryView[];
  summary: {
    createdEntryCount: number;
    existingEntryCount: number;
    lineCount: number;
    totalDebitInCents: number;
    totalCreditInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingBankAccountRegistryWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: 'ready' | 'empty' | 'needs_review' | 'blocked';
  accounts: Array<{
    accountKey: string;
    accountCode: string;
    accountName: string;
    bankName: string | null;
    alias: string;
    currency: string;
    isPrimary: boolean;
    status: 'active' | 'needs_review' | 'inactive';
    source: 'ledger_registry' | 'bank_statement' | 'opening_balance';
    ledgerBalanceInCents: number;
    statementLineCount: number;
    notes: string[];
  }>;
  summary: {
    accountCount: number;
    activeAccountCount: number;
    needsReviewAccountCount: number;
    primaryAccountCount: number;
    statementLinkedAccountCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingBankStatementImportProfileWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  profileStatus: 'ready' | 'needs_review' | 'blocked';
  profiles: Array<{
    profileKey: string;
    label: string;
    source: 'manual' | 'json' | 'csv';
    delimiter: string | null;
    dateFormat: string;
    columnMapping: Record<string, string>;
    validationStatus: AccountingReadinessStatus;
    duplicatePolicy: 'external_line_id' | 'reference_amount_date';
    notes: string[];
  }>;
  recommendedProfileKey: string | null;
  preview: TenantAccountingBankStatementImportWorkspaceView;
  summary: {
    profileCount: number;
    readyProfileCount: number;
    blockedProfileCount: number;
    previewLineCount: number;
    duplicateCandidateCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingOperationalCommandCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  commandStatus: 'ready' | 'needs_review' | 'blocked';
  lanes: Array<{
    laneKey: string;
    label: string;
    status: AccountingReadinessStatus;
    blockerCount: number;
    primaryMetric: string;
    nextAction: string;
  }>;
  openingBalance: TenantAccountingOpeningBalanceControlRegistryView;
  bankAccounts: TenantAccountingBankAccountRegistryWorkspaceView;
  importProfiles: TenantAccountingBankStatementImportProfileWorkspaceView;
  bankReconciliation: TenantAccountingBankReconciliationWorkspaceView;
  closeoutCertification: TenantAccountingCloseoutCertificationReadinessView;
  financialPreview: TenantAccountingFinancialStatementPreviewView;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    needsReviewLaneCount: number;
    blockedLaneCount: number;
    blockerCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingFoundationCloseoutPackV2View {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: 'foundation_complete' | 'needs_review' | 'blocked';
  foundationSummary: TenantAccountingFoundationCloseoutSummaryView;
  commandCenter: TenantAccountingOperationalCommandCenterView;
  completedCapabilities: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidence: string[];
  }>;
  productBoundary: {
    currentProduct: 'accounting_foundation';
    nextRecommendedProduct: 'tax_compliance_ec';
    advancedAccountingTriggers: string[];
  };
  summary: {
    capabilityCount: number;
    readyCapabilityCount: number;
    blockerCount: number;
    advancedBacklogCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingTaxComplianceFeedbackBridgeView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  bridgeStatus: 'usable_for_tax' | 'needs_accountant_review' | 'blocked';
  closeoutPack: TenantAccountingFoundationCloseoutPackV2View;
  feedbackSignals: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    taxUse:
      | 'declaration_evidence'
      | 'annex_review'
      | 'accountant_handoff'
      | 'period_guardrail';
    detail: string;
  }>;
  summary: {
    signalCount: number;
    usableSignalCount: number;
    needsReviewSignalCount: number;
    blockedSignalCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingTaxDeclarationEvidenceBridgeView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  evidenceStatus: AccountingReadinessStatus;
  feedbackBridge: TenantAccountingTaxComplianceFeedbackBridgeView;
  evidenceLines: Array<{
    lineKey: string;
    label: string;
    source: string;
    amountInCents: number;
    taxUse: 'vat' | 'income_tax' | 'withholding' | 'annex' | 'review_only';
    confidence: 'high' | 'medium' | 'review_required';
    notes: string[];
  }>;
  reconciliationHints: Array<{
    key: string;
    label: string;
    severity: 'normal' | 'high' | 'critical';
    detail: string;
  }>;
  summary: {
    evidenceLineCount: number;
    highConfidenceLineCount: number;
    reviewRequiredLineCount: number;
    totalRevenueInCents: number;
    totalExpenseInCents: number;
    totalTaxInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}
