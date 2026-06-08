import { AiClinicsDomainContractRegistryView } from '@saas-platform/ai-domain';
import { buildAiClinicsDomainContractRegistryView } from '../support/ai-clinics-assistant-contracts';

export class GetAiClinicsDomainContractRegistryUseCase {
  constructor(private readonly nowProvider: () => Date = () => new Date()) {}

  execute(): AiClinicsDomainContractRegistryView {
    return buildAiClinicsDomainContractRegistryView(this.nowProvider());
  }
}
