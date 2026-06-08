import { EcuadorTaxAnnualIncomeTaxReconciliationV2View } from '@saas-platform/tax-compliance-domain';
import {
  annualGuardrails,
  countEvents,
  listAnnualTaxEvents,
  statusFromBlockers,
} from './ecuador-tax-annual-readiness.helpers';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';

export class GetTenantEcuadorTaxAnnualIncomeTaxReconciliationV2UseCase {
  constructor(
    private readonly listEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    year: number;
  }): Promise<EcuadorTaxAnnualIncomeTaxReconciliationV2View> {
    const events = await listAnnualTaxEvents(
      this.listEventsUseCase,
      input.tenantSlug,
      input.year,
    );
    const rows: EcuadorTaxAnnualIncomeTaxReconciliationV2View['reconciliationRows'] =
      [
        row('income', 'Ingresos anuales', countEvents(events, ['sales', 'invoice', 'filing']), 'Comparar ventas, ecommerce y casillas declaradas.'),
        row('expenses', 'Gastos deducibles', countEvents(events, ['purchase', 'expense']), 'Cruzar compras, proveedores y deducibilidad.'),
        row('withholdings', 'Retenciones', countEvents(events, ['withholding']), 'Confirmar retenciones emitidas/recibidas.'),
        row('accounting_bridge', 'Puente contable', countEvents(events, ['accounting']), 'Comparar con Accounting Foundation.'),
        row('post_filing', 'Resultados externos', countEvents(events, ['filing', 'payment', 'receipt']), 'Usar resultados externos como evidencia anual.'),
      ];
    const blockers = rows
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);

    return {
      tenantSlug: input.tenantSlug,
      year: input.year,
      generatedAt: this.nowProvider(),
      reconciliationStatus: statusFromBlockers(
        blockers,
        rows.filter((item) => item.status === 'needs_review').length,
      ),
      reconciliationRows: rows,
      summary: {
        rowCount: rows.length,
        needsReviewCount: rows.filter((item) => item.status === 'needs_review')
          .length,
        blockedCount: blockers.length,
      },
      blockers,
      nextStep: 'Resolver diferencias antes de preparar impuesto a la renta anual.',
      guardrails: annualGuardrails(),
    };
  }
}

function row(
  key: string,
  label: string,
  evidenceCount: number,
  evidence: string,
): EcuadorTaxAnnualIncomeTaxReconciliationV2View['reconciliationRows'][number] {
  return {
    key,
    label,
    status: evidenceCount > 0 ? 'needs_review' : 'blocked',
    evidence: `${evidenceCount} eventos. ${evidence}`,
    differenceSignal: evidenceCount > 0 ? 'review_required' : 'blocked',
  };
}
