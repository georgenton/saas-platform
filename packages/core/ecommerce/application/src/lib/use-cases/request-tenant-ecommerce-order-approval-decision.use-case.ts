import { TenantEcommerceOrderApprovalDecisionView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderReviewWorkspaceUseCase } from './get-tenant-ecommerce-order-review-workspace.use-case';
import { RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase } from './request-tenant-ecommerce-order-invoice-draft-bridge.use-case';
import { GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase } from './get-tenant-ecommerce-order-growth-follow-up-workspace.use-case';

export class RequestTenantEcommerceOrderApprovalDecisionUseCase {
  constructor(
    private readonly getTenantEcommerceOrderReviewWorkspaceUseCase: GetTenantEcommerceOrderReviewWorkspaceUseCase,
    private readonly requestTenantEcommerceOrderInvoiceDraftBridgeUseCase: RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
    private readonly getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase: GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderApprovalDecisionView | null> {
    const [reviewWorkspace, invoiceDraftBridge, growthFollowUp] =
      await Promise.all([
        this.getTenantEcommerceOrderReviewWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.requestTenantEcommerceOrderInvoiceDraftBridgeUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
      ]);

    if (!reviewWorkspace || !invoiceDraftBridge || !growthFollowUp) {
      return null;
    }

    const blockedBy = [
      ...reviewWorkspace.blockedBy,
      ...invoiceDraftBridge.blockedBy,
      ...growthFollowUp.blockedBy,
    ];

    const decision =
      blockedBy.length > 0
        ? 'blocked'
        : reviewWorkspace.reviewStatus === 'ready_for_operator_review' &&
            invoiceDraftBridge.bridgeStatus === 'ready_to_open_invoice_draft'
          ? 'approved'
          : 'needs_follow_up';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: reviewWorkspace.productEntity,
      orderDraft: reviewWorkspace.orderDraft,
      decision,
      summary:
        decision === 'approved'
          ? 'La orden ya tiene suficiente forma para aprobación operativa y siguiente handoff controlado.'
          : decision === 'blocked'
            ? 'Todavía hay bloqueos y no conviene marcar esta orden como aprobada.'
            : 'La orden ya puede evaluarse, pero todavía conviene seguimiento o datos adicionales antes de aprobarla.',
      owner: {
        productKey: 'ecommerce',
        role: 'operator',
      },
      rationale:
        decision === 'approved'
          ? 'Review, salida fiscal y follow-up ya están suficientemente alineados para tratar la orden como aprobación operable.'
          : decision === 'blocked'
            ? 'Persisten bloqueos en review, fiscal o follow-up y eso impide tomar una aprobación responsable.'
            : 'La orden todavía necesita confirmaciones del buyer o claridad de salida antes de una aprobación explícita.',
      approvalChecklist: [
        'Confirmar buyer intent, pricing y CTA como una sola decisión operativa.',
        'Decidir si el siguiente paso es factura draft, follow-up o espera de datos.',
        'Registrar explícitamente qué quedó aprobado y qué quedó pendiente.',
      ],
      blockedBy,
      guardrails: [
        ...new Set([
          ...reviewWorkspace.guardrails,
          ...invoiceDraftBridge.guardrails,
          ...growthFollowUp.guardrails,
          'No convertir esta decisión en aprobación automática de cobro, facturación viva o fulfillment.',
        ]),
      ],
    };
  }
}
