import {
  AiApprovalRequestRecord,
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
    limit?: number | null,
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
