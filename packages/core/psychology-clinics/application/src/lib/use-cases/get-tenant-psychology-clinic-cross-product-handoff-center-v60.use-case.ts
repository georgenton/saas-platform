import {
  PsychologyClinicReadinessStatus,
  TenantPsychologyClinicCrossProductHandoffCenterV60,
} from '@saas-platform/psychology-clinics-domain';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';
import { GetTenantPsychologyClinicBoundaryComplianceCloseoutUseCase } from './get-tenant-psychology-clinic-boundary-compliance-closeout.use-case';
import { GetTenantPsychologyClinicProductReadinessReportUseCase } from './get-tenant-psychology-clinic-product-readiness-report.use-case';
import { RequestTenantPsychologyClinicBillingTaxBridgeUseCase } from './request-tenant-psychology-clinic-billing-tax-bridge.use-case';
import { RequestTenantPsychologyClinicGrowthReminderBridgeUseCase } from './request-tenant-psychology-clinic-growth-reminder-bridge.use-case';

export class GetTenantPsychologyClinicCrossProductHandoffCenterV60UseCase {
  constructor(
    private readonly requestTenantPsychologyClinicGrowthReminderBridgeUseCase: RequestTenantPsychologyClinicGrowthReminderBridgeUseCase,
    private readonly requestTenantPsychologyClinicBillingTaxBridgeUseCase: RequestTenantPsychologyClinicBillingTaxBridgeUseCase,
    private readonly getTenantPsychologyClinicProductReadinessReportUseCase: GetTenantPsychologyClinicProductReadinessReportUseCase,
    private readonly getTenantPsychologyClinicBoundaryComplianceCloseoutUseCase: GetTenantPsychologyClinicBoundaryComplianceCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicCrossProductHandoffCenterV60> {
    const [growthBridge, billingTaxBridge, readinessReport, boundaryCloseout] =
      await Promise.all([
        this.requestTenantPsychologyClinicGrowthReminderBridgeUseCase.execute(input),
        this.requestTenantPsychologyClinicBillingTaxBridgeUseCase.execute(input),
        this.getTenantPsychologyClinicProductReadinessReportUseCase.execute(input),
        this.getTenantPsychologyClinicBoundaryComplianceCloseoutUseCase.execute(
          input,
        ),
      ]);
    const lanes: TenantPsychologyClinicCrossProductHandoffCenterV60['lanes'] = [
      lane(
        'growth_reminders',
        'growth',
        'Growth reminder handoff',
        growthBridge.bridgeStatus,
        ['psychology_growth_reminder_bridge'],
        growthBridge.nextStep,
      ),
      lane(
        'ai_boundary',
        'ai',
        'AI clinic assistant boundary',
        boundaryCloseout.closeoutStatus,
        ['psychology_boundary_compliance_closeout'],
        'Usar AI solo como sugerencia explicable y revisada por humano.',
      ),
      lane(
        'billing_invoiceable_items',
        'invoicing',
        'Billing and invoice readiness',
        billingTaxBridge.bridgeStatus,
        ['psychology_billing_tax_bridge'],
        billingTaxBridge.nextStep,
      ),
      lane(
        'tax_evidence',
        'tax-compliance-ec',
        'Tax Compliance EC evidence',
        billingTaxBridge.bridgeStatus,
        ['psychology_billing_tax_bridge', 'tax_compliance_evidence_handoff'],
        'Enviar evidencia fiscal solo como handoff revisado.',
      ),
      lane(
        'parties_identity',
        'parties',
        'Parties fiscal identity',
        readinessReport.reportStatus === 'blocked' ? 'blocked' : 'needs_review',
        ['psychology_product_readiness_report'],
        'Validar identidad fiscal del paciente/cliente antes de facturacion.',
      ),
    ];
    const blockers = [
      ...growthBridge.blockers,
      ...billingTaxBridge.blockers,
      ...readinessReport.blockers,
      ...boundaryCloseout.blockers,
    ];
    const handoffStatus = resolveStatus(
      lanes.map((entry) => entry.status),
      blockers,
    );

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      handoffStatus,
      lanes,
      summary: {
        laneCount: lanes.length,
        readyLaneCount: lanes.filter((entry) => entry.status === 'ready').length,
        needsReviewLaneCount: lanes.filter(
          (entry) => entry.status === 'needs_review',
        ).length,
        blockedLaneCount: lanes.filter((entry) => entry.status === 'blocked')
          .length,
      },
      blockers,
      nextStep:
        handoffStatus === 'ready'
          ? 'Handoffs transversales listos para piloto operado.'
          : 'Revisar Growth, AI, Billing/Tax y Parties antes de cerrar Psychology 6.0.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function lane(
  key: string,
  targetProduct: TenantPsychologyClinicCrossProductHandoffCenterV60['lanes'][number]['targetProduct'],
  label: string,
  status: PsychologyClinicReadinessStatus,
  evidenceRefs: string[],
  nextAction: string,
): TenantPsychologyClinicCrossProductHandoffCenterV60['lanes'][number] {
  return { key, targetProduct, label, status, evidenceRefs, nextAction };
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
