import { AiSuggestionRunDetailView } from '@saas-platform/ai-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiAgentNotFoundError } from '../errors/ai-agent-not-found.error';
import { AiSuggestionRunNotFoundError } from '../errors/ai-suggestion-run-not-found.error';
import { AiApprovalRequestRepository } from '../ports/ai-approval-request.repository';
import { AiSuggestionRunRepository } from '../ports/ai-suggestion-run.repository';
import { findAiAgentByKey } from '../support/ai-agent-catalog';
import {
  buildAiSuggestionRunApprovalSummary,
} from './list-tenant-ai-suggestion-runs.use-case';

export class GetTenantAiSuggestionRunDetailUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiSuggestionRunRepository: AiSuggestionRunRepository,
    private readonly aiApprovalRequestRepository: AiApprovalRequestRepository,
  ) {}

  async execute(
    tenantSlug: string,
    agentKey: string,
    suggestionRunId: string,
  ): Promise<AiSuggestionRunDetailView> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const agent = findAiAgentByKey(agentKey);

    if (!agent) {
      throw new AiAgentNotFoundError(agentKey);
    }

    const suggestionRun =
      await this.aiSuggestionRunRepository.findByIdAndTenantIdAndAgentKey(
        suggestionRunId,
        tenant.id,
        agent.key,
      );

    if (!suggestionRun) {
      throw new AiSuggestionRunNotFoundError(suggestionRunId);
    }

    const approvalRequests =
      await this.aiApprovalRequestRepository.findBySuggestionRunIds(
        tenant.id,
        agent.key,
        [suggestionRun.id],
      );

    return {
      ...suggestionRun,
      approvalSummary: buildAiSuggestionRunApprovalSummary(approvalRequests),
      approvalRequests,
    };
  }
}
