import { AiSuggestionRunRecord } from '@saas-platform/ai-domain';
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
  envelope: AiSuggestionEnvelopeResponseDto;
  createdAt: string;
}

export const toAiSuggestionRunResponseDto = (
  record: AiSuggestionRunRecord,
): AiSuggestionRunResponseDto => ({
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
  envelope: toAiSuggestionEnvelopeResponseDto(record.envelope),
  createdAt: record.createdAt.toISOString(),
});
