import { TenantEcommerceProductAuthoringWorkspaceView } from '@saas-platform/ecommerce-domain';

export interface EcommerceProductAuthoringWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    authoringReadiness:
      | 'starter_set_ready'
      | 'needs_activation'
      | 'needs_store_profile';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  draftCollection: {
    profileStoreName: string;
    collectionLabel: string;
    primaryChannel: 'catalog' | 'landing' | 'whatsapp';
    draftCount: number;
  };
  readinessChecklist: Array<{
    key: 'store_profile' | 'catalog_foundation' | 'invoicing_connection' | 'growth_handoff';
    title: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
  }>;
  drafts: Array<{
    id: string;
    title: string;
    productType: 'core_offer' | 'entry_offer' | 'upsell';
    status: 'draft' | 'blocked';
    rationale: string;
    suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
  }>;
  safeActions: string[];
  blockedActions: string[];
}

export function toEcommerceProductAuthoringWorkspaceResponseDto(
  view: TenantEcommerceProductAuthoringWorkspaceView,
): EcommerceProductAuthoringWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    summary: {
      ...view.summary,
    },
    draftCollection: {
      ...view.draftCollection,
    },
    readinessChecklist: view.readinessChecklist.map((entry) => ({ ...entry })),
    drafts: view.drafts.map((entry) => ({
      ...entry,
      suggestedChannels: [...entry.suggestedChannels],
    })),
    safeActions: [...view.safeActions],
    blockedActions: [...view.blockedActions],
  };
}
