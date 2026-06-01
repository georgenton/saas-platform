import { TenantEcommerceWhatsappGrowthActivationPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase } from './get-tenant-ecommerce-whatsapp-growth-activation-workspace.use-case';

export class RequestTenantEcommerceWhatsappGrowthActivationPacketUseCase {
  constructor(
    private readonly getTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase: GetTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceWhatsappGrowthActivationPacketView | null> {
    const workspace =
      await this.getTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!workspace) {
      return null;
    }

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: workspace.productEntity,
      assetEntity: workspace.assetEntity,
      packetStatus:
        workspace.activationStatus === 'ready_for_growth_activation'
          ? 'ready_for_growth_operator_activation'
          : workspace.activationStatus === 'blocked'
            ? 'blocked'
            : 'needs_operator_revision',
      activationTarget: {
        productKey: 'growth',
        channel: 'whatsapp',
        activationMode: 'operator_assist',
      },
      activationSummary:
        workspace.activationStatus === 'ready_for_growth_activation'
          ? 'El paquete ya está listo para que Growth lo tome como activación asistida.'
          : workspace.activationStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene armar el paquete final de activación.'
            : 'El paquete ya se puede preparar, pero todavía conviene revisar copy y secuencia antes de pasarlo a Growth.',
      messagePack: {
        opener: workspace.sequencePayload.opener,
        qualification: workspace.sequencePayload.qualification,
        objectionHandling: [...workspace.sequencePayload.objectionHandling],
        closingCta: workspace.sequencePayload.closingCta,
        fallbackEscalation: workspace.sequencePayload.fallbackEscalation,
      },
      activationChecklist: [...workspace.activationChecklist],
      bridgeArtifacts: [...workspace.bridgeArtifacts],
      operatorSteps: [
        ...workspace.handoffNotes,
        'Growth revisa tono, timing y fallback antes de cualquier activación operada.',
      ],
      guardrails: [
        ...workspace.guardrails,
        'No convertir este packet en automatización viva sin operator review de Growth.',
      ],
    };
  }
}
