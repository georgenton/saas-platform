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
    key:
      | 'store_profile'
      | 'catalog_foundation'
      | 'invoicing_connection'
      | 'growth_handoff';
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
  status: 'draft_setup' | 'needs_commercial_connections' | 'needs_activation';
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
  status: 'draft_catalog_product' | 'needs_channel_assets' | 'needs_activation';
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

export interface TenantEcommerceLandingAssetEntityWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  workspaceStatus:
    | 'ready_for_landing_assembly'
    | 'needs_publish_copy'
    | 'blocked';
  hero: {
    headline: string;
    subheadline: string;
    primaryCta: string;
  };
  proofBlocks: string[];
  offerSections: string[];
  publishChecklist: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceCatalogAssetEntityWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  workspaceStatus:
    | 'ready_for_catalog_assembly'
    | 'needs_publish_copy'
    | 'blocked';
  merchandisingCard: {
    title: string;
    pricingSnapshot: string;
    primaryCta: string;
  };
  offerBullets: string[];
  merchandisingChecks: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceCatalogCommercialCardView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  commercialStatus:
    | 'ready_for_storefront_card'
    | 'needs_publish_copy'
    | 'blocked';
  card: {
    title: string;
    shortDescription: string;
    pricingPresentation: string;
    primaryCta: string;
  };
  offerBullets: string[];
  storefrontSummary: string;
  merchandisingHighlights: string[];
  guardrails: string[];
}

export interface TenantEcommerceWhatsappChannelSequenceWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  workspaceStatus:
    | 'ready_for_sequence_assembly'
    | 'needs_publish_copy'
    | 'blocked';
  opener: string;
  followUpSequence: string[];
  recoveryBranch: string[];
  closeCta: string;
  operatorNotes: string[];
  nextMilestone: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceChannelReleaseWorkbenchView {
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
  channels: Array<{
    channelKey: TenantEcommerceProductEntityChannelDraftKey;
    status: 'candidate_ready' | 'needs_publish_copy' | 'blocked' | 'missing';
    handoffOwner: 'ecommerce' | 'growth' | 'shared';
    title: string;
    nextMilestone: string;
    blockedBy: string[];
  }>;
  qaChecklist: string[];
  finalArtifacts: string[];
  guardrails: string[];
}

export interface TenantEcommerceChannelReleaseExecutionReadinessView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  overallStatus:
    | 'ready_for_controlled_release'
    | 'needs_channel_completion'
    | 'blocked';
  summary: string;
  channels: Array<{
    channelKey: 'landing' | 'catalog' | 'whatsapp';
    releaseStatus:
      | 'candidate_ready'
      | 'needs_publish_copy'
      | 'blocked'
      | 'missing';
    executionOwner: 'ecommerce' | 'growth' | 'shared';
    executionChecklist: string[];
    launchWindow: string;
    blockedBy: string[];
  }>;
  finalChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceChannelReleaseHandoffPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  handoffStatus: 'ready_for_handoff' | 'needs_channel_completion' | 'blocked';
  summary: string;
  ownerModel: {
    primaryOwner: 'ecommerce' | 'growth' | 'shared';
    escalationOwner: 'growth' | 'shared';
    releaseMode: 'controlled_release';
  };
  channels: Array<{
    channelKey: 'landing' | 'catalog' | 'whatsapp';
    readiness: 'candidate_ready' | 'needs_publish_copy' | 'blocked' | 'missing';
    handoffOwner: 'ecommerce' | 'growth' | 'shared';
    blockerType: 'none' | 'warning' | 'blocker';
    minimumArtifacts: string[];
    nextMilestone: string;
  }>;
  handoffChecklist: string[];
  warnings: string[];
  blockers: string[];
  guardrails: string[];
}

export interface TenantEcommerceChannelReleaseApprovalPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  approvalStatus:
    | 'ready_for_operator_approval'
    | 'needs_channel_completion'
    | 'blocked';
  summary: string;
  approvalOwner: 'ecommerce' | 'growth' | 'shared';
  channels: Array<{
    channelKey: 'landing' | 'catalog' | 'whatsapp';
    readiness: 'candidate_ready' | 'needs_publish_copy' | 'blocked' | 'missing';
    approvalDecision: 'approve' | 'review' | 'block';
    rationale: string;
  }>;
  requiredApprovals: string[];
  warnings: string[];
  blockers: string[];
  guardrails: string[];
}

export interface TenantEcommerceStorefrontPreviewWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  previewStatus: 'ready_for_preview_review' | 'needs_publish_copy' | 'blocked';
  summary: {
    headline: string;
    detail: string;
  };
  landingPreview: {
    headline: string;
    subheadline: string;
    primaryCta: string;
    proofStrip: string[];
  };
  catalogPreview: {
    title: string;
    shortDescription: string;
    pricingPresentation: string;
    primaryCta: string;
    offerBullets: string[];
  };
  releaseSignals: Array<{
    channelKey: 'landing' | 'catalog' | 'whatsapp';
    status: 'candidate_ready' | 'needs_publish_copy' | 'blocked' | 'missing';
    detail: string;
  }>;
  previewChecklist: string[];
  guardrails: string[];
}

export interface TenantEcommerceWhatsappGrowthActivationWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  activationStatus:
    | 'ready_for_growth_activation'
    | 'needs_publish_copy'
    | 'blocked';
  targetWorkspace: {
    productKey: 'growth';
    channel: 'whatsapp';
    activationMode: 'operator_assist';
  };
  activationSummary: string;
  sequencePayload: {
    opener: string;
    qualification: string;
    objectionHandling: string[];
    closingCta: string;
    fallbackEscalation: string;
  };
  activationChecklist: string[];
  bridgeArtifacts: string[];
  handoffNotes: string[];
  guardrails: string[];
}

export interface TenantEcommerceStorefrontPublishReviewWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  reviewStatus:
    | 'ready_for_publish_review'
    | 'needs_operator_revision'
    | 'blocked';
  summary: {
    headline: string;
    detail: string;
  };
  previewSnapshot: TenantEcommerceStorefrontPreviewWorkspaceView;
  approvalSnapshot: {
    approvalStatus:
      | 'ready_for_operator_approval'
      | 'needs_channel_completion'
      | 'blocked';
    approvalOwner: 'ecommerce' | 'growth' | 'shared';
    channelDecisions: Array<{
      channelKey: 'landing' | 'catalog' | 'whatsapp';
      approvalDecision: 'approve' | 'review' | 'block';
      rationale: string;
    }>;
  };
  reviewChecklist: string[];
  blockers: string[];
  guardrails: string[];
}

