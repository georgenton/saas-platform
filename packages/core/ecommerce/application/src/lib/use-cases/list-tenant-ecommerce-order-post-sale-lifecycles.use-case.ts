import {
  TenantEcommerceOrderPostSaleLifecycleRegistryView,
  TenantEcommerceOrderPostSaleLifecycleSummaryView,
} from '@saas-platform/ecommerce-domain';
import { ListTenantEcommerceOrderDraftsUseCase } from './list-tenant-ecommerce-order-drafts.use-case';
import { GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase } from './get-tenant-ecommerce-order-post-sale-lifecycle-detail.use-case';

export class ListTenantEcommerceOrderPostSaleLifecyclesUseCase {
  constructor(
    private readonly listTenantEcommerceOrderDraftsUseCase: ListTenantEcommerceOrderDraftsUseCase,
    private readonly getTenantEcommerceOrderPostSaleLifecycleDetailUseCase: GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderPostSaleLifecycleRegistryView | null> {
    const orderDraftRegistry =
      await this.listTenantEcommerceOrderDraftsUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!orderDraftRegistry) {
      return null;
    }

    const lifecycleDetails = await Promise.all(
      orderDraftRegistry.orderDrafts.map((orderDraft) =>
        this.getTenantEcommerceOrderPostSaleLifecycleDetailUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraft.id,
        ),
      ),
    );

    const orders = lifecycleDetails.filter(
      (detail): detail is NonNullable<typeof detail> => detail !== null,
    );

    const summaries: TenantEcommerceOrderPostSaleLifecycleSummaryView[] =
      orders.map((detail) => ({
        orderDraftId: detail.orderDraft.id,
        orderLabel: detail.orderDraft.orderLabel,
        currentStatus: detail.currentStatus,
        nextStep: detail.nextStep,
        updatedAt: detail.generatedAt,
      }));

    const handedOffCount = summaries.filter(
      (entry) => entry.currentStatus === 'handed_off',
    ).length;
    const invoicingCount = summaries.filter(
      (entry) => entry.currentStatus === 'invoicing',
    ).length;
    const awaitingPaymentCount = summaries.filter(
      (entry) => entry.currentStatus === 'awaiting_payment',
    ).length;
    const paidCount = summaries.filter(
      (entry) => entry.currentStatus === 'paid',
    ).length;
    const blockedCount = summaries.filter(
      (entry) => entry.currentStatus === 'blocked',
    ).length;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: orderDraftRegistry.productEntity,
      summary: {
        totalOrders: summaries.length,
        handedOffCount,
        invoicingCount,
        awaitingPaymentCount,
        paidCount,
        blockedCount,
        headline:
          summaries.length > 0
            ? 'Ya existe una primera vista post-sale para seguir órdenes después del handoff inicial.'
            : 'Todavía no hay órdenes post-sale visibles para este producto.',
        detail:
          summaries.length > 0
            ? 'Usa esta mesa para ver qué órdenes ya entraron a invoicing, cuáles esperan cobro y cuáles siguen bloqueadas.'
            : 'Guarda y avanza una orden hasta handoff para poblar este lifecycle post-sale.',
      },
      orders: summaries,
    };
  }
}
