import { TenantPsychologyClinicRecordsHardeningWorkspace } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import {
  findPatient,
  psychologyGuardrails,
} from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicRecordsHardeningWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientId: string;
  }): Promise<TenantPsychologyClinicRecordsHardeningWorkspace> {
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
    const noteDraftCount = patientEvents.filter((event) =>
      event.eventType.includes('note_draft'),
    ).length;
    const bridgeEventCount = patientEvents.filter((event) =>
      event.eventType.includes('bridge'),
    ).length;
    const treatmentEventCount = patientEvents.filter((event) =>
      event.eventType.includes('treatment'),
    ).length;
    const recordLayers: TenantPsychologyClinicRecordsHardeningWorkspace['recordLayers'] =
      [
        layer(
          'intake_identity',
          'Intake e identidad',
          patient?.identificationStatus ?? 'blocked',
          patient ? 1 : 0,
          'Validar datos base del paciente.',
        ),
        layer(
          'sessions',
          'Sesiones longitudinales',
          patientSessions.length > 0 ? 'needs_review' : 'blocked',
          patientSessions.length,
          'Revisar continuidad por terapeuta.',
        ),
        layer(
          'note_drafts',
          'Notas draft',
          noteDraftCount > 0 ? 'needs_review' : 'blocked',
          noteDraftCount,
          'Completar review loop de notas.',
        ),
        layer(
          'bridges',
          'Handoffs Growth/Billing',
          bridgeEventCount > 0 ? 'needs_review' : 'blocked',
          bridgeEventCount,
          'Confirmar que los handoffs son evidencia operacional.',
        ),
      ];
    const blockers = [
      ...(patient?.blockers ?? []),
      ...recordLayers
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
          : recordLayers.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      recordLayers,
      continuity: {
        sessionCount: patientSessions.length,
        noteDraftCount,
        treatmentEventCount,
        bridgeEventCount,
      },
      blockers,
      nextStep: 'Endurecer records operativos antes de discovery EHR.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function layer(
  key: string,
  label: string,
  status: TenantPsychologyClinicRecordsHardeningWorkspace['recordLayers'][number]['status'],
  evidenceCount: number,
  nextAction: string,
): TenantPsychologyClinicRecordsHardeningWorkspace['recordLayers'][number] {
  return { key, label, status, evidenceCount, nextAction };
}
