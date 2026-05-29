import { TenantEcommerceSavedProductAuthoringDraftView } from '@saas-platform/ecommerce-domain';

export interface EcommerceProductDraftRepository {
  save(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    sourceDraftId: string;
    title: string;
    productType: 'core_offer' | 'entry_offer' | 'upsell';
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
  }): Promise<TenantEcommerceSavedProductAuthoringDraftView>;
  findByTenantSlugAndSourceDraftId(
    tenantSlug: string,
    sourceDraftId: string,
  ): Promise<TenantEcommerceSavedProductAuthoringDraftView | null>;
  listByTenantSlug(
    tenantSlug: string,
  ): Promise<TenantEcommerceSavedProductAuthoringDraftView[]>;
  findByTenantSlugAndId(
    tenantSlug: string,
    savedDraftId: string,
  ): Promise<TenantEcommerceSavedProductAuthoringDraftView | null>;
  markPromotedToWorkspace(
    tenantSlug: string,
    savedDraftId: string,
    promotedAt: Date,
  ): Promise<TenantEcommerceSavedProductAuthoringDraftView | null>;
  updateEditableSnapshot(
    tenantSlug: string,
    savedDraftId: string,
    patch: {
      title: string;
      pricingBand: string | null;
      offerAngle: string | null;
      primaryCta: string | null;
      channelSequence: string[];
    },
  ): Promise<TenantEcommerceSavedProductAuthoringDraftView | null>;
}
