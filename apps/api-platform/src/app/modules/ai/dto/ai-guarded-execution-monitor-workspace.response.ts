export interface AiGuardedExecutionMonitorWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: string;
  productKey: string;
  currentMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  candidateToolKey: string | null;
  launchStatus: 'ready_to_launch' | 'pilot_only' | 'hold';
  launchWindow: 'current_window' | 'next_window' | 'defer';
  monitorStatus: 'ready_to_monitor' | 'monitor_after_launch' | 'not_applicable';
  monitorOwner: string;
  safeFallbackMode: string;
  watchWindow: 'day_0' | 'next_window' | 'not_scheduled';
  watchSignals: string[];
  escalationSignals: string[];
  rollbackReadinessChecks: string[];
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionMonitorWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    readyToMonitorAgents: number;
    monitorAfterLaunchAgents: number;
    notApplicableAgents: number;
    monitorCandidateTools: number;
  };
  agents: AiGuardedExecutionMonitorWorkspaceAgentResponseDto[];
}

export function toAiGuardedExecutionMonitorWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    readyToMonitorAgents: number;
    monitorAfterLaunchAgents: number;
    notApplicableAgents: number;
    monitorCandidateTools: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: string;
    productKey: string;
    currentMode: 'suggestion' | 'guarded_execution';
    approvalPolicyKeys: string[];
    candidateToolKey: string | null;
    launchStatus: 'ready_to_launch' | 'pilot_only' | 'hold';
    launchWindow: 'current_window' | 'next_window' | 'defer';
    monitorStatus: 'ready_to_monitor' | 'monitor_after_launch' | 'not_applicable';
    monitorOwner: string;
    safeFallbackMode: string;
    watchWindow: 'day_0' | 'next_window' | 'not_scheduled';
    watchSignals: string[];
    escalationSignals: string[];
    rollbackReadinessChecks: string[];
    nextStep: string;
    notes: string[];
  }>;
}): AiGuardedExecutionMonitorWorkspaceResponseDto {
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
      launchStatus: entry.launchStatus,
      launchWindow: entry.launchWindow,
      monitorStatus: entry.monitorStatus,
      monitorOwner: entry.monitorOwner,
      safeFallbackMode: entry.safeFallbackMode,
      watchWindow: entry.watchWindow,
      watchSignals: [...entry.watchSignals],
      escalationSignals: [...entry.escalationSignals],
      rollbackReadinessChecks: [...entry.rollbackReadinessChecks],
      nextStep: entry.nextStep,
      notes: [...entry.notes],
    })),
  };
}
