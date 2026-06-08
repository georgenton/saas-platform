import {
  GetTenantEcuadorTaxAccountingAdvancedDiscoveryGateUseCase,
  GetTenantEcuadorTaxAnnualFiscalYearWorkspaceUseCase,
  GetTenantEcuadorTaxAnnualIncomeTaxReconciliationV2UseCase,
  GetTenantEcuadorTaxAuditReadinessBinderUseCase,
  GetTenantEcuadorTaxExternalAccountantAnnualReviewRoomUseCase,
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
