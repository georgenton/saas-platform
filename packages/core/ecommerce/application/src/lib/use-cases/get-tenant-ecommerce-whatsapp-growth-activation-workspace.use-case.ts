import { TenantEcommerceWhatsappGrowthActivationWorkspaceView } from '@saas-platform/ecommerce-domain';
import { RequestTenantEcommerceWhatsappGrowthHandoffUseCase } from './request-tenant-ecommerce-whatsapp-growth-handoff.use-case';

export class GetTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase {
  constructor(
    private readonly requestTenantEcommerceWhatsappGrowthHandoffUseCase: RequestTenantEcommerceWhatsappGrowthHandoffUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceWhatsappGrowthActivationWorkspaceView | null> {
    const handoff =
      await this.requestTenantEcommerceWhatsappGrowthHandoffUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!handoff) {
      return null;
    }

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: handoff.productEntity,
      assetEntity: handoff.assetEntity,
      activationStatus:
        handoff.handoffStatus === 'ready_for_growth_workbench'
          ? 'ready_for_growth_activation'
          : handoff.handoffStatus === 'needs_publish_copy'
            ? 'needs_publish_copy'
            : 'blocked',
      targetWorkspace: {
        productKey: 'growth',
        channel: 'whatsapp',
        activationMode: 'operator_assist',
      },
      activationSummary:
        handoff.handoffStatus === 'ready_for_growth_workbench'
          ? 'El handoff de WhatsApp ya está en un punto razonable para activación asistida en Growth.'
          : handoff.handoffStatus === 'needs_publish_copy'
            ? 'El bridge hacia Growth ya existe, pero todavía conviene ajustar copy y secuencia.'
            : 'Todavía hay bloqueos que hacen prematura la activación asistida en Growth.',
      sequencePayload: {
        opener: handoff.payload.opener,
        qualification: handoff.payload.qualification,
        objectionHandling: [...handoff.payload.objectionHandling],
        closingCta: handoff.payload.closingCta,
        fallbackEscalation: handoff.payload.fallbackEscalation,
      },
      activationChecklist: [...handoff.readinessChecks],
      bridgeArtifacts: [...handoff.bridgeArtifacts],
      handoffNotes: [...handoff.sequencingNotes],
      guardrails: [
        ...handoff.guardrails,
        'No activar este flow como automatización viva sin operator review en Growth.',
      ],
    };
  }
}
