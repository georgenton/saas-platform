import { TenantEcommerceOrderFulfillmentCompletionPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase } from './get-tenant-ecommerce-order-fulfillment-delivery-workspace.use-case';
import { GetTenantEcommerceOrderPaymentConfirmationLogUseCase } from './get-tenant-ecommerce-order-payment-confirmation-log.use-case';
import { GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase } from './get-tenant-ecommerce-order-post-sale-lifecycle-detail.use-case';

export class RequestTenantEcommerceOrderFulfillmentCompletionPacketUseCase {
  constructor(
    private readonly getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase: GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
    private readonly getTenantEcommerceOrderPaymentConfirmationLogUseCase: GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
    private readonly getTenantEcommerceOrderPostSaleLifecycleDetailUseCase: GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderFulfillmentCompletionPacketView | null> {
    const [deliveryWorkspace, paymentLog, postSaleLifecycle] = await Promise.all(
      [
        this.getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderPaymentConfirmationLogUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderPostSaleLifecycleDetailUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
      ],
    );

    if (!deliveryWorkspace || !paymentLog || !postSaleLifecycle) {
      return null;
    }

    const blockedBy = [
      ...deliveryWorkspace.blockedBy,
      ...paymentLog.blockedBy,
      ...postSaleLifecycle.blockedBy,
    ];

    const completionStatus =
      blockedBy.length > 0 ||
      deliveryWorkspace.deliveryStatus === 'blocked' ||
      paymentLog.logStatus === 'disputed'
        ? 'blocked'
        : deliveryWorkspace.deliveryStatus === 'delivered' ||
            postSaleLifecycle.currentStatus === 'paid'
          ? 'completed'
          : 'partial';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: deliveryWorkspace.productEntity,
      orderDraft: deliveryWorkspace.orderDraft,
      completionStatus,
      summary:
        completionStatus === 'completed'
          ? 'La orden ya tiene señales suficientes para tratar la entrega como cerrada.'
          : completionStatus === 'blocked'
            ? 'La entrega no debería cerrarse todavía porque mantiene bloqueos operativos.'
            : 'La orden ya avanzó en entrega, pero todavía necesita cierre operativo explícito.',
      deliveryResult: {
        fulfillmentType: deliveryWorkspace.deliveryProfile.fulfillmentType,
        deliveryMode: deliveryWorkspace.deliveryProfile.deliveryMode,
        ownerRole: deliveryWorkspace.deliveryProfile.ownerRole,
        resultLabel:
          completionStatus === 'completed'
            ? 'Entrega cerrada o activación finalizada.'
            : completionStatus === 'blocked'
              ? 'Entrega detenida por fricción de cobro o lifecycle.'
              : 'Entrega avanzada pero todavía sin cierre final.',
      },
      completionChecklist: [
        ...deliveryWorkspace.prerequisitesResolved,
        `Payment log ${paymentLog.logStatus}.`,
        `Lifecycle ${postSaleLifecycle.currentStatus}.`,
      ],
      operatorNotes: [
        ...deliveryWorkspace.handoffNotes,
        `Operator note de cobro: ${paymentLog.confirmationRecord.operatorNote}`,
      ],
      nextStep:
        completionStatus === 'completed'
          ? 'Cerrar seguimiento post-entrega y mover la orden a monitoreo ligero.'
          : completionStatus === 'blocked'
            ? 'Resolver bloqueo antes de registrar la entrega como finalizada.'
            : 'Completar evidencia final y marcar cierre de la entrega o activación.',
      blockedBy,
      guardrails: [
        ...new Set([
          ...deliveryWorkspace.guardrails,
          ...paymentLog.guardrails,
          ...postSaleLifecycle.guardrails,
          'Este packet cierra entrega de manera operativa; no sustituye comprobantes externos ni SLAs contractuales.',
        ]),
      ],
    };
  }
}