export interface TenantEcommerceChannelReleaseLaunchPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  launchStatus:
    | 'ready_for_controlled_launch'
    | 'needs_operator_revision'
    | 'blocked';
  summary: string;
  launchOwner: 'ecommerce' | 'growth' | 'shared';
  channels: Array<{
    channelKey: 'landing' | 'catalog' | 'whatsapp';
    launchDecision: 'launch' | 'review' | 'hold';
    launchStep: string;
    fallbackStep: string;
  }>;
  launchChecklist: string[];
  warnings: string[];
  blockers: string[];
  guardrails: string[];
}

export interface TenantEcommerceWhatsappGrowthActivationPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  packetStatus:
    | 'ready_for_growth_operator_activation'
    | 'needs_operator_revision'
    | 'blocked';
  activationTarget: {
    productKey: 'growth';
    channel: 'whatsapp';
    activationMode: 'operator_assist';
  };
  activationSummary: string;
  messagePack: {
    opener: string;
    qualification: string;
    objectionHandling: string[];
    closingCta: string;
    fallbackEscalation: string;
  };
  activationChecklist: string[];
  bridgeArtifacts: string[];
  operatorSteps: string[];
  guardrails: string[];
}

export interface TenantEcommerceLandingPublishArtifactView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  artifactStatus:
    | 'ready_for_release_candidate'
    | 'needs_operator_revision'
    | 'blocked';
  summary: {
    headline: string;
    detail: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    primaryCta: string;
  };
  proofStrip: string[];
  offerStack: Array<{
    title: string;
    detail: string;
  }>;
  ctaBand: {
    primaryCta: string;
    supportLabel: string;
  };
  faqSeed: string[];
  finalChecklist: string[];
  blockers: string[];
  guardrails: string[];
}

export interface TenantEcommerceCatalogListingAssetView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  listingStatus:
    | 'ready_for_storefront_listing'
    | 'needs_operator_revision'
    | 'blocked';
  card: {
    title: string;
    shortDescription: string;
    pricingPresentation: string;
    primaryCta: string;
  };
  offerBullets: string[];
  storefrontSummary: string;
  launchOwner: 'ecommerce' | 'growth' | 'shared';
  placementNotes: string[];
  finalChecklist: string[];
  blockers: string[];
  guardrails: string[];
}

export interface TenantEcommerceWhatsappGrowthExecutionBridgeView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  bridgeStatus:
    | 'ready_for_growth_execution'
    | 'needs_operator_revision'
    | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'growth';
    channel: 'whatsapp';
    activationMode: 'operator_assist';
    handoffMode: 'operator_assist';
  };
  executionPayload: {
    opener: string;
    qualification: string;
    objectionHandling: string[];
    closingCta: string;
    fallbackEscalation: string;
  };
  operatorChecklist: string[];
  bridgeArtifacts: string[];
  nextSteps: string[];
  guardrails: string[];
}

export interface TenantEcommerceStorefrontReleaseCandidateBriefView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  briefStatus:
    | 'ready_for_storefront_release_candidate'
    | 'needs_operator_revision'
    | 'blocked';
  summary: {
    headline: string;
    detail: string;
  };
  landingArtifact: {
    title: string;
    artifactStatus:
      | 'ready_for_release_candidate'
      | 'needs_operator_revision'
      | 'blocked';
    primaryCta: string;
  };
  catalogListing: {
    title: string;
    listingStatus:
      | 'ready_for_storefront_listing'
      | 'needs_operator_revision'
      | 'blocked';
    pricingPresentation: string;
  };
  releaseSignals: Array<{
    channelKey: 'landing' | 'catalog' | 'whatsapp';
    status: 'ready' | 'warning' | 'blocked' | 'missing';
    detail: string;
  }>;
  finalChecklist: string[];
  blockers: string[];
  guardrails: string[];
}

export interface TenantEcommerceCatalogStorefrontPlacementPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  placementStatus:
    | 'ready_for_storefront_placement'
    | 'needs_operator_revision'
    | 'blocked';
  card: {
    title: string;
    shortDescription: string;
    pricingPresentation: string;
    primaryCta: string;
  };
  placementSummary: string;
  storefrontContext: {
    previewStatus:
      | 'ready_for_preview_review'
      | 'needs_publish_copy'
      | 'blocked';
    approvalStatus:
      | 'ready_for_operator_approval'
      | 'needs_channel_completion'
      | 'blocked';
  };
  placementNotes: string[];
  placementChecklist: string[];
  blockers: string[];
  guardrails: string[];
}

export interface TenantEcommerceWhatsappGrowthOperatorLaunchPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  launchStatus:
    | 'ready_for_growth_operator_launch'
    | 'needs_operator_revision'
    | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'growth';
    channel: 'whatsapp';
    activationMode: 'operator_assist';
    handoffMode: 'operator_assist';
  };
  executionPayload: {
    opener: string;
    qualification: string;
    objectionHandling: string[];
    closingCta: string;
    fallbackEscalation: string;
  };
  launchChecklist: string[];
  operatorSteps: string[];
  bridgeArtifacts: string[];
  blockers: string[];
  guardrails: string[];
}

export interface TenantEcommerceStorefrontReleaseControlWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  controlStatus:
    | 'ready_for_release_control'
    | 'needs_operator_revision'
    | 'blocked';
  summary: {
    headline: string;
    detail: string;
  };
  briefSnapshot: {
    briefStatus:
      | 'ready_for_storefront_release_candidate'
      | 'needs_operator_revision'
      | 'blocked';
    landingTitle: string;
    catalogTitle: string;
  };
  releaseControl: {
    reviewStatus:
      | 'ready_for_publish_review'
      | 'needs_operator_revision'
      | 'blocked';
    approvalOwner: 'ecommerce' | 'growth' | 'shared';
    launchOwner: 'ecommerce' | 'growth' | 'shared';
  };
  channelDecisions: Array<{
    channelKey: 'landing' | 'catalog' | 'whatsapp';
    launchDecision: 'launch' | 'review' | 'hold';
    launchStep: string;
  }>;
  controlChecklist: string[];
  blockers: string[];
  guardrails: string[];
}

