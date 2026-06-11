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
export type AccountingAdvancedMvpLaneKey =
  | 'bank_reconciliation'
  | 'ledger_closeout'
  | 'audit_trail'
  | 'journal_adjustments'
  | 'formal_books_boundary';
export type AccountingAdvancedMvpLaneStatus =
  | 'candidate'
  | 'out_of_scope'
  | 'blocked'
  | 'ready_for_design';
export type AccountingAdvancedMvpScopeDecision =
  | 'approve_for_mvp'
  | 'needs_more_evidence'
  | 'reject_for_now';
export type AccountingAdvancedMvpCloseoutDecision =
  | 'do_not_open_mvp'
  | 'prepare_bank_reconciliation_mvp'
  | 'prepare_ledger_closeout_mvp'
  | 'return_to_tax_or_foundation_hardening';
export type AccountingAdvancedMvpOperatingMode =
  | 'no_mvp'
  | 'bank_reconciliation_mvp'
  | 'ledger_closeout_mvp'
  | 'hardening_required';
export type AccountingAdvancedMvpReviewDecision =
  | 'approve_operational_mvp'
  | 'request_more_evidence'
  | 'reject_formal_use';
export type AccountingAdvancedMvpOperatingCloseoutDecision =
  | 'mvp_ready_for_pilot'
  | 'needs_accountant_review'
  | 'return_to_foundation_hardening'
  | 'do_not_operate';
export type AccountingAdvancedPilotEnrollmentStatus =
  | 'eligible'
  | 'needs_accountant_review'
  | 'blocked'
  | 'not_recommended';
export type AccountingAdvancedPilotReviewDecision =
  | 'approve_pilot_run'
  | 'request_more_evidence'
  | 'reject_pilot_scope';
export type AccountingAdvancedPilotOutcome =
  | 'pilot_passed'
  | 'pilot_needs_hardening'
  | 'pilot_blocked'
  | 'pilot_not_recommended';

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

export interface TenantAccountingAdvancedMvpScopeRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: AccountingReadinessStatus;
  discoveryCloseout: TenantAccountingAdvancedDiscoveryCloseoutView;
  lanes: Array<{
    key: AccountingAdvancedMvpLaneKey;
    label: string;
    status: AccountingAdvancedMvpLaneStatus;
    readinessStatus: AccountingReadinessStatus;
    evidenceRefs: string[];
    rationale: string;
    guardrail: string;
  }>;
  summary: {
    laneCount: number;
    candidateLaneCount: number;
    readyForDesignLaneCount: number;
    blockedLaneCount: number;
    outOfScopeLaneCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedMvpScopeDecisionRecordView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  recordStatus: AccountingReadinessStatus;
  scopeRegistry: TenantAccountingAdvancedMvpScopeRegistryView;
  decisions: Array<{
    laneKey: AccountingAdvancedMvpLaneKey;
    label: string;
    decision: AccountingAdvancedMvpScopeDecision;
    status: AccountingReadinessStatus;
    rationale: string;
    expectedEvidence: string;
    risk: string;
  }>;
  summary: {
    decisionCount: number;
    approvedLaneCount: number;
    needsEvidenceLaneCount: number;
    rejectedLaneCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingMinimumLedgerCloseoutDesignWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  workspaceStatus: AccountingReadinessStatus;
  scopeDecisionRecord: TenantAccountingAdvancedMvpScopeDecisionRecordView;
  designChecks: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    source: string;
    requirement: string;
  }>;
  summary: {
    checkCount: number;
    readyCheckCount: number;
    needsReviewCheckCount: number;
    blockedCheckCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingCertifiedBankEvidenceBoundaryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  boundaryStatus: AccountingReadinessStatus;
  ledgerDesignWorkspace: TenantAccountingMinimumLedgerCloseoutDesignWorkspaceView;
  boundaryRows: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    platformCanDo: string;
    requiresExternalProof: string;
    guardrail: string;
  }>;
  summary: {
    rowCount: number;
    readyRowCount: number;
    needsExternalProofCount: number;
    blockedRowCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedAuditTrailReadinessPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packetStatus: AccountingReadinessStatus;
  bankEvidenceBoundary: TenantAccountingCertifiedBankEvidenceBoundaryView;
  auditSections: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
    auditUse: string;
  }>;
  summary: {
    sectionCount: number;
    readySectionCount: number;
    blockedSectionCount: number;
    evidenceRefCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedMvpReadinessCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  scopeRegistry: TenantAccountingAdvancedMvpScopeRegistryView;
  scopeDecisionRecord: TenantAccountingAdvancedMvpScopeDecisionRecordView;
  ledgerDesignWorkspace: TenantAccountingMinimumLedgerCloseoutDesignWorkspaceView;
  bankEvidenceBoundary: TenantAccountingCertifiedBankEvidenceBoundaryView;
  auditTrailReadinessPacket: TenantAccountingAdvancedAuditTrailReadinessPacketView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedMvpCloseoutDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    approvedLaneCount: number;
    auditEvidenceRefCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedMvpExecutionAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  readinessCloseout: TenantAccountingAdvancedMvpReadinessCloseoutView;
  operatingMode: AccountingAdvancedMvpOperatingMode;
  firstLane: AccountingAdvancedMvpLaneKey | null;
  executionLanes: Array<{
    key: AccountingAdvancedMvpLaneKey;
    label: string;
    status: AccountingReadinessStatus;
    canOperate: boolean;
    guardrail: string;
  }>;
  summary: {
    laneCount: number;
    operableLaneCount: number;
    blockedLaneCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedBankReconciliationMvpWorkbenchView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  workbenchStatus: AccountingReadinessStatus;
  executionAnchor: TenantAccountingAdvancedMvpExecutionAnchorView;
  statementRows: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    amountInCents: number;
    evidenceRef: string;
  }>;
  internalMatches: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    matchConfidence: 'high' | 'medium' | 'low';
    guardrail: string;
  }>;
  unresolvedDifferences: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    requiredAction: string;
  }>;
  summary: {
    statementRowCount: number;
    internalMatchCount: number;
    unresolvedDifferenceCount: number;
    externalProofRequiredCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedLedgerCloseoutMvpWorkbenchView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  workbenchStatus: AccountingReadinessStatus;
  executionAnchor: TenantAccountingAdvancedMvpExecutionAnchorView;
  closeoutChecks: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    source: string;
    action: string;
  }>;
  summary: {
    checkCount: number;
    readyCheckCount: number;
    needsEvidenceCheckCount: number;
    blockedCheckCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedMvpAccountantReviewPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packetStatus: AccountingReadinessStatus;
  bankWorkbench: TenantAccountingAdvancedBankReconciliationMvpWorkbenchView;
  ledgerWorkbench: TenantAccountingAdvancedLedgerCloseoutMvpWorkbenchView;
  reviewItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    decision: AccountingAdvancedMvpReviewDecision;
    rationale: string;
    evidenceRefs: string[];
    risk: string;
  }>;
  summary: {
    itemCount: number;
    approvedItemCount: number;
    needsEvidenceItemCount: number;
    rejectedItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedMvpCommandCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  commandStatus: AccountingReadinessStatus;
  executionAnchor: TenantAccountingAdvancedMvpExecutionAnchorView;
  bankWorkbench: TenantAccountingAdvancedBankReconciliationMvpWorkbenchView;
  ledgerWorkbench: TenantAccountingAdvancedLedgerCloseoutMvpWorkbenchView;
  accountantReviewPacket: TenantAccountingAdvancedMvpAccountantReviewPacketView;
  lanes: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    primaryMetric: string;
    nextAction: string;
  }>;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    blockedLaneCount: number;
    evidenceRefCount: number;
    accountantPendingItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedMvpOperatingCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  commandCenter: TenantAccountingAdvancedMvpCommandCenterView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedMvpOperatingCloseoutDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    readyLaneCount: number;
    accountantPendingItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedPilotEnrollmentView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  enrollmentStatus: AccountingAdvancedPilotEnrollmentStatus;
  readinessStatus: AccountingReadinessStatus;
  operatingCloseout: TenantAccountingAdvancedMvpOperatingCloseoutView;
  criteria: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
    guardrail: string;
  }>;
  summary: {
    criteriaCount: number;
    readyCriteriaCount: number;
    blockedCriteriaCount: number;
    accountantPendingItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedPilotEvidenceSnapshotView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  snapshotStatus: AccountingReadinessStatus;
  enrollment: TenantAccountingAdvancedPilotEnrollmentView;
  evidenceSections: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
    risk: string;
    guardrail: string;
  }>;
  summary: {
    sectionCount: number;
    readySectionCount: number;
    blockedSectionCount: number;
    evidenceRefCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedPilotAccountantReviewRoomView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  roomStatus: AccountingReadinessStatus;
  evidenceSnapshot: TenantAccountingAdvancedPilotEvidenceSnapshotView;
  reviewRows: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    decision: AccountingAdvancedPilotReviewDecision;
    pendingEvidence: string[];
    risk: string;
    nextAction: string;
  }>;
  summary: {
    rowCount: number;
    approvedRowCount: number;
    needsEvidenceRowCount: number;
    rejectedRowCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedPilotRunbookView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  runbookStatus: AccountingReadinessStatus;
  reviewRoom: TenantAccountingAdvancedPilotAccountantReviewRoomView;
  steps: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    owner: 'platform' | 'operator' | 'external_accountant';
    expectedEvidence: string;
    guardrail: string;
  }>;
  summary: {
    stepCount: number;
    readyStepCount: number;
    needsReviewStepCount: number;
    blockedStepCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedPilotOutcomePacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packetStatus: AccountingReadinessStatus;
  runbook: TenantAccountingAdvancedPilotRunbookView;
  outcome: AccountingAdvancedPilotOutcome;
  findings: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    finding: string;
    recommendation: string;
  }>;
  summary: {
    findingCount: number;
    readyFindingCount: number;
    needsHardeningFindingCount: number;
    blockedFindingCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedPilotCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  enrollment: TenantAccountingAdvancedPilotEnrollmentView;
  evidenceSnapshot: TenantAccountingAdvancedPilotEvidenceSnapshotView;
  reviewRoom: TenantAccountingAdvancedPilotAccountantReviewRoomView;
  runbook: TenantAccountingAdvancedPilotRunbookView;
  outcomePacket: TenantAccountingAdvancedPilotOutcomePacketView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalOutcome: AccountingAdvancedPilotOutcome;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    evidenceRefCount: number;
    accountantPendingItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}
