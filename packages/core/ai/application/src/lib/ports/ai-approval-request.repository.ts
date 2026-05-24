import {
  AiApprovalRequestRecord,
  AiApprovalRequestStatus,
  CreateAiApprovalRequestCommand,
  ReviewAiApprovalRequestCommand,
} from '@saas-platform/ai-domain';

export interface AiApprovalRequestRepository {
  create(
    command: CreateAiApprovalRequestCommand,
  ): Promise<AiApprovalRequestRecord>;
  findByTenantIdAndAgentKey(
    tenantId: string,
    agentKey: string,
    options?: {
      limit?: number | null;
      status?: AiApprovalRequestStatus | null;
    },
  ): Promise<AiApprovalRequestRecord[]>;
  findBySuggestionRunIds(
    tenantId: string,
    agentKey: string,
    suggestionRunIds: string[],
  ): Promise<AiApprovalRequestRecord[]>;
  findByIdAndTenantIdAndAgentKey(
    requestId: string,
    tenantId: string,
    agentKey: string,
  ): Promise<AiApprovalRequestRecord | null>;
  findPendingBySuggestionRunId(
    suggestionRunId: string,
    tenantId: string,
    agentKey: string,
  ): Promise<AiApprovalRequestRecord | null>;
  review(
    command: ReviewAiApprovalRequestCommand,
  ): Promise<AiApprovalRequestRecord>;
}
