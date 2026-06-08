import { TenantMedicalClinicGrowthReminderBridge } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicIdGenerator } from '../ports/id-generators';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';

export class RequestTenantMedicalClinicGrowthReminderBridgeUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly idGenerator?: MedicalClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicGrowthReminderBridge> {
    const appointments =
      (await this.operationsRepository?.listAppointments(input.tenantSlug)) ??
      [];
    const reminders: TenantMedicalClinicGrowthReminderBridge['reminders'] =
      appointments.length > 0
        ? appointments.map((appointment) => ({
            appointmentId: appointment.id,
            patientDisplayName: appointment.patientDisplayName,
            templateKey:
              appointment.status === 'completed'
                ? 'medical_post_visit_follow_up'
                : 'medical_appointment_confirmation',
            sendWindow:
              appointment.status === 'completed' ? '24h_after' : '24h_before',
            status: appointment.reminderStatus,
            nextAction:
              appointment.reminderStatus === 'ready'
                ? 'Listo para handoff revisado hacia Growth.'
                : 'Revisar consentimiento/opt-in antes del handoff.',
          }))
        : [
            {
              appointmentId: 'appointment_001',
              patientDisplayName: 'Maria Calderon',
              templateKey: 'medical_appointment_confirmation',
              sendWindow: '24h_before',
              status: 'needs_review',
              nextAction:
                'Confirmar consentimiento de mensajeria antes del envio.',
            },
            {
              appointmentId: 'appointment_002',
              patientDisplayName: 'Carla Benitez',
              templateKey: 'medical_appointment_confirmation',
              sendWindow: 'same_day',
              status: 'blocked',
              nextAction: 'Completar intake antes de activar recordatorio.',
            },
            {
              appointmentId: 'appointment_003',
              patientDisplayName: 'Luis Andrade',
              templateKey: 'medical_post_visit_follow_up',
              sendWindow: '24h_after',
              status: 'needs_review',
              nextAction: 'Validar representante para follow-up pediatrico.',
            },
          ];
    const blockers = reminders.some((reminder) => reminder.status === 'blocked')
      ? ['Hay recordatorios con consentimiento/intake pendiente.']
      : [];
    const tenantId = await this.operationsRepository?.getTenantIdBySlug(
      input.tenantSlug,
    );

    if (tenantId && this.idGenerator) {
      await this.operationsRepository?.recordEvent({
        id: this.idGenerator.generate(),
        tenantId,
        tenantSlug: input.tenantSlug,
        appointmentId: null,
        eventType: 'growth_reminder_bridge_requested',
        source: 'medical-clinics',
        status: blockers.length > 0 ? 'blocked' : 'needs_review',
        payload: {
          reminderCount: reminders.length,
          blockedReminderCount: reminders.filter(
            (reminder) => reminder.status === 'blocked',
          ).length,
        },
        occurredAt: this.nowProvider(),
      });
    }

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      bridgeStatus: blockers.length > 0 ? 'blocked' : 'needs_review',
      channel: 'whatsapp',
      reminders,
      handoff: {
        growthProductKey: 'growth',
        conversationPurpose: 'appointment_confirmation',
        requiresHumanReview: true,
      },
      blockers,
      nextStep:
        'Enviar a Growth solo los recordatorios con consentimiento confirmado.',
      guardrails: [
        'No envia mensajes automaticamente desde Clinics.',
        'No incluye diagnosticos ni informacion clinica sensible en templates.',
        'El canal conversacional debe respetar opt-in y revision humana.',
      ],
    };
  }
}
