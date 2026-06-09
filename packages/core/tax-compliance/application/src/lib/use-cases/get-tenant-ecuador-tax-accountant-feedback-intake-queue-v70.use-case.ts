import {
  EcuadorTaxAccountantFeedbackIntakeQueueV70View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase } from './get-tenant-ecuador-tax-form-box-evidence-binder-v2.use-case';
import { GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase } from './get-tenant-ecuador-tax-sri-reconciliation-exception-queue-v62.use-case';
import { RequestTenantEcuadorTaxAccountantPacketExportV62UseCase } from './request-tenant-ecuador-tax-accountant-packet-export-v62.use-case';
import { GetTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase } from './get-tenant-ecuador-tax-pilot-tenant-readiness-room-v70.use-case';

export class GetTenantEcuadorTaxAccountantFeedbackIntakeQueueV70UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase: GetTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase,
    private readonly requestTenantEcuadorTaxAccountantPacketExportV62UseCase: RequestTenantEcuadorTaxAccountantPacketExportV62UseCase,
    private readonly getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase: GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
    private readonly getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase: GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountantFeedbackIntakeQueueV70View> {
    const [readinessRoom, accountantPacket, formBinder, exceptionQueue] =
      await Promise.all([
        this.getTenantEcuadorTaxPilotTenantReadinessRoomV70UseCase.execute(
          input,
        ),
        this.requestTenantEcuadorTaxAccountantPacketExportV62UseCase.execute(
          input,
        ),
        this.getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase.execute(input),
        this.getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase.execute(
          input,
        ),
      ]);
    const feedbackItems: EcuadorTaxAccountantFeedbackIntakeQueueV70View['feedbackItems'] =
      [
        ...accountantPacket.packetSections
          .filter(
            (section) =>
              section.questions.length > 0 || section.status !== 'ready',
          )
          .map((section) =>
            feedback(
              `packet_${section.key}`,
              section.label,
              'accountant_packet',
              section.status,
              section.owner,
              section.status === 'blocked' ? 'critical' : 'high',
              section.evidenceRefs,
              section.questions[0] ?? 'Confirmar criterio del contador.',
              'Responder pregunta del packet antes de cerrar piloto.',
            ),
          ),
        ...formBinder.boxEvidenceContracts
          .filter((box) => box.reviewRequired || box.confidence !== 'high')
          .map((box) =>
            feedback(
              `box_${box.boxKey}`,
              box.label,
              'form_binder',
              box.readinessStatus,
              box.accountantQuestion ? 'accountant' : 'tax_compliance',
              box.confidence === 'low' ? 'high' : 'medium',
              [...box.evidenceRefs, ...box.exceptionRefs],
              box.accountantQuestion,
              box.copyGuidance,
            ),
          ),
        ...exceptionQueue.exceptions
          .filter((exception) => exception.status !== 'ready')
          .map((exception) =>
            feedback(
              `exception_${exception.key}`,
              exception.label,
              'reconciliation_exception',
              exception.status,
              exception.owner,
              exception.severity,
              exception.evidenceRefs,
              'Resolver diferencia SRI/plataforma observada por el piloto.',
              exception.recommendedAction,
            ),
          ),
        ...readinessRoom.readinessSections
          .filter((section) => section.status === 'blocked')
          .map((section) =>
            feedback(
              `readiness_${section.key}`,
              section.label,
              'pilot_readiness',
              section.status,
              section.owner,
              'critical',
              section.evidenceRefs,
              'El tenant no puede iniciar piloto con este bloqueo.',
              section.nextAction,
            ),
          ),
      ];
    const blockers = [
      ...accountantPacket.blockers,
      ...formBinder.blockers,
      ...exceptionQueue.blockers,
      ...readinessRoom.blockers,
    ];
    const queueStatus = resolveStatus(
      feedbackItems.map((entry) => entry.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      queueStatus,
      feedbackItems,
      summary: {
        feedbackCount: feedbackItems.length,
        criticalCount: feedbackItems.filter(
          (entry) => entry.severity === 'critical',
        ).length,
        accountantOwnedCount: feedbackItems.filter(
          (entry) => entry.owner === 'accountant',
        ).length,
        operatorOwnedCount: feedbackItems.filter(
          (entry) => entry.owner === 'operator',
        ).length,
        blockedCount: feedbackItems.filter((entry) => entry.status === 'blocked')
          .length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        queueStatus === 'ready'
          ? 'No hay feedback bloqueante del contador para este piloto.'
          : 'Resolver feedback critico o de contador antes del decision packet.',
      guardrails: [
        'La cola registra feedback; no modifica declaraciones ni evidencia automaticamente.',
        'Las respuestas profesionales se mantienen como decisiones humanas trazables.',
      ],
    };
  }
}

function feedback(
  key: string,
  label: string,
  source: EcuadorTaxAccountantFeedbackIntakeQueueV70View['feedbackItems'][number]['source'],
  status: EcuadorTaxReadinessStatus,
  owner: EcuadorTaxAccountantFeedbackIntakeQueueV70View['feedbackItems'][number]['owner'],
  severity: EcuadorTaxAccountantFeedbackIntakeQueueV70View['feedbackItems'][number]['severity'],
  evidenceRefs: string[],
  question: string,
  recommendedAction: string,
): EcuadorTaxAccountantFeedbackIntakeQueueV70View['feedbackItems'][number] {
  return {
    key,
    label,
    source,
    severity,
    status,
    owner,
    evidenceRefs,
    question,
    recommendedAction,
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
