import { TenantPsychologyClinicClinicalEvidenceRegistry } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import {
  findPatient,
  psychologyGuardrails,
} from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicClinicalEvidenceRegistryUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientId: string;
  }): Promise<TenantPsychologyClinicClinicalEvidenceRegistry> {
    const [patient, sessions, events] = await Promise.all([
      findPatient(this.operationsRepository, input.tenantSlug, input.patientId),
      this.operationsRepository?.listSessions(input.tenantSlug),
      this.operationsRepository?.listEvents(input.tenantSlug),
    ]);
    const patientSessions = (sessions ?? []).filter(
      (session) => session.patientId === input.patientId,
    );
    const sessionIds = new Set(patientSessions.map((session) => session.id));
    const patientEvents = (events ?? []).filter(
      (event) => event.sessionId && sessionIds.has(event.sessionId),
    );
    const evidenceItems: TenantPsychologyClinicClinicalEvidenceRegistry['evidenceItems'] =
      [
        ...(patient
          ? [
              evidence(
                `consent_${patient.id}`,
                'consent',
                'Consentimiento terapeutico',
                patient.therapyConsentStatus,
                'patient-intake',
                patient.createdAt.toISOString(),
                true,
              ),
            ]
          : []),
        ...patientEvents.map((event) =>
          evidence(
            event.id,
            event.eventType.includes('note')
              ? 'session_note_draft'
              : 'treatment_plan',
            event.eventType,
            event.status,
            event.source,
            event.occurredAt.toISOString(),
            true,
          ),
        ),
      ];
    const blockers = evidenceItems
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);

    return {
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      generatedAt: this.nowProvider(),
      registryStatus:
        blockers.length > 0
          ? 'blocked'
          : evidenceItems.length > 0
            ? 'needs_review'
            : 'blocked',
      evidenceItems,
      summary: {
        evidenceCount: evidenceItems.length,
        consentEvidenceCount: evidenceItems.filter(
          (item) => item.type === 'consent',
        ).length,
        reviewRequiredCount: evidenceItems.filter(
          (item) => item.requiresTherapistReview,
        ).length,
        blockedEvidenceCount: blockers.length,
      },
      blockers,
      nextStep: 'Terapeuta revisa evidencia antes de archivar records.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function evidence(
  id: string,
  type: TenantPsychologyClinicClinicalEvidenceRegistry['evidenceItems'][number]['type'],
  label: string,
  status: TenantPsychologyClinicClinicalEvidenceRegistry['evidenceItems'][number]['status'],
  source: string,
  capturedAt: string,
  requiresTherapistReview: boolean,
): TenantPsychologyClinicClinicalEvidenceRegistry['evidenceItems'][number] {
  return {
    id,
    type,
    label,
    status,
    source,
    capturedAt,
    requiresTherapistReview,
  };
}
