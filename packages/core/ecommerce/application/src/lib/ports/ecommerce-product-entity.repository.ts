import { TenantEcommerceProductEntityView } from '@saas-platform/ecommerce-domain';

export interface EcommerceProductEntityRepository {
  save(command: {
    id: string;
    tenantSlug: string;
    productSetupId: string;
    savedDraftId: string;
    sourceDraftId: string;
    title: string;
    productType: 'core_offer' | 'entry_offer' | 'upsell';
    status:
      | 'draft_catalog_product'
      | 'needs_channel_assets'
      | 'needs_activation';
    pricingBand: string | null;
    offerAngle: string | null;
    primaryCta: string | null;
    suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
    channelSequence: string[];
    promotedFromSetupAt: Date;
  }): Promise<TenantEcommerceProductEntityView>;
  listByTenantSlug(
    tenantSlug: string,
  ): Promise<TenantEcommerceProductEntityView[]>;
  findByTenantSlugAndId(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceProductEntityView | null>;
  findByTenantSlugAndProductSetupId(
    tenantSlug: string,
    productSetupId: string,
  ): Promise<TenantEcommerceProductEntityView | null>;
}
