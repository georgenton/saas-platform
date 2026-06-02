import { TenantEcommerceInvoiceDraftIntakeWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderDraftDetailUseCase } from './get-tenant-ecommerce-order-draft-detail.use-case';
import { GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase } from './get-tenant-ecommerce-order-fiscal-data-completion-workspace.use-case';
import { RequestTenantEcommerceOrderHandoffDecisionUseCase } from './request-tenant-ecommerce-order-handoff-decision.use-case';
import { RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase } from './request-tenant-ecommerce-order-invoice-draft-bridge.use-case';

export class GetTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderDraftDetailUseCase: GetTenantEcommerceOrderDraftDetailUseCase,
    private readonly getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase: GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
    private readonly requestTenantEcommerceOrderHandoffDecisionUseCase: RequestTenantEcommerceOrderHandoffDecisionUseCase,
    private readonly requestTenantEcommerceOrderInvoiceDraftBridgeUseCase: RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceInvoiceDraftIntakeWorkspaceView | null> {
    const [orderDraftDetail, fiscalWorkspace, handoffDecision, invoiceBridge] =
      await Promise.all([
        this.getTenantEcommerceOrderDraftDetailUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.requestTenantEcommerceOrderHandoffDecisionUseCase.execute(
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

    if (!orderDraftDetail || !fiscalWorkspace || !handoffDecision || !invoiceBridge) {
      return null;
    }

    const blockedBy = [
      ...orderDraftDetail.blockedBy,
      ...fiscalWorkspace.blockedBy,
      ...handoffDecision.blockedBy,
      ...invoiceBridge.blockedBy,
    ];

    const workspaceStatus =
      blockedBy.length > 0
        ? 'blocked'
        : handoffDecision.route === 'invoicing' &&
            handoffDecision.handoffStatus === 'ready' &&
            fiscalWorkspace.workspaceStatus === 'ready' &&
            invoiceBridge.bridgeStatus === 'ready_to_open_invoice_draft'
          ? 'ready_to_open_invoice_draft'
          : 'needs_data';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: orderDraftDetail.productEntity,
      orderDraft: orderDraftDetail.orderDraft,
      workspaceStatus,
      summary:
        workspaceStatus === 'ready_to_open_invoice_draft'
          ? 'La orden ya tiene un intake fiscal suficientemente armado para abrir el draft en Invoicing.'
          : workspaceStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar esta orden como intake fiscal listo.'
            : 'La orden ya tiene parte del payload fiscal, pero todavía faltan datos o decisión de handoff.',
      targetWorkspace: {
        productKey: 'invoicing',
        stage: 'electronic_invoicing_ec_mvp',
        handoffMode: 'operator_assist',
      },
      commercialSnapshot: {
        offerTitle: orderDraftDetail.orderDraft.offerTitle,
        pricingSnapshot: orderDraftDetail.orderDraft.pricingSnapshot,
        primaryCta: orderDraftDetail.orderDraft.primaryCta,
        closingChannel: orderDraftDetail.orderDraft.closingChannel,
      },
      fiscalSnapshot: {
        requiredFields: [...fiscalWorkspace.requiredFields],
        missingFields: [...fiscalWorkspace.missingFields],
        billingIntent: orderDraftDetail.orderDraft.customerProfile.billingIntent,
      },
      handoffArtifacts: [
        ...new Set([
          ...invoiceBridge.handoffArtifacts,
          'Order review outcome',
          'Handoff decision snapshot',
        ]),
      ],
      operatorChecklist: [
        'Confirmar que el buyer profile coincide con el snapshot comercial.',
        'Verificar que la ruta elegida siga siendo Invoicing antes de abrir el draft.',
        'Mantener esta salida como draft asistido, no como emisión viva.',
      ],
      blockedBy,
      guardrails: [
        ...new Set([
          ...orderDraftDetail.guardrails,
          ...fiscalWorkspace.guardrails,
          ...handoffDecision.guardrails,
          ...invoiceBridge.guardrails,
          'No tratar este intake como emisión final ni como autorización tributaria automática.',
        ]),
      ],
    };
  }
}
