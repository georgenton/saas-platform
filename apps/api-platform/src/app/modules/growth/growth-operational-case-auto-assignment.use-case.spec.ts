import { AuthProvider, User } from '@saas-platform/identity-domain';
import {
  AutoAssignTenantGrowthOperationalCasesUseCase,
  GROWTH_PERMISSIONS,
} from '@saas-platform/growth-application';
import { ConversationThread, Opportunity } from '@saas-platform/growth-domain';
import {
  MembershipRepository,
  TenantAccessRepository,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { Membership, MembershipStatus } from '@saas-platform/tenancy-domain';

describe('Growth operational case auto-assignment use case', () => {
  const tenantRepository: jest.Mocked<TenantRepository> = {
    findBySlug: jest.fn(),
  } as unknown as jest.Mocked<TenantRepository>;
  const membershipRepository: jest.Mocked<MembershipRepository> = {
    save: jest.fn(),
    findByTenantId: jest.fn(),
    findByUserId: jest.fn(),
    findByTenantAndUser: jest.fn(),
  };
  const tenantAccessRepository: jest.Mocked<TenantAccessRepository> = {
    findByTenantAndUser: jest.fn(),
  };
  const userRepository = {
    findById: jest.fn(),
  };
  const growthOperationalCaseRepository = {
    findByTenantId: jest.fn(),
    save: jest.fn(),
  };
  const conversationThreadRepository = {
    findByTenantId: jest.fn(),
    save: jest.fn(),
  };
  const opportunityRepository = {
    findByTenantId: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      slug: 'saas-platform',
    } as any);
    membershipRepository.findByTenantId.mockResolvedValue([
      Membership.create({
        id: 'membership_1',
        tenantId: 'tenant_123',
        userId: 'user_456',
        status: MembershipStatus.Active,
        invitedBy: null,
        createdAt: new Date('2026-05-21T09:00:00.000Z'),
        updatedAt: new Date('2026-05-21T09:00:00.000Z'),
      }),
      Membership.create({
        id: 'membership_2',
        tenantId: 'tenant_123',
        userId: 'user_789',
        status: MembershipStatus.Active,
        invitedBy: null,
        createdAt: new Date('2026-05-21T09:00:00.000Z'),
        updatedAt: new Date('2026-05-21T09:00:00.000Z'),
      }),
    ]);
    tenantAccessRepository.findByTenantAndUser.mockImplementation(
      async (_tenantId, userId) => ({
        membershipId: `membership-for-${userId}`,
        membershipStatus: MembershipStatus.Active,
        roleKeys: ['tenant_owner'],
        permissionKeys: [GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE],
      }),
    );
    userRepository.findById.mockImplementation(async (userId: string) =>
      User.create({
        id: userId,
        email: `${userId}@saas-platform.dev`,
        authProvider: AuthProvider.Password,
        externalAuthId: null,
        name: userId === 'user_456' ? 'Maria' : 'Jorge',
        createdAt: new Date('2026-05-21T09:00:00.000Z'),
        updatedAt: new Date('2026-05-21T09:00:00.000Z'),
      }),
    );
    growthOperationalCaseRepository.save.mockImplementation(async (record) => record);
    conversationThreadRepository.save.mockResolvedValue(undefined);
    opportunityRepository.findByTenantId.mockResolvedValue([]);
  });

  it('inherits an eligible thread owner before falling back to least-loaded candidates', async () => {
    growthOperationalCaseRepository.findByTenantId.mockResolvedValue([
      {
        id: 'case_001',
        tenantId: 'tenant_123',
        sourceKey: 'thread:thread_001:follow_up',
        caseType: 'follow_up',
        status: 'open',
        priority: 'warning',
        title: 'Follow-up pendiente',
        summary: 'Hace falta seguimiento del equipo.',
        nextAction: 'Contactar al cliente.',
        followUpState: 'pending_team',
        routingPolicyKey: 'follow_up_team',
        threadId: 'thread_001',
        alertKey: null,
        dueAt: new Date('2026-05-21T12:00:00.000Z'),
        assignedUserId: null,
        assignedUserEmail: null,
        createdByUserId: 'user_123',
        createdByEmail: 'owner@saas-platform.dev',
        resolvedAt: null,
        resolvedByUserId: null,
        resolvedByEmail: null,
        createdAt: new Date('2026-05-21T09:00:00.000Z'),
        updatedAt: new Date('2026-05-21T09:00:00.000Z'),
      },
      {
        id: 'case_002',
        tenantId: 'tenant_123',
        sourceKey: 'thread:thread_002:ownership',
        caseType: 'ownership_routing',
        status: 'open',
        priority: 'warning',
        title: 'Asignar owner',
        summary: 'Thread sin owner.',
        nextAction: 'Definir responsable.',
        followUpState: null,
        routingPolicyKey: 'owner_assignment',
        threadId: 'thread_002',
        alertKey: null,
        dueAt: new Date('2026-05-21T13:00:00.000Z'),
        assignedUserId: null,
        assignedUserEmail: null,
        createdByUserId: 'user_123',
        createdByEmail: 'owner@saas-platform.dev',
        resolvedAt: null,
        resolvedByUserId: null,
        resolvedByEmail: null,
        createdAt: new Date('2026-05-21T09:00:00.000Z'),
        updatedAt: new Date('2026-05-21T09:00:00.000Z'),
      },
    ]);
    conversationThreadRepository.findByTenantId.mockResolvedValue([
      ConversationThread.create({
        id: 'thread_001',
        tenantId: 'tenant_123',
        leadId: 'lead_001',
        assigneeUserId: 'user_789',
        subject: 'Follow-up',
        channel: 'whatsapp',
        externalConversationId: null,
        participantDisplayName: null,
        participantHandle: null,
        status: 'open',
        latestMessagePreview: 'Hola',
        messageCount: 2,
        openedAt: new Date('2026-05-21T08:00:00.000Z'),
        closedAt: null,
        lastActivityAt: new Date('2026-05-21T08:30:00.000Z'),
        createdAt: new Date('2026-05-21T08:00:00.000Z'),
        updatedAt: new Date('2026-05-21T08:30:00.000Z'),
      }),
      ConversationThread.create({
        id: 'thread_002',
        tenantId: 'tenant_123',
        leadId: 'lead_002',
        assigneeUserId: null,
        subject: 'Ownership',
        channel: 'manual',
        externalConversationId: null,
        participantDisplayName: null,
        participantHandle: null,
        status: 'open',
        latestMessagePreview: 'Pendiente',
        messageCount: 1,
        openedAt: new Date('2026-05-21T08:00:00.000Z'),
        closedAt: null,
        lastActivityAt: new Date('2026-05-21T08:45:00.000Z'),
        createdAt: new Date('2026-05-21T08:00:00.000Z'),
        updatedAt: new Date('2026-05-21T08:45:00.000Z'),
      }),
    ]);

    const useCase = new AutoAssignTenantGrowthOperationalCasesUseCase(
      tenantRepository,
      membershipRepository,
      tenantAccessRepository,
      userRepository as any,
      growthOperationalCaseRepository as any,
      conversationThreadRepository as any,
      opportunityRepository as any,
      () => new Date('2026-05-21T10:00:00.000Z'),
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
    });

    expect(result).toEqual(
      expect.objectContaining({
        policyKey: 'balanced',
        candidateCount: 2,
        reviewedCount: 2,
        assignedCount: 2,
        threadAssignmentCount: 1,
        inheritedOwnerCount: 1,
        fallbackAssignmentCount: 1,
      }),
    );
    expect(result.cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'case_001',
          assignedUserId: 'user_789',
          assignedUserEmail: 'user_789@saas-platform.dev',
        }),
        expect.objectContaining({
          id: 'case_002',
          assignedUserId: 'user_456',
          assignedUserEmail: 'user_456@saas-platform.dev',
        }),
      ]),
    );
    expect(conversationThreadRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        assigneeUserId: 'user_456',
      }),
    );
  });

  it('skips auto-assignment when no eligible growth operators exist', async () => {
    growthOperationalCaseRepository.findByTenantId.mockResolvedValue([
      {
        id: 'case_003',
        tenantId: 'tenant_123',
        sourceKey: 'thread:thread_003:ownership',
        caseType: 'ownership_routing',
        status: 'open',
        priority: 'warning',
        title: 'Asignar owner',
        summary: 'Thread sin owner.',
        nextAction: 'Definir responsable.',
        followUpState: null,
        routingPolicyKey: 'owner_assignment',
        threadId: 'thread_003',
        alertKey: null,
        dueAt: new Date('2026-05-21T13:00:00.000Z'),
        assignedUserId: null,
        assignedUserEmail: null,
        createdByUserId: 'user_123',
        createdByEmail: 'owner@saas-platform.dev',
        resolvedAt: null,
        resolvedByUserId: null,
        resolvedByEmail: null,
        createdAt: new Date('2026-05-21T09:00:00.000Z'),
        updatedAt: new Date('2026-05-21T09:00:00.000Z'),
      },
    ]);
    conversationThreadRepository.findByTenantId.mockResolvedValue([]);
    tenantAccessRepository.findByTenantAndUser.mockResolvedValue({
      membershipId: 'membership_1',
      membershipStatus: MembershipStatus.Active,
      roleKeys: ['tenant_viewer'],
      permissionKeys: [],
    });

    const useCase = new AutoAssignTenantGrowthOperationalCasesUseCase(
      tenantRepository,
      membershipRepository,
      tenantAccessRepository,
      userRepository as any,
      growthOperationalCaseRepository as any,
      conversationThreadRepository as any,
      opportunityRepository as any,
      () => new Date('2026-05-21T10:00:00.000Z'),
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
    });

    expect(result).toEqual({
      policyKey: 'balanced',
      candidateCount: 0,
      reviewedCount: 1,
      assignedCount: 0,
      threadAssignmentCount: 0,
      inheritedOwnerCount: 0,
      fallbackAssignmentCount: 0,
      cases: [],
    });
    expect(growthOperationalCaseRepository.save).not.toHaveBeenCalled();
  });

  it('applies owner_queue_first policy before escalation and follow-up work', async () => {
    growthOperationalCaseRepository.findByTenantId.mockResolvedValue([
      {
        id: 'case_escalation',
        tenantId: 'tenant_123',
        sourceKey: 'thread:thread_010:escalation',
        caseType: 'ownership_routing',
        status: 'open',
        priority: 'critical',
        title: 'Escalated ownership',
        summary: 'Escalated queue.',
        nextAction: 'Pick owner now.',
        followUpState: null,
        routingPolicyKey: 'escalation_review',
        threadId: 'thread_010',
        alertKey: null,
        dueAt: new Date('2026-05-21T09:00:00.000Z'),
        assignedUserId: null,
        assignedUserEmail: null,
        createdByUserId: 'user_123',
        createdByEmail: 'owner@saas-platform.dev',
        resolvedAt: null,
        resolvedByUserId: null,
        resolvedByEmail: null,
        createdAt: new Date('2026-05-21T08:00:00.000Z'),
        updatedAt: new Date('2026-05-21T08:00:00.000Z'),
      },
      {
        id: 'case_owner',
        tenantId: 'tenant_123',
        sourceKey: 'thread:thread_011:ownership',
        caseType: 'ownership_routing',
        status: 'open',
        priority: 'warning',
        title: 'Owner queue',
        summary: 'Needs owner.',
        nextAction: 'Assign queue owner.',
        followUpState: null,
        routingPolicyKey: 'owner_assignment',
        threadId: 'thread_011',
        alertKey: null,
        dueAt: new Date('2026-05-21T11:00:00.000Z'),
        assignedUserId: null,
        assignedUserEmail: null,
        createdByUserId: 'user_123',
        createdByEmail: 'owner@saas-platform.dev',
        resolvedAt: null,
        resolvedByUserId: null,
        resolvedByEmail: null,
        createdAt: new Date('2026-05-21T08:00:00.000Z'),
        updatedAt: new Date('2026-05-21T08:00:00.000Z'),
      },
    ]);
    conversationThreadRepository.findByTenantId.mockResolvedValue([]);

    const saveOrder: string[] = [];
    growthOperationalCaseRepository.save.mockImplementation(async (record) => {
      saveOrder.push(record.id);
      return record;
    });

    const useCase = new AutoAssignTenantGrowthOperationalCasesUseCase(
      tenantRepository,
      membershipRepository,
      tenantAccessRepository,
      userRepository as any,
      growthOperationalCaseRepository as any,
      conversationThreadRepository as any,
      opportunityRepository as any,
      () => new Date('2026-05-21T10:00:00.000Z'),
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      policyKey: 'owner_queue_first',
    });

    expect(result.policyKey).toBe('owner_queue_first');
    expect(saveOrder).toEqual(['case_owner', 'case_escalation']);
  });
});
