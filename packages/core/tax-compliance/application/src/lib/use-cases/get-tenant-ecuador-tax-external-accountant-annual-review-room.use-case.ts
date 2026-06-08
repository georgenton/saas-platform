import { EcuadorTaxExternalAccountantAnnualReviewRoomView } from '@saas-platform/tax-compliance-domain';
import {
  annualGuardrails,
  countEvents,
  listAnnualTaxEvents,
  statusFromBlockers,
} from './ecuador-tax-annual-readiness.helpers';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';

export class GetTenantEcuadorTaxExternalAccountantAnnualReviewRoomUseCase {
  constructor(
    private readonly listEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    year: number;
  }): Promise<EcuadorTaxExternalAccountantAnnualReviewRoomView> {
    const events = await listAnnualTaxEvents(
      this.listEventsUseCase,
      input.tenantSlug,
      input.year,
    );
    const sections: EcuadorTaxExternalAccountantAnnualReviewRoomView['reviewSections'] =
      [
        section('annual_income_tax', 'Impuesto a la renta anual', countEvents(events, ['income', 'annual', 'declaration']), ['Validar base imponible anual.']),
        section('monthly_consistency', 'Consistencia mensual', countEvents(events, ['filing', 'closeout']), ['Confirmar que los periodos mensuales soportan el cierre anual.']),
        section('payments_receipts', 'Pagos y recibos', countEvents(events, ['payment', 'receipt']), ['Confirmar saldos pendientes o pagos parciales.']),
        section('exceptions', 'Excepciones abiertas', countEvents(events, ['exception', 'rejected']), ['Resolver rechazos, recibos faltantes o diferencias.']),
      ];
    const blockers = sections
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);

    return {
      tenantSlug: input.tenantSlug,
      year: input.year,
      generatedAt: this.nowProvider(),
      roomStatus: statusFromBlockers(
        blockers,
        sections.filter((item) => item.status === 'needs_review').length,
      ),
      reviewSections: sections,
      summary: {
        sectionCount: sections.length,
        questionCount: sections.reduce(
          (total, section) => total + section.questions.length,
          0,
        ),
        blockedSectionCount: blockers.length,
      },
      blockers,
      nextStep: 'Enviar sala anual al contador externo para revision manual.',
      guardrails: annualGuardrails(),
    };
  }
}

function section(
  key: string,
  label: string,
  evidenceCount: number,
  questions: string[],
): EcuadorTaxExternalAccountantAnnualReviewRoomView['reviewSections'][number] {
  return {
    key,
    label,
    status: evidenceCount > 0 ? 'needs_review' : 'blocked',
    questions,
    evidenceRefs: [`${evidenceCount} eventos relacionados`],
  };
}
