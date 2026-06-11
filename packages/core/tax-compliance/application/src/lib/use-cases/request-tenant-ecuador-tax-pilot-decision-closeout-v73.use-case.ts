import {
  EcuadorTaxPilotDecisionCloseoutV73View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantDecisionRecordV73UseCase } from './get-tenant-ecuador-tax-accountant-decision-record-v73.use-case';
import { GetTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase } from './get-tenant-ecuador-tax-accounting-advanced-discovery-dossier-v73.use-case';
import { GetTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase } from './get-tenant-ecuador-tax-pilot-cohort-expansion-readiness-v73.use-case';
import { GetTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase } from './get-tenant-ecuador-tax-pilot-period-over-period-memory-v73.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxAiPilotDecisionExplainerV73UseCase } from './request-tenant-ecuador-tax-ai-pilot-decision-explainer-v73.use-case';

export class RequestTenantEcuadorTaxPilotDecisionCloseoutV73UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase: GetTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase,
    private readonly getTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase: GetTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase,
    private readonly getTenantEcuadorTaxAccountantDecisionRecordV73UseCase: GetTenantEcuadorTaxAccountantDecisionRecordV73UseCase,
    private readonly getTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase: GetTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase,
    private readonly requestTenantEcuadorTaxAiPilotDecisionExplainerV73UseCase: RequestTenantEcuadorTaxAiPilotDecisionExplainerV73UseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxPilotDecisionCloseoutV73View> {
    const [
      periodMemory,
      discoveryDossier,
      accountantDecisionRecord,
      expansionReadiness,
      aiDecisionExplainer,
    ] = await Promise.all([
      this.getTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxAccountantDecisionRecordV73UseCase.execute(input),
      this.getTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase.execute(
        input,
      ),
      this.requestTenantEcuadorTaxAiPilotDecisionExplainerV73UseCase.execute(
        input,
      ),
    ]);
    const closeoutChecklist: EcuadorTaxPilotDecisionCloseoutV73View['closeoutChecklist'] =
      [
        check('period_memory', 'Period-over-period memory', periodMemory.memoryStatus, [
          'pilot_period_over_period_memory_v73',
        ]),
        check('discovery_dossier', 'Accounting discovery dossier', discoveryDossier.dossierStatus, [
          'accounting_advanced_discovery_dossier_v73',
        ]),
        check('accountant_record', 'Accountant decision record', accountantDecisionRecord.recordStatus, [
          'accountant_decision_record_v73',
        ]),
        check('cohort_expansion', 'Cohort expansion readiness', expansionReadiness.readinessStatus, [
          'pilot_cohort_expansion_readiness_v73',
        ]),
        check('ai_explainer', 'AI pilot decision explainer', aiDecisionExplainer.explainerStatus, [
          'ai_pilot_decision_explainer_v73',
        ]),
      ];
    const blockers = [
      ...periodMemory.blockers,
      ...discoveryDossier.blockers,
      ...accountantDecisionRecord.blockers,
      ...expansionReadiness.blockers,
      ...aiDecisionExplainer.blockers,
    ];
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((entry) => entry.status),
      blockers,
    );
    const finalDecision =
      accountantDecisionRecord.summary.formalAccountingCount > 0 &&
      discoveryDossier.recommendation.shouldPrepareDiscovery
        ? 'prepare_accounting_advanced_discovery'
        : closeoutStatus === 'blocked'
          ? 'return_to_tax_hardening'
          : 'continue_tax_pilot';
    const recordedEvent =
      input.recordEvent === false
        ? null
        : await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
            tenantSlug: input.tenantSlug,
            period: input.period,
            year: input.year,
            eventType: 'tax_pilot_decision_closeout_v73_requested',
            source: 'tax_pilot_decision_closeout_v73',
            payload: {
              closeoutStatus,
              finalDecision,
              checklist: closeoutChecklist,
            },
          });

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      periodMemory,
      discoveryDossier,
      accountantDecisionRecord,
      expansionReadiness,
      aiDecisionExplainer,
      closeoutChecklist,
      finalDecision,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter(
          (entry) => entry.status === 'ready',
        ).length,
        blockerCount: new Set(blockers).size,
        repeatedSignalCount: periodMemory.summary.repeatedCount,
        formalAccountingDecisionCount:
          accountantDecisionRecord.summary.formalAccountingCount,
        explainerCardCount: aiDecisionExplainer.summary.cardCount,
      },
      recordedEventId: recordedEvent?.id ?? null,
      blockers: [...new Set(blockers)],
      nextStep:
        finalDecision === 'prepare_accounting_advanced_discovery'
          ? 'Preparar discovery Accounting Advanced con dossier y decision record.'
          : finalDecision === 'return_to_tax_hardening'
            ? 'Volver a hardening tributario antes de decidir expansion.'
            : 'Continuar piloto Tax Compliance con decision explicada.',
      guardrails: [
        'Closeout 7.3 decide direccion del piloto; no abre producto ni declara impuestos.',
        'Accounting Advanced solo pasa a discovery con dossier y criterio profesional.',
      ],
    };
  }
}

function check(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  evidenceRefs: string[],
): EcuadorTaxPilotDecisionCloseoutV73View['closeoutChecklist'][number] {
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
