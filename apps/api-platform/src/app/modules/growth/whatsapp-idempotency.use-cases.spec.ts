import {
  ConversationDeliveryEventIdGenerator,
  ConversationDeliveryEventRepository,
  ConversationMessageIdGenerator,
  ConversationMessageRepository,
  ConversationThreadIdGenerator,
  ConversationThreadRepository,
  IngestTenantWhatsappConversationMessageUseCase,
  IngestTenantWhatsappDeliveryEventUseCase,
  LeadRepository,
  SendTenantWhatsappConversationMessageUseCase,
  WhatsappMessageTemplateRepository,
  WhatsappOutboundMessageGateway,
} from '@saas-platform/growth-application';
import {
  ConversationMessage,
  ConversationThread,
  WhatsappMessageTemplate,
} from '@saas-platform/growth-domain';
import { TenantRepository } from '@saas-platform/tenancy-application';

describe('WhatsApp idempotency use cases', () => {
  const tenantRepository: jest.Mocked<TenantRepository> = {
    findBySlug: jest.fn(),
  } as unknown as jest.Mocked<TenantRepository>;
  const leadRepository: jest.Mocked<LeadRepository> = {
    findByTenantId: jest.fn(),
    findByTenantIdAndId: jest.fn(),
    save: jest.fn(),
  } as unknown as jest.Mocked<LeadRepository>;
  const conversationThreadRepository: jest.Mocked<ConversationThreadRepository> =
    {
      save: jest.fn(),
      findByTenantId: jest.fn(),
      findByTenantIdAndChannel: jest.fn(),
      findByTenantIdAndId: jest.fn(),
      findByTenantIdAndChannelAndExternalConversationId: jest.fn(),
    };
  const conversationThreadIdGenerator: jest.Mocked<ConversationThreadIdGenerator> =
    {
      generate: jest.fn(),
    };
  const conversationMessageRepository: jest.Mocked<ConversationMessageRepository> =
    {
      save: jest.fn(),
      findByTenantId: jest.fn(),
      findByTenantIdAndThreadId: jest.fn(),
      findByTenantIdAndExternalMessageId: jest.fn(),
    };
  const conversationMessageIdGenerator: jest.Mocked<ConversationMessageIdGenerator> =
    {
      generate: jest.fn(),
    };
  const conversationDeliveryEventRepository: jest.Mocked<ConversationDeliveryEventRepository> =
    {
      save: jest.fn(),
      findByTenantIdAndProviderAndEventKey: jest.fn(),
      findByTenantIdAndMessageId: jest.fn(),
    };
  const conversationDeliveryEventIdGenerator: jest.Mocked<ConversationDeliveryEventIdGenerator> =
    {
      generate: jest.fn(),
    };
  const whatsappOutboundMessageGateway: jest.Mocked<WhatsappOutboundMessageGateway> =
    {
      send: jest.fn(),
    };
  const whatsappMessageTemplateRepository: jest.Mocked<WhatsappMessageTemplateRepository> =
    {
      save: jest.fn(),
      findByTenantId: jest.fn(),
      findByTenantIdAndId: jest.fn(),
      findByTenantIdAndKey: jest.fn(),
    };

  beforeEach(() => {
    jest.resetAllMocks();
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      slug: 'saas-platform',
    } as any);
    conversationDeliveryEventIdGenerator.generate.mockReturnValue('event_001');
    whatsappOutboundMessageGateway.send.mockResolvedValue({
      provider: 'meta_cloud_api_stub',
      externalMessageId: 'wamid-stub-001',
      deliveryStatus: 'pending',
      failureReason: null,
      providerResponseJson: '{"mode":"stub"}',
    });
  });

  it('does not duplicate an inbound WhatsApp message with the same externalMessageId', async () => {
    const existingThread = ConversationThread.create({
      id: 'thread_001',
      tenantId: 'tenant_123',
      leadId: null,
      assigneeUserId: null,
      subject: 'WhatsApp +593999111222',
      channel: 'whatsapp',
      externalConversationId: '+593999111222',
      participantDisplayName: 'Maria Perez',
      participantHandle: '+593999111222',
      status: 'open',
      latestMessagePreview: 'Hola',
      messageCount: 1,
      openedAt: new Date('2026-05-18T15:00:00.000Z'),
      closedAt: null,
      lastActivityAt: new Date('2026-05-18T15:00:00.000Z'),
      createdAt: new Date('2026-05-18T15:00:00.000Z'),
      updatedAt: new Date('2026-05-18T15:00:00.000Z'),
    });
    const existingMessage = ConversationMessage.create({
      id: 'message_001',
      tenantId: 'tenant_123',
      threadId: 'thread_001',
      direction: 'inbound',
      body: 'Hola',
      templateId: null,
      outboundIntentKey: null,
      provider: 'meta_cloud_api_stub',
      deliveryStatus: 'delivered',
      externalMessageId: 'wamid-001',
      failureReason: null,
      deliveredAt: new Date('2026-05-18T15:00:00.000Z'),
      readAt: null,
      createdAt: new Date('2026-05-18T15:00:00.000Z'),
    });
    conversationMessageRepository.findByTenantIdAndExternalMessageId.mockResolvedValue(
      existingMessage,
    );
    conversationThreadRepository.findByTenantIdAndId.mockResolvedValue(
      existingThread,
    );

    const useCase = new IngestTenantWhatsappConversationMessageUseCase(
      tenantRepository,
      leadRepository,
      conversationThreadRepository,
      conversationThreadIdGenerator,
      conversationMessageRepository,
      conversationMessageIdGenerator,
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      externalConversationId: '+593999111222',
      participantHandle: '+593999111222',
      body: 'Hola',
      externalMessageId: 'wamid-001',
    });

    expect(result.createdThread).toBe(false);
    expect(result.thread.id).toBe('thread_001');
    expect(result.message.id).toBe('message_001');
    expect(conversationThreadRepository.save).not.toHaveBeenCalled();
    expect(conversationMessageRepository.save).not.toHaveBeenCalled();
  });

  it('ignores a repeated or lower-ranked delivery status event', async () => {
    const deliveredMessage = ConversationMessage.create({
      id: 'message_001',
      tenantId: 'tenant_123',
      threadId: 'thread_001',
      direction: 'outbound',
      body: 'Te escribo por la propuesta',
      templateId: null,
      outboundIntentKey: null,
      provider: 'meta_cloud_api_stub',
      deliveryStatus: 'delivered',
      externalMessageId: 'wamid-002',
      failureReason: null,
      deliveredAt: new Date('2026-05-18T15:00:00.000Z'),
      readAt: null,
      createdAt: new Date('2026-05-18T14:59:00.000Z'),
    });
    conversationMessageRepository.findByTenantIdAndExternalMessageId.mockResolvedValue(
      deliveredMessage,
    );

    const useCase = new IngestTenantWhatsappDeliveryEventUseCase(
      tenantRepository,
      conversationMessageRepository,
      conversationDeliveryEventRepository,
      conversationDeliveryEventIdGenerator,
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      externalMessageId: 'wamid-002',
      deliveryStatus: 'sent',
    });

    expect(result.deliveryStatus).toBe('delivered');
    expect(conversationMessageRepository.save).not.toHaveBeenCalled();
    expect(conversationDeliveryEventRepository.save).toHaveBeenCalledTimes(1);
  });

  it('sends an outbound WhatsApp message through the gateway and stores provider metadata', async () => {
    const thread = ConversationThread.create({
      id: 'thread_001',
      tenantId: 'tenant_123',
      leadId: null,
      assigneeUserId: null,
      subject: 'WhatsApp +593999111222',
      channel: 'whatsapp',
      externalConversationId: '+593999111222',
      participantDisplayName: 'Maria Perez',
      participantHandle: '+593999111222',
      status: 'open',
      latestMessagePreview: 'Hola',
      messageCount: 1,
      openedAt: new Date('2026-05-18T15:00:00.000Z'),
      closedAt: null,
      lastActivityAt: new Date('2026-05-18T15:00:00.000Z'),
      createdAt: new Date('2026-05-18T15:00:00.000Z'),
      updatedAt: new Date('2026-05-18T15:00:00.000Z'),
    });
    conversationThreadRepository.findByTenantIdAndId.mockResolvedValue(thread);
    conversationMessageIdGenerator.generate.mockReturnValue('message_002');
    whatsappOutboundMessageGateway.send.mockResolvedValue({
      provider: 'meta_cloud_api',
      externalMessageId: 'wamid-meta-001',
      deliveryStatus: 'sent',
      failureReason: null,
      providerResponseJson: '{"messages":[{"id":"wamid-meta-001"}]}',
    });

    const useCase = new SendTenantWhatsappConversationMessageUseCase(
      tenantRepository,
      conversationThreadRepository,
      conversationMessageRepository,
      conversationMessageIdGenerator,
      whatsappMessageTemplateRepository,
      whatsappOutboundMessageGateway,
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      threadId: 'thread_001',
      body: 'Perfecto, te escribo en unos minutos.',
    });

    expect(whatsappOutboundMessageGateway.send).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      threadId: 'thread_001',
      recipientHandle: '+593999111222',
      body: 'Perfecto, te escribo en unos minutos.',
      template: null,
    });
    expect(result.provider).toBe('meta_cloud_api');
    expect(result.deliveryStatus).toBe('sent');
    expect(result.externalMessageId).toBe('wamid-meta-001');
    expect(conversationMessageRepository.save).toHaveBeenCalledTimes(1);
  });

  it('renders a WhatsApp template and stores template plus intent metadata', async () => {
    const thread = ConversationThread.create({
      id: 'thread_010',
      tenantId: 'tenant_123',
      leadId: null,
      assigneeUserId: null,
      subject: 'WhatsApp +593999111222',
      channel: 'whatsapp',
      externalConversationId: '+593999111222',
      participantDisplayName: 'Maria Perez',
      participantHandle: '+593999111222',
      status: 'open',
      latestMessagePreview: 'Hola',
      messageCount: 1,
      openedAt: new Date('2026-05-18T15:00:00.000Z'),
      closedAt: null,
      lastActivityAt: new Date('2026-05-18T15:00:00.000Z'),
      createdAt: new Date('2026-05-18T15:00:00.000Z'),
      updatedAt: new Date('2026-05-18T15:00:00.000Z'),
    });
    const template = WhatsappMessageTemplate.create({
      id: 'template_001',
      tenantId: 'tenant_123',
      key: 'follow_up_demo',
      name: 'Follow Up Demo',
      languageCode: 'es_EC',
      category: 'utility',
      bodyTemplate: 'Hola {{firstName}}, retomamos la demo de {{product}}.',
      intentKey: 'follow_up',
      providerTemplateName: 'follow_up_demo_meta',
      providerApprovalStatus: 'approved',
      status: 'active',
      createdAt: new Date('2026-05-18T15:01:00.000Z'),
      updatedAt: new Date('2026-05-18T15:01:00.000Z'),
    });
    conversationThreadRepository.findByTenantIdAndId.mockResolvedValue(thread);
    conversationMessageIdGenerator.generate.mockReturnValue('message_010');
    whatsappMessageTemplateRepository.findByTenantIdAndId.mockResolvedValue(
      template,
    );
    whatsappOutboundMessageGateway.send.mockResolvedValue({
      provider: 'meta_cloud_api_stub',
      externalMessageId: 'wamid-template-001',
      deliveryStatus: 'pending',
      failureReason: null,
      providerResponseJson: '{"mode":"stub"}',
    });

    const useCase = new SendTenantWhatsappConversationMessageUseCase(
      tenantRepository,
      conversationThreadRepository,
      conversationMessageRepository,
      conversationMessageIdGenerator,
      whatsappMessageTemplateRepository,
      whatsappOutboundMessageGateway,
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      threadId: 'thread_010',
      templateId: 'template_001',
      templateVariables: {
        firstName: 'Maria',
        product: 'facturacion',
      },
    });

    expect(whatsappOutboundMessageGateway.send).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      threadId: 'thread_010',
      recipientHandle: '+593999111222',
      body: 'Hola Maria, retomamos la demo de facturacion.',
      template: {
        providerTemplateName: 'follow_up_demo_meta',
        languageCode: 'es_EC',
        bodyParameterValues: ['Maria', 'facturacion'],
      },
    });
    expect(result.templateId).toBe('template_001');
    expect(result.outboundIntentKey).toBe('follow_up');
  });
});
