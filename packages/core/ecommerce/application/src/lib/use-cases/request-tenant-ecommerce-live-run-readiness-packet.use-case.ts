import { TenantEcommerceLiveRunReadinessPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceCompletionDashboardUseCase } from './get-tenant-ecommerce-completion-dashboard.use-case';

export class RequestTenantEcommerceLiveRunReadinessPacketUseCase {
  constructor(
    private readonly getTenantEcommerceCompletionDashboardUseCase: GetTenantEcommerceCompletionDashboardUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceLiveRunReadinessPacketView | null> {
    const dashboard =
      await this.getTenantEcommerceCompletionDashboardUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!dashboard) {
      return null;
    }

    const blockedBy = dashboard.lanes
      .filter((lane) => lane.status === 'blocked')
      .flatMap((lane) =>
        lane.blockingSignals.length > 0
          ? lane.blockingSignals
          : [`${lane.laneKey}: ${lane.detail}`],
      );
    const warningLanes = dashboard.lanes.filter(
      (lane) => lane.status === 'warning',
    );
    const readinessStatus =
      blockedBy.length > 0
        ? 'blocked'
        : warningLanes.length > 0
          ? 'needs_operator_closeout'
          : 'ready_for_live_run';

    return {
      tenantSlug,
      productEntityId,
      generatedAt: this.nowProvider(),
      productEntity: dashboard.productEntity,
      readinessStatus,
      summary:
        readinessStatus === 'ready_for_live_run'
          ? 'El módulo ecommerce está listo para una corrida viva controlada.'
          : readinessStatus === 'blocked'
            ? 'La corrida viva está bloqueada por carriles críticos.'
            : 'La corrida viva está cerca, pero requiere closeout operativo de advertencias.',
      readinessSignals: dashboard.lanes.map((lane) => ({
        laneKey: lane.laneKey,
        status: lane.status,
        detail: lane.detail,
      })),
      launchChecklist: [
        'Confirmar que storefront y checkout apuntan a una product entity vigente.',
        'Confirmar que la orden semilla tiene ruta de factura en draft, no emisión SRI.',
        'Confirmar que operational health no conserva blockers activos.',
        'Preparar monitoreo manual para la primera corrida viva.',
      ],
      blockedBy,
      nextStep:
        readinessStatus === 'ready_for_live_run'
          ? 'Ejecutar corrida viva controlada y monitorear timeline operativo.'
          : dashboard.nextBestAction,
      guardrails: [
        ...dashboard.guardrails,
        'Este packet autoriza una corrida viva controlada; no publica, cobra, factura ni entrega automáticamente.',
      ],
    };
  }
}
