import { TenantEcommerceOrderOpsEscalationResolutionView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderOpsEscalationBoardUseCase } from './get-tenant-ecommerce-order-ops-escalation-board.use-case';
import { RecordTenantEcommerceOrderOperationalEventUseCase } from './record-tenant-ecommerce-order-operational-event.use-case';

export type ResolveTenantEcommerceOrderOpsEscalationCommand = {
  resolutionStatus?: TenantEcommerceOrderOpsEscalationResolutionView['resolutionStatus'];
  summary?: string;
  resolutionActions?: string[];
  nextStep?: string;
};

export class ResolveTenantEcommerceOrderOpsEscalationUseCase {
  constructor(
    private readonly getTenantEcommerceOrderOpsEscalationBoardUseCase: GetTenantEcommerceOrderOpsEscalationBoardUseCase,
    private readonly recordTenantEcommerceOrderOperationalEventUseCase: RecordTenantEcommerceOrderOperationalEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
    command: ResolveTenantEcommerceOrderOpsEscalationCommand = {},
  ): Promise<TenantEcommerceOrderOpsEscalationResolutionView | null> {
    const board =
      await this.getTenantEcommerceOrderOpsEscalationBoardUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    const entry = board?.entries.find(
      (candidate) => candidate.orderDraftId === orderDraftId,
    );

    if (!board || !entry) {
      return null;
    }

    const resolutionStatus =
      command.resolutionStatus ??
      (entry.escalationLevel === 'critical'
        ? 'needs_follow_up'
        : entry.escalationLevel === 'elevated'
          ? 'needs_follow_up'
          : 'resolved');
    const resolutionActions =
      command.resolutionActions && command.resolutionActions.length > 0
        ? command.resolutionActions
        : this.buildResolutionActions(entry.escalationLevel, entry.nextAction);
    const summary =
      command.summary?.trim() ||
      `Escalación ${entry.escalationLevel} registrada con estado ${resolutionStatus}.`;
    const nextStep =
      command.nextStep?.trim() ||
      (resolutionStatus === 'resolved'
        ? 'Recargar el escalation board y monitorear que la orden salga de la cola activa.'
        : resolutionStatus === 'blocked'
          ? 'Resolver bloqueo externo antes de cerrar la escalación.'
          : 'Asignar seguimiento operativo y volver a revisar la orden en el próximo ciclo.');
    const event =
      await this.recordTenantEcommerceOrderOperationalEventUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
        {
          eventType: 'operational_exception_resolution',
          sourceWorkspace: 'order-ops-escalation-resolution',
          status: resolutionStatus,
          summary,
          payload: {
            escalationLevel: entry.escalationLevel,
            activeRoute: entry.activeRoute,
            escalationReason: entry.escalationReason,
            resolutionActions,
            nextStep,
          },
        },
      );

    if (!event) {
      return null;
    }

    return {
      tenantSlug,
      productEntityId,
      orderDraftId,
      generatedAt: this.nowProvider(),
      resolutionStatus,
      ownerRole: 'operator',
      summary,
      escalationSnapshot: {
        escalationLevel: entry.escalationLevel,
        activeRoute: entry.activeRoute,
        escalationReason: entry.escalationReason,
        nextAction: entry.nextAction,
      },
      resolutionActions,
      event,
      nextStep,
      guardrails: [
        'La resolución de escalación registra evidencia operativa; no modifica automáticamente pagos, facturas ni fulfillment.',
        'Mantener una acción de seguimiento si la orden sigue en critical o elevated.',
      ],
    };
  }

  private buildResolutionActions(
    escalationLevel: TenantEcommerceOrderOpsEscalationResolutionView['escalationSnapshot']['escalationLevel'],
    nextAction: string,
  ): string[] {
    return escalationLevel === 'critical'
      ? [nextAction, 'Asignar owner operativo y confirmar evidencia de desbloqueo.']
      : escalationLevel === 'elevated'
        ? [nextAction, 'Programar follow-up para evitar degradación a critical.']
        : [nextAction, 'Mantener monitoreo ligero hasta el siguiente refresh operativo.'];
  }
}
