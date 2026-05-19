import { GetTenantGrowthAssignmentWorkloadUseCase } from '@saas-platform/growth-application';
import {
  ConversationThread,
  Opportunity,
} from '@saas-platform/growth-domain';
import { User } from '@saas-platform/identity-domain';
import {
  MembershipRepository,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { Membership, MembershipStatus } from '@saas-platform/tenancy-domain';

describe('Growth workload use case', () => {
  const tenantRepository: jest.Mocked<TenantRepository> = {
    findBySlug: jest.fn(),
  } as unknown as jest.Mocked<TenantRepository>;
  const membershipRepository: jest.Mocked<MembershipRepository> = {
    save: jest.fn(),
    findByTenantId: jest.fn(),
    findByUserId: jest.fn(),
    findByTenantAndUser: jest.fn(),
  };
  const userRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    save: jest.fn(),
  };
  const conversationThreadRepository = {
    save: jest.fn(),
    findByTenantId: jest.fn(),
    findByTenantIdAndChannel: jest.fn(),
    findByTenantIdAndId: jest.fn(),
    findByTenantIdAndChannelAndExternalConversationId: jest.fn(),
  };
  const opportunityRepository = {
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

  it('aggregates unassigned and per-owner workload', async () => {
    membershipRepository.findByTenantId.mockResolvedValue([
      Membership.create({
        id: 'membership_123',
        tenantId: 'tenant_123',
        userId: 'user_123',
        status: MembershipStatus.Active,
        invitedBy: 'user_admin',
        createdAt: new Date('2026-05-18T12:00:00.000Z'),
        updatedAt: new Date('2026-05-18T12:00:00.000Z'),
      }),
      Membership.create({
        id: 'membership_456',
        tenantId: 'tenant_123',
        userId: 'user_456',
        status: MembershipStatus.Active,
        invitedBy: 'user_admin',
        createdAt: new Date('2026-05-18T12:00:00.000Z'),
        updatedAt: new Date('2026-05-18T12:00:00.000Z'),
      }),
    ]);
    conversationThreadRepository.findByTenantId.mockResolvedValue([
      ConversationThread.create({
        id: 'thread_001',
        tenantId: 'tenant_123',
        leadId: 'lead_001',
        assigneeUserId: 'user_456',
        subject: 'WhatsApp Maria Perez',
        channel: 'whatsapp',
        externalConversationId: 'wa_conv_001',
        participantDisplayName: 'Maria Perez',
        participantHandle: '+593999111222',
        status: 'open',
        latestMessagePreview: 'Hola',
        messageCount: 1,
        openedAt: new Date('2026-05-18T12:01:00.000Z'),
        closedAt: null,
        lastActivityAt: new Date('2026-05-18T12:02:00.000Z'),
        createdAt: new Date('2026-05-18T12:01:00.000Z'),
        updatedAt: new Date('2026-05-18T12:02:00.000Z'),
      }),
      ConversationThread.create({
        id: 'thread_002',
        tenantId: 'tenant_123',
        leadId: 'lead_002',
        assigneeUserId: null,
        subject: 'Demo onboarding',
        channel: 'manual',
        externalConversationId: null,
        participantDisplayName: null,
        participantHandle: null,
        status: 'open',
        latestMessagePreview: 'Pendiente de seguimiento',
        messageCount: 2,
        openedAt: new Date('2026-05-18T12:03:00.000Z'),
        closedAt: null,
        lastActivityAt: new Date('2026-05-18T12:04:00.000Z'),
        createdAt: new Date('2026-05-18T12:03:00.000Z'),
        updatedAt: new Date('2026-05-18T12:04:00.000Z'),
      }),
    ]);
    opportunityRepository.findByTenantId.mockResolvedValue([
      Opportunity.create({
        id: 'opportunity_001',
        tenantId: 'tenant_123',
        leadId: 'lead_001',
        threadId: 'thread_001',
        assigneeUserId: 'user_456',
        title: 'Cierre anual',
        stage: 'proposal',
        amountInCents: 250000,
        currency: 'USD',
        notes: null,
        closedAt: null,
        createdAt: new Date('2026-05-18T12:05:00.000Z'),
        updatedAt: new Date('2026-05-18T12:05:00.000Z'),
      }),
      Opportunity.create({
        id: 'opportunity_002',
        tenantId: 'tenant_123',
        leadId: 'lead_002',
        threadId: 'thread_002',
        assigneeUserId: null,
        title: 'Renovacion mensual',
        stage: 'discovery',
        amountInCents: 90000,
        currency: 'USD',
        notes: null,
        closedAt: null,
        createdAt: new Date('2026-05-18T12:06:00.000Z'),
        updatedAt: new Date('2026-05-18T12:06:00.000Z'),
      }),
      Opportunity.create({
        id: 'opportunity_003',
        tenantId: 'tenant_123',
        leadId: 'lead_003',
        threadId: null,
        assigneeUserId: 'user_456',
        title: 'Upsell cerrado',
        stage: 'won',
        amountInCents: 300000,
        currency: 'USD',
        notes: null,
        closedAt: new Date('2026-05-18T12:07:00.000Z'),
        createdAt: new Date('2026-05-18T12:07:00.000Z'),
        updatedAt: new Date('2026-05-18T12:07:00.000Z'),
      }),
    ]);
    userRepository.findById.mockImplementation(async (userId: string) => {
      if (userId === 'user_123') {
        return User.create({
          id: 'user_123',
          email: 'owner@saas-platform.dev',
          name: 'Jorge',
          avatarUrl: null,
          authProvider: 'password' as any,
          externalAuthId: null,
          preferredTenantId: null,
          createdAt: new Date('2026-05-18T12:00:00.000Z'),
          updatedAt: new Date('2026-05-18T12:00:00.000Z'),
        });
      }

      if (userId === 'user_456') {
        return User.create({
          id: 'user_456',
          email: 'sales@saas-platform.dev',
          name: 'Maria Sales',
          avatarUrl: null,
          authProvider: 'password' as any,
          externalAuthId: null,
          preferredTenantId: null,
          createdAt: new Date('2026-05-18T12:00:00.000Z'),
          updatedAt: new Date('2026-05-18T12:00:00.000Z'),
        });
      }

      return null;
    });

    const useCase = new GetTenantGrowthAssignmentWorkloadUseCase(
      tenantRepository,
      membershipRepository,
      userRepository as any,
      conversationThreadRepository as any,
      opportunityRepository as any,
    );

    const result = await useCase.execute('saas-platform');

    expect(result.totals).toEqual({
      openThreadCount: 2,
      unassignedOpenThreadCount: 1,
      openOpportunityCount: 2,
      unassignedOpenOpportunityCount: 1,
      openOpportunityAmountInCents: 340000,
    });
    expect(result.assignees).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: 'user_456',
          displayName: 'Maria Sales',
          openThreadCount: 1,
          openWhatsappThreadCount: 1,
          openManualThreadCount: 0,
          openOpportunityCount: 1,
          openOpportunityAmountInCents: 250000,
          wonOpportunityCount: 1,
          lostOpportunityCount: 0,
        }),
        expect.objectContaining({
          userId: 'user_123',
          displayName: 'Jorge',
          openThreadCount: 0,
          openOpportunityCount: 0,
        }),
      ]),
    );
  });
});
