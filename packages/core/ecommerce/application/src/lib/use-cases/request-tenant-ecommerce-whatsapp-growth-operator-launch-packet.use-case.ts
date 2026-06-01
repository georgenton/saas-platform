import { TenantEcommerceWhatsappGrowthOperatorLaunchPacketView } from '@saas-platform/ecommerce-domain';
import { RequestTenantEcommerceChannelReleaseLaunchPacketUseCase } from './request-tenant-ecommerce-channel-release-launch-packet.use-case';
import { RequestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase } from './request-tenant-ecommerce-whatsapp-growth-execution-bridge.use-case';

export class RequestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase {
  constructor(
    private readonly requestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase: RequestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase,
    private readonly requestTenantEcommerceChannelReleaseLaunchPacketUseCase: RequestTenantEcommerceChannelReleaseLaunchPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceWhatsappGrowthOperatorLaunchPacketView | null> {
    const [executionBridge, releaseLaunchPacket] = await Promise.all([
      this.requestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceChannelReleaseLaunchPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!executionBridge || !releaseLaunchPacket) {
      return null;
    }

    const whatsappLaunch =
      releaseLaunchPacket.channels.find((channel) => channel.channelKey === 'whatsapp') ??
      releaseLaunchPacket.channels[0] ??
      null;

    const blockers = [
      ...(executionBridge.bridgeStatus === 'blocked'
        ? ['El execution bridge de WhatsApp todavía está bloqueado.']
        : []),
      ...releaseLaunchPacket.blockers,
    ];

    const launchStatus =
      blockers.length > 0
        ? 'blocked'
        : executionBridge.bridgeStatus === 'ready_for_growth_execution' &&
            releaseLaunchPacket.launchStatus === 'ready_for_controlled_launch' &&
            whatsappLaunch?.launchDecision === 'launch'
          ? 'ready_for_growth_operator_launch'
          : 'needs_operator_revision';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: executionBridge.productEntity,
      assetEntity: executionBridge.assetEntity,
      launchStatus,
      summary:
        launchStatus === 'ready_for_growth_operator_launch'
          ? 'El packet de WhatsApp ya está listo para una activación operada desde Growth.'
          : launchStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar este packet como activación casi final.'
            : 'El packet ya se puede preparar, pero todavía conviene revisar secuencia y launch antes de operarlo.',
      targetWorkspace: {
        ...executionBridge.targetWorkspace,
        activationMode: 'operator_assist',
        handoffMode: 'operator_assist',
      },
      executionPayload: {
        ...executionBridge.executionPayload,
        objectionHandling: [...executionBridge.executionPayload.objectionHandling],
      },
      launchChecklist: [
        ...executionBridge.operatorChecklist.slice(0, 2),
        ...releaseLaunchPacket.launchChecklist.slice(0, 2),
        'Confirmar opener, recovery y CTA final antes de pasar a operación asistida',
      ],
      operatorSteps: [
        ...(whatsappLaunch ? [whatsappLaunch.launchStep, whatsappLaunch.fallbackStep] : []),
        ...executionBridge.nextSteps.slice(0, 2),
      ],
      bridgeArtifacts: [...executionBridge.bridgeArtifacts],
      blockers,
      guardrails: [
        ...executionBridge.guardrails.slice(0, 2),
        ...releaseLaunchPacket.guardrails.slice(0, 2),
        'No convertir este packet en automatización viva de Growth todavía.',
      ],
    };
  }
}
