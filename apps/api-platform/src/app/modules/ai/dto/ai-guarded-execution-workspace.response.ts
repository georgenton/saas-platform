export interface AiGuardedExecutionWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: string;
  productKey: string;
  currentMode: 'suggestion' | 'guarded_execution';
  approvalPolicyKeys: string[];
  executionCandidateToolKeys: string[];
  approvalRequiredToolKeys: string[];
  pendingApprovalRequests: number;
  reviewableSuggestionRuns: number;
  rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
  guardedExecutionStatus:
    | 'pilot_candidate'
    | 'needs_launch_readiness'
    | 'suggestion_only';
  guardrailChecklist: string[];
  nextStep: string;
  notes: string[];
}

export interface AiGuardedExecutionWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    pilotCandidateAgents: number;
    needsLaunchReadinessAgents: number;
    suggestionOnlyAgents: number;
    executionCandidateTools: number;
  };
  agents: AiGuardedExecutionWorkspaceAgentResponseDto[];
}

export function toAiGuardedExecutionWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    pilotCandidateAgents: number;
    needsLaunchReadinessAgents: number;
    suggestionOnlyAgents: number;
    executionCandidateTools: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: string;
    productKey: string;
    currentMode: 'suggestion' | 'guarded_execution';
    approvalPolicyKeys: string[];
    executionCandidateToolKeys: string[];
    approvalRequiredToolKeys: string[];
    pendingApprovalRequests: number;
    reviewableSuggestionRuns: number;
    rolloutPhase: 'phase_1' | 'phase_2' | 'hold';
    guardedExecutionStatus:
      | 'pilot_candidate'
      | 'needs_launch_readiness'
      | 'suggestion_only';
    guardrailChecklist: string[];
    nextStep: string;
    notes: string[];
  }>;
}): AiGuardedExecutionWorkspaceResponseDto {
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
      executionCandidateToolKeys: [...entry.executionCandidateToolKeys],
      approvalRequiredToolKeys: [...entry.approvalRequiredToolKeys],
      pendingApprovalRequests: entry.pendingApprovalRequests,
      reviewableSuggestionRuns: entry.reviewableSuggestionRuns,
      rolloutPhase: entry.rolloutPhase,
      guardedExecutionStatus: entry.guardedExecutionStatus,
      guardrailChecklist: [...entry.guardrailChecklist],
      nextStep: entry.nextStep,
      notes: [...entry.notes],
    })),
  };
}
