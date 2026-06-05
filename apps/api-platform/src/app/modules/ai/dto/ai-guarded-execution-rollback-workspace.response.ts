export interface AiGuardedExecutionRollbackWorkspaceAgentResponseDto {
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
  rollbackOwner: string;
  blastRadius: 'single_record' | 'single_queue_lane' | 'no_execution_scope';
  rollbackTriggerSummary: string[];
  rollbackSteps: string[];
  verificationChecks: string[];
  safeFallbackMode: string;
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionRollbackWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    readyWithRollbackAgents: number;
    needsRollbackDesignAgents: number;
    notApplicableAgents: number;
    rollbackCandidateTools: number;
  };
  agents: AiGuardedExecutionRollbackWorkspaceAgentResponseDto[];
}

export function toAiGuardedExecutionRollbackWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    readyWithRollbackAgents: number;
    needsRollbackDesignAgents: number;
    notApplicableAgents: number;
    rollbackCandidateTools: number;
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
    rollbackOwner: string;
    blastRadius: 'single_record' | 'single_queue_lane' | 'no_execution_scope';
    rollbackTriggerSummary: string[];
    rollbackSteps: string[];
    verificationChecks: string[];
    safeFallbackMode: string;
    nextStep: string;
    notes: string[];
  }>;
}): AiGuardedExecutionRollbackWorkspaceResponseDto {
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
      rollbackOwner: entry.rollbackOwner,
      blastRadius: entry.blastRadius,
      rollbackTriggerSummary: [...entry.rollbackTriggerSummary],
      rollbackSteps: [...entry.rollbackSteps],
      verificationChecks: [...entry.verificationChecks],
      safeFallbackMode: entry.safeFallbackMode,
      nextStep: entry.nextStep,
      notes: [...entry.notes],
    })),
  };
}
