import {
  AiApprovalRequestResponseDto,
  toAiApprovalRequestResponseDto,
} from './ai-approval-request.response';

export interface AiApprovalWorkspaceAgentSummaryResponseDto {
  agentKey: string;
  title: string;
  totalApprovalRequests: number;
  pendingApprovalRequests: number;
  approvedApprovalRequests: number;
  rejectedApprovalRequests: number;
  latestRequestedAt: string | null;
  latestReviewedAt: string | null;
}

export interface AiApprovalWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalApprovalRequests: number;
    pendingApprovalRequests: number;
    approvedApprovalRequests: number;
    rejectedApprovalRequests: number;
  };
  agentBreakdown: AiApprovalWorkspaceAgentSummaryResponseDto[];
  oldestPendingApprovalRequest: AiApprovalRequestResponseDto | null;
  latestReviewedApprovalRequest: AiApprovalRequestResponseDto | null;
  recentApprovalRequests: AiApprovalRequestResponseDto[];
}

export function toAiApprovalWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalApprovalRequests: number;
    pendingApprovalRequests: number;
    approvedApprovalRequests: number;
    rejectedApprovalRequests: number;
  };
  agentBreakdown: Array<{
    agentKey: string;
    title: string;
    totalApprovalRequests: number;
    pendingApprovalRequests: number;
    approvedApprovalRequests: number;
    rejectedApprovalRequests: number;
    latestRequestedAt: Date | null;
    latestReviewedAt: Date | null;
  }>;
  oldestPendingApprovalRequest?: Parameters<
    typeof toAiApprovalRequestResponseDto
  >[0] | null;
  latestReviewedApprovalRequest?: Parameters<
    typeof toAiApprovalRequestResponseDto
  >[0] | null;
  recentApprovalRequests: Parameters<typeof toAiApprovalRequestResponseDto>[0][];
}): AiApprovalWorkspaceResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    generatedAt: input.generatedAt.toISOString(),
    counts: input.counts,
    agentBreakdown: input.agentBreakdown.map((entry) => ({
      agentKey: entry.agentKey,
      title: entry.title,
      totalApprovalRequests: entry.totalApprovalRequests,
      pendingApprovalRequests: entry.pendingApprovalRequests,
      approvedApprovalRequests: entry.approvedApprovalRequests,
      rejectedApprovalRequests: entry.rejectedApprovalRequests,
      latestRequestedAt: entry.latestRequestedAt?.toISOString() ?? null,
      latestReviewedAt: entry.latestReviewedAt?.toISOString() ?? null,
    })),
    oldestPendingApprovalRequest: input.oldestPendingApprovalRequest
      ? toAiApprovalRequestResponseDto(input.oldestPendingApprovalRequest)
      : null,
    latestReviewedApprovalRequest: input.latestReviewedApprovalRequest
      ? toAiApprovalRequestResponseDto(input.latestReviewedApprovalRequest)
      : null,
    recentApprovalRequests: input.recentApprovalRequests.map((entry) =>
      toAiApprovalRequestResponseDto(entry),
    ),
  };
}
