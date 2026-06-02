import {
  TenantEcommerceOrderOpsPriorityQueueEntryView,
  TenantEcommerceOrderOpsPriorityQueueView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase } from './get-tenant-ecommerce-order-handoff-execution-workspace.use-case';
import { GetTenantEcommerceOrderOperatorWorkboardUseCase } from './get-tenant-ecommerce-order-operator-workboard.use-case';

export class GetTenantEcommerceOrderOpsPriorityQueueUseCase {
  constructor(
    private readonly getTenantEcommerceOrderOperatorWorkboardUseCase: GetTenantEcommerceOrderOperatorWorkboardUseCase,
    private readonly getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase: GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderOpsPriorityQueueView | null> {
    const workboard =
      await this.getTenantEcommerceOrderOperatorWorkboardUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!workboard) {
      return null;
    }

    const executionWorkspaces = await Promise.all(
      workboard.entries.map((entry) =>
        this.getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          entry.orderDraftId,
        ),
      ),
    );

    const entries: TenantEcommerceOrderOpsPriorityQueueEntryView[] =
      workboard.entries.map((entry, index) => {
        const executionWorkspace = executionWorkspaces[index];
        const activeRoute = executionWorkspace?.activeRoute ?? entry.handoffRoute;

        const priorityBand =
          executionWorkspace?.executionStatus === 'blocked' ||
          entry.currentStatus === 'blocked'
            ? 'critical'
            : activeRoute === 'hold'
              ? 'high'
              : activeRoute === 'growth_follow_up' || entry.currentStatus === 'under_review'
                ? 'medium'
                : 'low';

        const priorityScore =
          priorityBand === 'critical'
            ? 95
            : priorityBand === 'high'
              ? 80
              : priorityBand === 'medium'
                ? 60
                : 35;

        return {
          orderDraftId: entry.orderDraftId,
          orderLabel: entry.orderLabel,
          currentStatus: entry.currentStatus,
          activeRoute,
          priorityBand,
          priorityScore,
          attentionReason:
            priorityBand === 'critical'
              ? 'Tiene bloqueos duros o handoff no ejecutable.'
              : priorityBand === 'high'
                ? 'Necesita definición rápida de ruta o datos para no quedarse en hold.'
                : priorityBand === 'medium'
                  ? 'Conviene darle seguimiento antes de abrir más frentes.'
                  : 'Ya tiene una ruta más clara y puede avanzar con menor fricción.',
          recommendedAction:
            activeRoute === 'invoicing'
              ? 'Abrir el invoice draft bridge como siguiente paso.'
              : activeRoute === 'growth_follow_up'
                ? 'Retomar la conversación comercial y confirmar buyer intent.'
                : 'Resolver datos faltantes y redefinir la ruta del handoff.',
          quickActions:
            activeRoute === 'invoicing'
              ? ['open_invoice_bridge', 'review_fiscal_snapshot']
              : activeRoute === 'growth_follow_up'
                ? ['open_growth_follow_up', 'review_order_handoff']
                : ['open_handoff_execution', 'review_order_workspace'],
          updatedAt: entry.updatedAt,
        };
      });

    const sortedEntries = [...entries].sort(
      (left, right) => right.priorityScore - left.priorityScore,
    );

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: workboard.productEntity,
      summary: {
        totalOrders: sortedEntries.length,
        criticalCount: sortedEntries.filter(
          (entry) => entry.priorityBand === 'critical',
        ).length,
        invoicingLaneCount: sortedEntries.filter(
          (entry) => entry.activeRoute === 'invoicing',
        ).length,
        growthLaneCount: sortedEntries.filter(
          (entry) => entry.activeRoute === 'growth_follow_up',
        ).length,
        holdCount: sortedEntries.filter((entry) => entry.activeRoute === 'hold')
          .length,
        headline:
          sortedEntries.length > 0
            ? 'Ya existe una cola priorizada para operar órdenes dentro de Ecommerce.'
            : 'Todavía no hay órdenes para construir una cola operativa.',
        detail:
          sortedEntries.length > 0
            ? 'Usa esta cola para decidir qué orden requiere atención inmediata, cuál ya puede ir a Invoicing y cuál necesita follow-up.'
            : 'Guarda un order draft para empezar a priorizar la operación comercial.',
      },
      entries: sortedEntries,
    };
  }
}
