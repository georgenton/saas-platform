import {
  AiAgentNotFoundError,
  GetTenantAiSuggestionEnvelopeUseCase,
} from '@saas-platform/ai-application';

describe('AI suggestion envelope router use case', () => {
  const growthHandler = {
    execute: jest.fn(),
  };
  const invoiceHandler = {
    execute: jest.fn(),
  };
  const ecommerceHandler = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('routes growth envelopes through the growth handler', async () => {
    growthHandler.execute.mockResolvedValue({
      tenantSlug: 'saas-platform',
      mode: 'suggestion',
      generatedAt: new Date('2026-05-26T10:00:00.000Z'),
      agent: {
        key: 'growth-assist-coach',
      },
    });

    const useCase = new GetTenantAiSuggestionEnvelopeUseCase(
      growthHandler as any,
      invoiceHandler as any,
      ecommerceHandler as any,
    );

    const result = await useCase.execute('saas-platform', 'growth-assist-coach');

    expect(growthHandler.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
    );
    expect(invoiceHandler.execute).not.toHaveBeenCalled();
    expect(ecommerceHandler.execute).not.toHaveBeenCalled();
    expect(result).toEqual(
      expect.objectContaining({
        agent: expect.objectContaining({ key: 'growth-assist-coach' }),
      }),
    );
  });

  it('routes invoice envelopes through the invoice handler', async () => {
    invoiceHandler.execute.mockResolvedValue({
      tenantSlug: 'saas-platform',
      mode: 'suggestion',
      generatedAt: new Date('2026-05-26T10:00:00.000Z'),
      agent: {
        key: 'invoice-document-assistant',
      },
    });

    const useCase = new GetTenantAiSuggestionEnvelopeUseCase(
      growthHandler as any,
      invoiceHandler as any,
      ecommerceHandler as any,
    );

    await useCase.execute('saas-platform', 'invoice-document-assistant');

    expect(invoiceHandler.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
    );
    expect(growthHandler.execute).not.toHaveBeenCalled();
    expect(ecommerceHandler.execute).not.toHaveBeenCalled();
  });

  it('routes ecommerce envelopes through the ecommerce handler', async () => {
    ecommerceHandler.execute.mockResolvedValue({
      tenantSlug: 'saas-platform',
      mode: 'suggestion',
      generatedAt: new Date('2026-05-26T10:00:00.000Z'),
      agent: {
        key: 'ecommerce-launch-assistant',
      },
    });

    const useCase = new GetTenantAiSuggestionEnvelopeUseCase(
      growthHandler as any,
      invoiceHandler as any,
      ecommerceHandler as any,
    );

    await useCase.execute('saas-platform', 'ecommerce-launch-assistant');

    expect(ecommerceHandler.execute).toHaveBeenCalledWith(
      'saas-platform',
      'ecommerce-launch-assistant',
    );
    expect(growthHandler.execute).not.toHaveBeenCalled();
    expect(invoiceHandler.execute).not.toHaveBeenCalled();
  });

  it('rejects unknown agents before routing', async () => {
    const useCase = new GetTenantAiSuggestionEnvelopeUseCase(
      growthHandler as any,
      invoiceHandler as any,
      ecommerceHandler as any,
    );

    await expect(
      useCase.execute('saas-platform', 'unknown-agent'),
    ).rejects.toBeInstanceOf(AiAgentNotFoundError);

    expect(growthHandler.execute).not.toHaveBeenCalled();
    expect(invoiceHandler.execute).not.toHaveBeenCalled();
    expect(ecommerceHandler.execute).not.toHaveBeenCalled();
  });
});
