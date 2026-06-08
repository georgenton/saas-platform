import { TenantPsychologyClinicTherapistReviewWorkQueue } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicTherapistReviewWorkQueueUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicTherapistReviewWorkQueue> {
    const [patients, sessions, events] = await Promise.all([
      this.operationsRepository?.listPatients(input.tenantSlug),
      this.operationsRepository?.listSessions(input.tenantSlug),
      this.operationsRepository?.listEvents(input.tenantSlug),
    ]);
    const reviewItems: TenantPsychologyClinicTherapistReviewWorkQueue['reviewItems'] =
      [
        ...(events ?? [])
          .filter((event) => event.eventType.includes('note'))
          .slice(0, 5)
          .map((event) =>
            item(
              event.id,
              'Session note review',
              'session_note',
              event.status,
              event.eventType,
            ),
          ),
        ...(patients ?? [])
          .filter((patient) => patient.therapyConsentStatus !== 'ready')
          .slice(0, 3)
          .map((patient) =>
            item(
              patient.id,
              'Consent review',
              'consent',
              patient.therapyConsentStatus,
              patient.patientDisplayName,
            ),
          ),
        ...(sessions ?? [])
          .filter((session) => session.status === 'completed')
          .slice(0, 3)
          .map((session) =>
            item(
              session.id,
              'Outcome summary review',
              'outcome_summary',
              'needs_review',
              session.patientDisplayName,
            ),
          ),
      ];
    const blockers = reviewItems
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      queueStatus:
        blockers.length > 0
          ? 'blocked'
          : reviewItems.length > 0
            ? 'needs_review'
            : 'blocked',
      reviewItems,
      summary: {
        itemCount: reviewItems.length,
        needsReviewCount: reviewItems.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedCount: blockers.length,
      },
      blockers:
        reviewItems.length === 0 ? ['No therapist review items found'] : blockers,
      nextStep: 'Resolver la cola clinica antes del closeout final.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function item(
  id: string,
  label: string,
  type: TenantPsychologyClinicTherapistReviewWorkQueue['reviewItems'][number]['type'],
  status: TenantPsychologyClinicTherapistReviewWorkQueue['reviewItems'][number]['status'],
  evidence: string,
): TenantPsychologyClinicTherapistReviewWorkQueue['reviewItems'][number] {
  return { id, label, type, status, owner: 'therapist', evidence };
}
