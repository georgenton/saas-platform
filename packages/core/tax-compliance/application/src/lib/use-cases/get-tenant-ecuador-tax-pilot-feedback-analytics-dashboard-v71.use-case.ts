import {
  EcuadorTaxPilotFeedbackAnalyticsDashboardV71View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPilotCohortRegistryV71UseCase } from './get-tenant-ecuador-tax-pilot-cohort-registry-v71.use-case';

export class GetTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPilotCohortRegistryV71UseCase: GetTenantEcuadorTaxPilotCohortRegistryV71UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxPilotFeedbackAnalyticsDashboardV71View> {
    const cohortRegistry =
      await this.getTenantEcuadorTaxPilotCohortRegistryV71UseCase.execute(
        input,
      );
    const feedbackSummary = cohortRegistry.pilotCloseout.feedbackQueue.summary;
    const correctionSummary =
      cohortRegistry.pilotCloseout.correctionWorkbench.summary;
    const accountingAdvancedSignalCount =
      cohortRegistry.pilotCloseout.decisionPacket.decision.openAdvancedAccountingNow
        ? 1
        : 0;
    const metrics: EcuadorTaxPilotFeedbackAnalyticsDashboardV71View['metrics'] =
      [
        metric(
          'feedback_items',
          'Feedback items',
          feedbackSummary.feedbackCount,
          cohortRegistry.pilotCloseout.feedbackQueue.queueStatus,
        ),
        metric(
          'critical_feedback',
          'Critical feedback',
          feedbackSummary.criticalCount,
          feedbackSummary.criticalCount > 0 ? 'needs_review' : 'ready',
        ),
        metric(
          'correction_actions',
          'Correction actions',
          correctionSummary.actionCount,
          cohortRegistry.pilotCloseout.correctionWorkbench.workbenchStatus,
        ),
        metric(
          'blocked_tenants',
          'Blocked tenants',
          cohortRegistry.summary.blockedCount,
          cohortRegistry.summary.blockedCount > 0 ? 'blocked' : 'ready',
        ),
        metric(
          'accounting_advanced_signals',
          'Accounting Advanced signals',
          accountingAdvancedSignalCount,
          accountingAdvancedSignalCount > 0 ? 'needs_review' : 'ready',
        ),
      ];
    const blockers = cohortRegistry.blockers;
    const dashboardStatus = resolveStatus(
      metrics.map((entry) => entry.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      dashboardStatus,
      cohortRegistry,
      metrics,
      summary: {
        feedbackCount: feedbackSummary.feedbackCount,
        criticalFeedbackCount: feedbackSummary.criticalCount,
        correctionActionCount: correctionSummary.actionCount,
        blockedTenantCount: cohortRegistry.summary.blockedCount,
        accountingAdvancedSignalCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        dashboardStatus === 'ready'
          ? 'Usar metricas del piloto para priorizar la siguiente iteracion.'
          : 'Atender metricas en needs review o blocked antes de ampliar alcance.',
      guardrails: [
        'Analytics 7.1 mide operacion piloto; no decide obligaciones tributarias.',
        'Las senales de Accounting Advanced son indicios, no apertura automatica.',
      ],
    };
  }
}

function metric(
  key: string,
  label: string,
  value: number,
  status: EcuadorTaxReadinessStatus,
): EcuadorTaxPilotFeedbackAnalyticsDashboardV71View['metrics'][number] {
  return {
    key,
    label,
    value,
    status,
    trend: status === 'ready' ? 'improving' : 'needs_attention',
  };
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
