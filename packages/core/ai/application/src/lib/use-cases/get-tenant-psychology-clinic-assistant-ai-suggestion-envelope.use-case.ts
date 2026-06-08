import { findAiClinicsAssistantTemplateByAgentKey } from '../support/ai-clinics-assistant-contracts';
import { GetTenantAiMemoryRetrievalUseCase } from './get-tenant-ai-memory-retrieval.use-case';
import { GetTenantClinicAssistantAiSuggestionEnvelopeUseCase } from './get-tenant-clinic-assistant-ai-suggestion-envelope.use-case';

const PSYCHOLOGY_CLINIC_ASSISTANT_AGENT_KEY = 'psychology-clinic-assistant';

export class GetTenantPsychologyClinicAssistantAiSuggestionEnvelopeUseCase extends GetTenantClinicAssistantAiSuggestionEnvelopeUseCase {
  constructor(
    getTenantAiMemoryRetrievalUseCase: GetTenantAiMemoryRetrievalUseCase,
    nowProvider: () => Date = () => new Date(),
  ) {
    const template = findAiClinicsAssistantTemplateByAgentKey(
      PSYCHOLOGY_CLINIC_ASSISTANT_AGENT_KEY,
    );

    if (!template) {
      throw new Error('Psychology clinic assistant template is not registered.');
    }

    super(template, getTenantAiMemoryRetrievalUseCase, nowProvider);
  }
}
