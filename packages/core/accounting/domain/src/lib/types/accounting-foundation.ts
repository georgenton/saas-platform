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
export type AccountingAdvancedFormalApprovalWorkflowDecision =
  | 'ready_for_signature_and_certification'
  | 'needs_external_approval'
  | 'return_to_professional_review'
  | 'do_not_approve_formal_artifacts';
export type AccountingAdvancedSignatureCertificationBoundaryDecision =
  | 'ready_for_external_execution'
  | 'needs_signatory_evidence'
  | 'return_to_formal_approval'
  | 'do_not_execute_formal_acts';
export type AccountingAdvancedExternalExecutionHandoffDecision =
  | 'ready_for_external_execution_tracking'
  | 'needs_executor_assignment'
  | 'return_to_signature_boundary'
  | 'do_not_handoff_formal_acts';
export type AccountingAdvancedExternalExecutionTrackingDecision =
  | 'ready_for_external_result_intake'
  | 'waiting_for_external_execution'
  | 'resolve_external_observations'
  | 'return_to_external_handoff'
  | 'do_not_accept_external_results';
export type AccountingAdvancedExternalResultIntakeDecision =
  | 'ready_for_formal_record_assembly'
  | 'needs_internal_acceptance_review'
  | 'return_to_external_tracking'
  | 'return_to_external_handoff'
  | 'do_not_accept_external_results';
export type AccountingAdvancedFormalRecordAssemblyDecision =
  | 'ready_for_formal_record_closeout'
  | 'needs_record_consistency_review'
  | 'return_to_internal_acceptance'
  | 'return_to_external_tracking'
  | 'do_not_assemble_formal_record';
export type AccountingAdvancedFormalRecordCloseoutDecision =
  | 'ready_for_archive_handoff'
  | 'needs_professional_attestation'
  | 'needs_archive_readiness_review'
  | 'return_to_formal_record_assembly'
  | 'do_not_close_formal_record';
export type AccountingAdvancedGraduationArchiveHandoffDecision =
  | 'graduate_to_full_accounting_candidate'
  | 'ready_for_archive_handoff_only'
  | 'continue_accounting_advanced_hardening'
  | 'return_to_formal_record_closeout'
  | 'do_not_graduate_or_handoff';
export type FullAccountingCandidateDecision =
  | 'open_full_accounting_mvp'
  | 'continue_candidate_discovery'
  | 'return_to_accounting_advanced_hardening'
  | 'archive_handoff_only'
  | 'do_not_open_full_accounting';
export type FullAccountingMvpReadinessDecision =
  | 'open_full_accounting_mvp_operations'
  | 'continue_mvp_readiness'
  | 'return_to_candidate_discovery'
  | 'return_to_accounting_advanced_hardening'
  | 'do_not_open_mvp';
export type FullAccountingMvpOperationsDecision =
  | 'advance_to_controlled_pilot'
  | 'continue_operations_hardening'
  | 'return_to_mvp_readiness'
  | 'return_to_candidate_discovery'
  | 'stop_full_accounting_mvp';
export type FullAccountingControlledPilotDecision =
  | 'prepare_full_accounting_graduation'
  | 'continue_controlled_pilot'
  | 'return_to_mvp_operations'
  | 'return_to_mvp_readiness'
  | 'stop_full_accounting_mvp';
export type FullAccountingGraduationDecision =
  | 'graduate_to_full_accounting_product_design'
  | 'continue_controlled_pilot'
  | 'return_to_mvp_operations'
  | 'return_to_mvp_readiness'
  | 'do_not_graduate_full_accounting';
export type FullAccountingProductDesignDecision =
  | 'open_formal_readiness'
  | 'continue_product_design'
  | 'return_to_graduation'
  | 'return_to_controlled_pilot'
  | 'do_not_design_full_accounting_product';
export type FullAccountingFormalReadinessDecision =
  | 'open_formal_artifact_drafting'
  | 'continue_formal_readiness'
  | 'return_to_product_design'
  | 'return_to_graduation'
  | 'do_not_open_formal_readiness';
export type FullAccountingFormalArtifactDraftingDecision =
  | 'open_professional_review_execution'
  | 'continue_artifact_drafting'
  | 'return_to_formal_readiness'
  | 'return_to_product_design'
  | 'do_not_draft_formal_artifacts';
export type FullAccountingProfessionalReviewExecutionDecision =
  | 'open_formal_approval_workflow'
  | 'continue_professional_review'
  | 'return_to_artifact_drafting'
  | 'return_to_formal_readiness'
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

