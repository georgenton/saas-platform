import {
  TenantEcommerceProductEntityChannelAssetWorkspaceView,
  TenantEcommerceSavedProductEntityChannelDraftView,
} from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityChannelDraftRepository } from '../ports/ecommerce-product-entity-channel-draft.repository';

export class PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase {
  constructor(
    private readonly ecommerceProductEntityChannelDraftRepository: EcommerceProductEntityChannelDraftRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ): Promise<TenantEcommerceProductEntityChannelAssetWorkspaceView | null> {
    const promotedAt = this.nowProvider();
    const savedChannelDraft =
      await this.ecommerceProductEntityChannelDraftRepository.markPromotedToAssetWorkspace(
        tenantSlug,
        productEntityId,
        channelKey,
        promotedAt,
      );

    if (!savedChannelDraft) {
      return null;
    }

    return this.toWorkspace(savedChannelDraft, promotedAt);
  }

  toWorkspace(
    savedChannelDraft: TenantEcommerceSavedProductEntityChannelDraftView,
    generatedAt: Date,
  ): TenantEcommerceProductEntityChannelAssetWorkspaceView {
    const status =
      savedChannelDraft.preparationStatus === 'ready_to_stage'
        ? 'ready_for_asset_edit'
        : savedChannelDraft.preparationStatus;

    return {
      tenantSlug: savedChannelDraft.tenantSlug,
      generatedAt,
      productEntityId: savedChannelDraft.productEntityId,
      channelKey: savedChannelDraft.channelKey,
      promotedAt: savedChannelDraft.promotedToAssetWorkspaceAt ?? generatedAt,
      status,
      handoffOwner: savedChannelDraft.handoffOwner,
      headline:
        status === 'ready_for_asset_edit'
          ? `El asset workspace de ${savedChannelDraft.channelKey} ya puede editarse como artifact operable dentro de Ecommerce.`
          : status === 'needs_core_copy'
            ? `El asset workspace de ${savedChannelDraft.channelKey} ya existe, pero todavía necesita copy base antes de tratarlo como artifact más operable.`
            : `El asset workspace de ${savedChannelDraft.channelKey} ya existe, pero sigue bloqueado antes de abrir staging más real.`,
      detail:
        status === 'ready_for_asset_edit'
          ? 'Usa este workspace para mantener blueprint, checklist y artifacts del canal bajo una misma superficie persistida.'
          : 'Este workspace ya fija ownership del canal, pero mantiene explícito que todavía no estamos publicando un asset vivo.',
      editableSnapshot: {
        title: savedChannelDraft.title,
        headline: savedChannelDraft.headline,
        draftBlueprint: [...savedChannelDraft.draftBlueprint],
        publishChecklist: [...savedChannelDraft.publishChecklist],
        recommendedArtifacts: [...savedChannelDraft.recommendedArtifacts],
        nextMilestone: savedChannelDraft.nextMilestone,
      },
      guardrails: [...savedChannelDraft.guardrails],
      nextActions:
        status === 'ready_for_asset_edit'
          ? [
              `Editar el asset de ${savedChannelDraft.channelKey} con foco en staging controlado.`,
              'Mantener la narrativa comercial consistente con la product entity.',
            ]
          : status === 'needs_core_copy'
            ? [
                'Cerrar copy y artifacts base antes de tratar este asset como staging operable.',
                'Mantener este workspace separado de publicación real por ahora.',
              ]
            : [
                'Resolver bloqueos antes de abrir un asset más operable.',
                'No saltar directo a publicación ni automatización viva.',
              ],
    };
  }
}
