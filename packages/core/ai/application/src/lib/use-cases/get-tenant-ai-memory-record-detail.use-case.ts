import {
  AiMemoryRecordDetailView,
  AiMemoryRecordUsageReference,
  AiSuggestionRunRecord,
} from '@saas-platform/ai-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AiMemoryRecordNotFoundError } from '../errors/ai-memory-record-not-found.error';
import { AiMemoryRecordRepository } from '../ports/ai-memory-record.repository';
import { AiSuggestionRunRepository } from '../ports/ai-suggestion-run.repository';

export class GetTenantAiMemoryRecordDetailUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly aiMemoryRecordRepository: AiMemoryRecordRepository,
    private readonly aiSuggestionRunRepository: AiSuggestionRunRepository,
  ) {}

  async execute(
    tenantSlug: string,
    recordId: string,
    options?: {
      accessibleAgentKeys?: string[] | null;
      suggestionRunsPerAgentLimit?: number | null;
    },
  ): Promise<AiMemoryRecordDetailView> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const record = await this.aiMemoryRecordRepository.findByIdAndTenantId(
      recordId,
      tenant.id,
    );

    if (!record) {
      throw new AiMemoryRecordNotFoundError(recordId);
    }

    const accessibleAgentKeys = options?.accessibleAgentKeys ?? [];
    const suggestionRunsPerAgentLimit =
      options?.suggestionRunsPerAgentLimit === null ||
      options?.suggestionRunsPerAgentLimit === undefined
        ? 20
        : options.suggestionRunsPerAgentLimit;

    const usageEntries = (
      await Promise.all(
        accessibleAgentKeys.map(async (agentKey) => {
          const runs = await this.aiSuggestionRunRepository.findByTenantIdAndAgentKey(
            tenant.id,
            agentKey,
            suggestionRunsPerAgentLimit,
          );

          return runs
            .map((run) => this.toUsageReference(run, recordId))
            .filter(
              (
                entry,
              ): entry is AiMemoryRecordUsageReference => entry !== null,
            );
        }),
      )
    )
      .flat()
      .sort(
        (left, right) =>
          right.createdAt.getTime() - left.createdAt.getTime() ||
          right.generatedAt.getTime() - left.generatedAt.getTime(),
      );

    const agentsUsingCount = new Set(usageEntries.map((entry) => entry.agentKey)).size;

    return {
      record,
      provenance: {
        usageCount: usageEntries.length,
        agentsUsingCount,
        latestUsedAt: usageEntries[0]?.createdAt ?? null,
        recentSuggestionRuns: usageEntries.slice(0, 12),
        notes: [
          usageEntries.length > 0
            ? `${usageEntries.length} persisted suggestion run(s) already reference this memory record.`
            : 'This memory record has not yet been observed inside a persisted suggestion envelope.',
          accessibleAgentKeys.length > 0
            ? `Provenance was scanned across ${accessibleAgentKeys.length} visible AI agent lane(s).`
            : 'No visible AI agent lane was available to compute provenance.',
          record.status === 'inactive'
            ? 'Inactive memory remains visible for provenance, but it no longer hydrates fresh retrieval contexts.'
            : 'Active memory can still hydrate fresh retrieval contexts while this provenance trail remains available.',
        ],
      },
    };
  }

  private toUsageReference(
    run: AiSuggestionRunRecord,
    recordId: string,
  ): AiMemoryRecordUsageReference | null {
    const memory =
      run.envelope.retrieval?.records.find((entry) => entry.id === recordId) ?? null;

    if (!memory) {
      return null;
    }

    return {
      suggestionRunId: run.id,
      agentKey: run.agentKey,
      surfaceKey: run.surfaceKey,
      sourceContractKey: run.sourceContractKey,
      promptPackKey: run.promptPackKey,
      promptPackVersion: run.promptPackVersion,
      generatedAt: run.generatedAt,
      createdAt: run.createdAt,
      requestedByUserId: run.requestedByUserId,
      requestedByEmail: run.requestedByEmail,
      summary: run.summary,
      memoryScope: memory.scope,
      memoryInclusionReason: memory.inclusionReason,
    };
  }
}
