import {
  TenantEcommerceOrderOperatorWorkboardEntryView,
  TenantEcommerceOrderOperatorWorkboardView,
} from '@saas-platform/ecommerce-domain';
import { ListTenantEcommerceOrderStatusLifecyclesUseCase } from './list-tenant-ecommerce-order-status-lifecycles.use-case';
import { RequestTenantEcommerceOrderHandoffDecisionUseCase } from './request-tenant-ecommerce-order-handoff-decision.use-case';

export class GetTenantEcommerceOrderOperatorWorkboardUseCase {
  constructor(
    private readonly listTenantEcommerceOrderStatusLifecyclesUseCase: ListTenantEcommerceOrderStatusLifecyclesUseCase,
    private readonly requestTenantEcommerceOrderHandoffDecisionUseCase: RequestTenantEcommerceOrderHandoffDecisionUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderOperatorWorkboardView | null> {
    const lifecycleRegistry =
      await this.listTenantEcommerceOrderStatusLifecyclesUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!lifecycleRegistry) {
      return null;
    }

    const handoffDecisions = await Promise.all(
      lifecycleRegistry.orders.map((order) =>
        this.requestTenantEcommerceOrderHandoffDecisionUseCase.execute(
          tenantSlug,
          productEntityId,
          order.orderDraftId,
        ),
      ),
    );

    const entries: TenantEcommerceOrderOperatorWorkboardEntryView[] =
      lifecycleRegistry.orders.map((order, index) => {
        const handoffDecision = handoffDecisions[index];
        const handoffRoute = handoffDecision?.route ?? 'hold';
        const priority =
          order.currentStatus === 'blocked' || handoffDecision?.handoffStatus === 'blocked'
            ? 'high'
            : handoffRoute === 'hold' || order.currentStatus === 'under_review'
              ? 'medium'
              : 'low';

        return {
          orderDraftId: order.orderDraftId,
          orderLabel: order.orderLabel,
          currentStatus: order.currentStatus,
          handoffRoute,
          priority,
          attentionReason:
            priority === 'high'
              ? 'Necesita atención operativa antes de seguir con handoff o factura.'
              : priority === 'medium'
                ? 'Conviene completar decisión o datos antes del siguiente paso.'
                : 'La orden ya tiene una ruta operativa más clara.',
          nextStep: order.nextStep,
          updatedAt: order.updatedAt,
        };
      });

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: lifecycleRegistry.productEntity,
      summary: {
        totalOrders: entries.length,
        highPriorityCount: entries.filter((entry) => entry.priority === 'high')
          .length,
        readyForInvoicingCount: entries.filter(
          (entry) => entry.handoffRoute === 'invoicing',
        ).length,
        growthFollowUpCount: entries.filter(
          (entry) => entry.handoffRoute === 'growth_follow_up',
        ).length,
        blockedCount: entries.filter((entry) => entry.currentStatus === 'blocked')
          .length,
        headline:
          entries.length > 0
            ? 'Ya existe una mesa operativa para priorizar órdenes persistidas.'
            : 'Todavía no hay órdenes persistidas para construir una mesa operativa.',
        detail:
          entries.length > 0
            ? 'Usa este workboard para decidir qué orden pasa a factura, cuál necesita follow-up y cuál debe quedarse en hold.'
            : 'Guarda un order draft para empezar a priorizar operación comercial dentro de Ecommerce.',
      },
      entries,
    };
  }
}
