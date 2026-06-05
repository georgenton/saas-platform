import { AiMemoryRecord, AiMemoryRetrieval } from '@saas-platform/ai-domain';

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

export interface AiMemoryRecordResponseDto {
  id: string;
  tenantSlug: string;
  scope: 'tenant' | 'domain' | 'agent';
  domainKey: string | null;
  agentKey: string | null;
  sourceKind: 'operator_note' | 'approval_memory' | 'guarded_execution_memory';
  freshness: 'working_memory' | 'durable_memory';
  title: string;
  summary: string;
  detail: string;
  tags: string[];
  status: 'active' | 'inactive';
  createdByUserId: string | null;
  createdByEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AiMemoryRetrievalResponseDto {
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
  records: Array<{
    id: string;
    scope: 'tenant' | 'domain' | 'agent';
    domainKey: string | null;
    agentKey: string | null;
    sourceKind: 'operator_note' | 'approval_memory' | 'guarded_execution_memory';
    freshness: 'working_memory' | 'durable_memory';
    title: string;
    summary: string;
    detail: string;
    tags: string[];
    lastUpdatedAt: string;
    inclusionReason: string;
  }>;
  notes: string[];
}

export const toAiMemoryRecordResponseDto = (
  record: AiMemoryRecord,
): AiMemoryRecordResponseDto => ({
  id: record.id,
  tenantSlug: record.tenantSlug,
  scope: record.scope,
  domainKey: record.domainKey,
  agentKey: record.agentKey,
  sourceKind: record.sourceKind,
  freshness: record.freshness,
  title: record.title,
  summary: record.summary,
  detail: record.detail,
  tags: [...record.tags],
  status: record.status,
  createdByUserId: record.createdByUserId,
  createdByEmail: record.createdByEmail,
  createdAt: toIsoString(record.createdAt),
  updatedAt: toIsoString(record.updatedAt),
});

export const toAiMemoryRetrievalResponseDto = (
  retrieval: AiMemoryRetrieval,
): AiMemoryRetrievalResponseDto => ({
  retrievedAt: toIsoString(retrieval.retrievedAt),
  recordCount: retrieval.recordCount,
  policy: {
    version: retrieval.policy.version,
    limit: retrieval.policy.limit,
    suppressedDuplicateCount: retrieval.policy.suppressedDuplicateCount,
    archivedRecordCount: retrieval.policy.archivedRecordCount,
    prioritizedRecordIds: [...retrieval.policy.prioritizedRecordIds],
    archivalSummary: retrieval.policy.archivalSummary,
    rankingSummary: retrieval.policy.rankingSummary,
  },
  records: retrieval.records.map((record) => ({
    id: record.id,
    scope: record.scope,
    domainKey: record.domainKey,
    agentKey: record.agentKey,
    sourceKind: record.sourceKind,
    freshness: record.freshness,
    title: record.title,
    summary: record.summary,
    detail: record.detail,
    tags: [...record.tags],
    lastUpdatedAt: toIsoString(record.lastUpdatedAt),
    inclusionReason: record.inclusionReason,
  })),
  notes: [...retrieval.notes],
});
