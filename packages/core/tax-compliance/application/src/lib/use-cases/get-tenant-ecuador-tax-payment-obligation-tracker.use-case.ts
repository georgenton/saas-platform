import {
  EcuadorTaxPaymentObligationTrackerView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { ListTenantEcuadorTaxExternalFilingResultsUseCase } from './list-tenant-ecuador-tax-external-filing-results.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxPaymentObligationTrackerUseCase {
  constructor(
    private readonly listTenantEcuadorTaxExternalFilingResultsUseCase: ListTenantEcuadorTaxExternalFilingResultsUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxPaymentObligationTrackerView> {
    const filingResults =
      await this.listTenantEcuadorTaxExternalFilingResultsUseCase.execute(
        input,
      );
    const paymentRows: EcuadorTaxPaymentObligationTrackerView['paymentRows'] =
      filingResults.map((result) => {
        const expectedAmountInCents = result.expectedAmountInCents ?? 0;
        const paidAmountInCents = result.paidAmountInCents ?? 0;
        const outstandingAmountInCents = Math.max(
          expectedAmountInCents - paidAmountInCents,
          0,
        );
        const paymentStatus =
          result.resultStatus === 'rejected_externally'
            ? 'rejected'
            : expectedAmountInCents === 0
              ? 'not_applicable'
              : outstandingAmountInCents === 0
                ? 'paid'
                : paidAmountInCents > 0
                  ? 'partial'
                  : 'pending';

        return {
          key: result.resultId,
          obligationKey: result.obligationKey,
          formKey: result.formKey,
          paymentStatus,
          expectedAmountInCents,
          paidAmountInCents,
          outstandingAmountInCents,
          currency: result.currency,
          dueSignal:
            'Confirmar vencimiento contra calendario SRI aportado por operador.',
          externalReference: result.externalReference,
          nextAction:
            paymentStatus === 'paid' || paymentStatus === 'not_applicable'
              ? 'Conservar recibo en vault.'
              : paymentStatus === 'rejected'
                ? 'Resolver rechazo antes de registrar pago.'
                : 'Registrar pago externo o soporte de exoneracion.',
        };
      });
    const blockers = [
      filingResults.length === 0 ? 'payment_tracker.no_external_results' : null,
      ...paymentRows
        .filter(
          (row) =>
            row.paymentStatus === 'pending' || row.paymentStatus === 'partial',
        )
        .map((row) => `payment_tracker.${row.obligationKey}.payment_pending`),
      ...paymentRows
        .filter((row) => row.paymentStatus === 'rejected')
        .map((row) => `payment_tracker.${row.obligationKey}.filing_rejected`),
    ].filter((blocker): blocker is string => blocker !== null);
    const trackerStatus = resolveStatus(paymentRows, blockers);
    const summary = {
      rowCount: paymentRows.length,
      paidRowCount: paymentRows.filter(
        (row) =>
          row.paymentStatus === 'paid' ||
          row.paymentStatus === 'not_applicable',
      ).length,
      pendingRowCount: paymentRows.filter(
        (row) =>
          row.paymentStatus === 'pending' || row.paymentStatus === 'partial',
      ).length,
      expectedAmountInCents: paymentRows.reduce(
        (total, row) => total + row.expectedAmountInCents,
        0,
      ),
      paidAmountInCents: paymentRows.reduce(
        (total, row) => total + row.paidAmountInCents,
        0,
      ),
      outstandingAmountInCents: paymentRows.reduce(
        (total, row) => total + row.outstandingAmountInCents,
        0,
      ),
    };
    const view: EcuadorTaxPaymentObligationTrackerView = {
      ...input,
      generatedAt: this.nowProvider(),
      trackerStatus,
      filingResults,
      paymentRows,
      summary,
      blockers: [...new Set(blockers)],
      nextStep:
        trackerStatus === 'ready'
          ? 'Usar tracker como soporte de certificado post-filing.'
          : 'Completar pagos externos o resolver rechazos pendientes.',
      guardrails: [
        'Tracker registra pagos aportados por humano; no ejecuta pagos.',
        'Los vencimientos deben contrastarse con calendario tributario y soporte externo.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_payment_obligation_tracker_reviewed',
        source: 'tax_payment_obligation_tracker',
        payload: { trackerStatus, summary },
      });
    }

    return view;
  }
}

function resolveStatus(
  rows: EcuadorTaxPaymentObligationTrackerView['paymentRows'],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (
    blockers.length > 0 ||
    rows.some((row) => row.paymentStatus === 'rejected')
  ) {
    return 'blocked';
  }

  return rows.some(
    (row) => row.paymentStatus === 'pending' || row.paymentStatus === 'partial',
  )
    ? 'needs_review'
    : 'ready';
}
