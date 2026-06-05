export interface AiGuardedExecutionRunbookWorkspaceAgentResponseDto {
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
  additionalReviewerEquivalentsToAssign: number;
  runbookStatus: 'ready_to_document' | 'needs_design' | 'not_available';
  operatingLane: string;
  namedHumanGate: string;
  blastRadius: 'single_record' | 'single_queue_lane' | 'no_execution_scope';
  stopConditions: string[];
  entryChecklist: string[];
  exitCriteria: string[];
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionRunbookWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    readyToDocumentAgents: number;
    needsDesignAgents: number;
    notAvailableAgents: number;
    candidateRunbooks: number;
  };
  agents: AiGuardedExecutionRunbookWorkspaceAgentResponseDto[];
}

export function toAiGuardedExecutionRunbookWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    readyToDocumentAgents: number;
    needsDesignAgents: number;
    notAvailableAgents: number;
    candidateRunbooks: number;
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
    additionalReviewerEquivalentsToAssign: number;
    runbookStatus: 'ready_to_document' | 'needs_design' | 'not_available';
    operatingLane: string;
    namedHumanGate: string;
    blastRadius: 'single_record' | 'single_queue_lane' | 'no_execution_scope';
    stopConditions: string[];
    entryChecklist: string[];
    exitCriteria: string[];
    nextStep: string;
    notes: string[];
  }>;
}): AiGuardedExecutionRunbookWorkspaceResponseDto {
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
      additionalReviewerEquivalentsToAssign:
        entry.additionalReviewerEquivalentsToAssign,
      runbookStatus: entry.runbookStatus,
      operatingLane: entry.operatingLane,
      namedHumanGate: entry.namedHumanGate,
      blastRadius: entry.blastRadius,
      stopConditions: [...entry.stopConditions],
      entryChecklist: [...entry.entryChecklist],
      exitCriteria: [...entry.exitCriteria],
      nextStep: entry.nextStep,
      notes: [...entry.notes],
    })),
  };
}
