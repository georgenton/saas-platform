export interface AiGuardedExecutionControlWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  currentMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  candidateToolKey: string | null;
  controlStatus: 'open_lane' | 'pilot_then_open' | 'hold';
  controlWindow: 'current_window' | 'next_window' | 'defer';
  launchStatus: 'ready_to_launch' | 'pilot_only' | 'hold';
  monitorStatus: 'ready_to_monitor' | 'monitor_after_launch' | 'not_applicable';
  controlOwner: string;
  escalationOwner: string;
  safeFallbackMode: string;
  topAction: string;
  controlChecklist: string[];
  guardrails: string[];
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionControlWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    openLaneAgents: number;
    pilotThenOpenAgents: number;
    holdAgents: number;
    controlCandidateTools: number;
  };
  agents: AiGuardedExecutionControlWorkspaceAgentResponseDto[];
}

export function toAiGuardedExecutionControlWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    openLaneAgents: number;
    pilotThenOpenAgents: number;
    holdAgents: number;
    controlCandidateTools: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    productKey: string;
    currentMode: 'suggestion' | 'guarded_execution';
    approvalPolicyKeys: string[];
    candidateToolKey: string | null;
    controlStatus: 'open_lane' | 'pilot_then_open' | 'hold';
    controlWindow: 'current_window' | 'next_window' | 'defer';
    launchStatus: 'ready_to_launch' | 'pilot_only' | 'hold';
    monitorStatus: 'ready_to_monitor' | 'monitor_after_launch' | 'not_applicable';
    controlOwner: string;
    escalationOwner: string;
    safeFallbackMode: string;
    topAction: string;
    controlChecklist: string[];
    guardrails: string[];
    nextStep: string;
    notes: string[];
  }>;
}): AiGuardedExecutionControlWorkspaceResponseDto {
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
      controlStatus: entry.controlStatus,
      controlWindow: entry.controlWindow,
      launchStatus: entry.launchStatus,
      monitorStatus: entry.monitorStatus,
      controlOwner: entry.controlOwner,
      escalationOwner: entry.escalationOwner,
      safeFallbackMode: entry.safeFallbackMode,
      topAction: entry.topAction,
      controlChecklist: [...entry.controlChecklist],
      guardrails: [...entry.guardrails],
      nextStep: entry.nextStep,
      notes: [...entry.notes],
    })),
  };
}
