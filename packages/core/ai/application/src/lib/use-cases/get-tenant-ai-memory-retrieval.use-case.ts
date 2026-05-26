import {
  AiMemoryRecord,
  AiMemoryRetrieval,
  AiRetrievedMemoryRecord,
} from '@saas-platform/ai-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiAgentNotFoundError } from '../errors/ai-agent-not-found.error';
import { AiMemoryRecordRepository } from '../ports/ai-memory-record.repository';
import { findAiAgentByKey } from '../support/ai-agent-catalog';
import {
  AI_MEMORY_ARCHIVAL_POLICY_SUMMARY,
  getAiMemoryArchivalDecision,
} from '../support/ai-memory-archival-policy';

export class GetTenantAiMemoryRetrievalUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiMemoryRecordRepository: AiMemoryRecordRepository,
  ) {}

  async execute(
    tenantSlug: string,
    agentKey: string,
    limit = 5,
  ): Promise<AiMemoryRetrieval> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const agent = findAiAgentByKey(agentKey);

    if (!agent) {
      throw new AiAgentNotFoundError(agentKey);
    }

    const records = await this.aiMemoryRecordRepository.findByTenantId(
      tenant.id,
      {
        scopes: ['tenant', 'domain', 'agent'],
        statuses: ['active'],
        domainKeys: [agent.domainKey],
        agentKeys: [agent.key],
        limit: null,
      },
    );

    const now = new Date();
    const archivalOutcome = await this.archiveStaleRecords(records, tenant.id, now);

    const visibleRecords = archivalOutcome.activeRecords
      .filter((entry) => {
        if (entry.scope === 'tenant') {
          return true;
        }

        if (entry.scope === 'domain') {
          return entry.domainKey === agent.domainKey;
        }

        return entry.agentKey === agent.key;
      })
      .sort(this.sortRecordsByRecency);

    const { compactedRecords, suppressedDuplicates } =
      this.compactAutomatedMemory(visibleRecords);

    const hydrated = compactedRecords
      .sort((left, right) => this.sortRecordsByRanking(left, right, now))
      .slice(0, limit)
      .map((entry): AiRetrievedMemoryRecord => ({
        id: entry.id,
        scope: entry.scope,
        domainKey: entry.domainKey,
        agentKey: entry.agentKey,
        sourceKind: entry.sourceKind,
        freshness: entry.freshness,
        title: entry.title,
        summary: entry.summary,
        detail: entry.detail,
        tags: [...entry.tags],
        lastUpdatedAt: entry.updatedAt,
        inclusionReason:
          entry.scope === 'tenant'
            ? 'Tenant-scoped memory shared across every AI agent for this tenant.'
            : entry.scope === 'domain'
              ? `Domain-scoped memory available to ${agent.domainKey} agents.`
              : `Agent-scoped memory attached directly to ${agent.key}.`,
      }));

    const notes = [
      hydrated.length > 0
        ? `${hydrated.length} persisted memory record(s) matched this agent context.`
        : 'No persisted memory record matched this agent context yet.',
      `Retrieval considers tenant-wide, ${agent.domainKey}-scoped, and ${agent.key}-scoped memory.`,
      'Ranking favors operator-authored notes first, then guarded-execution outcomes, then approval decisions; agent scope outranks domain and tenant scope; working memory and recency outrank older durable memory.',
      archivalOutcome.archivedRecordCount > 0
        ? `Archival policy retired ${archivalOutcome.archivedRecordCount} stale automated memory record(s) before ranking this context.`
        : 'No stale automated memory record needed archival before live retrieval.',
      AI_MEMORY_ARCHIVAL_POLICY_SUMMARY,
      suppressedDuplicates > 0
        ? `Compaction suppressed ${suppressedDuplicates} older automated memory snapshot(s) with the same semantic key.`
        : 'No automated memory compaction was needed for this agent context.',
    ];

    return {
      retrievedAt: new Date(),
      recordCount: hydrated.length,
      policy: {
        version: 'v1',
        limit,
        suppressedDuplicateCount: suppressedDuplicates,
        archivedRecordCount: archivalOutcome.archivedRecordCount,
        prioritizedRecordIds: hydrated.map((entry) => entry.id),
        archivalSummary: AI_MEMORY_ARCHIVAL_POLICY_SUMMARY,
        rankingSummary:
          'operator_note > guarded_execution_memory > approval_memory; agent > domain > tenant; working_memory > durable_memory; recency breaks ties.',
      },
      records: hydrated,
      notes,
    };
  }

  private compactAutomatedMemory(records: AiMemoryRecord[]): {
    compactedRecords: AiMemoryRecord[];
    suppressedDuplicates: number;
  } {
    const keptKeys = new Set<string>();
    const compactedRecords: AiMemoryRecord[] = [];
    let suppressedDuplicates = 0;

    for (const entry of records) {
      const key = this.getCompactionKey(entry);

      if (!key) {
        compactedRecords.push(entry);
        continue;
      }

      if (keptKeys.has(key)) {
        suppressedDuplicates += 1;
        continue;
      }

      keptKeys.add(key);
      compactedRecords.push(entry);
    }

    return {
      compactedRecords,
      suppressedDuplicates,
    };
  }

  private async archiveStaleRecords(
    records: AiMemoryRecord[],
    tenantId: string,
    now: Date,
  ): Promise<{
    activeRecords: AiMemoryRecord[];
    archivedRecordCount: number;
  }> {
    const activeRecords: AiMemoryRecord[] = [];
    let archivedRecordCount = 0;

    for (const record of records) {
      const decision = getAiMemoryArchivalDecision(record, now);

      if (!decision.shouldArchive) {
        activeRecords.push(record);
        continue;
      }

      const updated = await this.aiMemoryRecordRepository.updateByIdAndTenantId(
        record.id,
        tenantId,
        {
          status: 'inactive',
        },
      );

      if (updated) {
        archivedRecordCount += 1;
      } else {
        activeRecords.push(record);
      }
    }

    return {
      activeRecords,
      archivedRecordCount,
    };
  }

  private getCompactionKey(record: AiMemoryRecord): string | null {
    if (record.sourceKind === 'operator_note') {
      return null;
    }

    return [
      record.scope,
      record.domainKey ?? 'all-domains',
      record.agentKey ?? 'all-agents',
      record.sourceKind,
      this.normalizeCompactionText(record.title),
    ].join('|');
  }

  private normalizeCompactionText(value: string): string {
    return value.trim().toLowerCase();
  }

  private sortRecordsByRanking(
    left: AiMemoryRecord,
    right: AiMemoryRecord,
    now: Date,
  ): number {
    const scoreDifference =
      this.calculateRankingScore(right, now) - this.calculateRankingScore(left, now);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return this.sortRecordsByRecency(left, right);
  }

  private calculateRankingScore(record: AiMemoryRecord, now: Date): number {
    const sourceWeight =
      record.sourceKind === 'operator_note'
        ? 100
        : record.sourceKind === 'guarded_execution_memory'
          ? 80
          : 70;
    const scopeWeight =
      record.scope === 'agent' ? 30 : record.scope === 'domain' ? 20 : 10;
    const freshnessWeight = record.freshness === 'working_memory' ? 20 : 12;
    const recencyWeight = this.getRecencyWeight(record.updatedAt, now);

    return sourceWeight + scopeWeight + freshnessWeight + recencyWeight;
  }

  private getRecencyWeight(updatedAt: Date, now: Date): number {
    const ageInHours =
      Math.max(0, now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);

    if (ageInHours <= 24) {
      return 15;
    }

    if (ageInHours <= 72) {
      return 10;
    }

    if (ageInHours <= 24 * 7) {
      return 6;
    }

    return 2;
  }

  private sortRecordsByRecency(left: AiMemoryRecord, right: AiMemoryRecord): number {
    return (
      right.updatedAt.getTime() - left.updatedAt.getTime() ||
      right.createdAt.getTime() - left.createdAt.getTime()
    );
  }
}
