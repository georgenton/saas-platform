import { AiSuggestionRunRecord } from '@saas-platform/ai-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiSuggestionRunRepository } from '../ports/ai-suggestion-run.repository';

export class ListTenantAiSuggestionRunsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiSuggestionRunRepository: AiSuggestionRunRepository,
  ) {}

  async execute(
    tenantSlug: string,
    agentKey: string,
    limit?: number | null,
  ): Promise<AiSuggestionRunRecord[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.aiSuggestionRunRepository.findByTenantIdAndAgentKey(
      tenant.id,
      agentKey,
      limit,
    );
  }
}
