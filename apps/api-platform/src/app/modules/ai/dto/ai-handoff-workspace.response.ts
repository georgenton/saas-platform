import {
  AiSuggestionRunResponseDto,
  toAiSuggestionRunResponseDto,
} from './ai-suggestion-run.response';

export interface AiHandoffWorkspaceAgentSummaryResponseDto {
  agentKey: string;
  title: string;
  totalSuggestionRuns: number;
  reviewableSuggestionRuns: number;
  pendingApprovalSuggestionRuns: number;
  approvedSuggestionRuns: number;
  latestGeneratedAt: string | null;
}

export interface AiHandoffWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalSuggestionRuns: number;
    reviewableSuggestionRuns: number;
    pendingApprovalSuggestionRuns: number;
    approvedSuggestionRuns: number;
  };
  agentBreakdown: AiHandoffWorkspaceAgentSummaryResponseDto[];
  recentSuggestionRuns: AiSuggestionRunResponseDto[];
}

export function toAiHandoffWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalSuggestionRuns: number;
    reviewableSuggestionRuns: number;
    pendingApprovalSuggestionRuns: number;
    approvedSuggestionRuns: number;
  };
  agentBreakdown: Array<{
    agentKey: string;
    title: string;
    totalSuggestionRuns: number;
    reviewableSuggestionRuns: number;
    pendingApprovalSuggestionRuns: number;
    approvedSuggestionRuns: number;
    latestGeneratedAt: Date | null;
  }>;
  recentSuggestionRuns: Parameters<typeof toAiSuggestionRunResponseDto>[0][];
}): AiHandoffWorkspaceResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    generatedAt: input.generatedAt.toISOString(),
    counts: input.counts,
    agentBreakdown: input.agentBreakdown.map((entry) => ({
      agentKey: entry.agentKey,
      title: entry.title,
      totalSuggestionRuns: entry.totalSuggestionRuns,
      reviewableSuggestionRuns: entry.reviewableSuggestionRuns,
      pendingApprovalSuggestionRuns: entry.pendingApprovalSuggestionRuns,
      approvedSuggestionRuns: entry.approvedSuggestionRuns,
      latestGeneratedAt: entry.latestGeneratedAt?.toISOString() ?? null,
    })),
    recentSuggestionRuns: input.recentSuggestionRuns.map((entry) =>
      toAiSuggestionRunResponseDto(entry),
    ),
  };
}
