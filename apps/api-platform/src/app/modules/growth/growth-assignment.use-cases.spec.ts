import {
  AssignTenantConversationThreadUseCase,
  AssignTenantOpportunityUseCase,
  ConversationThreadRepository,
  GrowthAssigneeMembershipNotFoundError,
  OpportunityRepository,
} from '@saas-platform/growth-application';
import {
  ConversationThread,
  Opportunity,
} from '@saas-platform/growth-domain';
import {
  MembershipRepository,
  TenantRepository,
} from '@saas-platform/tenancy-application';

describe('Growth assignment use cases', () => {
  const tenantRepository: jest.Mocked<TenantRepository> = {
    findBySlug: jest.fn(),
  } as unknown as jest.Mocked<TenantRepository>;
  const membershipRepository: jest.Mocked<MembershipRepository> = {
    save: jest.fn(),
    findByTenantId: jest.fn(),
    findByUserId: jest.fn(),
    findByTenantAndUser: jest.fn(),
  };
  const conversationThreadRepository: jest.Mocked<ConversationThreadRepository> =
    {
      save: jest.fn(),
      findByTenantId: jest.fn(),
      findByTenantIdAndChannel: jest.fn(),
      findByTenantIdAndId: jest.fn(),
      findByTenantIdAndChannelAndExternalConversationId: jest.fn(),
    };
  const opportunityRepository: jest.Mocked<OpportunityRepository> = {
    save: jest.fn(),
    findByTenantId: jest.fn(),
    findByTenantIdAndId: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      slug: 'saas-platform',
    } as any);
  });

  it('assigns a conversation thread to an existing tenant member', async () => {
    const thread = ConversationThread.create({
      id: 'thread_001',
      tenantId: 'tenant_123',
      leadId: 'lead_001',
      assigneeUserId: null,
      subject: 'Demo de onboarding facturacion',
      channel: 'manual',
      externalConversationId: null,
      participantDisplayName: null,
      participantHandle: null,
      status: 'open',
      latestMessagePreview: null,
      messageCount: 0,
      openedAt: new Date('2026-05-18T10:00:00.000Z'),
      closedAt: null,
      lastActivityAt: new Date('2026-05-18T10:00:00.000Z'),
      createdAt: new Date('2026-05-18T10:00:00.000Z'),
      updatedAt: new Date('2026-05-18T10:00:00.000Z'),
    });
    conversationThreadRepository.findByTenantIdAndId.mockResolvedValue(thread);
    membershipRepository.findByTenantAndUser.mockResolvedValue({
      id: 'membership_456',
      tenantId: 'tenant_123',
      userId: 'user_456',
    } as any);

    const useCase = new AssignTenantConversationThreadUseCase(
      tenantRepository,
      membershipRepository,
      conversationThreadRepository,
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      threadId: 'thread_001',
      assigneeUserId: 'user_456',
    });

    expect(result.assigneeUserId).toBe('user_456');
    expect(conversationThreadRepository.save).toHaveBeenCalledTimes(1);
  });

  it('rejects an opportunity assignment when the assignee is not a tenant member', async () => {
    const opportunity = Opportunity.create({
      id: 'opportunity_001',
      tenantId: 'tenant_123',
      leadId: 'lead_001',
      threadId: 'thread_001',
      assigneeUserId: null,
      title: 'Onboarding anual facturacion electronica',
      stage: 'proposal',
      amountInCents: 199000,
      currency: 'USD',
      notes: null,
      closedAt: null,
      createdAt: new Date('2026-05-18T10:00:00.000Z'),
      updatedAt: new Date('2026-05-18T10:00:00.000Z'),
    });
    opportunityRepository.findByTenantIdAndId.mockResolvedValue(opportunity);
    membershipRepository.findByTenantAndUser.mockResolvedValue(null);

    const useCase = new AssignTenantOpportunityUseCase(
      tenantRepository,
      membershipRepository,
      opportunityRepository,
    );

    await expect(
      useCase.execute({
        tenantSlug: 'saas-platform',
        opportunityId: 'opportunity_001',
        assigneeUserId: 'user_999',
      }),
    ).rejects.toBeInstanceOf(GrowthAssigneeMembershipNotFoundError);
  });
});
