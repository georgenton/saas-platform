import { AiPromptRegistryEntry } from '@saas-platform/ai-domain';
import { AiAgentNotFoundError } from '../errors/ai-agent-not-found.error';
import { findAiPromptRegistryEntryByAgentKey } from '../support/ai-agent-catalog';

export class GetAiPromptRegistryEntryByAgentKeyUseCase {
  execute(agentKey: string): AiPromptRegistryEntry {
    const entry = findAiPromptRegistryEntryByAgentKey(agentKey);

    if (!entry) {
      throw new AiAgentNotFoundError(agentKey);
    }

    return {
      ...entry,
      styleGuidance: [...entry.styleGuidance],
      constraints: [...entry.constraints],
      suggestedOutputs: entry.suggestedOutputs.map((output) => ({ ...output })),
    };
  }
}
