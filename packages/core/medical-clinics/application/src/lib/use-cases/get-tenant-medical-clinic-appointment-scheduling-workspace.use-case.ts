import { TenantMedicalClinicAppointmentSchedulingWorkspace } from '@saas-platform/medical-clinics-domain';

export class GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase {
  constructor(private readonly nowProvider: () => Date = () => new Date()) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicAppointmentSchedulingWorkspace> {
    const appointments: TenantMedicalClinicAppointmentSchedulingWorkspace['appointments'] =
      [
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
        {
          professionalId: 'professional_general_001',
          professionalName: 'Dra. Ana Paredes',
          specialty: 'Medicina general',
          availableSlotCount: 12,
          bookedSlotCount: 2,
          blockerCount: 0,
        },
        {
          professionalId: 'professional_pediatrics_001',
          professionalName: 'Dr. Mateo Rivas',
          specialty: 'Pediatria',
          availableSlotCount: 5,
          bookedSlotCount: 1,
          blockerCount: 1,
        },
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
