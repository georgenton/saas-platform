import { TenantEcommerceChannelReleaseLaunchPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceChannelReleaseExecutionReadinessUseCase } from './get-tenant-ecommerce-channel-release-execution-readiness.use-case';
import { RequestTenantEcommerceChannelReleaseApprovalPacketUseCase } from './request-tenant-ecommerce-channel-release-approval-packet.use-case';

export class RequestTenantEcommerceChannelReleaseLaunchPacketUseCase {
  constructor(
    private readonly getTenantEcommerceChannelReleaseExecutionReadinessUseCase: GetTenantEcommerceChannelReleaseExecutionReadinessUseCase,
    private readonly requestTenantEcommerceChannelReleaseApprovalPacketUseCase: RequestTenantEcommerceChannelReleaseApprovalPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceChannelReleaseLaunchPacketView | null> {
    const [readiness, approval] = await Promise.all([
      this.getTenantEcommerceChannelReleaseExecutionReadinessUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceChannelReleaseApprovalPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!readiness || !approval) {
      return null;
    }

    const channels = readiness.channels.map((channel) => {
      const approvalChannel = approval.channels.find(
        (entry) => entry.channelKey === channel.channelKey,
      );
      const launchDecision =
        approvalChannel?.approvalDecision === 'approve'
          ? ('launch' as const)
          : approvalChannel?.approvalDecision === 'block'
            ? ('hold' as const)
            : ('review' as const);

      return {
        channelKey: channel.channelKey,
        launchDecision,
        launchStep:
          launchDecision === 'launch'
            ? `Launch controlado para ${channel.channelKey} con owner ${channel.executionOwner}`
            : launchDecision === 'hold'
              ? `No lanzar ${channel.channelKey} hasta resolver bloqueos`
              : `Revisar ${channel.channelKey} antes de confirmar salida`,
        fallbackStep:
          launchDecision === 'launch'
            ? `Si ${channel.channelKey} se degrada, volver a review operada`
            : `Mantener ${channel.channelKey} en preparation workspace`,
      };
    });

    const blockers = approval.blockers;
    const warnings = approval.warnings;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: readiness.productEntity,
      launchStatus:
        blockers.length > 0
          ? 'blocked'
          : approval.approvalStatus === 'ready_for_operator_approval' &&
              readiness.overallStatus === 'ready_for_controlled_release'
            ? 'ready_for_controlled_launch'
            : 'needs_operator_revision',
      summary:
        blockers.length > 0
          ? 'Todavía hay bloqueos duros y no conviene preparar un launch packet final.'
          : approval.approvalStatus === 'ready_for_operator_approval' &&
              readiness.overallStatus === 'ready_for_controlled_release'
            ? 'El release ya está listo para empaquetarse como salida controlada por canal.'
            : 'El launch packet ya se puede preparar, pero todavía conviene revisar algunos canales antes de tratarlo como salida final.',
      launchOwner: approval.approvalOwner,
      channels,
      launchChecklist: [
        ...readiness.finalChecklist.slice(0, 2),
        ...approval.requiredApprovals.slice(0, 2),
        'Confirmar ventana y fallback por canal antes del launch controlado',
      ],
      warnings,
      blockers,
      guardrails: [
        ...readiness.guardrails.slice(0, 2),
        ...approval.guardrails.slice(0, 2),
        'No convertir este launch packet en go-live automático ni publicación viva todavía.',
      ],
    };
  }
}
