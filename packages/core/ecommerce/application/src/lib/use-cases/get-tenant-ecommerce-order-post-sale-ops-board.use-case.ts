import {
  TenantEcommerceOrderPostSaleOpsBoardEntryView,
  TenantEcommerceOrderPostSaleOpsBoardView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase } from './get-tenant-ecommerce-order-fulfillment-delivery-workspace.use-case';
import { GetTenantEcommerceOrderPaymentConfirmationLogUseCase } from './get-tenant-ecommerce-order-payment-confirmation-log.use-case';
import { ListTenantEcommerceOrderPostSaleLifecyclesUseCase } from './list-tenant-ecommerce-order-post-sale-lifecycles.use-case';

export class GetTenantEcommerceOrderPostSaleOpsBoardUseCase {
  constructor(
    private readonly listTenantEcommerceOrderPostSaleLifecyclesUseCase: ListTenantEcommerceOrderPostSaleLifecyclesUseCase,
    private readonly getTenantEcommerceOrderPaymentConfirmationLogUseCase: GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
    private readonly getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase: GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderPostSaleOpsBoardView | null> {
    const postSaleRegistry =
      await this.listTenantEcommerceOrderPostSaleLifecyclesUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!postSaleRegistry) {
      return null;
    }

    const entries = await Promise.all(
      postSaleRegistry.orders.map(async (order) => {
        const [paymentLog, deliveryWorkspace] = await Promise.all([
          this.getTenantEcommerceOrderPaymentConfirmationLogUseCase.execute(
            tenantSlug,
            productEntityId,
            order.orderDraftId,
          ),
          this.getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase.execute(
            tenantSlug,
            productEntityId,
            order.orderDraftId,
          ),
        ]);

        if (!paymentLog || !deliveryWorkspace) {
          return null;
        }

        const opsStatus =
          deliveryWorkspace.deliveryStatus === 'blocked' ||
          paymentLog.logStatus === 'disputed' ||
          order.currentStatus === 'blocked'
            ? 'blocked'
            : paymentLog.logStatus !== 'confirmed'
              ? 'awaiting_payment'
              : deliveryWorkspace.deliveryStatus === 'in_progress'
                ? 'ready_for_fulfillment'
                : 'in_progress';

        const priorityBand =
          opsStatus === 'blocked'
            ? 'critical'
            : opsStatus === 'awaiting_payment' ||
                opsStatus === 'ready_for_fulfillment'
              ? 'high'
              : 'monitor';

        const entry: TenantEcommerceOrderPostSaleOpsBoardEntryView = {
          orderDraftId: order.orderDraftId,
          orderLabel: order.orderLabel,
          opsStatus,
          priorityBand,
          paymentLogStatus: paymentLog.logStatus,
          deliveryStatus: deliveryWorkspace.deliveryStatus,
          attentionReason:
            opsStatus === 'blocked'
              ? 'La orden mantiene fricción entre cobro, lifecycle y entrega.'
              : opsStatus === 'awaiting_payment'
                ? 'Todavía conviene cerrar confirmación de cobro antes de empujar fulfillment.'
                : opsStatus === 'ready_for_fulfillment'
                  ? 'La orden ya puede pasar a ejecución de fulfillment.'
                  : 'La orden ya está más cerca de ejecución post-venta y requiere seguimiento ligero.',
          nextAction: deliveryWorkspace.nextStep,
          updatedAt: order.updatedAt,
        };

        return entry;
      }),
    );

    const trackedEntries = entries.filter(
      (
        entry,
      ): entry is TenantEcommerceOrderPostSaleOpsBoardEntryView => entry !== null,
    );

    const awaitingPaymentCount = trackedEntries.filter(
      (entry) => entry.opsStatus === 'awaiting_payment',
    ).length;
    const readyForFulfillmentCount = trackedEntries.filter(
      (entry) => entry.opsStatus === 'ready_for_fulfillment',
    ).length;
    const inProgressCount = trackedEntries.filter(
      (entry) => entry.opsStatus === 'in_progress',
    ).length;
    const blockedCount = trackedEntries.filter(
      (entry) => entry.opsStatus === 'blocked',
    ).length;
    const criticalCount = trackedEntries.filter(
      (entry) => entry.priorityBand === 'critical',
    ).length;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: postSaleRegistry.productEntity,
      summary: {
        totalOrders: trackedEntries.length,
        awaitingPaymentCount,
        readyForFulfillmentCount,
        inProgressCount,
        blockedCount,
        criticalCount,
        headline:
          trackedEntries.length > 0
            ? 'Ya existe una mesa post-sale consolidada para cobro, entrega y seguimiento operativo.'
            : 'Todavía no hay órdenes suficientes para una mesa post-sale operable.',
        detail:
          trackedEntries.length > 0
            ? 'Usa esta vista para separar cobros pendientes, órdenes listas para fulfillment y bloqueos post-venta.'
            : 'Sigue avanzando órdenes al tramo post-sale para poblar esta mesa operativa.',
      },
      focusLanes: [
        {
          laneKey: 'awaiting_payment',
          count: awaitingPaymentCount,
          operatorBias:
            'Cerrar confirmación de cobro antes de empujar la entrega.',
        },
        {
          laneKey: 'ready_for_fulfillment',
          count: readyForFulfillmentCount,
          operatorBias:
            'Priorizar órdenes que ya están listas para activación o entrega.',
        },
        {
          laneKey: 'in_progress',
          count: inProgressCount,
          operatorBias:
            'Dar seguimiento ligero a órdenes ya encaminadas en post-venta.',
        },
        {
          laneKey: 'blocked',
          count: blockedCount,
          operatorBias:
            'Atender primero lo que frena cobro, delivery o cierre operativo.',
        },
      ],
      entries: trackedEntries,
    };
  }
}
