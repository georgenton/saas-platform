import { TenantPsychologyClinicOutcomesReviewWorkspace } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import {
  findPatient,
  psychologyGuardrails,
} from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicOutcomesReviewWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientId: string;
  }): Promise<TenantPsychologyClinicOutcomesReviewWorkspace> {
    const [patient, sessions, events] = await Promise.all([
      findPatient(this.operationsRepository, input.tenantSlug, input.patientId),
      this.operationsRepository?.listSessions(input.tenantSlug),
      this.operationsRepository?.listEvents(input.tenantSlug),
    ]);
    const patientSessions = (sessions ?? []).filter(
      (session) => session.patientId === input.patientId,
    );
    const sessionIds = new Set(patientSessions.map((session) => session.id));
    const patientEvents = (events ?? []).filter(
      (event) => event.sessionId && sessionIds.has(event.sessionId),
    );
    const completedSessionCount = patientSessions.filter(
      (session) => session.status === 'completed',
    ).length;
    const noteDraftCount = patientEvents.filter((event) =>
      event.eventType.includes('note_draft'),
    ).length;
    const outcomeSignals: TenantPsychologyClinicOutcomesReviewWorkspace['outcomeSignals'] =
      [
        signal(
          'session_continuity',
          'Continuidad de sesiones',
          patientSessions.length > 1 ? 'needs_review' : 'blocked',
          `${patientSessions.length} patient sessions`,
        ),
        signal(
          'completed_sessions',
          'Sesiones completadas',
          completedSessionCount > 0 ? 'needs_review' : 'blocked',
          `${completedSessionCount} completed sessions`,
        ),
        signal(
          'reviewed_notes',
          'Notas para revision de evolucion',
          noteDraftCount > 0 ? 'needs_review' : 'blocked',
          `${noteDraftCount} note drafts`,
        ),
        signal(
          'patient_goal_review',
          'Revision manual de objetivos',
          patient ? 'needs_review' : 'blocked',
          patient?.presentingConcern ?? 'patient not found',
        ),
      ];
    const blockers = [
      ...(patient?.blockers ?? []),
      ...outcomeSignals
        .filter((item) => item.status === 'blocked')
        .map((item) => item.label),
    ];

    return {
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      generatedAt: this.nowProvider(),
      workspaceStatus:
        blockers.length > 0
          ? 'blocked'
          : outcomeSignals.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      patient: {
        id: patient?.id ?? input.patientId,
        displayName: patient?.patientDisplayName ?? 'Paciente no encontrado',
        presentingConcern: patient?.presentingConcern ?? 'Sin motivo registrado',
      },
      outcomeSignals,
      summary: {
        sessionCount: patientSessions.length,
        completedSessionCount,
        reviewedSignalCount: outcomeSignals.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedSignalCount: outcomeSignals.filter(
          (item) => item.status === 'blocked',
        ).length,
      },
      blockers,
      nextStep: 'Convertir progreso en resumen revisado por terapeuta.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function signal(
  key: string,
  label: string,
  status: TenantPsychologyClinicOutcomesReviewWorkspace['outcomeSignals'][number]['status'],
  evidence: string,
): TenantPsychologyClinicOutcomesReviewWorkspace['outcomeSignals'][number] {
  return { key, label, status, evidence, requiresTherapistReview: true };
}
