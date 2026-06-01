import { TenantEcommerceOrderInvoicingBridgeView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase } from './get-tenant-ecommerce-checkout-order-intake-workspace.use-case';
import { GetTenantEcommerceStoreProfileWorkspaceUseCase } from './get-tenant-ecommerce-store-profile-workspace.use-case';

export class RequestTenantEcommerceOrderInvoicingBridgeUseCase {
  constructor(
    private readonly getTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase: GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
    private readonly getTenantEcommerceStoreProfileWorkspaceUseCase: GetTenantEcommerceStoreProfileWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderInvoicingBridgeView | null> {
    const [checkoutWorkspace, profileWorkspace] = await Promise.all([
      this.getTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.getTenantEcommerceStoreProfileWorkspaceUseCase.execute(tenantSlug),
    ]);

    if (!checkoutWorkspace || !profileWorkspace) {
      return null;
    }

    const invoicingConnection =
      profileWorkspace.connections.find((entry) => entry.key === 'invoicing') ??
      null;

    const blockedBy = [
      ...(checkoutWorkspace.checkoutStatus === 'blocked'
        ? ['El checkout order intake todavía está bloqueado para handoff fiscal.']
        : []),
      ...(invoicingConnection?.status === 'blocked'
        ? ['La conexión con Invoicing todavía no está lista para recibir una orden asistida.']
        : []),
    ];

    const bridgeStatus =
      blockedBy.length > 0
        ? 'blocked'
        : checkoutWorkspace.checkoutStatus === 'ready_for_order_intake' &&
            invoicingConnection?.status === 'ready'
          ? 'ready_for_invoice_handoff'
          : 'needs_customer_fiscal_data';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: checkoutWorkspace.productEntity,
      bridgeStatus,
      summary:
        bridgeStatus === 'ready_for_invoice_handoff'
          ? 'La orden ya tiene suficiente forma comercial para bajar un handoff ordenado hacia Invoicing.'
          : bridgeStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar esta orden como handoff fiscal listo.'
            : 'El bridge ya se puede preparar, pero todavía conviene completar datos del comprador y señales fiscales antes del handoff.',
      targetWorkspace: {
        productKey: 'invoicing',
        stage: 'electronic_invoicing_ec_mvp',
        handoffMode: 'operator_assist',
      },
      orderDraft: { ...checkoutWorkspace.checkoutDraft },
      invoiceReadiness: {
        connectionStatus:
          invoicingConnection?.status === 'ready'
            ? 'ready'
            : invoicingConnection?.status === 'blocked'
              ? 'blocked'
              : 'warning',
        buyerProfileStatus:
          checkoutWorkspace.checkoutStatus === 'ready_for_order_intake'
            ? 'ready'
            : checkoutWorkspace.checkoutStatus === 'blocked'
              ? 'blocked'
              : 'needs_customer_fiscal_data',
        suggestedDocument: 'invoice',
      },
      fiscalRequirements: [
        'buyer_legal_name',
        'buyer_tax_id_or_document',
        'billing_email',
        'accepted_offer_snapshot',
        'channel_close_reference',
      ],
      handoffArtifacts: [
        'Order intake snapshot',
        'Pricing and CTA confirmation',
        'Billing intent confirmation',
      ],
      blockedBy,
      guardrails: [
        ...checkoutWorkspace.guardrails.slice(0, 2),
        'No convertir este bridge en emisión viva de factura ni cobro automático todavía.',
      ],
    };
  }
}
