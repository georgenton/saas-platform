import { EcuadorTaxAnnualFiscalYearWorkspaceView } from '@saas-platform/tax-compliance-domain';
import {
  annualGuardrails,
  countEvents,
  listAnnualTaxEvents,
  statusFromBlockers,
} from './ecuador-tax-annual-readiness.helpers';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';

export class GetTenantEcuadorTaxAnnualFiscalYearWorkspaceUseCase {
  constructor(
    private readonly listEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    year: number;
  }): Promise<EcuadorTaxAnnualFiscalYearWorkspaceView> {
    const events = await listAnnualTaxEvents(
      this.listEventsUseCase,
      input.tenantSlug,
      input.year,
    );
    const periodRows: EcuadorTaxAnnualFiscalYearWorkspaceView['periodRows'] =
      Array.from({ length: 12 }, (_, index) => {
      const period = `${input.year}-${String(index + 1).padStart(2, '0')}`;
      const periodEvents = events.filter((event) => event.period === period);
      const filingEventCount = countEvents(periodEvents, ['filing']);
      const paymentEventCount = countEvents(periodEvents, ['payment']);
      const exceptionEventCount = countEvents(periodEvents, ['exception']);

      return {
        period,
        eventCount: periodEvents.length,
        filingEventCount,
        paymentEventCount,
        exceptionEventCount,
        readinessStatus: periodEvents.length > 0 ? 'needs_review' : 'blocked',
      };
      });
    const blockers = periodRows
      .filter((row) => row.eventCount === 0)
      .map((row) => `Sin evidencia fiscal para ${row.period}`);

    return {
      tenantSlug: input.tenantSlug,
      year: input.year,
      generatedAt: this.nowProvider(),
      workspaceStatus: statusFromBlockers(
        blockers,
        periodRows.filter((row) => row.readinessStatus === 'needs_review')
          .length,
      ),
      periodRows,
      annualTotals: {
        periodCount: periodRows.length,
        eventCount: events.length,
        filingEventCount: countEvents(events, ['filing']),
        paymentEventCount: countEvents(events, ['payment']),
        exceptionEventCount: countEvents(events, ['exception']),
      },
      blockers,
      nextStep: 'Completar evidencia mensual antes del cierre anual.',
      guardrails: annualGuardrails(),
    };
  }
}
