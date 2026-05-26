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
  retrieval?: {
    retrievedAt: string;
    recordCount: number;
    policy: {
      version: 'v1';
      limit: number;
      suppressedDuplicateCount: number;
      archivedRecordCount: number;
      prioritizedRecordIds: string[];
      archivalSummary: string;
      rankingSummary: string;
    };
    records: {
      id: string;
      scope: 'tenant' | 'domain' | 'agent';
      domainKey: 'growth' | 'invoicing' | 'ecommerce' | null;
      agentKey: string | null;
      sourceKind: 'operator_note' | 'approval_memory' | 'guarded_execution_memory';
      freshness: 'working_memory' | 'durable_memory';
      title: string;
      summary: string;
      detail: string;
      tags: string[];
      lastUpdatedAt: string;
      inclusionReason: string;
    }[];
    notes: string[];
  };
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
  ...(envelope.retrieval
    ? {
        retrieval: {
          retrievedAt: toIsoString(envelope.retrieval.retrievedAt),
          recordCount: envelope.retrieval.recordCount,
          policy: {
            version: envelope.retrieval.policy.version,
            limit: envelope.retrieval.policy.limit,
            suppressedDuplicateCount:
              envelope.retrieval.policy.suppressedDuplicateCount,
            archivedRecordCount:
              envelope.retrieval.policy.archivedRecordCount,
            prioritizedRecordIds: [
              ...envelope.retrieval.policy.prioritizedRecordIds,
            ],
            archivalSummary: envelope.retrieval.policy.archivalSummary,
            rankingSummary: envelope.retrieval.policy.rankingSummary,
          },
          records: envelope.retrieval.records.map((entry) => ({
            id: entry.id,
            scope: entry.scope,
            domainKey: entry.domainKey,
            agentKey: entry.agentKey,
            sourceKind: entry.sourceKind,
            freshness: entry.freshness,
            title: entry.title,
            summary: entry.summary,
            detail: entry.detail,
            tags: [...entry.tags],
            lastUpdatedAt: toIsoString(entry.lastUpdatedAt),
            inclusionReason: entry.inclusionReason,
          })),
          notes: [...envelope.retrieval.notes],
        },
      }
    : {}),
});
