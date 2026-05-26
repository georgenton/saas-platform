import { AiOperatingModelManifest } from '@saas-platform/ai-domain';
import { listAiOperatingModelManifest } from '../support/ai-agent-catalog';

export class GetAiOperatingModelManifestUseCase {
  execute(): AiOperatingModelManifest {
    return listAiOperatingModelManifest();
  }
}
