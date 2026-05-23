import { AiToolDefinition } from '@saas-platform/ai-domain';
import { listAiToolRegistry } from '../support/ai-agent-catalog';

export class ListAiToolRegistryUseCase {
  execute(): AiToolDefinition[] {
    return listAiToolRegistry();
  }
}
