import { AiPromptRegistryEntry } from '@saas-platform/ai-domain';
import { AI_PROMPT_REGISTRY } from '../support/ai-agent-catalog';

export class ListAiPromptRegistryUseCase {
  execute(): AiPromptRegistryEntry[] {
    return AI_PROMPT_REGISTRY.map((entry) => ({
      ...entry,
      styleGuidance: [...entry.styleGuidance],
      constraints: [...entry.constraints],
      suggestedOutputs: entry.suggestedOutputs.map((output) => ({ ...output })),
    }));
  }
}
