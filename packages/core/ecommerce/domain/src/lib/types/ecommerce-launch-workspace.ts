export interface TenantEcommerceLaunchWorkspaceChecklistItemView {
  key: string;
  label: string;
  isCore: boolean;
  status: 'ready' | 'warning' | 'blocked';
  detail: string;
}

export interface TenantEcommerceLaunchWorkspaceChannelGuidanceView {
  key: 'catalog' | 'landing' | 'campaign' | 'operations';
  title: string;
  status: 'ready' | 'warning' | 'blocked';
  detail: string;
  recommendedUse: string;
}

export interface TenantEcommerceLaunchWorkspaceHintView {
  key: string;
  title: string;
  objective: string;
  whenToUse: string;
  recommendedInputs: string[];
  caution: string;
}

export interface TenantEcommerceLaunchPlanView {
  id: string;
  title: string;
  status: 'ready' | 'warning' | 'blocked';
  guardedExecutionReadiness:
    | 'shadow_review_ready'
    | 'needs_activation'
    | 'needs_core_modules';
  scopeSummary: string;
  selectedChannels: Array<'catalog' | 'landing' | 'campaign'>;
  nextStep: string;
}

export interface TenantEcommerceLaunchWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    launchReadiness: 'launch_ready' | 'needs_activation' | 'needs_core_modules';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  moduleSnapshot: {
    productEnabled: boolean;
    activeModuleCount: number;
    coreModuleCount: number;
    optionalModuleCount: number;
    inactiveModuleKeys: string[];
  };
  checklist: TenantEcommerceLaunchWorkspaceChecklistItemView[];
  channelGuidance: TenantEcommerceLaunchWorkspaceChannelGuidanceView[];
  launchPlans: TenantEcommerceLaunchPlanView[];
  launchHints: TenantEcommerceLaunchWorkspaceHintView[];
  safeActions: string[];
  blockedActions: string[];
}

export interface TenantEcommerceLaunchPlanDetailView {
  tenantSlug: string;
  generatedAt: Date;
  workspaceSummary: TenantEcommerceLaunchWorkspaceView['summary'];
  moduleSnapshot: TenantEcommerceLaunchWorkspaceView['moduleSnapshot'];
  checklist: TenantEcommerceLaunchWorkspaceView['checklist'];
  channelGuidance: TenantEcommerceLaunchWorkspaceView['channelGuidance'];
  launchHints: TenantEcommerceLaunchWorkspaceView['launchHints'];
  safeActions: string[];
  blockedActions: string[];
  plan: TenantEcommerceLaunchPlanView;
}

export interface TenantEcommerceLaunchPlanRegistryView {
  tenantSlug: string;
  generatedAt: Date;
  workspaceSummary: TenantEcommerceLaunchWorkspaceView['summary'];
  counts: {
    totalPlans: number;
    readyPlans: number;
    warningPlans: number;
    blockedPlans: number;
    shadowReviewReadyPlans: number;
    activationBlockedPlans: number;
    coreModuleBlockedPlans: number;
  };
  plans: TenantEcommerceLaunchPlanView[];
}

export interface TenantEcommerceLaunchPlanActivationReadinessView {
  tenantSlug: string;
  generatedAt: Date;
  plan: TenantEcommerceLaunchPlanView;
  activationStatus:
    | 'ready_for_shadow_review'
    | 'needs_activation'
    | 'needs_core_modules';
  summary: string;
  requiredActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceStoreSetupCapabilityView {
  key:
    | 'store_identity'
    | 'catalog_authoring'
    | 'landing_readiness'
    | 'invoicing_connection'
    | 'whatsapp_sales_flow';
  title: string;
  status: 'ready' | 'warning' | 'blocked';
  detail: string;
  nextStep: string;
}

export interface TenantEcommerceStoreSetupWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    setupReadiness:
      | 'ready_to_configure'
      | 'needs_activation'
      | 'needs_store_foundation';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  productSnapshot: {
    ecommerceEnabled: boolean;
    invoicingEnabled: boolean;
    enabledProductKeys: string[];
  };
  moduleSnapshot: TenantEcommerceLaunchWorkspaceView['moduleSnapshot'];
  capabilities: TenantEcommerceStoreSetupCapabilityView[];
  safeActions: string[];
  blockedActions: string[];
}

export interface TenantEcommerceStoreProfileWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
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

