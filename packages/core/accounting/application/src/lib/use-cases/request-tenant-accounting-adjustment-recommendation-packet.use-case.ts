import { TenantAccountingAdjustmentRecommendationPacketView } from '@saas-platform/accounting-domain';
import { ListTenantAccountingCorrectionsQueueUseCase } from './list-tenant-accounting-corrections-queue.use-case';

export class RequestTenantAccountingAdjustmentRecommendationPacketUseCase {
  constructor(
    private readonly listTenantAccountingCorrectionsQueueUseCase: ListTenantAccountingCorrectionsQueueUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingAdjustmentRecommendationPacketView> {
    const correctionsQueue =
      await this.listTenantAccountingCorrectionsQueueUseCase.execute(input);
    const sourceCorrections = correctionsQueue.corrections.filter(
      (correction) =>
        correction.status === 'open' || correction.status === 'in_progress',
    );
    const recommendedAdjustments = sourceCorrections.map((correction, index) => ({
      key: `recommendation:${correction.id}`,
      adjustmentType:
        correction.source === 'cash_closeout'
          ? ('manual_adjustment' as const)
          : correction.source === 'financial_review'
            ? ('reclassification' as const)
            : index % 2 === 0
              ? ('accrual' as const)
              : ('rounding' as const),
      label: correction.title,
      rationale: correction.recommendedAction,
      suggestedLines: [
        {
          accountCode: '599.99',
          accountName: 'Cuenta puente de revision',
          debitInCents: 0,
          creditInCents: 0,
          notes: [correction.detail],
        },
      ],
      sourceCorrectionIds: [correction.id],
    }));
    const blockers =
      correctionsQueue.summary.criticalCount > 0
        ? ['accounting.adjustment_recommendation.critical_corrections']
        : [];
    const recommendationStatus =
      recommendedAdjustments.length === 0
        ? 'empty'
        : blockers.length > 0
          ? 'blocked'
          : correctionsQueue.queueStatus === 'needs_review'
            ? 'needs_corrections'
            : 'ready_for_review';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      recommendationStatus,
      correctionsQueue,
      recommendedAdjustments,
      summary: {
        recommendationCount: recommendedAdjustments.length,
        sourceCorrectionCount: sourceCorrections.length,
        criticalCorrectionCount: correctionsQueue.summary.criticalCount,
      },
      blockers,
      nextStep:
        recommendationStatus === 'empty'
          ? 'No hay correcciones pendientes para sugerir ajustes.'
          : 'Revisar recomendaciones con contador antes de crear asientos.',
      guardrails: [
        'Las recomendaciones no crean journal entries automaticamente.',
        'Montos y cuentas sugeridas deben revisarse profesionalmente.',
      ],
    };
  }
}
