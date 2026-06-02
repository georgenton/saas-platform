import {
  TenantEcommerceOrderStatusLifecycleRegistryView,
  TenantEcommerceOrderStatusLifecycleSummaryView,
} from '@saas-platform/ecommerce-domain';
import { ListTenantEcommerceOrderDraftsUseCase } from './list-tenant-ecommerce-order-drafts.use-case';
import { GetTenantEcommerceOrderStatusLifecycleDetailUseCase } from './get-tenant-ecommerce-order-status-lifecycle-detail.use-case';

export class ListTenantEcommerceOrderStatusLifecyclesUseCase {
  constructor(
    private readonly listTenantEcommerceOrderDraftsUseCase: ListTenantEcommerceOrderDraftsUseCase,
    private readonly getTenantEcommerceOrderStatusLifecycleDetailUseCase: GetTenantEcommerceOrderStatusLifecycleDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderStatusLifecycleRegistryView | null> {
    const registry = await this.listTenantEcommerceOrderDraftsUseCase.execute(
      tenantSlug,
      productEntityId,
    );

    if (!registry) {
      return null;
    }

    const details = await Promise.all(
      registry.orderDrafts.map((orderDraft) =>
        this.getTenantEcommerceOrderStatusLifecycleDetailUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraft.id,
        ),
      ),
    );

    const orders = details
      .filter(
        (
          entry,
        ): entry is NonNullable<
          Awaited<
            ReturnType<
              GetTenantEcommerceOrderStatusLifecycleDetailUseCase['execute']
            >
          >
        > => Boolean(entry),
      )
      .map<TenantEcommerceOrderStatusLifecycleSummaryView>((entry) => ({
        orderDraftId: entry.orderDraft.id,
        orderLabel: entry.orderDraft.orderLabel,
        currentStatus: entry.currentStatus,
        lastAction: entry.lastAction,
        nextStep: entry.nextStep,
        updatedAt: entry.orderDraft.updatedAt,
      }));

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: registry.productEntity,
      summary: {
        totalOrders: orders.length,
        draftCount: orders.filter((entry) => entry.currentStatus === 'draft')
          .length,
        underReviewCount: orders.filter(
          (entry) => entry.currentStatus === 'under_review',
        ).length,
        approvedCount: orders.filter(
          (entry) => entry.currentStatus === 'approved',
        ).length,
        handedOffCount: orders.filter(
          (entry) => entry.currentStatus === 'handed_off',
        ).length,
        blockedCount: orders.filter((entry) => entry.currentStatus === 'blocked')
          .length,
        headline:
          orders.length > 0
            ? 'Ya existe un lifecycle legible para las órdenes persistidas de esta product entity.'
            : 'Todavía no hay órdenes persistidas para construir lifecycle.',
        detail:
          orders.length > 0
            ? 'Usa este registro para ver en qué estado operativo está cada orden antes de follow-up, factura o handoff.'
            : 'Guarda un order draft para empezar a ver lifecycle de operación comercial.',
      },
      orders,
    };
  }
}
