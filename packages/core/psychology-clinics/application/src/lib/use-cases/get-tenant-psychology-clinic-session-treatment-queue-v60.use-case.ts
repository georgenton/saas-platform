import {
  PsychologyClinicReadinessStatus,
  TenantPsychologyClinicSessionRecord,
  TenantPsychologyClinicSessionTreatmentQueueV60,
} from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicSessionTreatmentQueueV60UseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicSessionTreatmentQueueV60> {
    const [sessions, events] = await Promise.all([
      this.operationsRepository?.listSessions(input.tenantSlug),
      this.operationsRepository?.listEvents(input.tenantSlug),
    ]);
    const sessionRows = (sessions ?? []).map((session) => {
      const noteEvents =
        events?.filter(
          (event) =>
            event.sessionId === session.id && event.eventType.includes('note'),
        ) ?? [];
      const therapistReviewStatus: PsychologyClinicReadinessStatus = noteEvents.some(
        (event) => event.status === 'blocked',
      )
        ? 'blocked'
        : session.status === 'completed'
          ? 'needs_review'
          : 'ready';
      const treatmentPlanStatus: PsychologyClinicReadinessStatus =
        session.status === 'completed' ? 'needs_review' : 'ready';

      return {
        id: session.id,
        patientDisplayName: session.patientDisplayName,
        serviceName: session.serviceName,
        therapistName: session.therapistName,
        status: session.status,
        reminderStatus: session.reminderStatus,
        billingStatus: session.billingStatus,
        treatmentPlanStatus,
        therapistReviewStatus,
        nextAction: nextActionFor(session, therapistReviewStatus),
      };
    });
    const blockers = (sessions ?? []).flatMap((session) => session.blockers);
    const statuses = sessionRows.flatMap((session) => [
      session.reminderStatus,
      session.billingStatus,
      session.treatmentPlanStatus,
      session.therapistReviewStatus,
    ]);
    const queueStatus = resolveStatus(statuses, blockers, sessionRows.length);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      queueStatus,
      sessions: sessionRows,
      summary: {
        sessionCount: sessionRows.length,
        reminderReviewCount: sessionRows.filter(
          (session) => session.reminderStatus !== 'ready',
        ).length,
        billingReviewCount: sessionRows.filter(
          (session) => session.billingStatus !== 'ready',
        ).length,
        treatmentReviewCount: sessionRows.filter(
          (session) => session.treatmentPlanStatus !== 'ready',
        ).length,
        therapistReviewCount: sessionRows.filter(
          (session) => session.therapistReviewStatus !== 'ready',
        ).length,
      },
      blockers:
        sessionRows.length === 0
          ? ['No hay sesiones para operar treatment queue.']
          : blockers,
      nextStep:
        queueStatus === 'ready'
          ? 'Sesiones listas para operacion con seguimiento revisado.'
          : 'Resolver recordatorios, billing, treatment plan y revision terapeutica.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function nextActionFor(
  session: TenantPsychologyClinicSessionRecord,
  therapistReviewStatus: PsychologyClinicReadinessStatus,
): string {
  if (session.reminderStatus !== 'ready') {
    return 'Revisar recordatorio antes de enviar handoff a Growth.';
  }

  if (session.billingStatus !== 'ready') {
    return 'Completar readiness de billing antes del cierre operativo.';
  }

  if (therapistReviewStatus !== 'ready') {
    return 'Completar revision terapeutica del draft y seguimiento.';
  }

  return 'Mantener sesion en monitoreo operativo.';
}

function resolveStatus(
  statuses: PsychologyClinicReadinessStatus[],
  blockers: string[],
  sessionCount: number,
): PsychologyClinicReadinessStatus {
  if (sessionCount === 0 || blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
