import { TenantEcommerceCatalogStorefrontPlacementPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceCatalogListingAssetUseCase } from './get-tenant-ecommerce-catalog-listing-asset.use-case';
import { GetTenantEcommerceStorefrontPreviewWorkspaceUseCase } from './get-tenant-ecommerce-storefront-preview-workspace.use-case';
import { RequestTenantEcommerceChannelReleaseApprovalPacketUseCase } from './request-tenant-ecommerce-channel-release-approval-packet.use-case';

export class RequestTenantEcommerceCatalogStorefrontPlacementPacketUseCase {
  constructor(
    private readonly getTenantEcommerceCatalogListingAssetUseCase: GetTenantEcommerceCatalogListingAssetUseCase,
    private readonly getTenantEcommerceStorefrontPreviewWorkspaceUseCase: GetTenantEcommerceStorefrontPreviewWorkspaceUseCase,
    private readonly requestTenantEcommerceChannelReleaseApprovalPacketUseCase: RequestTenantEcommerceChannelReleaseApprovalPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceCatalogStorefrontPlacementPacketView | null> {
    const [listingAsset, storefrontPreview, approvalPacket] = await Promise.all([
      this.getTenantEcommerceCatalogListingAssetUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.getTenantEcommerceStorefrontPreviewWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceChannelReleaseApprovalPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!listingAsset || !storefrontPreview || !approvalPacket) {
      return null;
    }

    const catalogApproval =
      approvalPacket.channels.find((channel) => channel.channelKey === 'catalog') ??
      approvalPacket.channels[0] ??
      null;

    const blockers = [
      ...listingAsset.blockers,
      ...approvalPacket.blockers,
      ...(storefrontPreview.previewStatus === 'blocked'
        ? ['El storefront preview todavía está bloqueado.']
        : []),
    ];

    const placementStatus =
      blockers.length > 0
        ? 'blocked'
        : listingAsset.listingStatus === 'ready_for_storefront_listing' &&
            storefrontPreview.previewStatus === 'ready_for_preview_review' &&
            catalogApproval?.approvalDecision === 'approve'
          ? 'ready_for_storefront_placement'
          : 'needs_operator_revision';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: listingAsset.productEntity,
      assetEntity: listingAsset.assetEntity,
      placementStatus,
      card: { ...listingAsset.card },
      placementSummary:
        placementStatus === 'ready_for_storefront_placement'
          ? 'La ficha de catálogo ya tiene suficiente forma para placement controlado en storefront.'
          : placementStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene empujar esta ficha como placement casi final.'
            : 'La ficha ya se puede preparar para placement, pero todavía conviene una revisión operativa más.',
      storefrontContext: {
        previewStatus: storefrontPreview.previewStatus,
        approvalStatus: approvalPacket.approvalStatus,
      },
      placementNotes: [
        ...listingAsset.placementNotes.slice(0, 2),
        ...storefrontPreview.previewChecklist.slice(0, 2),
        ...(catalogApproval ? [catalogApproval.rationale] : []),
      ],
      placementChecklist: [
        ...approvalPacket.requiredApprovals.slice(0, 2),
        ...listingAsset.finalChecklist.slice(0, 2),
        'Confirmar que título, pricing y CTA se leen bien dentro del storefront integrado',
      ],
      blockers,
      guardrails: [
        ...listingAsset.guardrails.slice(0, 2),
        ...storefrontPreview.guardrails.slice(0, 1),
        ...approvalPacket.guardrails.slice(0, 1),
        'No tratar este placement packet como catálogo vivo ni storefront publicado todavía.',
      ],
    };
  }
}
