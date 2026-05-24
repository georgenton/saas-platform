import { TenantAiSuggestionEnvelope } from '@saas-platform/ai-domain';

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

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
    agentKey: string;
    mode: 'suggestion' | 'guarded_execution';
    title: string;
    summary: string;
    objective: string;
    styleGuidance: string[];
    constraints: string[];
    suggestedOutputs: {
      key: string;
      label: string;
      description: string;
    }[];
  };
  toolAccess: {
    tool: {
      key: string;
      title: string;
      summary: string;
      domainKey: 'growth' | 'invoicing' | 'ecommerce';
      availability: 'ready' | 'planned';
      riskLevel: 'low' | 'medium' | 'high';
      actionKind: 'read' | 'draft' | 'propose' | 'execute';
      requiresApproval: boolean;
    };
    accessLevel: 'allowed' | 'approval_required' | 'blocked';
    rationale: string;
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
  generatedAt: toIsoString(envelope.generatedAt),
  mode: envelope.mode,
  agent: {
    ...envelope.agent,
    supportedSurfaceKeys: [...envelope.agent.supportedSurfaceKeys],
  },
  surface: {
    ...envelope.surface,
    sourceGeneratedAt: toIsoString(envelope.surface.sourceGeneratedAt),
  },
  promptPack: {
    ...envelope.promptPack,
    styleGuidance: [...envelope.promptPack.styleGuidance],
    constraints: [...envelope.promptPack.constraints],
    suggestedOutputs: envelope.promptPack.suggestedOutputs.map((entry) => ({
      ...entry,
    })),
  },
  toolAccess: (envelope.toolAccess ?? []).map((entry) => ({
    tool: {
      ...entry.tool,
    },
    accessLevel: entry.accessLevel,
    rationale: entry.rationale,
  })),
  contextBlocks: envelope.contextBlocks.map((entry) => ({
    ...entry,
    bullets: [...entry.bullets],
  })),
});
