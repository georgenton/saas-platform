import { TenantEcommerceInvoiceDraftLaunchBridgeView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase } from './get-tenant-ecommerce-order-handoff-execution-workspace.use-case';
import { RequestTenantEcommerceInvoiceDraftOpenBridgeUseCase } from './request-tenant-ecommerce-invoice-draft-open-bridge.use-case';

export class RequestTenantEcommerceInvoiceDraftLaunchBridgeUseCase {
  constructor(
    private readonly requestTenantEcommerceInvoiceDraftOpenBridgeUseCase: RequestTenantEcommerceInvoiceDraftOpenBridgeUseCase,
    private readonly getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase: GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceInvoiceDraftLaunchBridgeView | null> {
    const [openBridge, executionWorkspace] = await Promise.all([
      this.requestTenantEcommerceInvoiceDraftOpenBridgeUseCase.execute(
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

    if (!openBridge || !executionWorkspace) {
      return null;
    }

    const blockedBy = [...openBridge.blockedBy, ...executionWorkspace.blockedBy];
    const routeConfirmed = executionWorkspace.activeRoute === 'invoicing';

    const launchStatus =
      blockedBy.length > 0
        ? 'blocked'
        : routeConfirmed && openBridge.bridgeStatus === 'ready_to_open'
          ? 'ready_to_launch'
          : 'needs_data';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: openBridge.productEntity,
      orderDraft: openBridge.orderDraft,
      launchStatus,
      summary:
        launchStatus === 'ready_to_launch'
          ? 'La orden ya tiene payload y ruta confirmada para abrir el invoice draft en Invoicing.'
          : launchStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene lanzar la apertura del invoice draft.'
            : 'La apertura del invoice draft todavía necesita más datos o una ruta más firme.',
      targetWorkspace: {
        ...openBridge.targetWorkspace,
      },
      launchPayload: {
        ...openBridge.payload,
        routeConfirmed,
      },
      fiscalArtifacts: [
        ...new Set([
          ...openBridge.fiscalSnapshot.requiredFields,
          ...openBridge.fiscalSnapshot.missingFields,
        ]),
      ],
      commercialArtifacts: [...openBridge.handoffArtifacts],
      operatorChecklist: [
        ...openBridge.operatorChecklist,
        'Confirmar que la orden no siga en hold antes de abrir el invoice draft.',
      ],
      blockedBy,
      guardrails: [
        ...new Set([
          ...openBridge.guardrails,
          ...executionWorkspace.guardrails,
          'No interpretes launch bridge como emisión final ni envío tributario automático.',
        ]),
      ],
    };
  }
}
