import {
  TenantEcommerceOrderStatusLifecycleDetailView,
  TenantEcommerceOrderStatusLifecycleEntryView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderDraftDetailUseCase } from './get-tenant-ecommerce-order-draft-detail.use-case';
import { GetTenantEcommerceOrderReviewWorkspaceUseCase } from './get-tenant-ecommerce-order-review-workspace.use-case';
import { RequestTenantEcommerceOrderApprovalDecisionUseCase } from './request-tenant-ecommerce-order-approval-decision.use-case';
import { RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase } from './request-tenant-ecommerce-order-invoice-draft-bridge.use-case';

export class GetTenantEcommerceOrderStatusLifecycleDetailUseCase {
  constructor(
    private readonly getTenantEcommerceOrderDraftDetailUseCase: GetTenantEcommerceOrderDraftDetailUseCase,
    private readonly getTenantEcommerceOrderReviewWorkspaceUseCase: GetTenantEcommerceOrderReviewWorkspaceUseCase,
    private readonly requestTenantEcommerceOrderApprovalDecisionUseCase: RequestTenantEcommerceOrderApprovalDecisionUseCase,
    private readonly requestTenantEcommerceOrderInvoiceDraftBridgeUseCase: RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderStatusLifecycleDetailView | null> {
    const [orderDraftDetail, reviewWorkspace, approvalDecision, invoiceBridge] =
      await Promise.all([
        this.getTenantEcommerceOrderDraftDetailUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderReviewWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.requestTenantEcommerceOrderApprovalDecisionUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.requestTenantEcommerceOrderInvoiceDraftBridgeUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
      ]);

    if (
      !orderDraftDetail ||
      !reviewWorkspace ||
      !approvalDecision ||
      !invoiceBridge
    ) {
      return null;
    }

    const blockedBy = [
      ...orderDraftDetail.blockedBy,
      ...reviewWorkspace.blockedBy,
      ...approvalDecision.blockedBy,
      ...invoiceBridge.blockedBy,
    ];

    const currentStatus =
      blockedBy.length > 0
        ? 'blocked'
        : invoiceBridge.bridgeStatus === 'ready_to_open_invoice_draft' &&
            approvalDecision.decision === 'approved'
          ? 'handed_off'
          : approvalDecision.decision === 'approved'
            ? 'approved'
            : reviewWorkspace.reviewStatus === 'ready_for_operator_review' ||
                reviewWorkspace.reviewStatus === 'needs_data'
              ? 'under_review'
              : 'draft';

    const timeline = this.buildTimeline(currentStatus, blockedBy);

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: orderDraftDetail.productEntity,
      orderDraft: orderDraftDetail.orderDraft,
      currentStatus,
      summary:
        currentStatus === 'handed_off'
          ? 'La orden ya quedó en estado de handoff preparado para el siguiente workspace operativo.'
          : currentStatus === 'approved'
            ? 'La orden ya tiene aprobación operativa, aunque todavía no salió al handoff siguiente.'
            : currentStatus === 'under_review'
              ? 'La orden ya se está tratando como revisión operativa y todavía necesita decisión o datos.'
              : currentStatus === 'blocked'
                ? 'La orden tiene bloqueos explícitos y no conviene moverla como salida operativa.'
                : 'La orden sigue en estado draft y todavía necesita más forma antes de revisión.',
      lastAction:
        currentStatus === 'handed_off'
          ? 'Invoice draft bridge listo para siguiente handoff.'
          : currentStatus === 'approved'
            ? 'Approval decision tomada por operación.'
            : currentStatus === 'under_review'
              ? 'Review workspace cargado para cierre y seguimiento.'
              : currentStatus === 'blocked'
                ? 'Se detectaron bloqueos en review o salida fiscal.'
                : 'Order draft persistido como intención comercial.',
      nextStep:
        currentStatus === 'handed_off'
          ? 'Abrir el invoice draft o seguir el workspace de Growth según corresponda.'
          : currentStatus === 'approved'
            ? 'Bajar la orden a handoff fiscal o follow-up controlado.'
            : currentStatus === 'under_review'
              ? 'Completar datos, tomar decisión y definir owner operativo.'
              : currentStatus === 'blocked'
                ? 'Resolver bloqueos antes de intentar aprobación o handoff.'
                : 'Solicitar review, fiscal completion o follow-up según el caso.',
      timeline,
      blockedBy,
      guardrails: [
        ...new Set([
          ...orderDraftDetail.guardrails,
          ...reviewWorkspace.guardrails,
          ...approvalDecision.guardrails,
          ...invoiceBridge.guardrails,
          'No tratar este lifecycle como fulfillment ni post-venta automático todavía.',
        ]),
      ],
    };
  }

  private buildTimeline(
    currentStatus: TenantEcommerceOrderStatusLifecycleDetailView['currentStatus'],
    blockedBy: string[],
  ): TenantEcommerceOrderStatusLifecycleEntryView[] {
    const orderedKeys: TenantEcommerceOrderStatusLifecycleEntryView['key'][] = [
      'draft',
      'under_review',
      'approved',
      'handed_off',
      'blocked',
    ];

    const activeIndex = orderedKeys.indexOf(currentStatus);

    return orderedKeys.map((key, index) => ({
      key,
      label: key.replace(/_/g, ' '),
      status:
        key === 'blocked'
          ? blockedBy.length > 0
            ? 'active'
            : 'pending'
          : index < activeIndex && currentStatus !== 'blocked'
            ? 'completed'
            : index === activeIndex
              ? 'active'
              : 'pending',
      detail:
        key === 'draft'
          ? 'La intención comercial ya quedó persistida.'
          : key === 'under_review'
            ? 'La orden se evalúa para cierre, facturación o seguimiento.'
            : key === 'approved'
              ? 'La operación ya puede aprobar el siguiente paso de la venta.'
              : key === 'handed_off'
                ? 'La orden ya puede salir al siguiente workspace operativo.'
                : 'La orden tiene bloqueos visibles antes de avanzar.',
    }));
  }
}
