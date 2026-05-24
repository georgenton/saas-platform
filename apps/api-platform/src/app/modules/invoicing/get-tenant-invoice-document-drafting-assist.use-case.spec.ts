import { GetTenantInvoiceDocumentDraftingAssistUseCase } from '@saas-platform/invoicing-application';

describe('GetTenantInvoiceDocumentDraftingAssistUseCase', () => {
  it('builds a deterministic drafting surface from readiness and report signals', async () => {
    const getTenantElectronicSandboxReadinessUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        blockers: [],
        warnings: ['El certificado vence pronto.'],
        isReadyForLocalStubSubmission: true,
        recommendedNextStep:
          'Conviene revisar vigencia del certificado antes de empujar mas documentos.',
        checks: [
          {
            key: 'issuer_profile',
            label: 'Perfil fiscal',
            status: 'ready',
            detail: 'Configurado.',
          },
          {
            key: 'invoice_numbering',
            label: 'Numeracion Ecuador',
            status: 'ready',
            detail: 'Serie lista.',
          },
          {
            key: 'signature_settings',
            label: 'Firma electronica',
            status: 'ready',
            detail: 'Provider activo.',
          },
          {
            key: 'signature_material',
            label: 'Material de firma',
            status: 'warning',
            detail: 'Conviene revisar vigencia.',
          },
          {
            key: 'submission_settings',
            label: 'Gateway SRI',
            status: 'ready',
            detail: 'Configurado.',
          },
        ],
        documentSupport: [
          {
            documentCode: '01',
            label: 'Factura',
            numberingConfigured: true,
            previewAvailable: true,
            rideAvailable: true,
            schemaValidationAvailable: true,
            submitSupported: true,
            detail: 'Documento listo para trabajar.',
          },
          {
            documentCode: '04',
            label: 'Nota de credito',
            numberingConfigured: false,
            previewAvailable: true,
            rideAvailable: true,
            schemaValidationAvailable: true,
            submitSupported: false,
            detail: 'Falta numeracion.',
          },
        ],
      }),
    };
    const getTenantInvoicingReportSummaryUseCase = {
      execute: jest.fn().mockResolvedValue({
        generatedAt: '2026-05-23T12:00:00.000Z',
        customerCount: 4,
        invoiceCount: 12,
        statusBreakdown: [
          { status: 'issued', count: 7 },
          { status: 'draft', count: 5 },
        ],
        totalsByCurrency: [
          {
            currency: 'USD',
            subtotalInCents: 300000,
            taxInCents: 36000,
            totalInCents: 336000,
            paidInCents: 100000,
            outstandingTotalInCents: 236000,
          },
        ],
        monthlyTotals: [
          {
            month: '2026-05',
            currency: 'USD',
            invoiceCount: 8,
            totalInCents: 200000,
            taxInCents: 24000,
          },
        ],
      }),
    };

    const useCase = new GetTenantInvoiceDocumentDraftingAssistUseCase(
      getTenantElectronicSandboxReadinessUseCase as any,
      getTenantInvoicingReportSummaryUseCase as any,
      () => new Date('2026-05-23T12:30:00.000Z'),
    );

    const result = await useCase.execute('saas-platform');

    expect(result.generatedAt).toEqual(new Date('2026-05-23T12:30:00.000Z'));
    expect(result.summary).toEqual(
      expect.objectContaining({
        tone: 'warning',
        readinessStatus: 'needs_attention',
      }),
    );
    expect(result.checklist).toHaveLength(5);
    expect(result.documentGuidance).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentCode: '01',
          status: 'ready',
        }),
        expect.objectContaining({
          documentCode: '04',
          status: 'blocked',
        }),
      ]),
    );
    expect(result.reportSnapshot).toEqual({
      customerCount: 4,
      invoiceCount: 12,
      outstandingTotalInCents: 236000,
      dominantStatus: 'issued',
      busiestMonth: '2026-05',
    });
    expect(result.draftingHints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'drafting-brief',
        }),
        expect.objectContaining({
          key: 'blocker-explainer',
        }),
      ]),
    );
    expect(result.blockedActions).toContain(
      'Firmar electronicamente el documento sin aprobacion humana.',
    );
  });
});