export interface TenantAccountingAdvancedFormalApprovalWorkflowAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  professionalReviewCloseout: TenantAccountingAdvancedProfessionalReviewExecutionCloseoutView;
  approvalGates: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
    requiredOwner: AccountingAdvancedProfessionalOwner;
    gate: string;
  }>;
  summary: {
    gateCount: number;
    readyGateCount: number;
    needsReviewGateCount: number;
    blockedGateCount: number;
    recommendationCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedApprovalAuthorityMatrixView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  matrixStatus: AccountingReadinessStatus;
  approvalAnchor: TenantAccountingAdvancedFormalApprovalWorkflowAnchorView;
  authorities: Array<{
    key: string;
    label: string;
    artifactType:
      | 'adjustment_pack'
      | 'journal_book'
      | 'ledger_book'
      | 'financial_statement'
      | 'certified_reconciliation';
    status: AccountingReadinessStatus;
    requiredOwner: AccountingAdvancedProfessionalOwner;
    authorityBoundary: string;
  }>;
  summary: {
    authorityCount: number;
    accountantAuthorityCount: number;
    auditorAuthorityCount: number;
    legalRepresentativeAuthorityCount: number;
    needsReviewAuthorityCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalApprovalEvidencePackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  authorityMatrix: TenantAccountingAdvancedApprovalAuthorityMatrixView;
  evidenceItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    artifactType:
      | 'adjustment_pack'
      | 'journal_book'
      | 'ledger_book'
      | 'financial_statement'
      | 'certified_reconciliation';
    evidenceRefs: string[];
    approvalQuestion: string;
  }>;
  summary: {
    evidenceItemCount: number;
    readyEvidenceItemCount: number;
    needsReviewEvidenceItemCount: number;
    blockedEvidenceItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedApprovalDecisionWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  workspaceStatus: AccountingReadinessStatus;
  evidencePack: TenantAccountingAdvancedFormalApprovalEvidencePackView;
  decisions: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    artifactType:
      | 'adjustment_pack'
      | 'journal_book'
      | 'ledger_book'
      | 'financial_statement'
      | 'certified_reconciliation';
    decision:
      | 'recommended'
      | 'approved_pending_signature'
      | 'requires_changes'
      | 'rejected'
      | 'requires_external_signoff';
    decidedBy: AccountingAdvancedProfessionalOwner;
    rationale: string;
  }>;
  summary: {
    decisionCount: number;
    approvedPendingSignatureCount: number;
    requiresChangesCount: number;
    rejectedCount: number;
    requiresExternalSignoffCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalApprovalCommandCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  commandStatus: AccountingReadinessStatus;
  decisionWorkspace: TenantAccountingAdvancedApprovalDecisionWorkspaceView;
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
    approvedPendingSignatureCount: number;
    externalSignoffCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalApprovalWorkflowCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  approvalAnchor: TenantAccountingAdvancedFormalApprovalWorkflowAnchorView;
  authorityMatrix: TenantAccountingAdvancedApprovalAuthorityMatrixView;
  evidencePack: TenantAccountingAdvancedFormalApprovalEvidencePackView;
  decisionWorkspace: TenantAccountingAdvancedApprovalDecisionWorkspaceView;
  commandCenter: TenantAccountingAdvancedFormalApprovalCommandCenterView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedFormalApprovalWorkflowDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    authorityCount: number;
    evidenceItemCount: number;
    decisionCount: number;
    approvedPendingSignatureCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedSignatureCertificationBoundaryAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  formalApprovalCloseout: TenantAccountingAdvancedFormalApprovalWorkflowCloseoutView;
  boundaryGates: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
    requiredAct: 'signature' | 'certification' | 'legalization';
    boundary: string;
  }>;
  summary: {
    gateCount: number;
    readyGateCount: number;
    needsReviewGateCount: number;
    blockedGateCount: number;
    approvedPendingSignatureCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalSignatoryRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: AccountingReadinessStatus;
  boundaryAnchor: TenantAccountingAdvancedSignatureCertificationBoundaryAnchorView;
  signatories: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    artifactType:
      | 'journal_book'
      | 'ledger_book'
      | 'financial_statement'
      | 'certified_reconciliation'
      | 'adjustment_pack';
    requiredAct: 'signature' | 'certification' | 'legalization';
    requiredOwner: AccountingAdvancedProfessionalOwner;
    externalAuthority: string;
  }>;
  summary: {
    signatoryCount: number;
    signatureCount: number;
    certificationCount: number;
    legalizationCount: number;
    needsReviewSignatoryCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedSignatureEvidenceReadinessPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  signatoryRegistry: TenantAccountingAdvancedFormalSignatoryRegistryView;
  evidenceItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    signatoryKey: string;
    evidenceRefs: string[];
    missingEvidence: string[];
  }>;
  summary: {
    evidenceItemCount: number;
    readyEvidenceItemCount: number;
    needsReviewEvidenceItemCount: number;
    blockedEvidenceItemCount: number;
    missingEvidenceCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedCertificationRequirementWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  workspaceStatus: AccountingReadinessStatus;
  signatureEvidencePack: TenantAccountingAdvancedSignatureEvidenceReadinessPackView;
  requirements: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    artifactType: 'financial_statement' | 'certified_reconciliation';
    requiredProof: string;
    requiredOwner: AccountingAdvancedProfessionalOwner;
  }>;
  summary: {
    requirementCount: number;
    readyRequirementCount: number;
    needsReviewRequirementCount: number;
    blockedRequirementCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedLegalizationBoundaryPacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packetStatus: AccountingReadinessStatus;
  certificationWorkspace: TenantAccountingAdvancedCertificationRequirementWorkspaceView;
  legalizationItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    artifactType: 'journal_book' | 'ledger_book' | 'financial_statement';
    legalizationBoundary: string;
    requiredOwner: AccountingAdvancedProfessionalOwner;
  }>;
  summary: {
    legalizationItemCount: number;
    readyLegalizationItemCount: number;
    needsReviewLegalizationItemCount: number;
    blockedLegalizationItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedSignatureCertificationBoundaryCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  boundaryAnchor: TenantAccountingAdvancedSignatureCertificationBoundaryAnchorView;
  signatoryRegistry: TenantAccountingAdvancedFormalSignatoryRegistryView;
  signatureEvidencePack: TenantAccountingAdvancedSignatureEvidenceReadinessPackView;
  certificationWorkspace: TenantAccountingAdvancedCertificationRequirementWorkspaceView;
  legalizationPacket: TenantAccountingAdvancedLegalizationBoundaryPacketView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedSignatureCertificationBoundaryDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    signatoryCount: number;
    missingEvidenceCount: number;
    certificationRequirementCount: number;
    legalizationItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExternalExecutionHandoffAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  signatureCertificationCloseout: TenantAccountingAdvancedSignatureCertificationBoundaryCloseoutView;
  handoffGates: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
    externalAct: 'signature' | 'certification' | 'legalization';
    handoffBoundary: string;
  }>;
  summary: {
    gateCount: number;
    readyGateCount: number;
    needsReviewGateCount: number;
    blockedGateCount: number;
    signatoryCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExternalExecutorAssignmentMatrixView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  matrixStatus: AccountingReadinessStatus;
  handoffAnchor: TenantAccountingAdvancedExternalExecutionHandoffAnchorView;
  assignments: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    externalAct: 'signature' | 'certification' | 'legalization';
    executorRole:
      | 'external_accountant'
      | 'auditor'
      | 'legal_representative'
      | 'bank_certifier'
      | 'legalization_authority';
    responsibility: string;
  }>;
  summary: {
    assignmentCount: number;
    readyAssignmentCount: number;
    needsReviewAssignmentCount: number;
    blockedAssignmentCount: number;
    externalExecutorCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExecutionHandoffEvidenceBundleView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  bundleStatus: AccountingReadinessStatus;
  executorMatrix: TenantAccountingAdvancedExternalExecutorAssignmentMatrixView;
  bundles: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    assignmentKey: string;
    artifactRefs: string[];
    evidenceRefs: string[];
    blockerRefs: string[];
  }>;
  summary: {
    bundleCount: number;
    readyBundleCount: number;
    needsReviewBundleCount: number;
    blockedBundleCount: number;
    blockerRefCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExternalExecutionInstructionPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  evidenceBundle: TenantAccountingAdvancedExecutionHandoffEvidenceBundleView;
  instructions: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    assignmentKey: string;
    instruction: string;
    expectedReturnEvidence: string[];
  }>;
  summary: {
    instructionCount: number;
    readyInstructionCount: number;
    needsReviewInstructionCount: number;
    blockedInstructionCount: number;
    expectedReturnEvidenceCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExecutionReturnEvidenceIntakeView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  intakeStatus: AccountingReadinessStatus;
  instructionPack: TenantAccountingAdvancedExternalExecutionInstructionPackView;
  returnChannels: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    expectedStatus:
      | 'signed'
      | 'certified'
      | 'legalized'
      | 'rejected'
      | 'observed'
      | 'insufficient_evidence';
    requiredEvidence: string[];
  }>;
  summary: {
    channelCount: number;
    readyChannelCount: number;
    needsReviewChannelCount: number;
    blockedChannelCount: number;
    requiredEvidenceCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExternalExecutionHandoffCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  handoffAnchor: TenantAccountingAdvancedExternalExecutionHandoffAnchorView;
  executorMatrix: TenantAccountingAdvancedExternalExecutorAssignmentMatrixView;
  evidenceBundle: TenantAccountingAdvancedExecutionHandoffEvidenceBundleView;
  instructionPack: TenantAccountingAdvancedExternalExecutionInstructionPackView;
  returnEvidenceIntake: TenantAccountingAdvancedExecutionReturnEvidenceIntakeView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedExternalExecutionHandoffDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    assignmentCount: number;
    bundleCount: number;
    instructionCount: number;
    returnChannelCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExternalExecutionTrackingAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  trackingStatus: AccountingReadinessStatus;
  handoffCloseout: TenantAccountingAdvancedExternalExecutionHandoffCloseoutView;
  trackingLanes: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    externalAct: 'signature' | 'certification' | 'legalization';
    trackingState:
      | 'not_started'
      | 'sent_outside_platform'
      | 'in_external_review'
      | 'returned_with_evidence'
      | 'returned_with_observation'
      | 'rejected'
      | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    needsReviewLaneCount: number;
    blockedLaneCount: number;
    handoffChecklistCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExternalExecutionStatusLedgerView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  ledgerStatus: AccountingReadinessStatus;
  trackingAnchor: TenantAccountingAdvancedExternalExecutionTrackingAnchorView;
  events: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    laneKey: string;
    externalAct: 'signature' | 'certification' | 'legalization';
    expectedActor: string;
    eventState:
      | 'queued_for_external_actor'
      | 'external_actor_reviewing'
      | 'external_result_returned'
      | 'external_observation_returned'
      | 'external_rejection_returned';
    evidenceRequired: string[];
    evidenceReceived: string[];
    blockerRefs: string[];
  }>;
  summary: {
    eventCount: number;
    readyEventCount: number;
    needsReviewEventCount: number;
    blockedEventCount: number;
    evidenceRequiredCount: number;
    evidenceReceivedCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedReturnedEvidenceValidationWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  validationStatus: AccountingReadinessStatus;
  statusLedger: TenantAccountingAdvancedExternalExecutionStatusLedgerView;
  validations: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    eventKey: string;
    validationResult:
      | 'valid_return'
      | 'observed_return'
      | 'rejected_return'
      | 'insufficient_evidence';
    requiredEvidence: string[];
    receivedEvidence: string[];
    blockerRefs: string[];
  }>;
  summary: {
    validationCount: number;
    validReturnCount: number;
    observedReturnCount: number;
    rejectedReturnCount: number;
    insufficientEvidenceCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExternalObservationResolutionQueueView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  queueStatus: AccountingReadinessStatus;
  validationWorkspace: TenantAccountingAdvancedReturnedEvidenceValidationWorkspaceView;
  observations: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    validationKey: string;
    resolutionRoute:
      | 'return_to_artifact_drafting'
      | 'return_to_professional_review'
      | 'return_to_formal_approval'
      | 'return_to_signature_boundary'
      | 'return_to_external_handoff'
      | 'no_resolution_required';
    reason: string;
  }>;
  summary: {
    observationCount: number;
    readyObservationCount: number;
    needsReviewObservationCount: number;
    blockedObservationCount: number;
    routedObservationCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExternalExecutionTrackingCommandCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  commandStatus: AccountingReadinessStatus;
  observationQueue: TenantAccountingAdvancedExternalObservationResolutionQueueView;
  commandLanes: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    metric: string;
    count: number;
  }>;
  suggestedDecision: AccountingAdvancedExternalExecutionTrackingDecision;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    needsReviewLaneCount: number;
    blockedLaneCount: number;
    returnedCount: number;
    observedCount: number;
    rejectedCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExternalExecutionTrackingCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  trackingAnchor: TenantAccountingAdvancedExternalExecutionTrackingAnchorView;
  statusLedger: TenantAccountingAdvancedExternalExecutionStatusLedgerView;
  validationWorkspace: TenantAccountingAdvancedReturnedEvidenceValidationWorkspaceView;
  observationQueue: TenantAccountingAdvancedExternalObservationResolutionQueueView;
  commandCenter: TenantAccountingAdvancedExternalExecutionTrackingCommandCenterView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedExternalExecutionTrackingDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    trackingLaneCount: number;
    ledgerEventCount: number;
    validationCount: number;
    observationCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExternalResultIntakeAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  intakeStatus: AccountingReadinessStatus;
  trackingCloseout: TenantAccountingAdvancedExternalExecutionTrackingCloseoutView;
  resultIntakeGates: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    externalAct: 'signature' | 'certification' | 'legalization';
    intakeState:
      | 'ready_for_internal_review'
      | 'pending_external_result'
      | 'observed_external_result'
      | 'rejected_external_result'
      | 'insufficient_evidence';
    evidenceRefs: string[];
  }>;
  summary: {
    gateCount: number;
    readyGateCount: number;
    needsReviewGateCount: number;
    blockedGateCount: number;
    trackingChecklistCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedReturnedArtifactRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: AccountingReadinessStatus;
  intakeAnchor: TenantAccountingAdvancedExternalResultIntakeAnchorView;
  returnedArtifacts: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    intakeGateKey: string;
    artifactKind: 'signed' | 'certified' | 'legalized' | 'observed' | 'rejected';
    actorRef: string;
    evidenceRefs: string[];
    blockerRefs: string[];
  }>;
  summary: {
    artifactCount: number;
    signedArtifactCount: number;
    certifiedArtifactCount: number;
    legalizedArtifactCount: number;
    observedArtifactCount: number;
    rejectedArtifactCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  criteriaStatus: AccountingReadinessStatus;
  artifactRegistry: TenantAccountingAdvancedReturnedArtifactRegistryView;
  criteria: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    artifactKey: string;
    criteriaType:
      | 'actor_identity'
      | 'evidence_completeness'
      | 'approved_artifact_match'
      | 'traceability_match';
    evidenceRefs: string[];
    blockerRefs: string[];
  }>;
  summary: {
    criteriaCount: number;
    readyCriteriaCount: number;
    needsReviewCriteriaCount: number;
    blockedCriteriaCount: number;
    blockerRefCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedAcceptanceDecisionWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  decisionStatus: AccountingReadinessStatus;
  criteriaWorkspace: TenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceView;
  decisions: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    artifactKey: string;
    decision:
      | 'accepted_for_internal_record'
      | 'needs_internal_review'
      | 'return_to_external_tracking'
      | 'return_to_handoff'
      | 'rejected_for_period';
    reason: string;
  }>;
  summary: {
    decisionCount: number;
    acceptedDecisionCount: number;
    needsReviewDecisionCount: number;
    returnToTrackingDecisionCount: number;
    returnToHandoffDecisionCount: number;
    rejectedDecisionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedInternalAcceptanceCommandCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  commandStatus: AccountingReadinessStatus;
  decisionWorkspace: TenantAccountingAdvancedAcceptanceDecisionWorkspaceView;
  commandLanes: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    metric: string;
    count: number;
  }>;
  suggestedDecision: AccountingAdvancedExternalResultIntakeDecision;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    needsReviewLaneCount: number;
    blockedLaneCount: number;
    receivedArtifactCount: number;
    acceptedArtifactCount: number;
    observedArtifactCount: number;
    rejectedArtifactCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedExternalResultIntakeCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  intakeAnchor: TenantAccountingAdvancedExternalResultIntakeAnchorView;
  artifactRegistry: TenantAccountingAdvancedReturnedArtifactRegistryView;
  criteriaWorkspace: TenantAccountingAdvancedInternalAcceptanceCriteriaWorkspaceView;
  decisionWorkspace: TenantAccountingAdvancedAcceptanceDecisionWorkspaceView;
  commandCenter: TenantAccountingAdvancedInternalAcceptanceCommandCenterView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedExternalResultIntakeDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    intakeGateCount: number;
    returnedArtifactCount: number;
    criteriaCount: number;
    decisionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalRecordAssemblyAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  assemblyStatus: AccountingReadinessStatus;
  resultIntakeCloseout: TenantAccountingAdvancedExternalResultIntakeCloseoutView;
  recordGates: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    recordType:
      | 'financial_statement'
      | 'certified_reconciliation'
      | 'formal_books'
      | 'adjustment_evidence';
    assemblyState:
      | 'ready_for_binder'
      | 'pending_acceptance'
      | 'observed_result'
      | 'rejected_result'
      | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    gateCount: number;
    readyGateCount: number;
    needsReviewGateCount: number;
    blockedGateCount: number;
    acceptedDecisionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedAcceptedArtifactBinderView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  binderStatus: AccountingReadinessStatus;
  assemblyAnchor: TenantAccountingAdvancedFormalRecordAssemblyAnchorView;
  binders: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    recordGateKey: string;
    recordType:
      | 'financial_statement'
      | 'certified_reconciliation'
      | 'formal_books'
      | 'adjustment_evidence';
    acceptedArtifactRefs: string[];
    evidenceRefs: string[];
    blockerRefs: string[];
  }>;
  summary: {
    binderCount: number;
    readyBinderCount: number;
    needsReviewBinderCount: number;
    blockedBinderCount: number;
    acceptedArtifactRefCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalRecordIndexWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  indexStatus: AccountingReadinessStatus;
  artifactBinder: TenantAccountingAdvancedAcceptedArtifactBinderView;
  indexSections: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    binderKey: string;
    sectionType:
      | 'approved_draft'
      | 'external_result'
      | 'internal_acceptance'
      | 'evidence_trace'
      | 'unresolved_blockers';
    evidenceRefs: string[];
  }>;
  summary: {
    sectionCount: number;
    readySectionCount: number;
    needsReviewSectionCount: number;
    blockedSectionCount: number;
    binderCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedRecordConsistencyReviewWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  reviewStatus: AccountingReadinessStatus;
  recordIndex: TenantAccountingAdvancedFormalRecordIndexWorkspaceView;
  consistencyChecks: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    binderKey: string;
    checkType:
      | 'artifact_match'
      | 'actor_match'
      | 'evidence_completeness'
      | 'decision_trace'
      | 'period_tenant_alignment';
    resolutionRoute:
      | 'no_resolution_required'
      | 'return_to_internal_acceptance'
      | 'return_to_external_tracking'
      | 'return_to_external_handoff';
    blockerRefs: string[];
  }>;
  summary: {
    checkCount: number;
    readyCheckCount: number;
    needsReviewCheckCount: number;
    blockedCheckCount: number;
    routedCheckCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalRecordAssemblyCommandCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  commandStatus: AccountingReadinessStatus;
  consistencyReview: TenantAccountingAdvancedRecordConsistencyReviewWorkspaceView;
  commandLanes: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    metric: string;
    count: number;
  }>;
  suggestedDecision: AccountingAdvancedFormalRecordAssemblyDecision;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    needsReviewLaneCount: number;
    blockedLaneCount: number;
    assembledRecordCount: number;
    inconsistentRecordCount: number;
    readyForCloseoutCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalRecordAssemblyCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  assemblyAnchor: TenantAccountingAdvancedFormalRecordAssemblyAnchorView;
  artifactBinder: TenantAccountingAdvancedAcceptedArtifactBinderView;
  recordIndex: TenantAccountingAdvancedFormalRecordIndexWorkspaceView;
  consistencyReview: TenantAccountingAdvancedRecordConsistencyReviewWorkspaceView;
  commandCenter: TenantAccountingAdvancedFormalRecordAssemblyCommandCenterView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedFormalRecordAssemblyDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    recordGateCount: number;
    binderCount: number;
    indexSectionCount: number;
    consistencyCheckCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalRecordCloseoutAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  assemblyCloseout: TenantAccountingAdvancedFormalRecordAssemblyCloseoutView;
  closeoutGates: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    gateType:
      | 'assembly_package'
      | 'record_index'
      | 'consistency_review'
      | 'command_decision'
      | 'closeout_checklist';
    closeoutState:
      | 'ready_for_archive_readiness'
      | 'needs_review'
      | 'returned_to_assembly'
      | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    gateCount: number;
    readyGateCount: number;
    needsReviewGateCount: number;
    blockedGateCount: number;
    assemblyChecklistCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedArchiveReadinessWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  archiveStatus: AccountingReadinessStatus;
  closeoutAnchor: TenantAccountingAdvancedFormalRecordCloseoutAnchorView;
  archiveFolders: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    folderType:
      | 'formal_record_package'
      | 'evidence_chain'
      | 'decision_log'
      | 'professional_review'
      | 'exceptions';
    retentionSignal:
      | 'retain_for_period_closeout'
      | 'retain_for_professional_review'
      | 'retain_as_exception'
      | 'do_not_archive_yet';
    evidenceRefs: string[];
    blockerRefs: string[];
  }>;
  summary: {
    folderCount: number;
    readyFolderCount: number;
    needsReviewFolderCount: number;
    blockedFolderCount: number;
    retainedEvidenceRefCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalCloseoutEvidencePacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packetStatus: AccountingReadinessStatus;
  archiveReadiness: TenantAccountingAdvancedArchiveReadinessWorkspaceView;
  evidencePackets: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    archiveFolderKey: string;
    packetType:
      | 'source_artifacts'
      | 'index_snapshot'
      | 'consistency_snapshot'
      | 'operator_decision'
      | 'professional_boundary';
    evidenceRefs: string[];
    missingRefs: string[];
  }>;
  summary: {
    packetCount: number;
    readyPacketCount: number;
    needsReviewPacketCount: number;
    blockedPacketCount: number;
    missingRefCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  boundaryStatus: AccountingReadinessStatus;
  evidencePacket: TenantAccountingAdvancedFormalCloseoutEvidencePacketView;
  attestationItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    owner: AccountingAdvancedProfessionalOwner;
    attestationType:
      | 'platform_preparation'
      | 'operator_review'
      | 'external_accountant_review'
      | 'legal_representative_acknowledgement'
      | 'not_certified_by_platform';
    evidenceRefs: string[];
    guardrail: string;
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    professionalOwnedItemCount: number;
    platformBoundaryItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalRecordCloseoutCommandCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  commandStatus: AccountingReadinessStatus;
  attestationBoundary: TenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryView;
  commandLanes: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    metric: string;
    count: number;
  }>;
  suggestedDecision: AccountingAdvancedFormalRecordCloseoutDecision;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    needsReviewLaneCount: number;
    blockedLaneCount: number;
    archiveReadyCount: number;
    professionalBoundaryCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedFormalRecordCloseoutCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  closeoutAnchor: TenantAccountingAdvancedFormalRecordCloseoutAnchorView;
  archiveReadiness: TenantAccountingAdvancedArchiveReadinessWorkspaceView;
  evidencePacket: TenantAccountingAdvancedFormalCloseoutEvidencePacketView;
  attestationBoundary: TenantAccountingAdvancedProfessionalCloseoutAttestationBoundaryView;
  commandCenter: TenantAccountingAdvancedFormalRecordCloseoutCommandCenterView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedFormalRecordCloseoutDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    archiveFolderCount: number;
    evidencePacketCount: number;
    attestationItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedGraduationArchiveHandoffAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  formalRecordCloseout: TenantAccountingAdvancedFormalRecordCloseoutCloseoutView;
  handoffGates: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    gateType:
      | 'formal_closeout'
      | 'archive_readiness'
      | 'evidence_packet'
      | 'professional_boundary'
      | 'graduation_signal';
    handoffState:
      | 'ready_for_archive_handoff'
      | 'ready_for_graduation_assessment'
      | 'needs_hardening'
      | 'returned_to_closeout'
      | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    gateCount: number;
    readyGateCount: number;
    needsReviewGateCount: number;
    blockedGateCount: number;
    formalCloseoutChecklistCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedArchiveHandoffPackageView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packageStatus: AccountingReadinessStatus;
  handoffAnchor: TenantAccountingAdvancedGraduationArchiveHandoffAnchorView;
  handoffItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    itemType:
      | 'archive_manifest'
      | 'evidence_bundle'
      | 'professional_boundary'
      | 'operator_decision'
      | 'exceptions_register';
    custodyMode:
      | 'internal_ready'
      | 'external_handoff_ready'
      | 'needs_professional_review'
      | 'hold_for_hardening';
    evidenceRefs: string[];
    blockerRefs: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    needsReviewItemCount: number;
    blockedItemCount: number;
    externalReadyItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedGraduationSignalMatrixView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  matrixStatus: AccountingReadinessStatus;
  archiveHandoffPackage: TenantAccountingAdvancedArchiveHandoffPackageView;
  graduationSignals: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    signalType:
      | 'ledger_need'
      | 'bank_reconciliation_need'
      | 'formal_books_need'
      | 'financial_statement_need'
      | 'professional_workload_need'
      | 'tenant_operating_need';
    recommendation:
      | 'candidate_for_full_accounting'
      | 'keep_in_accounting_advanced'
      | 'handoff_archive_only'
      | 'needs_more_evidence';
    evidenceRefs: string[];
  }>;
  summary: {
    signalCount: number;
    readySignalCount: number;
    candidateSignalCount: number;
    hardeningSignalCount: number;
    archiveOnlySignalCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedProductScopeDecisionWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  decisionStatus: AccountingReadinessStatus;
  graduationSignalMatrix: TenantAccountingAdvancedGraduationSignalMatrixView;
  scopeDecisions: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    scopeArea:
      | 'full_accounting'
      | 'archive_handoff'
      | 'advanced_hardening'
      | 'professional_services_boundary';
    decision:
      | 'open_full_accounting_candidate'
      | 'handoff_archive_only'
      | 'continue_advanced_hardening'
      | 'keep_professional_boundary';
    evidenceRefs: string[];
  }>;
  summary: {
    decisionCount: number;
    readyDecisionCount: number;
    fullAccountingCandidateCount: number;
    archiveOnlyDecisionCount: number;
    hardeningDecisionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedGraduationArchiveHandoffCommandCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  commandStatus: AccountingReadinessStatus;
  productScopeDecision: TenantAccountingAdvancedProductScopeDecisionWorkspaceView;
  commandLanes: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    metric: string;
    count: number;
  }>;
  suggestedDecision: AccountingAdvancedGraduationArchiveHandoffDecision;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    needsReviewLaneCount: number;
    blockedLaneCount: number;
    fullAccountingCandidateCount: number;
    archiveHandoffReadyCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantAccountingAdvancedGraduationArchiveHandoffCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  handoffAnchor: TenantAccountingAdvancedGraduationArchiveHandoffAnchorView;
  archiveHandoffPackage: TenantAccountingAdvancedArchiveHandoffPackageView;
  graduationSignalMatrix: TenantAccountingAdvancedGraduationSignalMatrixView;
  productScopeDecision: TenantAccountingAdvancedProductScopeDecisionWorkspaceView;
  commandCenter: TenantAccountingAdvancedGraduationArchiveHandoffCommandCenterView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: AccountingAdvancedGraduationArchiveHandoffDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    handoffItemCount: number;
    graduationSignalCount: number;
    scopeDecisionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingCandidateAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  graduationCloseout: TenantAccountingAdvancedGraduationArchiveHandoffCloseoutView;
  candidateSignals: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    signalType:
      | 'ledger'
      | 'bank_reconciliation'
      | 'financial_statements'
      | 'legal_books'
      | 'professional_operations';
    candidateState:
      | 'candidate_ready'
      | 'needs_discovery'
      | 'return_to_advanced'
      | 'archive_only'
      | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    signalCount: number;
    readySignalCount: number;
    needsDiscoverySignalCount: number;
    blockedSignalCount: number;
    graduationCandidateCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingCoreLedgerScopeBlueprintView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  blueprintStatus: AccountingReadinessStatus;
  candidateAnchor: TenantFullAccountingCandidateAnchorView;
  ledgerScopeItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    scopeType:
      | 'chart_of_accounts'
      | 'journal_entries'
      | 'posting_rules'
      | 'period_locks'
      | 'opening_balances'
      | 'adjustments';
    implementationMode:
      | 'candidate_scope_only'
      | 'requires_persistence_design'
      | 'requires_professional_policy'
      | 'out_of_scope_for_candidate';
    evidenceRefs: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    persistenceDesignCount: number;
    professionalPolicyCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingBankReconciliationBoundaryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  boundaryStatus: AccountingReadinessStatus;
  ledgerScopeBlueprint: TenantFullAccountingCoreLedgerScopeBlueprintView;
  bankBoundaryItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    boundaryType:
      | 'bank_statement_import'
      | 'matching_rules'
      | 'exception_resolution'
      | 'cash_closeout'
      | 'certification_boundary';
    ownership:
      | 'platform_candidate'
      | 'operator_review'
      | 'external_accountant'
      | 'not_implemented_yet';
    evidenceRefs: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    accountantOwnedItemCount: number;
    notImplementedItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingFinancialStatementsBlueprintView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  blueprintStatus: AccountingReadinessStatus;
  bankReconciliationBoundary: TenantFullAccountingBankReconciliationBoundaryView;
  statementItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    statementType:
      | 'trial_balance'
      | 'balance_sheet'
      | 'income_statement'
      | 'comparatives'
      | 'adjustment_disclosures'
      | 'professional_review';
    readiness:
      | 'blueprint_ready'
      | 'needs_ledger'
      | 'needs_bank_reconciliation'
      | 'needs_professional_review';
    evidenceRefs: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    ledgerDependentItemCount: number;
    professionalReviewItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingLegalBooksStatutoryBoundaryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  boundaryStatus: AccountingReadinessStatus;
  financialStatementsBlueprint: TenantFullAccountingFinancialStatementsBlueprintView;
  statutoryBoundaryItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    boundaryType:
      | 'legal_books'
      | 'statutory_custody'
      | 'legalization'
      | 'professional_signature'
      | 'platform_non_certification';
    owner: AccountingAdvancedProfessionalOwner;
    evidenceRefs: string[];
    guardrail: string;
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    professionalOwnedItemCount: number;
    platformGuardrailItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingCandidateCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  candidateAnchor: TenantFullAccountingCandidateAnchorView;
  ledgerScopeBlueprint: TenantFullAccountingCoreLedgerScopeBlueprintView;
  bankReconciliationBoundary: TenantFullAccountingBankReconciliationBoundaryView;
  financialStatementsBlueprint: TenantFullAccountingFinancialStatementsBlueprintView;
  legalBooksStatutoryBoundary: TenantFullAccountingLegalBooksStatutoryBoundaryView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: FullAccountingCandidateDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    ledgerScopeItemCount: number;
    bankBoundaryItemCount: number;
    financialStatementItemCount: number;
    statutoryBoundaryItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingMvpReadinessAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  candidateCloseout: TenantFullAccountingCandidateCloseoutView;
  readinessGates: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    gateType:
      | 'candidate_closeout'
      | 'ledger_persistence'
      | 'posting_policy'
      | 'bank_readiness'
      | 'statement_readiness';
    readinessState:
      | 'ready_for_mvp_design'
      | 'needs_readiness'
      | 'return_to_candidate'
      | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    gateCount: number;
    readyGateCount: number;
    needsReadinessGateCount: number;
    blockedGateCount: number;
    candidateChecklistCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingLedgerPersistenceDesignWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  designStatus: AccountingReadinessStatus;
  readinessAnchor: TenantFullAccountingMvpReadinessAnchorView;
  persistenceItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    persistenceType:
      | 'journal_header'
      | 'journal_line'
      | 'posting_batch'
      | 'balance_snapshot'
      | 'period_lock'
      | 'reversal_link';
    invariant:
      | 'balanced_debits_credits'
      | 'period_locked_after_close'
      | 'approval_required'
      | 'reversal_trace_required'
      | 'recalculable_snapshot';
    evidenceRefs: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    approvalInvariantCount: number;
    balanceInvariantCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingPostingPolicyApprovalBoundaryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  boundaryStatus: AccountingReadinessStatus;
  ledgerPersistenceDesign: TenantFullAccountingLedgerPersistenceDesignWorkspaceView;
  policyItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    policyType:
      | 'draft_policy'
      | 'approval_policy'
      | 'posting_policy'
      | 'reversal_policy'
      | 'accountant_escalation';
    owner: AccountingAdvancedProfessionalOwner;
    evidenceRefs: string[];
    guardrail: string;
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    accountantOwnedItemCount: number;
    platformGuardrailItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingBankFeedReconciliationMvpReadinessView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: AccountingReadinessStatus;
  postingPolicyBoundary: TenantFullAccountingPostingPolicyApprovalBoundaryView;
  bankReadinessItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    readinessType:
      | 'bank_feed_source'
      | 'import_profile'
      | 'matching_rules'
      | 'exception_queue'
      | 'cutoff_controls'
      | 'evidence_packet';
    implementationMode:
      | 'mvp_ready'
      | 'needs_provider'
      | 'needs_operator_review'
      | 'professional_boundary';
    evidenceRefs: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    providerDependencyCount: number;
    operatorReviewCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingTrialBalanceStatementReadinessView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  readinessStatus: AccountingReadinessStatus;
  bankFeedReadiness: TenantFullAccountingBankFeedReconciliationMvpReadinessView;
  statementReadinessItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    readinessType:
      | 'trial_balance'
      | 'balance_sheet'
      | 'income_statement'
      | 'comparatives'
      | 'adjustment_trace'
      | 'professional_review';
    dependency:
      | 'ledger_snapshot'
      | 'bank_reconciliation'
      | 'adjustment_policy'
      | 'professional_review';
    evidenceRefs: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    ledgerDependencyCount: number;
    professionalReviewCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingMvpReadinessCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  readinessAnchor: TenantFullAccountingMvpReadinessAnchorView;
  ledgerPersistenceDesign: TenantFullAccountingLedgerPersistenceDesignWorkspaceView;
  postingPolicyBoundary: TenantFullAccountingPostingPolicyApprovalBoundaryView;
  bankFeedReadiness: TenantFullAccountingBankFeedReconciliationMvpReadinessView;
  trialBalanceStatementReadiness: TenantFullAccountingTrialBalanceStatementReadinessView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: FullAccountingMvpReadinessDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    ledgerPersistenceItemCount: number;
    postingPolicyItemCount: number;
    bankReadinessItemCount: number;
    statementReadinessItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingMvpOperationsAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  readinessCloseout: TenantFullAccountingMvpReadinessCloseoutView;
  operationLanes: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    laneType:
      | 'ledger_workbench'
      | 'posting_draft'
      | 'bank_reconciliation'
      | 'trial_balance_preview'
      | 'operations_closeout';
    operationMode:
      | 'draft_only'
      | 'simulation_only'
      | 'preview_only'
      | 'needs_hardening'
      | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    simulationLaneCount: number;
    previewLaneCount: number;
    blockedLaneCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingLedgerWorkbenchMvpView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  workbenchStatus: AccountingReadinessStatus;
  operationsAnchor: TenantFullAccountingMvpOperationsAnchorView;
  ledgerWorkItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    workType:
      | 'journal_batch_draft'
      | 'journal_line_review'
      | 'balance_snapshot_preview'
      | 'invariant_check'
      | 'period_lock_preview';
    workMode: 'draft' | 'simulation' | 'preview' | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    draftItemCount: number;
    simulationItemCount: number;
    previewItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingPostingDraftLaneView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  laneStatus: AccountingReadinessStatus;
  ledgerWorkbench: TenantFullAccountingLedgerWorkbenchMvpView;
  draftItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    draftState:
      | 'draft'
      | 'pending_approval'
      | 'approved_for_simulation'
      | 'returned'
      | 'blocked';
    approvalOwner: AccountingAdvancedProfessionalOwner;
    evidenceRefs: string[];
  }>;
  summary: {
    draftCount: number;
    readyDraftCount: number;
    pendingApprovalCount: number;
    simulationApprovedCount: number;
    blockedDraftCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingBankReconciliationWorkbenchMvpView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  workbenchStatus: AccountingReadinessStatus;
  postingDraftLane: TenantFullAccountingPostingDraftLaneView;
  reconciliationItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    reconciliationType:
      | 'statement_batch'
      | 'candidate_match'
      | 'exception_review'
      | 'cutoff_review'
      | 'reconciliation_packet';
    workMode:
      | 'prepared'
      | 'candidate'
      | 'operator_review'
      | 'professional_boundary';
    evidenceRefs: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    candidateMatchCount: number;
    exceptionReviewCount: number;
    professionalBoundaryCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingTrialBalancePreviewWorkbenchView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  previewStatus: AccountingReadinessStatus;
  bankReconciliationWorkbench: TenantFullAccountingBankReconciliationWorkbenchMvpView;
  previewItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    previewType:
      | 'trial_balance'
      | 'balance_variance'
      | 'approval_warning'
      | 'bank_dependency'
      | 'adjustment_trace';
    dependency:
      | 'ledger_workbench'
      | 'posting_simulation'
      | 'bank_workbench'
      | 'professional_review';
    evidenceRefs: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    warningCount: number;
    bankDependencyCount: number;
    professionalReviewCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingMvpOperationsCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  operationsAnchor: TenantFullAccountingMvpOperationsAnchorView;
  ledgerWorkbench: TenantFullAccountingLedgerWorkbenchMvpView;
  postingDraftLane: TenantFullAccountingPostingDraftLaneView;
  bankReconciliationWorkbench: TenantFullAccountingBankReconciliationWorkbenchMvpView;
  trialBalancePreviewWorkbench: TenantFullAccountingTrialBalancePreviewWorkbenchView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: FullAccountingMvpOperationsDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    ledgerWorkItemCount: number;
    postingDraftCount: number;
    reconciliationItemCount: number;
    previewItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingControlledPilotAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  operationsCloseout: TenantFullAccountingMvpOperationsCloseoutView;
  pilotLanes: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    laneType:
      | 'ledger'
      | 'posting'
      | 'bank_reconciliation'
      | 'trial_balance'
      | 'accountant_review';
    pilotMode:
      | 'controlled_draft'
      | 'controlled_simulation'
      | 'operator_review'
      | 'professional_review'
      | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    controlledLaneCount: number;
    professionalReviewLaneCount: number;
    blockedLaneCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingPilotEnrollmentPeriodFreezeView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  enrollmentStatus: AccountingReadinessStatus;
  pilotAnchor: TenantFullAccountingControlledPilotAnchorView;
  frozenEvidence: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    sourceLane:
      | 'operations_closeout'
      | 'ledger_workbench'
      | 'posting_draft_lane'
      | 'bank_workbench'
      | 'trial_balance_preview';
    freezeMode: 'snapshot' | 'reference' | 'review_packet' | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    evidenceCount: number;
    readyEvidenceCount: number;
    snapshotCount: number;
    reviewPacketCount: number;
    blockedEvidenceCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingPilotRunbookWorkspaceView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  runbookStatus: AccountingReadinessStatus;
  enrollmentFreeze: TenantFullAccountingPilotEnrollmentPeriodFreezeView;
  runbookSteps: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    stepType:
      | 'ledger_draft_review'
      | 'posting_simulation'
      | 'bank_candidate_review'
      | 'trial_balance_preview'
      | 'rollback_gate';
    owner: AccountingAdvancedProfessionalOwner;
    successMetric: string;
    evidenceRefs: string[];
  }>;
  summary: {
    stepCount: number;
    readyStepCount: number;
    accountantOwnedStepCount: number;
    rollbackGateCount: number;
    blockedStepCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingPilotAccountantReviewRoomView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  reviewStatus: AccountingReadinessStatus;
  runbookWorkspace: TenantFullAccountingPilotRunbookWorkspaceView;
  reviewItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    reviewType:
      | 'evidence_question'
      | 'approval_recommendation'
      | 'professional_concern'
      | 'resolution_note'
      | 'boundary_attestation';
    owner: AccountingAdvancedProfessionalOwner;
    evidenceRefs: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    accountantOwnedItemCount: number;
    unresolvedConcernCount: number;
    approvalRecommendationCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingPilotOutcomePacketView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  outcomeStatus: AccountingReadinessStatus;
  accountantReviewRoom: TenantFullAccountingPilotAccountantReviewRoomView;
  outcomeSignals: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    signalType:
      | 'lane_completed'
      | 'blocker_repeated'
      | 'accountant_acceptance'
      | 'graduation_signal'
      | 'hardening_signal';
    signalStrength: 'high' | 'medium' | 'low' | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    signalCount: number;
    readySignalCount: number;
    highSignalCount: number;
    accountantAcceptanceCount: number;
    graduationSignalCount: number;
    hardeningSignalCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingControlledPilotCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  pilotAnchor: TenantFullAccountingControlledPilotAnchorView;
  enrollmentFreeze: TenantFullAccountingPilotEnrollmentPeriodFreezeView;
  runbookWorkspace: TenantFullAccountingPilotRunbookWorkspaceView;
  accountantReviewRoom: TenantFullAccountingPilotAccountantReviewRoomView;
  outcomePacket: TenantFullAccountingPilotOutcomePacketView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: FullAccountingControlledPilotDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    pilotLaneCount: number;
    frozenEvidenceCount: number;
    runbookStepCount: number;
    reviewItemCount: number;
    outcomeSignalCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingGraduationAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  controlledPilotCloseout: TenantFullAccountingControlledPilotCloseoutView;
  graduationLanes: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    laneType:
      | 'ledger'
      | 'posting'
      | 'bank_reconciliation'
      | 'financial_statements'
      | 'statutory_boundary'
      | 'professional_operations';
    graduationSignal:
      | 'graduable'
      | 'needs_more_pilot'
      | 'needs_hardening'
      | 'excluded'
      | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    graduableLaneCount: number;
    needsMorePilotLaneCount: number;
    statutoryBoundaryLaneCount: number;
    blockedLaneCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingGraduationEvidenceDossierView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  dossierStatus: AccountingReadinessStatus;
  graduationAnchor: TenantFullAccountingGraduationAnchorView;
  evidenceSections: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    sectionType:
      | 'pilot_snapshot'
      | 'runbook_result'
      | 'accountant_recommendation'
      | 'acceptance_signal'
      | 'repeated_blocker'
      | 'guardrail_evidence';
    evidenceRefs: string[];
  }>;
  summary: {
    sectionCount: number;
    readySectionCount: number;
    snapshotSectionCount: number;
    accountantRecommendationCount: number;
    acceptanceSignalCount: number;
    blockerSectionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingProductScopeGraduationMatrixView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  matrixStatus: AccountingReadinessStatus;
  graduationEvidenceDossier: TenantFullAccountingGraduationEvidenceDossierView;
  moduleDecisions: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    moduleType:
      | 'ledger'
      | 'posting_workflow'
      | 'bank_reconciliation'
      | 'trial_balance_statements'
      | 'legal_books'
      | 'professional_review';
    scopeDecision: 'graduate' | 'pilot_more' | 'harden' | 'exclude' | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    moduleCount: number;
    readyModuleCount: number;
    graduateModuleCount: number;
    pilotMoreModuleCount: number;
    hardenModuleCount: number;
    excludedModuleCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingProfessionalOperatingModelView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  modelStatus: AccountingReadinessStatus;
  productScopeMatrix: TenantFullAccountingProductScopeGraduationMatrixView;
  responsibilityAssignments: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    activityType:
      | 'ledger_operation'
      | 'posting_approval'
      | 'bank_review'
      | 'statement_review'
      | 'statutory_boundary'
      | 'exception_resolution';
    owner: AccountingAdvancedProfessionalOwner;
    automationBoundary: 'platform_assisted' | 'human_approval' | 'external_professional' | 'excluded';
    evidenceRefs: string[];
  }>;
  summary: {
    assignmentCount: number;
    readyAssignmentCount: number;
    platformAssistedCount: number;
    humanApprovalCount: number;
    externalProfessionalCount: number;
    excludedAssignmentCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingGraduationRiskControlPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  professionalOperatingModel: TenantFullAccountingProfessionalOperatingModelView;
  riskControls: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    riskType:
      | 'posting_error'
      | 'bank_reconciliation_error'
      | 'statement_misstatement'
      | 'statutory_non_compliance'
      | 'professional_boundary'
      | 'rollback_condition';
    controlMode:
      | 'preventive'
      | 'detective'
      | 'professional_review'
      | 'rollback'
      | 'excluded';
    evidenceRefs: string[];
  }>;
  summary: {
    controlCount: number;
    readyControlCount: number;
    preventiveControlCount: number;
    detectiveControlCount: number;
    professionalReviewControlCount: number;
    rollbackControlCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingGraduationCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  graduationAnchor: TenantFullAccountingGraduationAnchorView;
  graduationEvidenceDossier: TenantFullAccountingGraduationEvidenceDossierView;
  productScopeMatrix: TenantFullAccountingProductScopeGraduationMatrixView;
  professionalOperatingModel: TenantFullAccountingProfessionalOperatingModelView;
  riskControlPack: TenantFullAccountingGraduationRiskControlPackView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: FullAccountingGraduationDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    graduationLaneCount: number;
    evidenceSectionCount: number;
    scopeModuleCount: number;
    responsibilityAssignmentCount: number;
    riskControlCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingProductDesignAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  graduationCloseout: TenantFullAccountingGraduationCloseoutView;
  designLanes: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    laneType:
      | 'graduated_module'
      | 'pilot_module'
      | 'hardening_module'
      | 'excluded_module'
      | 'professional_boundary';
    designMode: 'include' | 'limit' | 'harden' | 'exclude' | 'professional_review';
    evidenceRefs: string[];
  }>;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    includedLaneCount: number;
    limitedLaneCount: number;
    excludedLaneCount: number;
    blockedLaneCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingProductScopeContractView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  contractStatus: AccountingReadinessStatus;
  productDesignAnchor: TenantFullAccountingProductDesignAnchorView;
  scopeItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    moduleType:
      | 'ledger_operations'
      | 'posting_workflow'
      | 'professional_review'
      | 'bank_reconciliation'
      | 'trial_balance_statements'
      | 'legal_books'
      | 'statutory_certification';
    scopeMode: 'included' | 'limited_pilot' | 'excluded';
    entryCriteria: string;
    exitCriteria: string;
    evidenceRefs: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    includedItemCount: number;
    limitedItemCount: number;
    excludedItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingProductProfessionalResponsibilityMatrixView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  matrixStatus: AccountingReadinessStatus;
  scopeContract: TenantFullAccountingProductScopeContractView;
  responsibilities: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    responsibilityType:
      | 'platform_assisted'
      | 'operator_owned'
      | 'external_accountant_approval'
      | 'auditor_boundary'
      | 'legal_representative_boundary'
      | 'never_alone';
    owner: AccountingAdvancedProfessionalOwner;
    evidenceRefs: string[];
  }>;
  summary: {
    responsibilityCount: number;
    readyResponsibilityCount: number;
    platformAssistedCount: number;
    operatorOwnedCount: number;
    accountantApprovalCount: number;
    neverAloneCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingOfficialArtifactBoundaryRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: AccountingReadinessStatus;
  responsibilityMatrix: TenantFullAccountingProductProfessionalResponsibilityMatrixView;
  artifacts: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    artifactType:
      | 'ledger_draft_packet'
      | 'posting_approval_packet'
      | 'reconciliation_evidence_packet'
      | 'trial_balance_preview'
      | 'certified_reconciliation'
      | 'signed_financial_statements'
      | 'legal_books'
      | 'statutory_filings';
    artifactStatus:
      | 'internal'
      | 'draft'
      | 'professional_review'
      | 'external_only'
      | 'excluded';
    evidenceRefs: string[];
  }>;
  summary: {
    artifactCount: number;
    readyArtifactCount: number;
    internalArtifactCount: number;
    draftArtifactCount: number;
    professionalReviewArtifactCount: number;
    externalOnlyArtifactCount: number;
    excludedArtifactCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingWorkflowControlBlueprintView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  blueprintStatus: AccountingReadinessStatus;
  artifactBoundaryRegistry: TenantFullAccountingOfficialArtifactBoundaryRegistryView;
  workflowStages: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    stageType:
      | 'intake'
      | 'ledger_preparation'
      | 'posting_approval'
      | 'bank_evidence_review'
      | 'trial_balance_preview'
      | 'accountant_review'
      | 'closeout_recommendation';
    controlType:
      | 'approval_required'
      | 'rollback_condition'
      | 'evidence_completeness'
      | 'professional_review_gate';
    evidenceRefs: string[];
  }>;
  summary: {
    stageCount: number;
    readyStageCount: number;
    approvalRequiredCount: number;
    rollbackConditionCount: number;
    evidenceCompletenessCount: number;
    professionalReviewGateCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingProductDesignCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  productDesignAnchor: TenantFullAccountingProductDesignAnchorView;
  scopeContract: TenantFullAccountingProductScopeContractView;
  responsibilityMatrix: TenantFullAccountingProductProfessionalResponsibilityMatrixView;
  artifactBoundaryRegistry: TenantFullAccountingOfficialArtifactBoundaryRegistryView;
  workflowControlBlueprint: TenantFullAccountingWorkflowControlBlueprintView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: FullAccountingProductDesignDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    designLaneCount: number;
    scopeItemCount: number;
    responsibilityCount: number;
    artifactCount: number;
    workflowStageCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingFormalReadinessAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  productDesignCloseout: TenantFullAccountingProductDesignCloseoutView;
  readinessLanes: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    laneType:
      | 'ledger'
      | 'posting_approval'
      | 'bank_evidence'
      | 'statement_preview'
      | 'professional_review'
      | 'statutory_exclusion';
    readinessMode:
      | 'formal_ready'
      | 'policy_required'
      | 'professional_required'
      | 'excluded'
      | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    formalReadyLaneCount: number;
    professionalRequiredLaneCount: number;
    excludedLaneCount: number;
    blockedLaneCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingPolicyTemplateRegistryView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  registryStatus: AccountingReadinessStatus;
  formalReadinessAnchor: TenantFullAccountingFormalReadinessAnchorView;
  templates: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    templateType:
      | 'accounting_policy'
      | 'posting_approval_policy'
      | 'evidence_completeness_policy'
      | 'professional_review_template'
      | 'closeout_recommendation_template'
      | 'excluded_statutory_template';
    templateMode: 'ready' | 'requires_review' | 'excluded';
    evidenceRefs: string[];
  }>;
  summary: {
    templateCount: number;
    readyTemplateCount: number;
    reviewTemplateCount: number;
    excludedTemplateCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingProfessionalPortalReadinessShellView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  shellStatus: AccountingReadinessStatus;
  policyTemplateRegistry: TenantFullAccountingPolicyTemplateRegistryView;
  shellItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    shellType:
      | 'external_accountant_workspace'
      | 'review_queue'
      | 'evidence_packet_intake'
      | 'approval_rejection'
      | 'professional_notes'
      | 'signature_certification_exclusion';
    owner: AccountingAdvancedProfessionalOwner;
    evidenceRefs: string[];
  }>;
  summary: {
    shellItemCount: number;
    readyShellItemCount: number;
    accountantOwnedCount: number;
    excludedShellItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingFormalLedgerPostingReadinessPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  professionalPortalShell: TenantFullAccountingProfessionalPortalReadinessShellView;
  readinessItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    readinessType:
      | 'ledger_structure'
      | 'journal_batch'
      | 'posting_approval_gate'
      | 'reversal_readiness'
      | 'period_lock_readiness'
      | 'invariant_check';
    controlMode: 'structure' | 'approval_gate' | 'rollback' | 'lock_preview' | 'invariant';
    evidenceRefs: string[];
  }>;
  summary: {
    itemCount: number;
    readyItemCount: number;
    approvalGateCount: number;
    rollbackCount: number;
    invariantCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingStatementBankFormalBoundaryPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  ledgerPostingReadinessPack: TenantFullAccountingFormalLedgerPostingReadinessPackView;
  boundaryItems: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    boundaryType:
      | 'bank_evidence_readiness'
      | 'certified_reconciliation_boundary'
      | 'trial_balance_preview_readiness'
      | 'financial_statement_draft_readiness'
      | 'professional_review_requirement'
      | 'external_certification_boundary';
    boundaryMode: 'ready' | 'professional_review' | 'external_only' | 'excluded';
    evidenceRefs: string[];
  }>;
  summary: {
    boundaryCount: number;
    readyBoundaryCount: number;
    professionalReviewCount: number;
    externalOnlyCount: number;
    excludedBoundaryCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingFormalReadinessCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  formalReadinessAnchor: TenantFullAccountingFormalReadinessAnchorView;
  policyTemplateRegistry: TenantFullAccountingPolicyTemplateRegistryView;
  professionalPortalShell: TenantFullAccountingProfessionalPortalReadinessShellView;
  ledgerPostingReadinessPack: TenantFullAccountingFormalLedgerPostingReadinessPackView;
  statementBankBoundaryPack: TenantFullAccountingStatementBankFormalBoundaryPackView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: FullAccountingFormalReadinessDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    readinessLaneCount: number;
    templateCount: number;
    portalShellItemCount: number;
    ledgerPostingItemCount: number;
    statementBankBoundaryCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingFormalArtifactDraftingAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  formalReadinessCloseout: TenantFullAccountingFormalReadinessCloseoutView;
  draftingLanes: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    laneType:
      | 'ledger_draft'
      | 'posting_packet_draft'
      | 'bank_evidence_draft'
      | 'trial_balance_draft'
      | 'financial_statement_draft'
      | 'professional_review_boundary';
    draftMode: 'draft' | 'evidence_draft' | 'preview_draft' | 'professional_review' | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    laneCount: number;
    readyLaneCount: number;
    draftLaneCount: number;
    professionalReviewLaneCount: number;
    blockedLaneCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingFormalLedgerDraftPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  draftingAnchor: TenantFullAccountingFormalArtifactDraftingAnchorView;
  ledgerDrafts: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    draftType:
      | 'ledger_structure'
      | 'journal_batch'
      | 'journal_line'
      | 'reversal'
      | 'invariant_evidence'
      | 'period_lock_preview_reference';
    draftState: 'draft' | 'evidence' | 'preview_reference' | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    draftCount: number;
    readyDraftCount: number;
    evidenceDraftCount: number;
    previewReferenceCount: number;
    blockedDraftCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingPostingApprovalDraftPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  ledgerDraftPack: TenantFullAccountingFormalLedgerDraftPackView;
  approvalDrafts: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    approvalType:
      | 'posting_approval_summary'
      | 'pending_approval_item'
      | 'risk_flag'
      | 'rollback_reference'
      | 'accountant_decision_placeholder'
      | 'posting_execution_exclusion';
    owner: AccountingAdvancedProfessionalOwner;
    evidenceRefs: string[];
  }>;
  summary: {
    draftCount: number;
    readyDraftCount: number;
    accountantOwnedDraftCount: number;
    riskFlagCount: number;
    executionExclusionCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingBankReconciliationEvidenceDraftPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  postingApprovalDraftPack: TenantFullAccountingPostingApprovalDraftPackView;
  bankDrafts: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceType:
      | 'bank_evidence'
      | 'candidate_match_summary'
      | 'unresolved_exception'
      | 'cutoff_evidence'
      | 'certified_reconciliation_boundary'
      | 'external_certification_marker';
    evidenceMode: 'draft' | 'summary' | 'boundary' | 'external_only' | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    draftCount: number;
    readyDraftCount: number;
    summaryCount: number;
    boundaryCount: number;
    externalOnlyCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingTrialBalanceFinancialStatementDraftPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  bankEvidenceDraftPack: TenantFullAccountingBankReconciliationEvidenceDraftPackView;
  statementDrafts: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    statementType:
      | 'trial_balance'
      | 'balance_sheet'
      | 'income_statement'
      | 'variance_note'
      | 'accountant_review_requirement'
      | 'signed_statement_boundary';
    draftMode: 'draft' | 'note' | 'professional_review' | 'boundary' | 'blocked';
    evidenceRefs: string[];
  }>;
  summary: {
    draftCount: number;
    readyDraftCount: number;
    statementDraftCount: number;
    professionalReviewCount: number;
    boundaryCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingFormalArtifactDraftingCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  draftingAnchor: TenantFullAccountingFormalArtifactDraftingAnchorView;
  ledgerDraftPack: TenantFullAccountingFormalLedgerDraftPackView;
  postingApprovalDraftPack: TenantFullAccountingPostingApprovalDraftPackView;
  bankEvidenceDraftPack: TenantFullAccountingBankReconciliationEvidenceDraftPackView;
  statementDraftPack: TenantFullAccountingTrialBalanceFinancialStatementDraftPackView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: FullAccountingFormalArtifactDraftingDecision;
  summary: {
    checklistCount: number;
    readyChecklistCount: number;
    blockedChecklistCount: number;
    draftingLaneCount: number;
    ledgerDraftCount: number;
    postingDraftCount: number;
    bankDraftCount: number;
    statementDraftCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantFullAccountingProfessionalReviewExecutionAnchorView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  anchorStatus: AccountingReadinessStatus;
  draftingCloseout: TenantFullAccountingFormalArtifactDraftingCloseoutView;
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

export interface TenantFullAccountingAccountantDraftReviewRoomView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  roomStatus: AccountingReadinessStatus;
  reviewAnchor: TenantFullAccountingProfessionalReviewExecutionAnchorView;
  reviewRows: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    artifactType:
      | 'ledger_draft'
      | 'posting_approval'
      | 'bank_evidence'
      | 'trial_balance'
      | 'financial_statement'
      | 'professional_boundary';
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

export interface TenantFullAccountingReviewChangeRequestPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  reviewRoom: TenantFullAccountingAccountantDraftReviewRoomView;
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

export interface TenantFullAccountingProfessionalApprovalRecommendationPackView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  packStatus: AccountingReadinessStatus;
  changeRequestPack: TenantFullAccountingReviewChangeRequestPackView;
  recommendations: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    artifactType:
      | 'ledger_draft'
      | 'posting_approval'
      | 'bank_evidence'
      | 'trial_balance'
      | 'financial_statement'
      | 'professional_boundary';
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

export interface TenantFullAccountingReviewExecutionCommandCenterView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  commandStatus: AccountingReadinessStatus;
  approvalRecommendationPack: TenantFullAccountingProfessionalApprovalRecommendationPackView;
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

export interface TenantFullAccountingProfessionalReviewExecutionCloseoutView {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: Date;
  closeoutStatus: AccountingReadinessStatus;
  reviewAnchor: TenantFullAccountingProfessionalReviewExecutionAnchorView;
  reviewRoom: TenantFullAccountingAccountantDraftReviewRoomView;
  changeRequestPack: TenantFullAccountingReviewChangeRequestPackView;
  approvalRecommendationPack: TenantFullAccountingProfessionalApprovalRecommendationPackView;
  commandCenter: TenantFullAccountingReviewExecutionCommandCenterView;
  closeoutChecklist: Array<{
    key: string;
    label: string;
    status: AccountingReadinessStatus;
    evidenceRefs: string[];
  }>;
  finalDecision: FullAccountingProfessionalReviewExecutionDecision;
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
