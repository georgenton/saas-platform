export interface AiApprovalDesignWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: string;
  productKey: string;
  approvalPolicyKeys: string[];
  currentExpectedReviewLoad: {
    pendingApprovalRequests: number;
    reviewableSuggestionRuns: number;
    totalHumanReviewTouches: number;
  };
  simulatedExpectedReviewLoad: {
    pendingApprovalRequests: number;
    reviewableSuggestionRuns: number;
    promotedToolReviewPoints: number;
    totalHumanReviewTouches: number;
  };
  designStatus: 'unchanged' | 'heavier_review' | 'blocked_design';
  promotedToolKeys: string[];
  stillBlockedToolKeys: string[];
  notes: string[];
}

export interface AiApprovalDesignWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsWithHeavierReview: number;
    currentExpectedHumanReviews: number;
    simulatedExpectedHumanReviews: number;
    addedHumanReviewTouches: number;
  };
  agents: AiApprovalDesignWorkspaceAgentResponseDto[];
}

export function toAiApprovalDesignWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    agentsWithHeavierReview: number;
    currentExpectedHumanReviews: number;
    simulatedExpectedHumanReviews: number;
    addedHumanReviewTouches: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: string;
    productKey: string;
    approvalPolicyKeys: string[];
    currentExpectedReviewLoad: {
      pendingApprovalRequests: number;
      reviewableSuggestionRuns: number;
      totalHumanReviewTouches: number;
    };
    simulatedExpectedReviewLoad: {
      pendingApprovalRequests: number;
      reviewableSuggestionRuns: number;
      promotedToolReviewPoints: number;
      totalHumanReviewTouches: number;
    };
    designStatus: 'unchanged' | 'heavier_review' | 'blocked_design';
    promotedToolKeys: string[];
    stillBlockedToolKeys: string[];
    notes: string[];
  }>;
}): AiApprovalDesignWorkspaceResponseDto {
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
      currentExpectedReviewLoad: { ...entry.currentExpectedReviewLoad },
      simulatedExpectedReviewLoad: { ...entry.simulatedExpectedReviewLoad },
      designStatus: entry.designStatus,
      promotedToolKeys: [...entry.promotedToolKeys],
      stillBlockedToolKeys: [...entry.stillBlockedToolKeys],
      notes: [...entry.notes],
    })),
  };
}
