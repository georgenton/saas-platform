import { TenantEcommerceOrderFulfillmentExecutionWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase } from './get-tenant-ecommerce-order-fulfillment-readiness-workspace.use-case';
import { GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase } from './get-tenant-ecommerce-order-post-sale-lifecycle-detail.use-case';
import { RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase } from './request-tenant-ecommerce-order-payment-confirmation-decision.use-case';

export class GetTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase {
  constructor(
    private readonly requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase: RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
    private readonly getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase: GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
    private readonly getTenantEcommerceOrderPostSaleLifecycleDetailUseCase: GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderFulfillmentExecutionWorkspaceView | null> {
    const [
      paymentConfirmationDecision,
      fulfillmentReadinessWorkspace,
      postSaleLifecycleDetail,
    ] = await Promise.all([
      this.requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase.execute(
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
      !paymentConfirmationDecision ||
      !fulfillmentReadinessWorkspace ||
      !postSaleLifecycleDetail
    ) {
      return null;
    }

    const blockedBy = [
      ...paymentConfirmationDecision.blockedBy,
      ...fulfillmentReadinessWorkspace.blockedBy,
      ...postSaleLifecycleDetail.blockedBy,
    ];

    const executionStatus =
      blockedBy.length > 0
        ? 'blocked'
        : paymentConfirmationDecision.decision === 'confirmed' ||
            fulfillmentReadinessWorkspace.fulfillmentStatus ===
              'ready_for_fulfillment'
          ? 'ready_to_execute'
          : 'waiting_payment_confirmation';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: fulfillmentReadinessWorkspace.productEntity,
      orderDraft: fulfillmentReadinessWorkspace.orderDraft,
      executionStatus,
      summary:
        executionStatus === 'ready_to_execute'
          ? 'La orden ya tiene suficiente forma para ejecutar fulfillment como siguiente tramo operativo.'
          : executionStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene ejecutar fulfillment sobre esta orden.'
            : 'La orden ya tiene base para fulfillment, pero todavía conviene esperar una confirmación de cobro más explícita.',
      fulfillmentProfile: {
        ...fulfillmentReadinessWorkspace.fulfillmentProfile,
      },
      executionSignals: {
        paymentDecision: paymentConfirmationDecision.decision,
        postSaleStatus: postSaleLifecycleDetail.currentStatus,
        readinessStatus: fulfillmentReadinessWorkspace.fulfillmentStatus,
      },
      executionChecklist: [
        'Validar que el buyer tiene un canal de entrega claro.',
        'Mantener visible la relación entre cobro confirmado y fulfillment activado.',
        'Registrar el siguiente paso operativo antes de tratar la entrega como ejecutada.',
      ],
      blockedBy,
      nextStep:
        executionStatus === 'ready_to_execute'
          ? 'Coordinar la entrega o activación usando el canal y fulfillment type definidos.'
          : executionStatus === 'blocked'
            ? 'Resolver bloqueos de pago o lifecycle antes de activar fulfillment.'
            : 'Esperar confirmación operativa de cobro o una transición post-sale más fuerte.',
      guardrails: [
        ...new Set([
          ...paymentConfirmationDecision.guardrails,
          ...fulfillmentReadinessWorkspace.guardrails,
          ...postSaleLifecycleDetail.guardrails,
          'Este workspace habilita ejecución de fulfillment; no modela todavía tracking de entrega ni cierre post-servicio.',
        ]),
      ],
    };
  }
}
