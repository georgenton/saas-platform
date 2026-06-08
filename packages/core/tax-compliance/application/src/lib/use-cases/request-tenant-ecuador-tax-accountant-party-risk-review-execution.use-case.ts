import {
  EcuadorTaxAccountantPartyRiskReviewExecutionView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase } from './get-tenant-ecuador-tax-accountant-review-from-party-risks.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxAccountantReviewUseCase } from './request-tenant-ecuador-tax-accountant-review.use-case';

export class RequestTenantEcuadorTaxAccountantPartyRiskReviewExecutionUseCase {
  constructor(
    private readonly getTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase: GetTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase,
    private readonly requestTenantEcuadorTaxAccountantReviewUseCase: RequestTenantEcuadorTaxAccountantReviewUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    requestedByUserId?: string | null;
    requestedByEmail?: string | null;
    executeReview?: boolean;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxAccountantPartyRiskReviewExecutionView> {
    const riskReview =
      await this.getTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase.execute(
        input,
      );
    const shouldExecute =
      (input.executeReview ?? true) && riskReview.escalationStatus !== 'ready';
    const review = shouldExecute
      ? await this.requestTenantEcuadorTaxAccountantReviewUseCase.execute({
          tenantSlug: input.tenantSlug,
          period: input.period,
          year: input.year,
          requestedByUserId: input.requestedByUserId ?? null,
          requestedByEmail: input.requestedByEmail ?? null,
        })
      : null;
    const event =
      (input.recordEvent ?? true)
        ? await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
            tenantSlug: input.tenantSlug,
            period: input.period,
            year: input.year,
            eventType: 'tax_accountant_party_risk_review_requested',
            source: 'tax_accountant_party_risk_review_execution',
            payload: {
              executed: Boolean(review),
              reviewId: review?.id ?? null,
              escalationStatus: riskReview.escalationStatus,
              questionCount: riskReview.suggestedReviewRequest.questions.length,
              affectedPartyCount: riskReview.summary.affectedPartyCount,
            },
          })
        : null;
    const executionStatus: EcuadorTaxReadinessStatus = review
      ? 'needs_review'
      : riskReview.escalationStatus === 'ready'
        ? 'ready'
        : 'blocked';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      executionStatus,
      review,
      suggestedReviewRequest: riskReview.suggestedReviewRequest,
      partyRiskSummary: riskReview.summary,
      executionNotes: [
        review
          ? `Review contador creado: ${review.id}.`
          : riskReview.escalationStatus === 'ready'
            ? 'No se creo review porque no hay riesgos de terceros pendientes.'
            : 'Review no ejecutado por configuracion del request.',
        'Las preguntas de terceros quedan adjuntas como evidencia operativa en el evento.',
      ],
      eventId: event?.id ?? null,
      blockers:
        executionStatus === 'blocked'
          ? ['accountant_party_risk_review.not_executed']
          : [],
      nextStep: review
        ? 'Dar seguimiento al review contador y aplicar correcciones aprobadas.'
        : 'Continuar flujo tributario sin escalacion de terceros.',
      guardrails: [
        'Este execution usa el ciclo existente de accountant reviews; no reemplaza la responsabilidad profesional.',
        'La evidencia de parties debe revisarse antes de aprobar declaraciones afectadas.',
      ],
    };
  }
}
