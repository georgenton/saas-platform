import { AiMemoryRecord } from '@saas-platform/ai-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiMemoryRecordNotFoundError } from '../errors/ai-memory-record-not-found.error';
import { AiMemoryRecordRepository } from '../ports/ai-memory-record.repository';

export interface UpdateTenantAiMemoryRecordInput {
  tenantSlug: string;
  recordId: string;
  sourceKind?: AiMemoryRecord['sourceKind'];
  freshness?: AiMemoryRecord['freshness'];
  title?: string;
  summary?: string;
  detail?: string;
  tags?: string[];
  status?: AiMemoryRecord['status'];
}

export class UpdateTenantAiMemoryRecordUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiMemoryRecordRepository: AiMemoryRecordRepository,
  ) {}

  async execute(input: UpdateTenantAiMemoryRecordInput): Promise<AiMemoryRecord> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const record = await this.aiMemoryRecordRepository.updateByIdAndTenantId(
      input.recordId,
      tenant.id,
      {
        sourceKind: input.sourceKind,
        freshness: input.freshness,
        title: input.title,
        summary: input.summary,
        detail: input.detail,
        tags: input.tags,
        status: input.status,
      },
    );

    if (!record) {
      throw new AiMemoryRecordNotFoundError(input.recordId);
    }

    return record;
  }
}