export interface TenantEcommerceCatalogMerchandisingPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  merchandisingStatus:
    | 'ready_for_merchandising_review'
    | 'needs_operator_revision'
    | 'blocked';
  card: {
    title: string;
    shortDescription: string;
    pricingPresentation: string;
    primaryCta: string;
  };
  merchandisingSummary: string;
  placementContext: {
    commercialStatus:
      | 'ready_for_storefront_card'
      | 'needs_publish_copy'
      | 'blocked';
    placementStatus:
      | 'ready_for_storefront_placement'
      | 'needs_operator_revision'
      | 'blocked';
    launchDecision: 'launch' | 'review' | 'hold';
  };
  merchandisingNotes: string[];
  merchandisingChecklist: string[];
  blockers: string[];
  guardrails: string[];
}

export interface TenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  acknowledgementStatus:
    | 'ready_for_growth_launch_acknowledgement'
    | 'needs_operator_revision'
    | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'growth';
    channel: 'whatsapp';
    activationMode: 'operator_assist';
    handoffMode: 'operator_assist';
  };
  activationContext: {
    workspaceStatus:
      | 'ready_for_growth_activation'
      | 'needs_publish_copy'
      | 'blocked';
    packetStatus:
      | 'ready_for_growth_operator_activation'
      | 'needs_operator_revision'
      | 'blocked';
    launchStatus:
      | 'ready_for_growth_operator_launch'
      | 'needs_operator_revision'
      | 'blocked';
  };
  launchPayload: {
    opener: string;
    qualification: string;
    objectionHandling: string[];
    closingCta: string;
    fallbackEscalation: string;
  };
  acknowledgementChecklist: string[];
  operatorActions: string[];
  bridgeArtifacts: string[];
  blockers: string[];
  guardrails: string[];
}

export interface TenantEcommerceLandingPageStructureView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  structureStatus: 'ready_for_preview' | 'needs_publish_copy' | 'blocked';
  hero: {
    headline: string;
    subheadline: string;
    primaryCta: string;
  };
  proofStrip: string[];
  offerStack: Array<{
    title: string;
    detail: string;
  }>;
  ctaBand: {
    primaryCta: string;
    supportLabel: string;
  };
  faqSeed: string[];
  previewGuardrails: string[];
}

export interface TenantEcommerceWhatsappSalesFlowView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  flowStatus: 'ready_for_operator_flow' | 'needs_publish_copy' | 'blocked';
  stages: {
    opener: string;
    qualification: string;
    objectionHandling: string[];
    closingCta: string;
    fallbackEscalation: string;
  };
  operatorChecklist: string[];
  handoffNotes: string[];
  guardrails: string[];
}

export interface TenantEcommerceWhatsappGrowthHandoffView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  assetEntity: TenantEcommerceProductEntityChannelAssetEntityView;
  handoffStatus:
    | 'ready_for_growth_workbench'
    | 'needs_publish_copy'
    | 'blocked';
  targetWorkspace: {
    productKey: 'growth';
    channel: 'whatsapp';
    handoffMode: 'operator_assist';
  };
  payload: {
    opener: string;
    qualification: string;
    objectionHandling: string[];
    closingCta: string;
    fallbackEscalation: string;
  };
  sequencingNotes: string[];
  bridgeArtifacts: string[];
  readinessChecks: string[];
  guardrails: string[];
}

export interface TenantEcommerceCheckoutOrderIntakeWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  checkoutStatus:
    | 'ready_for_order_intake'
    | 'needs_storefront_alignment'
    | 'blocked';
  summary: string;
  checkoutDraft: {
    offerTitle: string;
    pricingSnapshot: string;
    primaryCta: string;
    customerPrompt: string;
    closingChannel: 'landing' | 'catalog' | 'whatsapp';
  };
  customerFields: string[];
  channelSignals: Array<{
    channelKey: 'landing' | 'catalog' | 'whatsapp';
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
  }>;
  invoicingConnection: {
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
    nextStep: string;
  };
  orderChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderInvoicingBridgeView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  bridgeStatus:
    | 'ready_for_invoice_handoff'
    | 'needs_customer_fiscal_data'
    | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'invoicing';
    stage: 'electronic_invoicing_ec_mvp';
    handoffMode: 'operator_assist';
  };
  orderDraft: TenantEcommerceCheckoutOrderIntakeWorkspaceView['checkoutDraft'];
  invoiceReadiness: {
    connectionStatus: 'ready' | 'warning' | 'blocked';
    buyerProfileStatus: 'ready' | 'needs_customer_fiscal_data' | 'blocked';
    suggestedDocument: 'invoice';
  };
  fiscalRequirements: string[];
  handoffArtifacts: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceStorefrontGoLiveManifestView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  manifestStatus:
    | 'ready_for_controlled_go_live'
    | 'needs_checkout_foundation'
    | 'blocked';
  summary: {
    headline: string;
    detail: string;
  };
  channelSnapshot: {
    landingStatus:
      | 'ready_for_release_control'
      | 'needs_operator_revision'
      | 'blocked';
    catalogStatus:
      | 'ready_for_merchandising_review'
      | 'needs_operator_revision'
      | 'blocked';
    whatsappStatus:
      | 'ready_for_growth_launch_acknowledgement'
      | 'needs_operator_revision'
      | 'blocked';
  };
  orderReadiness: {
    checkoutStatus:
      | 'ready_for_order_intake'
      | 'needs_storefront_alignment'
      | 'blocked';
    invoicingStatus:
      | 'ready_for_invoice_handoff'
      | 'needs_customer_fiscal_data'
      | 'blocked';
  };
  goLiveDependencies: Array<{
    key:
      | 'storefront_release_control'
      | 'catalog_merchandising'
      | 'whatsapp_growth_acknowledgement'
      | 'checkout_order_intake'
      | 'order_invoicing_bridge';
    title: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
  }>;
  finalChecklist: string[];
  operatorHandoff: {
    owner: 'ecommerce' | 'growth' | 'shared';
    goLiveMode: 'controlled_go_live';
    nextWindow: string;
  };
  warnings: string[];
  blockers: string[];
  guardrails: string[];
}

