import {
  AiApprovalRequestResponseDto,
  toAiApprovalRequestResponseDto,
} from './ai-approval-request.response';
import {
  AiSuggestionRunResponseDto,
  toAiSuggestionRunResponseDto,
} from './ai-suggestion-run.response';

export interface AiActionCenterResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    pendingApprovalRequests: number;
    reviewableSuggestionRuns: number;
    reviewedApprovalRequests: number;
  };
  featuredPendingApprovalRequest: AiApprovalRequestResponseDto | null;
  featuredReviewableSuggestionRun: AiSuggestionRunResponseDto | null;
  latestReviewedApprovalRequest: AiApprovalRequestResponseDto | null;
}

export function toAiActionCenterResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    pendingApprovalRequests: number;
    reviewableSuggestionRuns: number;
    reviewedApprovalRequests: number;
  };
  featuredPendingApprovalRequest?: Parameters<
    typeof toAiApprovalRequestResponseDto
  >[0] | null;
  featuredReviewableSuggestionRun?: Parameters<
    typeof toAiSuggestionRunResponseDto
  >[0] | null;
  latestReviewedApprovalRequest?: Parameters<
    typeof toAiApprovalRequestResponseDto
  >[0] | null;
}): AiActionCenterResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    generatedAt: input.generatedAt.toISOString(),
    counts: input.counts,
    featuredPendingApprovalRequest: input.featuredPendingApprovalRequest
      ? toAiApprovalRequestResponseDto(input.featuredPendingApprovalRequest)
      : null,
    featuredReviewableSuggestionRun: input.featuredReviewableSuggestionRun
      ? toAiSuggestionRunResponseDto(input.featuredReviewableSuggestionRun)
      : null,
    latestReviewedApprovalRequest: input.latestReviewedApprovalRequest
      ? toAiApprovalRequestResponseDto(input.latestReviewedApprovalRequest)
      : null,
  };
}
