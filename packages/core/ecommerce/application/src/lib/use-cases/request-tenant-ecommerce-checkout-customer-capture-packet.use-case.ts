import { TenantEcommerceCheckoutCustomerCapturePacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase } from './get-tenant-ecommerce-checkout-order-intake-workspace.use-case';
import { GetTenantEcommerceLiveStorefrontSessionWorkspaceUseCase } from './get-tenant-ecommerce-live-storefront-session-workspace.use-case';
import { RequestTenantEcommerceOrderInvoicingBridgeUseCase } from './request-tenant-ecommerce-order-invoicing-bridge.use-case';

export class RequestTenantEcommerceCheckoutCustomerCapturePacketUseCase {
  constructor(
    private readonly getTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase: GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
    private readonly getTenantEcommerceLiveStorefrontSessionWorkspaceUseCase: GetTenantEcommerceLiveStorefrontSessionWorkspaceUseCase,
    private readonly requestTenantEcommerceOrderInvoicingBridgeUseCase: RequestTenantEcommerceOrderInvoicingBridgeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceCheckoutCustomerCapturePacketView | null> {
    const [checkoutWorkspace, liveSession, invoicingBridge] = await Promise.all([
      this.getTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.getTenantEcommerceLiveStorefrontSessionWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceOrderInvoicingBridgeUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!checkoutWorkspace || !liveSession || !invoicingBridge) {
      return null;
    }

    const blockedBy = [
      ...checkoutWorkspace.blockedBy,
      ...invoicingBridge.blockedBy,
      ...(liveSession.sessionStatus === 'blocked'
        ? [
            'La sesión viva del storefront todavía no está lista para capturar un comprador real.',
          ]
        : []),
    ];

    const captureStatus =
      blockedBy.length > 0
        ? 'blocked'
        : checkoutWorkspace.checkoutStatus === 'ready_for_order_intake' &&
            liveSession.sessionStatus !== 'blocked'
          ? 'ready_for_order_draft'
          : 'needs_customer_input';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: checkoutWorkspace.productEntity,
      captureStatus,
      summary:
        captureStatus === 'ready_for_order_draft'
          ? 'La captura del comprador ya tiene suficiente estructura para bajar un draft de orden asistido.'
          : captureStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar este packet como captura operable.'
            : 'La captura ya se puede preparar, pero todavía conviene completar señales del comprador y consistencia comercial.',
      orderDraftSeed: { ...checkoutWorkspace.checkoutDraft },
      captureForm: {
        requiredFields: [
          'full_name',
          'email',
          'whatsapp_phone',
          'offer_confirmation',
          'billing_intent',
        ],
        optionalFields: ['buyer_company', 'buyer_tax_id_or_document'],
        validationRules: [
          'Confirmar explícitamente oferta, precio y CTA antes de cerrar la orden.',
          'Validar canal de seguimiento si el comprador no cierra en el primer contacto.',
          'No avanzar a facturación sin intención explícita de compra.',
        ],
      },
      billingReadiness: {
        status:
          invoicingBridge.bridgeStatus === 'ready_for_invoice_handoff'
            ? 'ready'
            : invoicingBridge.bridgeStatus === 'blocked'
              ? 'blocked'
              : 'needs_customer_input',
        hint:
          invoicingBridge.bridgeStatus === 'ready_for_invoice_handoff'
            ? 'El buyer profile ya tiene suficiente forma para un handoff fiscal asistido.'
            : 'Conviene capturar nombre legal, correo de facturación e intención de documento antes del handoff.',
      },
      operatorPrompts: [
        checkoutWorkspace.checkoutDraft.customerPrompt,
        `Usar ${liveSession.storefrontSnapshot.primaryCta} como CTA verbal de cierre.`,
        'Pedir confirmación de facturación y canal de seguimiento en el mismo cierre.',
      ],
      blockedBy,
      guardrails: [
        ...checkoutWorkspace.guardrails.slice(0, 2),
        ...liveSession.guardrails.slice(0, 1),
        'No tratar este packet como checkout publicado ni como cobro vivo todavía.',
      ],
    };
  }
}
