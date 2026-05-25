import { CreateAiGuardedExecutionEventCommand } from '@saas-platform/ai-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiGuardedExecutionEventRepository } from '../ports/ai-guarded-execution-event.repository';

export interface CreateTenantAiGuardedExecutionEventInput
  extends Omit<CreateAiGuardedExecutionEventCommand, 'tenantId'> {
  tenantSlug: string;
}

export class CreateTenantAiGuardedExecutionEventUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiGuardedExecutionEventRepository: AiGuardedExecutionEventRepository,
  ) {}

  async execute(
    input: CreateTenantAiGuardedExecutionEventInput,
  ) {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    return this.aiGuardedExecutionEventRepository.create({
      ...input,
      tenantId: tenant.id,
    });
  }
}
