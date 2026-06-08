import { TenantMedicalClinicTreatmentFollowUpReadiness } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';
import {
  clinicalGuardrails,
  defaultAppointment,
  findAppointment,
} from './get-tenant-medical-clinic-encounter-workspace.use-case';

export class GetTenantMedicalClinicTreatmentFollowUpReadinessUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    appointmentId: string;
  }): Promise<TenantMedicalClinicTreatmentFollowUpReadiness> {
    const appointment =
      (await findAppointment(
        this.operationsRepository,
        input.tenantSlug,
        input.appointmentId,
      )) ?? defaultAppointment(input.tenantSlug, input.appointmentId);
    const blockers =
      appointment.status === 'completed'
        ? []
        : ['Completar la cita antes de cerrar seguimiento clinico.'];

    return {
      tenantSlug: input.tenantSlug,
      appointmentId: input.appointmentId,
      generatedAt: this.nowProvider(),
      readinessStatus: blockers.length > 0 ? 'needs_review' : 'ready',
      planItems: [
        item(
          'patient_instruction',
          'Indicaciones generales al paciente',
          'professional',
          'needs_review',
          'same_day',
        ),
        item(
          'next_visit',
          'Proxima cita sugerida',
          'clinic',
          'needs_review',
          '7-30 days',
        ),
        item(
          'follow_up_message',
          'Follow-up conversacional revisado',
          'clinic',
          appointment.reminderStatus,
          '24h_after',
        ),
      ],
      suggestedFollowUp: {
        recommendedWindow: '7-30 days',
        schedulingStatus:
          appointment.status === 'completed' ? 'needs_review' : 'blocked',
        growthReminderStatus: appointment.reminderStatus,
      },
      blockers,
      nextStep: 'Confirmar plan profesional y preparar recordatorio revisado.',
      guardrails: clinicalGuardrails(),
    };
  }
}

function item(
  key: string,
  label: string,
  owner: 'patient' | 'clinic' | 'professional',
  status: 'ready' | 'needs_review' | 'blocked',
  dueHint: string,
): TenantMedicalClinicTreatmentFollowUpReadiness['planItems'][number] {
  return { key, label, owner, status, dueHint };
}
