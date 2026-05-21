import { GetTenantGrowthConversationWorkbenchUseCase } from '@saas-platform/growth-application';
import {
  ConversationMessage,
  ConversationThread,
} from '@saas-platform/growth-domain';
import { TenantRepository } from '@saas-platform/tenancy-application';

describe('Growth conversation workbench use case', () => {
  const tenantRepository: jest.Mocked<TenantRepository> = {
    findBySlug: jest.fn(),
  } as unknown as jest.Mocked<TenantRepository>;
  const conversationThreadRepository = {
    save: jest.fn(),
    findByTenantId: jest.fn(),
    findByTenantIdAndChannel: jest.fn(),
    findByTenantIdAndId: jest.fn(),
    findByTenantIdAndChannelAndExternalConversationId: jest.fn(),
  };
  const conversationMessageRepository = {
    save: jest.fn(),
    findByTenantId: jest.fn(),
    findByTenantIdAndId: jest.fn(),
    findByTenantIdAndThreadId: jest.fn(),
    findByTenantIdAndExternalMessageId: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      slug: 'saas-platform',
    } as any);
  });

  it('prioritizes overdue and unassigned conversation work', async () => {
    conversationThreadRepository.findByTenantId.mockResolvedValue([
      ConversationThread.create({
        id: 'thread_overdue',
        tenantId: 'tenant_123',
        leadId: 'lead_001',
        assigneeUserId: null,
        subject: 'WhatsApp Maria Perez',
        channel: 'whatsapp',
        externalConversationId: 'wa_conv_001',
        participantDisplayName: 'Maria Perez',
        participantHandle: '+593999111222',
        status: 'open',
        latestMessagePreview: 'Hola, quisiera una demo.',
        messageCount: 1,
        openedAt: new Date('2026-05-19T08:00:00.000Z'),
        closedAt: null,
        lastActivityAt: new Date('2026-05-19T08:00:00.000Z'),
        createdAt: new Date('2026-05-19T08:00:00.000Z'),
        updatedAt: new Date('2026-05-19T08:00:00.000Z'),
      }),
      ConversationThread.create({
        id: 'thread_waiting_customer',
        tenantId: 'tenant_123',
        leadId: 'lead_002',
        assigneeUserId: 'user_456',
        subject: 'Demo onboarding',
        channel: 'manual',
        externalConversationId: null,
        participantDisplayName: null,
        participantHandle: null,
        status: 'open',
        latestMessagePreview: 'Perfecto, te comparto la propuesta.',
        messageCount: 2,
        openedAt: new Date('2026-05-19T10:00:00.000Z'),
        closedAt: null,
        lastActivityAt: new Date('2026-05-19T10:30:00.000Z'),
        createdAt: new Date('2026-05-19T10:00:00.000Z'),
        updatedAt: new Date('2026-05-19T10:30:00.000Z'),
      }),
    ]);

    conversationMessageRepository.findByTenantIdAndThreadId.mockImplementation(
      async (_tenantId: string, threadId: string) => {
        if (threadId === 'thread_overdue') {
          return [
            ConversationMessage.create({
              id: 'message_001',
              tenantId: 'tenant_123',
              threadId,
              direction: 'inbound',
              body: 'Hola, quisiera una demo.',
              templateId: null,
              outboundIntentKey: null,
              provider: 'meta_cloud_api_stub',
              deliveryStatus: 'delivered',
              externalMessageId: 'wamid-001',
              failureReason: null,
              deliveredAt: new Date('2026-05-19T08:00:10.000Z'),
              readAt: null,
              createdAt: new Date('2026-05-19T08:00:00.000Z'),
            }),
          ];
        }

        return [
          ConversationMessage.create({
            id: 'message_002',
            tenantId: 'tenant_123',
            threadId,
            direction: 'inbound',
            body: 'Tienes una propuesta?',
            templateId: null,
            outboundIntentKey: null,
            provider: null,
            deliveryStatus: null,
            externalMessageId: null,
            failureReason: null,
            deliveredAt: null,
            readAt: null,
            createdAt: new Date('2026-05-19T10:00:00.000Z'),
          }),
          ConversationMessage.create({
            id: 'message_003',
            tenantId: 'tenant_123',
            threadId,
            direction: 'outbound',
            body: 'Perfecto, te comparto la propuesta.',
            templateId: null,
            outboundIntentKey: 'follow_up',
            provider: null,
            deliveryStatus: null,
            externalMessageId: null,
            failureReason: null,
            deliveredAt: null,
            readAt: null,
            createdAt: new Date('2026-05-19T10:30:00.000Z'),
          }),
        ];
      },
    );

    const useCase = new GetTenantGrowthConversationWorkbenchUseCase(
      tenantRepository,
      conversationThreadRepository as any,
      conversationMessageRepository as any,
      () => new Date('2026-05-19T12:30:00.000Z'),
    );

    const result = await useCase.execute('saas-platform', {
      firstResponseSlaHours: 1,
      followUpSlaHours: 4,
      staleThreadHours: 3,
    });

    expect(result.summary).toEqual({
      openThreadCount: 2,
      unassignedThreadCount: 1,
      waitingOnTeamCount: 1,
      waitingOnCustomerCount: 1,
      overdueFirstResponseCount: 1,
      overdueFollowUpCount: 1,
      staleThreadCount: 1,
    });
    expect(result.threads[0]).toEqual(
      expect.objectContaining({
        threadId: 'thread_overdue',
        nextActionOwner: 'team',
        firstResponseStatus: 'overdue',
        followUpStatus: 'overdue',
        staleStatus: 'stale',
        priority: 'critical',
        hoursSinceLastActivity: 4.5,
        hoursSinceLastInbound: 4.5,
      }),
    );
    expect(result.threads[1]).toEqual(
      expect.objectContaining({
        threadId: 'thread_waiting_customer',
        nextActionOwner: 'customer',
        firstResponseStatus: 'met',
        followUpStatus: 'not_applicable',
        staleStatus: 'fresh',
        priority: 'normal',
      }),
    );
  });
});
