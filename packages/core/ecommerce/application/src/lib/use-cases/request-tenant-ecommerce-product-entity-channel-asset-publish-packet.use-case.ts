import { TenantEcommerceProductEntityChannelAssetPublishPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase } from './get-tenant-ecommerce-product-entity-channel-asset-workspace-detail.use-case';

export class RequestTenantEcommerceProductEntityChannelAssetPublishPacketUseCase {
  constructor(
    private readonly getTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase: GetTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ): Promise<TenantEcommerceProductEntityChannelAssetPublishPacketView | null> {
    const detail =
      await this.getTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        channelKey,
      );

    if (!detail) {
      return null;
    }

    const { workspace } = detail;
    return {
      tenantSlug: detail.tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: detail.productEntity,
      channelKey: workspace.channelKey,
      publishStatus:
        workspace.status === 'ready_for_asset_edit'
          ? 'ready_for_staging'
          : workspace.status,
      handoffOwner: workspace.handoffOwner,
      summary:
        workspace.status === 'ready_for_asset_edit'
          ? `El asset workspace de ${workspace.channelKey} ya puede entrar a staging controlado antes de tratarlo como artifact casi publicable.`
          : workspace.status === 'needs_core_copy'
            ? `Todavia conviene cerrar copy y checklist base antes de tratar el asset workspace de ${workspace.channelKey} como staging publicable.`
            : `El asset workspace de ${workspace.channelKey} sigue bloqueado y no debería pasar a staging todavía.`,
      requiredChecks: [...workspace.editableSnapshot.publishChecklist],
      recommendedArtifacts: [...workspace.editableSnapshot.recommendedArtifacts],
      nextMilestone: workspace.editableSnapshot.nextMilestone,
      blockedBy: [...detail.blockedBy],
      guardrails: [
        ...workspace.guardrails,
        'No tratar este packet como publicación real ni como asset vivo todavía.',
      ],
    };
  }
}
