import { AiOperatingModelManifest } from '@saas-platform/ai-domain';

export interface AiOperatingModelAgentResponseDto {
  agent: {
    key: string;
    title: string;
    summary: string;
    domainKey: string;
    productKey: string;
    availability: 'ready' | 'planned';
    defaultMode: 'suggestion' | 'guarded_execution';
    supportedSurfaceKeys: string[];
  };
  requiredPermissionKey: string;
  primarySurface: {
    key: string;
    title: string;
    sourceContractKey: string;
  };
  promptPack: {
    key: string;
    version: string;
    mode: 'suggestion' | 'guarded_execution';
    title: string;
    summary: string;
    objective: string;
  };
  approvalPolicies: Array<{
    policyKey: string;
    agentKey: string;
    scope: 'suggestion_review';
    title: string;
    summary: string;
    reviewGuidance: string;
    approvalRequired: boolean;
  }>;
  primaryApprovalPolicyKey: string | null;
  approvalPolicyKeys: string[];
  toolAccess: Array<{
    tool: {
      key: string;
      title: string;
      summary: string;
      domainKey: string;
      availability: 'ready' | 'planned';
      riskLevel: 'low' | 'medium' | 'high';
      actionKind: 'read' | 'draft' | 'propose' | 'execute';
      requiresApproval: boolean;
      inputContract: {
        sourceSurfaceKeys: string[];
        primaryPayload: string;
        requiredContext: string[];
      };
      outputContract: {
        primaryArtifact: string;
        suggestedOutputKeys: string[];
        humanReviewFocus: string[];
      };
      executionBoundary: {
        executionMode: 'suggestion_only' | 'guarded_execution_planned';
        stateMutation: 'none' | 'planned';
        externalSideEffects: 'none' | 'planned';
        reviewRequirement: string;
        blockedCapabilities: string[];
      };
    };
    accessLevel: 'allowed' | 'approval_required' | 'blocked';
    rationale: string;
  }>;
  handoffContract: {
    requestApprovalRationale: string;
    reviewNotes: {
      approved: string;
      rejected: string;
    };
  };
  guardedExecutionCandidateToolKey: string | null;
  guardedExecutionCandidate: {
    toolKey: string;
    title: string;
    targetKind:
      | 'growth_operational_case'
      | 'invoice'
      | 'ecommerce_launch_plan';
    operatingLane:
      | 'operational_case_assignment_lane'
      | 'single_record_execution_lane';
    blastRadius: 'single_record' | 'single_queue_lane';
    safeFallbackMode:
      | 'suggestion_only'
      | 'suggestion_only_with_manual_assignment';
    preferredPilotTypeWhenReady:
      | 'human_gate_then_execute'
      | 'shadow_review';
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
      primarySurface: {
        ...entry.primarySurface,
      },
      promptPack: {
        ...entry.promptPack,
      },
      approvalPolicies: entry.approvalPolicies.map((policy) => ({ ...policy })),
      primaryApprovalPolicyKey: entry.primaryApprovalPolicyKey,
      approvalPolicyKeys: [...entry.approvalPolicyKeys],
      toolAccess: entry.toolAccess.map((toolAccess) => ({
        tool: {
          ...toolAccess.tool,
          inputContract: {
            ...toolAccess.tool.inputContract,
            sourceSurfaceKeys: [...toolAccess.tool.inputContract.sourceSurfaceKeys],
            requiredContext: [...toolAccess.tool.inputContract.requiredContext],
          },
          outputContract: {
            ...toolAccess.tool.outputContract,
            suggestedOutputKeys: [
              ...toolAccess.tool.outputContract.suggestedOutputKeys,
            ],
            humanReviewFocus: [
              ...toolAccess.tool.outputContract.humanReviewFocus,
            ],
          },
          executionBoundary: {
            ...toolAccess.tool.executionBoundary,
            blockedCapabilities: [
              ...toolAccess.tool.executionBoundary.blockedCapabilities,
            ],
          },
        },
        accessLevel: toolAccess.accessLevel,
        rationale: toolAccess.rationale,
      })),
      handoffContract: {
        requestApprovalRationale:
          entry.handoffContract.requestApprovalRationale,
        reviewNotes: {
          approved: entry.handoffContract.reviewNotes.approved,
          rejected: entry.handoffContract.reviewNotes.rejected,
        },
      },
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
