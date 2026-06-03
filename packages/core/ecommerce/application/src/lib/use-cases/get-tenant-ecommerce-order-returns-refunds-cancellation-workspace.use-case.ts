import { TenantEcommerceOrderReturnsRefundsCancellationWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase } from './get-tenant-ecommerce-order-fulfillment-delivery-workspace.use-case';
import { GetTenantEcommerceOrderPaymentDisputeWorkspaceUseCase } from './get-tenant-ecommerce-order-payment-dispute-workspace.use-case';
import { GetTenantEcommerceOrderPaymentConfirmationLogUseCase } from './get-tenant-ecommerce-order-payment-confirmation-log.use-case';

export class GetTenantEcommerceOrderReturnsRefundsCancellationWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderPaymentConfirmationLogUseCase: GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
    private readonly getTenantEcommerceOrderPaymentDisputeWorkspaceUseCase: GetTenantEcommerceOrderPaymentDisputeWorkspaceUseCase,
    private readonly getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase: GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderReturnsRefundsCancellationWorkspaceView | null> {
    const [paymentLog, disputeWorkspace, deliveryWorkspace] = await Promise.all(
      [
        this.getTenantEcommerceOrderPaymentConfirmationLogUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderPaymentDisputeWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
      ],
    );

    if (!paymentLog || !disputeWorkspace || !deliveryWorkspace) {
      return null;
    }

    const blockedBy = [
      ...paymentLog.blockedBy,
      ...disputeWorkspace.blockedBy,
      ...deliveryWorkspace.blockedBy,
    ];
    const resolutionStatus =
      blockedBy.length > 0
        ? 'blocked'
        : deliveryWorkspace.deliveryStatus === 'delivered'
          ? 'return_review'
          : paymentLog.logStatus === 'confirmed' ||
              disputeWorkspace.disputeStatus === 'needs_review'
            ? 'eligible_for_refund_review'
            : 'eligible_for_cancellation';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: paymentLog.productEntity,
      orderDraft: paymentLog.orderDraft,
      resolutionStatus,
      summary:
        resolutionStatus === 'eligible_for_cancellation'
          ? 'La orden puede revisarse para cancelación operativa antes de fulfillment completo.'
          : resolutionStatus === 'eligible_for_refund_review'
            ? 'La orden requiere revisión de refund porque ya existen señales de cobro o disputa.'
            : resolutionStatus === 'return_review'
              ? 'La orden ya tiene entrega y debe tratarse como return/reversal review, no como cancelación simple.'
              : 'La operación de cancelación, refund o devolución está bloqueada.',
      lifecycleSignals: {
        paymentLogStatus: paymentLog.logStatus,
        deliveryStatus: deliveryWorkspace.deliveryStatus,
        disputeStatus: disputeWorkspace.disputeStatus,
      },
      resolutionOptions: [
        {
          key: 'cancel',
          label: 'Cancel order',
          detail: 'Usar solo si no hay entrega cerrada ni cobro conciliado.',
        },
        {
          key: 'refund_review',
          label: 'Review refund',
          detail: 'Requiere evidencia de pago, disputa y decision operativa.',
        },
        {
          key: 'return_review',
          label: 'Review return',
          detail: 'Aplica cuando ya existe entrega o activacion de servicio.',
        },
        {
          key: 'escalate',
          label: 'Escalate exception',
          detail: 'Usar cuando pago, factura o fulfillment están en conflicto.',
        },
      ],
      guardrailChecklist: [
        'No cancelar como simple si existe deliveryStatus delivered.',
        'No aprobar refund sin revisar evidencia de payment log.',
        'No tratar una disputa activa como devolución cerrada.',
      ],
      blockedBy,
      nextStep:
        resolutionStatus === 'eligible_for_cancellation'
          ? 'Validar que no exista entrega antes de preparar cancelación operativa.'
          : resolutionStatus === 'eligible_for_refund_review'
            ? 'Reunir evidencia de cobro y abrir revisión de refund.'
            : resolutionStatus === 'return_review'
              ? 'Abrir revisión de return/reversal con evidencia de entrega.'
              : 'Resolver bloqueos antes de proponer cancelación, refund o devolución.',
      guardrails: [
        ...new Set([
          ...paymentLog.guardrails,
          ...disputeWorkspace.guardrails,
          ...deliveryWorkspace.guardrails,
          'Este workspace no ejecuta reversos, notas de credito ni devoluciones reales todavia.',
        ]),
      ],
    };
  }
}
