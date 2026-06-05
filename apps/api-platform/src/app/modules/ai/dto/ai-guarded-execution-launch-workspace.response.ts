export interface AiGuardedExecutionLaunchWorkspaceAgentResponseDto {
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
  launchStatus: 'ready_to_launch' | 'pilot_only' | 'hold';
  launchWindow: 'current_window' | 'next_window' | 'defer';
  launchOwner: string;
  safeFallbackMode: string;
  launchChecklist: string[];
  blockingFactors: string[];
  successSignals: string[];
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionLaunchWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    readyToLaunchAgents: number;
    pilotOnlyAgents: number;
    holdAgents: number;
    launchCandidateTools: number;
  };
  agents: AiGuardedExecutionLaunchWorkspaceAgentResponseDto[];
}

export function toAiGuardedExecutionLaunchWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    readyToLaunchAgents: number;
    pilotOnlyAgents: number;
    holdAgents: number;
    launchCandidateTools: number;
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
    launchStatus: 'ready_to_launch' | 'pilot_only' | 'hold';
    launchWindow: 'current_window' | 'next_window' | 'defer';
    launchOwner: string;
    safeFallbackMode: string;
    launchChecklist: string[];
    blockingFactors: string[];
    successSignals: string[];
    nextStep: string;
    notes: string[];
  }>;
}): AiGuardedExecutionLaunchWorkspaceResponseDto {
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
      launchStatus: entry.launchStatus,
      launchWindow: entry.launchWindow,
      launchOwner: entry.launchOwner,
      safeFallbackMode: entry.safeFallbackMode,
      launchChecklist: [...entry.launchChecklist],
      blockingFactors: [...entry.blockingFactors],
      successSignals: [...entry.successSignals],
      nextStep: entry.nextStep,
      notes: [...entry.notes],
    })),
  };
}
