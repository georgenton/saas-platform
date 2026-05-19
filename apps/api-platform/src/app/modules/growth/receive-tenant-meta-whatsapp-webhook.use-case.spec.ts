import {
  ProcessTenantMetaWhatsappWebhookUseCase,
  ReceiveTenantMetaWhatsappWebhookUseCase,
  WebhookEventEnvelopeIdGenerator,
  WebhookEventEnvelopeRepository,
} from '@saas-platform/growth-application';
import { TenantRepository } from '@saas-platform/tenancy-application';

describe('ReceiveTenantMetaWhatsappWebhookUseCase', () => {
  const tenantRepository: jest.Mocked<TenantRepository> = {
    findBySlug: jest.fn(),
  } as unknown as jest.Mocked<TenantRepository>;
  const webhookEventEnvelopeRepository: jest.Mocked<WebhookEventEnvelopeRepository> =
    {
      save: jest.fn(),
      findByTenantId: jest.fn(),
      findByTenantIdAndId: jest.fn(),
      findByTenantIdAndProviderAndEventKey: jest.fn(),
    };
  const webhookEventEnvelopeIdGenerator: jest.Mocked<WebhookEventEnvelopeIdGenerator> =
    {
      generate: jest.fn(),
    };
  const processTenantMetaWhatsappWebhookUseCase: jest.Mocked<ProcessTenantMetaWhatsappWebhookUseCase> =
    {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ProcessTenantMetaWhatsappWebhookUseCase>;

  beforeEach(() => {
    jest.resetAllMocks();
    tenantRepository.findBySlug.mockResolvedValue({
      id: 'tenant_123',
      slug: 'saas-platform',
    } as any);
    webhookEventEnvelopeIdGenerator.generate.mockReturnValue(
      'webhook-envelope-001',
    );
    processTenantMetaWhatsappWebhookUseCase.execute.mockResolvedValue({
      processedInboundMessages: 1,
      processedDeliveryEvents: 1,
    });
  });

  it('returns a duplicate result without reprocessing when the envelope key already exists', async () => {
    webhookEventEnvelopeRepository.findByTenantIdAndProviderAndEventKey.mockResolvedValue(
      {
        id: 'webhook-envelope-001',
        eventKey: 'event-key-001',
        status: 'processed',
        processedInboundMessages: 1,
        processedDeliveryEvents: 1,
      } as any,
    );

    const useCase = new ReceiveTenantMetaWhatsappWebhookUseCase(
      tenantRepository,
      webhookEventEnvelopeRepository,
      webhookEventEnvelopeIdGenerator,
      processTenantMetaWhatsappWebhookUseCase,
    );

    await expect(
      useCase.execute({
        tenantSlug: 'saas-platform',
        payload: {
          object: 'whatsapp_business_account',
          entry: [],
        },
        rawPayloadJson: '{"object":"whatsapp_business_account","entry":[]}',
        signatureHeader: 'sha256=test-signature',
      }),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      envelopeId: 'webhook-envelope-001',
      eventKey: 'event-key-001',
      duplicate: true,
      envelopeStatus: 'processed',
      processedInboundMessages: 1,
      processedDeliveryEvents: 1,
    });

    expect(processTenantMetaWhatsappWebhookUseCase.execute).not.toHaveBeenCalled();
    expect(webhookEventEnvelopeRepository.save).not.toHaveBeenCalled();
  });

  it('persists the envelope and marks it processed on first successful ingest', async () => {
    webhookEventEnvelopeRepository.findByTenantIdAndProviderAndEventKey.mockResolvedValue(
      null,
    );

    const useCase = new ReceiveTenantMetaWhatsappWebhookUseCase(
      tenantRepository,
      webhookEventEnvelopeRepository,
      webhookEventEnvelopeIdGenerator,
      processTenantMetaWhatsappWebhookUseCase,
    );

    const result = await useCase.execute({
      tenantSlug: 'saas-platform',
      payload: {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: 'waba-001',
            changes: [
              {
                value: {
                  metadata: {
                    phone_number_id: '1234567890',
                  },
                  messages: [
                    {
                      id: 'wamid-001',
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
      rawPayloadJson:
        '{"object":"whatsapp_business_account","entry":[{"id":"waba-001","changes":[{"value":{"metadata":{"phone_number_id":"1234567890"},"messages":[{"id":"wamid-001"}]}}]}]}',
      signatureHeader: 'sha256=test-signature',
    });

    expect(result.duplicate).toBe(false);
    expect(result.envelopeStatus).toBe('processed');
    expect(processTenantMetaWhatsappWebhookUseCase.execute).toHaveBeenCalled();
    expect(webhookEventEnvelopeRepository.save).toHaveBeenCalledTimes(2);
  });
});
