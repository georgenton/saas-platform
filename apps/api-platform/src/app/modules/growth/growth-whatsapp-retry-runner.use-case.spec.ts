import {
  ConversationDeliveryEventRepository,
  ConversationMessageRepository,
  RetryTenantWhatsappFailedConversationMessageUseCase,
  RunTenantWhatsappReadyRetriesUseCase,
} from '@saas-platform/growth-application';
import {
  ConversationDeliveryEvent,
  ConversationMessage,
} from '@saas-platform/growth-domain';
import { TenantRepository } from '@saas-platform/tenancy-application';

describe('Growth WhatsApp retry runner use case', () => {
  const tenantRepository: jest.Mocked<TenantRepository> = {
    findBySlug: jest.fn(),
  } as unknown as jest.Mocked<TenantRepository>;
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
  const retryTenantWhatsappFailedConversationMessageUseCase: jest.Mocked<RetryTenantWhatsappFailedConversationMessageUseCase> =
    {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RetryTenantWhatsappFailedConversationMessageUseCase>;

  beforeEach(() => {
    jest.resetAllMocks();
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      slug: 'saas-platform',
    } as any);
    conversationMessageRepository.findByTenantId.mockResolvedValue([
      ConversationMessage.create({
        id: 'message_ready_001',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Primer intento',
        templateId: null,
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'failed',
        externalMessageId: 'wamid-ready-001',
        failureReason: 'temporary_provider_timeout',
        deliveredAt: null,
        readAt: null,
        createdAt: new Date('2026-05-19T09:00:00.000Z'),
      }),
      ConversationMessage.create({
        id: 'message_cooldown_001',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_002',
        direction: 'outbound',
        body: 'Segundo intento',
        templateId: null,
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'failed',
        externalMessageId: 'wamid-cooldown-001',
        failureReason: 'temporary_provider_timeout',
        deliveredAt: null,
        readAt: null,
        createdAt: new Date('2026-05-19T09:11:00.000Z'),
      }),
      ConversationMessage.create({
        id: 'message_superseded_root',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_003',
        direction: 'outbound',
        body: 'Raiz antigua',
        templateId: null,
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'failed',
        externalMessageId: 'wamid-superseded-root',
        failureReason: 'temporary_provider_timeout',
        deliveredAt: null,
        readAt: null,
        createdAt: new Date('2026-05-19T08:30:00.000Z'),
      }),
      ConversationMessage.create({
        id: 'message_superseded_child',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_003',
        direction: 'outbound',
        body: 'Hijo ya creado',
        templateId: null,
        retryOfMessageId: 'message_superseded_root',
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'pending',
        externalMessageId: 'wamid-superseded-child',
        failureReason: null,
        deliveredAt: null,
        readAt: null,
        createdAt: new Date('2026-05-19T08:40:00.000Z'),
      }),
    ]);
    conversationDeliveryEventRepository.findByTenantId.mockResolvedValue([
      ConversationDeliveryEvent.create({
        id: 'event_ready_001',
        tenantId: 'tenant_123',
        messageId: 'message_ready_001',
        provider: 'meta_cloud_api_stub',
        eventKey: 'wamid-ready-001:failed:1',
        providerEventId: 'status:wamid-ready-001:1',
        externalMessageId: 'wamid-ready-001',
        deliveryStatus: 'failed',
        failureReason: 'temporary_provider_timeout',
        providerStatusDetail: 'transient_error',
        providerConversationCategory: null,
        providerPricingCategory: null,
        providerErrorCode: '131000',
        payloadJson: '{}',
        occurredAt: new Date('2026-05-19T09:00:00.000Z'),
        createdAt: new Date('2026-05-19T09:00:00.000Z'),
      }),
      ConversationDeliveryEvent.create({
        id: 'event_cooldown_001',
        tenantId: 'tenant_123',
        messageId: 'message_cooldown_001',
        provider: 'meta_cloud_api_stub',
        eventKey: 'wamid-cooldown-001:failed:1',
        providerEventId: 'status:wamid-cooldown-001:1',
        externalMessageId: 'wamid-cooldown-001',
        deliveryStatus: 'failed',
        failureReason: 'temporary_provider_timeout',
        providerStatusDetail: 'transient_error',
        providerConversationCategory: null,
        providerPricingCategory: null,
        providerErrorCode: '131000',
        payloadJson: '{}',
        occurredAt: new Date('2026-05-19T09:11:00.000Z'),
        createdAt: new Date('2026-05-19T09:11:00.000Z'),
      }),
      ConversationDeliveryEvent.create({
        id: 'event_superseded_root',
        tenantId: 'tenant_123',
        messageId: 'message_superseded_root',
        provider: 'meta_cloud_api_stub',
        eventKey: 'wamid-superseded-root:failed:1',
        providerEventId: 'status:wamid-superseded-root:1',
        externalMessageId: 'wamid-superseded-root',
        deliveryStatus: 'failed',
        failureReason: 'temporary_provider_timeout',
        providerStatusDetail: 'transient_error',
        providerConversationCategory: null,
        providerPricingCategory: null,
        providerErrorCode: '131000',
        payloadJson: '{}',
        occurredAt: new Date('2026-05-19T08:30:00.000Z'),
        createdAt: new Date('2026-05-19T08:30:00.000Z'),
      }),
    ]);
    retryTenantWhatsappFailedConversationMessageUseCase.execute.mockResolvedValue(
      ConversationMessage.create({
        id: 'message_retry_002',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Primer intento',
        templateId: null,
        retryOfMessageId: 'message_ready_001',
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'pending',
        externalMessageId: 'wamid-retry-002',
        failureReason: null,
        deliveredAt: null,
        readAt: null,
        createdAt: new Date('2026-05-19T09:15:00.000Z'),
      }),
    );
  });

  it('retries only ready leaf failures and summarizes skipped ones', async () => {
    const useCase = new RunTenantWhatsappReadyRetriesUseCase(
      tenantRepository,
      conversationMessageRepository,
      conversationDeliveryEventRepository,
      retryTenantWhatsappFailedConversationMessageUseCase,
      () => new Date('2026-05-19T09:15:00.000Z'),
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      limit: 10,
      occurredAt: new Date('2026-05-19T09:15:00.000Z'),
    });

    expect(retryTenantWhatsappFailedConversationMessageUseCase.execute).toHaveBeenCalledTimes(
      1,
    );
    expect(retryTenantWhatsappFailedConversationMessageUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      threadId: 'thread_whatsapp_001',
      messageId: 'message_ready_001',
      occurredAt: new Date('2026-05-19T09:15:00.000Z'),
    });
    expect(result).toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-19T09:15:00.000Z'),
      limitApplied: 10,
      candidateFailedMessageCount: 3,
      leafFailedMessageCount: 2,
      supersededFailedMessageCount: 1,
      readyNowCount: 1,
      retriedCount: 1,
      skippedCooldownCount: 1,
      skippedPermanentCount: 0,
      executions: [
        {
          sourceMessageId: 'message_ready_001',
          sourceExternalMessageId: 'wamid-ready-001',
          disposition: 'retryable',
          status: 'retried',
          failedAttemptCount: 1,
          backoffMinutes: 5,
          nextRetryAt: new Date('2026-05-19T09:05:00.000Z'),
          retryMessageId: 'message_retry_002',
          retryExternalMessageId: 'wamid-retry-002',
        },
        {
          sourceMessageId: 'message_cooldown_001',
          sourceExternalMessageId: 'wamid-cooldown-001',
          disposition: 'retryable',
          status: 'skipped_cooldown',
          failedAttemptCount: 1,
          backoffMinutes: 5,
          nextRetryAt: new Date('2026-05-19T09:16:00.000Z'),
          retryMessageId: null,
          retryExternalMessageId: null,
        },
      ],
    });
  });
});
