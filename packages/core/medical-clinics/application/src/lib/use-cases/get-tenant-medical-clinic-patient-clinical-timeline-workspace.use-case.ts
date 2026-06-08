import {
  MedicalClinicReadinessStatus,
  TenantMedicalClinicPatientClinicalTimelineWorkspace,
} from '@saas-platform/medical-clinics-domain';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';
import {
  defaultPatient,
  findAppointmentsForPatient,
  findPatient,
  listPatientEvents,
  recordsGuardrails,
} from './medical-clinic-records.helpers';

export class GetTenantMedicalClinicPatientClinicalTimelineWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientId: string;
  }): Promise<TenantMedicalClinicPatientClinicalTimelineWorkspace> {
    const patient =
      (await findPatient(
        this.operationsRepository,
        input.tenantSlug,
        input.patientId,
      )) ?? defaultPatient(input.tenantSlug, input.patientId);
    const appointments = await findAppointmentsForPatient(
      this.operationsRepository,
      input.tenantSlug,
      input.patientId,
    );
    const events = await listPatientEvents(
      this.operationsRepository,
      input.tenantSlug,
      input.patientId,
      appointments,
    );
    const appointmentItems = appointments.map((appointment) => ({
      key: `appointment:${appointment.id}`,
      occurredAt: appointment.startsAt.toISOString(),
      source: 'appointment' as const,
      label: `${appointment.serviceName} con ${appointment.professionalName}`,
      status: (appointment.status === 'completed'
        ? 'ready'
        : 'needs_review') as MedicalClinicReadinessStatus,
      evidence: appointment.status,
    }));
    const eventItems = events.map((event) => ({
      key: `event:${event.id}`,
      occurredAt: event.occurredAt.toISOString(),
      source:
        event.eventType.includes('bridge') ||
        event.eventType.includes('handoff')
          ? ('handoff' as const)
          : ('clinical_event' as const),
      label: event.eventType,
      status: event.status,
      evidence: event.source,
    }));
    const timeline = [...appointmentItems, ...eventItems].sort((a, b) =>
      a.occurredAt.localeCompare(b.occurredAt),
    );
    const needsReviewCount = timeline.filter(
      (item) => item.status !== 'ready',
    ).length;
    const blockers = [
      ...patient.blockers,
      ...(patient.consentStatus === 'ready'
        ? []
        : ['Consentimiento del paciente pendiente o bloqueado.']),
    ];

    return {
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      generatedAt: this.nowProvider(),
      workspaceStatus: resolveStatus(blockers, needsReviewCount),
      patient: {
        id: patient.id,
        displayName: patient.patientDisplayName,
        identificationStatus: patient.identificationStatus,
        consentStatus: patient.consentStatus,
      },
      timeline,
      summary: {
        appointmentCount: appointments.length,
        clinicalEventCount: events.length,
        needsReviewCount,
      },
      blockers,
      nextStep:
        blockers.length > 0
          ? 'Resolver identidad/consentimiento antes de usar timeline clinico.'
          : 'Revisar eventos pendientes y preparar history/evidence records.',
      guardrails: recordsGuardrails(),
    };
  }
}

function resolveStatus(
  blockers: string[],
  needsReviewCount: number,
): MedicalClinicReadinessStatus {
  if (blockers.length > 0) {
    return 'blocked';
  }

  return needsReviewCount > 0 ? 'needs_review' : 'ready';
}
