import {
  EcuadorTaxPilotOperationsCloseoutV71View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase } from './get-tenant-ecuador-tax-accountant-collaboration-sla-tracker-v71.use-case';
import { GetTenantEcuadorTaxAccountingAdvancedEvidenceGateV71UseCase } from './get-tenant-ecuador-tax-accounting-advanced-evidence-gate-v71.use-case';
import { GetTenantEcuadorTaxPilotCohortRegistryV71UseCase } from './get-tenant-ecuador-tax-pilot-cohort-registry-v71.use-case';
import { GetTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase } from './get-tenant-ecuador-tax-pilot-feedback-analytics-dashboard-v71.use-case';
import { GetTenantEcuadorTaxPilotLearningBacklogV71UseCase } from './get-tenant-ecuador-tax-pilot-learning-backlog-v71.use-case';

export class RequestTenantEcuadorTaxPilotOperationsCloseoutV71UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPilotCohortRegistryV71UseCase: GetTenantEcuadorTaxPilotCohortRegistryV71UseCase,
    private readonly getTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase: GetTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase,
    private readonly getTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase: GetTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase,
    private readonly getTenantEcuadorTaxPilotLearningBacklogV71UseCase: GetTenantEcuadorTaxPilotLearningBacklogV71UseCase,
    private readonly getTenantEcuadorTaxAccountingAdvancedEvidenceGateV71UseCase: GetTenantEcuadorTaxAccountingAdvancedEvidenceGateV71UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxPilotOperationsCloseoutV71View> {
    const [
      cohortRegistry,
      analyticsDashboard,
      slaTracker,
      learningBacklog,
      accountingAdvancedGate,
    ] = await Promise.all([
      this.getTenantEcuadorTaxPilotCohortRegistryV71UseCase.execute(input),
      this.getTenantEcuadorTaxPilotFeedbackAnalyticsDashboardV71UseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxAccountantCollaborationSlaTrackerV71UseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxPilotLearningBacklogV71UseCase.execute(input),
      this.getTenantEcuadorTaxAccountingAdvancedEvidenceGateV71UseCase.execute(
        input,
      ),
    ]);
    const closeoutChecklist: EcuadorTaxPilotOperationsCloseoutV71View['closeoutChecklist'] =
      [
        check('cohort_registry', 'Pilot cohort registry', cohortRegistry.registryStatus, [
          'pilot_cohort_registry_v71',
        ]),
        check(
          'feedback_analytics',
          'Pilot feedback analytics',
          analyticsDashboard.dashboardStatus,
          ['pilot_feedback_analytics_dashboard_v71'],
        ),
        check(
          'accountant_sla',
          'Accountant collaboration SLA',
          slaTracker.trackerStatus,
          ['accountant_collaboration_sla_tracker_v71'],
        ),
        check('learning_backlog', 'Pilot learning backlog', learningBacklog.backlogStatus, [
          'pilot_learning_backlog_v71',
        ]),
        check(
          'accounting_advanced_gate',
          'Accounting Advanced evidence gate',
          accountingAdvancedGate.gateStatus,
          ['accounting_advanced_evidence_gate_v71'],
        ),
      ];
    const blockers = [
      ...cohortRegistry.blockers,
      ...analyticsDashboard.blockers,
      ...slaTracker.blockers,
      ...learningBacklog.blockers,
      ...accountingAdvancedGate.blockers,
    ];
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((entry) => entry.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      cohortRegistry,
      analyticsDashboard,
      slaTracker,
      learningBacklog,
      accountingAdvancedGate,
      closeoutChecklist,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter(
          (entry) => entry.status === 'ready',
        ).length,
        blockerCount: new Set(blockers).size,
        learningItemCount: learningBacklog.summary.itemCount,
        overdueSlaCount: slaTracker.summary.overdueCount,
      },
      recommendedNextProduct:
        accountingAdvancedGate.recommendation.openAdvancedAccountingNow
          ? 'accounting_advanced_discovery'
          : closeoutStatus === 'blocked'
            ? 'tax_compliance_hardening'
            : 'tax_compliance_pilot_iteration',
      blockers: [...new Set(blockers)],
      nextStep:
        closeoutStatus === 'blocked'
          ? 'Cerrar blockers operativos antes de ampliar piloto.'
          : 'Continuar iteracion piloto con aprendizajes priorizados y gate contable vigente.',
      guardrails: [
        'Closeout 7.1 cierra operaciones piloto; no presenta declaraciones oficiales.',
        'La decision de Accounting Advanced exige gate, evidencia repetida y contador externo.',
      ],
    };
  }
}

function check(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  evidenceRefs: string[],
): EcuadorTaxPilotOperationsCloseoutV71View['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
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
