import { TenantPsychologyClinicGrowthReminderBridge } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class RequestTenantPsychologyClinicGrowthReminderBridgeUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicGrowthReminderBridge> {
    const sessions =
      (await this.operationsRepository?.listSessions(input.tenantSlug)) ?? [];
    const reminders = sessions.map((session) => ({
      sessionId: session.id,
      patientDisplayName: session.patientDisplayName,
      templateKey:
        session.status === 'completed'
          ? 'psychology_follow_up_review'
          : 'psychology_session_confirmation',
      sendWindow:
        session.status === 'completed' ? '24-72 horas' : '24 horas antes',
      status: session.reminderStatus,
      nextAction:
        session.reminderStatus === 'ready'
          ? 'Enviar a Growth como draft revisable.'
          : 'Revisar consentimiento y privacidad antes del handoff.',
    }));
    const blockers = reminders
      .filter((reminder) => reminder.status === 'blocked')
      .map((reminder) => reminder.patientDisplayName);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      bridgeStatus:
        blockers.length > 0
          ? 'blocked'
          : reminders.some((reminder) => reminder.status === 'needs_review')
            ? 'needs_review'
            : reminders.length > 0
              ? 'ready'
              : 'needs_review',
      channel: 'whatsapp',
      reminders,
      handoff: {
        growthProductKey: 'growth',
        conversationPurpose: reminders.some((reminder) =>
          reminder.templateKey.includes('follow_up'),
        )
          ? 'therapy_follow_up'
          : 'therapy_session_confirmation',
        requiresHumanReview: true,
        privacyReviewRequired: true,
      },
      blockers,
      nextStep: 'Growth recibe drafts, no mensajes enviados automaticamente.',
      guardrails: psychologyGuardrails(),
    };
  }
}
