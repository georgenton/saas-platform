import { TenantPsychologyClinicTreatmentFollowUpReadiness } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import {
  defaultSession,
  findSession,
  psychologyGuardrails,
} from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicTreatmentFollowUpReadinessUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    sessionId: string;
  }): Promise<TenantPsychologyClinicTreatmentFollowUpReadiness> {
    const session =
      (await findSession(
        this.operationsRepository,
        input.tenantSlug,
        input.sessionId,
      )) ?? defaultSession(input.tenantSlug, input.sessionId);
    const noteDraftRequested = (
      (await this.operationsRepository?.listEvents(input.tenantSlug)) ?? []
    ).some(
      (event) =>
        event.sessionId === session.id &&
        event.eventType === 'psychology_session_note_draft_packet_requested',
    );
    const planItems: TenantPsychologyClinicTreatmentFollowUpReadiness['planItems'] =
      [
        item(
          'session_completed',
          'Sesion completada',
          session.status === 'completed' ? 'ready' : 'needs_review',
          session.status,
        ),
        item(
          'note_draft',
          'Nota draft solicitada',
          noteDraftRequested ? 'needs_review' : 'blocked',
          noteDraftRequested ? 'packet solicitado' : 'sin packet',
        ),
        item(
          'reminder_review',
          'Recordatorio/follow-up revisable',
          session.reminderStatus,
          session.reminderStatus,
        ),
      ];
    const blockers = [
      ...session.blockers,
      ...planItems
        .filter((planItem) => planItem.status === 'blocked')
        .map((planItem) => planItem.label),
    ];

    return {
      tenantSlug: input.tenantSlug,
      sessionId: session.id,
      patientId: session.patientId,
      generatedAt: this.nowProvider(),
      readinessStatus:
        blockers.length > 0
          ? 'blocked'
          : planItems.some((planItem) => planItem.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      session: {
        id: session.id,
        patientDisplayName: session.patientDisplayName,
        serviceName: session.serviceName,
        therapistName: session.therapistName,
        status: session.status,
        startsAt: session.startsAt.toISOString(),
      },
      planItems,
      suggestedFollowUp: {
        recommendedWindow: '24-72 horas',
        channel:
          session.reminderStatus === 'ready'
            ? 'whatsapp_review_required'
            : 'in_session',
        requiresTherapistReview: true,
      },
      blockers,
      nextStep: 'Terapeuta aprueba seguimiento y tareas antes de contactar.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function item(
  key: string,
  label: string,
  status: TenantPsychologyClinicTreatmentFollowUpReadiness['planItems'][number]['status'],
  evidence: string,
): TenantPsychologyClinicTreatmentFollowUpReadiness['planItems'][number] {
  return { key, label, status, evidence };
}
