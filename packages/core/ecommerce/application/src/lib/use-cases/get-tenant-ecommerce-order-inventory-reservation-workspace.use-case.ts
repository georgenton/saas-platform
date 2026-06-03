import { TenantEcommerceOrderInventoryReservationWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFulfillmentAvailabilityWorkspaceUseCase } from './get-tenant-ecommerce-order-fulfillment-availability-workspace.use-case';

export class GetTenantEcommerceOrderInventoryReservationWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderFulfillmentAvailabilityWorkspaceUseCase: GetTenantEcommerceOrderFulfillmentAvailabilityWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderInventoryReservationWorkspaceView | null> {
    const availability =
      await this.getTenantEcommerceOrderFulfillmentAvailabilityWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      );

    if (!availability) {
      return null;
    }

    const reservationStatus =
      availability.blockedBy.length > 0
        ? 'blocked'
        : availability.availabilityStatus === 'available_for_fulfillment'
          ? 'reserved'
          : 'needs_capacity_review';
    const reservationMode =
      availability.inventoryMode === 'stock_signal'
        ? 'stock_hold'
        : availability.inventoryMode === 'capacity_signal'
          ? 'capacity_hold'
          : 'manual_hold';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: availability.productEntity,
      orderDraft: availability.orderDraft,
      reservationStatus,
      reservationMode,
      summary:
        reservationStatus === 'reserved'
          ? 'La orden tiene una reserva operativa suficiente para sostener la promesa de fulfillment.'
          : reservationStatus === 'blocked'
            ? 'La reserva operativa está bloqueada y no debe prometerse entrega.'
            : 'La orden requiere revisión de capacidad antes de sostener una reserva operativa.',
      reservationSignal: {
        availabilityStatus: availability.availabilityStatus,
        inventoryMode: availability.inventoryMode,
        reservationScope: 'order_draft',
      },
      reservationChecklist: [
        'Mantener la reserva asociada al order draft hasta cerrar fulfillment.',
        'No descontar stock real hasta introducir reservation persistence.',
        'Escalar cualquier restriccion manual antes de prometer entrega.',
      ],
      blockedBy: [...availability.blockedBy],
      nextStep:
        reservationStatus === 'reserved'
          ? 'Continuar hacia fulfillment execution manteniendo visible la reserva operativa.'
          : reservationStatus === 'blocked'
            ? 'Resolver bloqueos de disponibilidad antes de coordinar fulfillment.'
            : 'Validar stock o capacidad manual antes de marcar la orden como reservada.',
      guardrails: [
        ...new Set([
          ...availability.guardrails,
          'Esta reserva es fundacional y no descuenta inventario real todavia.',
        ]),
      ],
    };
  }
}
