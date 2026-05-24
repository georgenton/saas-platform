import {
  AiApprovalRequestRecord,
  AiSuggestionRunApprovalSummary,
  AiSuggestionRunHistoryEntry,
} from '@saas-platform/ai-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiApprovalRequestRepository } from '../ports/ai-approval-request.repository';
import { AiSuggestionRunRepository } from '../ports/ai-suggestion-run.repository';

export class ListTenantAiSuggestionRunsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiSuggestionRunRepository: AiSuggestionRunRepository,
    private readonly aiApprovalRequestRepository: AiApprovalRequestRepository,
  ) {}

  async execute(
    tenantSlug: string,
    agentKey: string,
    limit?: number | null,
  ): Promise<AiSuggestionRunHistoryEntry[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const records = await this.aiSuggestionRunRepository.findByTenantIdAndAgentKey(
      tenant.id,
      agentKey,
      limit,
    );

    const approvalRequests =
      await this.aiApprovalRequestRepository.findBySuggestionRunIds(
        tenant.id,
        agentKey,
        records.map((entry) => entry.id),
      );

    const approvalRequestsByRunId = new Map<string, AiApprovalRequestRecord[]>();

    for (const approvalRequest of approvalRequests) {
      const current =
        approvalRequestsByRunId.get(approvalRequest.suggestionRunId) ?? [];

      current.push(approvalRequest);
      approvalRequestsByRunId.set(approvalRequest.suggestionRunId, current);
    }

    return records.map((record) => ({
      ...record,
      approvalSummary: buildAiSuggestionRunApprovalSummary(
        approvalRequestsByRunId.get(record.id) ?? [],
      ),
    }));
  }
}

export function buildInitialAiSuggestionRunApprovalSummary(): AiSuggestionRunApprovalSummary {
  return {
    status: 'not_requested',
    totalRequests: 0,
    latestRequestId: null,
    latestPolicyKey: null,
    latestRequestedAt: null,
    latestReviewedAt: null,
  };
}

export function buildAiSuggestionRunApprovalSummary(
  requests: AiApprovalRequestRecord[],
): AiSuggestionRunApprovalSummary {
  const latestRequest = requests[0] ?? null;

  if (!latestRequest) {
    return buildInitialAiSuggestionRunApprovalSummary();
  }

  return {
    status: latestRequest.status,
    totalRequests: requests.length,
    latestRequestId: latestRequest.id,
    latestPolicyKey: latestRequest.policyKey,
    latestRequestedAt: latestRequest.createdAt,
    latestReviewedAt: latestRequest.reviewedAt,
  };
}
