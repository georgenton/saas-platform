import { TenantEcommerceOrderPaymentConfirmationLogView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase } from './get-tenant-ecommerce-order-payment-confirmation-workspace.use-case';
import { GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase } from './get-tenant-ecommerce-order-post-sale-lifecycle-detail.use-case';
import { RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase } from './request-tenant-ecommerce-order-payment-confirmation-decision.use-case';

export class GetTenantEcommerceOrderPaymentConfirmationLogUseCase {
  constructor(
    private readonly requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase: RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
    private readonly getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase: GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
    private readonly getTenantEcommerceOrderPostSaleLifecycleDetailUseCase: GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderPaymentConfirmationLogView | null> {
    const [decision, paymentConfirmationWorkspace, postSaleLifecycle] =
      await Promise.all([
        this.requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderPostSaleLifecycleDetailUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
      ]);

    if (!decision || !paymentConfirmationWorkspace || !postSaleLifecycle) {
      return null;
    }

    const blockedBy = [
      ...decision.blockedBy,
      ...paymentConfirmationWorkspace.blockedBy,
      ...postSaleLifecycle.blockedBy,
    ];

    const logStatus =
      blockedBy.length > 0 || decision.decision === 'blocked'
        ? 'disputed'
        : decision.decision === 'confirmed'
          ? 'confirmed'
          : 'needs_review';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: decision.productEntity,
      orderDraft: decision.orderDraft,
      logStatus,
      summary:
        logStatus === 'confirmed'
          ? 'La orden ya tiene una traza operativa explícita de confirmación de cobro.'
          : logStatus === 'disputed'
            ? 'La confirmación de cobro sigue en disputa operativa y conviene mantenerla visible.'
            : 'La orden ya tiene contexto para registrar cobro, pero todavía conviene revisión antes de tratarlo como confirmado.',
      confirmationRecord: {
        confirmedAt: this.nowProvider(),
        confirmationChannel:
          paymentConfirmationWorkspace.expectedCollection.collectionChannel,
        operatorNote:
          logStatus === 'confirmed'
            ? 'Cobro tratado como confirmado con evidencia operativa suficiente.'
            : logStatus === 'disputed'
              ? 'La orden mantiene fricción entre decisión de cobro y lifecycle post-sale.'
              : 'La orden tiene señales parciales de cobro y sigue bajo revisión operativa.',
        evidenceHints: [...paymentConfirmationWorkspace.evidenceHints],
      },
      decisionSignal: {
        paymentDecision: decision.decision,
        postSaleStatus: postSaleLifecycle.currentStatus,
      },
      auditTrail: [
        `Decision de cobro: ${decision.decision}`,
        `Lifecycle post-sale: ${postSaleLifecycle.currentStatus}`,
        `Canal de confirmación esperado: ${paymentConfirmationWorkspace.expectedCollection.collectionChannel}`,
      ],
      blockedBy,
      guardrails: [
        ...new Set([
          ...decision.guardrails,
          ...paymentConfirmationWorkspace.guardrails,
          ...postSaleLifecycle.guardrails,
          'Este log registra confirmación operativa de cobro; no sustituye un comprobante bancario ni un asiento contable.',
        ]),
      ],
    };
  }
}
