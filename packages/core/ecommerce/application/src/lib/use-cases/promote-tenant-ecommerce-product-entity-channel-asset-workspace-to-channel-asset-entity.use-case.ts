import { TenantEcommerceProductEntityChannelAssetEntityView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityChannelDraftRepository } from '../ports/ecommerce-product-entity-channel-draft.repository';

export class PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase {
  constructor(
    private readonly ecommerceProductEntityChannelDraftRepository: EcommerceProductEntityChannelDraftRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ): Promise<TenantEcommerceProductEntityChannelAssetEntityView | null> {
    const promotedAt = this.nowProvider();
    const savedChannelDraft =
      await this.ecommerceProductEntityChannelDraftRepository.markPromotedToAssetEntity(
        tenantSlug,
        productEntityId,
        channelKey,
        promotedAt,
      );

    if (!savedChannelDraft) {
      return null;
    }

    return this.toAssetEntity(savedChannelDraft, promotedAt);
  }

  toAssetEntity(
    savedChannelDraft: {
      id: string;
      tenantSlug: string;
      productEntityId: string;
      channelKey: 'landing' | 'catalog' | 'whatsapp';
      preparationStatus: 'ready_to_stage' | 'needs_core_copy' | 'blocked';
      handoffOwner: 'ecommerce' | 'growth' | 'shared';
      title: string;
      headline: string;
      draftBlueprint: string[];
      publishChecklist: string[];
      recommendedArtifacts: string[];
      nextMilestone: string;
      blockedBy: string[];
      guardrails: string[];
    },
    promotedAt: Date,
  ): TenantEcommerceProductEntityChannelAssetEntityView {
    return {
      tenantSlug: savedChannelDraft.tenantSlug,
      generatedAt: promotedAt,
      assetEntityId: savedChannelDraft.id,
      productEntityId: savedChannelDraft.productEntityId,
      sourceSavedChannelDraftId: savedChannelDraft.id,
      channelKey: savedChannelDraft.channelKey,
      promotedAt,
      status:
        savedChannelDraft.preparationStatus === 'ready_to_stage'
          ? 'draft_asset_entity'
          : savedChannelDraft.preparationStatus === 'needs_core_copy'
            ? 'needs_publish_copy'
            : 'blocked',
      handoffOwner: savedChannelDraft.handoffOwner,
      title: savedChannelDraft.title,
      headline: savedChannelDraft.headline,
      summary:
        savedChannelDraft.preparationStatus === 'ready_to_stage'
          ? `La entity de asset de ${savedChannelDraft.channelKey} ya puede operar como artifact persistido previo a publicación controlada.`
          : savedChannelDraft.preparationStatus === 'needs_core_copy'
            ? `La entity de asset de ${savedChannelDraft.channelKey} ya existe, pero todavía necesita copy base antes de tratarla como artifact operable.`
            : `La entity de asset de ${savedChannelDraft.channelKey} sigue bloqueada y no debería pasar a publicación controlada todavía.`,
      draftBlueprint: [...savedChannelDraft.draftBlueprint],
      publishChecklist: [...savedChannelDraft.publishChecklist],
      recommendedArtifacts: [...savedChannelDraft.recommendedArtifacts],
      nextMilestone: savedChannelDraft.nextMilestone,
      blockedBy: [...savedChannelDraft.blockedBy],
      guardrails: [
        ...savedChannelDraft.guardrails,
        'No tratar esta entity de asset como publicación viva ni checkout real todavía.',
      ],
    };
  }
}
