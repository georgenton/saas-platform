export interface AiApprovalStaffingWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  approvalPolicyKeys: string[];
  currentRequiredReviewerEquivalents: number;
  simulatedRequiredReviewerEquivalents: number;
  addedReviewerEquivalents: number;
  staffingStatus: 'sufficient' | 'watch' | 'insufficient';
  promotedToolKeys: string[];
  stillBlockedToolKeys: string[];
  staffingReasons: string[];
  notes: string[];
}

export interface AiApprovalStaffingWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsNeedingMoreCoverage: number;
    currentRequiredReviewerEquivalents: number;
    simulatedRequiredReviewerEquivalents: number;
    addedReviewerEquivalents: number;
  };
  agents: AiApprovalStaffingWorkspaceAgentResponseDto[];
}

export function toAiApprovalStaffingWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    agentsNeedingMoreCoverage: number;
    currentRequiredReviewerEquivalents: number;
    simulatedRequiredReviewerEquivalents: number;
    addedReviewerEquivalents: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    productKey: string;
    approvalPolicyKeys: string[];
    currentRequiredReviewerEquivalents: number;
    simulatedRequiredReviewerEquivalents: number;
    addedReviewerEquivalents: number;
    staffingStatus: 'sufficient' | 'watch' | 'insufficient';
    promotedToolKeys: string[];
    stillBlockedToolKeys: string[];
    staffingReasons: string[];
    notes: string[];
  }>;
}): AiApprovalStaffingWorkspaceResponseDto {
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
      addedReviewerEquivalents: entry.addedReviewerEquivalents,
      staffingStatus: entry.staffingStatus,
      promotedToolKeys: [...entry.promotedToolKeys],
      stillBlockedToolKeys: [...entry.stillBlockedToolKeys],
      staffingReasons: [...entry.staffingReasons],
      notes: [...entry.notes],
    })),
  };
}
