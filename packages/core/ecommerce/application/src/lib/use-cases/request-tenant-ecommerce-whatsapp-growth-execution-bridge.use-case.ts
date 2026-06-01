import { TenantEcommerceWhatsappGrowthExecutionBridgeView } from '@saas-platform/ecommerce-domain';
import { RequestTenantEcommerceWhatsappGrowthActivationPacketUseCase } from './request-tenant-ecommerce-whatsapp-growth-activation-packet.use-case';
import { RequestTenantEcommerceWhatsappGrowthHandoffUseCase } from './request-tenant-ecommerce-whatsapp-growth-handoff.use-case';

export class RequestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase {
  constructor(
    private readonly requestTenantEcommerceWhatsappGrowthHandoffUseCase: RequestTenantEcommerceWhatsappGrowthHandoffUseCase,
    private readonly requestTenantEcommerceWhatsappGrowthActivationPacketUseCase: RequestTenantEcommerceWhatsappGrowthActivationPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceWhatsappGrowthExecutionBridgeView | null> {
    const [handoff, activationPacket] = await Promise.all([
      this.requestTenantEcommerceWhatsappGrowthHandoffUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceWhatsappGrowthActivationPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!handoff || !activationPacket) {
      return null;
    }

    const bridgeStatus =
      handoff.handoffStatus === 'blocked' ||
      activationPacket.packetStatus === 'blocked'
        ? 'blocked'
        : handoff.handoffStatus === 'ready_for_growth_workbench' &&
            activationPacket.packetStatus ===
              'ready_for_growth_operator_activation'
          ? 'ready_for_growth_execution'
          : 'needs_operator_revision';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: activationPacket.productEntity,
      assetEntity: activationPacket.assetEntity,
      bridgeStatus,
      summary:
        bridgeStatus === 'ready_for_growth_execution'
          ? 'El puente entre Ecommerce y Growth ya está listo para ejecución operada por WhatsApp.'
          : bridgeStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene empujar este puente como ejecución operada.'
            : 'El puente ya se puede preparar, pero todavía conviene revisar secuencia y handoff antes de ejecución.',
      targetWorkspace: {
        productKey: 'growth',
        channel: 'whatsapp',
        activationMode: 'operator_assist',
        handoffMode: 'operator_assist',
      },
      executionPayload: {
        opener: activationPacket.messagePack.opener,
        qualification: activationPacket.messagePack.qualification,
        objectionHandling: [...activationPacket.messagePack.objectionHandling],
        closingCta: activationPacket.messagePack.closingCta,
        fallbackEscalation: activationPacket.messagePack.fallbackEscalation,
      },
      operatorChecklist: [
        ...activationPacket.activationChecklist,
        ...handoff.readinessChecks.slice(0, 2),
      ],
      bridgeArtifacts: [
        ...handoff.bridgeArtifacts,
        ...activationPacket.bridgeArtifacts,
      ],
      nextSteps: [
        ...activationPacket.operatorSteps,
        ...handoff.sequencingNotes.slice(0, 2),
      ],
      guardrails: [
        ...handoff.guardrails.slice(0, 2),
        ...activationPacket.guardrails,
        'No tratar este bridge como automatización viva de Growth todavía.',
      ],
    };
  }
}
