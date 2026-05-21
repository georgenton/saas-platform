import {
  CreateTenantGrowthOperationalCaseUseCase,
  ReopenTenantGrowthOperationalCaseUseCase,
  ReviewTenantGrowthOperationalCaseRoutingUseCase,
  ResolveTenantGrowthOperationalCaseUseCase,
  TakeTenantGrowthOperationalCaseUseCase,
  UpdateTenantGrowthOperationalCaseFollowUpStateUseCase,
} from '@saas-platform/growth-application';
import { TenantRepository } from '@saas-platform/tenancy-application';

describe('Growth operational cases use cases', () => {
  const tenantRepository: jest.Mocked<TenantRepository> = {
    findBySlug: jest.fn(),
  } as unknown as jest.Mocked<TenantRepository>;
  const growthOperationalCaseRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findByTenantId: jest.fn(),
    findByTenantIdAndId: jest.fn(),
    findByTenantIdAndSourceKey: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      slug: 'saas-platform',
    } as any);
  });

  it('reuses an existing resolved case source and reopens it with fresh metadata', async () => {
    growthOperationalCaseRepository.findByTenantIdAndSourceKey.mockResolvedValue({
      id: 'op-case-001',
      tenantId: 'tenant_123',
      sourceKey: 'alert:retry_queue_ready',
      caseType: 'alert_escalation',
      status: 'resolved',
      priority: 'warning',
      title: 'Old title',
      summary: 'Old summary',
      nextAction: 'Old next action',
      followUpState: null,
      routingPolicyKey: 'growth_ops',
      threadId: null,
      alertKey: 'retry_queue_ready',
      dueAt: null,
      assignedUserId: 'user_123',
      assignedUserEmail: 'owner@saas-platform.dev',
      createdByUserId: 'user_123',
      createdByEmail: 'owner@saas-platform.dev',
      resolvedAt: new Date('2026-05-19T10:00:00.000Z'),
      resolvedByUserId: 'user_123',
      resolvedByEmail: 'owner@saas-platform.dev',
      createdAt: new Date('2026-05-19T09:00:00.000Z'),
      updatedAt: new Date('2026-05-19T10:00:00.000Z'),
    });
    growthOperationalCaseRepository.save.mockImplementation(async (record) => record);

    const useCase = new CreateTenantGrowthOperationalCaseUseCase(
      tenantRepository,
      growthOperationalCaseRepository as any,
      () => new Date('2026-05-20T10:00:00.000Z'),
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      sourceKey: 'alert:retry_queue_ready',
      caseType: 'alert_escalation',
      priority: 'critical',
      title: 'Retry queue has ready-now messages',
      summary: '1 failed outbound messages are ready for retry execution now.',
      nextAction:
        'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
      alertKey: 'retry_queue_ready',
      createdByUserId: 'user_456',
      createdByEmail: 'ops@saas-platform.dev',
    });

    expect(growthOperationalCaseRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'op-case-001',
        status: 'in_progress',
        priority: 'critical',
        title: 'Retry queue has ready-now messages',
        summary: '1 failed outbound messages are ready for retry execution now.',
        resolvedAt: null,
        resolvedByUserId: null,
        resolvedByEmail: null,
        routingPolicyKey: 'growth_ops',
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 'op-case-001',
        status: 'in_progress',
        priority: 'critical',
      }),
    );
  });

  it('lets the operator take, resolve, and reopen the same case', async () => {
    const baseRecord = {
      id: 'op-case-001',
      tenantId: 'tenant_123',
      sourceKey: 'thread:thread_001:follow_up',
      caseType: 'follow_up',
      status: 'open',
      priority: 'warning',
      title: 'Forzar follow-up',
      summary: 'Hace falta seguimiento explícito del equipo.',
      nextAction: 'Definir próximo outreach.',
      followUpState: 'pending_team',
      routingPolicyKey: 'follow_up_team',
      threadId: 'thread_001',
      alertKey: null,
      dueAt: new Date('2026-05-20T12:00:00.000Z'),
      assignedUserId: null,
      assignedUserEmail: null,
      createdByUserId: 'user_123',
      createdByEmail: 'owner@saas-platform.dev',
      resolvedAt: null,
      resolvedByUserId: null,
      resolvedByEmail: null,
      createdAt: new Date('2026-05-20T10:00:00.000Z'),
      updatedAt: new Date('2026-05-20T10:00:00.000Z'),
    };

    growthOperationalCaseRepository.findByTenantIdAndId.mockResolvedValue(baseRecord);
    growthOperationalCaseRepository.save.mockImplementation(async (record) => record);

    const takeUseCase = new TakeTenantGrowthOperationalCaseUseCase(
      tenantRepository,
      growthOperationalCaseRepository as any,
      () => new Date('2026-05-20T10:05:00.000Z'),
    );
    const resolveUseCase = new ResolveTenantGrowthOperationalCaseUseCase(
      tenantRepository,
      growthOperationalCaseRepository as any,
      () => new Date('2026-05-20T10:10:00.000Z'),
    );
    const reopenUseCase = new ReopenTenantGrowthOperationalCaseUseCase(
      tenantRepository,
      growthOperationalCaseRepository as any,
      () => new Date('2026-05-20T10:15:00.000Z'),
    );

    const taken = await takeUseCase.execute({
      tenantSlug: 'saas-platform',
      caseId: 'op-case-001',
      assignedUserId: 'user_456',
      assignedUserEmail: 'ops@saas-platform.dev',
    });
    expect(taken).toEqual(
      expect.objectContaining({
        status: 'in_progress',
        assignedUserId: 'user_456',
      }),
    );

    growthOperationalCaseRepository.findByTenantIdAndId.mockResolvedValue({
      ...taken,
      status: 'in_progress',
      assignedUserId: 'user_456',
      assignedUserEmail: 'ops@saas-platform.dev',
    });

    const resolved = await resolveUseCase.execute({
      tenantSlug: 'saas-platform',
      caseId: 'op-case-001',
      resolvedByUserId: 'user_456',
      resolvedByEmail: 'ops@saas-platform.dev',
    });
    expect(resolved).toEqual(
      expect.objectContaining({
        status: 'resolved',
        resolvedByUserId: 'user_456',
      }),
    );

    growthOperationalCaseRepository.findByTenantIdAndId.mockResolvedValue(resolved);

    const reopened = await reopenUseCase.execute({
      tenantSlug: 'saas-platform',
      caseId: 'op-case-001',
    });
    expect(reopened).toEqual(
      expect.objectContaining({
        status: 'in_progress',
        resolvedAt: null,
      }),
    );
  });

  it('updates explicit follow-up state for an active follow-up case', async () => {
    growthOperationalCaseRepository.findByTenantIdAndId.mockResolvedValue({
      id: 'op-case-002',
      tenantId: 'tenant_123',
      sourceKey: 'thread:thread_001:follow_up',
      caseType: 'follow_up',
      status: 'in_progress',
      priority: 'warning',
      title: 'Forzar follow-up',
      summary: 'Hace falta seguimiento explícito del equipo.',
      nextAction: 'Definir próximo outreach.',
      followUpState: 'pending_team',
      routingPolicyKey: 'follow_up_team',
      threadId: 'thread_001',
      alertKey: null,
      dueAt: new Date('2026-05-20T12:00:00.000Z'),
      assignedUserId: 'user_456',
      assignedUserEmail: 'ops@saas-platform.dev',
      createdByUserId: 'user_123',
      createdByEmail: 'owner@saas-platform.dev',
      resolvedAt: null,
      resolvedByUserId: null,
      resolvedByEmail: null,
      createdAt: new Date('2026-05-20T10:00:00.000Z'),
      updatedAt: new Date('2026-05-20T10:05:00.000Z'),
    });
    growthOperationalCaseRepository.save.mockImplementation(async (record) => record);

    const useCase = new UpdateTenantGrowthOperationalCaseFollowUpStateUseCase(
      tenantRepository,
      growthOperationalCaseRepository as any,
      () => new Date('2026-05-20T10:20:00.000Z'),
    );

    const updated = await useCase.execute({
      tenantSlug: 'saas-platform',
      caseId: 'op-case-002',
      followUpState: 'waiting_customer',
      nextAction:
        'Esperar respuesta del cliente antes del siguiente outreach.',
      dueAt: null,
    });

    expect(updated).toEqual(
      expect.objectContaining({
        followUpState: 'waiting_customer',
        routingPolicyKey: 'follow_up_waiting_customer',
        nextAction:
          'Esperar respuesta del cliente antes del siguiente outreach.',
        dueAt: null,
      }),
    );
  });

  it('escalates overdue follow-up cases into escalation review when they stay on the team lane', async () => {
    growthOperationalCaseRepository.findByTenantIdAndSourceKey.mockResolvedValue(null);
    growthOperationalCaseRepository.create.mockImplementation(async (record) => ({
      id: 'op-case-003',
      createdAt: new Date('2026-05-20T10:20:00.000Z'),
      updatedAt: new Date('2026-05-20T10:20:00.000Z'),
      ...record,
    }));

    const useCase = new CreateTenantGrowthOperationalCaseUseCase(
      tenantRepository,
      growthOperationalCaseRepository as any,
      () => new Date('2026-05-20T10:20:00.000Z'),
    );

    const created = await useCase.execute({
      tenantSlug: 'saas-platform',
      sourceKey: 'thread:thread_002:follow_up',
      caseType: 'follow_up',
      priority: 'warning',
      title: 'Escalar follow-up vencido',
      summary: 'El follow-up ya vencio y sigue sin cerrarse.',
      nextAction: 'Subir a revision operativa.',
      followUpState: 'scheduled',
      dueAt: new Date('2026-05-20T09:45:00.000Z'),
      threadId: 'thread_002',
      createdByUserId: 'user_123',
      createdByEmail: 'owner@saas-platform.dev',
    });

    expect(created).toEqual(
      expect.objectContaining({
        priority: 'critical',
        routingPolicyKey: 'escalation_review',
        followUpState: 'scheduled',
      }),
    );
  });

  it('reviews active operational cases and reroutes overdue work into escalation review', async () => {
    growthOperationalCaseRepository.findByTenantId.mockResolvedValue([
      {
        id: 'op-case-010',
        tenantId: 'tenant_123',
        sourceKey: 'thread:thread_010:ownership',
        caseType: 'ownership_routing',
        status: 'open',
        priority: 'warning',
        title: 'Asignar owner',
        summary: 'Thread sin owner.',
        nextAction: 'Asignar responsable.',
        followUpState: null,
        routingPolicyKey: 'owner_assignment',
        threadId: 'thread_010',
        alertKey: null,
        dueAt: new Date('2026-05-20T09:30:00.000Z'),
        assignedUserId: null,
        assignedUserEmail: null,
        createdByUserId: 'user_123',
        createdByEmail: 'owner@saas-platform.dev',
        resolvedAt: null,
        resolvedByUserId: null,
        resolvedByEmail: null,
        createdAt: new Date('2026-05-20T08:00:00.000Z'),
        updatedAt: new Date('2026-05-20T08:00:00.000Z'),
      },
      {
        id: 'op-case-011',
        tenantId: 'tenant_123',
        sourceKey: 'thread:thread_011:follow_up',
        caseType: 'follow_up',
        status: 'in_progress',
        priority: 'warning',
        title: 'Esperar cliente',
        summary: 'Caso esperando respuesta.',
        nextAction: 'Esperar.',
        followUpState: 'waiting_customer',
        routingPolicyKey: 'follow_up_waiting_customer',
        threadId: 'thread_011',
        alertKey: null,
        dueAt: null,
        assignedUserId: 'user_456',
        assignedUserEmail: 'ops@saas-platform.dev',
        createdByUserId: 'user_123',
        createdByEmail: 'owner@saas-platform.dev',
        resolvedAt: null,
        resolvedByUserId: null,
        resolvedByEmail: null,
        createdAt: new Date('2026-05-20T08:00:00.000Z'),
        updatedAt: new Date('2026-05-20T08:00:00.000Z'),
      },
    ]);
    growthOperationalCaseRepository.save.mockImplementation(async (record) => record);

    const useCase = new ReviewTenantGrowthOperationalCaseRoutingUseCase(
      tenantRepository,
      growthOperationalCaseRepository as any,
      () => new Date('2026-05-20T10:30:00.000Z'),
    );

    const reviewed = await useCase.execute({
      tenantSlug: 'saas-platform',
    });

    expect(reviewed).toEqual(
      expect.objectContaining({
        reviewedCount: 2,
        updatedCount: 1,
        escalationReviewCount: 1,
      }),
    );
    expect(reviewed.cases[0]).toEqual(
      expect.objectContaining({
        id: 'op-case-010',
        priority: 'critical',
        routingPolicyKey: 'escalation_review',
      }),
    );
  });
});
