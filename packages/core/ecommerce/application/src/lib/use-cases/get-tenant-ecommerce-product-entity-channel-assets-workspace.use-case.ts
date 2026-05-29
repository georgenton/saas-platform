import { TenantEcommerceProductEntityChannelAssetsWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-detail.use-case';

export class GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceProductEntityChannelAssetsWorkspaceView | null> {
    const detail =
      await this.getTenantEcommerceProductEntityDetailUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!detail) {
      return null;
    }

    const workspaceStatus =
      detail.productEntity.status === 'needs_activation'
        ? 'needs_activation'
        : detail.productEntity.status === 'needs_channel_assets'
          ? 'needs_channel_assets'
          : 'ready_to_draft_assets';

    const channelStatus =
      workspaceStatus === 'needs_activation'
        ? 'blocked'
        : workspaceStatus === 'needs_channel_assets'
          ? 'needs_core_copy'
          : 'ready_to_draft';

    return {
      tenantSlug: detail.tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: detail.productEntity,
      workspaceStatus,
      summary:
        workspaceStatus === 'ready_to_draft_assets'
          ? 'La entidad ya puede bajar a drafts operativos de landing, catalogo y WhatsApp.'
          : workspaceStatus === 'needs_channel_assets'
            ? 'La entidad ya existe, pero todavia conviene cerrar narrativa y assets base antes de abrir drafts por canal.'
            : 'La entidad sigue bloqueada por activacion antes de abrir assets operativos por canal.',
      channels: {
        landing: {
          status: channelStatus,
          headline:
            workspaceStatus === 'ready_to_draft_assets'
              ? 'La landing ya puede bajar a un draft comercial inicial.'
              : workspaceStatus === 'needs_channel_assets'
                ? 'Todavia falta cerrar promesa principal y CTA para aterrizar la landing.'
                : 'La landing sigue bloqueada hasta resolver activacion.',
          recommendedAssets: [
            'Hero headline',
            'Primary CTA block',
            'Trust proof section',
          ],
        },
        catalog: {
          status: channelStatus,
          headline:
            workspaceStatus === 'ready_to_draft_assets'
              ? 'El catalogo ya puede bajar a una ficha inicial del producto.'
              : workspaceStatus === 'needs_channel_assets'
                ? 'Todavia falta cerrar oferta y framing para abrir la ficha de catálogo.'
                : 'El catalogo sigue bloqueado hasta resolver activacion.',
          recommendedAssets: [
            'Catalog title',
            'Pricing snapshot',
            'Short conversion copy',
          ],
        },
        whatsapp: {
          status: channelStatus,
          headline:
            workspaceStatus === 'ready_to_draft_assets'
              ? 'WhatsApp ya puede bajar a una secuencia inicial de venta.'
              : workspaceStatus === 'needs_channel_assets'
                ? 'Todavia falta cerrar narrativa y CTA para abrir la secuencia de WhatsApp.'
                : 'WhatsApp sigue bloqueado hasta resolver activacion.',
          recommendedAssets: [
            'Opening message',
            'Follow-up branch',
            'Recovery CTA',
          ],
        },
      },
      nextActions:
        workspaceStatus === 'ready_to_draft_assets'
          ? [
              'Abrir drafts concretos por canal manteniendo una sola narrativa comercial.',
              'Usar estos assets como preparación operativa, no como publicación final.',
            ]
          : [
              'Cerrar promesa, CTA y secuencia base antes de abrir drafts por canal.',
              'Mantener los assets como preparación operativa, no como publicación final.',
            ],
      blockedBy:
        workspaceStatus === 'needs_activation'
          ? ['Ecommerce todavia no esta activado para abrir assets operativos por canal.']
          : workspaceStatus === 'needs_channel_assets'
            ? ['Todavia faltan assets base de canal para abrir drafts comerciales consistentes.']
            : [],
      guardrails: [
        ...detail.guardrails,
        'No tratar este workspace como publicación final ni como flujo vivo de WhatsApp todavia.',
      ],
    };
  }
}
