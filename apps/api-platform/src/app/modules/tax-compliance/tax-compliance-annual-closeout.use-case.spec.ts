import {
  GetTenantEcuadorTaxAccountingAdvancedDiscoveryGateUseCase,
  GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase,
  GetTenantEcuadorTaxAccountingBoundaryAiReviewUseCase,
  GetTenantEcuadorTaxAnnualFiscalYearWorkspaceUseCase,
  GetTenantEcuadorTaxAnnualIncomeTaxReconciliationV2UseCase,
  GetTenantEcuadorTaxAuditReadinessBinderUseCase,
  GetTenantEcuadorTaxExternalAccountantAnnualReviewRoomUseCase,
  GetTenantEcuadorTaxProfessionalHandoffV6UseCase,
  RequestTenantEcuadorTaxComplianceAnnualCloseoutV5UseCase,
} from '@saas-platform/tax-compliance-application';

const fixedNow = new Date('2026-06-08T13:00:00.000Z');

describe('Tax Compliance annual closeout use cases', () => {
  it('builds annual, audit, accountant and accounting advanced decision surfaces', async () => {
    const listEventsUseCase = {
      execute: jest.fn(async ({ period }: { period: string }) =>
        period.endsWith('-01')
          ? [
              event(period, 'sri_fiscal_evidence_imported'),
              event(period, 'declaration_filing_result_recorded'),
              event(period, 'payment_receipt_uploaded'),
              event(period, 'accountant_review_requested'),
              event(period, 'accounting_bridge_previewed'),
              event(period, 'purchase_expense_recorded'),
              event(period, 'withholding_evidence_recorded'),
            ]
          : period.endsWith('-02')
            ? [
                event(period, 'official_book_request_detected'),
                event(period, 'certified_bank_feed_needed'),
                event(period, 'auditor_accountant_review_requested'),
              ]
            : [],
      ),
    } as any;
    const annual =
      await new GetTenantEcuadorTaxAnnualFiscalYearWorkspaceUseCase(
        listEventsUseCase,
        () => fixedNow,
      ).execute({ tenantSlug: 'tax-demo', year: 2026 });
    const reconciliation =
      await new GetTenantEcuadorTaxAnnualIncomeTaxReconciliationV2UseCase(
        listEventsUseCase,
        () => fixedNow,
      ).execute({ tenantSlug: 'tax-demo', year: 2026 });
    const binder = await new GetTenantEcuadorTaxAuditReadinessBinderUseCase(
      listEventsUseCase,
      () => fixedNow,
    ).execute({ tenantSlug: 'tax-demo', year: 2026 });
    const accountantRoom =
      await new GetTenantEcuadorTaxExternalAccountantAnnualReviewRoomUseCase(
        listEventsUseCase,
        () => fixedNow,
      ).execute({ tenantSlug: 'tax-demo', year: 2026 });
    const accountingGate =
      await new GetTenantEcuadorTaxAccountingAdvancedDiscoveryGateUseCase(
        listEventsUseCase,
        () => fixedNow,
      ).execute({ tenantSlug: 'tax-demo', year: 2026 });
    const closeout =
      await new RequestTenantEcuadorTaxComplianceAnnualCloseoutV5UseCase(
        new GetTenantEcuadorTaxAnnualFiscalYearWorkspaceUseCase(
          listEventsUseCase,
          () => fixedNow,
        ),
        new GetTenantEcuadorTaxAnnualIncomeTaxReconciliationV2UseCase(
          listEventsUseCase,
          () => fixedNow,
        ),
        new GetTenantEcuadorTaxAuditReadinessBinderUseCase(
          listEventsUseCase,
          () => fixedNow,
        ),
        new GetTenantEcuadorTaxExternalAccountantAnnualReviewRoomUseCase(
          listEventsUseCase,
          () => fixedNow,
        ),
        new GetTenantEcuadorTaxAccountingAdvancedDiscoveryGateUseCase(
          listEventsUseCase,
          () => fixedNow,
        ),
        () => fixedNow,
      ).execute({ tenantSlug: 'tax-demo', year: 2026 });

    expect(annual.annualTotals.eventCount).toBe(10);
    expect(reconciliation.summary.rowCount).toBe(5);
    expect(binder.summary.folderCount).toBe(5);
    expect(accountantRoom.summary.questionCount).toBe(4);
    expect(accountingGate.recommendation.nextProduct).toBe(
      'accounting-advanced',
    );
    expect(closeout.decision.recommendedNextProduct).toBe(
      'accounting-advanced',
    );
    expect(closeout.guardrails.join(' ')).toContain('No inicia sesion en SRI');
  });

  it('builds professional handoff, gate v2 and AI boundary review surfaces', async () => {
    const accountantRoom = {
      execute: jest.fn(async () => ({
        tenantSlug: 'tax-demo',
        period: '2026-06',
        year: 2026,
        generatedAt: fixedNow,
        roomStatus: 'needs_review',
        riskMonitor: {} as any,
        filingHandoff: {} as any,
        handoffSections: [
          {
            key: 'vat',
            label: 'IVA',
            status: 'needs_review',
            owner: 'accountant',
            questionCount: 2,
            evidenceRefs: ['vat_declaration_workspace_v2'],
          },
        ],
        summary: {
          sectionCount: 1,
          readySectionCount: 0,
          accountantSectionCount: 1,
          questionCount: 2,
          blockerCount: 0,
        },
        blockers: [],
        nextStep: 'Resolver secciones pendientes.',
        guardrails: ['No filing automatico.'],
      })),
    };
    const annualCloseout = {
      execute: jest.fn(async () => ({
        tenantSlug: 'tax-demo',
        year: 2026,
        generatedAt: fixedNow,
        closeoutStatus: 'needs_review',
        checklist: [
          {
            key: 'accounting_gate',
            label: 'Gate Accounting Advanced',
            status: 'needs_review',
            evidence: 'Hay senales contables.',
          },
        ],
        decision: {
          status: 'ready_for_external_accountant_review',
          recommendedNextProduct: 'accounting-advanced',
        },
        summary: {
          checkCount: 1,
          readyCheckCount: 0,
          needsReviewCheckCount: 1,
          blockedCheckCount: 0,
        },
        blockers: [],
        nextStep: 'Cerrar con contador externo.',
        guardrails: ['No reemplaza contador.'],
      })),
    };
    const professionalHandoffUseCase =
      new GetTenantEcuadorTaxProfessionalHandoffV6UseCase(
        accountantRoom as any,
        annualCloseout as any,
        () => fixedNow,
      );
    const professionalHandoff = await professionalHandoffUseCase.execute({
      tenantSlug: 'tax-demo',
      period: '2026-06',
      year: 2026,
    });
    const baseGate = {
      execute: jest.fn(async () => ({
        tenantSlug: 'tax-demo',
        year: 2026,
        generatedAt: fixedNow,
        gateStatus: 'needs_review',
        decisionSignals: [
          {
            key: 'official_books',
            label: 'Libros oficiales',
            severity: 'high',
            rationale: '1 evento.',
          },
        ],
        recommendation: {
          nextProduct: 'accounting-advanced',
          reason: 'Hay senales suficientes.',
          openAdvancedAccountingNow: true,
        },
        blockers: [],
        nextStep: 'Evaluar Accounting Advanced.',
        guardrails: ['No crea libros.'],
      })),
    };
    const gateV2UseCase = new GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase(
      baseGate as any,
      professionalHandoffUseCase,
      () => fixedNow,
    );
    const gateV2 = await gateV2UseCase.execute({
      tenantSlug: 'tax-demo',
      period: '2026-06',
      year: 2026,
    });
    const boundaryReview =
      await new GetTenantEcuadorTaxAccountingBoundaryAiReviewUseCase(
        professionalHandoffUseCase,
        gateV2UseCase,
        () => fixedNow,
      ).execute({
        tenantSlug: 'tax-demo',
        period: '2026-06',
        year: 2026,
      });

    expect(professionalHandoff.decision.serviceMode).toBe(
      'accounting_advanced_discovery',
    );
    expect(gateV2.recommendation.openAdvancedAccountingNow).toBe(true);
    expect(gateV2.recommendation.minimumEvidenceBeforeOpening).toContain(
      'Preguntas del contador respondidas y trazables.',
    );
    expect(boundaryReview.boundaryLanes.map((lane) => lane.owner)).toEqual(
      expect.arrayContaining([
        'tax_compliance',
        'accounting_foundation',
        'accounting_advanced',
        'external_accountant',
      ]),
    );
    expect(boundaryReview.assistantInstructions.blockedOutputs).toContain(
      'journal_entry_creation',
    );
  });
});

function event(period: string, eventType: string) {
  return {
    id: `${period}-${eventType}`,
    tenantId: 'tenant_tax_demo',
    tenantSlug: 'tax-demo',
    period,
    year: 2026,
    eventType,
    source: 'test',
    payload: {},
    occurredAt: fixedNow,
    createdAt: fixedNow,
  };
}
