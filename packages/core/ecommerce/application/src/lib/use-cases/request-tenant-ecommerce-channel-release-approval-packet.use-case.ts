import { TenantEcommerceChannelReleaseApprovalPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceChannelReleaseExecutionReadinessUseCase } from './get-tenant-ecommerce-channel-release-execution-readiness.use-case';
import { RequestTenantEcommerceChannelReleaseHandoffPacketUseCase } from './request-tenant-ecommerce-channel-release-handoff-packet.use-case';

export class RequestTenantEcommerceChannelReleaseApprovalPacketUseCase {
  constructor(
    private readonly getTenantEcommerceChannelReleaseExecutionReadinessUseCase: GetTenantEcommerceChannelReleaseExecutionReadinessUseCase,
    private readonly requestTenantEcommerceChannelReleaseHandoffPacketUseCase: RequestTenantEcommerceChannelReleaseHandoffPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceChannelReleaseApprovalPacketView | null> {
    const [readiness, handoff] = await Promise.all([
      this.getTenantEcommerceChannelReleaseExecutionReadinessUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceChannelReleaseHandoffPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!readiness || !handoff) {
      return null;
    }

    const channels = readiness.channels.map((channel) => ({
      channelKey: channel.channelKey,
      readiness: channel.releaseStatus,
      approvalDecision:
        channel.releaseStatus === 'candidate_ready'
          ? ('approve' as const)
          : channel.releaseStatus === 'blocked'
            ? ('block' as const)
            : ('review' as const),
      rationale:
        channel.releaseStatus === 'candidate_ready'
          ? 'El canal ya tiene señales suficientes para aprobación operada.'
          : channel.releaseStatus === 'blocked'
            ? 'Todavía existe un bloqueo duro y no conviene aprobar este canal.'
            : 'El canal necesita revisión adicional antes de considerarlo aprobado.',
    }));

    const blockers = channels
      .filter((channel) => channel.approvalDecision === 'block')
      .map((channel) => `${channel.channelKey}: ${channel.rationale}`);
    const warnings = channels
      .filter((channel) => channel.approvalDecision === 'review')
      .map((channel) => `${channel.channelKey}: ${channel.rationale}`);

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: readiness.productEntity,
      approvalStatus:
        readiness.overallStatus === 'ready_for_controlled_release'
          ? 'ready_for_operator_approval'
          : readiness.overallStatus === 'blocked'
            ? 'blocked'
            : 'needs_channel_completion',
      summary:
        readiness.overallStatus === 'ready_for_controlled_release'
          ? 'El release ya está listo para una aprobación operada y explícita.'
          : readiness.overallStatus === 'blocked'
            ? 'Todavía hay bloqueos duros y no conviene abrir aprobación final.'
            : 'La aprobación ya se puede preparar, pero todavía conviene revisar algunos canales.',
      approvalOwner: handoff.ownerModel.primaryOwner,
      channels,
      requiredApprovals: [
        ...handoff.handoffChecklist.slice(0, 2),
        'Confirmar owner final y guardrails de salida por canal',
      ],
      warnings,
      blockers,
      guardrails: [
        ...handoff.guardrails,
        'No tratar esta aprobación como go-live automático ni publish vivo todavía.',
      ],
    };
  }
}
