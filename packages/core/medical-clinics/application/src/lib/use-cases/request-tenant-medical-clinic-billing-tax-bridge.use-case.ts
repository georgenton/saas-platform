import { TenantMedicalClinicBillingTaxBridge } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicIdGenerator } from '../ports/id-generators';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';

export class RequestTenantMedicalClinicBillingTaxBridgeUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly idGenerator?: MedicalClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicBillingTaxBridge> {
    const appointments =
      (await this.operationsRepository?.listAppointments(input.tenantSlug)) ??
      [];
    const invoiceableItems: TenantMedicalClinicBillingTaxBridge['invoiceableItems'] =
      appointments.length > 0
        ? appointments
            .filter((appointment) => appointment.amountInCents !== null)
            .map((appointment) => ({
              appointmentId: appointment.id,
              patientDisplayName: appointment.patientDisplayName,
              serviceName: appointment.serviceName,
              amount: (appointment.amountInCents ?? 0) / 100,
              currency: 'USD',
              partyStatus:
                appointment.blockers.length > 0 ? 'blocked' : 'needs_review',
              invoiceDraftStatus: appointment.billingStatus,
              taxEvidenceStatus: appointment.billingStatus,
            }))
        : [
            {
              appointmentId: 'appointment_001',
              patientDisplayName: 'Maria Calderon',
              serviceName: 'Consulta general',
              amount: 35,
              currency: 'USD',
              partyStatus: 'needs_review',
              invoiceDraftStatus: 'needs_review',
              taxEvidenceStatus: 'needs_review',
            },
            {
              appointmentId: 'appointment_003',
              patientDisplayName: 'Luis Andrade',
              serviceName: 'Consulta pediatrica',
              amount: 45,
              currency: 'USD',
              partyStatus: 'blocked',
              invoiceDraftStatus: 'blocked',
              taxEvidenceStatus: 'blocked',
            },
          ];
    const blockers = invoiceableItems.some(
      (item) =>
        item.partyStatus === 'blocked' || item.invoiceDraftStatus === 'blocked',
    )
      ? [
          'Paciente requiere party fiscal del paciente o representante.',
          'Hay items sin readiness suficiente para factura electronica.',
        ]
      : [];
    const tenantId = await this.operationsRepository?.getTenantIdBySlug(
      input.tenantSlug,
    );

    if (tenantId && this.idGenerator) {
      await this.operationsRepository?.recordEvent({
        id: this.idGenerator.generate(),
        tenantId,
        tenantSlug: input.tenantSlug,
        appointmentId: null,
        eventType: 'billing_tax_bridge_requested',
        source: 'medical-clinics',
        status: blockers.length > 0 ? 'blocked' : 'needs_review',
        payload: {
          invoiceableItemCount: invoiceableItems.length,
          partyReviewCount: invoiceableItems.filter(
            (item) => item.partyStatus !== 'ready',
          ).length,
        },
        occurredAt: this.nowProvider(),
      });
    }

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      bridgeStatus: blockers.length > 0 ? 'blocked' : 'needs_review',
      invoiceableItems,
      handoff: {
        invoicingProductKey: 'invoicing',
        taxComplianceProductKey: 'tax-compliance-ec',
        partyDirectoryRequired: true,
      },
      summary: {
        invoiceableItemCount: invoiceableItems.length,
        readyInvoiceDraftCount: invoiceableItems.filter(
          (item) => item.invoiceDraftStatus === 'ready',
        ).length,
        partyReviewCount: invoiceableItems.filter(
          (item) => item.partyStatus !== 'ready',
        ).length,
        taxEvidenceReviewCount: invoiceableItems.filter(
          (item) => item.taxEvidenceStatus !== 'ready',
        ).length,
      },
      blockers,
      nextStep:
        'Completar party fiscal de paciente/representante y preparar invoice draft en Invoicing.',
      guardrails: [
        'Clinics no emite comprobantes electronicos directamente.',
        'El puente prepara evidencia para Invoicing y Tax Compliance EC.',
        'No calcula obligaciones tributarias finales ni reemplaza revision fiscal.',
      ],
    };
  }
}
