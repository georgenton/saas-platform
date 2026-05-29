import { randomUUID } from 'node:crypto';
import { TenantEcommerceProductEntityView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductEntityRepository } from '../ports/ecommerce-product-entity.repository';
import { EcommerceProductSetupRepository } from '../ports/ecommerce-product-setup.repository';

export class PromoteTenantEcommerceProductSetupToProductEntityUseCase {
  constructor(
    private readonly ecommerceProductSetupRepository: EcommerceProductSetupRepository,
    private readonly ecommerceProductEntityRepository: EcommerceProductEntityRepository,
    private readonly nowProvider: () => Date = () => new Date(),
    private readonly idProvider: () => string = () => randomUUID(),
  ) {}

  async execute(
    tenantSlug: string,
    productSetupId: string,
  ): Promise<TenantEcommerceProductEntityView | null> {
    const productSetup =
      await this.ecommerceProductSetupRepository.findByTenantSlugAndId(
        tenantSlug,
        productSetupId,
      );

    if (!productSetup) {
      return null;
    }

    const status =
      productSetup.status === 'needs_activation'
        ? 'needs_activation'
        : productSetup.status === 'needs_commercial_connections'
          ? 'needs_channel_assets'
          : 'draft_catalog_product';

    return this.ecommerceProductEntityRepository.save({
      id: this.idProvider(),
      tenantSlug: productSetup.tenantSlug,
      productSetupId: productSetup.productSetupId,
      savedDraftId: productSetup.savedDraftId,
      sourceDraftId: productSetup.sourceDraftId,
      title: productSetup.title,
      productType: productSetup.productType,
      status,
      pricingBand: productSetup.pricingBand,
      offerAngle: productSetup.offerAngle,
      primaryCta: productSetup.primaryCta,
      suggestedChannels: [...productSetup.suggestedChannels],
      channelSequence: [...productSetup.channelSequence],
      promotedFromSetupAt: this.nowProvider(),
    });
  }
}
