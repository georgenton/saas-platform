import { TenantEcommerceOrderFulfillmentAvailabilityWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase } from './get-tenant-ecommerce-order-fulfillment-readiness-workspace.use-case';

export class GetTenantEcommerceOrderFulfillmentAvailabilityWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase: GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderFulfillmentAvailabilityWorkspaceView | null> {
    const readiness =
      await this.getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      );

    if (!readiness) {
      return null;
    }

    const buyerContactStatus =
      readiness.orderDraft.customerProfile.email ||
      readiness.orderDraft.customerProfile.whatsappPhone
        ? 'ready'
        : 'needs_contact_data';
    const blockedBy = [
      ...readiness.blockedBy,
      ...(buyerContactStatus === 'needs_contact_data'
        ? ['Falta email o WhatsApp para coordinar fulfillment.']
        : []),
    ];
    const availabilityStatus =
      blockedBy.length > 0
        ? 'blocked'
        : readiness.fulfillmentStatus === 'ready_for_fulfillment'
          ? 'available_for_fulfillment'
          : 'needs_capacity_review';
    const inventoryMode =
      readiness.fulfillmentProfile.fulfillmentType === 'physical'
        ? 'stock_signal'
        : readiness.fulfillmentProfile.fulfillmentType === 'service'
          ? 'capacity_signal'
          : 'not_tracked_yet';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: readiness.productEntity,
      orderDraft: readiness.orderDraft,
      availabilityStatus,
      inventoryMode,
      summary:
        availabilityStatus === 'available_for_fulfillment'
          ? 'La orden tiene disponibilidad operativa suficiente para pasar a fulfillment controlado.'
          : availabilityStatus === 'blocked'
            ? 'La disponibilidad operativa está bloqueada y no conviene coordinar entrega todavía.'
            : 'La orden necesita revisión de capacidad antes de confirmar fulfillment.',
      availabilitySignals: {
        paymentStatus:
          readiness.fulfillmentStatus === 'blocked'
            ? 'blocked'
            : readiness.fulfillmentStatus === 'ready_for_fulfillment'
              ? 'confirmed'
              : 'waiting_payment_confirmation',
        fulfillmentStatus: readiness.fulfillmentStatus,
        buyerContactStatus,
        productType: readiness.productEntity.productType,
      },
      capacityChecklist: [
        'Confirmar disponibilidad del equipo o activo antes de prometer entrega.',
        'Mantener la orden fuera de shipping real hasta tener stock/capacity tracking persistido.',
        'Registrar manualmente cualquier restriccion de capacidad que bloquee fulfillment.',
      ],
      blockedBy,
      nextStep:
        availabilityStatus === 'available_for_fulfillment'
          ? 'Coordinar entrega con el owner operativo y dejar evidencia antes del cierre post-sale.'
          : availabilityStatus === 'blocked'
            ? 'Resolver contacto, cobro o bloqueos de lifecycle antes de tocar fulfillment.'
            : 'Revisar capacidad o stock operativo antes de confirmar la promesa de entrega.',
      guardrails: [
        ...new Set([
          ...readiness.guardrails,
          'Esta availability foundation no reserva stock ni ejecuta shipping real todavia.',
        ]),
      ],
    };
  }
}
