import {
  MedicalClinicReadinessStatus,
  TenantMedicalClinicAppointmentRecord,
  TenantMedicalClinicOperationalEventRecord,
  TenantMedicalClinicPatientRecord,
} from '@saas-platform/medical-clinics-domain';
import { MedicalClinicIdGenerator } from '../ports/id-generators';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';
import { clinicalGuardrails } from './get-tenant-medical-clinic-encounter-workspace.use-case';

export async function findPatient(
  operationsRepository: MedicalClinicOperationsRepository | undefined,
  tenantSlug: string,
  patientId: string,
): Promise<TenantMedicalClinicPatientRecord | null> {
  const patients = await operationsRepository?.listPatients(tenantSlug);

  return patients?.find((patient) => patient.id === patientId) ?? null;
}

export async function findAppointmentsForPatient(
  operationsRepository: MedicalClinicOperationsRepository | undefined,
  tenantSlug: string,
  patientId: string,
): Promise<TenantMedicalClinicAppointmentRecord[]> {
  const appointments = await operationsRepository?.listAppointments(tenantSlug);

  return (
    appointments?.filter(
      (appointment) => appointment.patientId === patientId,
    ) ?? []
  );
}

export async function listPatientEvents(
  operationsRepository: MedicalClinicOperationsRepository | undefined,
  tenantSlug: string,
  patientId: string,
  appointments: TenantMedicalClinicAppointmentRecord[],
): Promise<TenantMedicalClinicOperationalEventRecord[]> {
  const events = await operationsRepository?.listEvents(tenantSlug);
  const appointmentIds = new Set(appointments.map((item) => item.id));

  return (
    events?.filter((event) => {
      if (event.appointmentId && appointmentIds.has(event.appointmentId)) {
        return true;
      }

      return event.payload['patientId'] === patientId;
    }) ?? []
  );
}

export function defaultPatient(
  tenantSlug: string,
  patientId: string,
): TenantMedicalClinicPatientRecord {
  const now = new Date('2026-06-08T14:00:00.000Z');

  return {
    id: patientId,
    tenantSlug,
    patientDisplayName: 'Paciente Demo',
    identificationStatus: 'needs_review',
    contactStatus: 'needs_review',
    consentStatus: 'blocked',
    messagingOptInStatus: 'needs_review',
    triageReason: 'Consulta general',
    contact: {
      email: null,
      phoneE164: null,
      whatsappE164: null,
    },
    representative: {
      displayName: null,
      relationship: null,
      identification: null,
    },
    blockers: [
      'Usando paciente demo; confirmar paciente persistido para operacion real.',
    ],
    createdAt: now,
    updatedAt: now,
  };
}

export function recordsGuardrails(): string[] {
  return [
    ...clinicalGuardrails(),
    'Los registros longitudinales son operativos y revisables; no son historia clinica legal firmada.',
    'Toda evidencia, orden, referencia o plan requiere validacion humana antes de uso oficial.',
  ];
}

export async function recordMedicalClinicEvent(input: {
  operationsRepository?: MedicalClinicOperationsRepository;
  idGenerator?: MedicalClinicIdGenerator;
  tenantSlug: string;
  patientId: string;
  appointmentId?: string | null;
  eventType: string;
  status: MedicalClinicReadinessStatus;
  payload?: Record<string, unknown>;
  occurredAt: Date;
}): Promise<void> {
  const tenantId = await input.operationsRepository?.getTenantIdBySlug(
    input.tenantSlug,
  );

  if (!tenantId || !input.idGenerator) {
    return;
  }

  await input.operationsRepository?.recordEvent({
    id: input.idGenerator.generate(),
    tenantId,
    tenantSlug: input.tenantSlug,
    appointmentId: input.appointmentId ?? null,
    eventType: input.eventType,
    source: 'medical-clinics',
    status: input.status,
    payload: {
      patientId: input.patientId,
      ...(input.payload ?? {}),
    },
    occurredAt: input.occurredAt,
  });
}
