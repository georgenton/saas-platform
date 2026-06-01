import { TenantEcommerceStorefrontPublishReviewWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceStorefrontPreviewWorkspaceUseCase } from './get-tenant-ecommerce-storefront-preview-workspace.use-case';
import { RequestTenantEcommerceChannelReleaseApprovalPacketUseCase } from './request-tenant-ecommerce-channel-release-approval-packet.use-case';

export class GetTenantEcommerceStorefrontPublishReviewWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceStorefrontPreviewWorkspaceUseCase: GetTenantEcommerceStorefrontPreviewWorkspaceUseCase,
    private readonly requestTenantEcommerceChannelReleaseApprovalPacketUseCase: RequestTenantEcommerceChannelReleaseApprovalPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceStorefrontPublishReviewWorkspaceView | null> {
    const [preview, approval] = await Promise.all([
      this.getTenantEcommerceStorefrontPreviewWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceChannelReleaseApprovalPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!preview || !approval) {
      return null;
    }

    const blockers = [
      ...approval.blockers,
      ...approval.channels
        .filter((channel) => channel.approvalDecision === 'block')
        .map((channel) => `${channel.channelKey}: ${channel.rationale}`),
    ];

    const reviewStatus =
      blockers.length > 0
        ? 'blocked'
        : preview.previewStatus === 'ready_for_preview_review' &&
            approval.approvalStatus === 'ready_for_operator_approval'
          ? 'ready_for_publish_review'
          : 'needs_operator_revision';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: preview.productEntity,
      reviewStatus,
      summary:
        reviewStatus === 'ready_for_publish_review'
          ? {
              headline:
                'El storefront ya está listo para una revisión final antes de salida controlada.',
              detail:
                'Preview y approval ya convergen en una misma lectura operativa para revisar la salida casi final.',
            }
          : reviewStatus === 'blocked'
            ? {
                headline:
                  'Todavía hay bloqueos duros y no conviene abrir revisión final de publish.',
                detail:
                  'Conviene resolver approval blockers y señales rojas del preview antes de tratar esta salida como casi lista.',
              }
            : {
                headline:
                  'La revisión final ya se puede preparar, aunque todavía quedan ajustes operativos por cerrar.',
                detail:
                  'El storefront ya tiene forma, pero todavía conviene revisar copy, canal o approval antes de publish review final.',
              },
      previewSnapshot: preview,
      approvalSnapshot: {
        approvalStatus: approval.approvalStatus,
        approvalOwner: approval.approvalOwner,
        channelDecisions: approval.channels.map((channel) => ({
          channelKey: channel.channelKey,
          approvalDecision: channel.approvalDecision,
          rationale: channel.rationale,
        })),
      },
      reviewChecklist: [
        ...preview.previewChecklist.slice(0, 3),
        ...approval.requiredApprovals.slice(0, 2),
      ],
      blockers,
      guardrails: [
        ...preview.guardrails.slice(0, 2),
        ...approval.guardrails.slice(0, 2),
        'No tratar esta review como publish vivo ni salida automática todavía.',
      ],
    };
  }
}
