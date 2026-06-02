import { TenantEcommerceOrderToInvoiceReadinessPacketView } from '@saas-platform/ecommerce-domain';
import { RequestTenantEcommerceCheckoutCustomerCapturePacketUseCase } from './request-tenant-ecommerce-checkout-customer-capture-packet.use-case';
import { RequestTenantEcommerceOrderInvoicingBridgeUseCase } from './request-tenant-ecommerce-order-invoicing-bridge.use-case';

export class RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase {
  constructor(
    private readonly requestTenantEcommerceCheckoutCustomerCapturePacketUseCase: RequestTenantEcommerceCheckoutCustomerCapturePacketUseCase,
    private readonly requestTenantEcommerceOrderInvoicingBridgeUseCase: RequestTenantEcommerceOrderInvoicingBridgeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderToInvoiceReadinessPacketView | null> {
    const [capturePacket, invoicingBridge] = await Promise.all([
      this.requestTenantEcommerceCheckoutCustomerCapturePacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceOrderInvoicingBridgeUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!capturePacket || !invoicingBridge) {
      return null;
    }

    const missingFields =
      invoicingBridge.bridgeStatus === 'ready_for_invoice_handoff'
        ? []
        : ['buyer_legal_name', 'buyer_tax_id_or_document', 'billing_email'];

    const blockedBy = [...capturePacket.blockedBy, ...invoicingBridge.blockedBy];

    const readinessStatus =
      blockedBy.length > 0
        ? 'blocked'
        : capturePacket.captureStatus === 'ready_for_order_draft' &&
            invoicingBridge.bridgeStatus === 'ready_for_invoice_handoff'
          ? 'ready_to_invoice'
          : 'needs_data';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: capturePacket.productEntity,
      readinessStatus,
      summary:
        readinessStatus === 'ready_to_invoice'
          ? 'La orden ya tiene una lectura suficientemente sólida para bajar un handoff asistido hacia Invoicing.'
          : readinessStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar este packet como orden lista para facturación.'
            : 'La orden ya puede perfilarse para factura, pero todavía faltan datos mínimos del comprador.',
      targetWorkspace: {
        productKey: 'invoicing',
        stage: 'electronic_invoicing_ec_mvp',
        handoffMode: 'operator_assist',
      },
      readinessSnapshot: {
        captureStatus: capturePacket.captureStatus,
        bridgeStatus: invoicingBridge.bridgeStatus,
        buyerProfileStatus: invoicingBridge.invoiceReadiness.buyerProfileStatus,
      },
      fiscalRequirements: [...invoicingBridge.fiscalRequirements],
      missingFields,
      handoffArtifacts: [...invoicingBridge.handoffArtifacts],
      operatorChecklist: [
        ...capturePacket.captureForm.validationRules.slice(0, 2),
        'Confirmar que el buyer profile coincide con el canal de cierre.',
        'Adjuntar snapshot comercial antes del handoff fiscal.',
      ],
      blockedBy,
      guardrails: [
        ...capturePacket.guardrails.slice(0, 2),
        ...invoicingBridge.guardrails.slice(0, 1),
        'No convertir este readiness packet en emisión viva de factura todavía.',
      ],
    };
  }
}
