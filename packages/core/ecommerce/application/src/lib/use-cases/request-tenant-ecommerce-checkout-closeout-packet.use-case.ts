import { TenantEcommerceCheckoutCloseoutPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderDraftDetailUseCase } from './get-tenant-ecommerce-order-draft-detail.use-case';
import { RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase } from './request-tenant-ecommerce-order-to-invoice-readiness-packet.use-case';

export class RequestTenantEcommerceCheckoutCloseoutPacketUseCase {
  constructor(
    private readonly getTenantEcommerceOrderDraftDetailUseCase: GetTenantEcommerceOrderDraftDetailUseCase,
    private readonly requestTenantEcommerceOrderToInvoiceReadinessPacketUseCase: RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceCheckoutCloseoutPacketView | null> {
    const [orderDraftDetail, invoiceReadiness] = await Promise.all([
      this.getTenantEcommerceOrderDraftDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
      this.requestTenantEcommerceOrderToInvoiceReadinessPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!orderDraftDetail || !invoiceReadiness) {
      return null;
    }

    const blockedBy = [
      ...orderDraftDetail.blockedBy,
      ...invoiceReadiness.blockedBy,
    ];

    const closeoutStatus =
      blockedBy.length > 0
        ? 'blocked'
        : orderDraftDetail.orderDraft.status === 'ready_for_review' &&
            invoiceReadiness.readinessStatus === 'ready_to_invoice'
          ? 'ready_for_operator_closeout'
          : 'needs_data';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: orderDraftDetail.productEntity,
      orderDraft: orderDraftDetail.orderDraft,
      closeoutStatus,
      summary:
        closeoutStatus === 'ready_for_operator_closeout'
          ? 'La orden ya tiene suficiente forma comercial y fiscal para un closeout asistido.'
          : closeoutStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar esta orden como closeout operable.'
            : 'La orden ya puede perfilarse para closeout, pero todavía faltan datos mínimos del comprador.',
      commercialSnapshot: {
        offerTitle: orderDraftDetail.orderDraft.offerTitle,
        pricingSnapshot: orderDraftDetail.orderDraft.pricingSnapshot,
        primaryCta: orderDraftDetail.orderDraft.primaryCta,
        closingChannel: orderDraftDetail.orderDraft.closingChannel,
      },
      paymentReadiness: {
        status:
          orderDraftDetail.orderDraft.captureStatus === 'ready_for_order_draft'
            ? 'ready'
            : orderDraftDetail.orderDraft.captureStatus === 'blocked'
              ? 'blocked'
              : 'needs_customer_input',
        hint:
          orderDraftDetail.orderDraft.captureStatus === 'ready_for_order_draft'
            ? 'La intención comercial ya tiene suficiente estructura para un cierre operado.'
            : 'Conviene cerrar buyer profile y confirmación explícita antes del closeout final.',
      },
      invoicingReadiness: {
        status: invoiceReadiness.readinessStatus,
        detail:
          invoiceReadiness.readinessStatus === 'ready_to_invoice'
            ? 'El handoff fiscal ya tiene suficiente forma para bajar después del closeout.'
            : 'Todavía faltan datos fiscales mínimos antes de tratar la orden como salida final.',
      },
      closeoutChecklist: [
        'Confirmar oferta, pricing y CTA como una sola narrativa de cierre.',
        'Validar buyer profile y expectativa de seguimiento antes del handoff.',
        'Dejar explícito qué sigue: facturación, seguimiento o cierre conversacional.',
      ],
      missingFields: [...orderDraftDetail.orderDraft.missingFields],
      blockedBy,
      guardrails: [
        ...new Set([
          ...orderDraftDetail.guardrails,
          ...invoiceReadiness.guardrails,
          'No convertir este closeout packet en cobro vivo ni fulfillment automático todavía.',
        ]),
      ],
    };
  }
}
