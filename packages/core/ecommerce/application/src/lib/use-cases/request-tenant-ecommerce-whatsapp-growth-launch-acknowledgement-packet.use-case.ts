import { TenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase } from './get-tenant-ecommerce-whatsapp-growth-activation-workspace.use-case';
import { RequestTenantEcommerceWhatsappGrowthActivationPacketUseCase } from './request-tenant-ecommerce-whatsapp-growth-activation-packet.use-case';
import { RequestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase } from './request-tenant-ecommerce-whatsapp-growth-operator-launch-packet.use-case';

export class RequestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase {
  constructor(
    private readonly getTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase: GetTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase,
    private readonly requestTenantEcommerceWhatsappGrowthActivationPacketUseCase: RequestTenantEcommerceWhatsappGrowthActivationPacketUseCase,
    private readonly requestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase: RequestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketView | null> {
    const [activationWorkspace, activationPacket, operatorLaunchPacket] =
      await Promise.all([
        this.getTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
        this.requestTenantEcommerceWhatsappGrowthActivationPacketUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
        this.requestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
      ]);

    if (!activationWorkspace || !activationPacket || !operatorLaunchPacket) {
      return null;
    }

    const blockers = [
      ...(activationWorkspace.activationStatus === 'blocked'
        ? ['El activation workspace de WhatsApp todavía está bloqueado.']
        : []),
      ...(activationPacket.packetStatus === 'blocked'
        ? ['El activation packet de WhatsApp todavía está bloqueado.']
        : []),
      ...operatorLaunchPacket.blockers,
    ];

    const acknowledgementStatus =
      blockers.length > 0
        ? 'blocked'
        : activationWorkspace.activationStatus === 'ready_for_growth_activation' &&
            activationPacket.packetStatus ===
              'ready_for_growth_operator_activation' &&
            operatorLaunchPacket.launchStatus ===
              'ready_for_growth_operator_launch'
          ? 'ready_for_growth_launch_acknowledgement'
          : 'needs_operator_revision';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: activationWorkspace.productEntity,
      assetEntity: activationWorkspace.assetEntity,
      acknowledgementStatus,
      summary:
        acknowledgementStatus === 'ready_for_growth_launch_acknowledgement'
          ? 'WhatsApp ya tiene una base bastante clara para acknowledgement final antes de operación en Growth.'
          : acknowledgementStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar este packet como acknowledgement final de launch.'
            : 'El handoff ya está bien encaminado, aunque todavía conviene una última revisión operativa antes del acknowledgement.',
      targetWorkspace: {
        ...operatorLaunchPacket.targetWorkspace,
      },
      activationContext: {
        workspaceStatus: activationWorkspace.activationStatus,
        packetStatus: activationPacket.packetStatus,
        launchStatus: operatorLaunchPacket.launchStatus,
      },
      launchPayload: {
        opener: operatorLaunchPacket.executionPayload.opener,
        qualification: operatorLaunchPacket.executionPayload.qualification,
        objectionHandling: [
          ...operatorLaunchPacket.executionPayload.objectionHandling,
        ],
        closingCta: operatorLaunchPacket.executionPayload.closingCta,
        fallbackEscalation:
          operatorLaunchPacket.executionPayload.fallbackEscalation,
      },
      acknowledgementChecklist: [
        ...activationWorkspace.activationChecklist.slice(0, 2),
        ...operatorLaunchPacket.launchChecklist.slice(0, 2),
        ...activationPacket.activationChecklist.slice(0, 1),
      ],
      operatorActions: [
        ...operatorLaunchPacket.operatorSteps.slice(0, 2),
        ...activationPacket.operatorSteps.slice(0, 2),
        ...activationWorkspace.handoffNotes.slice(0, 1),
      ],
      bridgeArtifacts: [...operatorLaunchPacket.bridgeArtifacts],
      blockers,
      guardrails: [
        ...activationWorkspace.guardrails.slice(0, 2),
        ...activationPacket.guardrails.slice(0, 2),
        ...operatorLaunchPacket.guardrails.slice(0, 2),
        'No convertir este acknowledgement packet en automatización viva de Growth todavía.',
      ],
    };
  }
}
