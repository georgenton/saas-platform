import { TenantPsychologyClinicPatientTimelineWorkspace } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import {
  findPatient,
  psychologyGuardrails,
} from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicPatientTimelineWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientId: string;
  }): Promise<TenantPsychologyClinicPatientTimelineWorkspace> {
    const patient = await findPatient(
      this.operationsRepository,
      input.tenantSlug,
      input.patientId,
    );
    const [sessions, events] = await Promise.all([
      this.operationsRepository?.listSessions(input.tenantSlug),
      this.operationsRepository?.listEvents(input.tenantSlug),
    ]);
    const patientSessions = (sessions ?? []).filter(
      (session) => session.patientId === input.patientId,
    );
    const patientSessionIds = new Set(
      patientSessions.map((session) => session.id),
    );
    const patientEvents = (events ?? []).filter(
      (event) => event.sessionId && patientSessionIds.has(event.sessionId),
    );
    const timeline: TenantPsychologyClinicPatientTimelineWorkspace['timeline'] =
      [
        ...(patient
          ? [
              {
                id: `intake_${patient.id}`,
                occurredAt: patient.createdAt.toISOString(),
                label: 'Intake psicologico registrado',
                source: 'patient-intake' as const,
                status: patient.therapyConsentStatus,
                evidence: patient.presentingConcern,
              },
            ]
          : []),
        ...patientSessions.map((session) => ({
          id: `session_${session.id}`,
          occurredAt: session.startsAt.toISOString(),
          label: session.serviceName,
          source: 'session' as const,
          status:
            session.status === 'completed'
              ? ('ready' as const)
              : ('needs_review' as const),
          evidence: `${session.therapistName} · ${session.status}`,
        })),
        ...patientEvents.map((event) => ({
          id: `event_${event.id}`,
          occurredAt: event.occurredAt.toISOString(),
          label: event.eventType,
          source: event.eventType.includes('note')
            ? ('session-note' as const)
            : ('treatment-plan' as const),
          status: event.status,
          evidence: event.source,
        })),
      ].sort((left, right) => left.occurredAt.localeCompare(right.occurredAt));
    const blockers = [
      ...(patient?.blockers ?? []),
      ...(patient ? [] : ['Paciente no encontrado.']),
    ];

    return {
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      generatedAt: this.nowProvider(),
      workspaceStatus:
        blockers.length > 0
          ? 'blocked'
          : timeline.length > 0
            ? 'needs_review'
            : 'blocked',
      patient: {
        id: input.patientId,
        displayName: patient?.patientDisplayName ?? 'Paciente no encontrado',
        presentingConcern: patient?.presentingConcern ?? 'Pendiente',
        therapyConsentStatus: patient?.therapyConsentStatus ?? 'blocked',
      },
      timeline,
      summary: {
        eventCount: timeline.length,
        sessionCount: patientSessions.length,
        noteDraftCount: patientEvents.filter((event) =>
          event.eventType.includes('note'),
        ).length,
        bridgeEventCount: patientEvents.filter((event) =>
          event.eventType.includes('bridge'),
        ).length,
      },
      blockers,
      nextStep: 'Revisar continuidad longitudinal antes de hardening EHR.',
      guardrails: psychologyGuardrails(),
    };
  }
}
