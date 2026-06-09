import {
  GetAiClinicsCloseoutGrowthBridgeReviewUseCase,
  GetAiClinicsDomainContractRegistryUseCase,
  GetAiClinicsGuardrailApprovalPackUseCase,
  GetTenantMedicalClinicAssistantAiSuggestionEnvelopeUseCase,
  GetTenantPsychologyClinicAssistantAiSuggestionEnvelopeUseCase,
  GetTenantTaxAccountingBoundaryAssistantAiSuggestionEnvelopeUseCase,
} from '@saas-platform/ai-application';

describe('AI clinics assistant templates', () => {
  const fixedNow = new Date('2026-06-08T12:00:00.000Z');
  const emptyMemoryRetrievalUseCase = {
    execute: jest.fn().mockResolvedValue({
      retrievedAt: fixedNow,
      recordCount: 0,
      policy: {
        version: 'v1',
        limit: 8,
        suppressedDuplicateCount: 0,
        archivedRecordCount: 0,
        prioritizedRecordIds: [],
        archivalSummary: 'No memory records were retrieved.',
        rankingSummary: 'No ranking was needed.',
      },
      records: [],
      notes: [],
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exposes medical and psychology contract registry entries with Growth connected', () => {
    const view = new GetAiClinicsDomainContractRegistryUseCase(
      () => fixedNow,
    ).execute();

    expect(view.status).toBe('ready');
    expect(view.summary.templateCount).toBe(2);
    expect(view.summary.growthConnectedTemplateCount).toBe(2);
    expect(view.templates.map((entry) => entry.agentKey)).toEqual([
      'medical-clinic-assistant',
      'psychology-clinic-assistant',
    ]);
    expect(
      view.templates.flatMap((entry) =>
        entry.surfaces.map((surface) => surface.growthBridge),
      ),
    ).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Growth'),
        expect.stringContaining('Growth'),
      ]),
    );
  });

  it('keeps clinic guardrails approval-required and blocks clinical automation', () => {
    const view = new GetAiClinicsGuardrailApprovalPackUseCase(
      () => fixedNow,
    ).execute();

    expect(view.approvalPolicy.required).toBe(true);
    expect(view.guardrails.map((entry) => entry.key)).toEqual(
      expect.arrayContaining([
        'no_diagnosis',
        'no_prescription',
        'no_clinical_risk_automation',
        'no_record_signature',
        'no_state_mutation',
      ]),
    );
    expect(view.guardrails.flatMap((entry) => entry.blockedCapabilities)).toEqual(
      expect.arrayContaining([
        'diagnose_patient',
        'prescribe_medication',
        'sign_clinical_record',
        'mutate_clinic_state',
      ]),
    );
  });

  it('builds a medical clinic suggestion envelope from static contracts and AI memory', async () => {
    const envelope =
      await new GetTenantMedicalClinicAssistantAiSuggestionEnvelopeUseCase(
        emptyMemoryRetrievalUseCase as any,
        () => fixedNow,
      ).execute('saas-platform-local');

    expect(envelope.agent.key).toBe('medical-clinic-assistant');
    expect(envelope.agent.domainKey).toBe('medical');
    expect(envelope.surface.key).toBe('medical_clinics_assistant_contract');
    expect(envelope.contextBlocks.map((entry) => entry.key)).toEqual(
      expect.arrayContaining([
        'clinic_template_contract',
        'clinic_surfaces',
        'growth_bridge',
        'safety_boundaries',
        'approval_requirement',
      ]),
    );
    expect(envelope.toolAccess[0]).toEqual(
      expect.objectContaining({ accessLevel: 'approval_required' }),
    );
  });

  it('builds a psychology clinic suggestion envelope from static contracts and AI memory', async () => {
    const envelope =
      await new GetTenantPsychologyClinicAssistantAiSuggestionEnvelopeUseCase(
        emptyMemoryRetrievalUseCase as any,
        () => fixedNow,
      ).execute('saas-platform-local');

    expect(envelope.agent.key).toBe('psychology-clinic-assistant');
    expect(envelope.agent.domainKey).toBe('psychology');
    expect(envelope.surface.key).toBe('psychology_clinics_assistant_contract');
    expect(
      envelope.contextBlocks
        .find((entry) => entry.key === 'safety_boundaries')
        ?.bullets,
    ).toEqual(expect.arrayContaining(['interpret_assessment_scale']));
  });

  it('closes out AI clinics templates as transversal with Growth bridge connected', () => {
    const view = new GetAiClinicsCloseoutGrowthBridgeReviewUseCase(
      () => fixedNow,
    ).execute();

    expect(view.status).toBe('ready');
    expect(view.decision.keepAiTransversal).toBe(true);
    expect(view.decision.growthConnected).toBe(true);
    expect(view.decision.openClinicalAutomation).toBe(false);
    expect(view.products.every((entry) => entry.growthBridgeStatus === 'connected')).toBe(
      true,
    );
  });

  it('builds a Tax Accounting boundary suggestion envelope from boundary review context', async () => {
    const boundaryReviewUseCase = {
      execute: jest.fn(async () => ({
        tenantSlug: 'saas-platform-local',
        period: '2026-06',
        year: 2026,
        generatedAt: fixedNow,
        reviewStatus: 'needs_review',
        professionalHandoff: {
          handoffStatus: 'needs_review',
          decision: {
            serviceMode: 'external_accountant_review',
            reason: 'Requiere contador externo.',
            accountantRequired: true,
          },
          nextStep: 'Enviar paquete profesional al contador.',
        },
        accountingAdvancedGate: {
          gateStatus: 'needs_review',
          recommendation: {
            nextProduct: 'accounting-advanced',
            openAdvancedAccountingNow: true,
            reason: 'Hay presion contable formal.',
            minimumEvidenceBeforeOpening: [
              'Preguntas del contador respondidas y trazables.',
            ],
          },
        },
        boundaryLanes: [
          {
            key: 'tax_declaration_preparation',
            label: 'Preparacion tributaria asistida',
            owner: 'tax_compliance',
            status: 'needs_review',
            explanation: 'Tax Compliance prepara evidencia.',
            blockedAutomation: ['file_sri_declaration'],
          },
        ],
        assistantInstructions: {
          allowedOutputs: ['boundary_summary'],
          blockedOutputs: ['journal_entry_creation'],
          requiredReview: 'Requiere revision.',
        },
        summary: {
          laneCount: 1,
          blockedLaneCount: 0,
          accountantRequired: true,
          openAdvancedAccountingNow: true,
        },
        blockers: [],
        nextStep: 'Preparar preguntas.',
        guardrails: ['No reemplaza contador.'],
      })),
    };
    const envelope =
      await new GetTenantTaxAccountingBoundaryAssistantAiSuggestionEnvelopeUseCase(
        boundaryReviewUseCase as any,
        emptyMemoryRetrievalUseCase as any,
        () => fixedNow,
      ).execute('saas-platform-local');

    expect(envelope.agent.key).toBe('tax-accounting-boundary-assistant');
    expect(envelope.surface.key).toBe('tax_accounting_boundary_ai_review');
    expect(envelope.contextBlocks.map((entry) => entry.key)).toEqual(
      expect.arrayContaining([
        'boundary_review_summary',
        'boundary_lanes',
        'professional_handoff',
        'accounting_advanced_gate',
        'blocked_outputs',
      ]),
    );
    expect(envelope.toolAccess[0]).toEqual(
      expect.objectContaining({ accessLevel: 'approval_required' }),
    );
  });
});
