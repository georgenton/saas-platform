import { TenantEcommerceInvoiceDraftHandoffWorkspaceView } from '@saas-platform/ecommerce-domain';
import { RequestTenantEcommerceInvoiceDraftLaunchBridgeUseCase } from './request-tenant-ecommerce-invoice-draft-launch-bridge.use-case';
import { RequestTenantEcommerceOrderRouteResolutionPacketUseCase } from './request-tenant-ecommerce-order-route-resolution-packet.use-case';

export class GetTenantEcommerceInvoiceDraftHandoffWorkspaceUseCase {
  constructor(
    private readonly requestTenantEcommerceInvoiceDraftLaunchBridgeUseCase: RequestTenantEcommerceInvoiceDraftLaunchBridgeUseCase,
    private readonly requestTenantEcommerceOrderRouteResolutionPacketUseCase: RequestTenantEcommerceOrderRouteResolutionPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceInvoiceDraftHandoffWorkspaceView | null> {
    const [launchBridge, routeResolutionPacket] = await Promise.all([
      this.requestTenantEcommerceInvoiceDraftLaunchBridgeUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
      this.requestTenantEcommerceOrderRouteResolutionPacketUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
    ]);

    if (!launchBridge || !routeResolutionPacket) {
      return null;
    }

    const routeConfirmed = routeResolutionPacket.recommendedRoute === 'invoicing';
    const workspaceStatus =
      launchBridge.launchStatus === 'blocked' ||
      routeResolutionPacket.resolutionStatus === 'blocked'
        ? 'blocked'
        : launchBridge.launchStatus === 'ready_to_launch' && routeConfirmed
          ? 'ready_for_invoice_handoff'
          : 'needs_data';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: launchBridge.productEntity,
      orderDraft: launchBridge.orderDraft,
      workspaceStatus,
      summary:
        workspaceStatus === 'ready_for_invoice_handoff'
          ? 'El paquete final hacia Invoicing ya está listo para un handoff asistido y trazable.'
          : workspaceStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene entregar esta orden al frente de Invoicing.'
            : 'El handoff fiscal aún necesita más claridad de ruta o completar datos antes de salir.',
      targetWorkspace: {
        ...launchBridge.targetWorkspace,
      },
      routeSnapshot: {
        currentRoute: routeResolutionPacket.currentRoute,
        recommendedRoute: routeResolutionPacket.recommendedRoute,
        routeConfirmed,
      },
      handoffPayload: {
        customerLabel: launchBridge.launchPayload.customerLabel,
        documentHint: launchBridge.launchPayload.documentHint,
        offerTitle: launchBridge.launchPayload.offerTitle,
        pricingSnapshot: launchBridge.launchPayload.pricingSnapshot,
        billingIntent: launchBridge.launchPayload.billingIntent,
      },
      handoffArtifacts: [
        ...new Set([
          ...launchBridge.fiscalArtifacts,
          ...launchBridge.commercialArtifacts,
        ]),
      ],
      operatorChecklist: [
        ...launchBridge.operatorChecklist,
        'Verificar que la ruta recomendada siga siendo invoicing antes de abrir el draft en el otro producto.',
      ],
      nextStep:
        workspaceStatus === 'ready_for_invoice_handoff'
          ? 'Abrir el invoice draft en Invoicing y adjuntar el snapshot comercial de la orden.'
          : routeConfirmed
            ? 'Completar datos faltantes del launch bridge antes de intentar el handoff.'
            : 'Resolver la ruta de la orden y confirmar que realmente debe salir por Invoicing.',
      blockedBy: [
        ...new Set([
          ...launchBridge.blockedBy,
          ...routeResolutionPacket.blockedBy,
        ]),
      ],
      guardrails: [
        ...new Set([
          ...launchBridge.guardrails,
          ...routeResolutionPacket.guardrails,
          'Este workspace prepara el handoff; no sustituye la revisión final dentro de Invoicing.',
        ]),
      ],
    };
  }
}
