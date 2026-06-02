import { TenantEcommerceOrderGrowthFollowUpWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderDraftDetailUseCase } from './get-tenant-ecommerce-order-draft-detail.use-case';
import { RequestTenantEcommerceOrderToGrowthConversationBridgeUseCase } from './request-tenant-ecommerce-order-to-growth-conversation-bridge.use-case';

export class GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderDraftDetailUseCase: GetTenantEcommerceOrderDraftDetailUseCase,
    private readonly requestTenantEcommerceOrderToGrowthConversationBridgeUseCase: RequestTenantEcommerceOrderToGrowthConversationBridgeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderGrowthFollowUpWorkspaceView | null> {
    const [orderDraftDetail, growthBridge] = await Promise.all([
      this.getTenantEcommerceOrderDraftDetailUseCase.execute(
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

    if (!orderDraftDetail || !growthBridge) {
      return null;
    }

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: orderDraftDetail.productEntity,
      orderDraft: orderDraftDetail.orderDraft,
      workspaceStatus: growthBridge.bridgeStatus,
      summary:
        growthBridge.bridgeStatus === 'ready_for_growth_follow_up'
          ? 'La orden ya puede operar un follow-up claro hacia Growth sin perder el contexto comercial.'
          : growthBridge.bridgeStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene abrir un follow-up workspace sobre esta orden.'
            : 'La orden ya puede perfilarse para seguimiento, aunque todavía conviene confirmar buyer intent.',
      targetWorkspace: { ...growthBridge.targetWorkspace },
      followUpPlan: {
        leadLabel: growthBridge.conversationSeed.leadLabel,
        opener: growthBridge.conversationSeed.opener,
        nextStep:
          growthBridge.followUpChecklist[1] ??
          'Confirmar siguiente paso comercial antes de cerrar el hilo.',
        objectionHint:
          growthBridge.followUpChecklist[0] ??
          'Mantener el CTA y la oferta consistentes durante el seguimiento.',
        closeCta: growthBridge.conversationSeed.closeCta,
      },
      handoffArtifacts: [...growthBridge.handoffArtifacts],
      operatorChecklist: [
        ...growthBridge.followUpChecklist,
        'Registrar explícitamente si la conversación va a seguimiento inmediato o a espera de confirmación.',
      ],
      blockedBy: [...growthBridge.blockedBy],
      guardrails: [
        ...new Set([
          ...orderDraftDetail.guardrails,
          ...growthBridge.guardrails,
          'No tratar este workspace como automatización viva de seguimiento ni como close loop automático.',
        ]),
      ],
    };
  }
}
