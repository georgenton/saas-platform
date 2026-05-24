import { GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase } from '@saas-platform/ai-application';

describe('AI invoice suggestion envelope use case', () => {
  const getTenantInvoiceDocumentDraftingAssistUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    getTenantInvoiceDocumentDraftingAssistUseCase.execute.mockResolvedValue({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-23T11:00:00.000Z'),
      summary: {
        tone: 'warning',
        readinessStatus: 'needs_attention',
        headline: 'El tenant ya puede apoyarse en sugerencias.',
        detail: 'Conviene revisar detalles antes de empujar documentos.',
        suggestedFocus: 'Primero revisa firma y numeracion.',
      },
      checklist: [
        {
          key: 'issuer_profile',
          label: 'Perfil fiscal',
          status: 'ready',
          detail: 'Configurado para pruebas.',
        },
        {
          key: 'signature_material',
          label: 'Material de firma',
          status: 'warning',
          detail: 'Conviene validar el material antes de emitir.',
        },
      ],
      documentGuidance: [
        {
          documentCode: '01',
          label: 'Factura',
          status: 'ready',
          detail: 'Carril utilizable.',
          recommendedUse: 'Usalo para preparar facturas nuevas.',
        },
      ],
      reportSnapshot: {
        customerCount: 3,
        invoiceCount: 9,
        outstandingTotalInCents: 145000,
        dominantStatus: 'issued',
        busiestMonth: '2026-05',
      },
      draftingHints: [
        {
          key: 'drafting-brief',
          title: 'Brief de preparacion',
          objective: 'Explicar piezas previas.',
          whenToUse: 'Cuando el operador necesita una guia corta.',
          recommendedInputs: ['Checklist', 'Firma', 'Numeracion'],
          caution: 'No reemplaza validacion fiscal.',
        },
      ],
      safeActions: ['Explicar checklist'],
      blockedActions: ['Firmar electronicamente el documento sin aprobacion humana.'],
    });
  });

  it('builds a tenant-scoped suggestion envelope from the invoicing drafting surface', async () => {
    const useCase = new GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase(
      getTenantInvoiceDocumentDraftingAssistUseCase as any,
    );

    const result = await useCase.execute('saas-platform');

    expect(result.generatedAt).toEqual(new Date('2026-05-23T11:00:00.000Z'));
    expect(result.agent).toEqual(
      expect.objectContaining({
        key: 'invoice-document-assistant',
        availability: 'ready',
        defaultMode: 'suggestion',
      }),
    );
    expect(result.promptPack).toEqual(
      expect.objectContaining({
        key: 'invoice-document-assistant-core',
        version: 'v1',
        agentKey: 'invoice-document-assistant',
      }),
    );
    expect(result.surface).toEqual(
      expect.objectContaining({
        key: 'invoice_document_drafting',
        sourceContractKey: 'invoicing.assist.document_drafting',
      }),
    );
    expect(result.toolAccess).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          accessLevel: 'approval_required',
          tool: expect.objectContaining({
            key: 'invoice_document_drafting',
            availability: 'ready',
          }),
        }),
      ]),
    );
    expect(result.contextBlocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'drafting_summary',
          bullets: expect.arrayContaining([
            'Readiness status: needs_attention',
            'Invoice count: 9',
          ]),
        }),
        expect.objectContaining({
          key: 'formal_checklist',
          bullets: expect.arrayContaining([
            expect.stringContaining('Perfil fiscal: status=ready'),
          ]),
        }),
      ]),
    );
  });
});