export interface TenantEcommerceLiveStorefrontSessionWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  sessionStatus: 'preview' | 'ready' | 'blocked';
  summary: {
    headline: string;
    detail: string;
  };
  storefrontSnapshot: {
    landingHeadline: string;
    landingSubheadline: string;
    primaryCta: string;
    catalogTitle: string;
    pricingPresentation: string;
    closeChannel: 'landing' | 'catalog' | 'whatsapp';
  };
  releaseGate: {
    goLiveStatus:
      | 'ready_for_controlled_go_live'
      | 'needs_checkout_foundation'
      | 'blocked';
    checkoutStatus:
      | 'ready_for_order_intake'
      | 'needs_storefront_alignment'
      | 'blocked';
    invoicingStatus:
      | 'ready_for_invoice_handoff'
      | 'needs_customer_fiscal_data'
      | 'blocked';
  };
  channelSessions: Array<{
    channelKey: 'landing' | 'catalog' | 'whatsapp';
    status: 'ready' | 'warning' | 'blocked';
    role: string;
    detail: string;
  }>;
  sessionChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceCheckoutCustomerCapturePacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  captureStatus: 'ready_for_order_draft' | 'needs_customer_input' | 'blocked';
  summary: string;
  orderDraftSeed: TenantEcommerceCheckoutOrderIntakeWorkspaceView['checkoutDraft'];
  captureForm: {
    requiredFields: string[];
    optionalFields: string[];
    validationRules: string[];
  };
  billingReadiness: {
    status: 'ready' | 'needs_customer_input' | 'blocked';
    hint: string;
  };
  operatorPrompts: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderToInvoiceReadinessPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  readinessStatus: 'ready_to_invoice' | 'needs_data' | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'invoicing';
    stage: 'electronic_invoicing_ec_mvp';
    handoffMode: 'operator_assist';
  };
  readinessSnapshot: {
    captureStatus: 'ready_for_order_draft' | 'needs_customer_input' | 'blocked';
    bridgeStatus:
      | 'ready_for_invoice_handoff'
      | 'needs_customer_fiscal_data'
      | 'blocked';
    buyerProfileStatus: 'ready' | 'needs_customer_fiscal_data' | 'blocked';
  };
  fiscalRequirements: string[];
  missingFields: string[];
  handoffArtifacts: string[];
  operatorChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderDraftView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  productEntityId: string;
  status: 'draft' | 'needs_data' | 'ready_for_review' | 'blocked';
  orderLabel: string;
  offerTitle: string;
  pricingSnapshot: string;
  primaryCta: string;
  closingChannel: 'landing' | 'catalog' | 'whatsapp';
  captureStatus: 'ready_for_order_draft' | 'needs_customer_input' | 'blocked';
  invoicingReadinessStatus: 'ready_to_invoice' | 'needs_data' | 'blocked';
  customerProfile: {
    fullName: string | null;
    email: string | null;
    whatsappPhone: string | null;
    billingIntent: string | null;
    buyerCompany: string | null;
    buyerTaxIdOrDocument: string | null;
  };
  requiredFields: string[];
  optionalFields: string[];
  operatorPrompts: string[];
  missingFields: string[];
  blockedBy: string[];
  guardrails: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantEcommerceOrderDraftSaveView {
  tenantSlug: string;
  generatedAt: Date;
  summary: string;
  orderDraft: TenantEcommerceOrderDraftView;
}

export type TenantEcommerceOrderOperationalEventType =
  | 'payment_reconciliation'
  | 'fulfillment_availability'
  | 'inventory_reservation'
  | 'returns_refunds_cancellation'
  | 'post_sale_closeout';

export interface TenantEcommerceOrderOperationalEventView {
  id: string;
  tenantId: string;
  tenantSlug: string;
  productEntityId: string;
  orderDraftId: string;
  eventType: TenantEcommerceOrderOperationalEventType;
  sourceWorkspace: string;
  status: string;
  summary: string;
  payload: Record<string, unknown>;
  occurredAt: Date;
  createdAt: Date;
}

export interface TenantEcommerceOrderCustomerProfileUpdateView {
  tenantSlug: string;
  generatedAt: Date;
  summary: string;
  orderDraft: TenantEcommerceOrderDraftView;
  readinessSnapshot: {
    buyerProfileStatus: 'ready' | 'needs_customer_fiscal_data' | 'blocked';
    missingFields: string[];
    handoffStatus:
      | 'ready_for_invoice_handoff'
      | 'needs_customer_fiscal_data'
      | 'blocked';
  };
  nextActions: string[];
}

export interface TenantEcommerceOrderDraftRegistryView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalOrderDrafts: number;
    draftCount: number;
    needsDataCount: number;
    readyForReviewCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  orderDrafts: TenantEcommerceOrderDraftView[];
}

export interface TenantEcommerceOrderDraftDetailView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  summary: string;
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceCheckoutCloseoutPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  closeoutStatus: 'ready_for_operator_closeout' | 'needs_data' | 'blocked';
  summary: string;
  commercialSnapshot: {
    offerTitle: string;
    pricingSnapshot: string;
    primaryCta: string;
    closingChannel: 'landing' | 'catalog' | 'whatsapp';
  };
  paymentReadiness: {
    status: 'ready' | 'needs_customer_input' | 'blocked';
    hint: string;
  };
  invoicingReadiness: {
    status: 'ready_to_invoice' | 'needs_data' | 'blocked';
    detail: string;
  };
  closeoutChecklist: string[];
  missingFields: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderToGrowthConversationBridgeView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  bridgeStatus:
    | 'ready_for_growth_follow_up'
    | 'needs_customer_confirmation'
    | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'growth';
    channel: 'whatsapp';
    handoffMode: 'operator_assist';
  };
  conversationSeed: {
    leadLabel: string;
    opener: string;
    closeCta: string;
    followUpChannel: 'landing' | 'catalog' | 'whatsapp';
  };
  handoffArtifacts: string[];
  followUpChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderReviewWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  reviewStatus: 'ready_for_operator_review' | 'needs_data' | 'blocked';
  summary: string;
  reviewSnapshot: {
    captureStatus: 'ready_for_order_draft' | 'needs_customer_input' | 'blocked';
    closeoutStatus: 'ready_for_operator_closeout' | 'needs_data' | 'blocked';
    invoiceReadinessStatus: 'ready_to_invoice' | 'needs_data' | 'blocked';
    growthBridgeStatus:
      | 'ready_for_growth_follow_up'
      | 'needs_customer_confirmation'
      | 'blocked';
  };
  reviewChecklist: string[];
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderInvoiceDraftBridgeView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  bridgeStatus: 'ready_to_open_invoice_draft' | 'needs_data' | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'invoicing';
    stage: 'electronic_invoicing_ec_mvp';
    handoffMode: 'operator_assist';
  };
  invoiceDraftSeed: {
    customerLabel: string;
    documentHint: 'invoice';
    offerTitle: string;
    pricingSnapshot: string;
    billingIntent: string | null;
  };
  requiredFields: string[];
  missingFields: string[];
  handoffArtifacts: string[];
  operatorChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderGrowthFollowUpWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  workspaceStatus:
    | 'ready_for_growth_follow_up'
    | 'needs_customer_confirmation'
    | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'growth';
    channel: 'whatsapp';
    handoffMode: 'operator_assist';
  };
  followUpPlan: {
    leadLabel: string;
    opener: string;
    nextStep: string;
    objectionHint: string;
    closeCta: string;
  };
  handoffArtifacts: string[];
  operatorChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderApprovalDecisionView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  decision: 'approved' | 'needs_follow_up' | 'blocked';
  summary: string;
  owner: {
    productKey: 'ecommerce';
    role: 'operator';
  };
  rationale: string;
  approvalChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderFiscalDataCompletionWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  workspaceStatus: 'ready' | 'needs_data' | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'invoicing';
    stage: 'electronic_invoicing_ec_mvp';
  };
  requiredFields: string[];
  missingFields: string[];
  fiscalProfile: {
    legalName: string | null;
    taxIdOrDocument: string | null;
    billingEmail: string | null;
    billingAddressStatus: 'recommended' | 'captured';
    documentType: 'invoice';
    documentIdHint: 'ruc_cedula_passport';
  };
  completionHints: Array<{
    fieldKey: string;
    label: string;
    hint: string;
  }>;
  operatorChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderStatusLifecycleEntryView {
  key: 'draft' | 'under_review' | 'approved' | 'handed_off' | 'blocked';
  label: string;
  status: 'completed' | 'active' | 'pending';
  detail: string;
}

