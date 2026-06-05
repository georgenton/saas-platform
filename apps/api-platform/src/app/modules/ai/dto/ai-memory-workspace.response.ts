import {
  AiApprovalRequestResponseDto,
  toAiApprovalRequestResponseDto,
} from './ai-approval-request.response';
import {
  AiSuggestionRunResponseDto,
  toAiSuggestionRunResponseDto,
} from './ai-suggestion-run.response';

export interface AiMemoryWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: string;
  productKey: string;
  availability: 'ready' | 'planned';
  defaultMode: 'suggestion' | 'guarded_execution';
  supportedSurfaceKeys: string[];
  promptPack: {
    key: string;
    version: string;
    mode: 'suggestion' | 'guarded_execution';
    title: string;
    summary: string;
  };
  toolAccessSummary: {
    allowedCount: number;
    approvalRequiredCount: number;
    blockedCount: number;
  };
  pendingApprovalRequestsCount: number;
  oldestPendingApprovalRequest: AiApprovalRequestResponseDto | null;
  latestReviewedApprovalRequest: AiApprovalRequestResponseDto | null;
  latestSuggestionRun: AiSuggestionRunResponseDto | null;
  recentActivityAt: string | null;
  memoryNotes: string[];
}

export interface AiMemoryWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalAgents: number;
    agentsWithSuggestionRuns: number;
    agentsWithPendingApprovals: number;
    totalPendingApprovalRequests: number;
  };
  agents: AiMemoryWorkspaceAgentResponseDto[];
}

export function toAiMemoryWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalAgents: number;
    agentsWithSuggestionRuns: number;
    agentsWithPendingApprovals: number;
    totalPendingApprovalRequests: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: string;
    productKey: string;
    availability: 'ready' | 'planned';
    defaultMode: 'suggestion' | 'guarded_execution';
    supportedSurfaceKeys: string[];
    promptPack: {
      key: string;
      version: string;
      mode: 'suggestion' | 'guarded_execution';
      title: string;
      summary: string;
    };
    toolAccessSummary: {
      allowedCount: number;
      approvalRequiredCount: number;
      blockedCount: number;
    };
    pendingApprovalRequestsCount: number;
    oldestPendingApprovalRequest: Parameters<
      typeof toAiApprovalRequestResponseDto
    >[0] | null;
    latestReviewedApprovalRequest: Parameters<
      typeof toAiApprovalRequestResponseDto
    >[0] | null;
    latestSuggestionRun: Parameters<typeof toAiSuggestionRunResponseDto>[0] | null;
    recentActivityAt: Date | null;
    memoryNotes: string[];
  }>;
}): AiMemoryWorkspaceResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    generatedAt: input.generatedAt.toISOString(),
    counts: input.counts,
    agents: input.agents.map((entry) => ({
      agentKey: entry.agentKey,
      title: entry.title,
      domainKey: entry.domainKey,
      productKey: entry.productKey,
      availability: entry.availability,
      defaultMode: entry.defaultMode,
      supportedSurfaceKeys: [...entry.supportedSurfaceKeys],
      promptPack: { ...entry.promptPack },
      toolAccessSummary: { ...entry.toolAccessSummary },
      pendingApprovalRequestsCount: entry.pendingApprovalRequestsCount,
      oldestPendingApprovalRequest: entry.oldestPendingApprovalRequest
        ? toAiApprovalRequestResponseDto(entry.oldestPendingApprovalRequest)
        : null,
      latestReviewedApprovalRequest: entry.latestReviewedApprovalRequest
        ? toAiApprovalRequestResponseDto(entry.latestReviewedApprovalRequest)
        : null,
      latestSuggestionRun: entry.latestSuggestionRun
        ? toAiSuggestionRunResponseDto(entry.latestSuggestionRun)
        : null,
      recentActivityAt: entry.recentActivityAt?.toISOString() ?? null,
      memoryNotes: [...entry.memoryNotes],
    })),
  };
}
