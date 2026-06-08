import { TenantPsychologyClinicClinicalAdminHardeningWorkspace } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicClinicalAdminHardeningWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicClinicalAdminHardeningWorkspace> {
    const [profile, patients, sessions] = await Promise.all([
      this.operationsRepository?.getProfile(input.tenantSlug),
      this.operationsRepository?.listPatients(input.tenantSlug),
      this.operationsRepository?.listSessions(input.tenantSlug),
    ]);
    const therapistCount = profile?.therapists.length ?? 0;
    const patientBlockerCount =
      patients?.reduce((sum, patient) => sum + patient.blockers.length, 0) ?? 0;
    const sessionBlockerCount =
      sessions?.reduce((sum, session) => sum + session.blockers.length, 0) ?? 0;
    const controls: TenantPsychologyClinicClinicalAdminHardeningWorkspace['adminControls'] =
      [
        control(
          'therapist_roster',
          'Therapist reviewer roster',
          therapistCount > 0 ? 'needs_review' : 'blocked',
          'clinic_admin',
          `${therapistCount} therapists configured`,
        ),
        control(
          'patient_blockers',
          'Patient blocker ownership',
          patientBlockerCount === 0 ? 'ready' : 'needs_review',
          'clinic_admin',
          `${patientBlockerCount} patient blockers`,
        ),
        control(
          'session_blockers',
          'Session blocker ownership',
          sessionBlockerCount === 0 ? 'ready' : 'needs_review',
          'therapist',
          `${sessionBlockerCount} session blockers`,
        ),
        control(
          'audit_queue',
          'Audit-friendly work queue',
          sessions && sessions.length > 0 ? 'needs_review' : 'blocked',
          'platform_admin',
          `${sessions?.length ?? 0} sessions`,
        ),
      ];
    const blockers = controls
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      workspaceStatus:
        blockers.length > 0
          ? 'blocked'
          : controls.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      adminControls: controls,
      summary: {
        controlCount: controls.length,
        readyControlCount: controls.filter((item) => item.status === 'ready')
          .length,
        needsReviewControlCount: controls.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedControlCount: blockers.length,
      },
      blockers,
      nextStep: 'Asignar ownership clinico antes de escalar operaciones.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function control(
  key: string,
  label: string,
  status: TenantPsychologyClinicClinicalAdminHardeningWorkspace['adminControls'][number]['status'],
  owner: TenantPsychologyClinicClinicalAdminHardeningWorkspace['adminControls'][number]['owner'],
  evidence: string,
): TenantPsychologyClinicClinicalAdminHardeningWorkspace['adminControls'][number] {
  return { key, label, status, owner, evidence };
}
