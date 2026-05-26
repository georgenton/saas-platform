import { AiOperatingModelManifest } from '@saas-platform/ai-domain';

export interface AiOperatingModelAgentResponseDto {
  agent: {
    key: string;
    title: string;
    summary: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    productKey: string;
    availability: 'ready' | 'planned';
    defaultMode: 'suggestion' | 'guarded_execution';
    supportedSurfaceKeys: string[];
  };
  requiredPermissionKey: string;
  promptPack: {
    key: string;
    version: string;
    mode: 'suggestion' | 'guarded_execution';
    title: string;
  };
  approvalPolicyKeys: string[];
  toolAccess: Array<{
    toolKey: string;
    accessLevel: 'allowed' | 'approval_required' | 'blocked';
    availability: 'ready' | 'planned';
    actionKind: 'read' | 'draft' | 'propose' | 'execute';
    executionMode: 'suggestion_only' | 'guarded_execution_planned';
    requiresApproval: boolean;
  }>;
  guardedExecutionCandidateToolKey: string | null;
  guardedExecutionCandidate: {
    toolKey: string;
    title: string;
    targetKind: 'growth_operational_case' | 'invoice';
    targetSelectionLabel: string;
    emptyTargetSelectionLabel: string;
    executeActionLabel: string;
    rollbackActionLabel: string;
  } | null;
}

export interface AiOperatingModelResponseDto {
  version: string;
  agents: AiOperatingModelAgentResponseDto[];
  counts: {
    totalAgents: number;
    readyAgents: number;
    plannedAgents: number;
    agentsWithApprovalPolicies: number;
    agentsWithGuardedExecutionCandidate: number;
    totalToolAccessEntries: number;
    approvalRequiredToolAccessEntries: number;
    blockedToolAccessEntries: number;
  };
}

export function toAiOperatingModelResponseDto(
  manifest: AiOperatingModelManifest,
): AiOperatingModelResponseDto {
  return {
    version: manifest.version,
    agents: manifest.agents.map((entry) => ({
      agent: {
        ...entry.agent,
        supportedSurfaceKeys: [...entry.agent.supportedSurfaceKeys],
      },
      requiredPermissionKey: entry.requiredPermissionKey,
      promptPack: {
        ...entry.promptPack,
      },
      approvalPolicyKeys: [...entry.approvalPolicyKeys],
      toolAccess: entry.toolAccess.map((tool) => ({ ...tool })),
      guardedExecutionCandidateToolKey: entry.guardedExecutionCandidateToolKey,
      guardedExecutionCandidate: entry.guardedExecutionCandidate
        ? {
            ...entry.guardedExecutionCandidate,
          }
        : null,
    })),
    counts: {
      ...manifest.counts,
    },
  };
}
