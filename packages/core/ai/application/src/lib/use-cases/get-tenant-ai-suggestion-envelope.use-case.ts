import { TenantAiSuggestionEnvelope } from '@saas-platform/ai-domain';
import { AiAgentNotFoundError } from '../errors/ai-agent-not-found.error';
import { findAiAgentByKey } from '../support/ai-agent-catalog';
import {
  createAiSuggestionEnvelopeHandlerRegistry,
  TenantAiSuggestionEnvelopeHandler,
} from '../support/ai-suggestion-envelope-handler-registry';
import { GetTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase } from './get-tenant-ecommerce-launch-assistant-ai-suggestion-envelope.use-case';
import { GetTenantGrowthAssistAiSuggestionEnvelopeUseCase } from './get-tenant-growth-assist-ai-suggestion-envelope.use-case';
import { GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase } from './get-tenant-invoice-document-assistant-ai-suggestion-envelope.use-case';
import { GetTenantMedicalClinicAssistantAiSuggestionEnvelopeUseCase } from './get-tenant-medical-clinic-assistant-ai-suggestion-envelope.use-case';
import { GetTenantPsychologyClinicAssistantAiSuggestionEnvelopeUseCase } from './get-tenant-psychology-clinic-assistant-ai-suggestion-envelope.use-case';
import { GetTenantTaxAccountingBoundaryAssistantAiSuggestionEnvelopeUseCase } from './get-tenant-tax-accounting-boundary-assistant-ai-suggestion-envelope.use-case';

export class GetTenantAiSuggestionEnvelopeUseCase {
  private readonly handlers: Record<string, TenantAiSuggestionEnvelopeHandler>;

  constructor(
    private readonly getTenantGrowthAssistAiSuggestionEnvelopeUseCase: GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
    private readonly getTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase: GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
    private readonly getTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase: GetTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase,
    private readonly getTenantMedicalClinicAssistantAiSuggestionEnvelopeUseCase: GetTenantMedicalClinicAssistantAiSuggestionEnvelopeUseCase,
    private readonly getTenantPsychologyClinicAssistantAiSuggestionEnvelopeUseCase: GetTenantPsychologyClinicAssistantAiSuggestionEnvelopeUseCase,
    private readonly getTenantTaxAccountingBoundaryAssistantAiSuggestionEnvelopeUseCase: GetTenantTaxAccountingBoundaryAssistantAiSuggestionEnvelopeUseCase,
  ) {
    this.handlers = createAiSuggestionEnvelopeHandlerRegistry({
      growthAssist: this.getTenantGrowthAssistAiSuggestionEnvelopeUseCase,
      invoiceDocumentAssistant:
        this.getTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase,
      ecommerceLaunchAssistant:
        this.getTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase,
      medicalClinicAssistant:
        this.getTenantMedicalClinicAssistantAiSuggestionEnvelopeUseCase,
      psychologyClinicAssistant:
        this.getTenantPsychologyClinicAssistantAiSuggestionEnvelopeUseCase,
      taxAccountingBoundaryAssistant:
        this.getTenantTaxAccountingBoundaryAssistantAiSuggestionEnvelopeUseCase,
    });
  }

  async execute(
    tenantSlug: string,
    agentKey: string,
  ): Promise<TenantAiSuggestionEnvelope> {
    if (!findAiAgentByKey(agentKey)) {
      throw new AiAgentNotFoundError(agentKey);
    }

    const handler = this.handlers[agentKey];

    if (!handler) {
      throw new AiAgentNotFoundError(agentKey);
    }

    return handler.execute(tenantSlug, agentKey);
  }
}
