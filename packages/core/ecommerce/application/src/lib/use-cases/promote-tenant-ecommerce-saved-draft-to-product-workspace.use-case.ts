import {
  TenantEcommerceProductWorkspaceView,
  TenantEcommerceSavedProductAuthoringDraftView,
} from '@saas-platform/ecommerce-domain';
import { EcommerceProductDraftRepository } from '../ports/ecommerce-product-draft.repository';

export class PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase {
  constructor(
    private readonly ecommerceProductDraftRepository: EcommerceProductDraftRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    savedDraftId: string,
  ): Promise<TenantEcommerceProductWorkspaceView | null> {
    const promotedAt = this.nowProvider();
    const savedDraft =
      await this.ecommerceProductDraftRepository.markPromotedToWorkspace(
        tenantSlug,
        savedDraftId,
        promotedAt,
      );

    if (!savedDraft) {
      return null;
    }

    return this.toWorkspace(savedDraft, promotedAt);
  }

  toWorkspace(
    savedDraft: TenantEcommerceSavedProductAuthoringDraftView,
    generatedAt: Date,
  ): TenantEcommerceProductWorkspaceView {
    const status =
      savedDraft.refinementStatus === 'needs_activation' ||
      savedDraft.briefingStatus === 'needs_activation'
        ? 'needs_activation'
        : savedDraft.refinementStatus === 'needs_commercial_connections' ||
            savedDraft.briefingStatus === 'needs_commercial_connections'
          ? 'needs_commercial_connections'
          : 'ready_for_copy_edit';

    return {
      tenantSlug: savedDraft.tenantSlug,
      generatedAt,
      savedDraftId: savedDraft.id,
      promotedAt: savedDraft.promotedToWorkspaceAt ?? generatedAt,
      status,
      headline:
        status === 'needs_activation'
          ? 'El candidate ya vive como product workspace, pero Ecommerce todavia necesita activacion antes de tratarlo como authoring operativo.'
          : status === 'needs_commercial_connections'
            ? 'El candidate ya vive como product workspace y puede editarse, manteniendo visibles las conexiones comerciales pendientes.'
            : 'El candidate ya vive como product workspace y esta listo para copy edit, CTA y siguientes decisiones comerciales.',
      detail:
        status === 'ready_for_copy_edit'
          ? 'Usa este workspace para seguir editando promesa, CTA, pricing band y secuencia comercial antes de pensar en publicacion o catalogo real.'
          : 'Este workspace ya fija ownership sobre el candidate, pero sigue bloqueando cualquier salto a publicacion final o pricing definitivo.',
      editableSnapshot: {
        title: savedDraft.title,
        pricingBand: savedDraft.pricingBand,
        offerAngle: savedDraft.offerAngle,
        primaryCta: savedDraft.primaryCta,
        suggestedChannels: [...savedDraft.suggestedChannels],
        channelSequence: [...savedDraft.channelSequence],
      },
      guardrails: [
        ...savedDraft.briefGuardrails,
        ...savedDraft.refinementGuardrails,
      ],
      nextActions:
        status === 'needs_activation'
          ? [
              'Activa Ecommerce como base operativa antes de tratar este workspace como authoring real.',
              'Mantén el candidate en edición segura sin publicarlo.',
            ]
          : status === 'needs_commercial_connections'
            ? [
                'Cierra conexiones comerciales pendientes antes de convertir este workspace en producto operativo.',
                'Sigue afinando CTA y pricing band sin asumir publicación ni SKU final.',
              ]
            : [
                'Edita copy y CTA principal con contexto del canal.',
                'Prepara el siguiente paso hacia producto editable persistido.',
              ],
    };
  }
}
