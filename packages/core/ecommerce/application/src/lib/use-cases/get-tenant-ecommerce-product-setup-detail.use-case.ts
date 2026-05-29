import { TenantEcommerceProductSetupDetailView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductSetupRepository } from '../ports/ecommerce-product-setup.repository';

export class GetTenantEcommerceProductSetupDetailUseCase {
  constructor(
    private readonly ecommerceProductSetupRepository: EcommerceProductSetupRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productSetupId: string,
  ): Promise<TenantEcommerceProductSetupDetailView | null> {
    const productSetup =
      await this.ecommerceProductSetupRepository.findByTenantSlugAndId(
        tenantSlug,
        productSetupId,
      );

    if (!productSetup) {
      return null;
    }

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productSetup,
      summary:
        productSetup.status === 'draft_setup'
          ? 'El setup ya esta listo para bajar a definicion de producto mas estable dentro de Ecommerce.'
          : productSetup.status === 'needs_commercial_connections'
            ? 'El setup ya existe, pero todavia conviene cerrar conexiones comerciales antes de tratarlo como producto operativo.'
            : 'El setup sigue bloqueado por activacion antes de pasar a una etapa mas operativa.',
      nextActions:
        productSetup.status === 'draft_setup'
          ? [
              'Definir atributos comerciales persistidos del producto.',
              'Preparar la siguiente capa de catalogo editable.',
            ]
          : [
              'Cerrar pricing y CTA antes de abrir un producto mas operativo.',
              'Mantener la configuracion en modo seguro, sin publicacion final.',
            ],
      blockedBy:
        productSetup.status === 'needs_activation'
          ? ['Ecommerce todavia requiere activacion antes del setup operativo.']
          : productSetup.status === 'needs_commercial_connections'
            ? ['Todavia faltan conexiones comerciales para avanzar con seguridad.']
            : [],
      guardrails: [
        'No tratar este setup como publicacion final ni como catalogo expuesto.',
        'Mantener la preparacion comercial separada de inventario y checkout por ahora.',
      ],
    };
  }
}
