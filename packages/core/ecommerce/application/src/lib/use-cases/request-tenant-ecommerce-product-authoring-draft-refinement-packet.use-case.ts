import { TenantEcommerceProductAuthoringDraftRefinementPacketView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceProductAuthoringDraftDetailUseCase } from './get-tenant-ecommerce-product-authoring-draft-detail.use-case';

export class RequestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase {
  constructor(
    private readonly getTenantEcommerceProductAuthoringDraftDetailUseCase: GetTenantEcommerceProductAuthoringDraftDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    draftId: string,
  ): Promise<TenantEcommerceProductAuthoringDraftRefinementPacketView> {
    const detail =
      await this.getTenantEcommerceProductAuthoringDraftDetailUseCase.execute(
        tenantSlug,
        draftId,
      );

    const draft = {
      ...detail.draft,
      suggestedChannels: [...detail.draft.suggestedChannels],
    };

    if (detail.workspaceSummary.authoringReadiness === 'needs_activation') {
      return {
        tenantSlug,
        generatedAt: this.nowProvider(),
        draft,
        refinementStatus: 'needs_activation',
        summary:
          'Primero hace falta activar Ecommerce antes de refinar pricing, CTA y secuencia comercial de este draft.',
        pricingBand: 'Pendiente hasta activar Ecommerce',
        offerAngle: 'Todavia no conviene bajar el angulo comercial final.',
        primaryCta: 'Activa Ecommerce primero',
        channelSequence: ['activation'],
        guardrails: [
          'No refinar este draft como si ya existiera una tienda operativa.',
        ],
      };
    }

    const isBlockedByConnections =
      detail.workspaceSummary.authoringReadiness === 'needs_store_profile';
    const refinementStatus = isBlockedByConnections
      ? 'needs_commercial_connections'
      : 'ready_for_refinement';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      draft,
      refinementStatus,
      summary: isBlockedByConnections
        ? 'El draft ya puede refinarse, pero conviene mantener visibles las conexiones comerciales pendientes mientras bajas pricing y CTA.'
        : 'El draft ya tiene base suficiente para bajar pricing, CTA y secuencia comercial inicial.',
      pricingBand: this.resolvePricingBand(detail.draft.productType),
      offerAngle: this.resolveOfferAngle(detail.draft.productType),
      primaryCta: this.resolvePrimaryCta(detail.draft.productType),
      channelSequence: this.resolveChannelSequence(detail.draft.suggestedChannels),
      guardrails: [
        'No convertir esta refinacion en pricing definitivo persistido.',
        'Mantener el refinement packet dentro del starter set y sin publicacion automatica.',
      ],
    };
  }

  private resolvePricingBand(
    productType: 'core_offer' | 'entry_offer' | 'upsell',
  ): string {
    switch (productType) {
      case 'core_offer':
        return 'Mid-ticket anchor band';
      case 'entry_offer':
        return 'Low-friction entry band';
      case 'upsell':
        return 'Expansion band after first conversion';
    }
  }

  private resolveOfferAngle(
    productType: 'core_offer' | 'entry_offer' | 'upsell',
  ): string {
    switch (productType) {
      case 'core_offer':
        return 'Oferta principal con promesa clara y beneficio central inmediato.';
      case 'entry_offer':
        return 'Entrada simple que reduzca friccion y ayude a iniciar la relacion comercial.';
      case 'upsell':
        return 'Siguiente paso natural para ampliar valor o ticket sin complicar la compra.';
    }
  }

  private resolvePrimaryCta(
    productType: 'core_offer' | 'entry_offer' | 'upsell',
  ): string {
    switch (productType) {
      case 'core_offer':
        return 'Explorar oferta principal';
      case 'entry_offer':
        return 'Empezar con esta opcion';
      case 'upsell':
        return 'Agregar mejora recomendada';
    }
  }

  private resolveChannelSequence(
    channels: Array<'catalog' | 'landing' | 'whatsapp'>,
  ): string[] {
    return channels.map((entry) => {
      switch (entry) {
        case 'catalog':
          return 'Catalog anchor';
        case 'landing':
          return 'Landing conversion step';
        case 'whatsapp':
          return 'WhatsApp follow-up step';
      }
    });
  }
}
