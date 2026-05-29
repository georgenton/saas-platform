import {
  TenantEcommerceProductEntityChannelDraftDetailView,
  TenantEcommerceProductEntityChannelDraftKey,
} from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase } from './get-tenant-ecommerce-product-entity-channel-asset-drafts-workspace.use-case';

function isChannelDraftKey(
  value: string,
): value is TenantEcommerceProductEntityChannelDraftKey {
  return value === 'landing' || value === 'catalog' || value === 'whatsapp';
}

export class GetTenantEcommerceProductEntityChannelDraftDetailUseCase {
  constructor(
    private readonly getTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase: GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: string,
  ): Promise<TenantEcommerceProductEntityChannelDraftDetailView | null> {
    if (!isChannelDraftKey(channelKey)) {
      return null;
    }

    const workspace =
      await this.getTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
      );

    if (!workspace) {
      return null;
    }

    const structure =
      channelKey === 'landing'
        ? [...workspace.drafts.landing.sections]
        : channelKey === 'catalog'
          ? [...workspace.drafts.catalog.blocks]
          : [...workspace.drafts.whatsapp.sequence];
    const headline =
      channelKey === 'landing'
        ? workspace.drafts.landing.headline
        : channelKey === 'catalog'
          ? workspace.drafts.catalog.headline
          : workspace.drafts.whatsapp.headline;
    const draftStatus =
      channelKey === 'landing'
        ? workspace.drafts.landing.status
        : channelKey === 'catalog'
          ? workspace.drafts.catalog.status
          : workspace.drafts.whatsapp.status;
    const recommendedOwner =
      channelKey === 'landing'
        ? workspace.drafts.landing.recommendedOwner
        : channelKey === 'catalog'
          ? workspace.drafts.catalog.recommendedOwner
          : workspace.drafts.whatsapp.recommendedOwner;

    return {
      tenantSlug: workspace.tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: workspace.productEntity,
      channelKey,
      draftStatus,
      summary:
        draftStatus === 'ready_to_prepare'
          ? `El draft de ${channelKey} ya puede prepararse como asset operativo inicial.`
          : draftStatus === 'needs_core_copy'
            ? `Todavia conviene cerrar copy base antes de abrir el draft de ${channelKey}.`
            : `El draft de ${channelKey} sigue bloqueado hasta resolver activacion.`,
      headline,
      recommendedOwner,
      structure,
      requiredInputs:
        channelKey === 'landing'
          ? ['Hero promise', 'Primary CTA', 'Trust proof']
          : channelKey === 'catalog'
            ? ['Product title', 'Pricing snapshot', 'Short conversion copy']
            : ['Opening message', 'Follow-up branch', 'Recovery CTA'],
      blockedBy: [...workspace.blockedBy],
      guardrails: [...workspace.guardrails],
    };
  }
}
