import {
  TenantEcommerceProductAuthoringDraftDetailView,
  TenantEcommerceProductAuthoringDraftView,
  TenantEcommerceSavedProductAuthoringDraftView,
} from '@saas-platform/ecommerce-domain';

export interface EcommerceProductAuthoringDraftResponseDto {
  id: string;
  title: string;
  productType: 'core_offer' | 'entry_offer' | 'upsell';
  status: 'draft' | 'blocked';
  rationale: string;
  suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
}

export interface EcommerceProductAuthoringDraftDetailResponseDto {
  tenantSlug: string;
  generatedAt: string;
  workspaceSummary: {
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
    key:
      | 'store_profile'
      | 'catalog_foundation'
      | 'invoicing_connection'
      | 'growth_handoff';
    title: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
  }>;
  safeActions: string[];
  blockedActions: string[];
  draft: EcommerceProductAuthoringDraftResponseDto;
  savedDraft: EcommerceSavedProductAuthoringDraftResponseDto | null;
}

export interface EcommerceSavedProductAuthoringDraftResponseDto {
  id: string;
  tenantId: string;
  tenantSlug: string;
  sourceDraftId: string;
  title: string;
  productType: 'core_offer' | 'entry_offer' | 'upsell';
  status: 'saved_draft';
  rationale: string;
  suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
  briefingStatus:
    | 'ready_for_ai_brief'
    | 'needs_commercial_connections'
    | 'needs_activation'
    | null;
  briefSummary: string | null;
  briefRequiredInputs: string[];
  briefGuardrails: string[];
  refinementStatus:
    | 'ready_for_refinement'
    | 'needs_commercial_connections'
    | 'needs_activation'
    | null;
  refinementSummary: string | null;
  pricingBand: string | null;
  offerAngle: string | null;
  primaryCta: string | null;
  channelSequence: string[];
  refinementGuardrails: string[];
  promotedToWorkspaceAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toEcommerceProductAuthoringDraftDetailResponseDto(
  view: TenantEcommerceProductAuthoringDraftDetailView,
): EcommerceProductAuthoringDraftDetailResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    workspaceSummary: {
      ...view.workspaceSummary,
    },
    draftCollection: {
      ...view.draftCollection,
    },
    readinessChecklist: view.readinessChecklist.map((entry) => ({ ...entry })),
    safeActions: [...view.safeActions],
    blockedActions: [...view.blockedActions],
    draft: toEcommerceProductAuthoringDraftResponseDto(view.draft),
    savedDraft: view.savedDraft
      ? toEcommerceSavedProductAuthoringDraftResponseDto(view.savedDraft)
      : null,
  };
}

export function toEcommerceProductAuthoringDraftResponseDto(
  view: TenantEcommerceProductAuthoringDraftView,
): EcommerceProductAuthoringDraftResponseDto {
  return {
    ...view,
    suggestedChannels: [...view.suggestedChannels],
  };
}

export function toEcommerceSavedProductAuthoringDraftResponseDto(
  view: TenantEcommerceSavedProductAuthoringDraftView,
): EcommerceSavedProductAuthoringDraftResponseDto {
  return {
    ...view,
    suggestedChannels: [...view.suggestedChannels],
    briefRequiredInputs: [...view.briefRequiredInputs],
    briefGuardrails: [...view.briefGuardrails],
    channelSequence: [...view.channelSequence],
    refinementGuardrails: [...view.refinementGuardrails],
    promotedToWorkspaceAt: view.promotedToWorkspaceAt
      ? view.promotedToWorkspaceAt.toISOString()
      : null,
    createdAt: view.createdAt.toISOString(),
    updatedAt: view.updatedAt.toISOString(),
  };
}
