import {
  AiDomainKey,
  AiMemoryRecord,
  AiMemoryRecordScope,
  AiMemoryRecordStatus,
  CreateAiMemoryRecordCommand,
} from '@saas-platform/ai-domain';

export interface AiMemoryRecordRepository {
  create(command: CreateAiMemoryRecordCommand): Promise<AiMemoryRecord>;
  findByIdAndTenantId(
    recordId: string,
    tenantId: string,
  ): Promise<AiMemoryRecord | null>;
  findByTenantId(
    tenantId: string,
    options?: {
      scopes?: AiMemoryRecordScope[] | null;
      statuses?: AiMemoryRecordStatus[] | null;
      domainKeys?: AiDomainKey[] | null;
      agentKeys?: string[] | null;
      limit?: number | null;
    },
  ): Promise<AiMemoryRecord[]>;
  updateByIdAndTenantId(
    recordId: string,
    tenantId: string,
    patch: {
      sourceKind?: AiMemoryRecord['sourceKind'];
      freshness?: AiMemoryRecord['freshness'];
      title?: string;
      summary?: string;
      detail?: string;
      tags?: string[];
      status?: AiMemoryRecordStatus;
    },
  ): Promise<AiMemoryRecord | null>;
}
