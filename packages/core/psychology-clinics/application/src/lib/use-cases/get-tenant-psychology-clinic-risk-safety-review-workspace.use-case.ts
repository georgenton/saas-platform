import { TenantPsychologyClinicRiskSafetyReviewWorkspace } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import {
  findPatient,
  psychologyGuardrails,
} from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicRiskSafetyReviewWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientId: string;
  }): Promise<TenantPsychologyClinicRiskSafetyReviewWorkspace> {
    const patient = await findPatient(
      this.operationsRepository,
      input.tenantSlug,
      input.patientId,
    );
    const emergencyContactPresent = Boolean(
      patient?.emergencyContact.phoneE164,
    );
    const reviewSignals: TenantPsychologyClinicRiskSafetyReviewWorkspace['reviewSignals'] =
      [
        signal(
          'initial_risk',
          'Revision inicial de riesgo',
          patient?.initialRiskReviewStatus ?? 'blocked',
          patient?.presentingConcern ?? 'sin paciente',
          'therapist',
        ),
        signal(
          'emergency_contact',
          'Contacto de emergencia',
          emergencyContactPresent ? 'ready' : 'needs_review',
          emergencyContactPresent ? 'presente' : 'pendiente',
          'front_desk',
        ),
        signal(
          'blockers',
          'Blockers operativos',
          patient?.blockers.length ? 'blocked' : 'ready',
          `${patient?.blockers.length ?? 1} blockers`,
          'therapist',
        ),
      ];
    const blockers = reviewSignals
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);

    return {
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      generatedAt: this.nowProvider(),
      workspaceStatus:
        blockers.length > 0
          ? 'blocked'
          : reviewSignals.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      reviewSignals,
      escalation: {
        emergencyContactPresent,
        requiresHumanReview: true,
        automationAllowed: false,
      },
      blockers,
      nextStep: 'Revisar senales sensibles sin clasificacion automatica.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function signal(
  key: string,
  label: string,
  status: TenantPsychologyClinicRiskSafetyReviewWorkspace['reviewSignals'][number]['status'],
  evidence: string,
  owner: TenantPsychologyClinicRiskSafetyReviewWorkspace['reviewSignals'][number]['owner'],
): TenantPsychologyClinicRiskSafetyReviewWorkspace['reviewSignals'][number] {
  return { key, label, status, evidence, owner };
}