export interface TenantEcommerceProductAuthoringDraftView {
  id: string;
  title: string;
  productType: 'core_offer' | 'entry_offer' | 'upsell';
  status: 'draft' | 'blocked';
  rationale: string;
  suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
}

export interface TenantEcommerceSavedProductAuthoringDraftView {
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
  promotedToWorkspaceAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantEcommerceProductAuthoringWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
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
  drafts: TenantEcommerceProductAuthoringDraftView[];
  safeActions: string[];
  blockedActions: string[];
}

export interface TenantEcommerceProductAuthoringDraftDetailView {
  tenantSlug: string;
  generatedAt: Date;
  workspaceSummary: TenantEcommerceProductAuthoringWorkspaceView['summary'];
  draftCollection: TenantEcommerceProductAuthoringWorkspaceView['draftCollection'];
  readinessChecklist: TenantEcommerceProductAuthoringWorkspaceView['readinessChecklist'];
  safeActions: string[];
  blockedActions: string[];
  draft: TenantEcommerceProductAuthoringDraftView;
  savedDraft: TenantEcommerceSavedProductAuthoringDraftView | null;
}

export interface TenantEcommerceProductAuthoringDraftBriefRequestView {
  tenantSlug: string;
  generatedAt: Date;
  draft: TenantEcommerceProductAuthoringDraftView;
  briefingStatus:
    | 'ready_for_ai_brief'
    | 'needs_commercial_connections'
    | 'needs_activation';
  summary: string;
  requiredInputs: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductAuthoringDraftRefinementPacketView {
  tenantSlug: string;
  generatedAt: Date;
  draft: TenantEcommerceProductAuthoringDraftView;
  refinementStatus:
    | 'ready_for_refinement'
    | 'needs_commercial_connections'
    | 'needs_activation';
  summary: string;
  pricingBand: string;
  offerAngle: string;
  primaryCta: string;
  channelSequence: string[];
  guardrails: string[];
}

export interface TenantEcommerceSavedProductAuthoringDraftSaveView {
  tenantSlug: string;
  generatedAt: Date;
  summary: string;
  savedDraft: TenantEcommerceSavedProductAuthoringDraftView;
}

export interface TenantEcommerceSavedProductAuthoringDraftRegistryView {
  tenantSlug: string;
  generatedAt: Date;
  summary: {
    totalSavedDrafts: number;
    readyForRefinementCount: number;
    needsCommercialConnectionsCount: number;
    needsActivationCount: number;
    headline: string;
    detail: string;
  };
  drafts: TenantEcommerceSavedProductAuthoringDraftView[];
}

export interface TenantEcommerceProductWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  savedDraftId: string;
  promotedAt: Date;
  status:
    | 'ready_for_copy_edit'
    | 'needs_commercial_connections'
    | 'needs_activation';
  headline: string;
  detail: string;
  editableSnapshot: {
    title: string;
    pricingBand: string | null;
    offerAngle: string | null;
    primaryCta: string | null;
    suggestedChannels: Array<'catalog' | 'landing' | 'whatsapp'>;
    channelSequence: string[];
  };
  guardrails: string[];
  nextActions: string[];
}

export interface TenantEcommerceProductWorkspaceRegistryView {
  tenantSlug: string;
  generatedAt: Date;
  summary: {
    totalProductWorkspaces: number;
    readyForCopyEditCount: number;
    needsCommercialConnectionsCount: number;
    needsActivationCount: number;
    headline: string;
    detail: string;
  };
  workspaces: TenantEcommerceProductWorkspaceView[];
}

export interface TenantEcommerceProductWorkspaceDetailView {
  tenantSlug: string;
  generatedAt: Date;
  workspace: TenantEcommerceProductWorkspaceView;
  sourceDraftId: string;
  readiness: {
    briefingStatus:
      | 'ready_for_ai_brief'
      | 'needs_commercial_connections'
      | 'needs_activation'
      | null;
    refinementStatus:
      | 'ready_for_refinement'
      | 'needs_commercial_connections'
      | 'needs_activation'
      | null;
    lastSavedAt: Date;
  };
}

