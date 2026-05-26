import { CreateTenantAiMemoryRecordUseCase } from '@saas-platform/ai-application';

describe('AI memory record use case', () => {
  const tenantRepository = {
    findBySlug: jest.fn(),
  };
  const aiMemoryRecordRepository = {
    create: jest.fn(),
    findByIdAndTenantId: jest.fn(),
    findByTenantId: jest.fn(),
    updateByIdAndTenantId: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      slug: 'saas-platform',
    });
  });

  it('creates operator-authored memory without deduping it away', async () => {
    aiMemoryRecordRepository.findByTenantId.mockResolvedValue([]);
    aiMemoryRecordRepository.create.mockResolvedValue({
      id: 'ai-memory-001',
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      scope: 'agent',
      domainKey: 'growth',
      agentKey: 'growth-assist-coach',
      sourceKind: 'operator_note',
      freshness: 'working_memory',
      title: 'Lead routing preference',
      summary: 'Priorizar reasignacion manual.',
      detail: 'Cuando el lead ya esta caliente, no auto-rutear.',
      tags: ['routing'],
      status: 'active',
      createdByUserId: 'user_123',
      createdByEmail: 'hello@saas-platform.dev',
      createdAt: new Date('2026-05-25T15:00:00.000Z'),
      updatedAt: new Date('2026-05-25T15:00:00.000Z'),
    });

    const useCase = new CreateTenantAiMemoryRecordUseCase(
      tenantRepository as any,
      aiMemoryRecordRepository as any,
    );

    await useCase.execute({
      tenantSlug: 'saas-platform',
      scope: 'agent',
      domainKey: 'growth',
      agentKey: 'growth-assist-coach',
      sourceKind: 'operator_note',
      freshness: 'working_memory',
      title: 'Lead routing preference',
      summary: 'Priorizar reasignacion manual.',
      detail: 'Cuando el lead ya esta caliente, no auto-rutear.',
      tags: ['routing'],
      createdByUserId: 'user_123',
      createdByEmail: 'hello@saas-platform.dev',
    });

    expect(aiMemoryRecordRepository.findByTenantId).not.toHaveBeenCalled();
    expect(aiMemoryRecordRepository.create).toHaveBeenCalledWith({
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      scope: 'agent',
      domainKey: 'growth',
      agentKey: 'growth-assist-coach',
      sourceKind: 'operator_note',
      freshness: 'working_memory',
      title: 'Lead routing preference',
      summary: 'Priorizar reasignacion manual.',
      detail: 'Cuando el lead ya esta caliente, no auto-rutear.',
      tags: ['routing'],
      status: 'active',
      createdByUserId: 'user_123',
      createdByEmail: 'hello@saas-platform.dev',
    });
  });

  it('dedups automated approval memory into the latest active snapshot', async () => {
    aiMemoryRecordRepository.findByTenantId.mockResolvedValue([
      {
        id: 'ai-memory-previous',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        scope: 'agent',
        domainKey: 'growth',
        agentKey: 'growth-assist-coach',
        sourceKind: 'approval_memory',
        freshness: 'working_memory',
        title: 'Approval review: growth-assist-suggestion-review',
        summary: 'Human review rejected ai-run-000.',
        detail: 'Older approval memory.',
        tags: ['agent:growth-assist-coach', 'decision:rejected'],
        status: 'active',
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        createdAt: new Date('2026-05-25T14:00:00.000Z'),
        updatedAt: new Date('2026-05-25T14:00:00.000Z'),
      },
    ]);
    aiMemoryRecordRepository.updateByIdAndTenantId.mockResolvedValue({
      id: 'ai-memory-previous',
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      scope: 'agent',
      domainKey: 'growth',
      agentKey: 'growth-assist-coach',
      sourceKind: 'approval_memory',
      freshness: 'durable_memory',
      title: 'Approval review: growth-assist-suggestion-review',
      summary: 'Human review approved ai-run-001.',
      detail: 'Newer approval memory.',
      tags: [
        'agent:growth-assist-coach',
        'decision:rejected',
        'decision:approved',
        'run:ai-run-001',
      ],
      status: 'active',
      createdByUserId: 'user_123',
      createdByEmail: 'hello@saas-platform.dev',
      createdAt: new Date('2026-05-25T14:00:00.000Z'),
      updatedAt: new Date('2026-05-25T15:05:00.000Z'),
    });

    const useCase = new CreateTenantAiMemoryRecordUseCase(
      tenantRepository as any,
      aiMemoryRecordRepository as any,
    );

    await useCase.execute({
      tenantSlug: 'saas-platform',
      scope: 'agent',
      domainKey: 'growth',
      agentKey: 'growth-assist-coach',
      sourceKind: 'approval_memory',
      freshness: 'durable_memory',
      title: 'Approval review: growth-assist-suggestion-review',
      summary: 'Human review approved ai-run-001.',
      detail: 'Newer approval memory.',
      tags: ['agent:growth-assist-coach', 'decision:approved', 'run:ai-run-001'],
      createdByUserId: 'user_123',
      createdByEmail: 'hello@saas-platform.dev',
    });

    expect(aiMemoryRecordRepository.findByTenantId).toHaveBeenCalledWith(
      'tenant_123',
      {
        scopes: ['agent'],
        statuses: ['active'],
        domainKeys: ['growth'],
        agentKeys: ['growth-assist-coach'],
        limit: null,
      },
    );
    expect(aiMemoryRecordRepository.updateByIdAndTenantId).toHaveBeenCalledWith(
      'ai-memory-previous',
      'tenant_123',
      expect.objectContaining({
        sourceKind: 'approval_memory',
        freshness: 'durable_memory',
        title: 'Approval review: growth-assist-suggestion-review',
        summary: 'Human review approved ai-run-001.',
        detail: 'Newer approval memory.',
        status: 'active',
        tags: expect.arrayContaining([
          'agent:growth-assist-coach',
          'decision:rejected',
          'decision:approved',
          'run:ai-run-001',
        ]),
      }),
    );
    expect(aiMemoryRecordRepository.create).not.toHaveBeenCalled();
  });
});
