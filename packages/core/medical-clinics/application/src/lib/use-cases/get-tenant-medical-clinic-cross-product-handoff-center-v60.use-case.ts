import {
  MedicalClinicReadinessStatus,
  TenantMedicalClinicCrossProductHandoffCenterV60,
} from '@saas-platform/medical-clinics-domain';
import { RequestTenantMedicalClinicBillingTaxBridgeUseCase } from './request-tenant-medical-clinic-billing-tax-bridge.use-case';
import { RequestTenantMedicalClinicGrowthReminderBridgeUseCase } from './request-tenant-medical-clinic-growth-reminder-bridge.use-case';

export class GetTenantMedicalClinicCrossProductHandoffCenterV60UseCase {
  constructor(
    private readonly requestTenantMedicalClinicGrowthReminderBridgeUseCase: RequestTenantMedicalClinicGrowthReminderBridgeUseCase,
    private readonly requestTenantMedicalClinicBillingTaxBridgeUseCase: RequestTenantMedicalClinicBillingTaxBridgeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicCrossProductHandoffCenterV60> {
    const [growthBridge, billingTaxBridge] = await Promise.all([
      this.requestTenantMedicalClinicGrowthReminderBridgeUseCase.execute(input),
      this.requestTenantMedicalClinicBillingTaxBridgeUseCase.execute(input),
    ]);
    const handoffLanes: TenantMedicalClinicCrossProductHandoffCenterV60['handoffLanes'] =
      [
        lane(
          'growth_reminders',
          'WhatsApp reminders reviewed handoff',
          'growth',
          growthBridge.bridgeStatus,
          growthBridge.reminders.map((reminder) => reminder.appointmentId),
          growthBridge.nextStep,
        ),
        lane(
          'invoice_readiness',
          'Invoice draft readiness',
          'invoicing',
          billingTaxBridge.bridgeStatus,
          billingTaxBridge.invoiceableItems.map((item) => item.appointmentId),
          billingTaxBridge.nextStep,
        ),
        lane(
          'tax_evidence',
          'Tax Compliance EC evidence handoff',
          'tax-compliance-ec',
          billingTaxBridge.summary.taxEvidenceReviewCount > 0
            ? 'needs_review'
            : billingTaxBridge.bridgeStatus,
          ['billing_tax_bridge', 'medical_service_evidence'],
          'Revisar evidencia tributaria antes de usarla en Tax Compliance EC.',
        ),
        lane(
          'party_fiscal_checks',
          'Party fiscal checks',
          'parties',
          billingTaxBridge.summary.partyReviewCount > 0
            ? 'needs_review'
            : 'ready',
          ['billing_tax_bridge', 'party_directory_required'],
          'Completar party/fiscal identity antes de factura o soporte fiscal.',
        ),
      ];
    const blockers = [...growthBridge.blockers, ...billingTaxBridge.blockers];
    const handoffStatus = resolveStatus(
      handoffLanes.map((entry) => entry.status),
      blockers,
    );

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      handoffStatus,
      growthBridge,
      billingTaxBridge,
      handoffLanes,
      summary: {
        laneCount: handoffLanes.length,
        readyLaneCount: handoffLanes.filter((entry) => entry.status === 'ready')
          .length,
        blockerCount: blockers.length,
        invoiceableItemCount: billingTaxBridge.summary.invoiceableItemCount,
        reminderCount: growthBridge.reminders.length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        handoffStatus === 'ready'
          ? 'Handoffs transversales listos para Growth, Billing y Tax.'
          : 'Resolver handoffs pendientes antes de closeout operativo.',
      guardrails: [
        'Medical Clinics prepara handoffs; no envia mensajes automaticos.',
        'No emite facturas ni declara impuestos desde la clinica.',
      ],
    };
  }
}

function lane(
  key: string,
  label: string,
  targetProduct: TenantMedicalClinicCrossProductHandoffCenterV60['handoffLanes'][number]['targetProduct'],
  status: MedicalClinicReadinessStatus,
  evidenceRefs: string[],
  nextAction: string,
): TenantMedicalClinicCrossProductHandoffCenterV60['handoffLanes'][number] {
  return { key, label, targetProduct, status, evidenceRefs, nextAction };
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
