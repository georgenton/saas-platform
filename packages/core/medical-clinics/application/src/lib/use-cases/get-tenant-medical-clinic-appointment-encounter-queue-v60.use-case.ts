import {
  MedicalClinicReadinessStatus,
  TenantMedicalClinicAppointmentEncounterQueueV60,
} from '@saas-platform/medical-clinics-domain';
import { GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase } from './get-tenant-medical-clinic-appointment-scheduling-workspace.use-case';

export class GetTenantMedicalClinicAppointmentEncounterQueueV60UseCase {
  constructor(
    private readonly getTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase: GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicAppointmentEncounterQueueV60> {
    const scheduling =
      await this.getTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase.execute(
        input,
      );
    const appointmentItems = scheduling.appointments.map((appointment) => {
      const encounterStatus = resolveEncounterStatus(appointment.status);
      const statuses = [
        appointment.reminderStatus,
        appointment.billingStatus,
        encounterStatus,
      ];

      return {
        appointmentId: appointment.id,
        patientDisplayName: appointment.patientDisplayName,
        serviceName: appointment.serviceName,
        professionalName: appointment.professionalName,
        startsAt: appointment.startsAt,
        appointmentStatus: appointment.status,
        reminderStatus: appointment.reminderStatus,
        billingStatus: appointment.billingStatus,
        encounterStatus,
        priority: statuses.includes('blocked')
          ? ('critical' as const)
          : statuses.includes('needs_review')
            ? ('high' as const)
            : ('normal' as const),
        nextAction: resolveNextAction(appointment.status, statuses),
      };
    });
    const blockers = [
      ...scheduling.blockers,
      ...appointmentItems
        .filter((item) => item.encounterStatus === 'blocked')
        .map((item) => `appointment.${item.appointmentId}.encounter.blocked`),
    ];
    const queueStatus = resolveStatus(
      appointmentItems.flatMap((item) => [
        item.reminderStatus,
        item.billingStatus,
        item.encounterStatus,
      ]),
      blockers,
    );

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      queueStatus,
      appointmentItems,
      summary: {
        appointmentCount: appointmentItems.length,
        readyAppointmentCount: appointmentItems.filter(
          (item) =>
            item.reminderStatus === 'ready' &&
            item.billingStatus === 'ready' &&
            item.encounterStatus === 'ready',
        ).length,
        reminderReviewCount: appointmentItems.filter(
          (item) => item.reminderStatus !== 'ready',
        ).length,
        billingReviewCount: appointmentItems.filter(
          (item) => item.billingStatus !== 'ready',
        ).length,
        encounterReviewCount: appointmentItems.filter(
          (item) => item.encounterStatus !== 'ready',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        queueStatus === 'ready'
          ? 'Operar citas y encuentros con follow-up y billing listos.'
          : 'Resolver recordatorios, billing o closeout de encounter pendientes.',
      guardrails: [
        'La queue coordina citas y packets; no firma notas clinicas.',
        'Estados clinicos requieren profesional y no producen diagnostico automatico.',
      ],
    };
  }
}

function resolveEncounterStatus(
  status: TenantMedicalClinicAppointmentEncounterQueueV60['appointmentItems'][number]['appointmentStatus'],
): MedicalClinicReadinessStatus {
  if (status === 'completed') {
    return 'needs_review';
  }

  if (status === 'cancelled' || status === 'no_show') {
    return 'ready';
  }

  return 'needs_review';
}

function resolveNextAction(
  status: TenantMedicalClinicAppointmentEncounterQueueV60['appointmentItems'][number]['appointmentStatus'],
  statuses: MedicalClinicReadinessStatus[],
): string {
  if (status === 'completed') {
    return 'Cargar encounter packets y closeout profesional de la cita.';
  }

  if (statuses.includes('blocked')) {
    return 'Resolver blocker operativo antes de confirmar la cita.';
  }

  return 'Mantener recordatorio, check-in y billing readiness revisados.';
}

function resolveStatus(
  statuses: MedicalClinicReadinessStatus[],
  blockers: string[],
): MedicalClinicReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
