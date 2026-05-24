import { AiSuggestionRunDetailView } from '@saas-platform/ai-domain';
import {
  AiApprovalRequestResponseDto,
  toAiApprovalRequestResponseDto,
} from './ai-approval-request.response';
import {
  AiSuggestionRunResponseDto,
  toAiSuggestionRunResponseDto,
} from './ai-suggestion-run.response';

export interface AiSuggestionRunDetailResponseDto
  extends AiSuggestionRunResponseDto {
  approvalRequests: AiApprovalRequestResponseDto[];
}

export const toAiSuggestionRunDetailResponseDto = (
  record: AiSuggestionRunDetailView,
): AiSuggestionRunDetailResponseDto => ({
  ...toAiSuggestionRunResponseDto(record),
  approvalRequests: record.approvalRequests.map((entry) =>
    toAiApprovalRequestResponseDto(entry),
  ),
});
