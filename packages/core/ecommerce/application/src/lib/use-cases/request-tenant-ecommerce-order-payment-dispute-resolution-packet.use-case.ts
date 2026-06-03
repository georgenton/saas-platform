import { TenantEcommerceOrderPaymentDisputeResolutionPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderHoldResolutionWorkspaceUseCase } from './get-tenant-ecommerce-order-hold-resolution-workspace.use-case';
import { GetTenantEcommerceOrderPaymentDisputeWorkspaceUseCase } from './get-tenant-ecommerce-order-payment-dispute-workspace.use-case';

export class RequestTenantEcommerceOrderPaymentDisputeResolutionPacketUseCase {
  constructor(
    private readonly getTenantEcommerceOrderPaymentDisputeWorkspaceUseCase: GetTenantEcommerceOrderPaymentDisputeWorkspaceUseCase,
    private readonly getTenantEcommerceOrderHoldResolutionWorkspaceUseCase: GetTenantEcommerceOrderHoldResolutionWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderPaymentDisputeResolutionPacketView | null> {
    const [disputeWorkspace, holdWorkspace] = await Promise.all([
      this.getTenantEcommerceOrderPaymentDisputeWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
      this.getTenantEcommerceOrderHoldResolutionWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
    ]);

    if (!disputeWorkspace || !holdWorkspace) {
      return null;
    }

    const blockedBy = [
      ...disputeWorkspace.blockedBy,
      ...holdWorkspace.blockedBy,
    ];

    const resolutionDecision =
      disputeWorkspace.disputeStatus === 'confirmed'
        ? 'confirmed'
        : disputeWorkspace.disputeStatus === 'hold'
          ? blockedBy.length > 0
            ? 'escalated'
            : 'hold'
          : 'escalated';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: disputeWorkspace.productEntity,
      orderDraft: disputeWorkspace.orderDraft,
      resolutionDecision,
      summary:
        resolutionDecision === 'confirmed'
          ? 'La disputa ya se puede dar por resuelta y la orden puede volver al flujo operativo.'
          : resolutionDecision === 'hold'
            ? 'La disputa queda en hold controlado hasta reunir evidencia o destrabar la orden.'
            : 'La disputa necesita escalación operativa antes de seguir avanzando con cobro o fulfillment.',
      resolutionOwner: {
        productKey: 'ecommerce',
        role: 'operator',
      },
      requiredEvidence: [...disputeWorkspace.disputeProfile.expectedEvidence],
      resolutionChecklist: [
        ...disputeWorkspace.resolutionPaths.map((path) => path.label),
        holdWorkspace.nextStep,
      ],
      nextStep:
        resolutionDecision === 'confirmed'
          ? 'Seguir con fulfillment o confirmación final de cierre sin mantener la orden en disputa.'
          : resolutionDecision === 'hold'
            ? holdWorkspace.nextStep
            : 'Escalar con owner operativo y evidencia consolidada antes de liberar la orden.',
      blockedBy,
      guardrails: [
        ...new Set([
          ...disputeWorkspace.guardrails,
          ...holdWorkspace.guardrails,
          'Este packet orienta la resolución de la disputa; no sustituye conciliación financiera formal.',
        ]),
      ],
    };
  }
}
