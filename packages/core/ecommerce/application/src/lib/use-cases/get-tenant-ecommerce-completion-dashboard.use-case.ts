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
        ...this.buildLaneAction('storefront'),
      },
      {
        laneKey: 'checkout',
        status: this.mapDependencyStatus(
          goLiveDependencyStatus('checkout_order_intake'),
        ),
        detail: goLiveDependencyDetail('checkout_order_intake'),
        ...this.buildLaneAction('checkout'),
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
        ...this.buildLaneAction('orders'),
      },
      {
        laneKey: 'invoicing',
        status: this.mapDependencyStatus(
          goLiveDependencyStatus('order_invoicing_bridge'),
        ),
        detail: goLiveDependencyDetail('order_invoicing_bridge'),
        ...this.buildLaneAction('invoicing'),
      },
      {
        laneKey: 'payment',
        status:
          operationalHealthBoard.summary.driftCount > 0 ? 'warning' : 'ready',
        detail:
          operationalHealthBoard.summary.driftCount > 0
            ? 'Hay drift operativo que puede afectar cobro o closeout.'
            : 'No hay drift activo reportado en health board.',
        ...this.buildLaneAction('payment'),
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
        ...this.buildLaneAction('fulfillment'),
      },
      {
        laneKey: 'post_sale',
        status:
          operationalHealthBoard.summary.readyForCloseoutCount > 0
            ? 'ready'
            : 'warning',
        detail: operationalHealthBoard.summary.headline,
        ...this.buildLaneAction('post_sale'),
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
        ...this.buildLaneAction('operational_health'),
      },
    ].map((lane) => ({
      ...lane,
      blockingSignals: lane.status === 'ready' ? [] : [lane.detail],
    })) as TenantEcommerceCompletionDashboardView['lanes'];

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

  private buildLaneAction(
    laneKey: TenantEcommerceCompletionDashboardView['lanes'][number]['laneKey'],
  ): Pick<
    TenantEcommerceCompletionDashboardView['lanes'][number],
    'recommendedActionKey' | 'targetSurface'
  > {
    const actions: Record<
      TenantEcommerceCompletionDashboardView['lanes'][number]['laneKey'],
      Pick<
        TenantEcommerceCompletionDashboardView['lanes'][number],
        'recommendedActionKey' | 'targetSurface'
      >
    > = {
      storefront: {
        recommendedActionKey: 'load_go_live_manifest',
        targetSurface: 'storefront_go_live_manifest',
      },
      checkout: {
        recommendedActionKey: 'load_checkout',
        targetSurface: 'checkout_order_intake_workspace',
      },
      orders: {
        recommendedActionKey: 'select_order',
        targetSurface: 'order_draft_registry',
      },
      invoicing: {
        recommendedActionKey: 'prepare_invoice',
        targetSurface: 'invoice_execution_packet',
      },
      payment: {
        recommendedActionKey: 'resolve_operational_exception',
        targetSurface: 'operational_exception_resolution',
      },
      fulfillment: {
        recommendedActionKey: 'load_health_board',
        targetSurface: 'operational_health_board',
      },
      post_sale: {
        recommendedActionKey: 'load_health_board',
        targetSurface: 'operational_health_board',
      },
      operational_health: {
        recommendedActionKey: 'request_live_run_readiness',
        targetSurface: 'live_run_readiness_packet',
      },
    };

    return actions[laneKey];
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
