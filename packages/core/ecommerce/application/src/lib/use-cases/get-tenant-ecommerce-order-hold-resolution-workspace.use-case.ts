import { TenantEcommerceOrderHoldResolutionWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase } from './get-tenant-ecommerce-order-fiscal-data-completion-workspace.use-case';
import { GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase } from './get-tenant-ecommerce-order-growth-follow-up-workspace.use-case';
import { RequestTenantEcommerceOrderHandoffDecisionUseCase } from './request-tenant-ecommerce-order-handoff-decision.use-case';

export class GetTenantEcommerceOrderHoldResolutionWorkspaceUseCase {
  constructor(
    private readonly requestTenantEcommerceOrderHandoffDecisionUseCase: RequestTenantEcommerceOrderHandoffDecisionUseCase,
    private readonly getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase: GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
    private readonly getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase: GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderHoldResolutionWorkspaceView | null> {
    const [handoffDecision, fiscalWorkspace, growthWorkspace] =
      await Promise.all([
        this.requestTenantEcommerceOrderHandoffDecisionUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
      ]);

    if (!handoffDecision || !fiscalWorkspace || !growthWorkspace) {
      return null;
    }

    const blockedBy = [
      ...handoffDecision.blockedBy,
      ...fiscalWorkspace.blockedBy,
      ...growthWorkspace.blockedBy,
    ];

    const invoicingReadiness =
      blockedBy.length > 0
        ? 'blocked'
        : fiscalWorkspace.workspaceStatus === 'ready'
          ? 'ready'
          : 'needs_data';
    const growthReadiness =
      blockedBy.length > 0
        ? 'blocked'
        : growthWorkspace.workspaceStatus === 'ready_for_growth_follow_up'
          ? 'ready'
          : 'needs_data';

    const resolutionStatus =
      blockedBy.length > 0
        ? 'blocked'
        : handoffDecision.route === 'hold'
          ? 'ready_to_resolve'
          : 'needs_data';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: handoffDecision.productEntity,
      orderDraft: handoffDecision.orderDraft,
      resolutionStatus,
      currentRoute: handoffDecision.route,
      summary:
        blockedBy.length > 0
          ? 'La orden sigue detenida por bloqueos duros y necesita resolución manual.'
          : handoffDecision.route === 'hold'
            ? 'La orden está en hold, pero ya podemos decidir cómo destrabarla.'
            : 'La orden ya tiene una ruta activa; usa este workspace para validar si conviene sacarla de hold definitivamente.',
      owner: {
        ...handoffDecision.owner,
      },
      blockerSummary: {
        hardBlockers: [...new Set(blockedBy)],
        softBlockers: [...new Set(fiscalWorkspace.missingFields)],
      },
      suggestedExitRoutes: [
        {
          route: 'invoicing',
          readiness: invoicingReadiness,
          rationale:
            invoicingReadiness === 'ready'
              ? 'Ya existe suficiente data fiscal para abrir el frente de Invoicing.'
              : 'Todavía faltan campos fiscales antes de sacar la orden por Invoicing.',
        },
        {
          route: 'growth_follow_up',
          readiness: growthReadiness,
          rationale:
            growthReadiness === 'ready'
              ? 'El follow-up comercial ya tiene el contexto suficiente para retomar la conversación.'
              : 'Conviene completar buyer intent o siguiente paso antes de empujar la orden a Growth.',
        },
      ],
      resolutionChecklist: [
        'Decidir si la orden se destraba por vía fiscal o por seguimiento comercial.',
        'Evitar dejar la orden sin owner explícito mientras permanece en hold.',
        'Mantener trazabilidad entre buyer context, missing fields y siguiente acción.',
      ],
      nextStep:
        invoicingReadiness === 'ready'
          ? 'Mover la orden hacia Invoicing como siguiente salida controlada.'
          : growthReadiness === 'ready'
            ? 'Retomar el hilo comercial y confirmar buyer intent antes de facturación.'
            : 'Completar datos fiscales o comerciales antes de redefinir la ruta.',
      blockedBy,
      guardrails: [
        ...new Set([
          ...handoffDecision.guardrails,
          ...fiscalWorkspace.guardrails,
          ...growthWorkspace.guardrails,
          'No uses hold como estado silencioso; toda orden en hold debe tener owner y siguiente acción.',
        ]),
      ],
    };
  }
}
