import { TenantAiSuggestionEnvelope } from '@saas-platform/ai-domain';
import { AiAgentNotFoundError } from '../errors/ai-agent-not-found.error';
import { findAiAgentByKey } from '../support/ai-agent-catalog';
import { GetTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase } from './get-tenant-ecommerce-launch-assistant-ai-suggestion-envelope.use-case';
import { GetTenantGrowthAssistAiSuggestionEnvelopeUseCase } from './get-tenant-growth-assist-ai-suggestion-envelope.use-case';
import { GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase } from './get-tenant-invoice-document-assistant-ai-suggestion-envelope.use-case';

export class GetTenantAiSuggestionEnvelopeUseCase {
  constructor(
    private readonly getTenantGrowthAssistAiSuggestionEnvelopeUseCase: GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
    private readonly getTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase: GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
    private readonly getTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase: GetTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase,
  ) {}

  async execute(
    tenantSlug: string,
    agentKey: string,
  ): Promise<TenantAiSuggestionEnvelope> {
    if (!findAiAgentByKey(agentKey)) {
      throw new AiAgentNotFoundError(agentKey);
    }

    const handlers: Record<
      string,
      {
        execute(
          tenantSlug: string,
          agentKey?: string,
        ): Promise<TenantAiSuggestionEnvelope>;
      }
    > = {
      'growth-assist-coach':
        this.getTenantGrowthAssistAiSuggestionEnvelopeUseCase,
      'invoice-document-assistant':
        this.getTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
      'ecommerce-launch-assistant':
        this.getTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase,
    };
    const handler = handlers[agentKey];

    if (!handler) {
      throw new AiAgentNotFoundError(agentKey);
    }

    return handler.execute(tenantSlug, agentKey);
  }
}
