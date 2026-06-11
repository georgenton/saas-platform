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
export type AccountingAdvancedGraduationDecision =
  | 'graduate_to_advanced_product'
  | 'extend_pilot'
  | 'return_to_foundation_hardening'
  | 'do_not_graduate';
export type AccountingAdvancedBoundaryType =
  | 'formal_books'
  | 'certified_bank_feed';
export type AccountingAdvancedFormalReadinessDecision =
  | 'ready_for_formal_product_design'
  | 'needs_professional_boundary_review'
  | 'return_to_advanced_hardening'
  | 'do_not_open_formal_product';
export type AccountingAdvancedFormalProductDesignDecision =
  | 'ready_for_formal_artifact_drafting'
  | 'needs_scope_review'
  | 'return_to_formal_readiness_hardening'
  | 'do_not_design_formal_product';
export type AccountingAdvancedFormalArtifactDraftingDecision =
  | 'ready_for_professional_review_execution'
  | 'needs_draft_evidence'
  | 'return_to_formal_product_design'
  | 'do_not_draft_formal_artifacts';
export type AccountingAdvancedProfessionalReviewExecutionDecision =
  | 'ready_for_formal_approval_workflow'
  | 'needs_more_changes'
  | 'return_to_artifact_drafting'
  | 'do_not_advance_formal_artifacts';
export type AccountingAdvancedFormalModuleKey =
  | 'formal_books'
  | 'certified_bank_reconciliation'
  | 'advanced_adjustments'
  | 'multi_period_statements'
  | 'professional_portal';
export type AccountingAdvancedProfessionalOwner =
  | 'platform'
  | 'operator'
  | 'external_accountant'
  | 'auditor'
  | 'legal_representative';

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

export interface TenantAccountingAdvancedPilotLearningRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: AccountingReadinessStatus;
  pilotCloseout: TenantAccountingAdvancedPilotCloseoutView;
  learnings: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
    signal: string;
    graduationImpact: string;
  }>;
  summary: {
    learningCount: number;
    readyLearningCount: number;
    hardeningLearningCount: number;
    blockedLearningCount: number;
    evidenceRefCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExternalAccountantAcceptanceCriteriaView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  criteriaStatus: AccountingReadinessStatus;
  learningRegistry: TenantAccountingAdvancedPilotLearningRegistryView;
  criteria: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    requiredEvidence: string;
    accountantQuestion: string;
    risk: string;
  }>;
  summary: {
    criteriaCount: number;
    acceptedCriteriaCount: number;
    needsReviewCriteriaCount: number;
    blockedCriteriaCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedProductGraduationMatrixView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  matrixStatus: AccountingReadinessStatus;
  acceptanceCriteria: TenantAccountingAdvancedExternalAccountantAcceptanceCriteriaView;
  rows: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    score: number;
    recommendation: AccountingAdvancedGraduationDecision;
    rationale: string;
  }>;
  finalDecision: AccountingAdvancedGraduationDecision;
  summary: {
    rowCount: number;
    graduateRowCount: number;
    extendPilotRowCount: number;
    hardeningRowCount: number;
    doNotGraduateRowCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalBooksBoundaryBlueprintView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  blueprintStatus: AccountingReadinessStatus;
  graduationMatrix: TenantAccountingAdvancedProductGraduationMatrixView;
  boundaryType: AccountingAdvancedBoundaryType;
  boundaryRows: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    platformCanPrepare: string;
    requiresProfessionalAct: string;
    guardrail: string;
  }>;
  summary: {
    rowCount: number;
    readyRowCount: number;
    needsReviewRowCount: number;
    blockedRowCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  blueprintStatus: AccountingReadinessStatus;
  formalBooksBoundary: TenantAccountingAdvancedFormalBooksBoundaryBlueprintView;
  boundaryType: AccountingAdvancedBoundaryType;
  boundaryRows: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    platformCanPrepare: string;
    requiresExternalProof: string;
    certificationRisk: string;
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

export interface TenantAccountingAdvancedGraduationCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  learningRegistry: TenantAccountingAdvancedPilotLearningRegistryView;
  acceptanceCriteria: TenantAccountingAdvancedExternalAccountantAcceptanceCriteriaView;
  graduationMatrix: TenantAccountingAdvancedProductGraduationMatrixView;
  formalBooksBoundary: TenantAccountingAdvancedFormalBooksBoundaryBlueprintView;
  certifiedBankFeedBoundary: TenantAccountingAdvancedCertifiedBankFeedBoundaryBlueprintView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedGraduationDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    acceptanceCriteriaCount: number;
    boundaryRowCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedPoliciesClosingTemplateRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: AccountingReadinessStatus;
  graduationCloseout: TenantAccountingAdvancedGraduationCloseoutView;
  policies: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    owner: 'platform' | 'external_accountant';
    templateRef: string;
    guardrail: string;
  }>;
  summary: {
    policyCount: number;
    readyPolicyCount: number;
    accountantOwnedPolicyCount: number;
    blockedPolicyCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExternalAccountantPortalShellView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  portalStatus: AccountingReadinessStatus;
  policyRegistry: TenantAccountingAdvancedPoliciesClosingTemplateRegistryView;
  reviewPanels: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
    accountantAction: string;
  }>;
  summary: {
    panelCount: number;
    readyPanelCount: number;
    needsReviewPanelCount: number;
    blockedPanelCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedAdjustmentAutomationWorkbenchView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  workbenchStatus: AccountingReadinessStatus;
  accountantPortal: TenantAccountingAdvancedExternalAccountantPortalShellView;
  recommendations: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    adjustmentType: 'accrual' | 'reclassification' | 'difference' | 'reversal';
    evidenceRefs: string[];
    requiredApproval: string;
  }>;
  summary: {
    recommendationCount: number;
    readyRecommendationCount: number;
    needsApprovalRecommendationCount: number;
    blockedRecommendationCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  workspaceStatus: AccountingReadinessStatus;
  adjustmentWorkbench: TenantAccountingAdvancedAdjustmentAutomationWorkbenchView;
  statementSections: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    periodRange: string;
    evidenceRefs: string[];
    variationSignal: string;
  }>;
  summary: {
    sectionCount: number;
    readySectionCount: number;
    needsReviewSectionCount: number;
    blockedSectionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packetStatus: AccountingReadinessStatus;
  financialStatementWorkspace: TenantAccountingAdvancedMultiPeriodFinancialStatementWorkspaceView;
  boundaryRows: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    draftArtifact: string;
    signingBoundary: string;
    professionalActRequired: string;
  }>;
  summary: {
    rowCount: number;
    readyRowCount: number;
    needsSigningRowCount: number;
    blockedRowCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  formalBooksPacket: TenantAccountingAdvancedFormalBooksDraftSigningBoundaryPacketView;
  reconciliationChecks: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    platformEvidence: string;
    externalProofRequired: string;
    signoffBoundary: string;
  }>;
  finalDecision: AccountingAdvancedFormalReadinessDecision;
  summary: {
    checkCount: number;
    readyCheckCount: number;
    needsExternalProofCount: number;
    blockedCheckCount: number;
    formalBookBoundaryCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalProductScopeContractView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  contractStatus: AccountingReadinessStatus;
  formalReadinessCloseout: TenantAccountingAdvancedCertifiedBankReconciliationReadinessCloseoutView;
  modules: Array<{
    key: AccountingAdvancedFormalModuleKey;
    label: string;
    status: AccountingReadinessStatus;
    included: boolean;
    boundary: string;
    evidenceRefs: string[];
  }>;
  summary: {
    moduleCount: number;
    includedModuleCount: number;
    needsReviewModuleCount: number;
    blockedModuleCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  matrixStatus: AccountingReadinessStatus;
  scopeContract: TenantAccountingAdvancedFormalProductScopeContractView;
  assignments: Array<{
    key: string;
    label: string;
    moduleKey: AccountingAdvancedFormalModuleKey;
    status: AccountingReadinessStatus;
    owner: AccountingAdvancedProfessionalOwner;
    responsibility: string;
    guardrail: string;
  }>;
  summary: {
    assignmentCount: number;
    externalOwnerCount: number;
    platformOwnerCount: number;
    needsReviewAssignmentCount: number;
    blockedAssignmentCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalArtifactDraftRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: AccountingReadinessStatus;
  responsibilityMatrix: TenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixView;
  artifacts: Array<{
    key: string;
    label: string;
    moduleKey: AccountingAdvancedFormalModuleKey;
    status: AccountingReadinessStatus;
    artifactType:
      | 'journal_book'
      | 'ledger_book'
      | 'financial_statement'
      | 'certified_reconciliation'
      | 'adjustment_pack';
    draftReadiness: string;
    requiredOwner: AccountingAdvancedProfessionalOwner;
  }>;
  summary: {
    artifactCount: number;
    readyArtifactCount: number;
    needsReviewArtifactCount: number;
    blockedArtifactCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedProfessionalReviewWorkflowDesignView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  workflowStatus: AccountingReadinessStatus;
  artifactRegistry: TenantAccountingAdvancedFormalArtifactDraftRegistryView;
  workflowSteps: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    actor: AccountingAdvancedProfessionalOwner;
    transition:
      | 'submit'
      | 'review'
      | 'request_changes'
      | 'approve_draft'
      | 'reject'
      | 'external_signoff_required';
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

export interface TenantAccountingAdvancedFormalProductRiskGuardrailPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  workflowDesign: TenantAccountingAdvancedProfessionalReviewWorkflowDesignView;
  guardrailRows: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    appliesTo: AccountingAdvancedFormalModuleKey;
    risk: string;
    requiredControl: string;
  }>;
  summary: {
    guardrailCount: number;
    readyGuardrailCount: number;
    needsReviewGuardrailCount: number;
    blockedGuardrailCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalProductDesignCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  scopeContract: TenantAccountingAdvancedFormalProductScopeContractView;
  responsibilityMatrix: TenantAccountingAdvancedProfessionalResponsibilityAssignmentMatrixView;
  artifactRegistry: TenantAccountingAdvancedFormalArtifactDraftRegistryView;
  workflowDesign: TenantAccountingAdvancedProfessionalReviewWorkflowDesignView;
  guardrailPack: TenantAccountingAdvancedFormalProductRiskGuardrailPackView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedFormalProductDesignDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    includedModuleCount: number;
    artifactCount: number;
    externalOwnerCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalArtifactDraftingAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  productDesignCloseout: TenantAccountingAdvancedFormalProductDesignCloseoutView;
  draftingGates: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
    gate: string;
  }>;
  summary: {
    gateCount: number;
    readyGateCount: number;
    needsReviewGateCount: number;
    blockedGateCount: number;
    designArtifactCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedAdjustmentDraftPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  draftingAnchor: TenantAccountingAdvancedFormalArtifactDraftingAnchorView;
  draftAdjustments: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    adjustmentType: 'accrual' | 'reclassification' | 'estimation' | 'cleanup';
    evidenceRefs: string[];
    professionalQuestion: string;
  }>;
  summary: {
    draftCount: number;
    readyDraftCount: number;
    needsReviewDraftCount: number;
    blockedDraftCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalBooksDraftWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  workspaceStatus: AccountingReadinessStatus;
  adjustmentDraftPack: TenantAccountingAdvancedAdjustmentDraftPackView;
  bookDrafts: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    bookType: 'journal' | 'ledger';
    sourceRefs: string[];
    reviewBoundary: string;
  }>;
  summary: {
    bookDraftCount: number;
    readyBookDraftCount: number;
    needsReviewBookDraftCount: number;
    blockedBookDraftCount: number;
    adjustmentDraftCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFinancialStatementsDraftPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  formalBooksWorkspace: TenantAccountingAdvancedFormalBooksDraftWorkspaceView;
  statementDrafts: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    statementType:
      | 'financial_position'
      | 'income_statement'
      | 'cash_movement'
      | 'period_comparison';
    periodRange: string;
    evidenceRefs: string[];
  }>;
  summary: {
    statementDraftCount: number;
    readyStatementDraftCount: number;
    needsReviewStatementDraftCount: number;
    blockedStatementDraftCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedCertifiedReconciliationDraftPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  financialStatementsDraftPack: TenantAccountingAdvancedFinancialStatementsDraftPackView;
  reconciliationDrafts: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
    externalProofRequired: string;
    certificationBoundary: string;
  }>;
  summary: {
    reconciliationDraftCount: number;
    readyReconciliationDraftCount: number;
    needsExternalProofDraftCount: number;
    blockedReconciliationDraftCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalArtifactDraftingCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  draftingAnchor: TenantAccountingAdvancedFormalArtifactDraftingAnchorView;
  adjustmentDraftPack: TenantAccountingAdvancedAdjustmentDraftPackView;
  formalBooksWorkspace: TenantAccountingAdvancedFormalBooksDraftWorkspaceView;
  financialStatementsDraftPack: TenantAccountingAdvancedFinancialStatementsDraftPackView;
  certifiedReconciliationDraftPack: TenantAccountingAdvancedCertifiedReconciliationDraftPackView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedFormalArtifactDraftingDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    adjustmentDraftCount: number;
    bookDraftCount: number;
    statementDraftCount: number;
    reconciliationDraftCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedProfessionalReviewExecutionAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  draftingCloseout: TenantAccountingAdvancedFormalArtifactDraftingCloseoutView;
  reviewGates: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
    professionalOwner: AccountingAdvancedProfessionalOwner;
    gate: string;
  }>;
  summary: {
    gateCount: number;
    readyGateCount: number;
    needsReviewGateCount: number;
    blockedGateCount: number;
    draftArtifactCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedAccountantDraftReviewRoomView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  roomStatus: AccountingReadinessStatus;
  reviewAnchor: TenantAccountingAdvancedProfessionalReviewExecutionAnchorView;
  reviewRows: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    artifactType:
      | 'adjustment_pack'
      | 'journal_book'
      | 'ledger_book'
      | 'financial_statement'
      | 'certified_reconciliation';
    reviewer: AccountingAdvancedProfessionalOwner;
    finding: string;
    preliminaryDecision:
      | 'approve_for_recommendation'
      | 'request_changes'
      | 'needs_external_signoff'
      | 'reject_draft';
  }>;
  summary: {
    reviewRowCount: number;
    approveForRecommendationCount: number;
    changeRequestCount: number;
    externalSignoffCount: number;
    rejectedDraftCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedReviewChangeRequestPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  reviewRoom: TenantAccountingAdvancedAccountantDraftReviewRoomView;
  changeRequests: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    sourceReviewKey: string;
    requestedBy: AccountingAdvancedProfessionalOwner;
    requiredAction: string;
    evidenceRefs: string[];
  }>;
  summary: {
    changeRequestCount: number;
    readyChangeRequestCount: number;
    needsReviewChangeRequestCount: number;
    blockedChangeRequestCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedProfessionalApprovalRecommendationPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  changeRequestPack: TenantAccountingAdvancedReviewChangeRequestPackView;
  recommendations: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    artifactType:
      | 'adjustment_pack'
      | 'journal_book'
      | 'ledger_book'
      | 'financial_statement'
      | 'certified_reconciliation';
    recommendation:
      | 'recommend_approval'
      | 'require_changes_first'
      | 'require_auditor_review'
      | 'do_not_approve';
    requiredOwner: AccountingAdvancedProfessionalOwner;
    rationale: string;
  }>;
  summary: {
    recommendationCount: number;
    recommendApprovalCount: number;
    requireChangesCount: number;
    requireAuditorReviewCount: number;
    doNotApproveCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedReviewExecutionCommandCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  commandStatus: AccountingReadinessStatus;
  approvalRecommendationPack: TenantAccountingAdvancedProfessionalApprovalRecommendationPackView;
  lanes: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    owner: AccountingAdvancedProfessionalOwner;
    primaryMetric: string;
    nextAction: string;
  }>;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    needsReviewLaneCount: number;
    blockedLaneCount: number;
    recommendationCount: number;
    changeRequestCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedProfessionalReviewExecutionCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  reviewAnchor: TenantAccountingAdvancedProfessionalReviewExecutionAnchorView;
  reviewRoom: TenantAccountingAdvancedAccountantDraftReviewRoomView;
  changeRequestPack: TenantAccountingAdvancedReviewChangeRequestPackView;
  approvalRecommendationPack: TenantAccountingAdvancedProfessionalApprovalRecommendationPackView;
  commandCenter: TenantAccountingAdvancedReviewExecutionCommandCenterView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedProfessionalReviewExecutionDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    reviewRowCount: number;
    changeRequestCount: number;
    recommendationCount: number;
    readyLaneCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}
