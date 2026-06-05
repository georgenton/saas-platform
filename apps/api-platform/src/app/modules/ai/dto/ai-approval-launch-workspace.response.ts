export interface AiApprovalLaunchWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: string;
  productKey: string;
  approvalPolicyKeys: string[];
  currentRequiredReviewerEquivalents: number;
  recommendedReviewerEquivalents: number;
  additionalReviewerEquivalentsToAssign: number;
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
  launchStatus: 'launch_now' | 'pilot_after_coverage' | 'hold';
  launchWindow: 'current_window' | 'next_window' | 'defer';
  recommendedAction: string;
  launchChecklist: string[];
  notes: string[];
}

export interface AiApprovalLaunchWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    launchNowAgents: number;
    pilotAfterCoverageAgents: number;
    holdAgents: number;
    totalCoverageGap: number;
  };
  agents: AiApprovalLaunchWorkspaceAgentResponseDto[];
}

export function toAiApprovalLaunchWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    launchNowAgents: number;
    pilotAfterCoverageAgents: number;
    holdAgents: number;
    totalCoverageGap: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: string;
    productKey: string;
    approvalPolicyKeys: string[];
    currentRequiredReviewerEquivalents: number;
    recommendedReviewerEquivalents: number;
    additionalReviewerEquivalentsToAssign: number;
    rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
    simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
    launchStatus: 'launch_now' | 'pilot_after_coverage' | 'hold';
    launchWindow: 'current_window' | 'next_window' | 'defer';
    recommendedAction: string;
    launchChecklist: string[];
    notes: string[];
  }>;
}): AiApprovalLaunchWorkspaceResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    generatedAt: input.generatedAt.toISOString(),
    counts: input.counts,
    agents: input.agents.map((entry) => ({
      agentKey: entry.agentKey,
      title: entry.title,
      domainKey: entry.domainKey,
      productKey: entry.productKey,
      approvalPolicyKeys: [...entry.approvalPolicyKeys],
      currentRequiredReviewerEquivalents:
        entry.currentRequiredReviewerEquivalents,
      recommendedReviewerEquivalents: entry.recommendedReviewerEquivalents,
      additionalReviewerEquivalentsToAssign:
        entry.additionalReviewerEquivalentsToAssign,
      rolloutPhase: entry.rolloutPhase,
      simulatedSlaStatus: entry.simulatedSlaStatus,
      launchStatus: entry.launchStatus,
      launchWindow: entry.launchWindow,
      recommendedAction: entry.recommendedAction,
      launchChecklist: [...entry.launchChecklist],
      notes: [...entry.notes],
    })),
  };
}
