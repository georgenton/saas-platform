import {
  AiApprovalRequestResponseDto,
  toAiApprovalRequestResponseDto,
} from './ai-approval-request.response';

export interface AiEvaluationWorkspaceAgentResponseDto {
  agentKey: string;
  title: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  status: 'healthy' | 'warning' | 'critical';
  reviewedApprovalRequestsCount: number;
  approvedReviewedApprovalRequestsCount: number;
  rejectedReviewedApprovalRequestsCount: number;
  approvalRatePercentage: number | null;
  latestReviewedAt: string | null;
  latestReviewedApprovalRequest: AiApprovalRequestResponseDto | null;
  notes: string[];
}

export interface AiEvaluationWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  overallStatus: 'healthy' | 'warning' | 'critical';
  counts: {
    totalAgents: number;
    agentsWithReviewedOutcomes: number;
    reviewedApprovalRequests: number;
    approvedReviewedApprovalRequests: number;
    rejectedReviewedApprovalRequests: number;
  };
  agents: AiEvaluationWorkspaceAgentResponseDto[];
}

export function toAiEvaluationWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  overallStatus: 'healthy' | 'warning' | 'critical';
  counts: {
    totalAgents: number;
    agentsWithReviewedOutcomes: number;
    reviewedApprovalRequests: number;
    approvedReviewedApprovalRequests: number;
    rejectedReviewedApprovalRequests: number;
  };
  agents: Array<{
    agentKey: string;
    title: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    status: 'healthy' | 'warning' | 'critical';
    reviewedApprovalRequestsCount: number;
    approvedReviewedApprovalRequestsCount: number;
    rejectedReviewedApprovalRequestsCount: number;
    approvalRatePercentage: number | null;
    latestReviewedAt: Date | null;
    latestReviewedApprovalRequest: Parameters<
      typeof toAiApprovalRequestResponseDto
    >[0] | null;
    notes: string[];
  }>;
}): AiEvaluationWorkspaceResponseDto {
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
      reviewedApprovalRequestsCount: entry.reviewedApprovalRequestsCount,
      approvedReviewedApprovalRequestsCount:
        entry.approvedReviewedApprovalRequestsCount,
      rejectedReviewedApprovalRequestsCount:
        entry.rejectedReviewedApprovalRequestsCount,
      approvalRatePercentage: entry.approvalRatePercentage,
      latestReviewedAt: entry.latestReviewedAt?.toISOString() ?? null,
      latestReviewedApprovalRequest: entry.latestReviewedApprovalRequest
        ? toAiApprovalRequestResponseDto(entry.latestReviewedApprovalRequest)
        : null,
      notes: [...entry.notes],
    })),
  };
}
