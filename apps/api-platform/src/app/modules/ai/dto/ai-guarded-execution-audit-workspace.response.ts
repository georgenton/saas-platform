export interface AiGuardedExecutionAuditWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: string;
  productKey: string;
  currentMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  candidateToolKey: string | null;
  pilotType: 'human_gate_then_execute' | 'shadow_review' | 'not_available';
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
  runbookStatus: 'ready_to_document' | 'needs_design' | 'not_available';
  rollbackStatus: 'ready_with_rollback' | 'needs_rollback_design' | 'not_applicable';
  auditStatus: 'ready_for_audit' | 'needs_evidence_design' | 'not_applicable';
  auditOwner: string;
  safeFallbackMode: string;
  evidencePackSummary: string[];
  requiredArtifacts: string[];
  loggingChecks: string[];
  reviewTrailSummary: string[];
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionAuditWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    readyForAuditAgents: number;
    needsEvidenceDesignAgents: number;
    notApplicableAgents: number;
    auditCandidateTools: number;
  };
  agents: AiGuardedExecutionAuditWorkspaceAgentResponseDto[];
}

export function toAiGuardedExecutionAuditWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    readyForAuditAgents: number;
    needsEvidenceDesignAgents: number;
    notApplicableAgents: number;
    auditCandidateTools: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: string;
    productKey: string;
    currentMode: 'suggestion' | 'guarded_execution';
    approvalPolicyKeys: string[];
    candidateToolKey: string | null;
    pilotType: 'human_gate_then_execute' | 'shadow_review' | 'not_available';
    rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
    simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
    runbookStatus: 'ready_to_document' | 'needs_design' | 'not_available';
    rollbackStatus: 'ready_with_rollback' | 'needs_rollback_design' | 'not_applicable';
    auditStatus: 'ready_for_audit' | 'needs_evidence_design' | 'not_applicable';
    auditOwner: string;
    safeFallbackMode: string;
    evidencePackSummary: string[];
    requiredArtifacts: string[];
    loggingChecks: string[];
    reviewTrailSummary: string[];
    nextStep: string;
    notes: string[];
  }>;
}): AiGuardedExecutionAuditWorkspaceResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    generatedAt: input.generatedAt.toISOString(),
    counts: input.counts,
    agents: input.agents.map((entry) => ({
      agentKey: entry.agentKey,
      title: entry.title,
      domainKey: entry.domainKey,
      productKey: entry.productKey,
      currentMode: entry.currentMode,
      approvalPolicyKeys: [...entry.approvalPolicyKeys],
      candidateToolKey: entry.candidateToolKey,
      pilotType: entry.pilotType,
      rolloutPhase: entry.rolloutPhase,
      simulatedSlaStatus: entry.simulatedSlaStatus,
      runbookStatus: entry.runbookStatus,
      rollbackStatus: entry.rollbackStatus,
      auditStatus: entry.auditStatus,
      auditOwner: entry.auditOwner,
      safeFallbackMode: entry.safeFallbackMode,
      evidencePackSummary: [...entry.evidencePackSummary],
      requiredArtifacts: [...entry.requiredArtifacts],
      loggingChecks: [...entry.loggingChecks],
      reviewTrailSummary: [...entry.reviewTrailSummary],
      nextStep: entry.nextStep,
      notes: [...entry.notes],
    })),
  };
}
