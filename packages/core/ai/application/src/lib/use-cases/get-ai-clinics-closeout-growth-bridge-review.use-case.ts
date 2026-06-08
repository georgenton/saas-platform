import { AiClinicsCloseoutGrowthBridgeReviewView } from '@saas-platform/ai-domain';
import { buildAiClinicsCloseoutGrowthBridgeReviewView } from '../support/ai-clinics-assistant-contracts';

export class GetAiClinicsCloseoutGrowthBridgeReviewUseCase {
  constructor(private readonly nowProvider: () => Date = () => new Date()) {}

  execute(): AiClinicsCloseoutGrowthBridgeReviewView {
    return buildAiClinicsCloseoutGrowthBridgeReviewView(this.nowProvider());
  }
}
