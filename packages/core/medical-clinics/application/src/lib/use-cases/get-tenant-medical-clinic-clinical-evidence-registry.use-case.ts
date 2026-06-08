import { TenantMedicalClinicClinicalEvidenceRegistry } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';
import {
  defaultPatient,
  findAppointmentsForPatient,
  findPatient,
  listPatientEvents,
  recordsGuardrails,
} from './medical-clinic-records.helpers';

export class GetTenantMedicalClinicClinicalEvidenceRegistryUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientId: string;
  }): Promise<TenantMedicalClinicClinicalEvidenceRegistry> {
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
    const evidenceItems: TenantMedicalClinicClinicalEvidenceRegistry['evidenceItems'] =
      [
        {
          key: 'consent:patient-care',
          label: 'Consentimiento para atencion',
          category: 'consent',
          status: patient.consentStatus,
          source: 'patient-intake',
          linkedAppointmentId: null,
        },
        ...appointments.map((appointment) => ({
          key: `appointment:${appointment.id}:invoiceable-service`,
          label: `Evidencia de servicio: ${appointment.serviceName}`,
          category: 'administrative' as const,
          status: appointment.billingStatus,
          source: 'appointment',
          linkedAppointmentId: appointment.id,
        })),
        ...events
          .filter((event) => event.eventType.includes('packet'))
          .map((event) => ({
            key: `event:${event.id}`,
            label: event.eventType,
            category: event.eventType.includes('prescription')
              ? ('clinical_order' as const)
              : ('external_result' as const),
            status: event.status,
            source: event.source,
            linkedAppointmentId: event.appointmentId,
          })),
      ];
    const blockers = [
      ...patient.blockers,
      ...evidenceItems
        .filter((item) => item.status === 'blocked')
        .map((item) => item.label),
    ];
    const needsReviewCount = evidenceItems.filter(
      (item) => item.status === 'needs_review',
    ).length;

    return {
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      generatedAt: this.nowProvider(),
      registryStatus:
        blockers.length > 0
          ? 'blocked'
          : needsReviewCount > 0
            ? 'needs_review'
            : 'ready',
      evidenceItems,
      summary: {
        evidenceCount: evidenceItems.length,
        acceptedCount: evidenceItems.filter((item) => item.status === 'ready')
          .length,
        needsReviewCount,
      },
      blockers,
      nextStep:
        blockers.length > 0
          ? 'Resolver evidencias bloqueadas antes de closeout.'
          : 'Aceptar o rechazar evidencias pendientes con revision humana.',
      guardrails: recordsGuardrails(),
    };
  }
}
