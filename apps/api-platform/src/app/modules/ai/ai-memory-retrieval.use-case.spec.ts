import { GetTenantAiMemoryRetrievalUseCase } from '@saas-platform/ai-application';

describe('AI memory retrieval use case', () => {
  const tenantRepository = {
    findBySlug: jest.fn(),
  };
  const aiMemoryRecordRepository = {
    findByTenantId: jest.fn(),
    updateByIdAndTenantId: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2026-05-25T16:00:00.000Z').getTime());
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      slug: 'saas-platform',
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('compacts repeated automated memory snapshots while keeping operator notes distinct', async () => {
    aiMemoryRecordRepository.findByTenantId.mockResolvedValue([
      {
        id: 'ai-memory-approval-new',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        scope: 'agent',
        domainKey: 'growth',
        agentKey: 'growth-assist-coach',
        sourceKind: 'approval_memory',
        freshness: 'durable_memory',
        title: 'Approval review: growth-assist-suggestion-review',
        summary: 'Latest approval memory.',
        detail: 'Most recent approved run.',
        tags: ['decision:approved'],
        status: 'active',
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        createdAt: new Date('2026-05-25T15:00:00.000Z'),
        updatedAt: new Date('2026-05-25T15:00:00.000Z'),
      },
      {
        id: 'ai-memory-approval-old',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        scope: 'agent',
        domainKey: 'growth',
        agentKey: 'growth-assist-coach',
        sourceKind: 'approval_memory',
        freshness: 'working_memory',
        title: 'Approval review: growth-assist-suggestion-review',
        summary: 'Older approval memory.',
        detail: 'Older rejected run.',
        tags: ['decision:rejected'],
        status: 'active',
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        createdAt: new Date('2026-05-25T14:00:00.000Z'),
        updatedAt: new Date('2026-05-25T14:00:00.000Z'),
      },
      {
        id: 'ai-memory-operator',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        scope: 'agent',
        domainKey: 'growth',
        agentKey: 'growth-assist-coach',
        sourceKind: 'operator_note',
        freshness: 'working_memory',
        title: 'Lead routing preference',
        summary: 'Manual note.',
        detail: 'Keep this as a separate authored note.',
        tags: ['routing'],
        status: 'active',
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        createdAt: new Date('2026-05-25T13:00:00.000Z'),
        updatedAt: new Date('2026-05-25T13:00:00.000Z'),
      },
    ]);

    const useCase = new GetTenantAiMemoryRetrievalUseCase(
      tenantRepository as any,
      aiMemoryRecordRepository as any,
    );

    const result = await useCase.execute('saas-platform', 'growth-assist-coach', 5);

    expect(result.recordCount).toBe(2);
    expect(result.records).toHaveLength(2);
    expect(result.records.map((entry) => entry.id)).toEqual([
      'ai-memory-operator',
      'ai-memory-approval-new',
    ]);
    expect(result.notes).toEqual(
      expect.arrayContaining([
        '2 persisted memory record(s) matched this agent context.',
        'Compaction suppressed 1 older automated memory snapshot(s) with the same semantic key.',
        'Ranking favors operator-authored notes first, then guarded-execution outcomes, then approval decisions; agent scope outranks domain and tenant scope; working memory and recency outrank older durable memory.',
      ]),
    );
    expect(result.policy).toEqual({
      version: 'v1',
      limit: 5,
      suppressedDuplicateCount: 1,
      archivedRecordCount: 0,
      prioritizedRecordIds: ['ai-memory-operator', 'ai-memory-approval-new'],
      archivalSummary:
        'Operator notes are never auto-archived; working guarded-execution memory archives after 7 days; working approval memory archives after 14 days; durable automated memory archives after 45 days.',
      rankingSummary:
        'operator_note > guarded_execution_memory > approval_memory; agent > domain > tenant; working_memory > durable_memory; recency breaks ties.',
    });
  });

  it('ranks stronger memory above newer but weaker memory when filling the retrieval context', async () => {
    aiMemoryRecordRepository.findByTenantId.mockResolvedValue([
      {
        id: 'ai-memory-approval-new',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        scope: 'agent',
        domainKey: 'growth',
        agentKey: 'growth-assist-coach',
        sourceKind: 'approval_memory',
        freshness: 'working_memory',
        title: 'Approval review: growth-assist-suggestion-review',
        summary: 'Fresh but weaker approval memory.',
        detail: 'Most recent approval memory.',
        tags: ['decision:approved'],
        status: 'active',
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        createdAt: new Date('2026-05-25T15:45:00.000Z'),
        updatedAt: new Date('2026-05-25T15:45:00.000Z'),
      },
      {
        id: 'ai-memory-operator-older',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        scope: 'agent',
        domainKey: 'growth',
        agentKey: 'growth-assist-coach',
        sourceKind: 'operator_note',
        freshness: 'durable_memory',
        title: 'Lead routing preference',
        summary: 'Older but stronger operator-authored memory.',
        detail: 'Manual policy note should rank first.',
        tags: ['routing'],
        status: 'active',
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        createdAt: new Date('2026-05-24T10:00:00.000Z'),
        updatedAt: new Date('2026-05-24T10:00:00.000Z'),
      },
    ]);

    const useCase = new GetTenantAiMemoryRetrievalUseCase(
      tenantRepository as any,
      aiMemoryRecordRepository as any,
    );

    const result = await useCase.execute('saas-platform', 'growth-assist-coach', 2);

    expect(result.records.map((entry) => entry.id)).toEqual([
      'ai-memory-operator-older',
      'ai-memory-approval-new',
    ]);
    expect(result.policy).toEqual({
      version: 'v1',
      limit: 2,
      suppressedDuplicateCount: 0,
      archivedRecordCount: 0,
      prioritizedRecordIds: [
        'ai-memory-operator-older',
        'ai-memory-approval-new',
      ],
      archivalSummary:
        'Operator notes are never auto-archived; working guarded-execution memory archives after 7 days; working approval memory archives after 14 days; durable automated memory archives after 45 days.',
      rankingSummary:
        'operator_note > guarded_execution_memory > approval_memory; agent > domain > tenant; working_memory > durable_memory; recency breaks ties.',
    });
  });

  it('archives stale automated memory before filling the retrieval context', async () => {
    aiMemoryRecordRepository.findByTenantId.mockResolvedValue([
      {
        id: 'ai-memory-stale-guarded',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        scope: 'agent',
        domainKey: 'growth',
        agentKey: 'growth-assist-coach',
        sourceKind: 'guarded_execution_memory',
        freshness: 'working_memory',
        title: 'Guarded execution memory',
        summary: 'Should be archived.',
        detail: 'Older than 7 days.',
        tags: ['guarded'],
        status: 'active',
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        createdAt: new Date('2026-05-15T09:00:00.000Z'),
        updatedAt: new Date('2026-05-15T09:00:00.000Z'),
      },
      {
        id: 'ai-memory-operator',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        scope: 'agent',
        domainKey: 'growth',
        agentKey: 'growth-assist-coach',
        sourceKind: 'operator_note',
        freshness: 'working_memory',
        title: 'Lead routing preference',
        summary: 'Still active.',
        detail: 'Manual note remains.',
        tags: ['routing'],
        status: 'active',
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        createdAt: new Date('2026-05-24T10:00:00.000Z'),
        updatedAt: new Date('2026-05-24T10:00:00.000Z'),
      },
    ]);
    aiMemoryRecordRepository.updateByIdAndTenantId.mockResolvedValue({
      id: 'ai-memory-stale-guarded',
    });

    const useCase = new GetTenantAiMemoryRetrievalUseCase(
      tenantRepository as any,
      aiMemoryRecordRepository as any,
    );

    const result = await useCase.execute('saas-platform', 'growth-assist-coach', 5);

    expect(aiMemoryRecordRepository.updateByIdAndTenantId).toHaveBeenCalledWith(
      'ai-memory-stale-guarded',
      'tenant_123',
      { status: 'inactive' },
    );
    expect(result.records.map((entry) => entry.id)).toEqual(['ai-memory-operator']);
    expect(result.policy.archivedRecordCount).toBe(1);
    expect(result.notes).toEqual(
      expect.arrayContaining([
        'Archival policy retired 1 stale automated memory record(s) before ranking this context.',
      ]),
    );
  });
});
