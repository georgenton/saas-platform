import {
  EcuadorTaxPilotLearningBacklogV71View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase } from './get-tenant-ecuador-tax-accountant-collaboration-sla-tracker-v71.use-case';
import { GetTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase } from './get-tenant-ecuador-tax-pilot-feedback-analytics-dashboard-v71.use-case';

export class GetTenantEcuadorTaxPilotLearningBacklogV71UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase: GetTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase,
    private readonly getTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase: GetTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxPilotLearningBacklogV71View> {
    const [analyticsDashboard, slaTracker] = await Promise.all([
      this.getTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase.execute(
        input,
      ),
    ]);
    const learningItems: EcuadorTaxPilotLearningBacklogV71View['learningItems'] =
      [
        ...slaTracker.feedbackQueue.feedbackItems
          .filter((item) => item.severity === 'critical')
          .map((item) => ({
            key: `tax_${item.key}`,
            label: `Hardening tributario: ${item.label}`,
            status: item.status,
            priority: 'critical' as const,
            target: 'tax_compliance' as const,
            sourceRefs: item.evidenceRefs,
            recommendation: item.recommendedAction,
          })),
        ...slaTracker.slaItems
          .filter((item) => item.ageBucket === 'over_three_days')
          .map((item) => ({
            key: `tenant_data_${item.key}`,
            label: `Dato pendiente: ${item.label}`,
            status: item.status,
            priority: item.priority,
            target: 'tenant_data' as const,
            sourceRefs: item.evidenceRefs,
            recommendation:
              'Convertir el pendiente de SLA en tarea de evidencia con responsable.',
          })),
        ...slaTracker.feedbackQueue.feedbackItems
          .filter((item) => item.source === 'pilot_readiness')
          .map((item) => ({
            key: `parties_${item.key}`,
            label: `Parties/fiscal data: ${item.label}`,
            status: item.status,
            priority:
              item.severity === 'critical'
                ? ('critical' as const)
                : ('high' as const),
            target: 'parties' as const,
            sourceRefs: item.evidenceRefs,
            recommendation:
              'Reforzar datos fiscales de terceros antes de repetir piloto.',
          })),
        ...(analyticsDashboard.summary.accountingAdvancedSignalCount > 0
          ? [
              {
                key: 'accounting_advanced_discovery_signal',
                label: 'Accounting Advanced discovery signal',
                status: 'needs_review' as const,
                priority: 'high' as const,
                target: 'accounting_advanced' as const,
                sourceRefs: ['pilot_closeout_decision_packet_v70'],
                recommendation:
                  'Confirmar si la senal contable se repite antes de abrir producto nuevo.',
              },
            ]
          : []),
        {
          key: 'ai_assistant_tax_playbook',
          label: 'AI tax assistant playbook',
          status:
            analyticsDashboard.dashboardStatus === 'blocked'
              ? 'needs_review'
              : 'ready',
          priority: 'normal' as const,
          target: 'ai' as const,
          sourceRefs: ['pilot_feedback_analytics_dashboard_v71'],
          recommendation:
            'Usar feedback del piloto para ajustar explicaciones paso a paso del asistente.',
        },
      ];
    const blockers = [...analyticsDashboard.blockers, ...slaTracker.blockers];
    const backlogStatus = resolveStatus(
      learningItems.map((entry) => entry.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      backlogStatus,
      analyticsDashboard,
      slaTracker,
      learningItems,
      summary: {
        itemCount: learningItems.length,
        taxHardeningCount: learningItems.filter(
          (item) => item.target === 'tax_compliance',
        ).length,
        partiesCount: learningItems.filter((item) => item.target === 'parties')
          .length,
        aiCount: learningItems.filter((item) => item.target === 'ai').length,
        accountingAdvancedCount: learningItems.filter(
          (item) => item.target === 'accounting_advanced',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        backlogStatus === 'blocked'
          ? 'Resolver aprendizajes bloqueantes antes de cerrar operaciones piloto.'
          : 'Priorizar aprendizajes por producto sin abrir Accounting Advanced por defecto.',
      guardrails: [
        'El learning backlog convierte feedback en producto; no declara impuestos.',
        'Accounting Advanced requiere senales repetidas y validacion profesional.',
      ],
    };
  }
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
