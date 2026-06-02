import {
  TenantEcommerceOrderRevenueOpsBoardEntryView,
  TenantEcommerceOrderRevenueOpsBoardView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase } from './get-tenant-ecommerce-order-fulfillment-execution-workspace.use-case';
import { GetTenantEcommerceOrderRevenueTrackingSummaryUseCase } from './get-tenant-ecommerce-order-revenue-tracking-summary.use-case';
import { RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase } from './request-tenant-ecommerce-order-payment-confirmation-decision.use-case';

export class GetTenantEcommerceOrderRevenueOpsBoardUseCase {
  constructor(
    private readonly getTenantEcommerceOrderRevenueTrackingSummaryUseCase: GetTenantEcommerceOrderRevenueTrackingSummaryUseCase,
    private readonly requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase: RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
    private readonly getTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase: GetTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderRevenueOpsBoardView | null> {
    const revenueTrackingSummary =
      await this.getTenantEcommerceOrderRevenueTrackingSummaryUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!revenueTrackingSummary) {
      return null;
    }

    const entries = await Promise.all(
      revenueTrackingSummary.entries.map(async (entry) => {
        const [paymentDecision, fulfillmentExecutionWorkspace] =
          await Promise.all([
            this.requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase.execute(
              tenantSlug,
              productEntityId,
              entry.orderDraftId,
            ),
            this.getTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase.execute(
              tenantSlug,
              productEntityId,
              entry.orderDraftId,
            ),
          ]);

        if (!paymentDecision || !fulfillmentExecutionWorkspace) {
          return null;
        }

        const priorityBand =
          entry.currentStatus === 'blocked' ||
          paymentDecision.decision === 'blocked' ||
          fulfillmentExecutionWorkspace.executionStatus === 'blocked'
            ? 'critical'
            : entry.currentStatus === 'awaiting_payment' ||
                paymentDecision.decision === 'needs_review' ||
                fulfillmentExecutionWorkspace.executionStatus ===
                  'waiting_payment_confirmation'
              ? 'high'
              : 'monitor';

        const revenueStatus =
          entry.currentStatus === 'paid'
            ? 'paid'
            : entry.currentStatus === 'blocked'
              ? 'blocked'
              : 'awaiting_payment';

        const boardEntry: TenantEcommerceOrderRevenueOpsBoardEntryView = {
          orderDraftId: entry.orderDraftId,
          orderLabel: entry.orderLabel,
          revenueStatus,
          priorityBand,
          paymentDecision: paymentDecision.decision,
          fulfillmentExecutionStatus:
            fulfillmentExecutionWorkspace.executionStatus,
          revenueImpact:
            priorityBand === 'critical'
              ? 'Hay revenue esperado detenido por bloqueo operativo o confirmación pendiente de resolver.'
              : priorityBand === 'high'
                ? 'El revenue sigue abierto y conviene seguimiento cercano para no degradar el cierre comercial.'
                : 'El revenue ya está más estabilizado y puede monitorearse sin intervención inmediata.',
          nextAction: fulfillmentExecutionWorkspace.nextStep,
          updatedAt: entry.updatedAt,
        };

        return boardEntry;
      }),
    );

    const trackedEntries = entries.filter(
      (
        entry,
      ): entry is TenantEcommerceOrderRevenueOpsBoardEntryView => entry !== null,
    );

    const criticalCount = trackedEntries.filter(
      (entry) => entry.priorityBand === 'critical',
    ).length;
    const highPriorityCount = trackedEntries.filter(
      (entry) => entry.priorityBand === 'high',
    ).length;
    const paidCount = trackedEntries.filter(
      (entry) => entry.revenueStatus === 'paid',
    ).length;
    const awaitingPaymentCount = trackedEntries.filter(
      (entry) => entry.revenueStatus === 'awaiting_payment',
    ).length;
    const blockedCount = trackedEntries.filter(
      (entry) => entry.revenueStatus === 'blocked',
    ).length;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: revenueTrackingSummary.productEntity,
      summary: {
        totalOrders: trackedEntries.length,
        criticalCount,
        highPriorityCount,
        paidCount,
        awaitingPaymentCount,
        blockedCount,
        headline:
          trackedEntries.length > 0
            ? 'Ya existe una mesa operativa para leer qué órdenes impactan más el revenue esperado.'
            : 'Todavía no hay órdenes suficientes para una lectura operativa de revenue.',
        detail:
          trackedEntries.length > 0
            ? 'Usa esta vista para separar bloqueos críticos, backlog de cobro y órdenes ya más estabilizadas.'
            : 'Sigue empujando órdenes al tramo post-sale para poblar señales de revenue operable.',
      },
      priorityLanes: [
        {
          laneKey: 'critical',
          count: criticalCount,
          operatorBias:
            'Atender primero lo que mantiene revenue bloqueado o sin confirmación confiable.',
        },
        {
          laneKey: 'high',
          count: highPriorityCount,
          operatorBias:
            'Seguir cerca lo que todavía depende de confirmación de cobro o destrabe operativo.',
        },
        {
          laneKey: 'monitor',
          count: trackedEntries.length - criticalCount - highPriorityCount,
          operatorBias:
            'Monitorear órdenes más estables sin distraer foco del backlog crítico.',
        },
      ],
      entries: trackedEntries,
    };
  }
}