export interface TenantEcommerceProductWorkspaceReadinessPacketView {
  tenantSlug: string;
  generatedAt: Date;
  workspace: TenantEcommerceProductWorkspaceView;
  readinessStatus:
    | 'ready_for_product_setup'
    | 'needs_commercial_connections'
    | 'needs_activation';
  summary: string;
  requiredDecisions: string[];
  blockedBy: string[];
  recommendedArtifacts: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductSetupView {
  tenantSlug: string;
  generatedAt: Date;
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
  promotedFromWorkspaceAt: Date;
}

export interface TenantEcommerceProductSetupRegistryView {
  tenantSlug: string;
  generatedAt: Date;
  summary: {
    totalProductSetups: number;
    draftSetupCount: number;
    needsCommercialConnectionsCount: number;
    needsActivationCount: number;
    headline: string;
    detail: string;
  };
  productSetups: TenantEcommerceProductSetupView[];
}

export interface TenantEcommerceProductSetupDetailView {
  tenantSlug: string;
  generatedAt: Date;
  productSetup: TenantEcommerceProductSetupView;
  summary: string;
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductSetupDefinitionPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productSetup: TenantEcommerceProductSetupView;
  definitionStatus:
    | 'ready_for_product_definition'
    | 'needs_commercial_connections'
    | 'needs_activation';
  summary: string;
  requiredDecisions: string[];
  blockedBy: string[];
  recommendedArtifacts: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductEntityView {
  tenantSlug: string;
  generatedAt: Date;
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
  promotedFromSetupAt: Date;
}

export interface TenantEcommerceProductEntityRegistryView {
  tenantSlug: string;
  generatedAt: Date;
  summary: {
    totalProductEntities: number;
    draftCatalogProductCount: number;
    needsChannelAssetsCount: number;
    needsActivationCount: number;
    headline: string;
    detail: string;
  };
  productEntities: TenantEcommerceProductEntityView[];
}

export interface TenantEcommerceProductEntityDetailView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: string;
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductEntityCommercializationPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  commercializationStatus:
    | 'ready_for_channel_rollout'
    | 'needs_channel_assets'
    | 'needs_activation';
  summary: string;
  requiredDecisions: string[];
  blockedBy: string[];
  recommendedArtifacts: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductEntityChannelAssetsWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  workspaceStatus:
    | 'ready_to_draft_assets'
    | 'needs_channel_assets'
    | 'needs_activation';
  summary: string;
  channels: {
    landing: {
      status: 'ready_to_draft' | 'needs_core_copy' | 'blocked';
      headline: string;
      recommendedAssets: string[];
    };
    catalog: {
      status: 'ready_to_draft' | 'needs_core_copy' | 'blocked';
      headline: string;
      recommendedAssets: string[];
    };
    whatsapp: {
      status: 'ready_to_draft' | 'needs_core_copy' | 'blocked';
      headline: string;
      recommendedAssets: string[];
    };
  };
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductEntityChannelAssetDraftsWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  workspaceStatus:
    | 'ready_to_prepare_drafts'
    | 'needs_channel_assets'
    | 'needs_activation';
  summary: string;
  drafts: {
    landing: {
      status: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
      headline: string;
      sections: string[];
      recommendedOwner: 'ecommerce' | 'growth' | 'shared';
    };
    catalog: {
      status: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
      headline: string;
      blocks: string[];
      recommendedOwner: 'ecommerce' | 'growth' | 'shared';
    };
    whatsapp: {
      status: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
      headline: string;
      sequence: string[];
      recommendedOwner: 'growth' | 'shared';
    };
  };
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export type TenantEcommerceProductEntityChannelDraftKey =
  | 'landing'
  | 'catalog'
  | 'whatsapp';

export interface TenantEcommerceProductEntityChannelDraftDetailView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  channelKey: TenantEcommerceProductEntityChannelDraftKey;
  draftStatus: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
  summary: string;
  headline: string;
  recommendedOwner: 'ecommerce' | 'growth' | 'shared';
  structure: string[];
  requiredInputs: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductEntityChannelDraftActionPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  channelKey: TenantEcommerceProductEntityChannelDraftKey;
  actionStatus: 'ready_to_prepare' | 'needs_core_copy' | 'blocked';
  summary: string;
  requiredInputs: string[];
  recommendedArtifacts: string[];
  nextStep: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductEntityChannelDraftPublishReadinessPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  channelKey: TenantEcommerceProductEntityChannelDraftKey;
  readinessStatus:
    | 'ready_for_publish_preparation'
    | 'needs_core_copy'
    | 'blocked';
  summary: string;
  requiredChecks: string[];
  recommendedArtifacts: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  channelKey: TenantEcommerceProductEntityChannelDraftKey;
  preparationStatus: 'ready_to_stage' | 'needs_core_copy' | 'blocked';
  summary: string;
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  draftBlueprint: string[];
  publishChecklist: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceSavedProductEntityChannelDraftView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  productEntityId: string;
  channelKey: TenantEcommerceProductEntityChannelDraftKey;
  status: 'saved_channel_draft';
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
  promotedToAssetWorkspaceAt: Date | null;
  promotedToAssetEntityAt: Date | null;
  promotedToReleaseCandidateAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantEcommerceSavedProductEntityChannelDraftSaveView {
  tenantSlug: string;
  generatedAt: Date;
  summary: string;
  savedChannelDraft: TenantEcommerceSavedProductEntityChannelDraftView;
}

export interface TenantEcommerceSavedProductEntityChannelDraftRegistryView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalSavedDrafts: number;
    readyToStageCount: number;
    needsCoreCopyCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  drafts: TenantEcommerceSavedProductEntityChannelDraftView[];
}

export interface TenantEcommerceSavedProductEntityChannelDraftDetailView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  savedChannelDraft: TenantEcommerceSavedProductEntityChannelDraftView;
  summary: string;
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductEntityChannelAssetWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntityId: string;
  channelKey: TenantEcommerceProductEntityChannelDraftKey;
  promotedAt: Date;
  status: 'ready_for_asset_edit' | 'needs_core_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  headline: string;
  detail: string;
  editableSnapshot: {
    title: string;
    headline: string;
    draftBlueprint: string[];
    publishChecklist: string[];
    recommendedArtifacts: string[];
    nextMilestone: string;
  };
  guardrails: string[];
  nextActions: string[];
}

