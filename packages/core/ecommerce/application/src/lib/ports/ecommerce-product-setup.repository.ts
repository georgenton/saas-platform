import { TenantEcommerceProductSetupView } from '@saas-platform/ecommerce-domain';

export interface EcommerceProductSetupRepository {
  save(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    savedDraftId: string;
    sourceDraftId: string;
    title: string;
    productType: 'core_offer' | 'entry_offer' | 'upsell';
    status:
      | 'draft_setup'
      | 'needs_commercial_connections'
      | 'needs_activation';
    pricingBand: string | null;
    offerAngle: string | null;
    primaryCta: string | null;
    suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
    channelSequence: string[];
    promotedFromWorkspaceAt: Date;
  }): Promise<TenantEcommerceProductSetupView>;
  listByTenantSlug(
    tenantSlug: string,
  ): Promise<TenantEcommerceProductSetupView[]>;
  findByTenantSlugAndId(
    tenantSlug: string,
    productSetupId: string,
  ): Promise<TenantEcommerceProductSetupView | null>;
  findByTenantSlugAndSavedDraftId(
    tenantSlug: string,
    savedDraftId: string,
  ): Promise<TenantEcommerceProductSetupView | null>;
  updateEditableSnapshot(
    tenantSlug: string,
    productSetupId: string,
    patch: {
      title: string;
      pricingBand: string | null;
      offerAngle: string | null;
      primaryCta: string | null;
      channelSequence: string[];
    },
  ): Promise<TenantEcommerceProductSetupView | null>;
}
