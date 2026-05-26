import {
  AiDomainKey,
  AiMemoryRecord,
  AiMemoryRecordScope,
  AiMemoryRecordStatus,
} from '@saas-platform/ai-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiMemoryRecordRepository } from '../ports/ai-memory-record.repository';

export class ListTenantAiMemoryRecordsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiMemoryRecordRepository: AiMemoryRecordRepository,
  ) {}

  async execute(
    tenantSlug: string,
    options?: {
      scopes?: AiMemoryRecordScope[] | null;
      statuses?: AiMemoryRecordStatus[] | null;
      domainKeys?: AiDomainKey[] | null;
      agentKeys?: string[] | null;
      limit?: number | null;
    },
  ): Promise<AiMemoryRecord[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.aiMemoryRecordRepository.findByTenantId(tenant.id, options);
  }
}
