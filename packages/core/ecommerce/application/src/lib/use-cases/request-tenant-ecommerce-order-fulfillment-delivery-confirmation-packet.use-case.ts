import { TenantEcommerceOrderFulfillmentDeliveryConfirmationPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase } from './get-tenant-ecommerce-order-fulfillment-delivery-workspace.use-case';
import { RequestTenantEcommerceOrderFulfillmentCompletionPacketUseCase } from './request-tenant-ecommerce-order-fulfillment-completion-packet.use-case';

export class RequestTenantEcommerceOrderFulfillmentDeliveryConfirmationPacketUseCase {
  constructor(
    private readonly getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase: GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
    private readonly requestTenantEcommerceOrderFulfillmentCompletionPacketUseCase: RequestTenantEcommerceOrderFulfillmentCompletionPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderFulfillmentDeliveryConfirmationPacketView | null> {
    const [deliveryWorkspace, completionPacket] = await Promise.all([
      this.getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
      this.requestTenantEcommerceOrderFulfillmentCompletionPacketUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
    ]);

    if (!deliveryWorkspace || !completionPacket) {
      return null;
    }

    const blockedBy = [
      ...deliveryWorkspace.blockedBy,
      ...completionPacket.blockedBy,
    ];

    const confirmationStatus =
      completionPacket.completionStatus === 'blocked' ||
      deliveryWorkspace.deliveryStatus === 'blocked' ||
      blockedBy.length > 0
        ? 'blocked'
        : completionPacket.completionStatus === 'completed' ||
            deliveryWorkspace.deliveryStatus === 'delivered'
          ? 'delivered'
          : 'partial';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: deliveryWorkspace.productEntity,
      orderDraft: deliveryWorkspace.orderDraft,
      confirmationStatus,
      summary:
        confirmationStatus === 'delivered'
          ? 'La orden ya tiene señales suficientes para dar la entrega o activación por confirmada.'
          : confirmationStatus === 'blocked'
            ? 'La entrega todavía no debería confirmarse porque persisten bloqueos operativos.'
            : 'La entrega ya avanzó, pero todavía necesita evidencia o cierre final de confirmación.',
      confirmationRecord: {
        deliveryMode: deliveryWorkspace.deliveryProfile.deliveryMode,
        deliveryChannel: deliveryWorkspace.deliveryProfile.deliveryChannel,
        ownerRole: deliveryWorkspace.deliveryProfile.ownerRole,
        resultLabel:
          confirmationStatus === 'delivered'
            ? 'Entrega o activación confirmada para cierre operativo.'
            : confirmationStatus === 'blocked'
              ? 'Entrega frenada hasta resolver bloqueo o evidencia faltante.'
              : 'Entrega parcialmente confirmada, todavía sin cierre completo.',
      },
      evidenceChecklist: [
        ...completionPacket.completionChecklist,
        ...deliveryWorkspace.prerequisitesResolved,
      ],
      operatorNotes: [
        ...completionPacket.operatorNotes,
        ...deliveryWorkspace.handoffNotes,
      ],
      nextStep:
        confirmationStatus === 'delivered'
          ? 'Mover la orden a monitoreo post-entrega y conservar solo seguimiento ligero.'
          : confirmationStatus === 'blocked'
            ? 'Resolver bloqueo antes de registrar la entrega como confirmada.'
            : 'Completar evidencia final y cerrar la confirmación de entrega o activación.',
      blockedBy,
      guardrails: [
        ...new Set([
          ...deliveryWorkspace.guardrails,
          ...completionPacket.guardrails,
          'Este packet confirma entrega de forma operativa; no sustituye comprobantes externos del fulfillment.',
        ]),
      ],
    };
  }
}
