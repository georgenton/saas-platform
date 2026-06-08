import {
  TenantMedicalClinicAppointmentRecord,
  TenantMedicalClinicEncounterWorkspace,
} from '@saas-platform/medical-clinics-domain';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';

export class GetTenantMedicalClinicEncounterWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    appointmentId: string;
  }): Promise<TenantMedicalClinicEncounterWorkspace> {
    const appointment =
      (await findAppointment(
        this.operationsRepository,
        input.tenantSlug,
        input.appointmentId,
      )) ?? defaultAppointment(input.tenantSlug, input.appointmentId);
    const blockers = [
      ...appointment.blockers,
      ...(appointment.status === 'cancelled' || appointment.status === 'no_show'
        ? ['La cita no puede abrir encounter clinico en su estado actual.']
        : []),
      ...(appointment.status === 'completed'
        ? []
        : ['La atencion requiere check-in/completion para closeout clinico.']),
    ];
    const workspaceStatus = blockers.length > 0 ? 'needs_review' : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      appointmentId: input.appointmentId,
      generatedAt: this.nowProvider(),
      workspaceStatus,
      appointment: {
        id: appointment.id,
        patientDisplayName: appointment.patientDisplayName,
        serviceName: appointment.serviceName,
        professionalName: appointment.professionalName,
        startsAt: appointment.startsAt.toISOString(),
        status: appointment.status,
      },
      clinicalContext: {
        chiefConcern: appointment.serviceName,
        visitMode: 'in_person',
        consentStatus: appointment.blockers.length > 0 ? 'blocked' : 'ready',
        intakeStatus:
          appointment.blockers.length > 0 ? 'needs_review' : 'ready',
        billingStatus: appointment.billingStatus,
      },
      encounterChecklist: [
        checklist('patient_identity', 'Identidad del paciente', 'ready'),
        checklist(
          'consent',
          'Consentimiento para atencion',
          appointment.blockers.length > 0 ? 'blocked' : 'ready',
        ),
        checklist(
          'visit_status',
          'Estado de la cita',
          appointment.status === 'cancelled' || appointment.status === 'no_show'
            ? 'blocked'
            : 'needs_review',
        ),
        checklist('clinical_note_draft', 'Nota clinica draft', 'needs_review'),
        checklist('follow_up', 'Seguimiento', 'needs_review'),
      ],
      blockers,
      nextStep:
        workspaceStatus === 'ready'
          ? 'Preparar note draft y plan de seguimiento para revision profesional.'
          : 'Resolver blockers de cita/intake antes de cerrar la atencion.',
      guardrails: clinicalGuardrails(),
    };
  }
}

export async function findAppointment(
  operationsRepository: MedicalClinicOperationsRepository | undefined,
  tenantSlug: string,
  appointmentId: string,
): Promise<TenantMedicalClinicAppointmentRecord | null> {
  const appointments = await operationsRepository?.listAppointments(tenantSlug);

  return (
    appointments?.find((appointment) => appointment.id === appointmentId) ??
    null
  );
}

export function defaultAppointment(
  tenantSlug: string,
  appointmentId: string,
): TenantMedicalClinicAppointmentRecord {
  const now = new Date('2026-06-08T14:00:00.000Z');

  return {
    id: appointmentId,
    tenantSlug,
    patientId: 'patient_demo',
    patientDisplayName: 'Paciente Demo',
    serviceName: 'Consulta general',
    professionalId: 'professional_general_001',
    professionalName: 'Dra. Ana Paredes',
    startsAt: now,
    status: 'confirmed',
    reminderStatus: 'needs_review',
    billingStatus: 'needs_review',
    amountInCents: 3500,
    currency: 'USD',
    blockers: [
      'Usando cita demo; confirmar cita persistida para operacion real.',
    ],
    createdAt: now,
    updatedAt: now,
  };
}

export function clinicalGuardrails(): string[] {
  return [
    'Workspace clinico operativo; no constituye historia clinica legal completa.',
    'No diagnostica, no prescribe y no reemplaza criterio medico profesional.',
    'Notas, planes e indicaciones son drafts revisables antes de cualquier uso oficial.',
  ];
}

function checklist(
  key: string,
  label: string,
  status: TenantMedicalClinicEncounterWorkspace['encounterChecklist'][number]['status'],
): TenantMedicalClinicEncounterWorkspace['encounterChecklist'][number] {
  return { key, label, status };
}
