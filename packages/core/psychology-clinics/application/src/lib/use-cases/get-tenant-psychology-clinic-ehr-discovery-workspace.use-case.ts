import { TenantPsychologyClinicEhrDiscoveryWorkspace } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicEhrDiscoveryWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicEhrDiscoveryWorkspace> {
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
    const discoveryAreas: TenantPsychologyClinicEhrDiscoveryWorkspace['discoveryAreas'] =
      [
        area(
          'clinical_scope',
          'Alcance clinico formal',
          completedSessionCount > 0 ? 'needs_review' : 'blocked',
          `${completedSessionCount} completed sessions`,
          'Definir que campos pueden convertirse en record formal.',
        ),
        area(
          'consent_privacy',
          'Consentimiento y privacidad',
          consentReadyCount === patientCount && patientCount > 0
            ? 'needs_review'
            : 'blocked',
          `${consentReadyCount}/${patientCount} consents ready`,
          'Confirmar consentimiento para integraciones externas.',
        ),
        area(
          'note_review_boundary',
          'Frontera de nota revisada',
          noteDraftCount > 0 ? 'needs_review' : 'blocked',
          `${noteDraftCount} note drafts`,
          'Separar draft revisado de record legal firmado.',
        ),
        area(
          'external_system',
          'Decision de sistema externo',
          'needs_review',
          'external EHR/document system not selected',
          'Evaluar EHR externo, DMS o archivo clinico.',
        ),
      ];
    const blockers = discoveryAreas
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      workspaceStatus:
        blockers.length > 0
          ? 'blocked'
          : discoveryAreas.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      discoveryAreas,
      boundaryPolicy: {
        legalEhrRecordCreated: false,
        requiresConsentReview: true,
        requiresExternalSystemDecision: true,
        requiresTherapistReview: true,
      },
      summary: {
        areaCount: discoveryAreas.length,
        readyAreaCount: discoveryAreas.filter((item) => item.status === 'ready')
          .length,
        needsReviewAreaCount: discoveryAreas.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedAreaCount: blockers.length,
      },
      blockers,
      nextStep: 'Resolver discovery EHR antes de firmar records formales.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function area(
  key: string,
  label: string,
  status: TenantPsychologyClinicEhrDiscoveryWorkspace['discoveryAreas'][number]['status'],
  evidence: string,
  nextAction: string,
): TenantPsychologyClinicEhrDiscoveryWorkspace['discoveryAreas'][number] {
  return { key, label, status, evidence, nextAction };
}