export interface TenantEcommerceOrderStatusLifecycleSummaryView {
  orderDraftId: string;
  orderLabel: string;
  currentStatus:
    | 'draft'
    | 'under_review'
    | 'approved'
    | 'handed_off'
    | 'blocked';
  lastAction: string;
  nextStep: string;
  updatedAt: Date;
}

export interface TenantEcommerceOrderStatusLifecycleRegistryView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalOrders: number;
    draftCount: number;
    underReviewCount: number;
    approvedCount: number;
    handedOffCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  orders: TenantEcommerceOrderStatusLifecycleSummaryView[];
}

export interface TenantEcommerceOrderStatusLifecycleDetailView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  currentStatus:
    | 'draft'
    | 'under_review'
    | 'approved'
    | 'handed_off'
    | 'blocked';
  summary: string;
  lastAction: string;
  nextStep: string;
  timeline: TenantEcommerceOrderStatusLifecycleEntryView[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderHandoffDecisionView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  handoffStatus: 'ready' | 'needs_data' | 'blocked';
  route: 'invoicing' | 'growth_follow_up' | 'hold';
  summary: string;
  owner: {
    productKey: 'ecommerce';
    role: 'operator';
  };
  rationale: string;
  routeChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceInvoiceDraftIntakeWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  workspaceStatus: 'ready_to_open_invoice_draft' | 'needs_data' | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'invoicing';
    stage: 'electronic_invoicing_ec_mvp';
    handoffMode: 'operator_assist';
  };
  commercialSnapshot: {
    offerTitle: string;
    pricingSnapshot: string;
    primaryCta: string;
    closingChannel: string;
  };
  fiscalSnapshot: {
    requiredFields: string[];
    missingFields: string[];
    billingIntent: string | null;
  };
  handoffArtifacts: string[];
  operatorChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderOperatorWorkboardEntryView {
  orderDraftId: string;
  orderLabel: string;
  currentStatus:
    | 'draft'
    | 'under_review'
    | 'approved'
    | 'handed_off'
    | 'blocked';
  handoffRoute: 'invoicing' | 'growth_follow_up' | 'hold';
  priority: 'high' | 'medium' | 'low';
  attentionReason: string;
  nextStep: string;
  updatedAt: Date;
}

export interface TenantEcommerceOrderOperatorWorkboardView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalOrders: number;
    highPriorityCount: number;
    readyForInvoicingCount: number;
    growthFollowUpCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  entries: TenantEcommerceOrderOperatorWorkboardEntryView[];
}

export interface TenantEcommerceOrderHandoffExecutionWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  executionStatus: 'ready_for_execution' | 'needs_data' | 'blocked';
  activeRoute: 'invoicing' | 'growth_follow_up' | 'hold';
  summary: string;
  owner: {
    productKey: 'ecommerce';
    role: 'operator';
  };
  routeTargets: {
    invoicingTarget: {
      productKey: 'invoicing';
      stage: 'electronic_invoicing_ec_mvp';
      handoffMode: 'operator_assist';
    };
    growthTarget: {
      productKey: 'growth';
      channel: 'whatsapp';
      handoffMode: 'operator_assist';
    };
  };
  executionChecklist: string[];
  nextStep: string;
  handoffArtifacts: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceInvoiceDraftOpenBridgeView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  bridgeStatus: 'ready_to_open' | 'needs_data' | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'invoicing';
    stage: 'electronic_invoicing_ec_mvp';
    handoffMode: 'operator_assist';
  };
  payload: {
    customerLabel: string;
    documentHint: 'invoice';
    offerTitle: string;
    pricingSnapshot: string;
    billingIntent: string | null;
  };
  fiscalSnapshot: {
    requiredFields: string[];
    missingFields: string[];
  };
  handoffArtifacts: string[];
  operatorChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderOpsPriorityQueueEntryView {
  orderDraftId: string;
  orderLabel: string;
  currentStatus:
    | 'draft'
    | 'under_review'
    | 'approved'
    | 'handed_off'
    | 'blocked';
  activeRoute: 'invoicing' | 'growth_follow_up' | 'hold';
  priorityBand: 'critical' | 'high' | 'medium' | 'low';
  priorityScore: number;
  attentionReason: string;
  recommendedAction: string;
  quickActions: string[];
  updatedAt: Date;
}

export interface TenantEcommerceOrderOpsPriorityQueueView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalOrders: number;
    criticalCount: number;
    invoicingLaneCount: number;
    growthLaneCount: number;
    holdCount: number;
    headline: string;
    detail: string;
  };
  entries: TenantEcommerceOrderOpsPriorityQueueEntryView[];
}

