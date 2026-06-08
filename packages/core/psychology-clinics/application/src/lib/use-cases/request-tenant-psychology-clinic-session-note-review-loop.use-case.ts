import { TenantPsychologyClinicSessionNoteReviewLoop } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import {
  defaultSession,
  findSession,
  psychologyGuardrails,
} from './psychology-clinic-foundation.helpers';

export class RequestTenantPsychologyClinicSessionNoteReviewLoopUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    sessionId: string;
  }): Promise<TenantPsychologyClinicSessionNoteReviewLoop> {
    const session =
      (await findSession(
        this.operationsRepository,
        input.tenantSlug,
        input.sessionId,
      )) ?? defaultSession(input.tenantSlug, input.sessionId);
    const events =
      (await this.operationsRepository?.listEvents(input.tenantSlug)) ?? [];
    const hasDraft = events.some(
      (event) =>
        event.sessionId === session.id &&
        event.eventType === 'psychology_session_note_draft_packet_requested',
    );
    const stages: TenantPsychologyClinicSessionNoteReviewLoop['stages'] = [
      stage(
        'draft',
        'Draft generado',
        hasDraft ? 'needs_review' : 'blocked',
        hasDraft ? 'packet' : 'sin draft',
      ),
      stage(
        'therapist_review',
        'Revision terapeuta',
        'needs_review',
        'pendiente criterio humano',
      ),
      stage(
        'approved_draft',
        'Draft aprobado',
        'needs_review',
        'no firmado legalmente',
      ),
      stage(
        'archived_record',
        'Archivo operacional',
        session.status === 'completed' ? 'needs_review' : 'blocked',
        session.status,
      ),
    ];
    const blockers = [
      ...session.blockers,
      ...stages
        .filter((item) => item.status === 'blocked')
        .map((item) => item.label),
    ];

    return {
      tenantSlug: input.tenantSlug,
      sessionId: session.id,
      generatedAt: this.nowProvider(),
      reviewStatus:
        blockers.length > 0
          ? 'blocked'
          : stages.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      stages,
      reviewPolicy: {
        requiresTherapistReview: true,
        mayBeSigned: false,
        legalEhrRecord: false,
      },
      blockers,
      nextStep: 'Completar review terapeuta antes de archivar.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function stage(
  key: TenantPsychologyClinicSessionNoteReviewLoop['stages'][number]['key'],
  label: string,
  status: TenantPsychologyClinicSessionNoteReviewLoop['stages'][number]['status'],
  evidence: string,
): TenantPsychologyClinicSessionNoteReviewLoop['stages'][number] {
  return { key, label, status, evidence };
}
