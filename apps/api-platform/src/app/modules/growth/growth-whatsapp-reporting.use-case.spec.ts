import { GetTenantWhatsappOutboundReportingSummaryUseCase } from '@saas-platform/growth-application';
import {
  ConversationDeliveryEvent,
  ConversationMessage,
  ConversationThread,
  WhatsappMessageTemplate,
} from '@saas-platform/growth-domain';
import { TenantRepository } from '@saas-platform/tenancy-application';

describe('Growth WhatsApp outbound reporting use case', () => {
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
  const conversationDeliveryEventRepository = {
    save: jest.fn(),
    findByTenantId: jest.fn(),
    findByTenantIdAndProviderAndEventKey: jest.fn(),
    findByTenantIdAndMessageId: jest.fn(),
  };
  const whatsappMessageTemplateRepository = {
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
  });

  it('aggregates outbound reporting by intent and template for whatsapp threads', async () => {
    conversationThreadRepository.findByTenantIdAndChannel.mockResolvedValue([
      ConversationThread.create({
        id: 'thread_whatsapp_001',
        tenantId: 'tenant_123',
        leadId: 'lead_001',
        assigneeUserId: 'user_456',
        subject: 'Maria Perez',
        channel: 'whatsapp',
        externalConversationId: 'wa_conv_001',
        participantDisplayName: 'Maria Perez',
        participantHandle: '+593999111222',
        status: 'open',
        latestMessagePreview: 'Perfecto',
        messageCount: 3,
        openedAt: new Date('2026-05-18T10:00:00.000Z'),
        closedAt: null,
        lastActivityAt: new Date('2026-05-18T10:05:00.000Z'),
        createdAt: new Date('2026-05-18T10:00:00.000Z'),
        updatedAt: new Date('2026-05-18T10:05:00.000Z'),
      }),
    ]);
    conversationMessageRepository.findByTenantId.mockResolvedValue([
      ConversationMessage.create({
        id: 'message_001',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Hola Maria, retomamos la demo.',
        templateId: 'template_001',
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'delivered',
        externalMessageId: 'wamid-001',
        failureReason: null,
        deliveredAt: new Date('2026-05-18T10:02:00.000Z'),
        readAt: null,
        createdAt: new Date('2026-05-18T10:01:00.000Z'),
      }),
      ConversationMessage.create({
        id: 'message_002',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Te escribo mas tarde.',
        templateId: null,
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'read',
        externalMessageId: 'wamid-002',
        failureReason: null,
        deliveredAt: new Date('2026-05-18T10:03:00.000Z'),
        readAt: new Date('2026-05-18T10:04:00.000Z'),
        createdAt: new Date('2026-05-18T10:03:00.000Z'),
      }),
      ConversationMessage.create({
        id: 'message_003',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Oferta especial de renovacion.',
        templateId: 'template_002',
        outboundIntentKey: 'renewal_offer',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'failed',
        externalMessageId: 'wamid-003',
        failureReason: 'recipient_unreachable',
        deliveredAt: null,
        readAt: null,
        createdAt: new Date('2026-05-18T10:05:00.000Z'),
      }),
      ConversationMessage.create({
        id: 'message_004',
        tenantId: 'tenant_123',
        threadId: 'thread_manual_001',
        direction: 'outbound',
        body: 'No debe contar por no ser whatsapp.',
        templateId: null,
        outboundIntentKey: 'ignored',
        provider: null,
        deliveryStatus: null,
        externalMessageId: null,
        failureReason: null,
        deliveredAt: null,
        readAt: null,
        createdAt: new Date('2026-05-18T10:06:00.000Z'),
      }),
    ]);
    conversationDeliveryEventRepository.findByTenantId.mockResolvedValue([
      ConversationDeliveryEvent.create({
        id: 'delivery_event_001',
        tenantId: 'tenant_123',
        messageId: 'message_001',
        provider: 'meta_cloud_api_stub',
        eventKey: 'outbound:wamid-001:pending',
        providerEventId: 'wamid-001',
        externalMessageId: 'wamid-001',
        deliveryStatus: 'pending',
        failureReason: null,
        providerStatusDetail: 'stub_accepted',
        providerConversationCategory: null,
        providerPricingCategory: null,
        providerErrorCode: null,
        payloadJson: '{"mode":"stub"}',
        occurredAt: new Date('2026-05-18T10:01:00.000Z'),
        createdAt: new Date('2026-05-18T10:01:00.000Z'),
      }),
      ConversationDeliveryEvent.create({
        id: 'delivery_event_002',
        tenantId: 'tenant_123',
        messageId: 'message_003',
        provider: 'meta_cloud_api_stub',
        eventKey: 'outbound:wamid-003:failed',
        providerEventId: 'wamid-003',
        externalMessageId: 'wamid-003',
        deliveryStatus: 'failed',
        failureReason: 'recipient_unreachable',
        providerStatusDetail: 'hard_bounce',
        providerConversationCategory: null,
        providerPricingCategory: null,
        providerErrorCode: '131026',
        payloadJson: '{"mode":"stub"}',
        occurredAt: new Date('2026-05-18T10:05:00.000Z'),
        createdAt: new Date('2026-05-18T10:05:00.000Z'),
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
        createdAt: new Date('2026-05-18T09:00:00.000Z'),
        updatedAt: new Date('2026-05-18T09:00:00.000Z'),
      }),
      WhatsappMessageTemplate.create({
        id: 'template_002',
        tenantId: 'tenant_123',
        key: 'renewal_offer_demo',
        name: 'Renewal Offer Demo',
        languageCode: 'es_EC',
        category: 'marketing',
        bodyTemplate: 'Renueva hoy con descuento.',
        intentKey: 'renewal_offer',
        providerTemplateName: 'renewal_offer_demo_meta',
        providerApprovalStatus: 'pending_review',
        status: 'active',
        createdAt: new Date('2026-05-18T09:10:00.000Z'),
        updatedAt: new Date('2026-05-18T09:10:00.000Z'),
      }),
    ]);

    const useCase = new GetTenantWhatsappOutboundReportingSummaryUseCase(
      tenantRepository,
      conversationThreadRepository as any,
      conversationMessageRepository as any,
      conversationDeliveryEventRepository as any,
      whatsappMessageTemplateRepository as any,
      () => new Date('2026-05-18T11:00:00.000Z'),
    );

    const result = await useCase.execute('saas-platform');

    expect(result.totals).toEqual({
      outboundMessageCount: 3,
      freeformMessageCount: 1,
      templateMessageCount: 2,
      approvedTemplateMessageCount: 1,
      pendingCount: 0,
      sentCount: 0,
      deliveredCount: 1,
      readCount: 1,
      failedCount: 1,
      immediateSendRejectionFailedCount: 1,
      asynchronousDeliveryFailedCount: 0,
      retryableFailedCount: 0,
      permanentFailedCount: 1,
    });
    expect(result.byIntent).toEqual([
      {
        outboundIntentKey: 'follow_up',
        messageCount: 2,
        pendingCount: 0,
        sentCount: 0,
        deliveredCount: 1,
        readCount: 1,
        failedCount: 0,
      },
      {
        outboundIntentKey: 'renewal_offer',
        messageCount: 1,
        pendingCount: 0,
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        failedCount: 1,
      },
    ]);
    expect(result.byTemplate).toEqual([
      {
        templateId: 'template_001',
        templateKey: 'follow_up_demo',
        templateName: 'Follow Up Demo',
        providerTemplateName: 'follow_up_demo_meta',
        providerApprovalStatus: 'approved',
        messageCount: 1,
        pendingCount: 0,
        sentCount: 0,
        deliveredCount: 1,
        readCount: 0,
        failedCount: 0,
      },
      {
        templateId: 'template_002',
        templateKey: 'renewal_offer_demo',
        templateName: 'Renewal Offer Demo',
        providerTemplateName: 'renewal_offer_demo_meta',
        providerApprovalStatus: 'pending_review',
        messageCount: 1,
        pendingCount: 0,
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        failedCount: 1,
      },
    ]);
    expect(result.byProvider).toEqual([
      {
        provider: 'meta_cloud_api_stub',
        messageCount: 3,
        pendingCount: 0,
        sentCount: 0,
        deliveredCount: 1,
        readCount: 1,
        failedCount: 1,
      },
    ]);
    expect(result.byFailureClass).toEqual([
      {
        provider: 'meta_cloud_api_stub',
        failureClass: 'recipient_issue',
        failurePhase: 'immediate_send_rejection',
        messageCount: 1,
        retryableCount: 0,
        permanentCount: 1,
      },
    ]);
    expect(result.byProviderTaxonomy).toEqual([
      {
        provider: 'meta_cloud_api_stub',
        providerTaxonomyFamily: 'recipient_reachability',
        providerTaxonomyDetail: 'meta_recipient_unreachable',
        failureClass: 'recipient_issue',
        failurePhase: 'immediate_send_rejection',
        messageCount: 1,
        retryableCount: 0,
        permanentCount: 1,
      },
    ]);
    expect(result.topProviderErrorCodes).toEqual([
      {
        provider: 'meta_cloud_api_stub',
        providerErrorCode: '131026',
        failureClass: 'recipient_issue',
        failurePhase: 'immediate_send_rejection',
        retryDisposition: 'permanent',
        providerTaxonomyFamily: 'recipient_reachability',
        providerTaxonomyDetail: 'meta_recipient_unreachable',
        occurrenceCount: 1,
        latestFailureReason: 'recipient_unreachable',
        latestProviderStatusDetail: 'hard_bounce',
      },
    ]);
    expect(result.retryOperations).toEqual({
      totalFailedMessageCount: 1,
      retryableFailedMessageCount: 0,
      permanentFailedMessageCount: 1,
      cooldownBlockedCount: 0,
      readyNowCount: 0,
      defaultBaseBackoffMinutes: 5,
      maxBackoffMinutes: 180,
    });
    expect(result.operationalThresholds).toEqual({
      immediateSendRejectionRateWarning: 0.05,
      asynchronousDeliveryFailureRateWarning: 0.03,
      readyRetryQueueWarningCount: 1,
      cooldownRetryQueueWarningCount: 3,
      authOrConfigurationCriticalCount: 1,
      policyBlockCriticalCount: 1,
      rateLimitedWarningCount: 1,
      unknownFailureWarningCount: 1,
    });
    expect(result.operationalDashboard).toEqual({
      overallStatus: 'warning',
      immediateSendRejectionRate: 0.3333,
      asynchronousDeliveryFailureRate: 0,
      readyRetryQueueCount: 0,
      cooldownRetryQueueCount: 0,
      permanentFailureCount: 1,
      leadingFailureClass: 'recipient_issue',
      leadingProvider: 'meta_cloud_api_stub',
      leadingProviderTaxonomyFamily: 'recipient_reachability',
      leadingProviderTaxonomyDetail: 'meta_recipient_unreachable',
    });
    expect(result.operationalAlerts).toEqual([
      {
        key: 'immediate_send_rejection_rate',
        severity: 'warning',
        title: 'Immediate send rejection rate is elevated',
        summary:
          'Immediate outbound rejections reached 33.33% of outbound traffic.',
        thresholdKey: 'immediateSendRejectionRateWarning',
        observedValue: 0.3333,
        thresholdValue: 0.05,
        thresholdUnit: 'rate',
        provider: 'meta_cloud_api_stub',
        failureClass: 'recipient_issue',
        providerTaxonomyFamily: 'recipient_reachability',
        providerTaxonomyDetail: 'meta_recipient_unreachable',
        affectedMessageCount: 1,
        recommendedAction:
          'Inspect provider-facing failures before throughput or template automation keeps amplifying the rejection rate.',
      },
    ]);
  });
});
