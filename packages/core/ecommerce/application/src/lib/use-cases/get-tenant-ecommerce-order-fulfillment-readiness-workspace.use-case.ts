import { TenantEcommerceOrderFulfillmentReadinessWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase } from './get-tenant-ecommerce-order-payment-confirmation-workspace.use-case';
import { GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase } from './get-tenant-ecommerce-order-post-sale-lifecycle-detail.use-case';

export class GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase: GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
    private readonly getTenantEcommerceOrderPostSaleLifecycleDetailUseCase: GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderFulfillmentReadinessWorkspaceView | null> {
    const [paymentConfirmation, postSaleLifecycle] = await Promise.all([
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

    if (!paymentConfirmation || !postSaleLifecycle) {
      return null;
    }

    const blockedBy = [
      ...paymentConfirmation.blockedBy,
      ...postSaleLifecycle.blockedBy,
    ];

    const fulfillmentStatus =
      blockedBy.length > 0
        ? 'blocked'
        : postSaleLifecycle.currentStatus === 'paid'
          ? 'ready_for_fulfillment'
          : 'waiting_payment_confirmation';

    const fulfillmentType =
      paymentConfirmation.productEntity.productType === 'core_offer'
        ? 'service'
        : paymentConfirmation.productEntity.productType === 'upsell'
          ? 'digital'
          : 'digital';

    const deliveryChannel =
      paymentConfirmation.orderDraft.closingChannel === 'whatsapp'
        ? 'whatsapp'
        : paymentConfirmation.orderDraft.customerProfile.email
          ? 'email'
          : 'manual';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: paymentConfirmation.productEntity,
      orderDraft: paymentConfirmation.orderDraft,
      fulfillmentStatus,
      summary:
        fulfillmentStatus === 'ready_for_fulfillment'
          ? 'La orden ya tiene forma suficiente para empezar el tramo operativo de entrega.'
          : fulfillmentStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene mover esta orden a fulfillment.'
            : 'La orden ya tiene contexto de post-venta, pero todavía conviene esperar confirmación de cobro antes de entregar.',
      fulfillmentProfile: {
        fulfillmentType,
        deliveryChannel,
        ownerRole: 'operator',
      },
      prerequisites: [
        'Mantener visible el estado post-sale antes de entregar.',
        'Confirmar que el buyer profile tiene un canal claro de contacto.',
        'No separar fulfillment readiness del estado de cobro esperado.',
      ],
      blockedBy,
      nextStep:
        fulfillmentStatus === 'ready_for_fulfillment'
          ? 'Coordinar entrega o activación siguiendo el fulfillment type y el canal de entrega definido.'
          : fulfillmentStatus === 'blocked'
            ? 'Resolver bloqueos de cobro o lifecycle antes de tocar fulfillment.'
            : 'Esperar confirmación de cobro o señal equivalente antes de destrabar fulfillment.',
      guardrails: [
        ...new Set([
          ...paymentConfirmation.guardrails,
          ...postSaleLifecycle.guardrails,
          'Este workspace funda readiness de fulfillment; no modela todavía tracking de entrega ni cierre post-servicio.',
        ]),
      ],
    };
  }
}
