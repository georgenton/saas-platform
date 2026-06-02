import { TenantEcommerceOrderRouteResolutionPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase } from './get-tenant-ecommerce-order-handoff-execution-workspace.use-case';
import { GetTenantEcommerceOrderHoldResolutionWorkspaceUseCase } from './get-tenant-ecommerce-order-hold-resolution-workspace.use-case';

export class RequestTenantEcommerceOrderRouteResolutionPacketUseCase {
  constructor(
    private readonly getTenantEcommerceOrderHoldResolutionWorkspaceUseCase: GetTenantEcommerceOrderHoldResolutionWorkspaceUseCase,
    private readonly getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase: GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderRouteResolutionPacketView | null> {
    const [holdResolutionWorkspace, handoffExecutionWorkspace] =
      await Promise.all([
        this.getTenantEcommerceOrderHoldResolutionWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
        this.getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
          orderDraftId,
        ),
      ]);

    if (!holdResolutionWorkspace || !handoffExecutionWorkspace) {
      return null;
    }

    const invoicingSignal = holdResolutionWorkspace.suggestedExitRoutes.find(
      (entry) => entry.route === 'invoicing',
    );
    const growthSignal = holdResolutionWorkspace.suggestedExitRoutes.find(
      (entry) => entry.route === 'growth_follow_up',
    );

    const recommendedRoute =
      handoffExecutionWorkspace.executionStatus === 'blocked'
        ? 'hold'
        : invoicingSignal?.readiness === 'ready'
          ? 'invoicing'
          : growthSignal?.readiness === 'ready'
            ? 'growth_follow_up'
            : handoffExecutionWorkspace.activeRoute;

    const resolutionStatus =
      handoffExecutionWorkspace.executionStatus === 'blocked'
        ? 'blocked'
        : recommendedRoute === 'hold'
          ? 'needs_data'
          : 'ready_to_reroute';

    const holdRisk =
      handoffExecutionWorkspace.activeRoute === 'hold' &&
      resolutionStatus !== 'ready_to_reroute'
        ? 'high'
        : handoffExecutionWorkspace.activeRoute === 'hold'
          ? 'medium'
          : 'low';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: handoffExecutionWorkspace.productEntity,
      orderDraft: handoffExecutionWorkspace.orderDraft,
      resolutionStatus,
      currentRoute: handoffExecutionWorkspace.activeRoute,
      recommendedRoute,
      summary:
        resolutionStatus === 'ready_to_reroute'
          ? 'La orden ya tiene suficiente contexto para confirmar una ruta operativa más firme.'
          : resolutionStatus === 'blocked'
            ? 'La orden sigue con bloqueos y todavía no conviene fijar una nueva ruta.'
            : 'La orden necesita más data antes de salir de hold o confirmar una ruta diferente.',
      rationale:
        recommendedRoute === 'invoicing'
          ? 'La data fiscal y el snapshot comercial ya alcanzan para empujar la orden hacia Invoicing.'
          : recommendedRoute === 'growth_follow_up'
            ? 'Conviene retomar la conversación comercial antes de abrir un frente fiscal.'
            : 'Mantener la orden en hold sigue siendo más seguro hasta completar datos o despejar bloqueos.',
      routeSignals: {
        invoicingReadiness: invoicingSignal?.readiness ?? 'blocked',
        growthReadiness: growthSignal?.readiness ?? 'blocked',
        holdRisk,
      },
      routeChecklist: [
        'Confirmar que la ruta elegida tenga owner operativo visible.',
        'Evitar cambiar de ruta sin dejar trazabilidad entre buyer context, fiscal snapshot y siguiente acción.',
        'Usar hold solo como estado transitorio mientras exista un plan de salida concreto.',
      ],
      nextStep:
        recommendedRoute === 'invoicing'
          ? 'Abrir el invoice draft handoff workspace y validar el paquete final hacia Invoicing.'
          : recommendedRoute === 'growth_follow_up'
            ? 'Retomar el follow-up comercial con CTA y objeciones alineadas al order draft.'
            : 'Completar datos fiscales o comerciales antes de decidir la salida definitiva.',
      blockedBy: [
        ...new Set([
          ...holdResolutionWorkspace.blockedBy,
          ...handoffExecutionWorkspace.blockedBy,
        ]),
      ],
      guardrails: [
        ...new Set([
          ...holdResolutionWorkspace.guardrails,
          ...handoffExecutionWorkspace.guardrails,
          'No cambies la ruta solo por presión operativa; confirma primero si la orden realmente está lista para esa salida.',
        ]),
      ],
    };
  }
}
