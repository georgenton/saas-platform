import { TenantMedicalClinicMedicalHistoryDraftRecord } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicIdGenerator } from '../ports/id-generators';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';
import {
  defaultPatient,
  findPatient,
  recordMedicalClinicEvent,
  recordsGuardrails,
} from './medical-clinic-records.helpers';

export class RequestTenantMedicalClinicMedicalHistoryDraftRecordUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly idGenerator?: MedicalClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientId: string;
  }): Promise<TenantMedicalClinicMedicalHistoryDraftRecord> {
    const patient =
      (await findPatient(
        this.operationsRepository,
        input.tenantSlug,
        input.patientId,
      )) ?? defaultPatient(input.tenantSlug, input.patientId);
    const blockers = [
      ...patient.blockers,
      ...(patient.consentStatus === 'ready'
        ? []
        : ['No crear historia draft sin consentimiento revisado.']),
    ];
    const recordStatus = blockers.length > 0 ? 'blocked' : 'needs_review';
    const now = this.nowProvider();

    await recordMedicalClinicEvent({
      operationsRepository: this.operationsRepository,
      idGenerator: this.idGenerator,
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      eventType: 'medical_history_draft_record_requested',
      status: recordStatus,
      payload: { requiresProfessionalReview: true },
      occurredAt: now,
    });

    return {
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      generatedAt: now,
      recordStatus,
      sections: {
        reportedConditions: ['Pendiente de completar por profesional.'],
        reportedAllergies: ['Pendiente de declaracion/revision.'],
        reportedMedication: ['Pendiente de declaracion/revision.'],
        familyHistory: ['Pendiente de completar si aplica.'],
        professionalObservations: [
          `Draft inicial asociado a ${patient.patientDisplayName}.`,
        ],
      },
      provenance: {
        source: 'patient_reported',
        requiresProfessionalReview: true,
        mayBecomeLegalRecord: false,
      },
      blockers,
      nextStep:
        recordStatus === 'blocked'
          ? 'Completar consentimiento antes de usar el draft clinico.'
          : 'Completar antecedentes reportados y enviar a revision profesional.',
      guardrails: recordsGuardrails(),
    };
  }
}
