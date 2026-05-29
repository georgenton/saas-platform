import { TenantEcommerceProductEntityChannelDraftPublishReadinessPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductEntityChannelDraftDetailUseCase } from './get-tenant-ecommerce-product-entity-channel-draft-detail.use-case';

export class RequestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase {
  constructor(
    private readonly getTenantEcommerceProductEntityChannelDraftDetailUseCase: GetTenantEcommerceProductEntityChannelDraftDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: string,
  ): Promise<TenantEcommerceProductEntityChannelDraftPublishReadinessPacketView | null> {
    const detail =
      await this.getTenantEcommerceProductEntityChannelDraftDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        channelKey,
      );

    if (!detail) {
      return null;
    }

    return {
      tenantSlug: detail.tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: detail.productEntity,
      channelKey: detail.channelKey,
      readinessStatus:
        detail.draftStatus === 'ready_to_prepare'
          ? 'ready_for_publish_preparation'
          : detail.draftStatus,
      summary:
        detail.draftStatus === 'ready_to_prepare'
          ? `El draft de ${detail.channelKey} ya puede pasar a una preparación más cercana a publicación.`
          : detail.draftStatus === 'needs_core_copy'
            ? `Todavia conviene cerrar copy y checks base antes de tratar el draft de ${detail.channelKey} como casi publicable.`
            : `El draft de ${detail.channelKey} sigue bloqueado y no debería entrar en preparación de publicación.`,
      requiredChecks:
        detail.channelKey === 'landing'
          ? ['Hero QA', 'CTA clarity', 'Trust proof review']
          : detail.channelKey === 'catalog'
            ? ['Pricing review', 'Offer framing QA', 'CTA label review']
            : [
                'Opening message QA',
                'Follow-up branch review',
                'Recovery CTA review',
              ],
      recommendedArtifacts:
        detail.channelKey === 'landing'
          ? ['Landing publish checklist', 'Hero copy review', 'CTA review note']
          : detail.channelKey === 'catalog'
            ? ['Catalog publish checklist', 'Pricing review note', 'Offer framing note']
            : [
                'WhatsApp publish checklist',
                'Sequence QA note',
                'Recovery CTA note',
              ],
      blockedBy: [...detail.blockedBy],
      guardrails: [
        ...detail.guardrails,
        'No tratar este packet como publicación real ni activación viva todavia.',
      ],
    };
  }
}
