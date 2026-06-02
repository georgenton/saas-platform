import { TenantEcommerceOrderPostSaleReportingSummaryView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderPostSaleReportingBoardUseCase } from './get-tenant-ecommerce-order-post-sale-reporting-board.use-case';
import { GetTenantEcommerceOrderRevenueTrackingSummaryUseCase } from './get-tenant-ecommerce-order-revenue-tracking-summary.use-case';

export class GetTenantEcommerceOrderPostSaleReportingSummaryUseCase {
  constructor(
    private readonly getTenantEcommerceOrderPostSaleReportingBoardUseCase: GetTenantEcommerceOrderPostSaleReportingBoardUseCase,
    private readonly getTenantEcommerceOrderRevenueTrackingSummaryUseCase: GetTenantEcommerceOrderRevenueTrackingSummaryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderPostSaleReportingSummaryView | null> {
    const [reportingBoard, revenueSummary] = await Promise.all([
      this.getTenantEcommerceOrderPostSaleReportingBoardUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.getTenantEcommerceOrderRevenueTrackingSummaryUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!reportingBoard || !revenueSummary) {
      return null;
    }

    const confirmedCount = reportingBoard.entries.filter(
      (entry) => entry.paymentLogStatus === 'confirmed',
    ).length;
    const deliveredCount = reportingBoard.entries.filter(
      (entry) => entry.reportingStatus === 'delivered',
    ).length;
    const blockedCount = reportingBoard.entries.filter(
      (entry) => entry.reportingStatus === 'blocked',
    ).length;
    const disputedCount = reportingBoard.entries.filter(
      (entry) => entry.paymentLogStatus === 'disputed',
    ).length;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: reportingBoard.productEntity,
      summary: {
        totalOrders: reportingBoard.summary.totalOrders,
        confirmedCount,
        deliveredCount,
        blockedCount,
        disputedCount,
        divergenceCount: reportingBoard.summary.divergenceCount,
        headline:
          reportingBoard.summary.totalOrders > 0
            ? 'Ya existe un summary ejecutivo para leer cobro, entrega y desvíos post-venta en un solo lugar.'
            : 'Todavía no hay órdenes suficientes para un summary ejecutivo post-sale.',
        detail:
          reportingBoard.summary.totalOrders > 0
            ? 'Este summary ayuda a contrastar órdenes confirmadas, entregadas, bloqueadas o disputadas sin abrir cada workspace operativo.'
            : 'Completa más órdenes post-sale para poblar el summary ejecutivo.',
      },
      revenueSnapshot: {
        expectedOrderCount: revenueSummary.summary.expectedOrderCount,
        confirmedOrderCount: revenueSummary.summary.confirmedOrderCount,
        awaitingPaymentCount: revenueSummary.summary.awaitingPaymentCount,
        readyForFulfillmentCount: revenueSummary.summary.readyForFulfillmentCount,
      },
      operationalHighlights: [
        reportingBoard.summary.headline,
        revenueSummary.paymentRollup.confirmationBacklog,
      ],
      nextFocus:
        reportingBoard.summary.divergenceCount > 0
          ? 'Atender primero desvíos entre cobro y entrega antes de cerrar revenue como estable.'
          : 'Mantener seguimiento ligero sobre órdenes activas y consolidar entregas ya confirmadas.',
    };
  }
}
