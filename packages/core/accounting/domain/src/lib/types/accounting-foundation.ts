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
export type AccountingJournalApprovalStatus =
  | 'approved_for_posting'
  | 'rejected'
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

export interface TenantAccountingChartMappingManagementView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: AccountingReadinessStatus;
  mappingStatus: 'ready' | 'needs_mapping' | 'blocked';
  updatedMappingCount: number;
  chartWorkspace: TenantAccountingChartOfAccountsWorkspaceView;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingJournalDraftApprovalPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  approvalStatus: AccountingJournalApprovalStatus;
  reviewerUserId: string | null;
  reviewerEmail: string | null;
  note: string | null;
  approvedDraftEntryKeys: string[];
  rejectedDraftEntryKeys: string[];
  draftEntries: TenantAccountingJournalDraftPreviewView['draftEntries'];
  summary: {
    requestedDraftEntryCount: number;
    approvedDraftEntryCount: number;
    rejectedDraftEntryCount: number;
    blockedDraftEntryCount: number;
    balancedDraftCount: number;
    totalDebitInCents: number;
    totalCreditInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingLedgerPreviewWorkspaceView {
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

export type AccountingAdvancedDiscoverySource =
  | 'tax_pilot_decision_v73'
  | 'accounting_foundation';
export type AccountingAdvancedDiscoveryIntakeSource =
  | 'tax_decision_closeout'
  | 'accountant_decision_record'
  | 'discovery_dossier';
export type AccountingAdvancedNeedType =
  | 'formal_books'
  | 'bank_reconciliation'
  | 'journal_adjustments'
  | 'period_closeout'
  | 'audit_trail'
  | 'tax_only';
export type AccountingAdvancedDiscoveryRecommendation =
  | 'do_not_open'
  | 'prepare_mvp'
  | 'return_to_tax_hardening';
export type AccountingAdvancedDiscoveryMinimumScope =
  | 'none'
  | 'bank_reconciliation'
  | 'ledger_closeout'
  | 'audit_trail';
export type AccountingAdvancedDiscoveryFinalDecision =
  | 'stay_in_tax_compliance'
  | 'prepare_accounting_advanced_mvp'
  | 'return_to_tax_hardening';

export interface TenantAccountingAdvancedDiscoveryAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  source: AccountingAdvancedDiscoverySource;
  boundaries: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    guardrail: string;
  }>;
  triggers: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
    rationale: string;
  }>;
  summary: {
    boundaryCount: number;
    triggerCount: number;
    blockedTriggerCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedDiscoveryIntakeView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  intakeStatus: AccountingReadinessStatus;
  anchor: TenantAccountingAdvancedDiscoveryAnchorView;
  intakeItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    source: AccountingAdvancedDiscoveryIntakeSource;
    evidenceRefs: string[];
    question: string;
    owner: 'accountant' | 'tax_operator' | 'platform';
  }>;
  summary: {
    itemCount: number;
    accountantOwnedCount: number;
    taxBacklogCount: number;
    blockedItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingFormalNeedsClassifierView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  classifierStatus: AccountingReadinessStatus;
  intake: TenantAccountingAdvancedDiscoveryIntakeView;
  classifications: Array<{
    key: string;
    label: string;
    needType: AccountingAdvancedNeedType;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
    recommendation: string;
  }>;
  summary: {
    classificationCount: number;
    formalAccountingCount: number;
    taxOnlyCount: number;
    blockedCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAccountantDiscoveryWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  workspaceStatus: AccountingReadinessStatus;
  classifier: TenantAccountingFormalNeedsClassifierView;
  questions: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    priority: 'critical' | 'high' | 'normal';
    question: string;
    expectedEvidence: string;
    owner: 'external_accountant' | 'tax_operator' | 'platform';
    evidenceRefs: string[];
  }>;
  summary: {
    questionCount: number;
    accountantQuestionCount: number;
    criticalQuestionCount: number;
    blockedQuestionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedDiscoveryReadinessPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packetStatus: AccountingReadinessStatus;
  workspace: TenantAccountingAccountantDiscoveryWorkspaceView;
  scopeRecommendation: {
    recommendedAction: AccountingAdvancedDiscoveryRecommendation;
    minimumScope: AccountingAdvancedDiscoveryMinimumScope;
    reason: string;
  };
  readinessChecks: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
    recommendation: string;
  }>;
  summary: {
    checkCount: number;
    readyCheckCount: number;
    blockedCheckCount: number;
    formalNeedCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedDiscoveryCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  anchor: TenantAccountingAdvancedDiscoveryAnchorView;
  intake: TenantAccountingAdvancedDiscoveryIntakeView;
  classifier: TenantAccountingFormalNeedsClassifierView;
  workspace: TenantAccountingAccountantDiscoveryWorkspaceView;
  readinessPacket: TenantAccountingAdvancedDiscoveryReadinessPacketView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedDiscoveryFinalDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    formalNeedCount: number;
    accountantQuestionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}
