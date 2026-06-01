import { TenantEcommerceStorefrontGoLiveManifestView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase } from './get-tenant-ecommerce-checkout-order-intake-workspace.use-case';
import { GetTenantEcommerceStorefrontReleaseControlWorkspaceUseCase } from './get-tenant-ecommerce-storefront-release-control-workspace.use-case';
import { RequestTenantEcommerceCatalogMerchandisingPacketUseCase } from './request-tenant-ecommerce-catalog-merchandising-packet.use-case';
import { RequestTenantEcommerceOrderInvoicingBridgeUseCase } from './request-tenant-ecommerce-order-invoicing-bridge.use-case';
import { RequestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase } from './request-tenant-ecommerce-whatsapp-growth-launch-acknowledgement-packet.use-case';

export class GetTenantEcommerceStorefrontGoLiveManifestUseCase {
  constructor(
    private readonly getTenantEcommerceStorefrontReleaseControlWorkspaceUseCase: GetTenantEcommerceStorefrontReleaseControlWorkspaceUseCase,
    private readonly requestTenantEcommerceCatalogMerchandisingPacketUseCase: RequestTenantEcommerceCatalogMerchandisingPacketUseCase,
    private readonly requestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase: RequestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase,
    private readonly getTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase: GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
    private readonly requestTenantEcommerceOrderInvoicingBridgeUseCase: RequestTenantEcommerceOrderInvoicingBridgeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceStorefrontGoLiveManifestView | null> {
    const [
      releaseControl,
      merchandisingPacket,
      whatsappAcknowledgement,
      checkoutWorkspace,
      invoicingBridge,
    ] = await Promise.all([
      this.getTenantEcommerceStorefrontReleaseControlWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceCatalogMerchandisingPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.getTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceOrderInvoicingBridgeUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (
      !releaseControl ||
      !merchandisingPacket ||
      !whatsappAcknowledgement ||
      !checkoutWorkspace ||
      !invoicingBridge
    ) {
      return null;
    }

    const dependencies = [
      {
        key: 'storefront_release_control' as const,
        title: 'Storefront release control',
        status:
          releaseControl.controlStatus === 'ready_for_release_control'
            ? 'ready'
            : releaseControl.controlStatus === 'blocked'
              ? 'blocked'
              : 'warning',
        detail: releaseControl.summary.detail,
      },
      {
        key: 'catalog_merchandising' as const,
        title: 'Catalog merchandising',
        status:
          merchandisingPacket.merchandisingStatus ===
          'ready_for_merchandising_review'
            ? 'ready'
            : merchandisingPacket.merchandisingStatus === 'blocked'
              ? 'blocked'
              : 'warning',
        detail: merchandisingPacket.merchandisingSummary,
      },
      {
        key: 'whatsapp_growth_acknowledgement' as const,
        title: 'WhatsApp growth acknowledgement',
        status:
          whatsappAcknowledgement.acknowledgementStatus ===
          'ready_for_growth_launch_acknowledgement'
            ? 'ready'
            : whatsappAcknowledgement.acknowledgementStatus === 'blocked'
              ? 'blocked'
              : 'warning',
        detail: whatsappAcknowledgement.summary,
      },
      {
        key: 'checkout_order_intake' as const,
        title: 'Checkout order intake',
        status:
          checkoutWorkspace.checkoutStatus === 'ready_for_order_intake'
            ? 'ready'
            : checkoutWorkspace.checkoutStatus === 'blocked'
              ? 'blocked'
              : 'warning',
        detail: checkoutWorkspace.summary,
      },
      {
        key: 'order_invoicing_bridge' as const,
        title: 'Order invoicing bridge',
        status:
          invoicingBridge.bridgeStatus === 'ready_for_invoice_handoff'
            ? 'ready'
            : invoicingBridge.bridgeStatus === 'blocked'
              ? 'blocked'
              : 'warning',
        detail: invoicingBridge.summary,
      },
    ] satisfies TenantEcommerceStorefrontGoLiveManifestView['goLiveDependencies'];

    const blockers = [
      ...releaseControl.blockers,
      ...merchandisingPacket.blockers,
      ...whatsappAcknowledgement.blockers,
      ...checkoutWorkspace.blockedBy,
      ...invoicingBridge.blockedBy,
    ];

    const warnings = dependencies
      .filter((entry) => entry.status === 'warning')
      .map((entry) => `${entry.title}: ${entry.detail}`);

    const manifestStatus =
      blockers.length > 0
        ? 'blocked'
        : checkoutWorkspace.checkoutStatus === 'ready_for_order_intake' &&
            invoicingBridge.bridgeStatus === 'ready_for_invoice_handoff' &&
            releaseControl.controlStatus === 'ready_for_release_control' &&
            merchandisingPacket.merchandisingStatus ===
              'ready_for_merchandising_review' &&
            whatsappAcknowledgement.acknowledgementStatus ===
              'ready_for_growth_launch_acknowledgement'
          ? 'ready_for_controlled_go_live'
          : 'needs_checkout_foundation';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: releaseControl.productEntity,
      manifestStatus,
      summary:
        manifestStatus === 'ready_for_controlled_go_live'
          ? {
              headline:
                'El storefront ya tiene un manifiesto razonable para salida controlada.',
              detail:
                'Release control, catálogo, WhatsApp, intake de orden y bridge fiscal ya convergen en una sola lectura de go-live.',
            }
          : manifestStatus === 'blocked'
            ? {
                headline:
                  'Todavía hay bloqueos y no conviene tratar este storefront como go-live controlado.',
                detail:
                  'Conviene resolver blockers de canales, checkout o handoff fiscal antes de abrir una salida real.',
              }
            : {
                headline:
                  'El go-live ya tiene forma, aunque todavía conviene cerrar el intake y el puente fiscal.',
                detail:
                  'La salida ya está bien orquestada, pero todavía no conviene tratarla como storefront listo para vender sin revisar cierre comercial.',
              },
      channelSnapshot: {
        landingStatus: releaseControl.controlStatus,
        catalogStatus: merchandisingPacket.merchandisingStatus,
        whatsappStatus: whatsappAcknowledgement.acknowledgementStatus,
      },
      orderReadiness: {
        checkoutStatus: checkoutWorkspace.checkoutStatus,
        invoicingStatus: invoicingBridge.bridgeStatus,
      },
      goLiveDependencies: dependencies,
      finalChecklist: [
        ...releaseControl.controlChecklist.slice(0, 2),
        ...merchandisingPacket.merchandisingChecklist.slice(0, 1),
        ...checkoutWorkspace.orderChecklist.slice(0, 1),
        ...invoicingBridge.fiscalRequirements.slice(0, 1),
      ],
      operatorHandoff: {
        owner:
          whatsappAcknowledgement.targetWorkspace.productKey === 'growth'
            ? 'shared'
            : 'ecommerce',
        goLiveMode: 'controlled_go_live',
        nextWindow:
          manifestStatus === 'ready_for_controlled_go_live'
            ? 'Abrir release window corta con revisión final de storefront y cierre comercial.'
            : 'Resolver dependencies marcadas antes de agendar una ventana de salida.',
      },
      warnings,
      blockers,
      guardrails: [
        ...releaseControl.guardrails.slice(0, 2),
        ...checkoutWorkspace.guardrails.slice(0, 1),
        ...invoicingBridge.guardrails.slice(0, 1),
        'No convertir este manifest en go-live automático ni storefront vivo todavía.',
      ],
    };
  }
}
