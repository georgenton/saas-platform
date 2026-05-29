import { TenantEcommerceStoreProfileWorkspaceView } from '@saas-platform/ecommerce-domain';

export interface EcommerceStoreProfileWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    profileReadiness:
      | 'draft_ready'
      | 'needs_activation'
      | 'needs_commercial_connections';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  identityDraft: {
    storeName: string;
    storefrontSlug: string;
    launchNarrative: string;
    primaryChannel: 'catalog' | 'landing' | 'whatsapp';
  };
  connections: Array<{
    key: 'ecommerce' | 'invoicing' | 'growth' | 'ai_assistant';
    title: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
  }>;
  recommendedAssets: string[];
  safeActions: string[];
  blockedActions: string[];
}

export function toEcommerceStoreProfileWorkspaceResponseDto(
  view: TenantEcommerceStoreProfileWorkspaceView,
): EcommerceStoreProfileWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    summary: {
      ...view.summary,
    },
    identityDraft: {
      ...view.identityDraft,
    },
    connections: view.connections.map((entry) => ({ ...entry })),
    recommendedAssets: [...view.recommendedAssets],
    safeActions: [...view.safeActions],
    blockedActions: [...view.blockedActions],
  };
}
