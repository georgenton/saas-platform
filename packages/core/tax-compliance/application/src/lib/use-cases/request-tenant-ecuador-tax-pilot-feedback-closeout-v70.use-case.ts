import {
  EcuadorTaxPilotFeedbackCloseoutV70View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase } from './get-tenant-ecuador-tax-accountant-feedback-intake-queue-v70.use-case';
import { GetTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase } from './get-tenant-ecuador-tax-evidence-correction-workbench-v70.use-case';
import { GetTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase } from './get-tenant-ecuador-tax-pilot-tenant-readiness-room-v70.use-case';
import { RequestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase } from './request-tenant-ecuador-tax-pilot-closeout-decision-packet-v70.use-case';

export class RequestTenantEcuadorTaxPilotFeedbackCloseoutV70UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase: GetTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase,
    private readonly getTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase: GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase,
    private readonly getTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase: GetTenantEcuadorTaxEvidenceCorrectionWorkbenchV70UseCase,
    private readonly requestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase: RequestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxPilotFeedbackCloseoutV70View> {
    const [readinessRoom, feedbackQueue, correctionWorkbench, decisionPacket] =
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
        this.requestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase.execute(
          input,
        ),
      ]);
    const closeoutChecklist: EcuadorTaxPilotFeedbackCloseoutV70View['closeoutChecklist'] =
      [
        check('pilot_readiness', 'Pilot tenant readiness', readinessRoom.readinessStatus, [
          'pilot_tenant_readiness_room_v70',
        ]),
        check(
          'accountant_feedback',
          'Accountant feedback intake',
          feedbackQueue.queueStatus,
          ['accountant_feedback_intake_queue_v70'],
        ),
        check(
          'evidence_corrections',
          'Evidence correction workbench',
          correctionWorkbench.workbenchStatus,
          ['evidence_correction_workbench_v70'],
        ),
        check(
          'decision_packet',
          'Pilot closeout decision packet',
          decisionPacket.packetStatus,
          ['pilot_closeout_decision_packet_v70'],
        ),
      ];
    const blockers = [
      ...readinessRoom.blockers,
      ...feedbackQueue.blockers,
      ...correctionWorkbench.blockers,
      ...decisionPacket.blockers,
    ];
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((entry) => entry.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      readinessRoom,
      feedbackQueue,
      correctionWorkbench,
      decisionPacket,
      closeoutChecklist,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter(
          (entry) => entry.status === 'ready',
        ).length,
        blockerCount: new Set(blockers).size,
        feedbackCount: feedbackQueue.summary.feedbackCount,
        correctionActionCount: correctionWorkbench.summary.actionCount,
      },
      recommendedNextProduct:
        decisionPacket.decision.openAdvancedAccountingNow
          ? 'accounting_advanced_discovery'
          : closeoutStatus === 'blocked'
            ? 'tax_compliance_hardening'
            : 'tax_compliance_pilot_iteration',
      blockers: [...new Set(blockers)],
      nextStep:
        closeoutStatus === 'blocked'
          ? 'Reabrir hardening con feedback del piloto.'
          : 'Continuar iteracion piloto con contador y evidencia trazable.',
      guardrails: [
        'Closeout 7.0 resume feedback piloto; no reemplaza declaracion oficial ni contador.',
        'Solo recomienda Accounting Advanced cuando la evidencia del piloto lo exige.',
      ],
    };
  }
}

function check(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  evidenceRefs: string[],
): EcuadorTaxPilotFeedbackCloseoutV70View['closeoutChecklist'][number] {
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
