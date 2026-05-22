import { TenantAiSuggestionEnvelope } from '@saas-platform/ai-domain';

export interface AiSuggestionEnvelopeResponseDto {
  tenantSlug: string;
  generatedAt: string;
  mode: 'suggestion';
  agent: {
    key: string;
    title: string;
    summary: string;
    domainKey: 'growth' | 'invoicing' | 'ecommerce';
    productKey: string;
    availability: 'ready' | 'planned';
    defaultMode: 'suggestion' | 'guarded_execution';
    supportedSurfaceKeys: string[];
  };
  surface: {
    key: string;
    title: string;
    sourceContractKey: string;
    sourceGeneratedAt: string;
  };
  promptPack: {
    key: string;
    version: string;
  };
  objective: string;
  constraints: string[];
  suggestedOutputs: {
    key: string;
    label: string;
    description: string;
  }[];
  contextBlocks: {
    key: string;
    title: string;
    detail: string;
    bullets: string[];
  }[];
}

export const toAiSuggestionEnvelopeResponseDto = (
  envelope: TenantAiSuggestionEnvelope,
): AiSuggestionEnvelopeResponseDto => ({
  tenantSlug: envelope.tenantSlug,
  generatedAt: envelope.generatedAt.toISOString(),
  mode: envelope.mode,
  agent: {
    ...envelope.agent,
    supportedSurfaceKeys: [...envelope.agent.supportedSurfaceKeys],
  },
  surface: {
    ...envelope.surface,
    sourceGeneratedAt: envelope.surface.sourceGeneratedAt.toISOString(),
  },
  promptPack: { ...envelope.promptPack },
  objective: envelope.objective,
  constraints: [...envelope.constraints],
  suggestedOutputs: envelope.suggestedOutputs.map((entry) => ({ ...entry })),
  contextBlocks: envelope.contextBlocks.map((entry) => ({
    ...entry,
    bullets: [...entry.bullets],
  })),
});
