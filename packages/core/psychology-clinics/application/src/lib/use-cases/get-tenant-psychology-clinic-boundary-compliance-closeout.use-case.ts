import { TenantPsychologyClinicBoundaryComplianceCloseout } from '@saas-platform/psychology-clinics-domain';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicBoundaryComplianceCloseoutUseCase {
  constructor(private readonly nowProvider: () => Date = () => new Date()) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicBoundaryComplianceCloseout> {
    const boundaries: TenantPsychologyClinicBoundaryComplianceCloseout['boundaries'] =
      [
        boundary('diagnosis', 'No automatic diagnosis', 'ready', 'AI outputs remain drafts and helper text only.'),
        boundary('signature', 'No automatic signature', 'ready', 'Formal records require therapist review and external/legal validation.'),
        boundary('ehr', 'No owned legal EHR', 'ready', 'The product prepares contracts and handoffs, not a legal EHR source of truth.'),
        boundary('scales', 'No automatic scale interpretation', 'ready', 'Assessment scales are registry evidence for manual therapist review.'),
        boundary('judgment', 'No therapist replacement', 'ready', 'Clinical judgment remains with licensed human professionals.'),
      ];

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      closeoutStatus: 'ready',
      boundaries,
      policy: {
        autoDiagnosisAllowed: false,
        autoSignatureAllowed: false,
        legalEhrOwnedHere: false,
        scaleInterpretationAutomated: false,
        replacesTherapistJudgment: false,
      },
      blockers: [],
      nextStep: 'Mantener boundaries como criterio de aceptacion de futuros PRs.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function boundary(
  key: string,
  label: string,
  status: TenantPsychologyClinicBoundaryComplianceCloseout['boundaries'][number]['status'],
  enforcement: string,
): TenantPsychologyClinicBoundaryComplianceCloseout['boundaries'][number] {
  return { key, label, status, enforcement };
}
