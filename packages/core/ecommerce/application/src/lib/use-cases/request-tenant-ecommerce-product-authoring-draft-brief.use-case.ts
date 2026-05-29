import { TenantEcommerceProductAuthoringDraftBriefRequestView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductAuthoringDraftDetailUseCase } from './get-tenant-ecommerce-product-authoring-draft-detail.use-case';

export class RequestTenantEcommerceProductAuthoringDraftBriefUseCase {
  constructor(
    private readonly getTenantEcommerceProductAuthoringDraftDetailUseCase: GetTenantEcommerceProductAuthoringDraftDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    draftId: string,
  ): Promise<TenantEcommerceProductAuthoringDraftBriefRequestView> {
    const detail =
      await this.getTenantEcommerceProductAuthoringDraftDetailUseCase.execute(
        tenantSlug,
        draftId,
      );

    if (detail.workspaceSummary.authoringReadiness === 'needs_activation') {
      return {
        tenantSlug,
        generatedAt: this.nowProvider(),
        draft: {
          ...detail.draft,
          suggestedChannels: [...detail.draft.suggestedChannels],
        },
        briefingStatus: 'needs_activation',
        summary:
          'Primero hace falta activar Ecommerce antes de pedir un brief AI serio para este draft.',
        requiredInputs: ['Ecommerce activation'],
        guardrails: [
          'No convertir este draft en producto operativo mientras la tienda siga sin activacion.',
        ],
      };
    }

    if (detail.workspaceSummary.authoringReadiness === 'needs_store_profile') {
      return {
        tenantSlug,
        generatedAt: this.nowProvider(),
        draft: {
          ...detail.draft,
          suggestedChannels: [...detail.draft.suggestedChannels],
        },
        briefingStatus: 'needs_commercial_connections',
        summary:
          'El draft ya puede bajar a brief AI, pero conviene cerrarlo con conexiones comerciales pendientes todavia visibles.',
        requiredInputs: [
          'Propuesta de pricing inicial',
          'Primary benefit statement',
          'Operational owner for follow-up',
        ],
        guardrails: [
          'No asumir pricing final ni publicacion automatica.',
          'Mantener el brief alineado con la identidad y el canal primario del profile.',
        ],
      };
    }

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      draft: {
        ...detail.draft,
        suggestedChannels: [...detail.draft.suggestedChannels],
      },
      briefingStatus: 'ready_for_ai_brief',
      summary:
        'El draft ya tiene base suficiente para bajar un brief AI de producto y canal inicial.',
      requiredInputs: [
        'Primary promise',
        'Draft pricing band',
        'First CTA and conversion target',
      ],
      guardrails: [
        'No inventar SKUs o variantes persistidas.',
        'Mantener el primer brief dentro del starter set y sin publish automatico.',
      ],
    };
  }
}