export interface TenantEcommerceOrderHoldResolutionWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  resolutionStatus: 'ready_to_resolve' | 'needs_data' | 'blocked';
  currentRoute: 'invoicing' | 'growth_follow_up' | 'hold';
  summary: string;
  owner: {
    productKey: 'ecommerce';
    role: 'operator';
  };
  blockerSummary: {
    hardBlockers: string[];
    softBlockers: string[];
  };
  suggestedExitRoutes: Array<{
    route: 'invoicing' | 'growth_follow_up';
    readiness: 'ready' | 'needs_data' | 'blocked';
    rationale: string;
  }>;
  resolutionChecklist: string[];
  nextStep: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceInvoiceDraftLaunchBridgeView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  launchStatus: 'ready_to_launch' | 'needs_data' | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'invoicing';
    stage: 'electronic_invoicing_ec_mvp';
    handoffMode: 'operator_assist';
  };
  launchPayload: {
    customerLabel: string;
    documentHint: 'invoice';
    offerTitle: string;
    pricingSnapshot: string;
    billingIntent: string | null;
    routeConfirmed: boolean;
  };
  fiscalArtifacts: string[];
  commercialArtifacts: string[];
  operatorChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderOpsAttentionWorkspaceEntryView {
  orderDraftId: string;
  orderLabel: string;
  attentionStatus: 'blocked' | 'needs_data' | 'ready';
  activeRoute: 'invoicing' | 'growth_follow_up' | 'hold';
  attentionReason: string;
  nextAction: string;
  ownerRole: 'operator';
  updatedAt: Date;
}

export interface TenantEcommerceOrderOpsAttentionWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalAttentionItems: number;
    blockedCount: number;
    needsDataCount: number;
    readyCount: number;
    headline: string;
    detail: string;
  };
  focusLanes: Array<{
    laneKey: 'blocked' | 'needs_data' | 'ready';
    count: number;
    actionBias: string;
  }>;
  entries: TenantEcommerceOrderOpsAttentionWorkspaceEntryView[];
}

export interface TenantEcommerceOrderRouteResolutionPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  resolutionStatus: 'ready_to_reroute' | 'needs_data' | 'blocked';
  currentRoute: 'invoicing' | 'growth_follow_up' | 'hold';
  recommendedRoute: 'invoicing' | 'growth_follow_up' | 'hold';
  summary: string;
  rationale: string;
  routeSignals: {
    invoicingReadiness: 'ready' | 'needs_data' | 'blocked';
    growthReadiness: 'ready' | 'needs_data' | 'blocked';
    holdRisk: 'high' | 'medium' | 'low';
  };
  routeChecklist: string[];
  nextStep: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceInvoiceDraftHandoffWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  workspaceStatus: 'ready_for_invoice_handoff' | 'needs_data' | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'invoicing';
    stage: 'electronic_invoicing_ec_mvp';
    handoffMode: 'operator_assist';
  };
  routeSnapshot: {
    currentRoute: 'invoicing' | 'growth_follow_up' | 'hold';
    recommendedRoute: 'invoicing' | 'growth_follow_up' | 'hold';
    routeConfirmed: boolean;
  };
  handoffPayload: {
    customerLabel: string;
    documentHint: 'invoice';
    offerTitle: string;
    pricingSnapshot: string;
    billingIntent: string | null;
  };
  handoffArtifacts: string[];
  operatorChecklist: string[];
  nextStep: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderOpsEscalationBoardEntryView {
  orderDraftId: string;
  orderLabel: string;
  escalationLevel: 'critical' | 'elevated' | 'monitor';
  activeRoute: 'invoicing' | 'growth_follow_up' | 'hold';
  escalationReason: string;
  recommendedOwnerRole: 'operator';
  nextAction: string;
  updatedAt: Date;
}

export interface TenantEcommerceOrderOpsEscalationBoardView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalEscalations: number;
    criticalCount: number;
    elevatedCount: number;
    monitorCount: number;
    headline: string;
    detail: string;
  };
  escalationLanes: Array<{
    laneKey: 'critical' | 'elevated' | 'monitor';
    count: number;
    operatorBias: string;
  }>;
  entries: TenantEcommerceOrderOpsEscalationBoardEntryView[];
}

export interface TenantEcommerceInvoiceHandoffAcknowledgementView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  acknowledgementStatus: 'accepted' | 'needs_data' | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'invoicing';
    stage: 'electronic_invoicing_ec_mvp';
    handoffMode: 'operator_assist';
  };
  receivedArtifacts: string[];
  missingSignals: string[];
  nextStep: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderPaymentReadinessWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  workspaceStatus: 'ready_for_collection' | 'needs_confirmation' | 'blocked';
  summary: string;
  paymentPlan: {
    collectionChannel: 'landing' | 'catalog' | 'whatsapp';
    pricingSnapshot: string;
    billingIntent: string | null;
    primaryCta: string;
  };
  invoiceSignal: {
    acknowledgementStatus: 'accepted' | 'needs_data' | 'blocked';
    detail: string;
  };
  closeoutSignal: {
    closeoutStatus: 'ready_for_operator_closeout' | 'needs_data' | 'blocked';
    paymentReadinessStatus: 'ready' | 'needs_customer_input' | 'blocked';
  };
  readinessChecklist: string[];
  frictionPoints: string[];
  nextStep: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderPostSaleLifecycleEntryView {
  key: 'handed_off' | 'invoicing' | 'awaiting_payment' | 'paid' | 'blocked';
  label: string;
  status: 'completed' | 'active' | 'pending';
  detail: string;
}

export interface TenantEcommerceOrderPostSaleLifecycleSummaryView {
  orderDraftId: string;
  orderLabel: string;
  currentStatus:
    | 'handed_off'
    | 'invoicing'
    | 'awaiting_payment'
    | 'paid'
    | 'blocked';
  nextStep: string;
  updatedAt: Date;
}

export interface TenantEcommerceOrderPostSaleLifecycleRegistryView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalOrders: number;
    handedOffCount: number;
    invoicingCount: number;
    awaitingPaymentCount: number;
    paidCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  orders: TenantEcommerceOrderPostSaleLifecycleSummaryView[];
}

