import { TenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-channel-asset-entity-detail.use-case';

export class RequestTenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketUseCase {
  constructor(
    private readonly getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase: GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ): Promise<TenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketView | null> {
    const detail =
      await this.getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        channelKey,
      );

    if (!detail) {
      return null;
    }

    const { assetEntity } = detail;
    return {
      tenantSlug: detail.tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: detail.productEntity,
      channelKey: assetEntity.channelKey,
      preparationStatus:
        assetEntity.status === 'draft_asset_entity'
          ? 'ready_for_release_candidate'
          : assetEntity.status === 'needs_publish_copy'
            ? 'needs_publish_copy'
            : 'blocked',
      handoffOwner: assetEntity.handoffOwner,
      summary:
        assetEntity.status === 'draft_asset_entity'
          ? `La entity de asset de ${assetEntity.channelKey} ya puede pasar a release candidate controlado.`
          : assetEntity.status === 'needs_publish_copy'
            ? `Todavia conviene cerrar publish copy antes de promover la entity de asset de ${assetEntity.channelKey}.`
            : `La entity de asset de ${assetEntity.channelKey} sigue bloqueada y no debería pasar a release candidate todavía.`,
      requiredChecks: [...assetEntity.publishChecklist],
      recommendedArtifacts: [...assetEntity.recommendedArtifacts],
      nextMilestone: assetEntity.nextMilestone,
      blockedBy: [...assetEntity.blockedBy],
      guardrails: [
        ...assetEntity.guardrails,
        'No tratar este packet como publicación viva ni activación automática todavía.',
      ],
    };
  }
}
