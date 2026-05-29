import { TenantEcommerceSavedProductEntityChannelDraftDetailView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityChannelDraftRepository } from '../ports/ecommerce-product-entity-channel-draft.repository';
import { GetTenantEcommerceProductEntityDetailUseCase } from './get-tenant-ecommerce-product-entity-detail.use-case';

export class GetTenantEcommerceSavedProductEntityChannelDraftDetailUseCase {
  constructor(
    private readonly ecommerceProductEntityChannelDraftRepository: EcommerceProductEntityChannelDraftRepository,
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftDetailView | null> {
    const [productEntityDetail, savedChannelDraft] = await Promise.all([
      this.getTenantEcommerceProductEntityDetailUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.ecommerceProductEntityChannelDraftRepository.findByTenantSlugAndProductEntityIdAndChannelKey(
        tenantSlug,
        productEntityId,
        channelKey,
      ),
    ]);

    if (!productEntityDetail || !savedChannelDraft) {
      return null;
    }

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: productEntityDetail.productEntity,
      savedChannelDraft,
      summary:
        savedChannelDraft.preparationStatus === 'ready_to_stage'
          ? 'El channel draft ya quedó persistido como asset candidate y puede seguir a staging controlado.'
          : savedChannelDraft.preparationStatus === 'needs_core_copy'
            ? 'El channel draft ya quedó persistido, pero todavía conviene cerrar copy base antes de empujarlo a staging más real.'
            : 'El channel draft quedó persistido con bloqueos explícitos antes de abrir una preparación más operable.',
      nextActions:
        savedChannelDraft.preparationStatus === 'ready_to_stage'
          ? [
              'Preparar staging controlado del asset antes de abrir publicación más real.',
              'Validar el checklist del canal con una sola narrativa comercial.',
            ]
          : [
              'Cerrar copy base y blueprint antes de empujar este asset a staging más real.',
              'Mantener el draft separado de publicación viva por ahora.',
            ],
      blockedBy: [...savedChannelDraft.blockedBy],
      guardrails: [...savedChannelDraft.guardrails],
    };
  }
}
