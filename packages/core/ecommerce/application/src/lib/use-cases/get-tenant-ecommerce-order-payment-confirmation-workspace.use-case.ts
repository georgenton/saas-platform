import { TenantEcommerceOrderPaymentConfirmationWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase } from './get-tenant-ecommerce-order-payment-readiness-workspace.use-case';

export class GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderPaymentReadinessWorkspaceUseCase: GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderPaymentConfirmationWorkspaceView | null> {
    const paymentReadiness =
      await this.getTenantEcommerceOrderPaymentReadinessWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      );

    if (!paymentReadiness) {
      return null;
    }

    const blockedBy = [...paymentReadiness.blockedBy];
    const lifecycleStatus =
      paymentReadiness.workspaceStatus === 'ready_for_collection'
        ? 'awaiting_payment'
        : paymentReadiness.workspaceStatus === 'blocked'
          ? 'blocked'
          : 'invoicing';

    const confirmationStatus =
      blockedBy.length > 0
        ? 'blocked'
        : paymentReadiness.workspaceStatus === 'ready_for_collection'
          ? 'ready_for_confirmation'
          : 'needs_review';

    const evidenceHints = [
      `Pricing snapshot esperado: ${paymentReadiness.paymentPlan.pricingSnapshot}`,
      `Billing intent declarado: ${paymentReadiness.paymentPlan.billingIntent ?? 'sin billing intent todavía'}`,
      `Estado post-sale derivado: ${lifecycleStatus}`,
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
        currentStatus: lifecycleStatus,
        detail:
          lifecycleStatus === 'awaiting_payment'
            ? 'La orden ya está posicionada como cobro pendiente dentro del lifecycle post-sale.'
            : lifecycleStatus === 'invoicing'
              ? 'La orden todavía está más cargada hacia frente fiscal que a confirmación de cobro.'
              : 'El lifecycle post-sale todavía muestra bloqueos explícitos.',
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
          'Este workspace prepara confirmación de cobro; no sustituye conciliación bancaria ni registro contable.',
        ]),
      ],
    };
  }
}
