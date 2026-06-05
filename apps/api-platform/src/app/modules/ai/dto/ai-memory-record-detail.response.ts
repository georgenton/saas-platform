import { AiMemoryRecordDetailView } from '@saas-platform/ai-domain';
import {
  AiMemoryRecordResponseDto,
  toAiMemoryRecordResponseDto,
} from './ai-memory-record.response';

function toIsoString(value: Date | string | null): string | null {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value.toISOString() : value;
}

export interface AiMemoryRecordDetailResponseDto {
  tenantSlug: string;
  generatedAt: string;
  record: AiMemoryRecordResponseDto;
  currentRetrieval: {
    agentCount: number;
    agents: Array<{
      agentKey: string;
      title: string;
      domainKey: string;
      inclusionReason: string;
    }>;
    notes: string[];
  };
  provenance: {
    usageCount: number;
    agentsUsingCount: number;
    latestUsedAt: string | null;
    recentSuggestionRuns: Array<{
      suggestionRunId: string;
      agentKey: string;
      surfaceKey: string;
      sourceContractKey: string;
      promptPackKey: string;
      promptPackVersion: string;
      generatedAt: string;
      createdAt: string;
      requestedByUserId: string;
      requestedByEmail: string | null;
      summary: string;
      memoryScope: 'tenant' | 'domain' | 'agent';
      memoryInclusionReason: string | null;
    }>;
    notes: string[];
  };
}

export const toAiMemoryRecordDetailResponseDto = (
  detail: AiMemoryRecordDetailView,
  currentRetrieval: {
    agentCount: number;
    agents: Array<{
      agentKey: string;
      title: string;
      domainKey: string;
      inclusionReason: string;
    }>;
    notes: string[];
  },
): AiMemoryRecordDetailResponseDto => ({
  tenantSlug: detail.record.tenantSlug,
  generatedAt: new Date().toISOString(),
  record: toAiMemoryRecordResponseDto(detail.record),
  currentRetrieval,
  provenance: {
    usageCount: detail.provenance.usageCount,
    agentsUsingCount: detail.provenance.agentsUsingCount,
    latestUsedAt: toIsoString(detail.provenance.latestUsedAt),
    recentSuggestionRuns: detail.provenance.recentSuggestionRuns.map((entry) => ({
      suggestionRunId: entry.suggestionRunId,
      agentKey: entry.agentKey,
      surfaceKey: entry.surfaceKey,
      sourceContractKey: entry.sourceContractKey,
      promptPackKey: entry.promptPackKey,
      promptPackVersion: entry.promptPackVersion,
      generatedAt: toIsoString(entry.generatedAt)!,
      createdAt: toIsoString(entry.createdAt)!,
      requestedByUserId: entry.requestedByUserId,
      requestedByEmail: entry.requestedByEmail,
      summary: entry.summary,
      memoryScope: entry.memoryScope,
      memoryInclusionReason: entry.memoryInclusionReason,
    })),
    notes: [...detail.provenance.notes],
  },
});
