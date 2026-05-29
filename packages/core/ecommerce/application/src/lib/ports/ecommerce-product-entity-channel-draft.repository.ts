import { TenantEcommerceSavedProductEntityChannelDraftView } from '@saas-platform/ecommerce-domain';

export interface EcommerceProductEntityChannelDraftRepository {
  save(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    productEntityId: string;
    channelKey: 'landing' | 'catalog' | 'whatsapp';
    preparationStatus: 'ready_to_stage' | 'needs_core_copy' | 'blocked';
    handoffOwner: 'ecommerce' | 'growth' | 'shared';
    title: string;
    summary: string;
    headline: string;
    draftBlueprint: string[];
    publishChecklist: string[];
    recommendedArtifacts: string[];
    nextMilestone: string;
    blockedBy: string[];
    guardrails: string[];
  }): Promise<TenantEcommerceSavedProductEntityChannelDraftView>;
  listByTenantSlugAndProductEntityId(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftView[]>;
  findByTenantSlugAndProductEntityIdAndChannelKey(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftView | null>;
  markPromotedToAssetWorkspace(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
    promotedAt: Date,
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftView | null>;
  markPromotedToAssetEntity(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
    promotedAt: Date,
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftView | null>;
  updateEditableSnapshot(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
    patch: {
      title: string;
      headline: string;
      draftBlueprint: string[];
      recommendedArtifacts: string[];
      nextMilestone: string;
    },
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftView | null>;
  markPromotedToReleaseCandidate(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
    promotedAt: Date,
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftView | null>;
}
