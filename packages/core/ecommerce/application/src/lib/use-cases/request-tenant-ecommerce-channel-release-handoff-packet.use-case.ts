import { TenantEcommerceChannelReleaseHandoffPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceChannelReleaseExecutionReadinessUseCase } from './get-tenant-ecommerce-channel-release-execution-readiness.use-case';
import { GetTenantEcommerceChannelReleaseWorkbenchUseCase } from './get-tenant-ecommerce-channel-release-workbench.use-case';

export class RequestTenantEcommerceChannelReleaseHandoffPacketUseCase {
  constructor(
    private readonly getTenantEcommerceChannelReleaseExecutionReadinessUseCase: GetTenantEcommerceChannelReleaseExecutionReadinessUseCase,
    private readonly getTenantEcommerceChannelReleaseWorkbenchUseCase: GetTenantEcommerceChannelReleaseWorkbenchUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceChannelReleaseHandoffPacketView | null> {
    const [readiness, workbench] = await Promise.all([
      this.getTenantEcommerceChannelReleaseExecutionReadinessUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.getTenantEcommerceChannelReleaseWorkbenchUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!readiness || !workbench) {
      return null;
    }

    const channels = readiness.channels.map((channel) => {
      const workbenchChannel = workbench.channels.find(
        (entry) => entry.channelKey === channel.channelKey,
      );

      return {
        channelKey: channel.channelKey,
        readiness: channel.releaseStatus,
        handoffOwner: channel.executionOwner,
        blockerType:
          channel.releaseStatus === 'blocked'
            ? ('blocker' as const)
          : channel.releaseStatus === 'candidate_ready'
              ? ('none' as const)
              : ('warning' as const),
        minimumArtifacts:
          workbenchChannel && workbenchChannel.status !== 'missing'
            ? [
                `${workbenchChannel.title} handoff summary`,
                ...channel.executionChecklist.slice(0, 2),
              ]
            : ['Promover release candidate y checklist mínimo de canal'],
        nextMilestone: workbenchChannel?.nextMilestone ?? channel.launchWindow,
      };
    });

    const blockers = channels
      .filter((channel) => channel.blockerType === 'blocker')
      .map(
        (channel) =>
          `${channel.channelKey}: ${channel.minimumArtifacts[0] ?? 'bloqueo operativo pendiente'}`,
      );
    const warnings = channels
      .filter((channel) => channel.blockerType === 'warning')
      .map(
        (channel) =>
          `${channel.channelKey}: ${channel.nextMilestone}`,
      );

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: readiness.productEntity,
      handoffStatus:
        readiness.overallStatus === 'ready_for_controlled_release'
          ? 'ready_for_handoff'
          : readiness.overallStatus === 'blocked'
            ? 'blocked'
            : 'needs_channel_completion',
      summary:
        readiness.overallStatus === 'ready_for_controlled_release'
          ? 'El release ya se puede empacar como handoff controlado por canal.'
          : readiness.overallStatus === 'blocked'
            ? 'Todavía hay bloqueos duros y conviene no empujar el handoff como salida controlada.'
            : 'El handoff ya se puede preparar, pero todavía conviene cerrar algunos canales antes de tratarlo como salida limpia.',
      ownerModel: {
        primaryOwner: channels.some((channel) => channel.handoffOwner === 'shared')
          ? 'shared'
          : channels.some((channel) => channel.handoffOwner === 'growth')
            ? 'growth'
            : 'ecommerce',
        escalationOwner: channels.some((channel) => channel.handoffOwner === 'growth')
          ? 'growth'
          : 'shared',
        releaseMode: 'controlled_release',
      },
      channels,
      handoffChecklist: [
        ...readiness.finalChecklist,
        'Confirmar owner de handoff y ventana de release por canal',
      ],
      warnings,
      blockers,
      guardrails: [
        ...readiness.guardrails,
        'No tratar este handoff como go-live automático ni publicación viva todavía.',
      ],
    };
  }
}
