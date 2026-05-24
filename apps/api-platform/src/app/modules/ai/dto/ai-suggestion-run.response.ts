import {
  AiSuggestionRunApprovalSummary,
  AiSuggestionRunHistoryEntry,
  AiSuggestionRunRecord,
} from '@saas-platform/ai-domain';
import {
  AiSuggestionEnvelopeResponseDto,
  toAiSuggestionEnvelopeResponseDto,
} from './ai-suggestion-envelope.response';

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

function toNullableIsoString(value: Date | string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return toIsoString(value);
}

export interface AiSuggestionRunResponseDto {
  id: string;
  tenantSlug: string;
  agentKey: string;
  mode: 'suggestion';
  status: 'prepared';
  surfaceKey: string;
  sourceContractKey: string;
  sourceGeneratedAt: string;
  promptPackKey: string;
  promptPackVersion: string;
  generatedAt: string;
  requestedByUserId: string;
  requestedByEmail: string | null;
  summary: string;
  suggestedOutputKeys: string[];
  approvalSummary: {
    status: 'not_requested' | 'pending' | 'approved' | 'rejected';
    totalRequests: number;
    latestRequestId: string | null;
    latestPolicyKey: string | null;
    latestRequestedAt: string | null;
    latestReviewedAt: string | null;
  };
  envelope: AiSuggestionEnvelopeResponseDto;
  createdAt: string;
}

export const toAiSuggestionRunResponseDto = (
  record:
    | AiSuggestionRunHistoryEntry
    | (AiSuggestionRunRecord & {
        approvalSummary?: AiSuggestionRunApprovalSummary;
      }),
): AiSuggestionRunResponseDto => {
  const approvalSummary = record.approvalSummary ?? {
    status: 'not_requested',
    totalRequests: 0,
    latestRequestId: null,
    latestPolicyKey: null,
    latestRequestedAt: null,
    latestReviewedAt: null,
  };

  return {
  id: record.id,
  tenantSlug: record.tenantSlug,
  agentKey: record.agentKey,
  mode: record.mode,
  status: record.status,
  surfaceKey: record.surfaceKey,
  sourceContractKey: record.sourceContractKey,
  sourceGeneratedAt: toIsoString(record.sourceGeneratedAt),
  promptPackKey: record.promptPackKey,
  promptPackVersion: record.promptPackVersion,
  generatedAt: toIsoString(record.generatedAt),
  requestedByUserId: record.requestedByUserId,
  requestedByEmail: record.requestedByEmail,
  summary: record.summary,
  suggestedOutputKeys: [...record.suggestedOutputKeys],
  approvalSummary: {
    status: approvalSummary.status,
    totalRequests: approvalSummary.totalRequests,
    latestRequestId: approvalSummary.latestRequestId,
    latestPolicyKey: approvalSummary.latestPolicyKey,
    latestRequestedAt: toNullableIsoString(approvalSummary.latestRequestedAt),
    latestReviewedAt: toNullableIsoString(approvalSummary.latestReviewedAt),
  },
  envelope: toAiSuggestionEnvelopeResponseDto(record.envelope),
  createdAt: toIsoString(record.createdAt),
  };
};
