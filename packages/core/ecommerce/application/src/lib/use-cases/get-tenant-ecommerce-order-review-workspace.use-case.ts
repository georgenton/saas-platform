import { TenantEcommerceOrderReviewWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderDraftDetailUseCase } from './get-tenant-ecommerce-order-draft-detail.use-case';
import { RequestTenantEcommerceCheckoutCloseoutPacketUseCase } from './request-tenant-ecommerce-checkout-closeout-packet.use-case';
import { RequestTenantEcommerceOrderToGrowthConversationBridgeUseCase } from './request-tenant-ecommerce-order-to-growth-conversation-bridge.use-case';

export class GetTenantEcommerceOrderReviewWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderDraftDetailUseCase: GetTenantEcommerceOrderDraftDetailUseCase,
    private readonly requestTenantEcommerceCheckoutCloseoutPacketUseCase: RequestTenantEcommerceCheckoutCloseoutPacketUseCase,
    private readonly requestTenantEcommerceOrderToGrowthConversationBridgeUseCase: RequestTenantEcommerceOrderToGrowthConversationBridgeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderReviewWorkspaceView | null> {
    const [orderDraftDetail, closeoutPacket, growthBridge] = await Promise.all([
      this.getTenantEcommerceOrderDraftDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
      this.requestTenantEcommerceCheckoutCloseoutPacketUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
      this.requestTenantEcommerceOrderToGrowthConversationBridgeUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
    ]);

    if (!orderDraftDetail || !closeoutPacket || !growthBridge) {
      return null;
    }

    const blockedBy = [
      ...orderDraftDetail.blockedBy,
      ...closeoutPacket.blockedBy,
      ...growthBridge.blockedBy,
    ];

    const reviewStatus =
      blockedBy.length > 0
        ? 'blocked'
        : closeoutPacket.closeoutStatus === 'ready_for_operator_closeout' &&
            growthBridge.bridgeStatus === 'ready_for_growth_follow_up'
          ? 'ready_for_operator_review'
          : 'needs_data';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: orderDraftDetail.productEntity,
      orderDraft: orderDraftDetail.orderDraft,
      reviewStatus,
      summary:
        reviewStatus === 'ready_for_operator_review'
          ? 'La orden ya tiene una mesa de revisión suficientemente clara para cierre asistido, seguimiento y handoff.'
          : reviewStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar esta orden como revisión operable.'
            : 'La orden ya puede verse como review workspace, pero todavía faltan señales del comprador o consistencia de salida.',
      reviewSnapshot: {
        captureStatus: orderDraftDetail.orderDraft.captureStatus,
        closeoutStatus: closeoutPacket.closeoutStatus,
        invoiceReadinessStatus: closeoutPacket.invoicingReadiness.status,
        growthBridgeStatus: growthBridge.bridgeStatus,
      },
      reviewChecklist: [
        'Confirmar que offer, pricing y CTA siguen siendo coherentes en checkout, cierre y seguimiento.',
        'Verificar si la orden ya puede salir a facturación o si primero conviene seguimiento comercial.',
        'Dejar explícito el siguiente operador y el siguiente workspace del flujo.',
      ],
      nextActions: [
        ...orderDraftDetail.nextActions,
        ...closeoutPacket.closeoutChecklist.slice(0, 2),
        ...growthBridge.followUpChecklist.slice(0, 1),
      ],
      blockedBy,
      guardrails: [
        ...new Set([
          ...orderDraftDetail.guardrails,
          ...closeoutPacket.guardrails,
          ...growthBridge.guardrails,
          'No tratar este review workspace como aprobación automática de venta ni como despacho final.',
        ]),
      ],
    };
  }
}
