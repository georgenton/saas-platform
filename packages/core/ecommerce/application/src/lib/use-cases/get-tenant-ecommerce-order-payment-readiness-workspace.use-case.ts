import { TenantEcommerceOrderPaymentReadinessWorkspaceView } from '@saas-platform/ecommerce-domain';
import { RequestTenantEcommerceCheckoutCloseoutPacketUseCase } from './request-tenant-ecommerce-checkout-closeout-packet.use-case';
import { RequestTenantEcommerceInvoiceHandoffAcknowledgementUseCase } from './request-tenant-ecommerce-invoice-handoff-acknowledgement.use-case';

export class GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase {
  constructor(
    private readonly requestTenantEcommerceCheckoutCloseoutPacketUseCase: RequestTenantEcommerceCheckoutCloseoutPacketUseCase,
    private readonly requestTenantEcommerceInvoiceHandoffAcknowledgementUseCase: RequestTenantEcommerceInvoiceHandoffAcknowledgementUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderPaymentReadinessWorkspaceView | null> {
    const [closeoutPacket, invoiceAcknowledgement] = await Promise.all([
      this.requestTenantEcommerceCheckoutCloseoutPacketUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
      this.requestTenantEcommerceInvoiceHandoffAcknowledgementUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
    ]);

    if (!closeoutPacket || !invoiceAcknowledgement) {
      return null;
    }

    const blockedBy = [
      ...closeoutPacket.blockedBy,
      ...invoiceAcknowledgement.blockedBy,
    ];

    const workspaceStatus =
      blockedBy.length > 0
        ? 'blocked'
        : closeoutPacket.paymentReadiness.status === 'ready' &&
            invoiceAcknowledgement.acknowledgementStatus === 'accepted'
          ? 'ready_for_collection'
          : 'needs_confirmation';

    const frictionPoints = [
      ...(closeoutPacket.paymentReadiness.status === 'ready'
        ? []
        : [closeoutPacket.paymentReadiness.hint]),
      ...(invoiceAcknowledgement.acknowledgementStatus === 'accepted'
        ? []
        : invoiceAcknowledgement.missingSignals),
    ];

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: closeoutPacket.productEntity,
      orderDraft: closeoutPacket.orderDraft,
      workspaceStatus,
      summary:
        workspaceStatus === 'ready_for_collection'
          ? 'La orden ya tiene suficiente forma comercial y fiscal para operarse como cobro esperado.'
          : workspaceStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar esta orden como lista para cobro.'
            : 'La orden ya se puede revisar como cobro esperado, pero todavía necesita confirmaciones adicionales.',
      paymentPlan: {
        collectionChannel: closeoutPacket.orderDraft.closingChannel,
        pricingSnapshot: closeoutPacket.commercialSnapshot.pricingSnapshot,
        billingIntent: closeoutPacket.orderDraft.customerProfile.billingIntent,
        primaryCta: closeoutPacket.commercialSnapshot.primaryCta,
      },
      invoiceSignal: {
        acknowledgementStatus: invoiceAcknowledgement.acknowledgementStatus,
        detail:
          invoiceAcknowledgement.acknowledgementStatus === 'accepted'
            ? 'El handoff fiscal ya fue aceptado como preparación operable.'
            : 'Todavía falta cerrar mejor el handoff hacia Invoicing antes de operar cobro con confianza.',
      },
      closeoutSignal: {
        closeoutStatus: closeoutPacket.closeoutStatus,
        paymentReadinessStatus: closeoutPacket.paymentReadiness.status,
      },
      readinessChecklist: [
        'Confirmar que el buyer entiende el siguiente paso de cobro.',
        'Mantener consistente el pricing snapshot con el canal de cierre.',
        'No perder trazabilidad entre closeout, handoff fiscal y seguimiento comercial.',
      ],
      frictionPoints: [...new Set(frictionPoints)],
      nextStep:
        workspaceStatus === 'ready_for_collection'
          ? 'Operar la orden como pendiente de cobro y mantener visible el estado posterior al handoff.'
          : workspaceStatus === 'blocked'
            ? 'Resolver bloqueos fiscales o comerciales antes de tratar la orden como cobro esperado.'
            : 'Completar confirmaciones de buyer intent o recepción fiscal antes del siguiente paso.',
      blockedBy,
      guardrails: [
        ...new Set([
          ...closeoutPacket.guardrails,
          ...invoiceAcknowledgement.guardrails,
          'Este workspace modela readiness de cobro, no confirmación de pago real ni conciliación bancaria.',
        ]),
      ],
    };
  }
}
