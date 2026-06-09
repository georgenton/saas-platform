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
  const medicalHandler = {
    execute: jest.fn(),
  };
  const psychologyHandler = {
    execute: jest.fn(),
  };
  const taxAccountingBoundaryHandler = {
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
      medicalHandler as any,
      psychologyHandler as any,
      taxAccountingBoundaryHandler as any,
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
      medicalHandler as any,
      psychologyHandler as any,
      taxAccountingBoundaryHandler as any,
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
      medicalHandler as any,
      psychologyHandler as any,
      taxAccountingBoundaryHandler as any,
    );

    await useCase.execute('saas-platform', 'ecommerce-launch-assistant');

    expect(ecommerceHandler.execute).toHaveBeenCalledWith(
      'saas-platform',
      'ecommerce-launch-assistant',
    );
    expect(growthHandler.execute).not.toHaveBeenCalled();
    expect(invoiceHandler.execute).not.toHaveBeenCalled();
  });

  it('routes medical clinic envelopes through the medical clinic handler', async () => {
    medicalHandler.execute.mockResolvedValue({
      tenantSlug: 'saas-platform',
      mode: 'suggestion',
      generatedAt: new Date('2026-06-08T10:00:00.000Z'),
      agent: {
        key: 'medical-clinic-assistant',
      },
    });

    const useCase = new GetTenantAiSuggestionEnvelopeUseCase(
      growthHandler as any,
      invoiceHandler as any,
      ecommerceHandler as any,
      medicalHandler as any,
      psychologyHandler as any,
      taxAccountingBoundaryHandler as any,
    );

    await useCase.execute('saas-platform', 'medical-clinic-assistant');

    expect(medicalHandler.execute).toHaveBeenCalledWith(
      'saas-platform',
      'medical-clinic-assistant',
    );
    expect(growthHandler.execute).not.toHaveBeenCalled();
    expect(invoiceHandler.execute).not.toHaveBeenCalled();
    expect(ecommerceHandler.execute).not.toHaveBeenCalled();
    expect(psychologyHandler.execute).not.toHaveBeenCalled();
  });

  it('routes psychology clinic envelopes through the psychology clinic handler', async () => {
    psychologyHandler.execute.mockResolvedValue({
      tenantSlug: 'saas-platform',
      mode: 'suggestion',
      generatedAt: new Date('2026-06-08T10:00:00.000Z'),
      agent: {
        key: 'psychology-clinic-assistant',
      },
    });

    const useCase = new GetTenantAiSuggestionEnvelopeUseCase(
      growthHandler as any,
      invoiceHandler as any,
      ecommerceHandler as any,
      medicalHandler as any,
      psychologyHandler as any,
      taxAccountingBoundaryHandler as any,
    );

    await useCase.execute('saas-platform', 'psychology-clinic-assistant');

    expect(psychologyHandler.execute).toHaveBeenCalledWith(
      'saas-platform',
      'psychology-clinic-assistant',
    );
    expect(growthHandler.execute).not.toHaveBeenCalled();
    expect(invoiceHandler.execute).not.toHaveBeenCalled();
    expect(ecommerceHandler.execute).not.toHaveBeenCalled();
    expect(medicalHandler.execute).not.toHaveBeenCalled();
  });

  it('routes tax accounting boundary envelopes through the tax accounting boundary handler', async () => {
    taxAccountingBoundaryHandler.execute.mockResolvedValue({
      tenantSlug: 'saas-platform',
      mode: 'suggestion',
      generatedAt: new Date('2026-06-08T10:00:00.000Z'),
      agent: {
        key: 'tax-accounting-boundary-assistant',
      },
    });

    const useCase = new GetTenantAiSuggestionEnvelopeUseCase(
      growthHandler as any,
      invoiceHandler as any,
      ecommerceHandler as any,
      medicalHandler as any,
      psychologyHandler as any,
      taxAccountingBoundaryHandler as any,
    );

    await useCase.execute('saas-platform', 'tax-accounting-boundary-assistant');

    expect(taxAccountingBoundaryHandler.execute).toHaveBeenCalledWith(
      'saas-platform',
      'tax-accounting-boundary-assistant',
    );
    expect(growthHandler.execute).not.toHaveBeenCalled();
    expect(invoiceHandler.execute).not.toHaveBeenCalled();
    expect(ecommerceHandler.execute).not.toHaveBeenCalled();
    expect(medicalHandler.execute).not.toHaveBeenCalled();
    expect(psychologyHandler.execute).not.toHaveBeenCalled();
  });

  it('rejects unknown agents before routing', async () => {
    const useCase = new GetTenantAiSuggestionEnvelopeUseCase(
      growthHandler as any,
      invoiceHandler as any,
      ecommerceHandler as any,
      medicalHandler as any,
      psychologyHandler as any,
      taxAccountingBoundaryHandler as any,
    );

    await expect(
      useCase.execute('saas-platform', 'unknown-agent'),
    ).rejects.toBeInstanceOf(AiAgentNotFoundError);

    expect(growthHandler.execute).not.toHaveBeenCalled();
    expect(invoiceHandler.execute).not.toHaveBeenCalled();
    expect(ecommerceHandler.execute).not.toHaveBeenCalled();
  });
});
