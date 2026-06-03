import {
  TenantEcommerceOrderPostSaleLifecycleDetailView,
  TenantEcommerceOrderPostSaleLifecycleEntryView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderDraftDetailUseCase } from './get-tenant-ecommerce-order-draft-detail.use-case';
import { GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase } from './get-tenant-ecommerce-order-payment-readiness-workspace.use-case';

export class GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase {
  constructor(
    private readonly getTenantEcommerceOrderDraftDetailUseCase: GetTenantEcommerceOrderDraftDetailUseCase,
    private readonly getTenantEcommerceOrderPaymentReadinessWorkspaceUseCase: GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderPostSaleLifecycleDetailView | null> {
    const [orderDraftDetail, paymentReadiness] = await Promise.all([
      this.getTenantEcommerceOrderDraftDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
      this.getTenantEcommerceOrderPaymentReadinessWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
    ]);

    if (!orderDraftDetail || !paymentReadiness) {
      return null;
    }

    const blockedBy = [
      ...orderDraftDetail.blockedBy,
      ...paymentReadiness.blockedBy,
    ];

    const currentStatus =
      blockedBy.length > 0
        ? 'blocked'
        : paymentReadiness.workspaceStatus === 'ready_for_collection'
          ? 'awaiting_payment'
          : orderDraftDetail.orderDraft.status === 'ready_for_review'
            ? 'invoicing'
            : 'handed_off';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: orderDraftDetail.productEntity,
      orderDraft: orderDraftDetail.orderDraft,
      currentStatus,
      summary:
        currentStatus === 'awaiting_payment'
          ? 'La orden ya salió del handoff inicial y ahora puede seguirse como cobro pendiente.'
          : currentStatus === 'invoicing'
            ? 'La orden ya quedó en una fase posterior al handoff y está enfocada en el frente fiscal.'
            : currentStatus === 'blocked'
              ? 'La orden tiene bloqueos post-handoff y conviene mantenerla visible antes de seguir avanzando.'
              : 'La orden ya salió del tramo inicial y empieza su lifecycle post-venta operable.',
      lastAction:
        currentStatus === 'awaiting_payment'
          ? 'Payment readiness consolidado para operar seguimiento de cobro.'
          : currentStatus === 'invoicing'
            ? 'Invoice handoff acknowledgement marcado como aceptado.'
            : currentStatus === 'blocked'
              ? 'Se detectaron bloqueos en handoff fiscal o readiness de cobro.'
              : 'La orden quedó marcada como handed off para el siguiente tramo operativo.',
      nextStep:
        currentStatus === 'awaiting_payment'
          ? 'Monitorear confirmación de pago y mantener el estado post-sale visible.'
          : currentStatus === 'invoicing'
            ? 'Cerrar el frente fiscal y preparar la transición hacia cobro esperado.'
            : currentStatus === 'blocked'
              ? 'Resolver bloqueos antes de tratar la orden como post-sale estable.'
              : 'Confirmar recepción fiscal y siguiente señal de cobro.',
      timeline: this.buildTimeline(currentStatus, blockedBy),
      blockedBy,
      guardrails: [
        ...new Set([
          ...orderDraftDetail.guardrails,
          ...paymentReadiness.guardrails,
          'Este lifecycle post-sale es fundacional; no sustituye fulfillment, conciliación ni reporting definitivo.',
        ]),
      ],
    };
  }

  private buildTimeline(
    currentStatus: TenantEcommerceOrderPostSaleLifecycleDetailView['currentStatus'],
    blockedBy: string[],
  ): TenantEcommerceOrderPostSaleLifecycleEntryView[] {
    const orderedKeys: TenantEcommerceOrderPostSaleLifecycleEntryView['key'][] =
      ['handed_off', 'invoicing', 'awaiting_payment', 'paid', 'blocked'];

    const activeIndex = orderedKeys.indexOf(currentStatus);

    return orderedKeys.map((key, index) => ({
      key,
      label: key.replace(/_/g, ' '),
      status:
        key === 'blocked'
          ? blockedBy.length > 0
            ? 'active'
            : 'pending'
          : index < activeIndex && currentStatus !== 'blocked'
            ? 'completed'
            : index === activeIndex
              ? 'active'
              : 'pending',
      detail:
        key === 'handed_off'
          ? 'La orden ya salió del tramo inicial de aprobación y revisión.'
          : key === 'invoicing'
            ? 'El frente fiscal ya puede tomar la orden como siguiente paso operable.'
            : key === 'awaiting_payment'
              ? 'La orden ya puede seguirse como cobro esperado.'
              : key === 'paid'
                ? 'La base ya contempla una futura confirmación de pago.'
                : 'La orden mantiene bloqueos visibles en su lifecycle post-sale.',
    }));
  }
}
