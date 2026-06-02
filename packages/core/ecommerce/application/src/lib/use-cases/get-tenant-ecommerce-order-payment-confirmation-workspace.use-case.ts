import { TenantEcommerceOrderPaymentConfirmationWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase } from './get-tenant-ecommerce-order-payment-readiness-workspace.use-case';
import { GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase } from './get-tenant-ecommerce-order-post-sale-lifecycle-detail.use-case';

export class GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderPaymentReadinessWorkspaceUseCase: GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase,
    private readonly getTenantEcommerceOrderPostSaleLifecycleDetailUseCase: GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderPaymentConfirmationWorkspaceView | null> {
    const [paymentReadiness, postSaleLifecycle] = await Promise.all([
      this.getTenantEcommerceOrderPaymentReadinessWorkspaceUseCase.execute(
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

    if (!paymentReadiness || !postSaleLifecycle) {
      return null;
    }

    const blockedBy = [
      ...paymentReadiness.blockedBy,
      ...postSaleLifecycle.blockedBy,
    ];

    const confirmationStatus =
      blockedBy.length > 0
        ? 'blocked'
        : paymentReadiness.workspaceStatus === 'ready_for_collection' &&
            postSaleLifecycle.currentStatus === 'awaiting_payment'
          ? 'ready_for_confirmation'
          : 'needs_review';

    const evidenceHints = [
      `Pricing snapshot esperado: ${paymentReadiness.paymentPlan.pricingSnapshot}`,
      `Billing intent declarado: ${paymentReadiness.paymentPlan.billingIntent ?? 'sin billing intent todavía'}`,
      `Estado post-sale actual: ${postSaleLifecycle.currentStatus}`,
      ...paymentReadiness.frictionPoints,
    ];

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: paymentReadiness.productEntity,
      orderDraft: paymentReadiness.orderDraft,
      confirmationStatus,
      summary:
        confirmationStatus === 'ready_for_confirmation'
          ? 'La orden ya tiene suficiente contexto comercial y fiscal para operar una confirmación de cobro asistida.'
          : confirmationStatus === 'blocked'
            ? 'La orden todavía tiene bloqueos y no conviene tratarla como candidata a confirmación de cobro.'
            : 'La orden ya se puede revisar para confirmación de cobro, pero todavía necesita validaciones operativas.',
      expectedCollection: {
        ...paymentReadiness.paymentPlan,
      },
      lifecycleSignal: {
        currentStatus: postSaleLifecycle.currentStatus,
        detail:
          postSaleLifecycle.currentStatus === 'awaiting_payment'
            ? 'La orden ya está posicionada como cobro pendiente dentro del lifecycle post-sale.'
            : postSaleLifecycle.currentStatus === 'invoicing'
              ? 'La orden todavía está más cargada hacia frente fiscal que a confirmación de cobro.'
              : postSaleLifecycle.currentStatus === 'blocked'
                ? 'El lifecycle post-sale todavía muestra bloqueos explícitos.'
                : 'La orden sigue transitando post-sale, pero aún no está en su mejor punto para confirmación.',
      },
      confirmationChecklist: [
        'Verificar que el buyer reconoce el siguiente paso de cobro.',
        'Mantener consistente el pricing snapshot con el canal de cierre.',
        'No separar confirmación de cobro del estado fiscal y post-sale de la orden.',
      ],
      evidenceHints: [...new Set(evidenceHints)],
      nextStep:
        confirmationStatus === 'ready_for_confirmation'
          ? 'Solicitar o registrar señal operativa de cobro confirmado antes de mover fulfillment.'
          : confirmationStatus === 'blocked'
            ? 'Resolver bloqueos de payment readiness o post-sale antes de revisar confirmación.'
            : 'Completar revisión operativa del cobro esperado antes de tratar la orden como confirmable.',
      blockedBy,
      guardrails: [
        ...new Set([
          ...paymentReadiness.guardrails,
          ...postSaleLifecycle.guardrails,
          'Este workspace prepara confirmación de cobro; no sustituye conciliación bancaria ni registro contable.',
        ]),
      ],
    };
  }
}
