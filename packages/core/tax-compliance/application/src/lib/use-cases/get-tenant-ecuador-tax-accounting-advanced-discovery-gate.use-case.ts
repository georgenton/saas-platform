import { EcuadorTaxAccountingAdvancedDiscoveryGateView } from '@saas-platform/tax-compliance-domain';
import {
  annualGuardrails,
  countEvents,
  listAnnualTaxEvents,
} from './ecuador-tax-annual-readiness.helpers';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';

export class GetTenantEcuadorTaxAccountingAdvancedDiscoveryGateUseCase {
  constructor(
    private readonly listEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    year: number;
  }): Promise<EcuadorTaxAccountingAdvancedDiscoveryGateView> {
    const events = await listAnnualTaxEvents(
      this.listEventsUseCase,
      input.tenantSlug,
      input.year,
    );
    const signals: EcuadorTaxAccountingAdvancedDiscoveryGateView['decisionSignals'] =
      [
        signal('official_books', 'Libros oficiales', countEvents(events, ['legal_book', 'official_book']), 'Se requiere evidencia de necesidad de libros oficiales.'),
        signal('certified_bank_feeds', 'Conciliacion bancaria certificada', countEvents(events, ['bank', 'certified']), 'Se requiere presion real de conciliacion certificada.'),
        signal('signed_financials', 'Estados financieros firmados', countEvents(events, ['financial_statement', 'signed']), 'Se requiere contador/auditor y estados multi-periodo.'),
        signal('auditor_portal', 'Portal contador/auditor', countEvents(events, ['auditor', 'accountant_review']), 'Se evalua si el contador necesita portal dedicado.'),
      ];
    const highPressureCount = signals.filter(
      (item) => item.severity === 'high' || item.severity === 'critical',
    ).length;

    return {
      tenantSlug: input.tenantSlug,
      year: input.year,
      generatedAt: this.nowProvider(),
      gateStatus: highPressureCount >= 2 ? 'needs_review' : 'ready',
      decisionSignals: signals,
      recommendation: {
        nextProduct:
          highPressureCount >= 2 ? 'accounting-advanced' : 'tax-compliance-ec',
        reason:
          highPressureCount >= 2
            ? 'Hay senales suficientes para discovery de Accounting Advanced.'
            : 'Aun conviene endurecer Tax Compliance antes de abrir Accounting Advanced.',
        openAdvancedAccountingNow: highPressureCount >= 2,
      },
      blockers: [],
      nextStep: 'Usar este gate para decidir si Accounting Advanced merece discovery.',
      guardrails: annualGuardrails(),
    };
  }
}

function signal(
  key: string,
  label: string,
  evidenceCount: number,
  rationale: string,
): EcuadorTaxAccountingAdvancedDiscoveryGateView['decisionSignals'][number] {
  return {
    key,
    label,
    severity:
      evidenceCount > 5 ? 'critical' : evidenceCount > 0 ? 'high' : 'normal',
    rationale: `${evidenceCount} eventos. ${rationale}`,
  };
}
