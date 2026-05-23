import { AiApprovalRequestRecord } from '@saas-platform/ai-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiApprovalRequestAlreadyPendingError } from '../errors/ai-approval-request-already-pending.error';
import { AiAgentNotFoundError } from '../errors/ai-agent-not-found.error';
import { AiApprovalPolicyNotFoundError } from '../errors/ai-approval-policy-not-found.error';
import { AiSuggestionRunNotFoundError } from '../errors/ai-suggestion-run-not-found.error';
import { AiApprovalRequestRepository } from '../ports/ai-approval-request.repository';
import { AiSuggestionRunRepository } from '../ports/ai-suggestion-run.repository';
import { findAiAgentByKey, listAiApprovalPoliciesByAgentKey } from '../support/ai-agent-catalog';

export interface RequestTenantAiSuggestionRunApprovalCommand {
  tenantSlug: string;
  agentKey: string;
  suggestionRunId: string;
  requestedByUserId: string;
  requestedByEmail: string | null;
  rationale: string | null;
}

export class RequestTenantAiSuggestionRunApprovalUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiSuggestionRunRepository: AiSuggestionRunRepository,
    private readonly aiApprovalRequestRepository: AiApprovalRequestRepository,
  ) {}

  async execute(
    command: RequestTenantAiSuggestionRunApprovalCommand,
  ): Promise<AiApprovalRequestRecord> {
    const tenant = await this.tenantRepository.findBySlug(command.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(command.tenantSlug);
    }

    const agent = findAiAgentByKey(command.agentKey);

    if (!agent) {
      throw new AiAgentNotFoundError(command.agentKey);
    }

    const policy = listAiApprovalPoliciesByAgentKey(command.agentKey).find(
      (entry) => entry.scope === 'suggestion_review',
    );

    if (!policy) {
      throw new AiApprovalPolicyNotFoundError(command.agentKey);
    }

    const suggestionRun =
      await this.aiSuggestionRunRepository.findByIdAndTenantIdAndAgentKey(
        command.suggestionRunId,
        tenant.id,
        command.agentKey,
      );

    if (!suggestionRun) {
      throw new AiSuggestionRunNotFoundError(command.suggestionRunId);
    }

    const pendingRequest =
      await this.aiApprovalRequestRepository.findPendingBySuggestionRunId(
        suggestionRun.id,
        tenant.id,
        command.agentKey,
      );

    if (pendingRequest) {
      throw new AiApprovalRequestAlreadyPendingError(suggestionRun.id);
    }

    return this.aiApprovalRequestRepository.create({
      tenantId: tenant.id,
      tenantSlug: command.tenantSlug,
      agentKey: command.agentKey,
      policyKey: policy.policyKey,
      scope: 'suggestion_review',
      suggestionRunId: suggestionRun.id,
      requestedByUserId: command.requestedByUserId,
      requestedByEmail: command.requestedByEmail,
      rationale: command.rationale,
      summary: this.buildSummary(agent.title, suggestionRun.id, policy.policyKey),
      status: 'pending',
    });
  }

  private buildSummary(
    agentTitle: string,
    suggestionRunId: string,
    policyKey: string,
  ): string {
    return `${agentTitle} requested human review for suggestion handoff ${suggestionRunId} under policy ${policyKey}.`;
  }
}
