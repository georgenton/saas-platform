import { TenantMedicalClinicGrowthReminderBridge } from '@saas-platform/medical-clinics-domain';

export class RequestTenantMedicalClinicGrowthReminderBridgeUseCase {
  constructor(private readonly nowProvider: () => Date = () => new Date()) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicGrowthReminderBridge> {
    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      bridgeStatus: 'needs_review',
      channel: 'whatsapp',
      reminders: [
        {
          appointmentId: 'appointment_001',
          patientDisplayName: 'Maria Calderon',
          templateKey: 'medical_appointment_confirmation',
          sendWindow: '24h_before',
          status: 'needs_review',
          nextAction: 'Confirmar consentimiento de mensajeria antes del envio.',
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
      ],
      handoff: {
        growthProductKey: 'growth',
        conversationPurpose: 'appointment_confirmation',
        requiresHumanReview: true,
      },
      blockers: ['Hay recordatorios con consentimiento/intake pendiente.'],
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
