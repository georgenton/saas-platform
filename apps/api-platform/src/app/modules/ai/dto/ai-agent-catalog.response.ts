import { AiAgentCatalogEntry } from '@saas-platform/ai-domain';

export interface AiAgentCatalogResponseDto {
  key: string;
  title: string;
  summary: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  productKey: string;
  availability: 'ready' | 'planned';
  defaultMode: 'suggestion' | 'guarded_execution';
  supportedSurfaceKeys: string[];
}

export const toAiAgentCatalogResponseDto = (
  entry: AiAgentCatalogEntry,
): AiAgentCatalogResponseDto => ({
  ...entry,
  supportedSurfaceKeys: [...entry.supportedSurfaceKeys],
});
