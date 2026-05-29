import {
  TenantEcommerceProductEntityDetailView,
  TenantEcommerceProductEntityRegistryView,
  TenantEcommerceProductEntityView,
} from '@saas-platform/ecommerce-domain';

export interface EcommerceProductEntityResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntityId: string;
  productSetupId: string;
  savedDraftId: string;
  sourceDraftId: string;
  status:
    | 'draft_catalog_product'
    | 'needs_channel_assets'
    | 'needs_activation';
  title: string;
  productType: 'core_offer' | 'entry_offer' | 'upsell';
  pricingBand: string | null;
  offerAngle: string | null;
  primaryCta: string | null;
  suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
  channelSequence: string[];
  promotedFromSetupAt: string;
}

export interface EcommerceProductEntityRegistryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    totalProductEntities: number;
    draftCatalogProductCount: number;
    needsChannelAssetsCount: number;
    needsActivationCount: number;
    headline: string;
    detail: string;
  };
  productEntities: EcommerceProductEntityResponseDto[];
}

export interface EcommerceProductEntityDetailResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  summary: string;
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export function toEcommerceProductEntityResponseDto(
  view: TenantEcommerceProductEntityView,
): EcommerceProductEntityResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntityId: view.productEntityId,
    productSetupId: view.productSetupId,
    savedDraftId: view.savedDraftId,
    sourceDraftId: view.sourceDraftId,
    status: view.status,
    title: view.title,
    productType: view.productType,
    pricingBand: view.pricingBand,
    offerAngle: view.offerAngle,
    primaryCta: view.primaryCta,
    suggestedChannels: [...view.suggestedChannels],
    channelSequence: [...view.channelSequence],
    promotedFromSetupAt: view.promotedFromSetupAt.toISOString(),
  };
}

export function toEcommerceProductEntityRegistryResponseDto(
  view: TenantEcommerceProductEntityRegistryView,
): EcommerceProductEntityRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    summary: { ...view.summary },
    productEntities: view.productEntities.map((entry) =>
      toEcommerceProductEntityResponseDto(entry),
    ),
  };
}

export function toEcommerceProductEntityDetailResponseDto(
  view: TenantEcommerceProductEntityDetailView,
): EcommerceProductEntityDetailResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: view.summary,
    nextActions: [...view.nextActions],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}
