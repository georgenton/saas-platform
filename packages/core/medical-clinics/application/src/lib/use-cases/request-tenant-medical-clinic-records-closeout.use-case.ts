import { TenantMedicalClinicRecordsCloseout } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicIdGenerator } from '../ports/id-generators';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';
import {
  defaultPatient,
  findAppointmentsForPatient,
  findPatient,
  listPatientEvents,
  recordMedicalClinicEvent,
  recordsGuardrails,
} from './medical-clinic-records.helpers';

export class RequestTenantMedicalClinicRecordsCloseoutUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly idGenerator?: MedicalClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientId: string;
  }): Promise<TenantMedicalClinicRecordsCloseout> {
    const patient =
      (await findPatient(
        this.operationsRepository,
        input.tenantSlug,
        input.patientId,
      )) ?? defaultPatient(input.tenantSlug, input.patientId);
    const appointments = await findAppointmentsForPatient(
      this.operationsRepository,
      input.tenantSlug,
      input.patientId,
    );
    const events = await listPatientEvents(
      this.operationsRepository,
      input.tenantSlug,
      input.patientId,
      appointments,
    );
    const checklist: TenantMedicalClinicRecordsCloseout['checklist'] = [
      check(
        'patient_identity',
        'Identidad del paciente',
        patient.identificationStatus,
        patient.id,
      ),
      check(
        'patient_consent',
        'Consentimiento revisado',
        patient.consentStatus,
        'patient-intake',
      ),
      check(
        'clinical_timeline',
        'Timeline clinico operativo',
        appointments.length > 0 ? 'ready' : 'needs_review',
        `${appointments.length} appointments`,
      ),
      check(
        'history_draft',
        'Historia draft solicitada',
        hasEvent(events, 'medical_history_draft_record_requested')
          ? 'needs_review'
          : 'blocked',
        'medical-history-draft',
      ),
      check(
        'evidence_registry',
        'Evidencia clinica/administrativa',
        patient.consentStatus === 'ready' ? 'needs_review' : 'blocked',
        'clinical-evidence-registry',
      ),
      check(
        'orders_referrals',
        'Ordenes y referencias revisables',
        hasEvent(events, 'orders_referral_readiness_packet_requested')
          ? 'needs_review'
          : 'blocked',
        'orders-referral-readiness',
      ),
      check(
        'care_plan_tasks',
        'Tareas de seguimiento',
        appointments.some((appointment) => appointment.status === 'completed')
          ? 'needs_review'
          : 'blocked',
        'care-plan-task-workspace',
      ),
    ];
    const blockers = [
      ...patient.blockers,
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
    const now = this.nowProvider();

    await recordMedicalClinicEvent({
      operationsRepository: this.operationsRepository,
      idGenerator: this.idGenerator,
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      eventType: 'records_closeout_requested',
      status: closeoutStatus,
      payload: { checkCount: checklist.length },
      occurredAt: now,
    });

    return {
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      generatedAt: now,
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
      blockers,
      nextStep:
        closeoutStatus === 'blocked'
          ? 'Resolver registros bloqueados antes de cerrar records 4.0.'
          : 'Revisar historia, evidencia, ordenes y care plan con profesional.',
      guardrails: recordsGuardrails(),
    };
  }
}

function check(
  key: string,
  label: string,
  status: TenantMedicalClinicRecordsCloseout['checklist'][number]['status'],
  evidence: string,
): TenantMedicalClinicRecordsCloseout['checklist'][number] {
  return { key, label, status, evidence };
}

function hasEvent(
  events: Array<{ eventType: string }>,
  eventType: string,
): boolean {
  return events.some((event) => event.eventType === eventType);
}
