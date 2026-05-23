import { AiApprovalPolicyEntry } from '@saas-platform/ai-domain';
import { AiAgentNotFoundError } from '../errors/ai-agent-not-found.error';
import {
  findAiAgentByKey,
  listAiApprovalPoliciesByAgentKey,
} from '../support/ai-agent-catalog';

export class GetAiApprovalPoliciesByAgentKeyUseCase {
  execute(agentKey: string): AiApprovalPolicyEntry[] {
    const agent = findAiAgentByKey(agentKey);

    if (!agent) {
      throw new AiAgentNotFoundError(agentKey);
    }

    return listAiApprovalPoliciesByAgentKey(agentKey);
  }
}
