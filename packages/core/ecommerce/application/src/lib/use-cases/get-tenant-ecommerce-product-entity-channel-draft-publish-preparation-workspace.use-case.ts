import { TenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductEntityChannelDraftDetailUseCase } from './get-tenant-ecommerce-product-entity-channel-draft-detail.use-case';
import { RequestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase } from './request-tenant-ecommerce-product-entity-channel-draft-publish-readiness-packet.use-case';

export class GetTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceProductEntityChannelDraftDetailUseCase: GetTenantEcommerceProductEntityChannelDraftDetailUseCase,
    private readonly requestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase: RequestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: string,
  ): Promise<TenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceView | null> {
    const [detail, publishReadinessPacket] = await Promise.all([
      this.getTenantEcommerceProductEntityChannelDraftDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        channelKey,
      ),
      this.requestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase.execute(
        tenantSlug,
        productEntityId,
        channelKey,
      ),
    ]);

    if (!detail || !publishReadinessPacket) {
      return null;
    }

    return {
      tenantSlug: detail.tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: detail.productEntity,
      channelKey: detail.channelKey,
      preparationStatus:
        detail.draftStatus === 'ready_to_prepare'
          ? 'ready_to_stage'
          : detail.draftStatus,
      summary:
        detail.draftStatus === 'ready_to_prepare'
          ? `El draft de ${detail.channelKey} ya puede entrar a una preparación de staging con artifacts y checklist concretos.`
          : detail.draftStatus === 'needs_core_copy'
            ? `Todavia conviene cerrar copy base antes de preparar el staging del draft de ${detail.channelKey}.`
            : `El draft de ${detail.channelKey} sigue bloqueado y no debería entrar en staging todavía.`,
      handoffOwner: detail.recommendedOwner,
      draftBlueprint: [...detail.structure],
      publishChecklist: [...publishReadinessPacket.requiredChecks],
      recommendedArtifacts: [...publishReadinessPacket.recommendedArtifacts],
      nextMilestone:
        detail.draftStatus === 'ready_to_prepare'
          ? `Preparar staging controlado del canal ${detail.channelKey} y validar artifacts base antes de un publish más real.`
          : `Cerrar copy base y checks de ${detail.channelKey} antes de tratar el draft como staging operable.`,
      blockedBy: [...publishReadinessPacket.blockedBy],
      guardrails: [
        ...publishReadinessPacket.guardrails,
        'No tratar este workspace como publicación real ni como asset vivo todavía.',
      ],
    };
  }
}
