import {
  ConversationMessageRepository,
  ConversationThreadRepository,
  ExecuteTenantWhatsappAutomationActionsUseCase,
  LeadRepository,
  SendTenantWhatsappConversationMessageUseCase,
  WhatsappAutomationExecutionIdGenerator,
  WhatsappAutomationExecutionRepository,
  WhatsappAutomationRuleRepository,
  WhatsappMessageTemplateRepository,
} from '@saas-platform/growth-application';
import {
  ConversationMessage,
  ConversationThread,
  Lead,
  WhatsappAutomationExecution,
  WhatsappAutomationRule,
  WhatsappMessageTemplate,
} from '@saas-platform/growth-domain';
import { TenantRepository } from '@saas-platform/tenancy-application';

describe('Growth WhatsApp automation execution use case', () => {
  const tenantRepository: jest.Mocked<TenantRepository> = {
    findBySlug: jest.fn(),
  } as unknown as jest.Mocked<TenantRepository>;
  const leadRepository: jest.Mocked<LeadRepository> = {
    save: jest.fn(),
    findByTenantId: jest.fn(),
    findByTenantIdAndId: jest.fn(),
  };
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
  const whatsappAutomationRuleRepository: jest.Mocked<WhatsappAutomationRuleRepository> =
    {
      save: jest.fn(),
      findByTenantId: jest.fn(),
      findByTenantIdAndId: jest.fn(),
      findByTenantIdAndKey: jest.fn(),
    };
  const whatsappMessageTemplateRepository: jest.Mocked<WhatsappMessageTemplateRepository> =
    {
      save: jest.fn(),
      findByTenantId: jest.fn(),
      findByTenantIdAndId: jest.fn(),
      findByTenantIdAndKey: jest.fn(),
    };
  const whatsappAutomationExecutionRepository: jest.Mocked<WhatsappAutomationExecutionRepository> =
    {
      save: jest.fn(),
      findByTenantIdAndExecutionKey: jest.fn(),
    };
  const whatsappAutomationExecutionIdGenerator: jest.Mocked<WhatsappAutomationExecutionIdGenerator> =
    {
      generate: jest.fn(),
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
        latestMessagePreview: 'Quedo atenta',
        messageCount: 2,
        openedAt: new Date('2026-05-19T09:00:00.000Z'),
        closedAt: null,
        lastActivityAt: new Date('2026-05-19T09:10:00.000Z'),
        createdAt: new Date('2026-05-19T09:00:00.000Z'),
        updatedAt: new Date('2026-05-19T09:10:00.000Z'),
      }),
    );
    leadRepository.findByTenantIdAndId.mockResolvedValue(
      Lead.create({
        id: 'lead_001',
        tenantId: 'tenant_123',
        fullName: 'Maria Perez',
        email: 'maria@example.com',
        phoneE164: '+593999111222',
        whatsappE164: '+593999111222',
        source: 'whatsapp',
        status: 'captured',
        notes: null,
        createdAt: new Date('2026-05-19T08:00:00.000Z'),
        updatedAt: new Date('2026-05-19T08:00:00.000Z'),
      }),
    );
    conversationMessageRepository.findByTenantIdAndThreadId.mockResolvedValue([
      ConversationMessage.create({
        id: 'message_001',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Hola Maria',
        templateId: 'template_001',
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'delivered',
        externalMessageId: 'wamid-001',
        failureReason: null,
        deliveredAt: new Date('2026-05-19T09:05:00.000Z'),
        readAt: null,
        createdAt: new Date('2026-05-19T09:05:00.000Z'),
      }),
      ConversationMessage.create({
        id: 'message_002',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'inbound',
        body: 'Quedo atenta',
        templateId: null,
        outboundIntentKey: null,
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'delivered',
        externalMessageId: 'wamid-002',
        failureReason: null,
        deliveredAt: new Date('2026-05-19T09:10:00.000Z'),
        readAt: null,
        createdAt: new Date('2026-05-19T09:10:00.000Z'),
      }),
    ]);
    whatsappAutomationRuleRepository.findByTenantId.mockResolvedValue([
      WhatsappAutomationRule.create({
        id: 'automation_001',
        tenantId: 'tenant_123',
        key: 'follow_up_unassigned',
        name: 'Follow Up Unassigned',
        triggerEvent: 'inbound_message',
        matchOutboundIntentKey: 'follow_up',
        matchDeliveryStatus: null,
        matchAssigneeMode: 'unassigned',
        templateId: 'template_001',
        actionType: 'send_template',
        actionOutboundIntentKey: 'follow_up',
        status: 'active',
        createdAt: new Date('2026-05-19T08:00:00.000Z'),
        updatedAt: new Date('2026-05-19T08:00:00.000Z'),
      }),
    ]);
    whatsappMessageTemplateRepository.findByTenantId.mockResolvedValue([
      WhatsappMessageTemplate.create({
        id: 'template_001',
        tenantId: 'tenant_123',
        key: 'follow_up_demo',
        name: 'Follow Up Demo',
        languageCode: 'es_EC',
        category: 'utility',
        bodyTemplate: 'Hola {{firstName}}, retomamos la demo.',
        intentKey: 'follow_up',
        providerTemplateName: 'follow_up_demo_meta',
        providerApprovalStatus: 'approved',
        status: 'active',
        createdAt: new Date('2026-05-19T08:00:00.000Z'),
        updatedAt: new Date('2026-05-19T08:00:00.000Z'),
      }),
    ]);
    whatsappAutomationExecutionIdGenerator.generate.mockReturnValue(
      'automation-execution-001',
    );
    whatsappAutomationExecutionRepository.findByTenantIdAndExecutionKey.mockResolvedValue(
      null,
    );
    sendTenantWhatsappConversationMessageUseCase.execute.mockResolvedValue(
      ConversationMessage.create({
        id: 'message_003',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Hola Maria, retomamos la demo.',
        templateId: 'template_001',
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'pending',
        externalMessageId: 'wamid-003',
        failureReason: null,
        deliveredAt: null,
        readAt: null,
        createdAt: new Date('2026-05-19T09:10:30.000Z'),
      }),
    );
  });

  it('executes a send_template rule from an inbound event and persists the execution', async () => {
    const useCase = new ExecuteTenantWhatsappAutomationActionsUseCase(
      tenantRepository,
      leadRepository,
      conversationThreadRepository,
      conversationMessageRepository,
      whatsappAutomationRuleRepository,
      whatsappMessageTemplateRepository,
      whatsappAutomationExecutionRepository,
      whatsappAutomationExecutionIdGenerator,
      sendTenantWhatsappConversationMessageUseCase,
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      threadId: 'thread_whatsapp_001',
      triggerEvent: 'inbound_message',
      triggerMessageId: 'message_002',
      triggerExternalMessageId: 'wamid-002',
      executionKey: 'wamid-002',
      occurredAt: new Date('2026-05-19T09:10:00.000Z'),
    });

    expect(sendTenantWhatsappConversationMessageUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      threadId: 'thread_whatsapp_001',
      templateId: 'template_001',
      templateVariables: expect.objectContaining({
        firstName: 'Maria',
        fullName: 'Maria Perez',
        participantHandle: '+593999111222',
      }),
      outboundIntentKey: 'follow_up',
      occurredAt: new Date('2026-05-19T09:10:00.000Z'),
    });
    expect(whatsappAutomationExecutionRepository.save).toHaveBeenCalledWith(
      expect.any(WhatsappAutomationExecution),
    );
    expect(result.executions).toEqual([
      {
        ruleId: 'automation_001',
        executionKey: 'wamid-002:automation_001',
        status: 'sent',
        outputMessageId: 'message_003',
        reason: null,
      },
    ]);
  });

  it('skips automatic sending when the template is not provider-approved', async () => {
    whatsappMessageTemplateRepository.findByTenantId.mockResolvedValue([
      WhatsappMessageTemplate.create({
        id: 'template_001',
        tenantId: 'tenant_123',
        key: 'follow_up_demo',
        name: 'Follow Up Demo',
        languageCode: 'es_EC',
        category: 'utility',
        bodyTemplate: 'Hola {{firstName}}, retomamos la demo.',
        intentKey: 'follow_up',
        providerTemplateName: null,
        providerApprovalStatus: 'pending_review',
        status: 'active',
        createdAt: new Date('2026-05-19T08:00:00.000Z'),
        updatedAt: new Date('2026-05-19T08:00:00.000Z'),
      }),
    ]);

    const useCase = new ExecuteTenantWhatsappAutomationActionsUseCase(
      tenantRepository,
      leadRepository,
      conversationThreadRepository,
      conversationMessageRepository,
      whatsappAutomationRuleRepository,
      whatsappMessageTemplateRepository,
      whatsappAutomationExecutionRepository,
      whatsappAutomationExecutionIdGenerator,
      sendTenantWhatsappConversationMessageUseCase,
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      threadId: 'thread_whatsapp_001',
      triggerEvent: 'inbound_message',
      triggerMessageId: 'message_002',
      triggerExternalMessageId: 'wamid-002',
      executionKey: 'wamid-002',
      occurredAt: new Date('2026-05-19T09:10:00.000Z'),
    });

    expect(sendTenantWhatsappConversationMessageUseCase.execute).not.toHaveBeenCalled();
    expect(result.executions).toEqual([
      {
        ruleId: 'automation_001',
        executionKey: 'wamid-002:automation_001',
        status: 'skipped',
        outputMessageId: null,
        reason:
          'The automation template is not provider-approved for automatic sends.',
      },
    ]);
  });
});
