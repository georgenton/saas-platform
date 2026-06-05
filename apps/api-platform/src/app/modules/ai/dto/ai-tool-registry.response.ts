import { AiToolDefinition } from '@saas-platform/ai-domain';
import { AiAgentToolAccessView } from '@saas-platform/ai-application';

export interface AiToolRegistryResponseDto {
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
}

export interface AiAgentToolAccessResponseDto {
  tool: AiToolRegistryResponseDto;
  accessLevel: 'allowed' | 'approval_required' | 'blocked';
  rationale: string;
}

export const toAiToolRegistryResponseDto = (
  entry: AiToolDefinition,
): AiToolRegistryResponseDto => ({
  ...entry,
  inputContract: {
    ...entry.inputContract,
    sourceSurfaceKeys: [...entry.inputContract.sourceSurfaceKeys],
    requiredContext: [...entry.inputContract.requiredContext],
  },
  outputContract: {
    ...entry.outputContract,
    suggestedOutputKeys: [...entry.outputContract.suggestedOutputKeys],
    humanReviewFocus: [...entry.outputContract.humanReviewFocus],
  },
  executionBoundary: {
    ...entry.executionBoundary,
    blockedCapabilities: [...entry.executionBoundary.blockedCapabilities],
  },
});

export const toAiAgentToolAccessResponseDto = (
  entry: AiAgentToolAccessView,
): AiAgentToolAccessResponseDto => ({
  tool: toAiToolRegistryResponseDto(entry.tool),
  accessLevel: entry.accessLevel,
  rationale: entry.rationale,
});
