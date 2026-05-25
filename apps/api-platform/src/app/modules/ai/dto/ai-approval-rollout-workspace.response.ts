export interface AiApprovalRolloutWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  approvalPolicyKeys: string[];
  currentRequiredReviewerEquivalents: number;
  recommendedReviewerEquivalents: number;
  additionalReviewerEquivalentsToAssign: number;
  priorityRank: number;
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  rolloutStatus: 'increase_then_rollout' | 'safe_to_rollout' | 'blocked';
  promotedToolKeys: string[];
  stillBlockedToolKeys: string[];
  rolloutActions: string[];
  notes: string[];
}

export interface AiApprovalRolloutWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    phase1Agents: number;
    phase2Agents: number;
    holdAgents: number;
    totalAdditionalReviewerEquivalents: number;
  };
  agents: AiApprovalRolloutWorkspaceAgentResponseDto[];
}

export function toAiApprovalRolloutWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    phase1Agents: number;
    phase2Agents: number;
    holdAgents: number;
    totalAdditionalReviewerEquivalents: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    productKey: string;
    approvalPolicyKeys: string[];
    currentRequiredReviewerEquivalents: number;
    recommendedReviewerEquivalents: number;
    additionalReviewerEquivalentsToAssign: number;
    priorityRank: number;
    rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
    rolloutStatus: 'increase_then_rollout' | 'safe_to_rollout' | 'blocked';
    promotedToolKeys: string[];
    stillBlockedToolKeys: string[];
    rolloutActions: string[];
    notes: string[];
  }>;
}): AiApprovalRolloutWorkspaceResponseDto {
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
      priorityRank: entry.priorityRank,
      rolloutPhase: entry.rolloutPhase,
      rolloutStatus: entry.rolloutStatus,
      promotedToolKeys: [...entry.promotedToolKeys],
      stillBlockedToolKeys: [...entry.stillBlockedToolKeys],
      rolloutActions: [...entry.rolloutActions],
      notes: [...entry.notes],
    })),
  };
}
