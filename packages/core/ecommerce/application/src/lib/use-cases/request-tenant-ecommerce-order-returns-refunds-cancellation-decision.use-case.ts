import { TenantEcommerceOrderReturnsRefundsCancellationDecisionView } from '@saas-platform/ecommerce-domain';
import { RecordTenantEcommerceOrderOperationalEventUseCase } from './record-tenant-ecommerce-order-operational-event.use-case';
import { GetTenantEcommerceOrderReturnsRefundsCancellationWorkspaceUseCase } from './get-tenant-ecommerce-order-returns-refunds-cancellation-workspace.use-case';

export type RequestTenantEcommerceOrderReturnsRefundsCancellationDecisionCommand = {
  decision?: TenantEcommerceOrderReturnsRefundsCancellationDecisionView['decision'];
  summary?: string;
  requiredEvidence?: string[];
  nextStep?: string;
};

export class RequestTenantEcommerceOrderReturnsRefundsCancellationDecisionUseCase {
  constructor(
    private readonly getTenantEcommerceOrderReturnsRefundsCancellationWorkspaceUseCase: GetTenantEcommerceOrderReturnsRefundsCancellationWorkspaceUseCase,
    private readonly recordTenantEcommerceOrderOperationalEventUseCase: RecordTenantEcommerceOrderOperationalEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
    command: RequestTenantEcommerceOrderReturnsRefundsCancellationDecisionCommand = {},
  ): Promise<TenantEcommerceOrderReturnsRefundsCancellationDecisionView | null> {
    const workspace =
      await this.getTenantEcommerceOrderReturnsRefundsCancellationWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      );

    if (!workspace) {
      return null;
    }

    const decision = command.decision ?? this.recommendDecision(workspace);
    const decisionStatus =
      workspace.blockedBy.length > 0 || workspace.resolutionStatus === 'blocked'
        ? 'blocked'
        : decision === 'escalate' ||
            workspace.resolutionStatus === 'eligible_for_refund_review' ||
            workspace.resolutionStatus === 'return_review'
          ? 'needs_review'
          : 'accepted';
    const summary =
      command.summary?.trim() ||
      this.buildSummary(decision, decisionStatus, workspace.summary);
    const requiredEvidence =
      command.requiredEvidence && command.requiredEvidence.length > 0
        ? command.requiredEvidence
        : this.buildRequiredEvidence(decision, workspace.guardrailChecklist);
    const nextStep =
      command.nextStep?.trim() || this.buildNextStep(decision, decisionStatus);
    const event =
      await this.recordTenantEcommerceOrderOperationalEventUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
        {
          eventType: 'returns_refunds_cancellation',
          sourceWorkspace: 'returns-refunds-cancellation-decision',
          status: decisionStatus,
          summary,
          payload: {
            decision,
            lifecycleSignals: workspace.lifecycleSignals,
            requiredEvidence,
            blockedBy: workspace.blockedBy,
            nextStep,
          },
        },
      );

    if (!event) {
      return null;
    }

    return {
      tenantSlug,
      productEntityId,
      orderDraftId,
      generatedAt: this.nowProvider(),
      decision,
      decisionStatus,
      summary,
      lifecycleSignals: workspace.lifecycleSignals,
      requiredEvidence,
      event,
      nextStep,
      guardrails: [
        ...workspace.guardrails,
        'Esta decisión sólo registra el cierre operativo; no ejecuta reversos, notas de credito ni refunds reales.',
      ],
    };
  }

  private recommendDecision(
    workspace: Awaited<
      ReturnType<
        GetTenantEcommerceOrderReturnsRefundsCancellationWorkspaceUseCase['execute']
      >
    >,
  ): TenantEcommerceOrderReturnsRefundsCancellationDecisionView['decision'] {
    if (!workspace || workspace.resolutionStatus === 'blocked') {
      return 'escalate';
    }

    if (workspace.resolutionStatus === 'eligible_for_cancellation') {
      return 'cancel_order';
    }

    if (workspace.resolutionStatus === 'eligible_for_refund_review') {
      return 'refund_review';
    }

    return 'return_review';
  }

  private buildSummary(
    decision: TenantEcommerceOrderReturnsRefundsCancellationDecisionView['decision'],
    decisionStatus: TenantEcommerceOrderReturnsRefundsCancellationDecisionView['decisionStatus'],
    workspaceSummary: string,
  ): string {
    return `Decision ${decision} registrada con estado ${decisionStatus}. ${workspaceSummary}`;
  }

  private buildRequiredEvidence(
    decision: TenantEcommerceOrderReturnsRefundsCancellationDecisionView['decision'],
    guardrailChecklist: string[],
  ): string[] {
    const baseEvidence =
      decision === 'cancel_order'
        ? ['Confirmar que no existe entrega cerrada.', 'Adjuntar motivo de cancelación.']
        : decision === 'refund_review'
          ? ['Adjuntar evidencia de pago.', 'Adjuntar motivo de refund review.']
          : decision === 'return_review'
            ? ['Adjuntar evidencia de entrega.', 'Adjuntar motivo de return/reversal review.']
            : ['Adjuntar señales que justifican escalación.'];

    return [...baseEvidence, ...guardrailChecklist];
  }

  private buildNextStep(
    decision: TenantEcommerceOrderReturnsRefundsCancellationDecisionView['decision'],
    decisionStatus: TenantEcommerceOrderReturnsRefundsCancellationDecisionView['decisionStatus'],
  ): string {
    if (decisionStatus === 'blocked') {
      return 'Resolver bloqueos antes de ejecutar cualquier reverso, refund o cancelación externa.';
    }

    return decision === 'cancel_order'
      ? 'Cerrar la cancelación en el sistema operativo externo y registrar evidencia.'
      : decision === 'refund_review'
        ? 'Enviar el caso a revisión de refund con evidencia de pago y disputa.'
        : decision === 'return_review'
          ? 'Abrir revisión de return/reversal con evidencia de entrega.'
          : 'Asignar owner operativo y mantener seguimiento en la mesa de escalación.';
  }
}