export interface TenantEcommerceProductEntityChannelAssetWorkspaceRegistryView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalWorkspaces: number;
    readyForAssetEditCount: number;
    needsCoreCopyCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  workspaces: TenantEcommerceProductEntityChannelAssetWorkspaceView[];
}

export interface TenantEcommerceProductEntityChannelAssetWorkspaceDetailView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  workspace: TenantEcommerceProductEntityChannelAssetWorkspaceView;
  sourceSavedChannelDraftId: string;
  blockedBy: string[];
}

export interface TenantEcommerceProductEntityChannelAssetPublishPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  channelKey: TenantEcommerceProductEntityChannelDraftKey;
  publishStatus: 'ready_for_staging' | 'needs_core_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  summary: string;
  requiredChecks: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductEntityChannelAssetEntityView {
  tenantSlug: string;
  generatedAt: Date;
  assetEntityId: string;
  productEntityId: string;
  sourceSavedChannelDraftId: string;
  channelKey: TenantEcommerceProductEntityChannelDraftKey;
  promotedAt: Date;
  status: 'draft_asset_entity' | 'needs_publish_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  title: string;
  headline: string;
  summary: string;
  draftBlueprint: string[];
  publishChecklist: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductEntityChannelAssetEntityRegistryView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalAssetEntities: number;
    draftAssetEntityCount: number;
    needsPublishCopyCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  assetEntities: TenantEcommerceProductEntityChannelAssetEntityView[];
}

export interface TenantEcommerceProductEntityChannelAssetEntityDetailView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
}

export interface TenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  channelKey: TenantEcommerceProductEntityChannelDraftKey;
  preparationStatus:
    | 'ready_for_release_candidate'
    | 'needs_publish_copy'
    | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  summary: string;
  requiredChecks: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductEntityChannelReleaseCandidateView {
  tenantSlug: string;
  generatedAt: Date;
  releaseCandidateId: string;
  productEntityId: string;
  sourceAssetEntityId: string;
  channelKey: TenantEcommerceProductEntityChannelDraftKey;
  promotedAt: Date;
  status: 'candidate_ready' | 'needs_publish_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  title: string;
  headline: string;
  summary: string;
  publishChecklist: string[];
  recommendedArtifacts: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceProductEntityChannelReleaseCandidateRegistryView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalCandidates: number;
    readyCount: number;
    needsPublishCopyCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  releaseCandidates: TenantEcommerceProductEntityChannelReleaseCandidateView[];
}

export interface TenantEcommerceProductEntityChannelReleaseCandidateDetailView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  releaseCandidate: TenantEcommerceProductEntityChannelReleaseCandidateView;
}
