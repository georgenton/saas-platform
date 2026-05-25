export interface AiApprovalStaffingPlanWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  approvalPolicyKeys: string[];
  currentRequiredReviewerEquivalents: number;
  simulatedRequiredReviewerEquivalents: number;
  recommendedReviewerEquivalents: number;
  additionalReviewerEquivalentsToAssign: number;
  priorityRank: number;
  planStatus: 'maintain' | 'increase' | 'blocked';
  promotedToolKeys: string[];
  stillBlockedToolKeys: string[];
  planActions: string[];
  notes: string[];
}

export interface AiApprovalStaffingPlanWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsRequiringIncrease: number;
    totalRecommendedReviewerEquivalents: number;
    totalAdditionalReviewerEquivalents: number;
    highestPriorityAgents: number;
  };
  agents: AiApprovalStaffingPlanWorkspaceAgentResponseDto[];
}

export function toAiApprovalStaffingPlanWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    agentsRequiringIncrease: number;
    totalRecommendedReviewerEquivalents: number;
    totalAdditionalReviewerEquivalents: number;
    highestPriorityAgents: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    productKey: string;
    approvalPolicyKeys: string[];
    currentRequiredReviewerEquivalents: number;
    simulatedRequiredReviewerEquivalents: number;
    recommendedReviewerEquivalents: number;
    additionalReviewerEquivalentsToAssign: number;
    priorityRank: number;
    planStatus: 'maintain' | 'increase' | 'blocked';
    promotedToolKeys: string[];
    stillBlockedToolKeys: string[];
    planActions: string[];
    notes: string[];
  }>;
}): AiApprovalStaffingPlanWorkspaceResponseDto {
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
      simulatedRequiredReviewerEquivalents:
        entry.simulatedRequiredReviewerEquivalents,
      recommendedReviewerEquivalents: entry.recommendedReviewerEquivalents,
      additionalReviewerEquivalentsToAssign:
        entry.additionalReviewerEquivalentsToAssign,
      priorityRank: entry.priorityRank,
      planStatus: entry.planStatus,
      promotedToolKeys: [...entry.promotedToolKeys],
      stillBlockedToolKeys: [...entry.stillBlockedToolKeys],
      planActions: [...entry.planActions],
      notes: [...entry.notes],
    })),
  };
}
