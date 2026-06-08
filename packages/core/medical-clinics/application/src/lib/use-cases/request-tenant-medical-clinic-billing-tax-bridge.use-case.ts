import { TenantMedicalClinicBillingTaxBridge } from '@saas-platform/medical-clinics-domain';

export class RequestTenantMedicalClinicBillingTaxBridgeUseCase {
  constructor(private readonly nowProvider: () => Date = () => new Date()) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicBillingTaxBridge> {
    const invoiceableItems: TenantMedicalClinicBillingTaxBridge['invoiceableItems'] =
      [
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

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      bridgeStatus: 'blocked',
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
      blockers: [
        'Paciente pediatrico requiere party fiscal del representante.',
        'No hay item listo para factura electronica hasta completar datos fiscales.',
      ],
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
