import { TenantEcommerceProductWorkspaceReadinessPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductWorkspaceDetailUseCase } from './get-tenant-ecommerce-product-workspace-detail.use-case';

export class RequestTenantEcommerceProductWorkspaceReadinessPacketUseCase {
  constructor(
    private readonly getTenantEcommerceProductWorkspaceDetailUseCase: GetTenantEcommerceProductWorkspaceDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    savedDraftId: string,
  ): Promise<TenantEcommerceProductWorkspaceReadinessPacketView | null> {
    const detail =
      await this.getTenantEcommerceProductWorkspaceDetailUseCase.execute(
        tenantSlug,
        savedDraftId,
      );

    if (!detail) {
      return null;
    }

    const readinessStatus =
      detail.workspace.status === 'needs_activation'
        ? 'needs_activation'
        : detail.workspace.status === 'needs_commercial_connections'
          ? 'needs_commercial_connections'
          : 'ready_for_product_setup';

    return {
      tenantSlug: detail.tenantSlug,
      generatedAt: this.nowProvider(),
      workspace: detail.workspace,
      readinessStatus,
      summary:
        readinessStatus === 'ready_for_product_setup'
          ? 'El workspace ya tiene una base suficiente para pasar al siguiente escalon de producto editable persistido.'
          : readinessStatus === 'needs_commercial_connections'
            ? 'El workspace ya puede seguir afinandose, pero conviene cerrar algunas decisiones comerciales antes de tratarlo como producto operativo.'
            : 'El workspace sigue bloqueado por activacion de Ecommerce antes de bajar a producto editable real.',
      requiredDecisions:
        readinessStatus === 'ready_for_product_setup'
          ? [
              'Confirmar la banda de pricing operativa del producto.',
              'Congelar el CTA principal del primer release.',
              'Elegir el canal de entrada dominante del producto.',
            ]
          : [
              'Cerrar pricing band y CTA con una postura comercial consistente.',
              'Acordar la secuencia de canal antes de abrir setup de producto.',
              'Validar ownership operativo entre Ecommerce, Growth e Invoicing.',
            ],
      blockedBy:
        readinessStatus === 'needs_activation'
          ? [
              'Ecommerce todavia no esta activado como base operativa completa.',
            ]
          : readinessStatus === 'needs_commercial_connections'
            ? [
                'Todavia faltan conexiones comerciales para tratar este workspace como producto real.',
              ]
            : [],
      recommendedArtifacts: [
        'Product positioning note',
        'CTA and pricing confirmation',
        'Cross-channel follow-up sequence',
      ],
      guardrails: [
        ...detail.workspace.guardrails,
        'No convertir este packet en publicacion automatica ni en SKU final todavia.',
      ],
    };
  }
}
