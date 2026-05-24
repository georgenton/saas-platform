import { TenantAiSuggestionEnvelope } from '@saas-platform/ai-domain';
import { AiAgentNotFoundError } from '../errors/ai-agent-not-found.error';
import { GetTenantGrowthAssistAiSuggestionEnvelopeUseCase } from './get-tenant-growth-assist-ai-suggestion-envelope.use-case';
import { GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase } from './get-tenant-invoice-document-assistant-ai-suggestion-envelope.use-case';

export class GetTenantAiSuggestionEnvelopeUseCase {
  constructor(
    private readonly getTenantGrowthAssistAiSuggestionEnvelopeUseCase: GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
    private readonly getTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase: GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
  ) {}

  async execute(
    tenantSlug: string,
    agentKey: string,
  ): Promise<TenantAiSuggestionEnvelope> {
    switch (agentKey) {
      case 'growth-assist-coach':
        return this.getTenantGrowthAssistAiSuggestionEnvelopeUseCase.execute(
          tenantSlug,
          agentKey,
        );
      case 'invoice-document-assistant':
        return this.getTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase.execute(
          tenantSlug,
          agentKey,
        );
      default:
        throw new AiAgentNotFoundError(agentKey);
    }
  }
}
