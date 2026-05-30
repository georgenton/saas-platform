import { TenantEcommerceWhatsappSalesFlowView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase } from './get-tenant-ecommerce-whatsapp-channel-sequence-workspace.use-case';

export class GetTenantEcommerceWhatsappSalesFlowUseCase {
  constructor(
    private readonly getTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase: GetTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceWhatsappSalesFlowView | null> {
    const workspace =
      await this.getTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase.execute(
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
      flowStatus:
        workspace.workspaceStatus === 'ready_for_sequence_assembly'
          ? 'ready_for_operator_flow'
          : workspace.workspaceStatus === 'needs_publish_copy'
            ? 'needs_publish_copy'
            : 'blocked',
      stages: {
        opener: workspace.opener,
        qualification: workspace.followUpSequence[1] ?? workspace.opener,
        objectionHandling: [...workspace.recoveryBranch],
        closingCta: workspace.closeCta,
        fallbackEscalation:
          'Si la conversación se enfría, pasar a revisión humana antes de insistir.',
      },
      operatorChecklist: [...workspace.operatorNotes],
      handoffNotes: [
        'Growth valida tono, timing y cierre antes de automatizar cualquier secuencia.',
        'Mantener la secuencia como asistencia operada, no como flujo vivo automático todavía.',
      ],
      guardrails: [
        ...workspace.guardrails,
        'No tratar este flujo como automatización viva de WhatsApp todavía.',
      ],
    };
  }
}
