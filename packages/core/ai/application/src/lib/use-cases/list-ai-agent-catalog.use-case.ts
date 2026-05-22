import { AiAgentCatalogEntry } from '@saas-platform/ai-domain';
import { AI_AGENT_CATALOG } from '../support/ai-agent-catalog';

export class ListAiAgentCatalogUseCase {
  execute(): AiAgentCatalogEntry[] {
    return AI_AGENT_CATALOG.map((entry) => ({
      ...entry,
      supportedSurfaceKeys: [...entry.supportedSurfaceKeys],
    }));
  }
}
