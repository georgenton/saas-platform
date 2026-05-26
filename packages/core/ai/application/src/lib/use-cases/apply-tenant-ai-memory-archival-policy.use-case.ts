import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiMemoryRecordRepository } from '../ports/ai-memory-record.repository';
import {
  AI_MEMORY_ARCHIVAL_POLICY_SUMMARY,
  getAiMemoryArchivalDecision,
} from '../support/ai-memory-archival-policy';

export interface TenantAiMemoryArchivalPolicyResult {
  appliedAt: Date;
  evaluatedActiveRecordCount: number;
  archivedRecordCount: number;
  archivedRecordIds: string[];
  notes: string[];
  policy: {
    version: 'v1';
    summary: string;
  };
}

export class ApplyTenantAiMemoryArchivalPolicyUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiMemoryRecordRepository: AiMemoryRecordRepository,
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantAiMemoryArchivalPolicyResult> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const activeRecords = await this.aiMemoryRecordRepository.findByTenantId(
      tenant.id,
      {
        statuses: ['active'],
        limit: null,
      },
    );

    const now = new Date();
    const archivedRecordIds: string[] = [];

    for (const record of activeRecords) {
      const decision = getAiMemoryArchivalDecision(record, now);

      if (!decision.shouldArchive) {
        continue;
      }

      const updated = await this.aiMemoryRecordRepository.updateByIdAndTenantId(
        record.id,
        tenant.id,
        {
          status: 'inactive',
        },
      );

      if (updated) {
        archivedRecordIds.push(updated.id);
      }
    }

    return {
      appliedAt: now,
      evaluatedActiveRecordCount: activeRecords.length,
      archivedRecordCount: archivedRecordIds.length,
      archivedRecordIds,
      notes: [
        archivedRecordIds.length > 0
          ? `Archival policy retired ${archivedRecordIds.length} stale automated memory record(s).`
          : 'No stale automated memory record needed archival in this pass.',
        AI_MEMORY_ARCHIVAL_POLICY_SUMMARY,
      ],
      policy: {
        version: 'v1',
        summary: AI_MEMORY_ARCHIVAL_POLICY_SUMMARY,
      },
    };
  }
}
