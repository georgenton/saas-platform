import {
  TenantEcommerceOrderRevenueTrackingSummaryEntryView,
  TenantEcommerceOrderRevenueTrackingSummaryView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase } from './get-tenant-ecommerce-order-fulfillment-readiness-workspace.use-case';
import { GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase } from './get-tenant-ecommerce-order-payment-confirmation-workspace.use-case';
import { ListTenantEcommerceOrderPostSaleLifecyclesUseCase } from './list-tenant-ecommerce-order-post-sale-lifecycles.use-case';

export class GetTenantEcommerceOrderRevenueTrackingSummaryUseCase {
  constructor(
    private readonly listTenantEcommerceOrderPostSaleLifecyclesUseCase: ListTenantEcommerceOrderPostSaleLifecyclesUseCase,
    private readonly getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase: GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
    private readonly getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase: GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderRevenueTrackingSummaryView | null> {
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
        const [paymentConfirmation, fulfillmentReadiness] = await Promise.all([
          this.getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase.execute(
            tenantSlug,
            productEntityId,
            order.orderDraftId,
          ),
          this.getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase.execute(
            tenantSlug,
            productEntityId,
            order.orderDraftId,
          ),
        ]);

        if (!paymentConfirmation || !fulfillmentReadiness) {
          return null;
        }

        const entry: TenantEcommerceOrderRevenueTrackingSummaryEntryView = {
          orderDraftId: order.orderDraftId,
          orderLabel: order.orderLabel,
          currentStatus: order.currentStatus,
          paymentConfirmationStatus: paymentConfirmation.confirmationStatus,
          fulfillmentStatus: fulfillmentReadiness.fulfillmentStatus,
          pricingSnapshot:
            paymentConfirmation.expectedCollection.pricingSnapshot,
          billingIntent:
            paymentConfirmation.expectedCollection.billingIntent,
          nextStep: fulfillmentReadiness.nextStep,
          updatedAt: order.updatedAt,
        };

        return entry;
      }),
    );

    const trackedEntries = entries.filter(
      (
        entry,
      ): entry is TenantEcommerceOrderRevenueTrackingSummaryEntryView =>
        entry !== null,
    );

    const expectedOrderCount = trackedEntries.length;
    const confirmedOrderCount = trackedEntries.filter(
      (entry) => entry.currentStatus === 'paid',
    ).length;
    const awaitingPaymentCount = trackedEntries.filter(
      (entry) => entry.currentStatus === 'awaiting_payment',
    ).length;
    const blockedCount = trackedEntries.filter(
      (entry) => entry.currentStatus === 'blocked',
    ).length;
    const readyForFulfillmentCount = trackedEntries.filter(
      (entry) => entry.fulfillmentStatus === 'ready_for_fulfillment',
    ).length;
    const readyForConfirmationCount = trackedEntries.filter(
      (entry) => entry.paymentConfirmationStatus === 'ready_for_confirmation',
    ).length;
    const needsReviewCount = trackedEntries.filter(
      (entry) => entry.paymentConfirmationStatus === 'needs_review',
    ).length;
    const blockedConfirmationCount = trackedEntries.filter(
      (entry) => entry.paymentConfirmationStatus === 'blocked',
    ).length;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: postSaleRegistry.productEntity,
      summary: {
        totalOrders: trackedEntries.length,
        expectedOrderCount,
        confirmedOrderCount,
        awaitingPaymentCount,
        blockedCount,
        readyForFulfillmentCount,
        headline:
          trackedEntries.length > 0
            ? 'Ya existe una primera lectura de revenue operativo basada en órdenes vivas de Ecommerce.'
            : 'Todavía no hay órdenes suficientes para una lectura operativa de revenue.',
        detail:
          trackedEntries.length > 0
            ? 'Usa este resumen para distinguir backlog de cobro, órdenes ya pagadas y readiness de fulfillment sin fingir contabilidad cerrada.'
            : 'Avanza órdenes al tramo post-sale para empezar a poblar señales de revenue dentro de Ecommerce.',
      },
      paymentRollup: {
        readyForConfirmationCount,
        needsReviewCount,
        blockedCount: blockedConfirmationCount,
        confirmationBacklog:
          readyForConfirmationCount > 0
            ? 'Hay órdenes listas para confirmación de cobro operativa.'
            : needsReviewCount > 0
              ? 'El backlog principal sigue estando en revisión antes de confirmar cobro.'
              : 'No hay señales suficientes para tratar el backlog como confirmación de cobro lista.',
      },
      valueSignals: {
        expectedPricingSnapshots: [
          ...new Set(trackedEntries.map((entry) => entry.pricingSnapshot)),
        ],
        billingIntents: [
          ...new Set(
            trackedEntries
              .map((entry) => entry.billingIntent)
              .filter((value): value is string => Boolean(value)),
          ),
        ],
      },
      entries: trackedEntries,
    };
  }
}
