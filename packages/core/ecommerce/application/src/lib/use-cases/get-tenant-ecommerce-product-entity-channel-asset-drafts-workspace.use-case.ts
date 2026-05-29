import { TenantEcommerceProductEntityChannelAssetDraftsWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase } from './get-tenant-ecommerce-product-entity-channel-assets-workspace.use-case';

export class GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase: GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceProductEntityChannelAssetDraftsWorkspaceView | null> {
    const channelAssetsWorkspace =
      await this.getTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!channelAssetsWorkspace) {
      return null;
    }

    const workspaceStatus =
      channelAssetsWorkspace.workspaceStatus === 'needs_activation'
        ? 'needs_activation'
        : channelAssetsWorkspace.workspaceStatus === 'needs_channel_assets'
          ? 'needs_channel_assets'
          : 'ready_to_prepare_drafts';

    const draftStatus =
      workspaceStatus === 'needs_activation'
        ? 'blocked'
        : workspaceStatus === 'needs_channel_assets'
          ? 'needs_core_copy'
          : 'ready_to_prepare';

    return {
      tenantSlug: channelAssetsWorkspace.tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: channelAssetsWorkspace.productEntity,
      workspaceStatus,
      summary:
        workspaceStatus === 'ready_to_prepare_drafts'
          ? 'La entidad ya puede bajar a drafts iniciales por canal con una narrativa comercial consistente.'
          : workspaceStatus === 'needs_channel_assets'
            ? 'Todavia conviene cerrar narrativa y assets base antes de abrir drafts operativos por canal.'
            : 'La entidad sigue bloqueada por activacion antes de abrir drafts por canal.',
      drafts: {
        landing: {
          status: draftStatus,
          headline:
            workspaceStatus === 'ready_to_prepare_drafts'
              ? 'La landing ya puede bajar a un draft con hero, CTA y prueba social.'
              : workspaceStatus === 'needs_channel_assets'
                ? 'Todavia falta cerrar promesa y CTA antes de abrir el draft de landing.'
                : 'La landing sigue bloqueada hasta resolver activacion.',
          sections: [
            'Hero promise',
            'Primary CTA band',
            'Trust proof strip',
            'Offer breakdown',
          ],
          recommendedOwner: 'shared',
        },
        catalog: {
          status: draftStatus,
          headline:
            workspaceStatus === 'ready_to_prepare_drafts'
              ? 'El catalogo ya puede bajar a una ficha draft con pricing y framing comercial.'
              : workspaceStatus === 'needs_channel_assets'
                ? 'Todavia falta cerrar framing y pricing antes de abrir el draft de catálogo.'
                : 'El catalogo sigue bloqueado hasta resolver activacion.',
          blocks: [
            'Product title',
            'Pricing snapshot',
            'Short conversion copy',
            'Primary CTA label',
          ],
          recommendedOwner: 'ecommerce',
        },
        whatsapp: {
          status: draftStatus,
          headline:
            workspaceStatus === 'ready_to_prepare_drafts'
              ? 'WhatsApp ya puede bajar a una secuencia draft de apertura, seguimiento y cierre.'
              : workspaceStatus === 'needs_channel_assets'
                ? 'Todavia falta cerrar narrativa y recovery CTA antes de abrir la secuencia draft de WhatsApp.'
                : 'WhatsApp sigue bloqueado hasta resolver activacion.',
          sequence: [
            'Opening message',
            'Follow-up branch',
            'Recovery CTA',
          ],
          recommendedOwner: 'growth',
        },
      },
      nextActions:
        workspaceStatus === 'ready_to_prepare_drafts'
          ? [
              'Abrir drafts concretos por canal respetando una sola promesa comercial.',
              'Mantener estos drafts como preparación operativa, no como publicación final.',
            ]
          : [
              'Cerrar promesa, CTA y framing antes de abrir drafts comerciales.',
              'Mantener estos drafts como preparación operativa, no como publicación final.',
            ],
      blockedBy:
        workspaceStatus === 'needs_activation'
          ? ['Ecommerce todavia no esta activado para abrir drafts comerciales por canal.']
          : workspaceStatus === 'needs_channel_assets'
            ? ['Todavia faltan assets base de canal para abrir drafts operativos consistentes.']
            : [],
      guardrails: [
        ...channelAssetsWorkspace.guardrails,
        'No tratar estos drafts como publicación real ni como flujo vivo todavia.',
      ],
    };
  }
}
