import {
  TenantEcommerceOrderOperationalEventType,
  TenantEcommerceOrderOperationalEventView,
  TenantEcommerceOrderOperationalReviewWorkspaceView,
} from '@saas-platform/ecommerce-domain';
import { ListTenantEcommerceOrderOperationalEventsUseCase } from './list-tenant-ecommerce-order-operational-events.use-case';

const OPERATIONAL_EVENT_TYPES: TenantEcommerceOrderOperationalEventType[] = [
  'payment_reconciliation',
  'fulfillment_availability',
  'inventory_reservation',
  'returns_refunds_cancellation',
  'post_sale_closeout',
];

export class GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase {
  constructor(
    private readonly listTenantEcommerceOrderOperationalEventsUseCase: ListTenantEcommerceOrderOperationalEventsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderOperationalReviewWorkspaceView | null> {
    const events =
      await this.listTenantEcommerceOrderOperationalEventsUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
        { limit: 50 },
      );

    if (!events) {
      return null;
    }

    const blockerSignals = this.collectBlockerSignals(events);
    const driftSignals = this.collectDriftSignals(events);
    const latestEvent = events[0] ?? null;
    const stalenessStatus = this.resolveStalenessStatus(latestEvent);
    const hasCloseout = events.some(
      (event) => event.eventType === 'post_sale_closeout',
    );
    const hasBlockedStatus = events.some((event) =>
      event.status.toLowerCase().includes('blocked'),
    );
    const reviewStatus =
      blockerSignals.length > 0 || hasBlockedStatus
        ? 'blocked'
        : driftSignals.length > 0 || !hasCloseout
          ? 'needs_operator_review'
          : 'ready_for_closeout';

    return {
      tenantSlug,
      productEntityId,
      orderDraftId,
      generatedAt: this.nowProvider(),
      reviewStatus,
      stalenessStatus,
      summary: this.buildSummary(reviewStatus, events.length, hasCloseout),
      latestEvent,
      phaseCounts: OPERATIONAL_EVENT_TYPES.map((eventType) => ({
        eventType,
        count: events.filter((event) => event.eventType === eventType).length,
      })),
      blockerSignals,
      driftSignals,
      recommendedActions: this.buildRecommendedActions(
        reviewStatus,
        latestEvent,
        hasCloseout,
        blockerSignals,
        driftSignals,
      ),
      guardrails: [
        'No ejecutar refund, reverso, fulfillment ni cierre fiscal desde este review workspace.',
        'Usar el review como lectura operativa; la acción real sigue viviendo en los packets dedicados.',
        'Si hay drift entre pago y entrega, resolverlo antes de tratar el closeout como estable.',
      ],
    };
  }

  private resolveStalenessStatus(
    latestEvent: TenantEcommerceOrderOperationalEventView | null,
  ): TenantEcommerceOrderOperationalReviewWorkspaceView['stalenessStatus'] {
    if (!latestEvent) {
      return 'stale';
    }

    const ageHours =
      (this.nowProvider().getTime() - latestEvent.occurredAt.getTime()) /
      (1000 * 60 * 60);

    if (ageHours >= 48) {
      return 'stale';
    }

    if (ageHours >= 24) {
      return 'needs_follow_up';
    }

    return 'fresh';
  }

  private collectBlockerSignals(
    events: TenantEcommerceOrderOperationalEventView[],
  ): string[] {
    return [
      ...new Set(
        events.flatMap((event) => {
          const blockedBy = event.payload.blockedBy;
          const blockers = event.payload.blockers;
          const signals: string[] = [];

          if (Array.isArray(blockedBy)) {
            signals.push(...blockedBy.filter((value) => typeof value === 'string'));
          }

          if (Array.isArray(blockers)) {
            signals.push(...blockers.filter((value) => typeof value === 'string'));
          }

          if (event.status.toLowerCase().includes('blocked')) {
            signals.push(`${event.sourceWorkspace}: ${event.status}`);
          }

          return signals;
        }),
      ),
    ];
  }

  private collectDriftSignals(
    events: TenantEcommerceOrderOperationalEventView[],
  ): string[] {
    return [
      ...new Set(
        events
          .map((event) => event.payload.driftSignal)
          .filter(
            (driftSignal): driftSignal is string =>
              typeof driftSignal === 'string' && driftSignal !== 'aligned',
          ),
      ),
    ];
  }

  private buildSummary(
    reviewStatus: TenantEcommerceOrderOperationalReviewWorkspaceView['reviewStatus'],
    eventCount: number,
    hasCloseout: boolean,
  ): string {
    if (eventCount === 0) {
      return 'Todavía no hay eventos operativos suficientes para revisar esta orden.';
    }

    if (reviewStatus === 'blocked') {
      return 'La orden tiene señales bloqueantes en su timeline operativo y requiere intervención antes de avanzar.';
    }

    if (!hasCloseout) {
      return 'La orden tiene trazabilidad operativa, pero aún falta una señal de closeout post-sale.';
    }

    if (reviewStatus === 'needs_operator_review') {
      return 'La orden tiene trazabilidad y closeout, pero todavía conserva señales de drift para revisión.';
    }

    return 'La orden tiene timeline operativo, closeout y no muestra blockers o drift activo.';
  }

  private buildRecommendedActions(
    reviewStatus: TenantEcommerceOrderOperationalReviewWorkspaceView['reviewStatus'],
    latestEvent: TenantEcommerceOrderOperationalEventView | null,
    hasCloseout: boolean,
    blockerSignals: string[],
    driftSignals: string[],
  ): string[] {
    if (blockerSignals.length > 0 || reviewStatus === 'blocked') {
      return [
        'Resolver blockers detectados antes de solicitar nuevos packets operativos.',
        latestEvent?.payload.nextStep?.toString() ??
          'Revisar el último workspace con status bloqueado.',
      ];
    }

    if (driftSignals.length > 0) {
      return [
        'Alinear cobro, entrega y lifecycle antes de cerrar la orden como estable.',
        latestEvent?.payload.nextStep?.toString() ??
          'Revisar el reporting summary y el fulfillment delivery workspace.',
      ];
    }

    if (!hasCloseout) {
      return [
        'Cargar el post-sale reporting summary para emitir el evento de closeout.',
        'Volver a revisar el timeline después de registrar el closeout.',
      ];
    }

    return [
      'Mantener la orden en monitoreo ligero y usar el timeline como evidencia de cierre.',
      latestEvent?.payload.nextStep?.toString() ??
        'Continuar con el siguiente cierre operativo de ecommerce.',
    ];
  }
}
