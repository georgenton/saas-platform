import {
  PsychologyClinicReadinessStatus,
  TenantPsychologyClinicPatientPrivacyRiskQueueV60,
  TenantPsychologyClinicPatientRecord,
} from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicPatientPrivacyRiskQueueV60UseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicPatientPrivacyRiskQueueV60> {
    const patients =
      (await this.operationsRepository?.listPatients(input.tenantSlug)) ?? [];
    const queuePatients = patients.map((patient) => ({
      id: patient.id,
      patientDisplayName: patient.patientDisplayName,
      identificationStatus: patient.identificationStatus,
      contactStatus: patient.contactStatus,
      therapyConsentStatus: patient.therapyConsentStatus,
      messagingOptInStatus: patient.messagingOptInStatus,
      initialRiskReviewStatus: patient.initialRiskReviewStatus,
      priority: priorityFor(patient),
      nextAction: nextActionFor(patient),
    }));
    const blockers = patients.flatMap((patient) => patient.blockers);
    const statuses = queuePatients.flatMap((patient) => [
      patient.identificationStatus,
      patient.contactStatus,
      patient.therapyConsentStatus,
      patient.messagingOptInStatus,
      patient.initialRiskReviewStatus,
    ]);
    const queueStatus = resolveStatus(statuses, blockers, patients.length);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      queueStatus,
      patients: queuePatients,
      summary: {
        patientCount: queuePatients.length,
        highPriorityCount: queuePatients.filter(
          (patient) => patient.priority === 'high',
        ).length,
        pendingConsentCount: queuePatients.filter(
          (patient) => patient.therapyConsentStatus !== 'ready',
        ).length,
        pendingRiskReviewCount: queuePatients.filter(
          (patient) => patient.initialRiskReviewStatus !== 'ready',
        ).length,
        blockedPatientCount: queuePatients.filter((patient) =>
          [
            patient.identificationStatus,
            patient.contactStatus,
            patient.therapyConsentStatus,
            patient.messagingOptInStatus,
            patient.initialRiskReviewStatus,
          ].includes('blocked'),
        ).length,
      },
      blockers:
        patients.length === 0
          ? ['No hay pacientes para revisar privacidad y riesgo.']
          : blockers,
      nextStep:
        queueStatus === 'ready'
          ? 'Pacientes listos para sesiones con controles de privacidad revisados.'
          : 'Resolver consentimiento, opt-in y riesgo inicial antes de operar sesiones.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function priorityFor(
  patient: TenantPsychologyClinicPatientRecord,
): TenantPsychologyClinicPatientPrivacyRiskQueueV60['patients'][number]['priority'] {
  if (
    patient.initialRiskReviewStatus === 'blocked' ||
    patient.therapyConsentStatus === 'blocked'
  ) {
    return 'high';
  }

  if (
    patient.initialRiskReviewStatus !== 'ready' ||
    patient.therapyConsentStatus !== 'ready' ||
    patient.messagingOptInStatus !== 'ready'
  ) {
    return 'medium';
  }

  return 'low';
}

function nextActionFor(patient: TenantPsychologyClinicPatientRecord): string {
  if (patient.therapyConsentStatus !== 'ready') {
    return 'Revisar consentimiento terapeutico antes de continuar.';
  }

  if (patient.initialRiskReviewStatus !== 'ready') {
    return 'Completar revision inicial de riesgo con terapeuta.';
  }

  if (patient.messagingOptInStatus !== 'ready') {
    return 'Confirmar opt-in de mensajeria antes de Growth handoff.';
  }

  return 'Mantener paciente en cola operativa normal.';
}

function resolveStatus(
  statuses: PsychologyClinicReadinessStatus[],
  blockers: string[],
  patientCount: number,
): PsychologyClinicReadinessStatus {
  if (patientCount === 0 || blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
