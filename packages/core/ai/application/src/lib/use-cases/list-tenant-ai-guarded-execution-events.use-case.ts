import {
  AiGuardedExecutionEventRecord,
  AiGuardedExecutionEventType,
} from '@saas-platform/ai-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiGuardedExecutionEventRepository } from '../ports/ai-guarded-execution-event.repository';

export class ListTenantAiGuardedExecutionEventsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiGuardedExecutionEventRepository: AiGuardedExecutionEventRepository,
  ) {}

  async execute(
    tenantSlug: string,
    options?: {
      agentKeys?: string[] | null;
      limit?: number | null;
      eventTypes?: AiGuardedExecutionEventType[] | null;
    },
  ): Promise<AiGuardedExecutionEventRecord[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.aiGuardedExecutionEventRepository.findByTenantId(tenant.id, options);
  }
}
