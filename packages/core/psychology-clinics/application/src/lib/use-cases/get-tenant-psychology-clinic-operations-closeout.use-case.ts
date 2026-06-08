import { TenantPsychologyClinicOperationsCloseout } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import {
  defaultProfile,
  psychologyGuardrails,
} from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicOperationsCloseoutUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicOperationsCloseout> {
    const [profile, patients, sessions, events] = await Promise.all([
      this.operationsRepository?.getProfile(input.tenantSlug),
      this.operationsRepository?.listPatients(input.tenantSlug),
      this.operationsRepository?.listSessions(input.tenantSlug),
      this.operationsRepository?.listEvents(input.tenantSlug),
    ]);
    const snapshot = profile ?? defaultProfile();
    const patientCount = patients?.length ?? 0;
    const sessionCount = sessions?.length ?? 0;
    const noteDraftCount =
      events?.filter(
        (event) =>
          event.eventType === 'psychology_session_note_draft_packet_requested',
      ).length ?? 0;
    const completedSessionCount =
      sessions?.filter((session) => session.status === 'completed').length ?? 0;
    const closedLayers: TenantPsychologyClinicOperationsCloseout['closedLayers'] =
      [
        layer('foundation', 'Foundation', 'ready', 'product anchor + API'),
        layer(
          'product_activation_ui',
          'Product activation UI',
          'needs_review',
          'web console',
        ),
        layer(
          'treatment_plans',
          'Treatment plans',
          patientCount > 0 ? 'needs_review' : 'blocked',
          `${patientCount} patients`,
        ),
        layer(
          'follow_up',
          'Follow-up readiness',
          completedSessionCount > 0 ? 'needs_review' : 'blocked',
          `${completedSessionCount} completed sessions`,
        ),
        layer(
          'growth_bridge',
          'Growth reminders bridge',
          sessionCount > 0 ? 'needs_review' : 'blocked',
          `${sessionCount} sessions`,
        ),
        layer(
          'billing_tax_bridge',
          'Billing and Tax bridge',
          completedSessionCount > 0 ? 'needs_review' : 'blocked',
          `${completedSessionCount} invoiceable sessions`,
        ),
        layer(
          'timeline',
          'Patient timeline',
          noteDraftCount > 0 ? 'needs_review' : 'blocked',
          `${noteDraftCount} note draft packets`,
        ),
      ];
    const blockers = [
      ...snapshot.blockers,
      ...closedLayers
        .filter((item) => item.status === 'blocked')
        .map((item) => item.label),
    ];

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      closeoutStatus:
        blockers.length > 0
          ? 'blocked'
          : closedLayers.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      closedLayers,
      productReadiness: {
        foundationReady: true,
        productActivationReady: true,
        treatmentPlansReady: patientCount > 0,
        growthBridgeReady: sessionCount > 0,
        billingTaxBridgeReady: completedSessionCount > 0,
        timelineReady: noteDraftCount > 0,
      },
      summary: {
        patientCount,
        sessionCount,
        operationalEventCount: events?.length ?? 0,
        blockerCount: blockers.length,
      },
      remainingGaps: blockers,
      recommendedNextProduct: 'psychology-records-hardening',
      nextStep:
        blockers.length > 0
          ? 'Completar pacientes, sesiones, note draft y bridges antes de cerrar.'
          : 'Preparar hardening de records psicologicos.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function layer(
  key: string,
  label: string,
  status: TenantPsychologyClinicOperationsCloseout['closedLayers'][number]['status'],
  evidence: string,
): TenantPsychologyClinicOperationsCloseout['closedLayers'][number] {
  return { key, label, status, evidence };
}
