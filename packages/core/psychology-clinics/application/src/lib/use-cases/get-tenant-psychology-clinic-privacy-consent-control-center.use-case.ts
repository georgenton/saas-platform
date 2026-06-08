import { TenantPsychologyClinicPrivacyConsentControlCenter } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicPrivacyConsentControlCenterUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicPrivacyConsentControlCenter> {
    const [profile, patients] = await Promise.all([
      this.operationsRepository?.getProfile(input.tenantSlug),
      this.operationsRepository?.listPatients(input.tenantSlug),
    ]);
    const rows = patients ?? [];
    const consentReadyCount = rows.filter(
      (patient) => patient.therapyConsentStatus === 'ready',
    ).length;
    const messagingReadyCount = rows.filter(
      (patient) => patient.messagingOptInStatus === 'ready',
    ).length;
    const controls: TenantPsychologyClinicPrivacyConsentControlCenter['controls'] =
      [
        control(
          'therapy_consent',
          'Consentimiento terapeutico',
          consentReadyCount === rows.length && rows.length > 0
            ? 'ready'
            : 'needs_review',
          rows.length - consentReadyCount,
          'Completar consentimiento antes de sesiones.',
        ),
        control(
          'messaging_opt_in',
          'Opt-in mensajeria',
          messagingReadyCount === rows.length && rows.length > 0
            ? 'ready'
            : 'needs_review',
          rows.length - messagingReadyCount,
          'Revisar WhatsApp antes de Growth bridge.',
        ),
        control(
          'clinic_privacy',
          'Privacidad clinica',
          profile?.clinicProfile.privacyReviewStatus ?? 'needs_review',
          rows.length,
          'Validar controles de privacidad.',
        ),
      ];
    const blockers = controls
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      controlStatus:
        blockers.length > 0
          ? 'blocked'
          : controls.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      controls,
      summary: {
        patientCount: rows.length,
        consentReadyCount,
        messagingReadyCount,
        privacyReviewCount: controls.filter((item) => item.status !== 'ready')
          .length,
      },
      blockers,
      nextStep: 'Cerrar consentimiento, mensajeria y privacidad antes de EHR.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function control(
  key: string,
  label: string,
  status: TenantPsychologyClinicPrivacyConsentControlCenter['controls'][number]['status'],
  affectedPatientCount: number,
  nextAction: string,
): TenantPsychologyClinicPrivacyConsentControlCenter['controls'][number] {
  return { key, label, status, affectedPatientCount, nextAction };
}
