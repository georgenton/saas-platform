import {
  TenantEcommerceProductSetupDetailView,
  TenantEcommerceProductSetupRegistryView,
  TenantEcommerceProductSetupView,
} from '@saas-platform/ecommerce-domain';

export interface EcommerceProductSetupResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productSetupId: string;
  savedDraftId: string;
  sourceDraftId: string;
  status:
    | 'draft_setup'
    | 'needs_commercial_connections'
    | 'needs_activation';
  title: string;
  productType: 'core_offer' | 'entry_offer' | 'upsell';
  pricingBand: string | null;
  offerAngle: string | null;
  primaryCta: string | null;
  suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
  channelSequence: string[];
  promotedFromWorkspaceAt: string;
}

export interface EcommerceProductSetupRegistryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    totalProductSetups: number;
    draftSetupCount: number;
    needsCommercialConnectionsCount: number;
    needsActivationCount: number;
    headline: string;
    detail: string;
  };
  productSetups: EcommerceProductSetupResponseDto[];
}

export interface EcommerceProductSetupDetailResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productSetup: EcommerceProductSetupResponseDto;
  summary: string;
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export function toEcommerceProductSetupResponseDto(
  view: TenantEcommerceProductSetupView,
): EcommerceProductSetupResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
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
    promotedFromWorkspaceAt: view.promotedFromWorkspaceAt.toISOString(),
  };
}

export function toEcommerceProductSetupRegistryResponseDto(
  view: TenantEcommerceProductSetupRegistryView,
): EcommerceProductSetupRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    summary: { ...view.summary },
    productSetups: view.productSetups.map((entry) =>
      toEcommerceProductSetupResponseDto(entry),
    ),
  };
}

export function toEcommerceProductSetupDetailResponseDto(
  view: TenantEcommerceProductSetupDetailView,
): EcommerceProductSetupDetailResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productSetup: toEcommerceProductSetupResponseDto(view.productSetup),
    summary: view.summary,
    nextActions: [...view.nextActions],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}
