import {
  ConversationDeliveryEventRepository,
  ConversationMessageRepository,
  ConversationThreadRepository,
  RetryTenantWhatsappFailedConversationMessageUseCase,
  SendTenantWhatsappConversationMessageUseCase,
  WhatsappMessageRetryNotAllowedError,
} from '@saas-platform/growth-application';
import {
  ConversationDeliveryEvent,
  ConversationMessage,
  ConversationThread,
} from '@saas-platform/growth-domain';
import { TenantRepository } from '@saas-platform/tenancy-application';

describe('Growth WhatsApp retry use case', () => {
  const tenantRepository: jest.Mocked<TenantRepository> = {
    findBySlug: jest.fn(),
  } as unknown as jest.Mocked<TenantRepository>;
  const conversationThreadRepository: jest.Mocked<ConversationThreadRepository> =
    {
      save: jest.fn(),
      findByTenantId: jest.fn(),
      findByTenantIdAndChannel: jest.fn(),
      findByTenantIdAndId: jest.fn(),
      findByTenantIdAndChannelAndExternalConversationId: jest.fn(),
    };
  const conversationMessageRepository: jest.Mocked<ConversationMessageRepository> =
    {
      save: jest.fn(),
      findByTenantId: jest.fn(),
      findByTenantIdAndId: jest.fn(),
      findByTenantIdAndThreadId: jest.fn(),
      findByTenantIdAndExternalMessageId: jest.fn(),
    };
  const conversationDeliveryEventRepository: jest.Mocked<ConversationDeliveryEventRepository> =
    {
      save: jest.fn(),
      findByTenantId: jest.fn(),
      findByTenantIdAndProviderAndEventKey: jest.fn(),
      findByTenantIdAndMessageId: jest.fn(),
    };
  const sendTenantWhatsappConversationMessageUseCase: jest.Mocked<SendTenantWhatsappConversationMessageUseCase> =
    {
      execute: jest.fn(),
    } as unknown as jest.Mocked<SendTenantWhatsappConversationMessageUseCase>;

  beforeEach(() => {
    jest.resetAllMocks();
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      slug: 'saas-platform',
    } as any);
    conversationMessageRepository.findByTenantId.mockResolvedValue([]);
    conversationThreadRepository.findByTenantIdAndId.mockResolvedValue(
      ConversationThread.create({
        id: 'thread_whatsapp_001',
        tenantId: 'tenant_123',
        leadId: 'lead_001',
        assigneeUserId: null,
        subject: 'Maria Perez',
        channel: 'whatsapp',
        externalConversationId: 'wa_conv_001',
        participantDisplayName: 'Maria Perez',
        participantHandle: '+593999111222',
        status: 'open',
        latestMessagePreview: 'Seguimos en contacto',
        messageCount: 3,
        openedAt: new Date('2026-05-19T09:00:00.000Z'),
        closedAt: null,
        lastActivityAt: new Date('2026-05-19T09:10:00.000Z'),
        createdAt: new Date('2026-05-19T09:00:00.000Z'),
        updatedAt: new Date('2026-05-19T09:10:00.000Z'),
      }),
    );
  });

  it('retries a ready-now failed freeform outbound message', async () => {
    conversationMessageRepository.findByTenantIdAndId.mockResolvedValue(
      ConversationMessage.create({
        id: 'message_001',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Te escribo de nuevo en unos minutos.',
        templateId: null,
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'failed',
        externalMessageId: 'wamid-001',
        failureReason: 'temporary_provider_timeout',
        deliveredAt: null,
        readAt: null,
        createdAt: new Date('2026-05-19T09:05:00.000Z'),
      }),
    );
    conversationDeliveryEventRepository.findByTenantIdAndMessageId.mockResolvedValue([
      ConversationDeliveryEvent.create({
        id: 'event_001',
        tenantId: 'tenant_123',
        messageId: 'message_001',
        provider: 'meta_cloud_api_stub',
        eventKey: 'wamid-001:failed:1',
        providerEventId: 'status:wamid-001:1',
        externalMessageId: 'wamid-001',
        deliveryStatus: 'failed',
        failureReason: 'temporary_provider_timeout',
        providerStatusDetail: 'transient_error',
        providerConversationCategory: null,
        providerPricingCategory: null,
        providerErrorCode: '131000',
        payloadJson: '{}',
        occurredAt: new Date('2026-05-19T09:05:00.000Z'),
        createdAt: new Date('2026-05-19T09:05:00.000Z'),
      }),
    ]);
    sendTenantWhatsappConversationMessageUseCase.execute.mockResolvedValue(
      ConversationMessage.create({
        id: 'message_002',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Te escribo de nuevo en unos minutos.',
        templateId: null,
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'pending',
        externalMessageId: 'wamid-002',
        failureReason: null,
        deliveredAt: null,
        readAt: null,
        createdAt: new Date('2026-05-19T09:15:00.000Z'),
      }),
    );

    const useCase = new RetryTenantWhatsappFailedConversationMessageUseCase(
      tenantRepository,
      conversationThreadRepository,
      conversationMessageRepository,
      conversationDeliveryEventRepository,
      sendTenantWhatsappConversationMessageUseCase,
      () => new Date('2026-05-19T09:15:00.000Z'),
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      threadId: 'thread_whatsapp_001',
      messageId: 'message_001',
      occurredAt: new Date('2026-05-19T09:15:00.000Z'),
    });

    expect(sendTenantWhatsappConversationMessageUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      threadId: 'thread_whatsapp_001',
      body: 'Te escribo de nuevo en unos minutos.',
      retryOfMessageId: 'message_001',
      outboundIntentKey: 'follow_up',
      occurredAt: new Date('2026-05-19T09:15:00.000Z'),
    });
    expect(result.id).toBe('message_002');
  });

  it('rejects retries that are still in cooldown', async () => {
    conversationMessageRepository.findByTenantIdAndId.mockResolvedValue(
      ConversationMessage.create({
        id: 'message_001',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Seguimos atentos.',
        templateId: null,
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'failed',
        externalMessageId: 'wamid-001',
        failureReason: 'temporary_provider_timeout',
        deliveredAt: null,
        readAt: null,
        createdAt: new Date('2026-05-19T09:05:00.000Z'),
      }),
    );
    conversationDeliveryEventRepository.findByTenantIdAndMessageId.mockResolvedValue([
      ConversationDeliveryEvent.create({
        id: 'event_001',
        tenantId: 'tenant_123',
        messageId: 'message_001',
        provider: 'meta_cloud_api_stub',
        eventKey: 'wamid-001:failed:1',
        providerEventId: 'status:wamid-001:1',
        externalMessageId: 'wamid-001',
        deliveryStatus: 'failed',
        failureReason: 'temporary_provider_timeout',
        providerStatusDetail: 'transient_error',
        providerConversationCategory: null,
        providerPricingCategory: null,
        providerErrorCode: '131000',
        payloadJson: '{}',
        occurredAt: new Date('2026-05-19T09:05:00.000Z'),
        createdAt: new Date('2026-05-19T09:05:00.000Z'),
      }),
    ]);

    const useCase = new RetryTenantWhatsappFailedConversationMessageUseCase(
      tenantRepository,
      conversationThreadRepository,
      conversationMessageRepository,
      conversationDeliveryEventRepository,
      sendTenantWhatsappConversationMessageUseCase,
      () => new Date('2026-05-19T09:07:00.000Z'),
    );

    await expect(
      useCase.execute({
        tenantSlug: 'saas-platform',
        threadId: 'thread_whatsapp_001',
        messageId: 'message_001',
      }),
    ).rejects.toBeInstanceOf(WhatsappMessageRetryNotAllowedError);

    expect(sendTenantWhatsappConversationMessageUseCase.execute).not.toHaveBeenCalled();
  });

  it('retries template messages when a persisted render snapshot is available', async () => {
    conversationMessageRepository.findByTenantIdAndId.mockResolvedValue(
      ConversationMessage.create({
        id: 'message_001',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Hola Maria, retomamos la demo.',
        templateId: 'template_001',
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'failed',
        externalMessageId: 'wamid-001',
        failureReason: 'temporary_provider_timeout',
        renderedTemplateSnapshotJson: JSON.stringify({
          templateId: 'template_001',
          templateKey: 'follow_up_demo',
          templateName: 'Follow Up Demo',
          templateLanguageCode: 'es_EC',
          templateCategory: 'utility',
          templateBodyTemplate: 'Hola {{firstName}}, retomamos la demo.',
          templateIntentKey: 'follow_up',
          providerTemplateName: 'follow_up_demo_meta',
          providerApprovalStatus: 'approved',
          templateStatus: 'active',
          renderedBody: 'Hola Maria, retomamos la demo.',
          bodyParameterValues: ['Maria'],
          templateVariables: {
            firstName: 'Maria',
          },
        }),
        deliveredAt: null,
        readAt: null,
        createdAt: new Date('2026-05-19T09:05:00.000Z'),
      }),
    );
    conversationDeliveryEventRepository.findByTenantIdAndMessageId.mockResolvedValue([
      ConversationDeliveryEvent.create({
        id: 'event_001',
        tenantId: 'tenant_123',
        messageId: 'message_001',
        provider: 'meta_cloud_api_stub',
        eventKey: 'wamid-001:failed:1',
        providerEventId: 'status:wamid-001:1',
        externalMessageId: 'wamid-001',
        deliveryStatus: 'failed',
        failureReason: 'temporary_provider_timeout',
        providerStatusDetail: 'transient_error',
        providerConversationCategory: null,
        providerPricingCategory: null,
        providerErrorCode: '131000',
        payloadJson: '{}',
        occurredAt: new Date('2026-05-19T09:05:00.000Z'),
        createdAt: new Date('2026-05-19T09:05:00.000Z'),
      }),
    ]);
    sendTenantWhatsappConversationMessageUseCase.execute.mockResolvedValue(
      ConversationMessage.create({
        id: 'message_002',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Hola Maria, retomamos la demo.',
        templateId: 'template_001',
        retryOfMessageId: 'message_001',
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'pending',
        externalMessageId: 'wamid-002',
        failureReason: null,
        deliveredAt: null,
        readAt: null,
        createdAt: new Date('2026-05-19T09:15:00.000Z'),
      }),
    );

    const useCase = new RetryTenantWhatsappFailedConversationMessageUseCase(
      tenantRepository,
      conversationThreadRepository,
      conversationMessageRepository,
      conversationDeliveryEventRepository,
      sendTenantWhatsappConversationMessageUseCase,
      () => new Date('2026-05-19T09:15:00.000Z'),
    );

    await useCase.execute({
      tenantSlug: 'saas-platform',
      threadId: 'thread_whatsapp_001',
      messageId: 'message_001',
    });

    expect(sendTenantWhatsappConversationMessageUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      threadId: 'thread_whatsapp_001',
      templateId: 'template_001',
      templateRenderSnapshot: expect.objectContaining({
        renderedBody: 'Hola Maria, retomamos la demo.',
        bodyParameterValues: ['Maria'],
      }),
      retryOfMessageId: 'message_001',
      outboundIntentKey: 'follow_up',
      occurredAt: new Date('2026-05-19T09:15:00.000Z'),
    });
  });

  it('rejects template retries when no persisted render snapshot exists yet', async () => {
    conversationMessageRepository.findByTenantIdAndId.mockResolvedValue(
      ConversationMessage.create({
        id: 'message_legacy_001',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Hola Maria, retomamos la demo.',
        templateId: 'template_001',
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'failed',
        externalMessageId: 'wamid-legacy-001',
        failureReason: 'temporary_provider_timeout',
        deliveredAt: null,
        readAt: null,
        createdAt: new Date('2026-05-19T09:05:00.000Z'),
      }),
    );
    conversationDeliveryEventRepository.findByTenantIdAndMessageId.mockResolvedValue([
      ConversationDeliveryEvent.create({
        id: 'event_legacy_001',
        tenantId: 'tenant_123',
        messageId: 'message_legacy_001',
        provider: 'meta_cloud_api_stub',
        eventKey: 'wamid-legacy-001:failed:1',
        providerEventId: 'status:wamid-legacy-001:1',
        externalMessageId: 'wamid-legacy-001',
        deliveryStatus: 'failed',
        failureReason: 'temporary_provider_timeout',
        providerStatusDetail: 'transient_error',
        providerConversationCategory: null,
        providerPricingCategory: null,
        providerErrorCode: '131000',
        payloadJson: '{}',
        occurredAt: new Date('2026-05-19T09:05:00.000Z'),
        createdAt: new Date('2026-05-19T09:05:00.000Z'),
      }),
    ]);

    const useCase = new RetryTenantWhatsappFailedConversationMessageUseCase(
      tenantRepository,
      conversationThreadRepository,
      conversationMessageRepository,
      conversationDeliveryEventRepository,
      sendTenantWhatsappConversationMessageUseCase,
      () => new Date('2026-05-19T09:15:00.000Z'),
    );

    await expect(
      useCase.execute({
        tenantSlug: 'saas-platform',
        threadId: 'thread_whatsapp_001',
        messageId: 'message_legacy_001',
      }),
    ).rejects.toBeInstanceOf(WhatsappMessageRetryNotAllowedError);
  });
});
