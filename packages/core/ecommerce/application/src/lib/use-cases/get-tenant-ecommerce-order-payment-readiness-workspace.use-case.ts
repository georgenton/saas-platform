import { TenantEcommerceOrderPaymentReadinessWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderDraftDetailUseCase } from './get-tenant-ecommerce-order-draft-detail.use-case';

export class GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderDraftDetailUseCase: GetTenantEcommerceOrderDraftDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderPaymentReadinessWorkspaceView | null> {
    const orderDraftDetail =
      await this.getTenantEcommerceOrderDraftDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      );

    if (!orderDraftDetail) {
      return null;
    }

    const blockedBy = [...orderDraftDetail.blockedBy];
    const missingFields = [...orderDraftDetail.orderDraft.missingFields];

    const workspaceStatus =
      blockedBy.length > 0
        ? 'blocked'
        : orderDraftDetail.orderDraft.status === 'ready_for_review' &&
            missingFields.length === 0
          ? 'ready_for_collection'
          : 'needs_confirmation';

    const frictionPoints = [
      ...missingFields.map((field) => `Completar ${field} antes del cobro.`),
      ...(orderDraftDetail.orderDraft.status === 'ready_for_review'
        ? []
        : ['La orden todavía no está lista para revisión operativa.']),
    ];

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: orderDraftDetail.productEntity,
      orderDraft: orderDraftDetail.orderDraft,
      workspaceStatus,
      summary:
        workspaceStatus === 'ready_for_collection'
          ? 'La orden ya tiene suficiente forma comercial y fiscal para operarse como cobro esperado.'
          : workspaceStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar esta orden como lista para cobro.'
            : 'La orden ya se puede revisar como cobro esperado, pero todavía necesita confirmaciones adicionales.',
      paymentPlan: {
        collectionChannel: orderDraftDetail.orderDraft.closingChannel,
        pricingSnapshot: orderDraftDetail.orderDraft.pricingSnapshot,
        billingIntent:
          orderDraftDetail.orderDraft.customerProfile.billingIntent,
        primaryCta: orderDraftDetail.orderDraft.primaryCta,
      },
      invoiceSignal: {
        acknowledgementStatus:
          missingFields.length === 0 ? 'accepted' : 'needs_data',
        detail:
          missingFields.length === 0
            ? 'El handoff fiscal ya fue aceptado como preparación operable.'
            : 'Todavía falta cerrar mejor el buyer profile fiscal antes de operar cobro con confianza.',
      },
      closeoutSignal: {
        closeoutStatus:
          orderDraftDetail.orderDraft.status === 'ready_for_review'
            ? 'ready_for_operator_closeout'
            : 'needs_data',
        paymentReadinessStatus:
          workspaceStatus === 'ready_for_collection'
            ? 'ready'
            : 'needs_customer_input',
      },
      readinessChecklist: [
        'Confirmar que el buyer entiende el siguiente paso de cobro.',
        'Mantener consistente el pricing snapshot con el canal de cierre.',
        'No perder trazabilidad entre closeout, handoff fiscal y seguimiento comercial.',
      ],
      frictionPoints: [...new Set(frictionPoints)],
      nextStep:
        workspaceStatus === 'ready_for_collection'
          ? 'Operar la orden como pendiente de cobro y mantener visible el estado posterior al handoff.'
          : workspaceStatus === 'blocked'
            ? 'Resolver bloqueos fiscales o comerciales antes de tratar la orden como cobro esperado.'
            : 'Completar confirmaciones de buyer intent o recepción fiscal antes del siguiente paso.',
      blockedBy,
      guardrails: [
        ...new Set([
          ...orderDraftDetail.guardrails,
          'Este workspace modela readiness de cobro, no confirmación de pago real ni conciliación bancaria.',
        ]),
      ],
    };
  }
}
