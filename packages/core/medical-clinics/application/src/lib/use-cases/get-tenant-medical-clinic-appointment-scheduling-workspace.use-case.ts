import { TenantMedicalClinicAppointmentSchedulingWorkspace } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';

export class GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicAppointmentSchedulingWorkspace> {
    const persistedAppointments =
      (await this.operationsRepository?.listAppointments(input.tenantSlug)) ??
      [];
    const appointments: TenantMedicalClinicAppointmentSchedulingWorkspace['appointments'] =
      persistedAppointments.length > 0
        ? persistedAppointments.map((appointment) => ({
            id: appointment.id,
            patientDisplayName: appointment.patientDisplayName,
            serviceName: appointment.serviceName,
            professionalName: appointment.professionalName,
            startsAt: appointment.startsAt.toISOString(),
            status: appointment.status,
            reminderStatus: appointment.reminderStatus,
            billingStatus: appointment.billingStatus,
          }))
        : [
            {
              id: 'appointment_001',
              patientDisplayName: 'Maria Calderon',
              serviceName: 'Consulta general',
              professionalName: 'Dra. Ana Paredes',
              startsAt: '2026-06-08T14:00:00.000Z',
              status: 'confirmed',
              reminderStatus: 'needs_review',
              billingStatus: 'needs_review',
            },
            {
              id: 'appointment_002',
              patientDisplayName: 'Carla Benitez',
              serviceName: 'Consulta general',
              professionalName: 'Dra. Ana Paredes',
              startsAt: '2026-06-08T15:00:00.000Z',
              status: 'requested',
              reminderStatus: 'blocked',
              billingStatus: 'blocked',
            },
            {
              id: 'appointment_003',
              patientDisplayName: 'Luis Andrade',
              serviceName: 'Consulta pediatrica',
              professionalName: 'Dr. Mateo Rivas',
              startsAt: '2026-06-09T16:00:00.000Z',
              status: 'requested',
              reminderStatus: 'needs_review',
              billingStatus: 'needs_review',
            },
          ];

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      workspaceStatus: 'needs_review',
      dateWindow: {
        from: '2026-06-08',
        to: '2026-06-14',
      },
      availability: [
        availabilityLane(
          'professional_general_001',
          'Dra. Ana Paredes',
          'Medicina general',
          appointments,
        ),
        availabilityLane(
          'professional_pediatrics_001',
          'Dr. Mateo Rivas',
          'Pediatria',
          appointments,
        ),
      ],
      appointments,
      summary: {
        appointmentCount: appointments.length,
        confirmedCount: appointments.filter(
          (item) => item.status === 'confirmed',
        ).length,
        needsReminderCount: appointments.filter(
          (item) => item.reminderStatus !== 'ready',
        ).length,
        billingReviewCount: appointments.filter(
          (item) => item.billingStatus !== 'ready',
        ).length,
      },
      blockers: [
        'Una cita depende de intake/consentimiento antes de confirmacion.',
      ],
      nextStep: 'Resolver intake bloqueado y generar bridge de recordatorios.',
      guardrails: [
        'Agenda operativa; no valida emergencias ni prioridad clinica automatica.',
        'Cambios de cita requieren confirmacion humana cuando hay consentimiento pendiente.',
      ],
    };
  }
}

function availabilityLane(
  professionalId: string,
  professionalName: string,
  specialty: string,
  appointments: TenantMedicalClinicAppointmentSchedulingWorkspace['appointments'],
): TenantMedicalClinicAppointmentSchedulingWorkspace['availability'][number] {
  const bookedSlotCount = appointments.filter(
    (appointment) => appointment.professionalName === professionalName,
  ).length;

  return {
    professionalId,
    professionalName,
    specialty,
    availableSlotCount: Math.max(0, 12 - bookedSlotCount),
    bookedSlotCount,
    blockerCount: bookedSlotCount > 10 ? 1 : 0,
  };
}
