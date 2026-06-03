import { TenantEcommerceOrderInvoiceExecutionPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase } from './get-tenant-ecommerce-order-fiscal-data-completion-workspace.use-case';
import { GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase } from './get-tenant-ecommerce-order-operational-review-workspace.use-case';
import { RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase } from './request-tenant-ecommerce-order-invoice-draft-bridge.use-case';
import { RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase } from './request-tenant-ecommerce-order-payment-confirmation-decision.use-case';

export class RequestTenantEcommerceOrderInvoiceExecutionPacketUseCase {
  constructor(
    private readonly requestTenantEcommerceOrderInvoiceDraftBridgeUseCase: RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
    private readonly getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase: GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
    private readonly requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase: RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
    private readonly getTenantEcommerceOrderOperationalReviewWorkspaceUseCase: GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderInvoiceExecutionPacketView | null> {
    const [invoiceBridge, fiscalWorkspace, paymentDecision, operationalReview] =
      await Promise.all([
        this.requestTenantEcommerceOrderInvoiceDraftBridgeUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderOperationalReviewWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
      ]);

    if (
      !invoiceBridge ||
      !fiscalWorkspace ||
      !paymentDecision ||
      !operationalReview
    ) {
      return null;
    }

    const blockedBy = [
      ...invoiceBridge.blockedBy,
      ...fiscalWorkspace.blockedBy,
      ...paymentDecision.blockedBy,
      ...operationalReview.blockerSignals,
    ];
    const requiredActions = [
      ...invoiceBridge.missingFields.map(
        (field) => `Completar dato fiscal ${field}.`,
      ),
      ...operationalReview.driftSignals.map(
        (signal) => `Resolver drift operativo ${signal}.`,
      ),
      paymentDecision.decision === 'confirmed'
        ? null
        : 'Confirmar cobro operativo antes de preparar factura viva.',
    ].filter((entry): entry is string => typeof entry === 'string');

    const executionStatus =
      blockedBy.length > 0 ||
      invoiceBridge.bridgeStatus === 'blocked' ||
      fiscalWorkspace.workspaceStatus === 'blocked' ||
      paymentDecision.decision === 'blocked' ||
      operationalReview.reviewStatus === 'blocked'
        ? 'blocked'
        : invoiceBridge.bridgeStatus === 'ready_to_open_invoice_draft' &&
            fiscalWorkspace.workspaceStatus === 'ready' &&
            paymentDecision.decision === 'confirmed' &&
            operationalReview.reviewStatus === 'ready_for_closeout'
          ? 'ready_for_invoice_execution'
          : 'needs_review';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: invoiceBridge.productEntity,
      orderDraft: invoiceBridge.orderDraft,
      executionStatus,
      summary:
        executionStatus === 'ready_for_invoice_execution'
          ? 'La orden ya tiene payload fiscal, cobro y health operativo suficientes para preparar la ejecución de factura.'
          : executionStatus === 'blocked'
            ? 'La ejecución de factura está bloqueada por datos, cobro u operación pendiente.'
            : 'La orden puede perfilarse a factura, pero aún necesita revisión antes de ejecutar.',
      invoicePayload: {
        customerLabel: invoiceBridge.invoiceDraftSeed.customerLabel,
        documentType: 'invoice',
        offerTitle: invoiceBridge.invoiceDraftSeed.offerTitle,
        pricingSnapshot: invoiceBridge.invoiceDraftSeed.pricingSnapshot,
        billingIntent: invoiceBridge.invoiceDraftSeed.billingIntent,
        sourceOrderDraftId: invoiceBridge.orderDraft.id,
      },
      readinessSignals: {
        invoiceBridgeStatus: invoiceBridge.bridgeStatus,
        fiscalWorkspaceStatus: fiscalWorkspace.workspaceStatus,
        paymentDecision: paymentDecision.decision,
        operationalReviewStatus: operationalReview.reviewStatus,
      },
      requiredActions,
      blockedBy,
      guardrails: [
        ...new Set([
          ...invoiceBridge.guardrails,
          ...fiscalWorkspace.guardrails,
          ...paymentDecision.guardrails,
          ...operationalReview.guardrails,
          'Este packet prepara la ejecución; no crea ni emite una factura real.',
          'Validar RUC/cédula/pasaporte y autorización fiscal antes de crear documentos en Invoicing.',
        ]),
      ],
    };
  }
}
