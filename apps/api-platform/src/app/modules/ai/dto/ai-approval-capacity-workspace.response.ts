export interface AiApprovalCapacityWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: string;
  productKey: string;
  approvalPolicyKeys: string[];
  currentMinimumReviewsPerDay: number;
  simulatedMinimumReviewsPerDay: number;
  addedReviewsPerDay: number;
  capacityStatus: 'stable' | 'watch' | 'overloaded';
  promotedToolKeys: string[];
  stillBlockedToolKeys: string[];
  bottleneckReasons: string[];
  notes: string[];
}

export interface AiApprovalCapacityWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsAtCapacityRisk: number;
    currentMinimumReviewsPerDay: number;
    simulatedMinimumReviewsPerDay: number;
    addedReviewsPerDay: number;
  };
  agents: AiApprovalCapacityWorkspaceAgentResponseDto[];
}

export function toAiApprovalCapacityWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    agentsAtCapacityRisk: number;
    currentMinimumReviewsPerDay: number;
    simulatedMinimumReviewsPerDay: number;
    addedReviewsPerDay: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: string;
    productKey: string;
    approvalPolicyKeys: string[];
    currentMinimumReviewsPerDay: number;
    simulatedMinimumReviewsPerDay: number;
    addedReviewsPerDay: number;
    capacityStatus: 'stable' | 'watch' | 'overloaded';
    promotedToolKeys: string[];
    stillBlockedToolKeys: string[];
    bottleneckReasons: string[];
    notes: string[];
  }>;
}): AiApprovalCapacityWorkspaceResponseDto {
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
      currentMinimumReviewsPerDay: entry.currentMinimumReviewsPerDay,
      simulatedMinimumReviewsPerDay: entry.simulatedMinimumReviewsPerDay,
      addedReviewsPerDay: entry.addedReviewsPerDay,
      capacityStatus: entry.capacityStatus,
      promotedToolKeys: [...entry.promotedToolKeys],
      stillBlockedToolKeys: [...entry.stillBlockedToolKeys],
      bottleneckReasons: [...entry.bottleneckReasons],
      notes: [...entry.notes],
    })),
  };
}
