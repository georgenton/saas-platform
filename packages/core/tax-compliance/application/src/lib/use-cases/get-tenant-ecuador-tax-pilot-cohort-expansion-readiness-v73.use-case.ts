import {
  EcuadorTaxPilotCohortExpansionReadinessV73View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantDecisionRecordV73UseCase } from './get-tenant-ecuador-tax-accountant-decision-record-v73.use-case';

export class GetTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase {
  constructor(
    private readonly getTenantEcuadorTaxAccountantDecisionRecordV73UseCase: GetTenantEcuadorTaxAccountantDecisionRecordV73UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxPilotCohortExpansionReadinessV73View> {
    const accountantDecisionRecord =
      await this.getTenantEcuadorTaxAccountantDecisionRecordV73UseCase.execute(
        input,
      );
    const pilotCloseout =
      accountantDecisionRecord.discoveryDossier.periodMemory.pilotCloseout;
    const expansionChecks: EcuadorTaxPilotCohortExpansionReadinessV73View['expansionChecks'] =
      [
        check(
          'pilot_memory',
          'Pilot memory readiness',
          accountantDecisionRecord.discoveryDossier.periodMemory.memoryStatus,
          Math.max(
            0,
            100 -
              accountantDecisionRecord.discoveryDossier.periodMemory.summary
                .repeatedCount *
                15,
          ),
          ['pilot_period_over_period_memory_v73'],
          'Resolver senales repetidas antes de expandir agresivamente.',
        ),
        check(
          'accountant_record',
          'Accountant decision record',
          accountantDecisionRecord.recordStatus,
          accountantDecisionRecord.summary.formalAccountingCount > 0 ? 60 : 90,
          ['accountant_decision_record_v73'],
          'Usar criterio profesional para limitar expansion.',
        ),
        check(
          'pilot_closeout',
          'Pilot closeout 7.2',
          pilotCloseout.closeoutStatus,
          pilotCloseout.recommendedNextProduct === 'tax_compliance_pilot_iteration'
            ? 90
            : 50,
          ['pilot_closeout_v72'],
          'Expandir solo si el closeout 7.2 favorece iteracion piloto.',
        ),
      ];
    const blockers = accountantDecisionRecord.blockers;
    const readinessStatus = resolveStatus(
      expansionChecks.map((entry) => entry.status),
      blockers,
    );
    const averageScore = Math.round(
      expansionChecks.reduce((sum, entry) => sum + entry.score, 0) /
        expansionChecks.length,
    );
    const canExpandCohort =
      readinessStatus === 'ready' &&
      accountantDecisionRecord.summary.formalAccountingCount === 0 &&
      averageScore >= 75;

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      accountantDecisionRecord,
      expansionChecks,
      recommendation: {
        canExpandCohort,
        expansionMode: canExpandCohort
          ? 'expand_assisted_self_service'
          : accountantDecisionRecord.summary.formalAccountingCount > 0
            ? 'hold_current_pilot'
            : 'expand_accountant_in_loop',
        reason: canExpandCohort
          ? 'El piloto tiene memoria, decision record y score suficiente para crecer.'
          : 'La expansion debe esperar o mantenerse con contador por evidencia pendiente.',
      },
      summary: {
        checkCount: expansionChecks.length,
        readyCheckCount: expansionChecks.filter(
          (entry) => entry.status === 'ready',
        ).length,
        blockedCheckCount: expansionChecks.filter(
          (entry) => entry.status === 'blocked',
        ).length,
        averageScore,
      },
      blockers: [...new Set(blockers)],
      nextStep: canExpandCohort
        ? 'Agregar nuevos tenants piloto con monitoreo 7.3.'
        : 'Mantener cohorte actual hasta resolver criterios pendientes.',
      guardrails: [
        'Expansion readiness protege capacidad operativa y contador.',
        'No se deben mezclar datos fiscales entre tenants al comparar cohortes.',
      ],
    };
  }
}

function check(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  score: number,
  evidenceRefs: string[],
  recommendation: string,
): EcuadorTaxPilotCohortExpansionReadinessV73View['expansionChecks'][number] {
  return { key, label, status, score, evidenceRefs, recommendation };
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
