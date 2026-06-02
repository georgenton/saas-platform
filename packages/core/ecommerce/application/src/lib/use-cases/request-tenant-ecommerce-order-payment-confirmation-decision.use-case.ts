import { TenantEcommerceOrderPaymentConfirmationDecisionView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase } from './get-tenant-ecommerce-order-fulfillment-readiness-workspace.use-case';
import { GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase } from './get-tenant-ecommerce-order-payment-confirmation-workspace.use-case';
import { GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase } from './get-tenant-ecommerce-order-post-sale-lifecycle-detail.use-case';

export class RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase {
  constructor(
    private readonly getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase: GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
    private readonly getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase: GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
    private readonly getTenantEcommerceOrderPostSaleLifecycleDetailUseCase: GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderPaymentConfirmationDecisionView | null> {
    const [
      paymentConfirmationWorkspace,
      fulfillmentReadinessWorkspace,
      postSaleLifecycleDetail,
    ] = await Promise.all([
      this.getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
      this.getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase.execute(
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

    if (
      !paymentConfirmationWorkspace ||
      !fulfillmentReadinessWorkspace ||
      !postSaleLifecycleDetail
    ) {
      return null;
    }

    const blockedBy = [
      ...paymentConfirmationWorkspace.blockedBy,
      ...fulfillmentReadinessWorkspace.blockedBy,
      ...postSaleLifecycleDetail.blockedBy,
    ];

    const decision =
      blockedBy.length > 0
        ? 'blocked'
        : paymentConfirmationWorkspace.confirmationStatus ===
              'ready_for_confirmation' &&
            postSaleLifecycleDetail.currentStatus === 'awaiting_payment'
          ? 'confirmed'
          : 'needs_review';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: paymentConfirmationWorkspace.productEntity,
      orderDraft: paymentConfirmationWorkspace.orderDraft,
      decision,
      summary:
        decision === 'confirmed'
          ? 'La orden ya tiene forma suficiente para confirmar cobro como decisión operativa explícita.'
          : decision === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar esta orden como cobro confirmado.'
            : 'La orden ya puede revisarse para confirmar cobro, pero todavía conviene más validación operativa.',
      owner: {
        productKey: 'ecommerce',
        role: 'operator',
      },
      rationale:
        decision === 'confirmed'
          ? 'Payment confirmation, lifecycle post-sale y readiness de fulfillment ya están lo bastante alineados para tomar una confirmación operativa responsable.'
          : decision === 'blocked'
            ? 'Persisten bloqueos en cobro, lifecycle o readiness de fulfillment y eso impide confirmar el pago con confianza.'
            : 'Todavía falta cerrar señales de cobro o una transición más clara hacia fulfillment antes de marcar la orden como confirmada.',
      confirmationChecklist: [
        'Confirmar que el buyer entiende el paso de cobro y el monto esperado.',
        'Mantener consistente el pricing snapshot con el estado post-sale actual.',
        'No mover fulfillment como hecho hasta dejar explícita la confirmación operativa.',
      ],
      blockedBy,
      guardrails: [
        ...new Set([
          ...paymentConfirmationWorkspace.guardrails,
          ...fulfillmentReadinessWorkspace.guardrails,
          ...postSaleLifecycleDetail.guardrails,
          'Esta decisión confirma cobro en términos operativos; no sustituye conciliación bancaria ni cierre contable.',
        ]),
      ],
    };
  }
}
