import {
  TenantEcommerceOrderOpsAttentionWorkspaceEntryView,
  TenantEcommerceOrderOpsAttentionWorkspaceView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase } from './get-tenant-ecommerce-order-handoff-execution-workspace.use-case';
import { GetTenantEcommerceOrderOpsPriorityQueueUseCase } from './get-tenant-ecommerce-order-ops-priority-queue.use-case';

export class GetTenantEcommerceOrderOpsAttentionWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderOpsPriorityQueueUseCase: GetTenantEcommerceOrderOpsPriorityQueueUseCase,
    private readonly getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase: GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderOpsAttentionWorkspaceView | null> {
    const queue = await this.getTenantEcommerceOrderOpsPriorityQueueUseCase.execute(
      tenantSlug,
      productEntityId,
    );

    if (!queue) {
      return null;
    }

    const executionWorkspaces = await Promise.all(
      queue.entries.map((entry) =>
        this.getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          entry.orderDraftId,
        ),
      ),
    );

    const entries: TenantEcommerceOrderOpsAttentionWorkspaceEntryView[] =
      queue.entries.map((entry, index) => {
        const executionWorkspace = executionWorkspaces[index];
        const attentionStatus =
          executionWorkspace?.executionStatus === 'blocked' ||
          entry.priorityBand === 'critical'
            ? 'blocked'
            : executionWorkspace?.executionStatus === 'ready_for_execution'
              ? 'ready'
              : 'needs_data';

        return {
          orderDraftId: entry.orderDraftId,
          orderLabel: entry.orderLabel,
          attentionStatus,
          activeRoute: entry.activeRoute,
          attentionReason:
            attentionStatus === 'blocked'
              ? 'Tiene bloqueos o dependencias duras antes de seguir operando.'
              : attentionStatus === 'ready'
                ? 'Ya puede avanzar por su ruta activa con menos fricción.'
                : 'Todavía necesita resolución de datos o una mejor definición de siguiente paso.',
          nextAction:
            attentionStatus === 'ready'
              ? entry.recommendedAction
              : entry.activeRoute === 'hold'
                ? 'Resolver hold y redefinir la salida principal.'
                : entry.recommendedAction,
          ownerRole: 'operator',
          updatedAt: entry.updatedAt,
        };
      });

    const blockedCount = entries.filter(
      (entry) => entry.attentionStatus === 'blocked',
    ).length;
    const needsDataCount = entries.filter(
      (entry) => entry.attentionStatus === 'needs_data',
    ).length;
    const readyCount = entries.filter(
      (entry) => entry.attentionStatus === 'ready',
    ).length;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: queue.productEntity,
      summary: {
        totalAttentionItems: entries.length,
        blockedCount,
        needsDataCount,
        readyCount,
        headline:
          entries.length > 0
            ? 'Ya existe una mesa de atención para operar órdenes según urgencia y claridad de salida.'
            : 'Todavía no hay órdenes que requieran atención operativa.',
        detail:
          entries.length > 0
            ? 'Usa esta mesa para separar órdenes bloqueadas, órdenes que necesitan datos y órdenes listas para ejecutar.'
            : 'Guarda y enruta una orden para empezar a trabajar esta mesa de atención.',
      },
      focusLanes: [
        {
          laneKey: 'blocked',
          count: blockedCount,
          actionBias: 'Destrabar primero lo que impide seguir operando.',
        },
        {
          laneKey: 'needs_data',
          count: needsDataCount,
          actionBias: 'Completar datos o definir mejor la ruta del handoff.',
        },
        {
          laneKey: 'ready',
          count: readyCount,
          actionBias: 'Empujar ejecución real sin perder trazabilidad.',
        },
      ],
      entries,
    };
  }
}
