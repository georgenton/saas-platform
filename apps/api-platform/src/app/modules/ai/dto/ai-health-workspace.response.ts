import {
  AiApprovalRequestResponseDto,
  toAiApprovalRequestResponseDto,
} from './ai-approval-request.response';
import {
  AiSuggestionRunResponseDto,
  toAiSuggestionRunResponseDto,
} from './ai-suggestion-run.response';

export interface AiHealthWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  status: 'healthy' | 'warning' | 'critical';
  pendingApprovalRequestsCount: number;
  reviewableSuggestionRunsCount: number;
  toolAccessSummary: {
    allowedCount: number;
    approvalRequiredCount: number;
    blockedCount: number;
  };
  recentActivityAt: string | null;
  oldestPendingApprovalRequest: AiApprovalRequestResponseDto | null;
  latestSuggestionRun: AiSuggestionRunResponseDto | null;
  notes: string[];
}

export interface AiHealthWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  overallStatus: 'healthy' | 'warning' | 'critical';
  counts: {
    totalAgents: number;
    healthyAgents: number;
    warningAgents: number;
    criticalAgents: number;
  };
  agents: AiHealthWorkspaceAgentResponseDto[];
}

export function toAiHealthWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  overallStatus: 'healthy' | 'warning' | 'critical';
  counts: {
    totalAgents: number;
    healthyAgents: number;
    warningAgents: number;
    criticalAgents: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    status: 'healthy' | 'warning' | 'critical';
    pendingApprovalRequestsCount: number;
    reviewableSuggestionRunsCount: number;
    toolAccessSummary: {
      allowedCount: number;
      approvalRequiredCount: number;
      blockedCount: number;
    };
    recentActivityAt: Date | null;
    oldestPendingApprovalRequest: Parameters<
      typeof toAiApprovalRequestResponseDto
    >[0] | null;
    latestSuggestionRun: Parameters<typeof toAiSuggestionRunResponseDto>[0] | null;
    notes: string[];
  }>;
}): AiHealthWorkspaceResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    generatedAt: input.generatedAt.toISOString(),
    overallStatus: input.overallStatus,
    counts: input.counts,
    agents: input.agents.map((entry) => ({
      agentKey: entry.agentKey,
      title: entry.title,
      domainKey: entry.domainKey,
      status: entry.status,
      pendingApprovalRequestsCount: entry.pendingApprovalRequestsCount,
      reviewableSuggestionRunsCount: entry.reviewableSuggestionRunsCount,
      toolAccessSummary: { ...entry.toolAccessSummary },
      recentActivityAt: entry.recentActivityAt?.toISOString() ?? null,
      oldestPendingApprovalRequest: entry.oldestPendingApprovalRequest
        ? toAiApprovalRequestResponseDto(entry.oldestPendingApprovalRequest)
        : null,
      latestSuggestionRun: entry.latestSuggestionRun
        ? toAiSuggestionRunResponseDto(entry.latestSuggestionRun)
        : null,
      notes: [...entry.notes],
    })),
  };
}
