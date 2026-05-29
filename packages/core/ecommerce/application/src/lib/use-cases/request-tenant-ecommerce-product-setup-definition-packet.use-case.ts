import { TenantEcommerceProductSetupDefinitionPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductSetupDetailUseCase } from './get-tenant-ecommerce-product-setup-detail.use-case';

export class RequestTenantEcommerceProductSetupDefinitionPacketUseCase {
  constructor(
    private readonly getTenantEcommerceProductSetupDetailUseCase: GetTenantEcommerceProductSetupDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productSetupId: string,
  ): Promise<TenantEcommerceProductSetupDefinitionPacketView | null> {
    const detail =
      await this.getTenantEcommerceProductSetupDetailUseCase.execute(
        tenantSlug,
        productSetupId,
      );

    if (!detail) {
      return null;
    }

    const definitionStatus =
      detail.productSetup.status === 'needs_activation'
        ? 'needs_activation'
        : detail.productSetup.status === 'needs_commercial_connections'
          ? 'needs_commercial_connections'
          : 'ready_for_product_definition';

    return {
      tenantSlug: detail.tenantSlug,
      generatedAt: this.nowProvider(),
      productSetup: detail.productSetup,
      definitionStatus,
      summary:
        definitionStatus === 'ready_for_product_definition'
          ? 'El product setup ya tiene una base suficiente para bajar a una definicion comercial mas estable dentro del catalogo.'
          : definitionStatus === 'needs_commercial_connections'
            ? 'El product setup ya existe, pero conviene cerrar algunas definiciones comerciales antes de tratarlo como producto mas operativo.'
            : 'El product setup sigue bloqueado por activacion antes de pasar a una definicion mas operable.',
      requiredDecisions:
        definitionStatus === 'ready_for_product_definition'
          ? [
              'Congelar el posicionamiento comercial del primer release.',
              'Confirmar la combinacion de pricing band y CTA principal.',
              'Elegir la secuencia de canal dominante del producto.',
            ]
          : [
              'Cerrar pricing y CTA con una postura comercial mas estable.',
              'Alinear ownership entre Ecommerce, Growth e Invoicing.',
              'Definir que artefactos se vuelven obligatorios antes de abrir catalogo mas operativo.',
            ],
      blockedBy:
        definitionStatus === 'needs_activation'
          ? [
              'Ecommerce todavia no esta activado como base operativa completa para este product setup.',
            ]
          : definitionStatus === 'needs_commercial_connections'
            ? [
                'Todavia faltan conexiones comerciales antes de tratar este setup como producto mas operativo.',
              ]
            : [],
      recommendedArtifacts: [
        'Product definition note',
        'Commercial promise and CTA confirmation',
        'Channel rollout outline',
      ],
      guardrails: [
        ...detail.guardrails,
        'No convertir este packet en publicacion final, inventario ni checkout real todavia.',
      ],
    };
  }
}
