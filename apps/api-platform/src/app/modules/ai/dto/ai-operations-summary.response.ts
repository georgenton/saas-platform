import {
  AiActionCenterResponseDto,
  toAiActionCenterResponseDto,
} from './ai-action-center.response';
import {
  AiApprovalRequestResponseDto,
  toAiApprovalRequestResponseDto,
} from './ai-approval-request.response';
import { AiApprovalWorkspaceAgentSummaryResponseDto } from './ai-approval-workspace.response';
import { AiHandoffWorkspaceAgentSummaryResponseDto } from './ai-handoff-workspace.response';
import {
  AiSuggestionRunResponseDto,
  toAiSuggestionRunResponseDto,
} from './ai-suggestion-run.response';

export interface AiOperationsSummaryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  actionCenter: AiActionCenterResponseDto;
  handoffWorkspace: {
    counts: {
      totalSuggestionRuns: number;
      reviewableSuggestionRuns: number;
      pendingApprovalSuggestionRuns: number;
      approvedSuggestionRuns: number;
    };
    agentBreakdown: AiHandoffWorkspaceAgentSummaryResponseDto[];
    latestSuggestionRun: AiSuggestionRunResponseDto | null;
  };
  approvalWorkspace: {
    counts: {
      totalApprovalRequests: number;
      pendingApprovalRequests: number;
      approvedApprovalRequests: number;
      rejectedApprovalRequests: number;
    };
    agentBreakdown: AiApprovalWorkspaceAgentSummaryResponseDto[];
    oldestPendingApprovalRequest: AiApprovalRequestResponseDto | null;
    latestReviewedApprovalRequest: AiApprovalRequestResponseDto | null;
  };
}

export function toAiOperationsSummaryResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  actionCenter: Parameters<typeof toAiActionCenterResponseDto>[0];
  handoffWorkspace: {
    counts: {
      totalSuggestionRuns: number;
      reviewableSuggestionRuns: number;
      pendingApprovalSuggestionRuns: number;
      approvedSuggestionRuns: number;
    };
    agentBreakdown: AiHandoffWorkspaceAgentSummaryResponseDto[];
    latestSuggestionRun?: Parameters<typeof toAiSuggestionRunResponseDto>[0] | null;
  };
  approvalWorkspace: {
    counts: {
      totalApprovalRequests: number;
      pendingApprovalRequests: number;
      approvedApprovalRequests: number;
      rejectedApprovalRequests: number;
    };
    agentBreakdown: AiApprovalWorkspaceAgentSummaryResponseDto[];
    oldestPendingApprovalRequest?: Parameters<
      typeof toAiApprovalRequestResponseDto
    >[0] | null;
    latestReviewedApprovalRequest?: Parameters<
      typeof toAiApprovalRequestResponseDto
    >[0] | null;
  };
}): AiOperationsSummaryResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    generatedAt: input.generatedAt.toISOString(),
    actionCenter: toAiActionCenterResponseDto(input.actionCenter),
    handoffWorkspace: {
      counts: input.handoffWorkspace.counts,
      agentBreakdown: input.handoffWorkspace.agentBreakdown,
      latestSuggestionRun: input.handoffWorkspace.latestSuggestionRun
        ? toAiSuggestionRunResponseDto(input.handoffWorkspace.latestSuggestionRun)
        : null,
    },
    approvalWorkspace: {
      counts: input.approvalWorkspace.counts,
      agentBreakdown: input.approvalWorkspace.agentBreakdown,
      oldestPendingApprovalRequest: input.approvalWorkspace
        .oldestPendingApprovalRequest
        ? toAiApprovalRequestResponseDto(
            input.approvalWorkspace.oldestPendingApprovalRequest,
          )
        : null,
      latestReviewedApprovalRequest: input.approvalWorkspace
        .latestReviewedApprovalRequest
        ? toAiApprovalRequestResponseDto(
            input.approvalWorkspace.latestReviewedApprovalRequest,
          )
        : null,
    },
  };
}
