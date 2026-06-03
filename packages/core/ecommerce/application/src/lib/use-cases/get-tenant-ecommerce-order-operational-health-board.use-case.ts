import {
  TenantEcommerceOrderOperationalHealthBoardView,
  TenantEcommerceOrderOperationalReviewWorkspaceView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase } from './get-tenant-ecommerce-order-operational-review-workspace.use-case';
import { ListTenantEcommerceOrderDraftsUseCase } from './list-tenant-ecommerce-order-drafts.use-case';

export class GetTenantEcommerceOrderOperationalHealthBoardUseCase {
  constructor(
    private readonly listTenantEcommerceOrderDraftsUseCase: ListTenantEcommerceOrderDraftsUseCase,
    private readonly getTenantEcommerceOrderOperationalReviewWorkspaceUseCase: GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderOperationalHealthBoardView | null> {
    const registry = await this.listTenantEcommerceOrderDraftsUseCase.execute(
      tenantSlug,
      productEntityId,
    );

    if (!registry) {
      return null;
    }

    const reviews = await Promise.all(
      registry.orderDrafts.map(async (orderDraft) => {
        const review =
          await this.getTenantEcommerceOrderOperationalReviewWorkspaceUseCase.execute(
            tenantSlug,
            productEntityId,
            orderDraft.id,
          );

        return review
          ? {
              orderDraft,
              review,
            }
          : null;
      }),
    );

    const entries = reviews.flatMap((entry) => {
      if (!entry) {
        return [];
      }

      const { orderDraft, review } = entry;

      return [
        {
          orderDraftId: orderDraft.id,
          orderLabel: orderDraft.orderLabel,
          reviewStatus: review.reviewStatus,
          stalenessStatus: review.stalenessStatus,
          latestEventType: review.latestEvent?.eventType ?? null,
          blockerCount: review.blockerSignals.length,
          driftCount: review.driftSignals.length,
          recommendedAction:
            review.recommendedActions[0] ??
            'Cargar operational review workspace antes de resolver.',
        },
      ];
    });

    const summary = this.buildSummary(entries);

    return {
      tenantSlug,
      productEntityId,
      generatedAt: this.nowProvider(),
      summary,
      lanes: [
        {
          laneKey: 'ready_for_closeout',
          count: summary.readyForCloseoutCount,
          operatorBias:
            'Priorizar closeout cuando payment, fulfillment y post-sale ya están alineados.',
        },
        {
          laneKey: 'needs_operator_review',
          count: summary.needsOperatorReviewCount,
          operatorBias:
            'Resolver drift, completar evidencia o refrescar timeline antes de closeout.',
        },
        {
          laneKey: 'blocked',
          count: summary.blockedCount,
          operatorBias:
            'Atender blockers con evidencia explícita antes de continuar ejecución.',
        },
      ],
      entries,
    };
  }

  private buildSummary(
    entries: TenantEcommerceOrderOperationalHealthBoardView['entries'],
  ): TenantEcommerceOrderOperationalHealthBoardView['summary'] {
    const readyForCloseoutCount = this.countByReviewStatus(
      entries,
      'ready_for_closeout',
    );
    const needsOperatorReviewCount = this.countByReviewStatus(
      entries,
      'needs_operator_review',
    );
    const blockedCount = this.countByReviewStatus(entries, 'blocked');
    const driftCount = entries.filter((entry) => entry.driftCount > 0).length;
    const staleTimelineCount = entries.filter(
      (entry) => entry.stalenessStatus !== 'fresh',
    ).length;

    return {
      totalOrdersTracked: entries.length,
      readyForCloseoutCount,
      needsOperatorReviewCount,
      blockedCount,
      driftCount,
      staleTimelineCount,
      headline:
        blockedCount > 0
          ? 'Hay órdenes bloqueadas que requieren resolución operativa.'
          : needsOperatorReviewCount > 0
            ? 'Hay órdenes con revisión operativa pendiente antes del closeout.'
            : 'Las órdenes rastreadas están listas para closeout operativo.',
      detail:
        entries.length > 0
          ? `${readyForCloseoutCount} listas, ${needsOperatorReviewCount} con revisión y ${blockedCount} bloqueadas.`
          : 'Aún no hay order drafts con timeline operativo para esta product entity.',
    };
  }

  private countByReviewStatus(
    entries: TenantEcommerceOrderOperationalHealthBoardView['entries'],
    reviewStatus: TenantEcommerceOrderOperationalReviewWorkspaceView['reviewStatus'],
  ): number {
    return entries.filter((entry) => entry.reviewStatus === reviewStatus).length;
  }
}
