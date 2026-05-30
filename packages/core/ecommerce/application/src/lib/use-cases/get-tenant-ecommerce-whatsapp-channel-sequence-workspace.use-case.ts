import { TenantEcommerceWhatsappChannelSequenceWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-channel-asset-entity-detail.use-case';

export class GetTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase: GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceWhatsappChannelSequenceWorkspaceView | null> {
    const detail =
      await this.getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        'whatsapp',
      );

    if (!detail) {
      return null;
    }

    const { assetEntity } = detail;
    const opener = assetEntity.headline;
    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: detail.productEntity,
      assetEntity,
      workspaceStatus:
        assetEntity.status === 'draft_asset_entity'
          ? 'ready_for_sequence_assembly'
          : assetEntity.status === 'needs_publish_copy'
            ? 'needs_publish_copy'
            : 'blocked',
      opener,
      followUpSequence: [
        opener,
        ...assetEntity.draftBlueprint.slice(0, 2).map(
          (step, index) => `Follow-up ${index + 1}: ${step}`,
        ),
      ],
      recoveryBranch: assetEntity.recommendedArtifacts
        .slice(0, 2)
        .map((artifact) => `Recovery: ${artifact}`),
      closeCta:
        detail.productEntity.primaryCta ?? 'Confirmar interés y pasar a cierre',
      operatorNotes: [...assetEntity.publishChecklist],
      nextMilestone: assetEntity.nextMilestone,
      blockedBy: [...assetEntity.blockedBy],
      guardrails: [
        ...assetEntity.guardrails,
        'No tratar esta secuencia como automatización viva de WhatsApp todavía.',
      ],
    };
  }
}
