import { TenantEcommerceOrderFulfillmentDeliveryWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase } from './get-tenant-ecommerce-order-fulfillment-execution-workspace.use-case';
import { GetTenantEcommerceOrderPaymentConfirmationLogUseCase } from './get-tenant-ecommerce-order-payment-confirmation-log.use-case';
import { GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase } from './get-tenant-ecommerce-order-post-sale-lifecycle-detail.use-case';

export class GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderPaymentConfirmationLogUseCase: GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
    private readonly getTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase: GetTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase,
    private readonly getTenantEcommerceOrderPostSaleLifecycleDetailUseCase: GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderFulfillmentDeliveryWorkspaceView | null> {
    const [paymentLog, fulfillmentExecutionWorkspace, postSaleLifecycle] =
      await Promise.all([
        this.getTenantEcommerceOrderPaymentConfirmationLogUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderPostSaleLifecycleDetailUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
      ]);

    if (!paymentLog || !fulfillmentExecutionWorkspace || !postSaleLifecycle) {
      return null;
    }

    const blockedBy = [
      ...paymentLog.blockedBy,
      ...fulfillmentExecutionWorkspace.blockedBy,
      ...postSaleLifecycle.blockedBy,
    ];

    const deliveryStatus =
      blockedBy.length > 0 || paymentLog.logStatus === 'disputed'
        ? 'blocked'
        : postSaleLifecycle.currentStatus === 'paid'
          ? 'delivered'
          : 'in_progress';

    const fulfillmentType =
      fulfillmentExecutionWorkspace.fulfillmentProfile.fulfillmentType;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: fulfillmentExecutionWorkspace.productEntity,
      orderDraft: fulfillmentExecutionWorkspace.orderDraft,
      deliveryStatus,
      summary:
        deliveryStatus === 'delivered'
          ? 'La orden ya puede tratarse como entrega cerrada dentro de esta base post-venta.'
          : deliveryStatus === 'blocked'
            ? 'La entrega todavía tiene bloqueos y conviene mantenerla detenida.'
            : 'La orden ya puede bajarse a una mesa operativa de entrega o activación.',
      deliveryProfile: {
        ...fulfillmentExecutionWorkspace.fulfillmentProfile,
        deliveryMode:
          fulfillmentType === 'service'
            ? 'service_activation'
            : fulfillmentType === 'digital'
              ? 'guided_handoff'
              : 'manual_execution',
      },
      handoffNotes: [
        `Cobro en estado ${paymentLog.logStatus}.`,
        `Lifecycle post-sale en ${postSaleLifecycle.currentStatus}.`,
        `Delivery channel ${fulfillmentExecutionWorkspace.fulfillmentProfile.deliveryChannel}.`,
      ],
      prerequisitesResolved:
        fulfillmentExecutionWorkspace.executionStatus === 'ready_to_execute'
          ? [...fulfillmentExecutionWorkspace.executionChecklist]
          : [],
      executionSignals: {
        paymentLogStatus: paymentLog.logStatus,
        fulfillmentExecutionStatus:
          fulfillmentExecutionWorkspace.executionStatus,
        postSaleStatus: postSaleLifecycle.currentStatus,
      },
      nextStep:
        deliveryStatus === 'delivered'
          ? 'Mantener trazabilidad del cierre y preparar seguimiento post-entrega si hace falta.'
          : deliveryStatus === 'blocked'
            ? 'Resolver cobro, lifecycle o readiness antes de ejecutar entrega.'
            : 'Asignar owner operativo y ejecutar la entrega o activación usando el canal definido.',
      blockedBy,
      guardrails: [
        ...new Set([
          ...paymentLog.guardrails,
          ...fulfillmentExecutionWorkspace.guardrails,
          ...postSaleLifecycle.guardrails,
          'Este workspace modela entrega operativa fundacional; no cubre tracking logístico completo ni SLA final.',
        ]),
      ],
    };
  }
}
