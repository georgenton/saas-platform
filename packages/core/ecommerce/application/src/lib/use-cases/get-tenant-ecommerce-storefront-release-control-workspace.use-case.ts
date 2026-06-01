import { TenantEcommerceStorefrontReleaseControlWorkspaceView } from '@saas-platform/ecommerce-domain';
import { RequestTenantEcommerceChannelReleaseLaunchPacketUseCase } from './request-tenant-ecommerce-channel-release-launch-packet.use-case';
import { GetTenantEcommerceStorefrontPublishReviewWorkspaceUseCase } from './get-tenant-ecommerce-storefront-publish-review-workspace.use-case';
import { GetTenantEcommerceStorefrontReleaseCandidateBriefUseCase } from './get-tenant-ecommerce-storefront-release-candidate-brief.use-case';

export class GetTenantEcommerceStorefrontReleaseControlWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceStorefrontReleaseCandidateBriefUseCase: GetTenantEcommerceStorefrontReleaseCandidateBriefUseCase,
    private readonly getTenantEcommerceStorefrontPublishReviewWorkspaceUseCase: GetTenantEcommerceStorefrontPublishReviewWorkspaceUseCase,
    private readonly requestTenantEcommerceChannelReleaseLaunchPacketUseCase: RequestTenantEcommerceChannelReleaseLaunchPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceStorefrontReleaseControlWorkspaceView | null> {
    const [brief, publishReview, launchPacket] = await Promise.all([
      this.getTenantEcommerceStorefrontReleaseCandidateBriefUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.getTenantEcommerceStorefrontPublishReviewWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceChannelReleaseLaunchPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!brief || !publishReview || !launchPacket) {
      return null;
    }

    const blockers = [
      ...brief.blockers,
      ...publishReview.blockers,
      ...launchPacket.blockers,
    ];

    const controlStatus =
      blockers.length > 0
        ? 'blocked'
        : brief.briefStatus === 'ready_for_storefront_release_candidate' &&
            publishReview.reviewStatus === 'ready_for_publish_review' &&
            launchPacket.launchStatus === 'ready_for_controlled_launch'
          ? 'ready_for_release_control'
          : 'needs_operator_revision';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: brief.productEntity,
      controlStatus,
      summary:
        controlStatus === 'ready_for_release_control'
          ? {
              headline:
                'El storefront ya tiene una mesa de control razonable para salida controlada.',
              detail:
                'Brief, publish review y launch packet ya convergen en una sola lectura operativa para avanzar con control de release.',
            }
          : controlStatus === 'blocked'
            ? {
                headline:
                  'Todavía hay bloqueos y no conviene abrir control final de release.',
                detail:
                  'Conviene resolver blockers del brief, review o launch packet antes de tratar este storefront como salida controlada.',
              }
            : {
                headline:
                  'El storefront ya se puede controlar mejor, aunque todavía quedan ajustes antes del release.',
                detail:
                  'La salida ya tiene forma, pero todavía conviene revisar señales de canal o launch antes de control final.',
              },
      briefSnapshot: {
        briefStatus: brief.briefStatus,
        landingTitle: brief.landingArtifact.title,
        catalogTitle: brief.catalogListing.title,
      },
      releaseControl: {
        reviewStatus: publishReview.reviewStatus,
        approvalOwner: publishReview.approvalSnapshot.approvalOwner,
        launchOwner: launchPacket.launchOwner,
      },
      channelDecisions: launchPacket.channels.map((channel) => ({
        channelKey: channel.channelKey,
        launchDecision: channel.launchDecision,
        launchStep: channel.launchStep,
      })),
      controlChecklist: [
        ...brief.finalChecklist.slice(0, 2),
        ...publishReview.reviewChecklist.slice(0, 2),
        ...launchPacket.launchChecklist.slice(0, 2),
      ],
      blockers,
      guardrails: [
        ...brief.guardrails.slice(0, 2),
        ...publishReview.guardrails.slice(0, 2),
        ...launchPacket.guardrails.slice(0, 2),
        'No tratar este control workspace como release vivo ni publicación automática todavía.',
      ],
    };
  }
}
