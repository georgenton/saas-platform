import {
  TenantEcommerceOrderPostSaleReportingBoardEntryView,
  TenantEcommerceOrderPostSaleReportingBoardView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase } from './get-tenant-ecommerce-order-fulfillment-delivery-workspace.use-case';
import { GetTenantEcommerceOrderPaymentConfirmationLogUseCase } from './get-tenant-ecommerce-order-payment-confirmation-log.use-case';
import { ListTenantEcommerceOrderPostSaleLifecyclesUseCase } from './list-tenant-ecommerce-order-post-sale-lifecycles.use-case';

export class GetTenantEcommerceOrderPostSaleReportingBoardUseCase {
  constructor(
    private readonly listTenantEcommerceOrderPostSaleLifecyclesUseCase: ListTenantEcommerceOrderPostSaleLifecyclesUseCase,
    private readonly getTenantEcommerceOrderPaymentConfirmationLogUseCase: GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
    private readonly getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase: GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderPostSaleReportingBoardView | null> {
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

        const reportingStatus =
          order.currentStatus === 'blocked' ||
          paymentLog.logStatus === 'disputed' ||
          deliveryWorkspace.deliveryStatus === 'blocked'
            ? 'blocked'
            : order.currentStatus === 'paid'
              ? 'paid'
              : deliveryWorkspace.deliveryStatus === 'delivered'
                ? 'delivered'
                : 'in_progress';

        const driftSignal =
          paymentLog.logStatus === 'confirmed' &&
          deliveryWorkspace.deliveryStatus !== 'delivered' &&
          order.currentStatus !== 'paid'
            ? 'payment_without_delivery'
            : deliveryWorkspace.deliveryStatus === 'delivered' &&
                order.currentStatus !== 'paid'
              ? 'delivery_without_paid_lifecycle'
              : 'aligned';

        const entry: TenantEcommerceOrderPostSaleReportingBoardEntryView = {
          orderDraftId: order.orderDraftId,
          orderLabel: order.orderLabel,
          reportingStatus,
          paymentLogStatus: paymentLog.logStatus,
          deliveryStatus: deliveryWorkspace.deliveryStatus,
          driftSignal,
          nextAction:
            driftSignal === 'payment_without_delivery'
              ? 'Cerrar entrega o activación para no dejar revenue sin fulfillment.'
              : driftSignal === 'delivery_without_paid_lifecycle'
                ? 'Alinear lifecycle pagado con la entrega ya cerrada.'
                : order.nextStep,
          updatedAt: order.updatedAt,
        };

        return entry;
      }),
    );

    const trackedEntries = entries.filter(
      (
        entry,
      ): entry is TenantEcommerceOrderPostSaleReportingBoardEntryView =>
        entry !== null,
    );

    const paidCount = trackedEntries.filter(
      (entry) => entry.reportingStatus === 'paid',
    ).length;
    const inProgressCount = trackedEntries.filter(
      (entry) => entry.reportingStatus === 'in_progress',
    ).length;
    const deliveredCount = trackedEntries.filter(
      (entry) => entry.reportingStatus === 'delivered',
    ).length;
    const blockedCount = trackedEntries.filter(
      (entry) => entry.reportingStatus === 'blocked',
    ).length;
    const divergenceCount = trackedEntries.filter(
      (entry) => entry.driftSignal !== 'aligned',
    ).length;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: postSaleRegistry.productEntity,
      summary: {
        totalOrders: trackedEntries.length,
        paidCount,
        inProgressCount,
        deliveredCount,
        blockedCount,
        divergenceCount,
        headline:
          trackedEntries.length > 0
            ? 'Ya existe una vista consolidada para leer cobro, entrega y desvíos post-venta.'
            : 'Todavía no hay órdenes suficientes para un reporting post-sale consolidado.',
        detail:
          trackedEntries.length > 0
            ? 'Usa este board para contrastar órdenes cobradas, entregadas y bloqueadas sin perder la deriva entre cobro y fulfillment.'
            : 'Completa más órdenes post-sale para poblar este reporting operativo.',
      },
      reportingLanes: [
        {
          laneKey: 'paid',
          count: paidCount,
          operatorBias: 'Monitorear cierre económico ya consolidado.',
        },
        {
          laneKey: 'in_progress',
          count: inProgressCount,
          operatorBias: 'Seguir órdenes activas antes de que deriven en bloqueo.',
        },
        {
          laneKey: 'delivered',
          count: deliveredCount,
          operatorBias: 'Revisar que entrega y lifecycle queden alineados.',
        },
        {
          laneKey: 'blocked',
          count: blockedCount,
          operatorBias: 'Atender primero desvíos que frenan revenue o fulfillment.',
        },
      ],
      entries: trackedEntries,
    };
  }
}
