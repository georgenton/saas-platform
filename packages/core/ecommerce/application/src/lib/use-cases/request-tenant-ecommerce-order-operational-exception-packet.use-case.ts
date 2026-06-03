import {
  TenantEcommerceOrderOperationalExceptionPacketView,
  TenantEcommerceOrderOperationalReviewWorkspaceView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase } from './get-tenant-ecommerce-order-operational-review-workspace.use-case';

export class RequestTenantEcommerceOrderOperationalExceptionPacketUseCase {
  constructor(
    private readonly getTenantEcommerceOrderOperationalReviewWorkspaceUseCase: GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderOperationalExceptionPacketView | null> {
    const review =
      await this.getTenantEcommerceOrderOperationalReviewWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      );

    if (!review) {
      return null;
    }

    const exceptionType = this.resolveExceptionType(review);
    const severity = this.resolveSeverity(review);

    return {
      tenantSlug,
      productEntityId,
      orderDraftId,
      generatedAt: this.nowProvider(),
      exceptionType,
      severity,
      ownerRole: 'operator',
      summary: this.buildSummary(exceptionType, severity),
      evidenceChecklist: this.buildEvidenceChecklist(review),
      resolutionSteps: this.buildResolutionSteps(review, exceptionType),
      guardrails: [
        ...review.guardrails,
        'Este packet prepara resolución; no ejecuta reversos, refunds, entrega ni cierre fiscal automáticamente.',
        'Registrar evidencia antes de mover la orden fuera de estado bloqueado o con drift.',
      ],
    };
  }

  private resolveExceptionType(
    review: TenantEcommerceOrderOperationalReviewWorkspaceView,
  ): TenantEcommerceOrderOperationalExceptionPacketView['exceptionType'] {
    if (review.blockerSignals.length > 0 || review.reviewStatus === 'blocked') {
      return 'blocker_resolution';
    }

    if (review.driftSignals.length > 0) {
      return 'drift_resolution';
    }

    if (review.stalenessStatus !== 'fresh') {
      return 'stale_follow_up';
    }

    return 'closeout_missing';
  }

  private resolveSeverity(
    review: TenantEcommerceOrderOperationalReviewWorkspaceView,
  ): TenantEcommerceOrderOperationalExceptionPacketView['severity'] {
    if (review.reviewStatus === 'blocked' || review.blockerSignals.length > 0) {
      return 'high';
    }

    if (
      review.driftSignals.length > 0 ||
      review.stalenessStatus === 'stale'
    ) {
      return 'medium';
    }

    return 'low';
  }

  private buildSummary(
    exceptionType: TenantEcommerceOrderOperationalExceptionPacketView['exceptionType'],
    severity: TenantEcommerceOrderOperationalExceptionPacketView['severity'],
  ): string {
    return `Operational exception packet ${exceptionType} preparado con severidad ${severity}.`;
  }

  private buildEvidenceChecklist(
    review: TenantEcommerceOrderOperationalReviewWorkspaceView,
  ): string[] {
    return [
      'Capturar latest event, source workspace y status antes de resolver.',
      ...review.blockerSignals.map((signal) => `Evidencia blocker: ${signal}`),
      ...review.driftSignals.map((signal) => `Evidencia drift: ${signal}`),
      review.latestEvent
        ? `Validar evento ${review.latestEvent.eventType} en ${review.latestEvent.sourceWorkspace}.`
        : 'Registrar al menos un evento operativo antes de cerrar la excepción.',
    ];
  }

  private buildResolutionSteps(
    review: TenantEcommerceOrderOperationalReviewWorkspaceView,
    exceptionType: TenantEcommerceOrderOperationalExceptionPacketView['exceptionType'],
  ): string[] {
    if (exceptionType === 'stale_follow_up') {
      return [
        'Recargar el workspace operativo más reciente para refrescar el timeline.',
        ...review.recommendedActions,
      ];
    }

    if (exceptionType === 'closeout_missing') {
      return [
        'Cargar post-sale reporting summary para emitir closeout.',
        ...review.recommendedActions,
      ];
    }

    return review.recommendedActions;
  }
}
