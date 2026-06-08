import { TenantPsychologyClinicRecordsCloseoutV3 } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicRecordsCloseoutV3UseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicRecordsCloseoutV3> {
    const [patients, sessions, events] = await Promise.all([
      this.operationsRepository?.listPatients(input.tenantSlug),
      this.operationsRepository?.listSessions(input.tenantSlug),
      this.operationsRepository?.listEvents(input.tenantSlug),
    ]);
    const patientCount = patients?.length ?? 0;
    const completedSessionCount =
      sessions?.filter((session) => session.status === 'completed').length ?? 0;
    const noteDraftCount =
      events?.filter((event) => event.eventType.includes('note_draft'))
        .length ?? 0;
    const checklist: TenantPsychologyClinicRecordsCloseoutV3['checklist'] = [
      check(
        'records',
        'Records hardening',
        patientCount > 0 ? 'needs_review' : 'blocked',
        `${patientCount} patients`,
      ),
      check(
        'evidence',
        'Clinical evidence registry',
        noteDraftCount > 0 ? 'needs_review' : 'blocked',
        `${noteDraftCount} note drafts`,
      ),
      check(
        'review_loop',
        'Session note review loop',
        completedSessionCount > 0 ? 'needs_review' : 'blocked',
        `${completedSessionCount} completed sessions`,
      ),
      check(
        'privacy',
        'Privacy and consent',
        patientCount > 0 ? 'needs_review' : 'blocked',
        `${patientCount} patients`,
      ),
      check('ehr_boundary', 'EHR boundary', 'ready', 'no legal EHR record'),
    ];
    const blockers = checklist
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      closeoutStatus:
        blockers.length > 0
          ? 'blocked'
          : checklist.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      checklist,
      summary: {
        checkCount: checklist.length,
        readyCheckCount: checklist.filter((item) => item.status === 'ready')
          .length,
        needsReviewCheckCount: checklist.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedCheckCount: blockers.length,
      },
      recommendedNextProduct: 'psychology-ehr-discovery',
      blockers,
      nextStep: 'Evaluar EHR discovery solo despues de cerrar records 3.0.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function check(
  key: string,
  label: string,
  status: TenantPsychologyClinicRecordsCloseoutV3['checklist'][number]['status'],
  evidence: string,
): TenantPsychologyClinicRecordsCloseoutV3['checklist'][number] {
  return { key, label, status, evidence };
}
