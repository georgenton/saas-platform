import { AiAgentToolAccessEntry, AiToolDefinition } from '@saas-platform/ai-domain';
import { AiAgentNotFoundError } from '../errors/ai-agent-not-found.error';
import {
  findAiAgentByKey,
  listAiAgentToolAccessByAgentKey,
} from '../support/ai-agent-catalog';

export interface AiAgentToolAccessView {
  tool: AiToolDefinition;
  accessLevel: AiAgentToolAccessEntry['accessLevel'];
  rationale: string;
}

export class GetAiAgentToolAccessByAgentKeyUseCase {
  execute(agentKey: string): AiAgentToolAccessView[] {
    const agent = findAiAgentByKey(agentKey);

    if (!agent) {
      throw new AiAgentNotFoundError(agentKey);
    }

    return listAiAgentToolAccessByAgentKey(agentKey).map((entry) => ({
      tool: { ...entry.tool },
      accessLevel: entry.accessLevel,
      rationale: entry.rationale,
    }));
  }
}
