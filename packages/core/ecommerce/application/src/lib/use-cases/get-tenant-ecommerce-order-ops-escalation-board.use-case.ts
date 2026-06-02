import {
  TenantEcommerceOrderOpsEscalationBoardEntryView,
  TenantEcommerceOrderOpsEscalationBoardView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderOpsAttentionWorkspaceUseCase } from './get-tenant-ecommerce-order-ops-attention-workspace.use-case';
import { GetTenantEcommerceOrderOpsPriorityQueueUseCase } from './get-tenant-ecommerce-order-ops-priority-queue.use-case';

export class GetTenantEcommerceOrderOpsEscalationBoardUseCase {
  constructor(
    private readonly getTenantEcommerceOrderOpsAttentionWorkspaceUseCase: GetTenantEcommerceOrderOpsAttentionWorkspaceUseCase,
    private readonly getTenantEcommerceOrderOpsPriorityQueueUseCase: GetTenantEcommerceOrderOpsPriorityQueueUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderOpsEscalationBoardView | null> {
    const [attentionWorkspace, priorityQueue] = await Promise.all([
      this.getTenantEcommerceOrderOpsAttentionWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.getTenantEcommerceOrderOpsPriorityQueueUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!attentionWorkspace || !priorityQueue) {
      return null;
    }

    const entries: TenantEcommerceOrderOpsEscalationBoardEntryView[] =
      attentionWorkspace.entries.map((entry) => {
        const queueEntry = priorityQueue.entries.find(
          (candidate) => candidate.orderDraftId === entry.orderDraftId,
        );
        const escalationLevel =
          entry.attentionStatus === 'blocked' ||
          queueEntry?.priorityBand === 'critical' ||
          entry.activeRoute === 'hold'
            ? 'critical'
            : entry.attentionStatus === 'needs_data' ||
                queueEntry?.priorityBand === 'high'
              ? 'elevated'
              : 'monitor';

        return {
          orderDraftId: entry.orderDraftId,
          orderLabel: entry.orderLabel,
          escalationLevel,
          activeRoute: entry.activeRoute,
          escalationReason:
            escalationLevel === 'critical'
              ? 'Requiere intervención prioritaria para evitar que la orden quede frenada o invisible.'
              : escalationLevel === 'elevated'
                ? 'Necesita seguimiento cercano para no degradar la salida operativa.'
                : 'Puede monitorearse sin intervención inmediata, pero conviene mantenerla visible.',
          recommendedOwnerRole: 'operator',
          nextAction:
            escalationLevel === 'critical'
              ? queueEntry?.recommendedAction ??
                'Resolver bloqueos o redefinir ruta antes del próximo handoff.'
              : entry.nextAction,
          updatedAt: entry.updatedAt,
        };
      });

    const criticalCount = entries.filter(
      (entry) => entry.escalationLevel === 'critical',
    ).length;
    const elevatedCount = entries.filter(
      (entry) => entry.escalationLevel === 'elevated',
    ).length;
    const monitorCount = entries.filter(
      (entry) => entry.escalationLevel === 'monitor',
    ).length;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: attentionWorkspace.productEntity,
      summary: {
        totalEscalations: entries.length,
        criticalCount,
        elevatedCount,
        monitorCount,
        headline:
          entries.length > 0
            ? 'Ya existe una mesa de escalación para priorizar órdenes que piden intervención real.'
            : 'Todavía no hay órdenes que justifiquen escalación operativa.',
        detail:
          entries.length > 0
            ? 'Usa esta vista para separar lo crítico, lo que requiere seguimiento cercano y lo que solo necesita monitoreo.'
            : 'Genera más actividad operativa en órdenes para poblar esta mesa de escalación.',
      },
      escalationLanes: [
        {
          laneKey: 'critical',
          count: criticalCount,
          operatorBias: 'Atender primero lo que puede bloquear el cierre o romper la trazabilidad.',
        },
        {
          laneKey: 'elevated',
          count: elevatedCount,
          operatorBias: 'Completar información o confirmar ruta antes de que escale a bloqueo.',
        },
        {
          laneKey: 'monitor',
          count: monitorCount,
          operatorBias: 'Monitorear sin perder visibilidad, pero sin distraer foco operativo.',
        },
      ],
      entries,
    };
  }
}
