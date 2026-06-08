import { TenantPsychologyClinicCloseoutV4 } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicCloseoutV4UseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicCloseoutV4> {
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
    const consentReadyCount =
      patients?.filter((patient) => patient.therapyConsentStatus === 'ready')
        .length ?? 0;
    const checklist: TenantPsychologyClinicCloseoutV4['checklist'] = [
      check(
        'records_v3',
        'Records 3.0',
        patientCount > 0 && noteDraftCount > 0 ? 'needs_review' : 'blocked',
        `${patientCount} patients, ${noteDraftCount} note drafts`,
      ),
      check(
        'ehr_discovery',
        'EHR discovery',
        consentReadyCount > 0 ? 'needs_review' : 'blocked',
        `${consentReadyCount} consents ready`,
      ),
      check(
        'signature_readiness',
        'Signature readiness',
        completedSessionCount > 0 ? 'needs_review' : 'blocked',
        `${completedSessionCount} completed sessions`,
      ),
      check(
        'outcomes_review',
        'Outcomes review',
        completedSessionCount > 0 ? 'needs_review' : 'blocked',
        `${completedSessionCount} sessions available`,
      ),
      check(
        'handoff_contracts',
        'External document handoff',
        noteDraftCount > 0 ? 'needs_review' : 'blocked',
        `${noteDraftCount} note drafts export candidates`,
      ),
      check(
        'clinical_boundary',
        'Clinical automation boundary',
        'ready',
        'no auto diagnosis, no auto signature',
      ),
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
      productReadiness: {
        recordsV3Ready: patientCount > 0 && noteDraftCount > 0,
        ehrDiscoveryReady: consentReadyCount > 0,
        signatureReadinessReady: completedSessionCount > 0,
        outcomesReviewReady: completedSessionCount > 0,
        handoffContractsReady: noteDraftCount > 0,
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
      recommendedNextProduct:
        blockers.length > 0
          ? 'psychology-clinics-hardening'
          : 'medical-clinics-ehr-integration',
      blockers,
      nextStep: 'Cerrar la frontera clinica formal antes de integraciones EHR.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function check(
  key: string,
  label: string,
  status: TenantPsychologyClinicCloseoutV4['checklist'][number]['status'],
  evidence: string,
): TenantPsychologyClinicCloseoutV4['checklist'][number] {
  return { key, label, status, evidence };
}
