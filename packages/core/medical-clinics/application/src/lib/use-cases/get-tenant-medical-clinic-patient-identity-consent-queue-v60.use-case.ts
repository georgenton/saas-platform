import {
  MedicalClinicReadinessStatus,
  TenantMedicalClinicPatientIdentityConsentQueueV60,
} from '@saas-platform/medical-clinics-domain';
import { GetTenantMedicalClinicPatientIntakeWorkspaceUseCase } from './get-tenant-medical-clinic-patient-intake-workspace.use-case';

export class GetTenantMedicalClinicPatientIdentityConsentQueueV60UseCase {
  constructor(
    private readonly getTenantMedicalClinicPatientIntakeWorkspaceUseCase: GetTenantMedicalClinicPatientIntakeWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicPatientIdentityConsentQueueV60> {
    const intake =
      await this.getTenantMedicalClinicPatientIntakeWorkspaceUseCase.execute(
        input,
      );
    const patients = intake.intakeQueue.map((patient) => {
      const blockers = [
        patient.identificationStatus === 'blocked'
          ? 'patient.identification.blocked'
          : null,
        patient.contactStatus === 'blocked' ? 'patient.contact.blocked' : null,
        patient.consentStatus !== 'ready' ? 'patient.consent.review' : null,
        patient.triageReason.trim().length === 0
          ? 'patient.triage.empty'
          : null,
      ].filter((blocker): blocker is string => blocker !== null);
      const triageStatus: MedicalClinicReadinessStatus =
        patient.triageReason.trim().length === 0 ? 'blocked' : 'ready';
      const statuses = [
        patient.identificationStatus,
        patient.contactStatus,
        patient.consentStatus,
        triageStatus,
      ];

      return {
        patientId: patient.id,
        patientDisplayName: patient.patientDisplayName,
        identificationStatus: patient.identificationStatus,
        contactStatus: patient.contactStatus,
        consentStatus: patient.consentStatus,
        messagingOptInStatus: 'needs_review' as const,
        triageStatus,
        priority:
          blockers.length > 0 ? ('critical' as const) : ('normal' as const),
        blockers,
        nextAction:
          blockers.length > 0
            ? 'Completar identidad, contacto, consentimiento o triage antes de agendar.'
            : 'Paciente listo para flujo operativo de cita.',
      };
    });
    const blockers = patients.flatMap((patient) => patient.blockers);
    const queueStatus = resolveStatus(
      patients.flatMap((patient) => [
        patient.identificationStatus,
        patient.contactStatus,
        patient.consentStatus,
        patient.triageStatus,
      ]),
      blockers,
    );

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      queueStatus,
      patients,
      summary: {
        patientCount: patients.length,
        readyPatientCount: patients.filter(
          (patient) => patient.blockers.length === 0,
        ).length,
        blockedPatientCount: patients.filter(
          (patient) => patient.blockers.length > 0,
        ).length,
        consentReviewCount: patients.filter(
          (patient) => patient.consentStatus !== 'ready',
        ).length,
        whatsappOptInReviewCount: patients.length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        queueStatus === 'ready'
          ? 'Usar pacientes listos para agenda y recordatorios revisados.'
          : 'Resolver identidad/consentimiento antes de operar la cita.',
      guardrails: [
        'La queue controla consentimiento e identidad; no almacena historia clinica formal.',
        'Opt-in WhatsApp requiere revision humana antes de cualquier mensaje.',
      ],
    };
  }
}

function resolveStatus(
  statuses: MedicalClinicReadinessStatus[],
  blockers: string[],
): MedicalClinicReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
