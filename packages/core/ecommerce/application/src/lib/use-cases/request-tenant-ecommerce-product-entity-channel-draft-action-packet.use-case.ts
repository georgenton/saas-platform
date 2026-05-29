import { TenantEcommerceProductEntityChannelDraftActionPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductEntityChannelDraftDetailUseCase } from './get-tenant-ecommerce-product-entity-channel-draft-detail.use-case';

export class RequestTenantEcommerceProductEntityChannelDraftActionPacketUseCase {
  constructor(
    private readonly getTenantEcommerceProductEntityChannelDraftDetailUseCase: GetTenantEcommerceProductEntityChannelDraftDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: string,
  ): Promise<TenantEcommerceProductEntityChannelDraftActionPacketView | null> {
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
      actionStatus: detail.draftStatus,
      summary:
        detail.draftStatus === 'ready_to_prepare'
          ? `El draft de ${detail.channelKey} ya tiene base suficiente para prepararse como asset operativo.`
          : detail.draftStatus === 'needs_core_copy'
            ? `Todavia conviene cerrar inputs clave antes de abrir el draft de ${detail.channelKey}.`
            : `El draft de ${detail.channelKey} sigue bloqueado hasta resolver activacion.`,
      requiredInputs: [...detail.requiredInputs],
      recommendedArtifacts:
        detail.channelKey === 'landing'
          ? ['Landing copy sheet', 'CTA QA checklist', 'Trust proof references']
          : detail.channelKey === 'catalog'
            ? ['Catalog card draft', 'Pricing note', 'Offer framing checklist']
            : [
                'WhatsApp opening script',
                'Follow-up branch sheet',
                'Recovery CTA fallback',
              ],
      nextStep:
        detail.draftStatus === 'ready_to_prepare'
          ? `Preparar el primer draft de ${detail.channelKey} manteniendo una sola narrativa comercial.`
          : `Cerrar los inputs base de ${detail.channelKey} antes de abrir el draft operativo.`,
      blockedBy: [...detail.blockedBy],
      guardrails: [
        ...detail.guardrails,
        'No tratar este packet como publicación final ni automatización viva todavia.',
      ],
    };
  }
}
