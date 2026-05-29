import { TenantEcommerceProductEntityDetailView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityRepository } from '../ports/ecommerce-product-entity.repository';

export class GetTenantEcommerceProductEntityDetailUseCase {
  constructor(
    private readonly ecommerceProductEntityRepository: EcommerceProductEntityRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceProductEntityDetailView | null> {
    const productEntity =
      await this.ecommerceProductEntityRepository.findByTenantSlugAndId(
        tenantSlug,
        productEntityId,
      );

    if (!productEntity) {
      return null;
    }

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity,
      summary:
        productEntity.status === 'draft_catalog_product'
          ? 'La entidad ya puede tratarse como producto propio de Ecommerce, aunque todavia sin activacion final.'
          : productEntity.status === 'needs_channel_assets'
            ? 'La entidad ya existe, pero todavia conviene cerrar assets de canal antes de tratarla como producto mas operable.'
            : 'La entidad sigue bloqueada por activacion antes de pasar a una etapa mas operativa.',
      nextActions:
        productEntity.status === 'draft_catalog_product'
          ? [
              'Preparar assets del canal principal para el primer release.',
              'Definir la siguiente capa de catalogo editable.',
            ]
          : [
              'Cerrar assets de canal y CTA antes de asumir operacion mas amplia.',
              'Mantener la entidad separada de checkout real por ahora.',
            ],
      blockedBy:
        productEntity.status === 'needs_activation'
          ? ['Ecommerce todavia requiere activacion antes del producto operativo.']
          : productEntity.status === 'needs_channel_assets'
            ? ['Todavia faltan assets de canal para avanzar con seguridad.']
            : [],
      guardrails: [
        'No tratar esta entidad como checkout ni inventario final todavia.',
        'Mantener la salida comercial separada de publicacion automatica por ahora.',
      ],
    };
  }
}
