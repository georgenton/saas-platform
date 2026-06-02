import { TenantEcommerceOrderToGrowthConversationBridgeView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderDraftDetailUseCase } from './get-tenant-ecommerce-order-draft-detail.use-case';
import { RequestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase } from './request-tenant-ecommerce-whatsapp-growth-execution-bridge.use-case';

export class RequestTenantEcommerceOrderToGrowthConversationBridgeUseCase {
  constructor(
    private readonly getTenantEcommerceOrderDraftDetailUseCase: GetTenantEcommerceOrderDraftDetailUseCase,
    private readonly requestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase: RequestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderToGrowthConversationBridgeView | null> {
    const [orderDraftDetail, whatsappBridge] = await Promise.all([
      this.getTenantEcommerceOrderDraftDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
      this.requestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!orderDraftDetail || !whatsappBridge) {
      return null;
    }

    const blockedBy = [
      ...orderDraftDetail.blockedBy,
      ...(whatsappBridge.bridgeStatus === 'blocked'
        ? ['El bridge de WhatsApp hacia Growth todavía no está listo para seguimiento conversacional.']
        : []),
    ];

    const bridgeStatus =
      blockedBy.length > 0
        ? 'blocked'
        : orderDraftDetail.orderDraft.status === 'ready_for_review'
          ? 'ready_for_growth_follow_up'
          : 'needs_customer_confirmation';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: orderDraftDetail.productEntity,
      orderDraft: orderDraftDetail.orderDraft,
      bridgeStatus,
      summary:
        bridgeStatus === 'ready_for_growth_follow_up'
          ? 'La orden ya puede bajar a un seguimiento conversacional asistido por Growth.'
          : bridgeStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene abrir seguimiento conversacional sobre esta orden.'
            : 'La orden ya puede perfilarse para Growth, aunque todavía conviene confirmar mejor el buyer profile.',
      targetWorkspace: {
        productKey: 'growth',
        channel: 'whatsapp',
        handoffMode: 'operator_assist',
      },
      conversationSeed: {
        leadLabel:
          orderDraftDetail.orderDraft.customerProfile.fullName ??
          orderDraftDetail.orderDraft.offerTitle,
        opener: whatsappBridge.executionPayload.opener,
        closeCta: whatsappBridge.executionPayload.closingCta,
        followUpChannel: orderDraftDetail.orderDraft.closingChannel,
      },
      handoffArtifacts: [
        'Order draft snapshot',
        'Buyer intent summary',
        'Offer and pricing confirmation',
        ...whatsappBridge.bridgeArtifacts.slice(0, 2),
      ],
      followUpChecklist: [
        'Mantener consistente el CTA entre checkout y WhatsApp.',
        'Explicitar siguiente paso comercial antes de cerrar el hilo.',
        'No perder referencia del order draft al handoff hacia Growth.',
      ],
      blockedBy,
      guardrails: [
        ...new Set([
          ...orderDraftDetail.guardrails,
          ...whatsappBridge.guardrails,
          'No tratar este bridge como automatización viva de seguimiento todavía.',
        ]),
      ],
    };
  }
}