export interface TenantEcommerceOrderPostSaleLifecycleDetailView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  currentStatus:
    | 'handed_off'
    | 'invoicing'
    | 'awaiting_payment'
    | 'paid'
    | 'blocked';
  summary: string;
  lastAction: string;
  nextStep: string;
  timeline: TenantEcommerceOrderPostSaleLifecycleEntryView[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderPaymentConfirmationWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  confirmationStatus: 'ready_for_confirmation' | 'needs_review' | 'blocked';
  summary: string;
  expectedCollection: {
    collectionChannel: 'landing' | 'catalog' | 'whatsapp';
    pricingSnapshot: string;
    billingIntent: string | null;
    primaryCta: string;
  };
  lifecycleSignal: {
    currentStatus:
      | 'handed_off'
      | 'invoicing'
      | 'awaiting_payment'
      | 'paid'
      | 'blocked';
    detail: string;
  };
  confirmationChecklist: string[];
  evidenceHints: string[];
  nextStep: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderPaymentConfirmationDecisionView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  decision: 'confirmed' | 'needs_review' | 'blocked';
  summary: string;
  owner: {
    productKey: 'ecommerce';
    role: 'operator';
  };
  rationale: string;
  confirmationChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderFulfillmentReadinessWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  fulfillmentStatus:
    | 'ready_for_fulfillment'
    | 'waiting_payment_confirmation'
    | 'blocked';
  summary: string;
  fulfillmentProfile: {
    fulfillmentType: 'digital' | 'service' | 'physical';
    deliveryChannel: 'email' | 'whatsapp' | 'manual';
    ownerRole: 'operator';
  };
  prerequisites: string[];
  blockedBy: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantEcommerceOrderFulfillmentAvailabilityWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  availabilityStatus:
    | 'available_for_fulfillment'
    | 'needs_capacity_review'
    | 'blocked';
  inventoryMode: 'capacity_signal' | 'stock_signal' | 'not_tracked_yet';
  summary: string;
  availabilitySignals: {
    paymentStatus: 'confirmed' | 'waiting_payment_confirmation' | 'blocked';
    fulfillmentStatus:
      | 'ready_for_fulfillment'
      | 'waiting_payment_confirmation'
      | 'blocked';
    buyerContactStatus: 'ready' | 'needs_contact_data';
    productType: TenantEcommerceProductEntityView['productType'];
  };
  capacityChecklist: string[];
  blockedBy: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantEcommerceOrderInventoryReservationWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  reservationStatus: 'reserved' | 'needs_capacity_review' | 'blocked';
  reservationMode: 'capacity_hold' | 'stock_hold' | 'manual_hold';
  summary: string;
  reservationSignal: {
    availabilityStatus:
      | 'available_for_fulfillment'
      | 'needs_capacity_review'
      | 'blocked';
    inventoryMode: 'capacity_signal' | 'stock_signal' | 'not_tracked_yet';
    reservationScope: 'order_draft';
  };
  reservationChecklist: string[];
  blockedBy: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantEcommerceOrderFulfillmentExecutionWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  executionStatus:
    | 'ready_to_execute'
    | 'waiting_payment_confirmation'
    | 'blocked';
  summary: string;
  fulfillmentProfile: {
    fulfillmentType: 'digital' | 'service' | 'physical';
    deliveryChannel: 'email' | 'whatsapp' | 'manual';
    ownerRole: 'operator';
  };
  executionSignals: {
    paymentDecision: 'confirmed' | 'needs_review' | 'blocked';
    postSaleStatus:
      | 'handed_off'
      | 'invoicing'
      | 'awaiting_payment'
      | 'paid'
      | 'blocked';
    readinessStatus:
      | 'ready_for_fulfillment'
      | 'waiting_payment_confirmation'
      | 'blocked';
  };
  executionChecklist: string[];
  blockedBy: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantEcommerceOrderRevenueTrackingSummaryEntryView {
  orderDraftId: string;
  orderLabel: string;
  currentStatus:
    | 'handed_off'
    | 'invoicing'
    | 'awaiting_payment'
    | 'paid'
    | 'blocked';
  paymentConfirmationStatus:
    | 'ready_for_confirmation'
    | 'needs_review'
    | 'blocked';
  fulfillmentStatus:
    | 'ready_for_fulfillment'
    | 'waiting_payment_confirmation'
    | 'blocked';
  pricingSnapshot: string;
  billingIntent: string | null;
  nextStep: string;
  updatedAt: Date;
}

export interface TenantEcommerceOrderRevenueTrackingSummaryView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalOrders: number;
    expectedOrderCount: number;
    confirmedOrderCount: number;
    awaitingPaymentCount: number;
    blockedCount: number;
    readyForFulfillmentCount: number;
    headline: string;
    detail: string;
  };
  paymentRollup: {
    readyForConfirmationCount: number;
    needsReviewCount: number;
    blockedCount: number;
    confirmationBacklog: string;
  };
  valueSignals: {
    expectedPricingSnapshots: string[];
    billingIntents: string[];
  };
  entries: TenantEcommerceOrderRevenueTrackingSummaryEntryView[];
}

export interface TenantEcommerceOrderRevenueOpsBoardEntryView {
  orderDraftId: string;
  orderLabel: string;
  revenueStatus: 'awaiting_payment' | 'paid' | 'blocked';
  priorityBand: 'critical' | 'high' | 'monitor';
  paymentDecision: 'confirmed' | 'needs_review' | 'blocked';
  fulfillmentExecutionStatus:
    | 'ready_to_execute'
    | 'waiting_payment_confirmation'
    | 'blocked';
  revenueImpact: string;
  nextAction: string;
  updatedAt: Date;
}

export interface TenantEcommerceOrderRevenueOpsBoardView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalOrders: number;
    criticalCount: number;
    highPriorityCount: number;
    paidCount: number;
    awaitingPaymentCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  priorityLanes: Array<{
    laneKey: 'critical' | 'high' | 'monitor';
    count: number;
    operatorBias: string;
  }>;
  entries: TenantEcommerceOrderRevenueOpsBoardEntryView[];
}

