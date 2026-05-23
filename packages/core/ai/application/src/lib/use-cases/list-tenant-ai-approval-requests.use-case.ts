import { AiApprovalRequestRecord } from '@saas-platform/ai-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiApprovalRequestRepository } from '../ports/ai-approval-request.repository';

export class ListTenantAiApprovalRequestsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiApprovalRequestRepository: AiApprovalRequestRepository,
  ) {}

  async execute(
    tenantSlug: string,
    agentKey: string,
    limit?: number | null,
  ): Promise<AiApprovalRequestRecord[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.aiApprovalRequestRepository.findByTenantIdAndAgentKey(
      tenant.id,
      agentKey,
      limit,
    );
  }
}
