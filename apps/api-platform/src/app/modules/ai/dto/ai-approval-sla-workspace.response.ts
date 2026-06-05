export interface AiApprovalSlaWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: string;
  productKey: string;
  approvalPolicyKeys: string[];
  pendingApprovalRequests: number;
  reviewableSuggestionRuns: number;
  promotedToolKeys: string[];
  stillBlockedToolKeys: string[];
  currentEstimatedClearDays: number;
  simulatedEstimatedClearDays: number;
  currentSlaStatus: 'on_track' | 'at_risk' | 'breached';
  simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
  notes: string[];
}

export interface AiApprovalSlaWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsAtRisk: number;
    agentsBreached: number;
    currentBacklogTouches: number;
    simulatedBacklogTouches: number;
    addedBacklogTouches: number;
  };
  agents: AiApprovalSlaWorkspaceAgentResponseDto[];
}

export function toAiApprovalSlaWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    agentsAtRisk: number;
    agentsBreached: number;
    currentBacklogTouches: number;
    simulatedBacklogTouches: number;
    addedBacklogTouches: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: string;
    productKey: string;
    approvalPolicyKeys: string[];
    pendingApprovalRequests: number;
    reviewableSuggestionRuns: number;
    promotedToolKeys: string[];
    stillBlockedToolKeys: string[];
    currentEstimatedClearDays: number;
    simulatedEstimatedClearDays: number;
    currentSlaStatus: 'on_track' | 'at_risk' | 'breached';
    simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
    notes: string[];
  }>;
}): AiApprovalSlaWorkspaceResponseDto {
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
      pendingApprovalRequests: entry.pendingApprovalRequests,
      reviewableSuggestionRuns: entry.reviewableSuggestionRuns,
      promotedToolKeys: [...entry.promotedToolKeys],
      stillBlockedToolKeys: [...entry.stillBlockedToolKeys],
      currentEstimatedClearDays: entry.currentEstimatedClearDays,
      simulatedEstimatedClearDays: entry.simulatedEstimatedClearDays,
      currentSlaStatus: entry.currentSlaStatus,
      simulatedSlaStatus: entry.simulatedSlaStatus,
      notes: [...entry.notes],
    })),
  };
}
