import { TenantPsychologyClinicFoundationCloseout } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import {
  defaultProfile,
  psychologyGuardrails,
} from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicFoundationCloseoutUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicFoundationCloseout> {
    const [profile, patients, sessions, events] = await Promise.all([
      this.operationsRepository?.getProfile(input.tenantSlug),
      this.operationsRepository?.listPatients(input.tenantSlug),
      this.operationsRepository?.listSessions(input.tenantSlug),
      this.operationsRepository?.listEvents(input.tenantSlug),
    ]);
    const snapshot = profile ?? defaultProfile();
    const checklist: TenantPsychologyClinicFoundationCloseout['checklist'] = [
      check(
        'product_anchor',
        'Producto Psychology Clinics',
        'ready',
        'psychology-clinics',
      ),
      check(
        'profile',
        'Perfil y terapeutas',
        snapshot.workspaceStatus,
        'profile',
      ),
      check(
        'patient_intake',
        'Intake con consentimiento',
        patients?.some((patient) => patient.therapyConsentStatus === 'ready')
          ? 'ready'
          : 'needs_review',
        `${patients?.length ?? 0} patients`,
      ),
      check(
        'sessions',
        'Agenda de sesiones',
        sessions && sessions.length > 0 ? 'ready' : 'needs_review',
        `${sessions?.length ?? 0} sessions`,
      ),
      check(
        'session_note_draft',
        'Nota draft revisable',
        events?.some(
          (event) =>
            event.eventType ===
            'psychology_session_note_draft_packet_requested',
        )
          ? 'needs_review'
          : 'blocked',
        'session-note-draft-packet',
      ),
      check(
        'boundaries',
        'Limites terapeuticos',
        'ready',
        'no diagnosis automation',
      ),
    ];
    const blockers = [
      ...snapshot.blockers,
      ...checklist
        .filter((item) => item.status === 'blocked')
        .map((item) => item.label),
    ];
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
      summary: {
        checkCount: checklist.length,
        readyCheckCount: checklist.filter((item) => item.status === 'ready')
          .length,
        needsReviewCheckCount: checklist.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedCheckCount: checklist.filter((item) => item.status === 'blocked')
          .length,
      },
      recommendedNextSlice: 'psychology-product-activation-ui',
      blockers,
      nextStep:
        closeoutStatus === 'blocked'
          ? 'Completar nota draft y blockers antes de cerrar foundation.'
          : 'Activar UI y luego evaluar treatment plans.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function check(
  key: string,
  label: string,
  status: TenantPsychologyClinicFoundationCloseout['checklist'][number]['status'],
  evidence: string,
): TenantPsychologyClinicFoundationCloseout['checklist'][number] {
  return { key, label, status, evidence };
}
