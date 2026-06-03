import { TenantEcommerceCompletionDashboardView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderOperationalHealthBoardUseCase } from './get-tenant-ecommerce-order-operational-health-board.use-case';
import { GetTenantEcommerceStorefrontGoLiveManifestUseCase } from './get-tenant-ecommerce-storefront-go-live-manifest.use-case';
import { ListTenantEcommerceOrderDraftsUseCase } from './list-tenant-ecommerce-order-drafts.use-case';

export class GetTenantEcommerceCompletionDashboardUseCase {
  constructor(
    private readonly getTenantEcommerceStorefrontGoLiveManifestUseCase: GetTenantEcommerceStorefrontGoLiveManifestUseCase,
    private readonly listTenantEcommerceOrderDraftsUseCase: ListTenantEcommerceOrderDraftsUseCase,
    private readonly getTenantEcommerceOrderOperationalHealthBoardUseCase: GetTenantEcommerceOrderOperationalHealthBoardUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceCompletionDashboardView | null> {
    const [goLiveManifest, orderRegistry, operationalHealthBoard] =
      await Promise.all([
        this.getTenantEcommerceStorefrontGoLiveManifestUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
        this.listTenantEcommerceOrderDraftsUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
        this.getTenantEcommerceOrderOperationalHealthBoardUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
      ]);

    if (!goLiveManifest || !orderRegistry || !operationalHealthBoard) {
      return null;
    }

    const goLiveDependencyStatus = (key: string) =>
      goLiveManifest.goLiveDependencies.find((entry) => entry.key === key)
        ?.status ?? 'warning';
    const goLiveDependencyDetail = (key: string) =>
      goLiveManifest.goLiveDependencies.find((entry) => entry.key === key)
        ?.detail ?? 'Dependencia pendiente de revisión.';
    const lanes: TenantEcommerceCompletionDashboardView['lanes'] = [
      {
        laneKey: 'storefront',
        status: this.mapDependencyStatus(
          goLiveDependencyStatus('storefront_release_control'),
        ),
        detail: goLiveDependencyDetail('storefront_release_control'),
      },
      {
        laneKey: 'checkout',
        status: this.mapDependencyStatus(
          goLiveDependencyStatus('checkout_order_intake'),
        ),
        detail: goLiveDependencyDetail('checkout_order_intake'),
      },
      {
        laneKey: 'orders',
        status:
          orderRegistry.summary.blockedCount > 0
            ? 'blocked'
            : orderRegistry.summary.totalOrderDrafts > 0
              ? 'ready'
              : 'warning',
        detail: orderRegistry.summary.detail,
      },
      {
        laneKey: 'invoicing',
        status: this.mapDependencyStatus(
          goLiveDependencyStatus('order_invoicing_bridge'),
        ),
        detail: goLiveDependencyDetail('order_invoicing_bridge'),
      },
      {
        laneKey: 'payment',
        status:
          operationalHealthBoard.summary.driftCount > 0 ? 'warning' : 'ready',
        detail:
          operationalHealthBoard.summary.driftCount > 0
            ? 'Hay drift operativo que puede afectar cobro o closeout.'
            : 'No hay drift activo reportado en health board.',
      },
      {
        laneKey: 'fulfillment',
        status:
          operationalHealthBoard.summary.blockedCount > 0
            ? 'blocked'
            : operationalHealthBoard.summary.needsOperatorReviewCount > 0
              ? 'warning'
              : 'ready',
        detail: operationalHealthBoard.summary.detail,
      },
      {
        laneKey: 'post_sale',
        status:
          operationalHealthBoard.summary.readyForCloseoutCount > 0
            ? 'ready'
            : 'warning',
        detail: operationalHealthBoard.summary.headline,
      },
      {
        laneKey: 'operational_health',
        status:
          operationalHealthBoard.summary.blockedCount > 0
            ? 'blocked'
            : operationalHealthBoard.summary.needsOperatorReviewCount > 0 ||
                operationalHealthBoard.summary.staleTimelineCount > 0
              ? 'warning'
              : 'ready',
        detail: operationalHealthBoard.summary.detail,
      },
    ];

    const readyLaneCount = lanes.filter((lane) => lane.status === 'ready').length;
    const warningLaneCount = lanes.filter(
      (lane) => lane.status === 'warning',
    ).length;
    const blockedLaneCount = lanes.filter(
      (lane) => lane.status === 'blocked',
    ).length;
    const completionStatus =
      blockedLaneCount > 0 || readyLaneCount < 5
        ? 'incomplete'
        : warningLaneCount > 0
          ? 'operationally_ready'
          : 'ready_for_live_run';

    return {
      tenantSlug,
      productEntityId,
      generatedAt: this.nowProvider(),
      productEntity: goLiveManifest.productEntity,
      completionStatus,
      summary: {
        readyLaneCount,
        warningLaneCount,
        blockedLaneCount,
        headline:
          completionStatus === 'ready_for_live_run'
            ? 'Ecommerce está listo para una corrida viva controlada.'
            : completionStatus === 'operationally_ready'
              ? 'Ecommerce está operativamente listo, con advertencias por cerrar.'
              : 'Ecommerce todavía tiene carriles incompletos o bloqueados.',
        detail: `${readyLaneCount} carriles listos, ${warningLaneCount} con advertencia y ${blockedLaneCount} bloqueados.`,
      },
      lanes,
      nextBestAction: this.resolveNextBestAction(lanes),
      guardrails: [
        ...goLiveManifest.guardrails,
        'Este dashboard no publica storefront, emite factura ni ejecuta fulfillment por sí solo.',
      ],
    };
  }

  private mapDependencyStatus(status: 'ready' | 'warning' | 'blocked') {
    return status;
  }

  private resolveNextBestAction(
    lanes: TenantEcommerceCompletionDashboardView['lanes'],
  ): string {
    const blockedLane = lanes.find((lane) => lane.status === 'blocked');

    if (blockedLane) {
      return `Resolver carril ${blockedLane.laneKey}: ${blockedLane.detail}`;
    }

    const warningLane = lanes.find((lane) => lane.status === 'warning');

    if (warningLane) {
      return `Cerrar advertencia en ${warningLane.laneKey}: ${warningLane.detail}`;
    }

    return 'Preparar corrida viva controlada y conservar monitoreo operativo.';
  }
}
