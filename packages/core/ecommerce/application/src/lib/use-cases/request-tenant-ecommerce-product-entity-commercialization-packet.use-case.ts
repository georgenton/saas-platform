import { TenantEcommerceProductEntityCommercializationPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-detail.use-case';

export class RequestTenantEcommerceProductEntityCommercializationPacketUseCase {
  constructor(
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceProductEntityCommercializationPacketView | null> {
    const detail =
      await this.getTenantEcommerceProductEntityDetailUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!detail) {
      return null;
    }

    const commercializationStatus =
      detail.productEntity.status === 'needs_activation'
        ? 'needs_activation'
        : detail.productEntity.status === 'needs_channel_assets'
          ? 'needs_channel_assets'
          : 'ready_for_channel_rollout';

    return {
      tenantSlug: detail.tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: detail.productEntity,
      commercializationStatus,
      summary:
        commercializationStatus === 'ready_for_channel_rollout'
          ? 'La entidad ya tiene base suficiente para bajar a una primera salida comercial por canal.'
          : commercializationStatus === 'needs_channel_assets'
            ? 'La entidad ya existe, pero conviene cerrar assets de canal antes de tratarla como salida comercial mas operable.'
            : 'La entidad sigue bloqueada por activacion antes de pasar a una salida comercial real.',
      requiredDecisions:
        commercializationStatus === 'ready_for_channel_rollout'
          ? [
              'Elegir el canal dominante del primer rollout comercial.',
              'Congelar el CTA y la promesa principal del release inicial.',
              'Definir la secuencia de follow-up entre landing y WhatsApp.',
            ]
          : [
              'Cerrar assets de canal y secuencia comercial antes del rollout.',
              'Alinear el uso de landing, catalogo y WhatsApp con una sola narrativa.',
              'Confirmar que no hay dependencias abiertas con activation.',
            ],
      blockedBy:
        commercializationStatus === 'needs_activation'
          ? ['Ecommerce todavia no esta activado para abrir el rollout comercial de esta entidad.']
          : commercializationStatus === 'needs_channel_assets'
            ? ['Todavia faltan assets de canal para tratar esta entidad como salida comercial mas operable.']
            : [],
      recommendedArtifacts: [
        'Channel rollout brief',
        'Landing and CTA QA checklist',
        'WhatsApp follow-up sequence',
      ],
      guardrails: [
        ...detail.guardrails,
        'No convertir este packet en checkout real ni publicacion automatica todavia.',
      ],
    };
  }
}
