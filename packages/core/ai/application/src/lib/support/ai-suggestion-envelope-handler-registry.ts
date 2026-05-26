import { TenantAiSuggestionEnvelope } from '@saas-platform/ai-domain';
import { GetTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase } from '../use-cases/get-tenant-ecommerce-launch-assistant-ai-suggestion-envelope.use-case';
import { GetTenantGrowthAssistAiSuggestionEnvelopeUseCase } from '../use-cases/get-tenant-growth-assist-ai-suggestion-envelope.use-case';
import { GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase } from '../use-cases/get-tenant-invoice-document-assistant-ai-suggestion-envelope.use-case';

export interface TenantAiSuggestionEnvelopeHandler {
  execute(
    tenantSlug: string,
    agentKey?: string,
  ): Promise<TenantAiSuggestionEnvelope>;
}

export interface AiSuggestionEnvelopeHandlerRegistryInput {
  growthAssist: GetTenantGrowthAssistAiSuggestionEnvelopeUseCase;
  invoiceDocumentAssistant: GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase;
  ecommerceLaunchAssistant: GetTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase;
}

export function createAiSuggestionEnvelopeHandlerRegistry(
  input: AiSuggestionEnvelopeHandlerRegistryInput,
): Record<string, TenantAiSuggestionEnvelopeHandler> {
  return {
    'growth-assist-coach': input.growthAssist,
    'invoice-document-assistant': input.invoiceDocumentAssistant,
    'ecommerce-launch-assistant': input.ecommerceLaunchAssistant,
  };
}
