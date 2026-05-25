export interface AiPolicySimulationWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  defaultMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  currentToolAccessSummary: {
    allowedCount: number;
    approvalRequiredCount: number;
    blockedCount: number;
  };
  simulatedToolAccessSummary: {
    allowedCount: number;
    approvalRequiredCount: number;
    blockedCount: number;
  };
  simulationStatus: 'review_ready' | 'more_reviewable' | 'still_blocked';
  promotedToolKeys: string[];
  stillBlockedToolKeys: string[];
  notes: string[];
}

export interface AiPolicySimulationWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsWithSimulationDelta: number;
    toolsPromotedToApprovalRequired: number;
    toolsStillBlocked: number;
  };
  agents: AiPolicySimulationWorkspaceAgentResponseDto[];
}

export function toAiPolicySimulationWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    agentsWithSimulationDelta: number;
    toolsPromotedToApprovalRequired: number;
    toolsStillBlocked: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    productKey: string;
    defaultMode: 'suggestion' | 'guarded_execution';
    approvalPolicyKeys: string[];
    currentToolAccessSummary: {
      allowedCount: number;
      approvalRequiredCount: number;
      blockedCount: number;
    };
    simulatedToolAccessSummary: {
      allowedCount: number;
      approvalRequiredCount: number;
      blockedCount: number;
    };
    simulationStatus: 'review_ready' | 'more_reviewable' | 'still_blocked';
    promotedToolKeys: string[];
    stillBlockedToolKeys: string[];
    notes: string[];
  }>;
}): AiPolicySimulationWorkspaceResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    generatedAt: input.generatedAt.toISOString(),
    counts: input.counts,
    agents: input.agents.map((entry) => ({
      agentKey: entry.agentKey,
      title: entry.title,
      domainKey: entry.domainKey,
      productKey: entry.productKey,
      defaultMode: entry.defaultMode,
      approvalPolicyKeys: [...entry.approvalPolicyKeys],
      currentToolAccessSummary: { ...entry.currentToolAccessSummary },
      simulatedToolAccessSummary: { ...entry.simulatedToolAccessSummary },
      simulationStatus: entry.simulationStatus,
      promotedToolKeys: [...entry.promotedToolKeys],
      stillBlockedToolKeys: [...entry.stillBlockedToolKeys],
      notes: [...entry.notes],
    })),
  };
}
