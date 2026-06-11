import {
  EcuadorTaxAccountantCollaborationSlaTrackerV71View,
  EcuadorTaxAccountantFeedbackIntakeQueueV70View,
  EcuadorTaxReadinessStatus,
  EcuadorTaxReviewPriority,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase } from './get-tenant-ecuador-tax-accountant-feedback-intake-queue-v70.use-case';

export class GetTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase {
  constructor(
    private readonly getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase: GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountantCollaborationSlaTrackerV71View> {
    const feedbackQueue =
      await this.getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase.execute(
        input,
      );
    const slaItems: EcuadorTaxAccountantCollaborationSlaTrackerV71View['slaItems'] =
      feedbackQueue.feedbackItems.map((item) => ({
        key: `sla_${item.key}`,
        label: item.label,
        status: item.status,
        owner: item.owner,
        priority: priorityFor(item.severity),
        ageBucket:
          item.status === 'blocked'
            ? 'over_three_days'
            : item.status === 'needs_review'
              ? 'one_to_three_days'
              : 'same_day',
        expectedResponse:
          item.owner === 'accountant'
            ? 'Respuesta profesional antes de cerrar el decision packet.'
            : 'Resolver accion operativa y dejar evidencia referenciada.',
        evidenceRefs: item.evidenceRefs,
      }));
    const blockers = feedbackQueue.blockers;
    const trackerStatus = resolveStatus(
      slaItems.map((entry) => entry.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      trackerStatus,
      feedbackQueue,
      slaItems,
      summary: {
        itemCount: slaItems.length,
        overdueCount: slaItems.filter(
          (item) => item.ageBucket === 'over_three_days',
        ).length,
        accountantOwnedCount: slaItems.filter(
          (item) => item.owner === 'accountant',
        ).length,
        criticalCount: slaItems.filter((item) => item.priority === 'critical')
          .length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        trackerStatus === 'ready'
          ? 'Mantener SLA de colaboracion sin pendientes criticos.'
          : 'Atender primero items vencidos o de contador antes del closeout 7.1.',
      guardrails: [
        'El SLA tracker organiza colaboracion; no sustituye juicio profesional.',
        'Los vencimientos son operativos y deben validarse contra acuerdos reales de servicio.',
      ],
    };
  }
}

function priorityFor(
  severity: EcuadorTaxAccountantFeedbackIntakeQueueV70View['feedbackItems'][number]['severity'],
): EcuadorTaxReviewPriority {
  if (severity === 'critical') {
    return 'critical';
  }

  return severity === 'high' ? 'high' : 'normal';
}

function resolveStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
