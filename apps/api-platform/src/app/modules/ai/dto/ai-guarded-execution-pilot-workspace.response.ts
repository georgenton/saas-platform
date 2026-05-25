export interface AiGuardedExecutionPilotWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  currentMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  candidateToolKey: string | null;
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
  pilotStatus: 'ready_for_pilot' | 'needs_operational_backing' | 'no_candidate';
  pilotType: 'human_gate_then_execute' | 'shadow_review' | 'not_available';
  additionalReviewerEquivalentsToAssign: number;
  pilotPreconditions: string[];
  pilotGuardrails: string[];
  recommendedPilotScope: string;
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionPilotWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    readyForPilotAgents: number;
    needsOperationalBackingAgents: number;
    noCandidateAgents: number;
    candidateToolPilots: number;
  };
  agents: AiGuardedExecutionPilotWorkspaceAgentResponseDto[];
}

export function toAiGuardedExecutionPilotWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    readyForPilotAgents: number;
    needsOperationalBackingAgents: number;
    noCandidateAgents: number;
    candidateToolPilots: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    productKey: string;
    currentMode: 'suggestion' | 'guarded_execution';
    approvalPolicyKeys: string[];
    candidateToolKey: string | null;
    rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
    simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
    pilotStatus: 'ready_for_pilot' | 'needs_operational_backing' | 'no_candidate';
    pilotType: 'human_gate_then_execute' | 'shadow_review' | 'not_available';
    additionalReviewerEquivalentsToAssign: number;
    pilotPreconditions: string[];
    pilotGuardrails: string[];
    recommendedPilotScope: string;
    nextStep: string;
    notes: string[];
  }>;
}): AiGuardedExecutionPilotWorkspaceResponseDto {
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
      rolloutPhase: entry.rolloutPhase,
      simulatedSlaStatus: entry.simulatedSlaStatus,
      pilotStatus: entry.pilotStatus,
      pilotType: entry.pilotType,
      additionalReviewerEquivalentsToAssign:
        entry.additionalReviewerEquivalentsToAssign,
      pilotPreconditions: [...entry.pilotPreconditions],
      pilotGuardrails: [...entry.pilotGuardrails],
      recommendedPilotScope: entry.recommendedPilotScope,
      nextStep: entry.nextStep,
      notes: [...entry.notes],
    })),
  };
}
