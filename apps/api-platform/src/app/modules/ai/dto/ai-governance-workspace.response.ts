export interface AiGovernanceWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  defaultMode: 'suggestion' | 'guarded_execution';
  promptPack: {
    key: string;
    version: string;
    mode: 'suggestion' | 'guarded_execution';
    title: string;
  };
  approvalPolicyKeys: string[];
  toolAccessSummary: {
    allowedCount: number;
    approvalRequiredCount: number;
    blockedCount: number;
  };
  executionModes: Array<'suggestion_only' | 'guarded_execution_planned'>;
  blockedCapabilities: string[];
  reviewRequirementHighlights: string[];
  notes: string[];
}

export interface AiGovernanceWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    suggestionModeAgents: number;
    guardedExecutionPlannedAgents: number;
    approvalRequiredTools: number;
    blockedTools: number;
  };
  agents: AiGovernanceWorkspaceAgentResponseDto[];
}

export function toAiGovernanceWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    suggestionModeAgents: number;
    guardedExecutionPlannedAgents: number;
    approvalRequiredTools: number;
    blockedTools: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    productKey: string;
    defaultMode: 'suggestion' | 'guarded_execution';
    promptPack: {
      key: string;
      version: string;
      mode: 'suggestion' | 'guarded_execution';
      title: string;
    };
    approvalPolicyKeys: string[];
    toolAccessSummary: {
      allowedCount: number;
      approvalRequiredCount: number;
      blockedCount: number;
    };
    executionModes: Array<'suggestion_only' | 'guarded_execution_planned'>;
    blockedCapabilities: string[];
    reviewRequirementHighlights: string[];
    notes: string[];
  }>;
}): AiGovernanceWorkspaceResponseDto {
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
      promptPack: { ...entry.promptPack },
      approvalPolicyKeys: [...entry.approvalPolicyKeys],
      toolAccessSummary: { ...entry.toolAccessSummary },
      executionModes: [...entry.executionModes],
      blockedCapabilities: [...entry.blockedCapabilities],
      reviewRequirementHighlights: [...entry.reviewRequirementHighlights],
      notes: [...entry.notes],
    })),
  };
}
