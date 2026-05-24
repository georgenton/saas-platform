import {
  AiSuggestionRunApprovalSummary,
  AiSuggestionRunHistoryEntry,
  AiSuggestionRunRecord,
} from '@saas-platform/ai-domain';
import {
  AiSuggestionEnvelopeResponseDto,
  toAiSuggestionEnvelopeResponseDto,
} from './ai-suggestion-envelope.response';

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
  sourceGeneratedAt: record.sourceGeneratedAt.toISOString(),
  promptPackKey: record.promptPackKey,
  promptPackVersion: record.promptPackVersion,
  generatedAt: record.generatedAt.toISOString(),
  requestedByUserId: record.requestedByUserId,
  requestedByEmail: record.requestedByEmail,
  summary: record.summary,
  suggestedOutputKeys: [...record.suggestedOutputKeys],
  approvalSummary: {
    status: approvalSummary.status,
    totalRequests: approvalSummary.totalRequests,
    latestRequestId: approvalSummary.latestRequestId,
    latestPolicyKey: approvalSummary.latestPolicyKey,
    latestRequestedAt: approvalSummary.latestRequestedAt?.toISOString() ?? null,
    latestReviewedAt: approvalSummary.latestReviewedAt?.toISOString() ?? null,
  },
  envelope: toAiSuggestionEnvelopeResponseDto(record.envelope),
  createdAt: record.createdAt.toISOString(),
  };
};
