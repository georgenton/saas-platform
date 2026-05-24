import { AiToolDefinition } from '@saas-platform/ai-domain';
import { AiToolNotFoundError } from '../errors/ai-tool-not-found.error';
import { findAiToolRegistryEntryByKey } from '../support/ai-agent-catalog';

export class GetAiToolRegistryEntryByKeyUseCase {
  execute(toolKey: string): AiToolDefinition {
    const entry = findAiToolRegistryEntryByKey(toolKey);

    if (!entry) {
      throw new AiToolNotFoundError(toolKey);
    }

    return entry;
  }
}
