import {
  EcuadorTaxPilotCloseoutDecisionPacketV70View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase } from './get-tenant-ecuador-tax-accountant-feedback-intake-queue-v70.use-case';
import { GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase } from './get-tenant-ecuador-tax-accounting-advanced-gate-v2.use-case';
import { GetTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase } from './get-tenant-ecuador-tax-evidence-correction-workbench-v70.use-case';
import { GetTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase } from './get-tenant-ecuador-tax-pilot-tenant-readiness-room-v70.use-case';

export class RequestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase: GetTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase,
    private readonly getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase: GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
    private readonly getTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase: GetTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase,
    private readonly getTenantEcuadorTaxAccountingAdvancedGateV2UseCase: GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxPilotCloseoutDecisionPacketV70View> {
    const [readinessRoom, feedbackQueue, correctionWorkbench, accountingGate] =
      await Promise.all([
        this.getTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase.execute(
          input,
        ),
        this.getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase.execute(
          input,
        ),
        this.getTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase.execute(
          input,
        ),
        this.getTenantEcuadorTaxAccountingAdvancedGateV2UseCase.execute(input),
      ]);
    const decisionLanes: EcuadorTaxPilotCloseoutDecisionPacketV70View['decisionLanes'] =
      [
        lane(
          'pilot_readiness',
          'Pilot readiness',
          readinessRoom.readinessStatus,
          readinessRoom.pilotDecision.requiresAccountant
            ? 'accountant'
            : 'operator',
          ['pilot_tenant_readiness_room_v70'],
          readinessRoom.nextStep,
        ),
        lane(
          'accountant_feedback',
          'Accountant feedback',
          feedbackQueue.queueStatus,
          feedbackQueue.summary.accountantOwnedCount > 0
            ? 'accountant'
            : 'operator',
          feedbackQueue.feedbackItems.map((item) => item.key),
          feedbackQueue.nextStep,
        ),
        lane(
          'evidence_corrections',
          'Evidence corrections',
          correctionWorkbench.workbenchStatus,
          correctionWorkbench.summary.accountantActionCount > 0
            ? 'accountant'
            : 'tax_compliance',
          correctionWorkbench.correctionActions.map((action) => action.key),
          correctionWorkbench.nextStep,
        ),
        lane(
          'accounting_advanced_gate',
          'Accounting Advanced gate',
          accountingGate.gateStatus,
          accountingGate.recommendation.openAdvancedAccountingNow
            ? 'accounting_advanced'
            : 'tax_compliance',
          accountingGate.decisionSignals.map((signal) => signal.key),
          accountingGate.nextStep,
        ),
      ];
    const blockers = [
      ...readinessRoom.blockers,
      ...feedbackQueue.blockers,
      ...correctionWorkbench.blockers,
      ...accountingGate.blockers,
    ];
    const packetStatus = resolveStatus(
      decisionLanes.map((entry) => entry.status),
      blockers,
    );
    const accountantRequired =
      readinessRoom.pilotDecision.requiresAccountant ||
      feedbackQueue.summary.accountantOwnedCount > 0 ||
      correctionWorkbench.summary.accountantActionCount > 0;
    const openAdvancedAccountingNow =
      accountingGate.recommendation.openAdvancedAccountingNow &&
      feedbackQueue.summary.criticalCount > 0;

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packetStatus,
      readinessRoom,
      feedbackQueue,
      correctionWorkbench,
      decisionLanes,
      decision: {
        nextStep:
          packetStatus === 'blocked'
            ? 'return_to_tax_hardening'
            : openAdvancedAccountingNow
              ? 'open_accounting_advanced_discovery'
              : accountantRequired
                ? 'continue_with_external_accountant'
                : 'continue_assisted_self_service',
        reason:
          packetStatus === 'blocked'
            ? 'El piloto mantiene blockers que deben volver a hardening.'
            : openAdvancedAccountingNow
              ? 'La presion profesional y de evidencia justifica discovery contable avanzado.'
              : accountantRequired
                ? 'El piloto puede continuar con contador externo en el loop.'
                : 'El piloto puede continuar como self-service asistido.',
        accountantRequired,
        openAdvancedAccountingNow,
      },
      summary: {
        laneCount: decisionLanes.length,
        readyLaneCount: decisionLanes.filter(
          (entry) => entry.status === 'ready',
        ).length,
        needsReviewLaneCount: decisionLanes.filter(
          (entry) => entry.status === 'needs_review',
        ).length,
        blockedLaneCount: decisionLanes.filter(
          (entry) => entry.status === 'blocked',
        ).length,
        blockerCount: new Set(blockers).size,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        packetStatus === 'blocked'
          ? 'Volver a hardening con las correcciones del piloto.'
          : 'Ejecutar la decision del piloto manteniendo controles profesionales.',
      guardrails: [
        'Decision packet decide direccion de producto; no declara ni certifica impuestos.',
        'Accounting Advanced se abre solo si el gate y el feedback critico lo justifican.',
      ],
    };
  }
}

function lane(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  owner: EcuadorTaxPilotCloseoutDecisionPacketV70View['decisionLanes'][number]['owner'],
  evidenceRefs: string[],
  action: string,
): EcuadorTaxPilotCloseoutDecisionPacketV70View['decisionLanes'][number] {
  return { key, label, status, owner, evidenceRefs, action };
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
