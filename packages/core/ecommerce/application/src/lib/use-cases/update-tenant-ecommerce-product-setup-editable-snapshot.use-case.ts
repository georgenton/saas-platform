import { TenantEcommerceProductSetupDetailView } from '@saas-platform/ecommerce-domain';
import { EcommerceProductSetupRepository } from '../ports/ecommerce-product-setup.repository';
import { GetTenantEcommerceProductSetupDetailUseCase } from './get-tenant-ecommerce-product-setup-detail.use-case';

export class UpdateTenantEcommerceProductSetupEditableSnapshotUseCase {
  constructor(
    private readonly ecommerceProductSetupRepository: EcommerceProductSetupRepository,
    private readonly getTenantEcommerceProductSetupDetailUseCase: GetTenantEcommerceProductSetupDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productSetupId: string,
    patch: {
      title: string;
      pricingBand: string | null;
      offerAngle: string | null;
      primaryCta: string | null;
      channelSequence: string[];
    },
  ): Promise<TenantEcommerceProductSetupDetailView | null> {
    const currentSetup =
      await this.ecommerceProductSetupRepository.findByTenantSlugAndId(
        tenantSlug,
        productSetupId,
      );

    if (!currentSetup) {
      return null;
    }

    const updatedSetup =
      await this.ecommerceProductSetupRepository.updateEditableSnapshot(
        tenantSlug,
        productSetupId,
        {
          title: patch.title.trim(),
          pricingBand: this.normalizeNullableText(patch.pricingBand),
          offerAngle: this.normalizeNullableText(patch.offerAngle),
          primaryCta: this.normalizeNullableText(patch.primaryCta),
          channelSequence: patch.channelSequence
            .map((entry) => entry.trim())
            .filter((entry) => entry.length > 0),
        },
      );

    if (!updatedSetup) {
      return null;
    }

    return this.getTenantEcommerceProductSetupDetailUseCase.execute(
      tenantSlug,
      productSetupId,
    );
  }

  private normalizeNullableText(value: string | null): string | null {
    if (value === null) {
      return null;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }
}