export interface TenantEcommerceOrderPaymentConfirmationLogView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  logStatus: 'confirmed' | 'needs_review' | 'disputed';
  summary: string;
  confirmationRecord: {
    confirmedAt: Date;
    confirmationChannel: 'landing' | 'catalog' | 'whatsapp';
    operatorNote: string;
    evidenceHints: string[];
  };
  decisionSignal: {
    paymentDecision: 'confirmed' | 'needs_review' | 'blocked';
    postSaleStatus:
      | 'handed_off'
      | 'invoicing'
      | 'awaiting_payment'
      | 'paid'
      | 'blocked';
  };
  auditTrail: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderPaymentReconciliationWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  reconciliationStatus: 'reconciled' | 'needs_review' | 'blocked';
  summary: string;
  paymentAttempt: {
    attemptStatus:
      | 'pending'
      | 'confirmed'
      | 'needs_review'
      | 'failed'
      | 'reversed';
    collectionChannel: 'landing' | 'catalog' | 'whatsapp';
    pricingSnapshot: string;
    evidenceHints: string[];
  };
  reconciliationSignals: {
    paymentLogStatus: 'confirmed' | 'needs_review' | 'disputed';
    paymentDecision: 'confirmed' | 'needs_review' | 'blocked';
    postSaleStatus:
      | 'handed_off'
      | 'invoicing'
      | 'awaiting_payment'
      | 'paid'
      | 'blocked';
  };
  reconciliationChecklist: string[];
  blockedBy: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantEcommerceOrderFulfillmentDeliveryWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  deliveryStatus: 'in_progress' | 'delivered' | 'blocked';
  summary: string;
  deliveryProfile: {
    fulfillmentType: 'digital' | 'service' | 'physical';
    deliveryChannel: 'email' | 'whatsapp' | 'manual';
    ownerRole: 'operator';
    deliveryMode: 'guided_handoff' | 'manual_execution' | 'service_activation';
  };
  handoffNotes: string[];
  prerequisitesResolved: string[];
  executionSignals: {
    paymentLogStatus: 'confirmed' | 'needs_review' | 'disputed';
    fulfillmentExecutionStatus:
      | 'ready_to_execute'
      | 'waiting_payment_confirmation'
      | 'blocked';
    postSaleStatus:
      | 'handed_off'
      | 'invoicing'
      | 'awaiting_payment'
      | 'paid'
      | 'blocked';
  };
  nextStep: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderPostSaleOpsBoardEntryView {
  orderDraftId: string;
  orderLabel: string;
  opsStatus:
    | 'awaiting_payment'
    | 'ready_for_fulfillment'
    | 'in_progress'
    | 'blocked';
  priorityBand: 'critical' | 'high' | 'monitor';
  paymentLogStatus: 'confirmed' | 'needs_review' | 'disputed';
  deliveryStatus: 'in_progress' | 'delivered' | 'blocked';
  attentionReason: string;
  nextAction: string;
  updatedAt: Date;
}

export interface TenantEcommerceOrderPostSaleOpsBoardView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalOrders: number;
    awaitingPaymentCount: number;
    readyForFulfillmentCount: number;
    inProgressCount: number;
    blockedCount: number;
    criticalCount: number;
    headline: string;
    detail: string;
  };
  focusLanes: Array<{
    laneKey:
      | 'awaiting_payment'
      | 'ready_for_fulfillment'
      | 'in_progress'
      | 'blocked';
    count: number;
    operatorBias: string;
  }>;
  entries: TenantEcommerceOrderPostSaleOpsBoardEntryView[];
}

export interface TenantEcommerceOrderPaymentDisputeWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  disputeStatus: 'confirmed' | 'needs_review' | 'hold';
  summary: string;
  disputeProfile: {
    disputeReason: string;
    activeChannel: 'landing' | 'catalog' | 'whatsapp';
    recommendedOwnerRole: 'operator';
    expectedEvidence: string[];
  };
  resolutionPaths: Array<{
    key: 'confirmed' | 'needs_review' | 'hold';
    label: string;
    detail: string;
  }>;
  nextStep: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderFulfillmentCompletionPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  completionStatus: 'completed' | 'partial' | 'blocked';
  summary: string;
  deliveryResult: {
    fulfillmentType: 'digital' | 'service' | 'physical';
    deliveryMode: 'guided_handoff' | 'manual_execution' | 'service_activation';
    ownerRole: 'operator';
    resultLabel: string;
  };
  completionChecklist: string[];
  operatorNotes: string[];
  nextStep: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderPostSaleReportingBoardEntryView {
  orderDraftId: string;
  orderLabel: string;
  reportingStatus: 'paid' | 'in_progress' | 'delivered' | 'blocked';
  paymentLogStatus: 'confirmed' | 'needs_review' | 'disputed';
  deliveryStatus: 'in_progress' | 'delivered' | 'blocked';
  driftSignal:
    | 'aligned'
    | 'payment_without_delivery'
    | 'delivery_without_paid_lifecycle';
  nextAction: string;
  updatedAt: Date;
}

export interface TenantEcommerceOrderPostSaleReportingBoardView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalOrders: number;
    paidCount: number;
    inProgressCount: number;
    deliveredCount: number;
    blockedCount: number;
    divergenceCount: number;
    headline: string;
    detail: string;
  };
  reportingLanes: Array<{
    laneKey: 'paid' | 'in_progress' | 'delivered' | 'blocked';
    count: number;
    operatorBias: string;
  }>;
  entries: TenantEcommerceOrderPostSaleReportingBoardEntryView[];
}

export interface TenantEcommerceOrderPaymentDisputeResolutionPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  resolutionDecision: 'confirmed' | 'hold' | 'escalated';
  summary: string;
  resolutionOwner: {
    productKey: 'ecommerce';
    role: 'operator';
  };
  requiredEvidence: string[];
  resolutionChecklist: string[];
  nextStep: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderReturnsRefundsCancellationWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  resolutionStatus:
    | 'eligible_for_cancellation'
    | 'eligible_for_refund_review'
    | 'return_review'
    | 'blocked';
  summary: string;
  lifecycleSignals: {
    paymentLogStatus: 'confirmed' | 'needs_review' | 'disputed';
    deliveryStatus: 'in_progress' | 'delivered' | 'blocked';
    disputeStatus: 'confirmed' | 'needs_review' | 'hold';
  };
  resolutionOptions: Array<{
    key: 'cancel' | 'refund_review' | 'return_review' | 'escalate';
    label: string;
    detail: string;
  }>;
  guardrailChecklist: string[];
  blockedBy: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantEcommerceOrderFulfillmentDeliveryConfirmationPacketView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  orderDraft: TenantEcommerceOrderDraftView;
  confirmationStatus: 'delivered' | 'partial' | 'blocked';
  summary: string;
  confirmationRecord: {
    deliveryMode: 'guided_handoff' | 'manual_execution' | 'service_activation';
    deliveryChannel: 'email' | 'whatsapp' | 'manual';
    ownerRole: 'operator';
    resultLabel: string;
  };
  evidenceChecklist: string[];
  operatorNotes: string[];
  nextStep: string;
  blockedBy: string[];
  guardrails: string[];
}

export interface TenantEcommerceOrderPostSaleReportingSummaryView {
  tenantSlug: string;
  generatedAt: Date;
  productEntity: TenantEcommerceProductEntityView;
  summary: {
    totalOrders: number;
    confirmedCount: number;
    deliveredCount: number;
    blockedCount: number;
    disputedCount: number;
    divergenceCount: number;
    headline: string;
    detail: string;
  };
  revenueSnapshot: {
    expectedOrderCount: number;
    confirmedOrderCount: number;
    awaitingPaymentCount: number;
    readyForFulfillmentCount: number;
  };
  operationalHighlights: string[];
  nextFocus: string;
}
