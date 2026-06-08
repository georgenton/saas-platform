import { TenantPsychologyClinicPatientIntakeWorkspace } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicPatientIntakeWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicPatientIntakeWorkspace> {
    const patients = await this.operationsRepository?.listPatients(
      input.tenantSlug,
    );
    const intakeQueue =
      patients?.map((patient) => ({
        id: patient.id,
        patientDisplayName: patient.patientDisplayName,
        therapyConsentStatus: patient.therapyConsentStatus,
        initialRiskReviewStatus: patient.initialRiskReviewStatus,
        presentingConcern: patient.presentingConcern,
        nextAction:
          patient.therapyConsentStatus === 'ready'
            ? 'Agendar primera sesion.'
            : 'Completar consentimiento terapeutico.',
      })) ?? defaultIntakeQueue();
    const blockers = intakeQueue
      .filter(
        (patient) =>
          patient.therapyConsentStatus === 'blocked' ||
          patient.initialRiskReviewStatus === 'blocked',
      )
      .map((patient) => patient.patientDisplayName);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      workspaceStatus:
        blockers.length > 0
          ? 'blocked'
          : intakeQueue.some(
                (patient) =>
                  patient.therapyConsentStatus !== 'ready' ||
                  patient.initialRiskReviewStatus !== 'ready',
              )
            ? 'needs_review'
            : 'ready',
      intakeQueue,
      summary: {
        patientCount: intakeQueue.length,
        readyPatientCount: intakeQueue.filter(
          (patient) =>
            patient.therapyConsentStatus === 'ready' &&
            patient.initialRiskReviewStatus === 'ready',
        ).length,
        pendingConsentCount: intakeQueue.filter(
          (patient) => patient.therapyConsentStatus !== 'ready',
        ).length,
        riskReviewCount: intakeQueue.filter(
          (patient) => patient.initialRiskReviewStatus !== 'ready',
        ).length,
      },
      blockers,
      nextStep: 'Completar consentimiento y revision de riesgo inicial.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function defaultIntakeQueue(): TenantPsychologyClinicPatientIntakeWorkspace['intakeQueue'] {
  return [
    {
      id: 'psychology_patient_demo',
      patientDisplayName: 'Paciente Demo',
      therapyConsentStatus: 'needs_review',
      initialRiskReviewStatus: 'needs_review',
      presentingConcern: 'Ansiedad reportada por paciente.',
      nextAction: 'Completar consentimiento terapeutico.',
    },
  ];
}
