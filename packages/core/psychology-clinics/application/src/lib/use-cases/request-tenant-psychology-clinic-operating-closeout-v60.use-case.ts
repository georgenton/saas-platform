import {
  PsychologyClinicReadinessStatus,
  TenantPsychologyClinicOperatingCloseoutV60,
} from '@saas-platform/psychology-clinics-domain';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';
import { GetTenantPsychologyClinicCloseoutV5UseCase } from './get-tenant-psychology-clinic-closeout-v5.use-case';
import { GetTenantPsychologyClinicCommandCenterV60UseCase } from './get-tenant-psychology-clinic-command-center-v60.use-case';
import { GetTenantPsychologyClinicCrossProductHandoffCenterV60UseCase } from './get-tenant-psychology-clinic-cross-product-handoff-center-v60.use-case';
import { GetTenantPsychologyClinicPatientPrivacyRiskQueueV60UseCase } from './get-tenant-psychology-clinic-patient-privacy-risk-queue-v60.use-case';
import { GetTenantPsychologyClinicSessionTreatmentQueueV60UseCase } from './get-tenant-psychology-clinic-session-treatment-queue-v60.use-case';

export class RequestTenantPsychologyClinicOperatingCloseoutV60UseCase {
  constructor(
    private readonly getTenantPsychologyClinicCommandCenterV60UseCase: GetTenantPsychologyClinicCommandCenterV60UseCase,
    private readonly getTenantPsychologyClinicPatientPrivacyRiskQueueV60UseCase: GetTenantPsychologyClinicPatientPrivacyRiskQueueV60UseCase,
    private readonly getTenantPsychologyClinicSessionTreatmentQueueV60UseCase: GetTenantPsychologyClinicSessionTreatmentQueueV60UseCase,
    private readonly getTenantPsychologyClinicCrossProductHandoffCenterV60UseCase: GetTenantPsychologyClinicCrossProductHandoffCenterV60UseCase,
    private readonly getTenantPsychologyClinicCloseoutV5UseCase: GetTenantPsychologyClinicCloseoutV5UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicOperatingCloseoutV60> {
    const [
      commandCenter,
      privacyRiskQueue,
      sessionTreatmentQueue,
      handoffCenter,
      productCloseout,
    ] = await Promise.all([
      this.getTenantPsychologyClinicCommandCenterV60UseCase.execute(input),
      this.getTenantPsychologyClinicPatientPrivacyRiskQueueV60UseCase.execute(
        input,
      ),
      this.getTenantPsychologyClinicSessionTreatmentQueueV60UseCase.execute(
        input,
      ),
      this.getTenantPsychologyClinicCrossProductHandoffCenterV60UseCase.execute(
        input,
      ),
      this.getTenantPsychologyClinicCloseoutV5UseCase.execute(input),
    ]);
    const closeoutChecklist: TenantPsychologyClinicOperatingCloseoutV60['closeoutChecklist'] =
      [
        check('command_center', 'Command center 6.0', commandCenter.commandStatus, [
          'psychology_command_center_v60',
        ]),
        check(
          'privacy_risk_queue',
          'Patient privacy and risk queue',
          privacyRiskQueue.queueStatus,
          ['psychology_patient_privacy_risk_queue_v60'],
        ),
        check(
          'session_treatment_queue',
          'Session and treatment queue',
          sessionTreatmentQueue.queueStatus,
          ['psychology_session_treatment_queue_v60'],
        ),
        check(
          'cross_product_handoffs',
          'Growth/AI/Billing/Tax/Parties handoff center',
          handoffCenter.handoffStatus,
          ['psychology_cross_product_handoff_center_v60'],
        ),
        check('product_closeout', 'Product closeout V5', productCloseout.closeoutStatus, [
          'psychology_closeout_v5',
        ]),
      ];
    const blockers = [
      ...privacyRiskQueue.blockers,
      ...sessionTreatmentQueue.blockers,
      ...handoffCenter.blockers,
      ...productCloseout.blockers,
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
      privacyRiskQueue,
      sessionTreatmentQueue,
      handoffCenter,
      productCloseout,
      closeoutChecklist,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter(
          (entry) => entry.status === 'ready',
        ).length,
        blockerCount: new Set(blockers).size,
        patientActionCount:
          privacyRiskQueue.summary.highPriorityCount +
          privacyRiskQueue.summary.pendingConsentCount +
          privacyRiskQueue.summary.pendingRiskReviewCount,
        sessionActionCount:
          sessionTreatmentQueue.summary.reminderReviewCount +
          sessionTreatmentQueue.summary.billingReviewCount +
          sessionTreatmentQueue.summary.treatmentReviewCount +
          sessionTreatmentQueue.summary.therapistReviewCount,
        handoffLaneCount: handoffCenter.summary.laneCount,
      },
      recommendedNextProduct:
        closeoutStatus === 'ready'
          ? 'psychology_clinics_operational_pilot'
          : productCloseout.decision.recommendedNextProduct === 'accounting'
            ? 'psychology_external_ehr_discovery'
            : 'tax_compliance_ec_followup',
      nextStep:
        closeoutStatus === 'ready'
          ? 'Psychology Clinics puede entrar a piloto operativo sin EHR legal.'
          : 'Resolver privacy/risk, sesiones, treatment y handoffs antes del piloto.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function check(
  key: string,
  label: string,
  status: PsychologyClinicReadinessStatus,
  evidenceRefs: string[],
): TenantPsychologyClinicOperatingCloseoutV60['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
}

function resolveStatus(
  statuses: PsychologyClinicReadinessStatus[],
  blockers: string[],
): PsychologyClinicReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
