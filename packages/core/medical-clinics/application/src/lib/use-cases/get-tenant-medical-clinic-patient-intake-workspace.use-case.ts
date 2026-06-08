import { TenantMedicalClinicPatientIntakeWorkspace } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';

export class GetTenantMedicalClinicPatientIntakeWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicPatientIntakeWorkspace> {
    const persistedPatients =
      (await this.operationsRepository?.listPatients(input.tenantSlug)) ?? [];
    const intakeQueue: TenantMedicalClinicPatientIntakeWorkspace['intakeQueue'] =
      persistedPatients.length > 0
        ? persistedPatients.map((patient) => ({
            id: patient.id,
            patientDisplayName: patient.patientDisplayName,
            identificationStatus: patient.identificationStatus,
            contactStatus: patient.contactStatus,
            consentStatus: patient.consentStatus,
            triageReason: patient.triageReason,
            nextAction:
              patient.consentStatus === 'ready'
                ? 'Paciente listo para agenda.'
                : 'Completar consentimiento antes de confirmar agenda.',
          }))
        : [
            {
              id: 'patient_intake_001',
              patientDisplayName: 'Maria Calderon',
              identificationStatus: 'ready',
              contactStatus: 'ready',
              consentStatus: 'needs_review',
              triageReason: 'Control general',
              nextAction:
                'Confirmar consentimiento informado antes de la cita.',
            },
            {
              id: 'patient_intake_002',
              patientDisplayName: 'Luis Andrade',
              identificationStatus: 'needs_review',
              contactStatus: 'ready',
              consentStatus: 'blocked',
              triageReason: 'Consulta pediatrica para dependiente',
              nextAction:
                'Completar identificacion del representante y consentimiento.',
            },
            {
              id: 'patient_intake_003',
              patientDisplayName: 'Carla Benitez',
              identificationStatus: 'ready',
              contactStatus: 'ready',
              consentStatus: 'ready',
              triageReason: 'Seguimiento post consulta',
              nextAction: 'Paciente listo para agenda.',
            },
          ];

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      workspaceStatus: 'blocked',
      intakeQueue,
      intakeChecklist: [
        {
          key: 'identity',
          label: 'Identificacion basica',
          status: 'needs_review',
        },
        { key: 'contact', label: 'Contacto verificable', status: 'ready' },
        { key: 'consent', label: 'Consentimiento', status: 'blocked' },
        { key: 'triage', label: 'Motivo de consulta', status: 'ready' },
      ],
      summary: {
        patientCount: intakeQueue.length,
        readyPatientCount: intakeQueue.filter(
          (item) =>
            item.identificationStatus === 'ready' &&
            item.contactStatus === 'ready' &&
            item.consentStatus === 'ready',
        ).length,
        blockedPatientCount: intakeQueue.filter(
          (item) =>
            item.identificationStatus === 'blocked' ||
            item.contactStatus === 'blocked' ||
            item.consentStatus === 'blocked',
        ).length,
        pendingConsentCount: intakeQueue.filter(
          (item) => item.consentStatus !== 'ready',
        ).length,
      },
      blockers: ['Consentimiento pendiente o bloqueado para 2 pacientes.'],
      nextStep:
        'Resolver consentimiento y representante antes de confirmar agenda.',
      guardrails: [
        'Intake no almacena historia clinica ni notas medicas sensibles.',
        'Consentimiento debe ser revisado por el operador o responsable legal.',
      ],
    };
  }
}
