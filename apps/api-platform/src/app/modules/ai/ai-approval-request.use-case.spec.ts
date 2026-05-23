import {
  ListTenantAiApprovalRequestsUseCase,
  RequestTenantAiSuggestionRunApprovalUseCase,
  ReviewTenantAiApprovalRequestUseCase,
} from '@saas-platform/ai-application';

describe('AI approval request use cases', () => {
  const tenantRepository = {
    findBySlug: jest.fn(),
  };
  const aiSuggestionRunRepository = {
    findByIdAndTenantIdAndAgentKey: jest.fn(),
  };
  const aiApprovalRequestRepository = {
    create: jest.fn(),
    findByTenantIdAndAgentKey: jest.fn(),
    findByIdAndTenantIdAndAgentKey: jest.fn(),
    findPendingBySuggestionRunId: jest.fn(),
    review: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      slug: 'saas-platform',
    });
    aiSuggestionRunRepository.findByIdAndTenantIdAndAgentKey.mockResolvedValue({
      id: 'ai-run-001',
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      agentKey: 'growth-assist-coach',
    });
    aiApprovalRequestRepository.create.mockImplementation(async (command) => ({
      id: 'ai-approval-001',
      ...command,
      reviewedAt: null,
      reviewedByUserId: null,
      reviewedByEmail: null,
      reviewNote: null,
      createdAt: new Date('2026-05-23T12:01:00.000Z'),
      updatedAt: new Date('2026-05-23T12:01:00.000Z'),
    }));
    aiApprovalRequestRepository.findByTenantIdAndAgentKey.mockResolvedValue([
      {
        id: 'ai-approval-001',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        agentKey: 'growth-assist-coach',
        policyKey: 'growth-assist-suggestion-review',
        scope: 'suggestion_review',
        suggestionRunId: 'ai-run-001',
        requestedByUserId: 'user_123',
        requestedByEmail: 'owner@saas-platform.dev',
        rationale: 'Quiero dejar trazable la revisión humana.',
        summary:
          'Growth Assist Coach requested human review for suggestion handoff ai-run-001 under policy growth-assist-suggestion-review.',
        status: 'pending',
        reviewedAt: null,
        reviewedByUserId: null,
        reviewedByEmail: null,
        reviewNote: null,
        createdAt: new Date('2026-05-23T12:01:00.000Z'),
        updatedAt: new Date('2026-05-23T12:01:00.000Z'),
      },
    ]);
    aiApprovalRequestRepository.findByIdAndTenantIdAndAgentKey.mockResolvedValue({
      id: 'ai-approval-001',
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      agentKey: 'growth-assist-coach',
      policyKey: 'growth-assist-suggestion-review',
      scope: 'suggestion_review',
      suggestionRunId: 'ai-run-001',
      requestedByUserId: 'user_123',
      requestedByEmail: 'owner@saas-platform.dev',
      rationale: 'Quiero dejar trazable la revisión humana.',
      summary:
        'Growth Assist Coach requested human review for suggestion handoff ai-run-001 under policy growth-assist-suggestion-review.',
      status: 'pending',
      reviewedAt: null,
      reviewedByUserId: null,
      reviewedByEmail: null,
      reviewNote: null,
      createdAt: new Date('2026-05-23T12:01:00.000Z'),
      updatedAt: new Date('2026-05-23T12:01:00.000Z'),
    });
    aiApprovalRequestRepository.findPendingBySuggestionRunId.mockResolvedValue(
      null,
    );
    aiApprovalRequestRepository.review.mockImplementation(async (command) => ({
      id: 'ai-approval-001',
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      agentKey: 'growth-assist-coach',
      policyKey: 'growth-assist-suggestion-review',
      scope: 'suggestion_review',
      suggestionRunId: 'ai-run-001',
      requestedByUserId: 'user_123',
      requestedByEmail: 'owner@saas-platform.dev',
      rationale: 'Quiero dejar trazable la revisión humana.',
      summary:
        'Growth Assist Coach requested human review for suggestion handoff ai-run-001 under policy growth-assist-suggestion-review.',
      status: command.status,
      reviewedAt: new Date('2026-05-23T12:02:00.000Z'),
      reviewedByUserId: command.reviewedByUserId,
      reviewedByEmail: command.reviewedByEmail,
      reviewNote: command.reviewNote,
      createdAt: new Date('2026-05-23T12:01:00.000Z'),
      updatedAt: new Date('2026-05-23T12:02:00.000Z'),
    }));
  });

  it('requests human review for a tenant-scoped suggestion run', async () => {
    const useCase = new RequestTenantAiSuggestionRunApprovalUseCase(
      tenantRepository as any,
      aiSuggestionRunRepository as any,
      aiApprovalRequestRepository as any,
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      agentKey: 'growth-assist-coach',
      suggestionRunId: 'ai-run-001',
      requestedByUserId: 'user_123',
      requestedByEmail: 'owner@saas-platform.dev',
      rationale: 'Quiero dejar trazable la revisión humana.',
    });

    expect(
      aiSuggestionRunRepository.findByIdAndTenantIdAndAgentKey,
    ).toHaveBeenCalledWith('ai-run-001', 'tenant_123', 'growth-assist-coach');
    expect(
      aiApprovalRequestRepository.findPendingBySuggestionRunId,
    ).toHaveBeenCalledWith('ai-run-001', 'tenant_123', 'growth-assist-coach');
    expect(aiApprovalRequestRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        agentKey: 'growth-assist-coach',
        policyKey: 'growth-assist-suggestion-review',
        suggestionRunId: 'ai-run-001',
        status: 'pending',
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 'ai-approval-001',
        status: 'pending',
      }),
    );
  });

  it('lists tenant-scoped approval requests', async () => {
    const useCase = new ListTenantAiApprovalRequestsUseCase(
      tenantRepository as any,
      aiApprovalRequestRepository as any,
    );

    const result = await useCase.execute(
      'saas-platform',
      'growth-assist-coach',
      5,
    );

    expect(aiApprovalRequestRepository.findByTenantIdAndAgentKey).toHaveBeenCalledWith(
      'tenant_123',
      'growth-assist-coach',
      5,
    );
    expect(result).toHaveLength(1);
  });

  it('reviews an approval request', async () => {
    const useCase = new ReviewTenantAiApprovalRequestUseCase(
      tenantRepository as any,
      aiApprovalRequestRepository as any,
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      agentKey: 'growth-assist-coach',
      requestId: 'ai-approval-001',
      status: 'approved',
      reviewedByUserId: 'user_123',
      reviewedByEmail: 'owner@saas-platform.dev',
      reviewNote: 'Se ve segura para uso guiado.',
    });

    expect(
      aiApprovalRequestRepository.findByIdAndTenantIdAndAgentKey,
    ).toHaveBeenCalledWith(
      'ai-approval-001',
      'tenant_123',
      'growth-assist-coach',
    );
    expect(aiApprovalRequestRepository.review).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: 'ai-approval-001',
        status: 'approved',
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 'ai-approval-001',
        status: 'approved',
      }),
    );
  });
});
