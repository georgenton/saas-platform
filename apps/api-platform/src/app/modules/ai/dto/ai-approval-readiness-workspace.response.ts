export interface AiApprovalReadinessWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  approvalPolicyKeys: string[];
  currentRequiredReviewerEquivalents: number;
  recommendedReviewerEquivalents: number;
  additionalReviewerEquivalentsToAssign: number;
  currentSlaStatus: 'on_track' | 'at_risk' | 'breached';
  simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  readinessStatus: 'ready_now' | 'needs_coverage' | 'blocked';
  readinessReasons: string[];
  nextStep: string;
  notes: string[];
}

export interface AiApprovalReadinessWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    readyNowAgents: number;
    needsCoverageAgents: number;
    blockedAgents: number;
  };
  agents: AiApprovalReadinessWorkspaceAgentResponseDto[];
}

export function toAiApprovalReadinessWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    readyNowAgents: number;
    needsCoverageAgents: number;
    blockedAgents: number;
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
    currentSlaStatus: 'on_track' | 'at_risk' | 'breached';
    simulatedSlaStatus: 'on_track' | 'at_risk' | 'breached';
    rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
    readinessStatus: 'ready_now' | 'needs_coverage' | 'blocked';
    readinessReasons: string[];
    nextStep: string;
    notes: string[];
  }>;
}): AiApprovalReadinessWorkspaceResponseDto {
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
      currentSlaStatus: entry.currentSlaStatus,
      simulatedSlaStatus: entry.simulatedSlaStatus,
      rolloutPhase: entry.rolloutPhase,
      readinessStatus: entry.readinessStatus,
      readinessReasons: [...entry.readinessReasons],
      nextStep: entry.nextStep,
      notes: [...entry.notes],
    })),
  };
}
