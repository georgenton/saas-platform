import {
  ConversationMessageRepository,
  ConversationThreadRepository,
  CreateTenantWhatsappAutomationRuleUseCase,
  GetTenantWhatsappAutomationSuggestionsUseCase,
  WhatsappAutomationRuleIdGenerator,
  WhatsappAutomationRuleRepository,
  WhatsappMessageTemplateRepository,
} from '@saas-platform/growth-application';
import {
  ConversationMessage,
  ConversationThread,
  WhatsappAutomationRule,
  WhatsappMessageTemplate,
} from '@saas-platform/growth-domain';
import { TenantRepository } from '@saas-platform/tenancy-application';

describe('Growth WhatsApp automation use cases', () => {
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
  const whatsappAutomationRuleIdGenerator: jest.Mocked<WhatsappAutomationRuleIdGenerator> =
    {
      generate: jest.fn(),
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
    whatsappAutomationRuleIdGenerator.generate.mockReturnValue('automation_001');
  });

  it('creates a whatsapp automation rule linked to a template', async () => {
    whatsappMessageTemplateRepository.findByTenantIdAndId.mockResolvedValue(
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
        createdAt: new Date('2026-05-19T09:00:00.000Z'),
        updatedAt: new Date('2026-05-19T09:00:00.000Z'),
      }),
    );

    const useCase = new CreateTenantWhatsappAutomationRuleUseCase(
      tenantRepository,
      whatsappAutomationRuleRepository,
      whatsappAutomationRuleIdGenerator,
      whatsappMessageTemplateRepository,
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      key: 'follow_up_unassigned',
      name: 'Follow Up Unassigned',
      triggerEvent: 'inbound_message',
      matchOutboundIntentKey: 'follow_up',
      matchAssigneeMode: 'unassigned',
      templateId: 'template_001',
      actionOutboundIntentKey: 'follow_up',
    });

    expect(result.id).toBe('automation_001');
    expect(result.templateId).toBe('template_001');
    expect(result.matchAssigneeMode).toBe('unassigned');
    expect(whatsappAutomationRuleRepository.save).toHaveBeenCalledTimes(1);
  });

  it('returns suggestions that match the latest thread state', async () => {
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
        latestMessagePreview: 'Hola',
        messageCount: 2,
        openedAt: new Date('2026-05-19T09:00:00.000Z'),
        closedAt: null,
        lastActivityAt: new Date('2026-05-19T09:10:00.000Z'),
        createdAt: new Date('2026-05-19T09:00:00.000Z'),
        updatedAt: new Date('2026-05-19T09:10:00.000Z'),
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
        actionType: 'suggest_template',
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

    const useCase = new GetTenantWhatsappAutomationSuggestionsUseCase(
      tenantRepository,
      conversationThreadRepository,
      conversationMessageRepository,
      whatsappAutomationRuleRepository,
      whatsappMessageTemplateRepository,
    );

    const result = await useCase.execute(
      'saas-platform',
      'thread_whatsapp_001',
    );

    expect(result.suggestions).toEqual([
      {
        ruleId: 'automation_001',
        ruleKey: 'follow_up_unassigned',
        ruleName: 'Follow Up Unassigned',
        triggerEvent: 'inbound_message',
        actionType: 'suggest_template',
        actionOutboundIntentKey: 'follow_up',
        templateId: 'template_001',
        templateKey: 'follow_up_demo',
        templateName: 'Follow Up Demo',
        providerTemplateName: 'follow_up_demo_meta',
        providerApprovalStatus: 'approved',
        bodyTemplatePreview: 'Hola {{firstName}}, retomamos la demo.',
      },
    ]);
  });
});
