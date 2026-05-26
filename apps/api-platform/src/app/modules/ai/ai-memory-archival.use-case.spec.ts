import { ApplyTenantAiMemoryArchivalPolicyUseCase } from '@saas-platform/ai-application';

describe('AI memory archival policy use case', () => {
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
      .setSystemTime(new Date('2026-05-26T12:00:00.000Z').getTime());
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      slug: 'saas-platform',
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('archives stale automated memory while preserving operator notes', async () => {
    aiMemoryRecordRepository.findByTenantId.mockResolvedValue([
      {
        id: 'operator-note-001',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        scope: 'agent',
        domainKey: 'growth',
        agentKey: 'growth-assist-coach',
        sourceKind: 'operator_note',
        freshness: 'working_memory',
        title: 'Human operating preference',
        summary: 'Keep this live.',
        detail: 'Manual notes are not policy-archived.',
        tags: ['manual'],
        status: 'active',
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        createdAt: new Date('2026-03-01T10:00:00.000Z'),
        updatedAt: new Date('2026-03-01T10:00:00.000Z'),
      },
      {
        id: 'guarded-memory-001',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        scope: 'agent',
        domainKey: 'growth',
        agentKey: 'growth-assist-coach',
        sourceKind: 'guarded_execution_memory',
        freshness: 'working_memory',
        title: 'Guarded execute outcome',
        summary: 'Stale execution note.',
        detail: 'Older than the working retention window.',
        tags: ['execute'],
        status: 'active',
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        createdAt: new Date('2026-05-10T10:00:00.000Z'),
        updatedAt: new Date('2026-05-10T10:00:00.000Z'),
      },
      {
        id: 'approval-memory-001',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        scope: 'agent',
        domainKey: 'growth',
        agentKey: 'growth-assist-coach',
        sourceKind: 'approval_memory',
        freshness: 'durable_memory',
        title: 'Approval review memory',
        summary: 'Stale durable approval note.',
        detail: 'Older than the durable automated retention window.',
        tags: ['approval'],
        status: 'active',
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        createdAt: new Date('2026-03-15T09:00:00.000Z'),
        updatedAt: new Date('2026-03-15T09:00:00.000Z'),
      },
    ]);
    aiMemoryRecordRepository.updateByIdAndTenantId.mockImplementation(
      async (recordId: string) => ({
        id: recordId,
      }),
    );

    const useCase = new ApplyTenantAiMemoryArchivalPolicyUseCase(
      tenantRepository as any,
      aiMemoryRecordRepository as any,
    );

    const result = await useCase.execute('saas-platform');

    expect(aiMemoryRecordRepository.updateByIdAndTenantId).toHaveBeenCalledTimes(2);
    expect(aiMemoryRecordRepository.updateByIdAndTenantId).toHaveBeenNthCalledWith(
      1,
      'guarded-memory-001',
      'tenant_123',
      { status: 'inactive' },
    );
    expect(aiMemoryRecordRepository.updateByIdAndTenantId).toHaveBeenNthCalledWith(
      2,
      'approval-memory-001',
      'tenant_123',
      { status: 'inactive' },
    );
    expect(result.archivedRecordCount).toBe(2);
    expect(result.archivedRecordIds).toEqual([
      'guarded-memory-001',
      'approval-memory-001',
    ]);
    expect(result.notes).toEqual(
      expect.arrayContaining([
        'Archival policy retired 2 stale automated memory record(s).',
        'Operator notes are never auto-archived; working guarded-execution memory archives after 7 days; working approval memory archives after 14 days; durable automated memory archives after 45 days.',
      ]),
    );
  });
});
