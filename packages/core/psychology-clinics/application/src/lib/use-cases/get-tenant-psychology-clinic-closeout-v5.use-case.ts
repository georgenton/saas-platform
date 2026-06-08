import { TenantPsychologyClinicCloseoutV5 } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicCloseoutV5UseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicCloseoutV5> {
    const [patients, sessions, events] = await Promise.all([
      this.operationsRepository?.listPatients(input.tenantSlug),
      this.operationsRepository?.listSessions(input.tenantSlug),
      this.operationsRepository?.listEvents(input.tenantSlug),
    ]);
    const patientCount = patients?.length ?? 0;
    const sessionCount = sessions?.length ?? 0;
    const noteDraftCount =
      events?.filter((event) => event.eventType.includes('note_draft'))
        .length ?? 0;
    const checklist: TenantPsychologyClinicCloseoutV5['checklist'] = [
      check('foundation', 'Foundation implemented', patientCount > 0 ? 'ready' : 'blocked', `${patientCount} patients`),
      check('operations', 'Operations implemented', sessionCount > 0 ? 'ready' : 'blocked', `${sessionCount} sessions`),
      check('records', 'Records 3.0 implemented', noteDraftCount > 0 ? 'needs_review' : 'blocked', `${noteDraftCount} note drafts`),
      check('ehr_readiness', 'EHR readiness implemented', noteDraftCount > 0 ? 'needs_review' : 'blocked', 'integration deferred'),
      check('boundary', 'Boundary compliance closed', 'ready', 'no auto diagnosis/signature/EHR'),
      check('next_product', 'Next product recommendation', 'ready', 'return to Tax Compliance EC'),
    ];
    const blockers = checklist
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);
    const closeoutStatus =
      blockers.length > 0
        ? 'blocked'
        : checklist.some((item) => item.status === 'needs_review')
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      checklist,
      decision: {
        status: blockers.length > 0 ? 'blocked' : 'mvp_complete',
        recommendedNextProduct: 'tax-compliance-ec',
        externalEhrIntegrationDeferred: true,
      },
      summary: {
        checkCount: checklist.length,
        readyCheckCount: checklist.filter((item) => item.status === 'ready')
          .length,
        needsReviewCheckCount: checklist.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedCheckCount: blockers.length,
      },
      blockers,
      nextStep: 'Pausar Psychology Clinics como MVP y volver a Tax Compliance EC.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function check(
  key: string,
  label: string,
  status: TenantPsychologyClinicCloseoutV5['checklist'][number]['status'],
  evidence: string,
): TenantPsychologyClinicCloseoutV5['checklist'][number] {
  return { key, label, status, evidence };
}
