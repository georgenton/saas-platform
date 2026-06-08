import { TenantMedicalClinicProductCloseout } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';
import { recordsGuardrails } from './medical-clinic-records.helpers';

export class GetTenantMedicalClinicProductCloseoutUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicProductCloseout> {
    const [profile, patients, appointments, events] = await Promise.all([
      this.operationsRepository?.getProfile(input.tenantSlug),
      this.operationsRepository?.listPatients(input.tenantSlug),
      this.operationsRepository?.listAppointments(input.tenantSlug),
      this.operationsRepository?.listEvents(input.tenantSlug),
    ]);
    const patientCount = patients?.length ?? 0;
    const appointmentCount = appointments?.length ?? 0;
    const operationalEventCount = events?.length ?? 0;
    const blockerCount =
      (profile?.blockers.length ?? 1) +
      (patients?.reduce(
        (total, patient) => total + patient.blockers.length,
        0,
      ) ?? 0) +
      (appointments?.reduce(
        (total, appointment) => total + appointment.blockers.length,
        0,
      ) ?? 0);
    const operationsReady = Boolean(profile) && patientCount > 0;
    const encountersReady = events?.some((event) =>
      [
        'clinical_note_draft_packet_requested',
        'encounter_closeout_requested',
      ].includes(event.eventType),
    );
    const recordsReady = events?.some((event) =>
      [
        'medical_history_draft_record_requested',
        'records_closeout_requested',
      ].includes(event.eventType),
    );
    const closedLayers: TenantMedicalClinicProductCloseout['closedLayers'] = [
      layer(
        'foundation',
        'Foundation product anchor',
        'ready',
        'catalog/modules',
      ),
      layer(
        'operations',
        'Durable operations',
        operationsReady ? 'ready' : 'needs_review',
        `${patientCount} patients, ${appointmentCount} appointments`,
      ),
      layer(
        'clinical_encounters',
        'Clinical encounters 3.0',
        encountersReady ? 'ready' : 'needs_review',
        'encounter packets and closeout events',
      ),
      layer(
        'patient_records',
        'Patient records 4.0',
        recordsReady ? 'ready' : 'needs_review',
        'timeline/history/evidence/care plan workspaces',
      ),
      layer(
        'ui_activation',
        'Product activation UI',
        'needs_review',
        'command center, patient ops, encounter and records surfaces',
      ),
    ];
    const remainingGaps = [
      ...(operationsReady
        ? []
        : ['Completar profile/patient operations seed.']),
      ...(encountersReady
        ? []
        : [
            'Ejecutar al menos un encounter packet para validar flujo clinico.',
          ]),
      ...(recordsReady
        ? []
        : ['Ejecutar records closeout para validar flujo longitudinal.']),
      'No existe EHR legal firmado ni emision oficial de recetas.',
      'Falta decision explicita antes de abrir Psychology Clinics.',
    ];
    const closeoutStatus =
      blockerCount > 0 || remainingGaps.length > 2 ? 'needs_review' : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      closedLayers,
      productReadiness: {
        foundationReady: true,
        operationsReady,
        encountersReady: Boolean(encountersReady),
        recordsReady: Boolean(recordsReady),
        uiActivationReady: true,
      },
      summary: {
        patientCount,
        appointmentCount,
        operationalEventCount,
        blockerCount,
      },
      remainingGaps,
      recommendedNextProduct: 'psychology-clinics-foundation',
      nextStep:
        closeoutStatus === 'ready'
          ? 'Usar consola Medical Clinics como referencia para Psychology Clinics.'
          : 'Completar operaciones demo y revisar gaps antes de mover a Psychology Clinics.',
      guardrails: recordsGuardrails(),
    };
  }
}

function layer(
  key: string,
  label: string,
  status: TenantMedicalClinicProductCloseout['closedLayers'][number]['status'],
  evidence: string,
): TenantMedicalClinicProductCloseout['closedLayers'][number] {
  return { key, label, status, evidence };
}
