import { AiSuggestionRunRecord, CreateAiSuggestionRunCommand } from '@saas-platform/ai-domain';

export interface AiSuggestionRunRepository {
  create(command: CreateAiSuggestionRunCommand): Promise<AiSuggestionRunRecord>;
  findByTenantIdAndAgentKey(
    tenantId: string,
    agentKey: string,
    limit?: number | null,
  ): Promise<AiSuggestionRunRecord[]>;
  findByIdAndTenantIdAndAgentKey(
    suggestionRunId: string,
    tenantId: string,
    agentKey: string,
  ): Promise<AiSuggestionRunRecord | null>;
}
