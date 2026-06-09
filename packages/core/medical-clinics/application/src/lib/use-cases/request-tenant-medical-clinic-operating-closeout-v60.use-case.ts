import {
  MedicalClinicReadinessStatus,
  TenantMedicalClinicOperatingCloseoutV60,
} from '@saas-platform/medical-clinics-domain';
import { GetTenantMedicalClinicAppointmentEncounterQueueV60UseCase } from './get-tenant-medical-clinic-appointment-encounter-queue-v60.use-case';
import { GetTenantMedicalClinicCommandCenterV60UseCase } from './get-tenant-medical-clinic-command-center-v60.use-case';
import { GetTenantMedicalClinicCrossProductHandoffCenterV60UseCase } from './get-tenant-medical-clinic-cross-product-handoff-center-v60.use-case';
import { GetTenantMedicalClinicPatientIdentityConsentQueueV60UseCase } from './get-tenant-medical-clinic-patient-identity-consent-queue-v60.use-case';
import { GetTenantMedicalClinicProductCloseoutUseCase } from './get-tenant-medical-clinic-product-closeout.use-case';

export class RequestTenantMedicalClinicOperatingCloseoutV60UseCase {
  constructor(
    private readonly getTenantMedicalClinicCommandCenterV60UseCase: GetTenantMedicalClinicCommandCenterV60UseCase,
    private readonly getTenantMedicalClinicPatientIdentityConsentQueueV60UseCase: GetTenantMedicalClinicPatientIdentityConsentQueueV60UseCase,
    private readonly getTenantMedicalClinicAppointmentEncounterQueueV60UseCase: GetTenantMedicalClinicAppointmentEncounterQueueV60UseCase,
    private readonly getTenantMedicalClinicCrossProductHandoffCenterV60UseCase: GetTenantMedicalClinicCrossProductHandoffCenterV60UseCase,
    private readonly getTenantMedicalClinicProductCloseoutUseCase: GetTenantMedicalClinicProductCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicOperatingCloseoutV60> {
    const [
      commandCenter,
      patientQueue,
      appointmentQueue,
      handoffCenter,
      productCloseout,
    ] = await Promise.all([
      this.getTenantMedicalClinicCommandCenterV60UseCase.execute(input),
      this.getTenantMedicalClinicPatientIdentityConsentQueueV60UseCase.execute(
        input,
      ),
      this.getTenantMedicalClinicAppointmentEncounterQueueV60UseCase.execute(
        input,
      ),
      this.getTenantMedicalClinicCrossProductHandoffCenterV60UseCase.execute(
        input,
      ),
      this.getTenantMedicalClinicProductCloseoutUseCase.execute(input),
    ]);
    const closeoutChecklist: TenantMedicalClinicOperatingCloseoutV60['closeoutChecklist'] =
      [
        check(
          'command_center',
          'Command center 6.0',
          commandCenter.commandStatus,
          ['medical_clinic_command_center_v60'],
        ),
        check(
          'patient_identity_consent',
          'Patient identity and consent queue',
          patientQueue.queueStatus,
          ['patient_identity_consent_queue_v60'],
        ),
        check(
          'appointment_encounter_ops',
          'Appointment and encounter queue',
          appointmentQueue.queueStatus,
          ['appointment_encounter_queue_v60'],
        ),
        check(
          'cross_product_handoffs',
          'Growth/Billing/Tax handoff center',
          handoffCenter.handoffStatus,
          ['clinic_cross_product_handoff_center_v60'],
        ),
        check(
          'product_closeout',
          'Product closeout',
          productCloseout.closeoutStatus,
          ['medical_clinic_product_closeout'],
        ),
      ];
    const blockers = [
      ...commandCenter.productCloseout.remainingGaps,
      ...patientQueue.blockers,
      ...appointmentQueue.blockers,
      ...handoffCenter.blockers,
      ...productCloseout.remainingGaps,
    ];
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((entry) => entry.status),
      blockers,
    );

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      commandCenter,
      patientQueue,
      appointmentQueue,
      handoffCenter,
      productCloseout,
      closeoutChecklist,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter(
          (entry) => entry.status === 'ready',
        ).length,
        blockerCount: new Set(blockers).size,
        patientActionCount: patientQueue.summary.blockedPatientCount,
        appointmentActionCount:
          appointmentQueue.summary.reminderReviewCount +
          appointmentQueue.summary.billingReviewCount +
          appointmentQueue.summary.encounterReviewCount,
        handoffLaneCount: handoffCenter.summary.laneCount,
      },
      recommendedNextProduct:
        closeoutStatus === 'ready'
          ? 'medical_clinics_operational_pilot'
          : productCloseout.recommendedNextProduct ===
              'medical-clinics-ehr-discovery'
            ? 'medical_clinics_ehr_discovery'
            : 'psychology_clinics_followup',
      nextStep:
        closeoutStatus === 'ready'
          ? 'Medical Clinics puede entrar a piloto operativo sin EHR legal.'
          : 'Resolver queues y handoffs antes de tratar Medical Clinics como piloto listo.',
      guardrails: [
        'Closeout 6.0 activa operacion; no convierte la plataforma en EHR legal.',
        'No diagnostica, prescribe oficialmente, firma historias clinicas ni automatiza mensajes clinicos.',
        'Billing, Tax y Growth permanecen como handoffs revisados hacia productos transversales.',
      ],
    };
  }
}

function check(
  key: string,
  label: string,
  status: MedicalClinicReadinessStatus,
  evidenceRefs: string[],
): TenantMedicalClinicOperatingCloseoutV60['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
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
