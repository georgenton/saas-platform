export type AiDomainKey = 'growth' | 'invoicing' | 'ecommerce';

export type AiAgentAvailability = 'ready' | 'planned';

export type AiAgentMode = 'suggestion' | 'guarded_execution';

export interface AiAgentCatalogEntry {
  key: string;
  title: string;
  summary: string;
  domainKey: AiDomainKey;
  productKey: string;
  availability: AiAgentAvailability;
  defaultMode: AiAgentMode;
  supportedSurfaceKeys: string[];
}

export interface AiSuggestionOutputDescriptor {
  key: string;
  label: string;
  description: string;
}

export interface AiSuggestionContextBlock {
  key: string;
  title: string;
  detail: string;
  bullets: string[];
}

export interface TenantAiSuggestionEnvelope {
  tenantSlug: string;
  generatedAt: Date;
  mode: 'suggestion';
  agent: AiAgentCatalogEntry;
  surface: {
    key: string;
    title: string;
    sourceContractKey: string;
    sourceGeneratedAt: Date;
  };
  promptPack: {
    key: string;
    version: string;
  };
  objective: string;
  constraints: string[];
  suggestedOutputs: AiSuggestionOutputDescriptor[];
  contextBlocks: AiSuggestionContextBlock[];
}
