import { TenantEcommerceOrderHandoffDecisionView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase } from './get-tenant-ecommerce-order-fiscal-data-completion-workspace.use-case';
import { GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase } from './get-tenant-ecommerce-order-growth-follow-up-workspace.use-case';
import { RequestTenantEcommerceOrderApprovalDecisionUseCase } from './request-tenant-ecommerce-order-approval-decision.use-case';
import { RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase } from './request-tenant-ecommerce-order-invoice-draft-bridge.use-case';

export class RequestTenantEcommerceOrderHandoffDecisionUseCase {
  constructor(
    private readonly requestTenantEcommerceOrderApprovalDecisionUseCase: RequestTenantEcommerceOrderApprovalDecisionUseCase,
    private readonly getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase: GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
    private readonly getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase: GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
    private readonly requestTenantEcommerceOrderInvoiceDraftBridgeUseCase: RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderHandoffDecisionView | null> {
    const [approvalDecision, fiscalWorkspace, growthFollowUpWorkspace, invoiceBridge] =
      await Promise.all([
        this.requestTenantEcommerceOrderApprovalDecisionUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase.execute(
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
      !approvalDecision ||
      !fiscalWorkspace ||
      !growthFollowUpWorkspace ||
      !invoiceBridge
    ) {
      return null;
    }

    const blockedBy = [
      ...approvalDecision.blockedBy,
      ...fiscalWorkspace.blockedBy,
      ...growthFollowUpWorkspace.blockedBy,
      ...invoiceBridge.blockedBy,
    ];

    const route =
      blockedBy.length > 0
        ? 'hold'
        : approvalDecision.decision === 'approved' &&
            fiscalWorkspace.workspaceStatus === 'ready' &&
            invoiceBridge.bridgeStatus === 'ready_to_open_invoice_draft'
          ? 'invoicing'
          : growthFollowUpWorkspace.workspaceStatus ===
                'ready_for_growth_follow_up' &&
              approvalDecision.decision !== 'blocked'
            ? 'growth_follow_up'
            : 'hold';

    const handoffStatus =
      blockedBy.length > 0 ? 'blocked' : route === 'hold' ? 'needs_data' : 'ready';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: approvalDecision.productEntity,
      orderDraft: approvalDecision.orderDraft,
      handoffStatus,
      route,
      summary:
        handoffStatus === 'ready' && route === 'invoicing'
          ? 'La orden ya puede salir al intake fiscal de Invoicing con un handoff controlado.'
          : handoffStatus === 'ready'
            ? 'La orden ya puede salir a Growth follow-up como siguiente paso operativo.'
            : handoffStatus === 'blocked'
              ? 'La orden todavía tiene bloqueos y no conviene tomar un handoff operativo.'
              : 'La orden necesita más datos antes de fijar un handoff responsable.',
      owner: {
        productKey: 'ecommerce',
        role: 'operator',
      },
      rationale:
        route === 'invoicing'
          ? 'La aprobación, la salida fiscal y el bridge de factura ya están suficientemente alineados.'
          : route === 'growth_follow_up'
            ? 'Todavía conviene seguimiento comercial antes de empujar la orden a factura.'
            : blockedBy.length > 0
              ? 'Persisten bloqueos visibles en review, fiscal o follow-up.'
              : 'Todavía faltan señales suficientes para decidir entre facturación y seguimiento.',
      routeChecklist:
        route === 'invoicing'
          ? [
              'Confirmar buyer profile y datos fiscales mínimos antes del handoff.',
              'Adjuntar snapshot comercial de oferta, precio y CTA.',
              'Abrir el intake fiscal solo como draft asistido.',
            ]
          : route === 'growth_follow_up'
            ? [
                'Mantener consistente el CTA entre checkout y WhatsApp.',
                'Explicitar el siguiente paso comercial antes de soltar el hilo.',
                'Retomar la orden sin perder referencia del draft persistido.',
              ]
            : [
                'Resolver datos faltantes antes de elegir ruta operativa.',
                'Evitar handoff a Invoicing o Growth hasta tener decisión explícita.',
                'Mantener la orden visible en revisión operativa.',
              ],
      blockedBy,
      guardrails: [
        ...new Set([
          ...approvalDecision.guardrails,
          ...fiscalWorkspace.guardrails,
          ...growthFollowUpWorkspace.guardrails,
          ...invoiceBridge.guardrails,
          'No convertir esta decisión en cobro vivo, emisión final ni automatización de post-venta.',
        ]),
      ],
    };
  }
}
