import { AiClinicsGuardrailApprovalPackView } from '@saas-platform/ai-domain';
import { buildAiClinicsGuardrailApprovalPackView } from '../support/ai-clinics-assistant-contracts';

export class GetAiClinicsGuardrailApprovalPackUseCase {
  constructor(private readonly nowProvider: () => Date = () => new Date()) {}

  execute(): AiClinicsGuardrailApprovalPackView {
    return buildAiClinicsGuardrailApprovalPackView(this.nowProvider());
  }
}
