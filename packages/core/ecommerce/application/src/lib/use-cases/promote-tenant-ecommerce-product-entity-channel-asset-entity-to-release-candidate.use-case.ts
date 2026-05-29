import { TenantEcommerceProductEntityChannelReleaseCandidateView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityChannelDraftRepository } from '../ports/ecommerce-product-entity-channel-draft.repository';

export class PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase {
  constructor(
    private readonly ecommerceProductEntityChannelDraftRepository: EcommerceProductEntityChannelDraftRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ): Promise<TenantEcommerceProductEntityChannelReleaseCandidateView | null> {
    const promotedAt = this.nowProvider();
    const savedChannelDraft =
      await this.ecommerceProductEntityChannelDraftRepository.markPromotedToReleaseCandidate(
        tenantSlug,
        productEntityId,
        channelKey,
        promotedAt,
      );

    if (!savedChannelDraft) {
      return null;
    }

    return this.toReleaseCandidate(savedChannelDraft, promotedAt);
  }

  toReleaseCandidate(
    savedChannelDraft: {
      id: string;
      tenantSlug: string;
      productEntityId: string;
      channelKey: 'landing' | 'catalog' | 'whatsapp';
      preparationStatus: 'ready_to_stage' | 'needs_core_copy' | 'blocked';
      handoffOwner: 'ecommerce' | 'growth' | 'shared';
      title: string;
      headline: string;
      publishChecklist: string[];
      recommendedArtifacts: string[];
      nextMilestone: string;
      blockedBy: string[];
      guardrails: string[];
    },
    promotedAt: Date,
  ): TenantEcommerceProductEntityChannelReleaseCandidateView {
    return {
      tenantSlug: savedChannelDraft.tenantSlug,
      generatedAt: promotedAt,
      releaseCandidateId: savedChannelDraft.id,
      productEntityId: savedChannelDraft.productEntityId,
      sourceAssetEntityId: savedChannelDraft.id,
      channelKey: savedChannelDraft.channelKey,
      promotedAt,
      status:
        savedChannelDraft.preparationStatus === 'ready_to_stage'
          ? 'candidate_ready'
          : savedChannelDraft.preparationStatus === 'needs_core_copy'
            ? 'needs_publish_copy'
            : 'blocked',
      handoffOwner: savedChannelDraft.handoffOwner,
      title: savedChannelDraft.title,
      headline: savedChannelDraft.headline,
      summary:
        savedChannelDraft.preparationStatus === 'ready_to_stage'
          ? `El release candidate de ${savedChannelDraft.channelKey} ya puede entrar a QA final previo a publicación controlada.`
          : savedChannelDraft.preparationStatus === 'needs_core_copy'
            ? `El release candidate de ${savedChannelDraft.channelKey} ya existe, pero todavía necesita copy final antes de QA cerrado.`
            : `El release candidate de ${savedChannelDraft.channelKey} sigue bloqueado y no debería avanzar a QA final todavía.`,
      publishChecklist: [...savedChannelDraft.publishChecklist],
      recommendedArtifacts: [...savedChannelDraft.recommendedArtifacts],
      nextMilestone: savedChannelDraft.nextMilestone,
      blockedBy: [...savedChannelDraft.blockedBy],
      guardrails: [
        ...savedChannelDraft.guardrails,
        'No tratar este release candidate como publicación viva ni activación automática todavía.',
      ],
    };
  }
}
