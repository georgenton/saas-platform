import { TenantEcommerceWhatsappGrowthHandoffView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceWhatsappSalesFlowUseCase } from './get-tenant-ecommerce-whatsapp-sales-flow.use-case';

export class RequestTenantEcommerceWhatsappGrowthHandoffUseCase {
  constructor(
    private readonly getTenantEcommerceWhatsappSalesFlowUseCase: GetTenantEcommerceWhatsappSalesFlowUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceWhatsappGrowthHandoffView | null> {
    const flow =
      await this.getTenantEcommerceWhatsappSalesFlowUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!flow) {
      return null;
    }

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: flow.productEntity,
      assetEntity: flow.assetEntity,
      handoffStatus:
        flow.flowStatus === 'ready_for_operator_flow'
          ? 'ready_for_growth_workbench'
          : flow.flowStatus === 'needs_publish_copy'
            ? 'needs_publish_copy'
            : 'blocked',
      targetWorkspace: {
        productKey: 'growth',
        channel: 'whatsapp',
        handoffMode: 'operator_assist',
      },
      payload: {
        opener: flow.stages.opener,
        qualification: flow.stages.qualification,
        objectionHandling: [...flow.stages.objectionHandling],
        closingCta: flow.stages.closingCta,
        fallbackEscalation: flow.stages.fallbackEscalation,
      },
      sequencingNotes: [
        ...flow.handoffNotes,
        'Growth recibe este handoff como workbench operado, no como automatización viva.',
      ],
      bridgeArtifacts: [
        'WhatsApp opener packet',
        'Qualification and objection flow',
        'Closing CTA handoff note',
      ],
      readinessChecks: [...flow.operatorChecklist],
      guardrails: [
        ...flow.guardrails,
        'No empujar este handoff como automatización viva de Growth todavía.',
      ],
    };
  }
}
