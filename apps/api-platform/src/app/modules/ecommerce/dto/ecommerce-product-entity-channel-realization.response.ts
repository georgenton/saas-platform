import {
  TenantEcommerceCatalogAssetEntityWorkspaceView,
  TenantEcommerceCatalogCommercialCardView,
  TenantEcommerceCatalogListingAssetView,
  TenantEcommerceChannelReleaseApprovalPacketView,
  TenantEcommerceChannelReleaseExecutionReadinessView,
  TenantEcommerceChannelReleaseHandoffPacketView,
  TenantEcommerceChannelReleaseLaunchPacketView,
  TenantEcommerceChannelReleaseWorkbenchView,
  TenantEcommerceLandingAssetEntityWorkspaceView,
  TenantEcommerceLandingPublishArtifactView,
  TenantEcommerceLandingPageStructureView,
  TenantEcommerceStorefrontReleaseCandidateBriefView,
  TenantEcommerceStorefrontPublishReviewWorkspaceView,
  TenantEcommerceStorefrontPreviewWorkspaceView,
  TenantEcommerceCatalogStorefrontPlacementPacketView,
  TenantEcommerceWhatsappGrowthActivationPacketView,
  TenantEcommerceWhatsappGrowthActivationWorkspaceView,
  TenantEcommerceWhatsappChannelSequenceWorkspaceView,
  TenantEcommerceWhatsappGrowthExecutionBridgeView,
  TenantEcommerceWhatsappGrowthOperatorLaunchPacketView,
  TenantEcommerceWhatsappGrowthHandoffView,
  TenantEcommerceWhatsappSalesFlowView,
} from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductEntityChannelAssetEntityResponseDto,
  toEcommerceProductEntityChannelAssetEntityResponseDto,
} from './ecommerce-product-entity-channel-asset-entity.response';
import {
  EcommerceProductEntityResponseDto,
  toEcommerceProductEntityResponseDto,
} from './ecommerce-product-entity.response';

export interface EcommerceLandingAssetEntityWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
  workspaceStatus: 'ready_for_landing_assembly' | 'needs_publish_copy' | 'blocked';
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

export interface EcommerceCatalogAssetEntityWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
  workspaceStatus: 'ready_for_catalog_assembly' | 'needs_publish_copy' | 'blocked';
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

export interface EcommerceCatalogCommercialCardResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
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

export interface EcommerceWhatsappChannelSequenceWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
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

export interface EcommerceChannelReleaseWorkbenchResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  summary: {
    totalCandidates: number;
    readyCount: number;
    needsPublishCopyCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  channels: Array<{
    channelKey: 'landing' | 'catalog' | 'whatsapp';
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

export interface EcommerceChannelReleaseExecutionReadinessResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  overallStatus:
    | 'ready_for_controlled_release'
    | 'needs_channel_completion'
    | 'blocked';
  summary: string;
  channels: Array<{
    channelKey: 'landing' | 'catalog' | 'whatsapp';
    releaseStatus: 'candidate_ready' | 'needs_publish_copy' | 'blocked' | 'missing';
    executionOwner: 'ecommerce' | 'growth' | 'shared';
    executionChecklist: string[];
    launchWindow: string;
    blockedBy: string[];
  }>;
  finalChecklist: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface EcommerceChannelReleaseHandoffPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  handoffStatus: 'ready_for_handoff' | 'needs_channel_completion' | 'blocked';
  summary: string;
  ownerModel: {
    primaryOwner: 'ecommerce' | 'growth' | 'shared';
    escalationOwner: 'growth' | 'shared';
    releaseMode: 'controlled_release';
  };
  channels: Array<{
    channelKey: 'landing' | 'catalog' | 'whatsapp';
    readiness:
      | 'candidate_ready'
      | 'needs_publish_copy'
      | 'blocked'
      | 'missing';
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

export interface EcommerceStorefrontPreviewWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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
    status:
      | 'candidate_ready'
      | 'needs_publish_copy'
      | 'blocked'
      | 'missing';
    detail: string;
  }>;
  previewChecklist: string[];
  guardrails: string[];
}

export interface EcommerceChannelReleaseApprovalPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  approvalStatus:
    | 'ready_for_operator_approval'
    | 'needs_channel_completion'
    | 'blocked';
  summary: string;
  approvalOwner: 'ecommerce' | 'growth' | 'shared';
  channels: Array<{
    channelKey: 'landing' | 'catalog' | 'whatsapp';
    readiness:
      | 'candidate_ready'
      | 'needs_publish_copy'
      | 'blocked'
      | 'missing';
    approvalDecision: 'approve' | 'review' | 'block';
    rationale: string;
  }>;
  requiredApprovals: string[];
  warnings: string[];
  blockers: string[];
  guardrails: string[];
}

export interface EcommerceStorefrontPublishReviewWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  reviewStatus:
    | 'ready_for_publish_review'
    | 'needs_operator_revision'
    | 'blocked';
  summary: {
    headline: string;
    detail: string;
  };
  previewSnapshot: EcommerceStorefrontPreviewWorkspaceResponseDto;
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

export interface EcommerceChannelReleaseLaunchPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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

export interface EcommerceLandingPublishArtifactResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
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

export interface EcommerceCatalogListingAssetResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
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

export interface EcommerceStorefrontReleaseCandidateBriefResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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

export interface EcommerceCatalogStorefrontPlacementPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
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

export interface EcommerceLandingPageStructureResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
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

export interface EcommerceWhatsappSalesFlowResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
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

export interface EcommerceWhatsappGrowthHandoffResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
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

export interface EcommerceWhatsappGrowthActivationWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
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

export interface EcommerceWhatsappGrowthActivationPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
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

export interface EcommerceWhatsappGrowthExecutionBridgeResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
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

export interface EcommerceWhatsappGrowthOperatorLaunchPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
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

export function toEcommerceLandingAssetEntityWorkspaceResponseDto(
  view: TenantEcommerceLandingAssetEntityWorkspaceView,
): EcommerceLandingAssetEntityWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    workspaceStatus: view.workspaceStatus,
    hero: { ...view.hero },
    proofBlocks: [...view.proofBlocks],
    offerSections: [...view.offerSections],
    publishChecklist: [...view.publishChecklist],
    nextMilestone: view.nextMilestone,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceCatalogAssetEntityWorkspaceResponseDto(
  view: TenantEcommerceCatalogAssetEntityWorkspaceView,
): EcommerceCatalogAssetEntityWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    workspaceStatus: view.workspaceStatus,
    merchandisingCard: { ...view.merchandisingCard },
    offerBullets: [...view.offerBullets],
    merchandisingChecks: [...view.merchandisingChecks],
    nextMilestone: view.nextMilestone,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceCatalogCommercialCardResponseDto(
  view: TenantEcommerceCatalogCommercialCardView,
): EcommerceCatalogCommercialCardResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    commercialStatus: view.commercialStatus,
    card: { ...view.card },
    offerBullets: [...view.offerBullets],
    storefrontSummary: view.storefrontSummary,
    merchandisingHighlights: [...view.merchandisingHighlights],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceWhatsappChannelSequenceWorkspaceResponseDto(
  view: TenantEcommerceWhatsappChannelSequenceWorkspaceView,
): EcommerceWhatsappChannelSequenceWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    workspaceStatus: view.workspaceStatus,
    opener: view.opener,
    followUpSequence: [...view.followUpSequence],
    recoveryBranch: [...view.recoveryBranch],
    closeCta: view.closeCta,
    operatorNotes: [...view.operatorNotes],
    nextMilestone: view.nextMilestone,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceChannelReleaseWorkbenchResponseDto(
  view: TenantEcommerceChannelReleaseWorkbenchView,
): EcommerceChannelReleaseWorkbenchResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    channels: view.channels.map((channel) => ({
      ...channel,
      blockedBy: [...channel.blockedBy],
    })),
    qaChecklist: [...view.qaChecklist],
    finalArtifacts: [...view.finalArtifacts],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceChannelReleaseExecutionReadinessResponseDto(
  view: TenantEcommerceChannelReleaseExecutionReadinessView,
): EcommerceChannelReleaseExecutionReadinessResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    overallStatus: view.overallStatus,
    summary: view.summary,
    channels: view.channels.map((channel) => ({
      ...channel,
      executionChecklist: [...channel.executionChecklist],
      blockedBy: [...channel.blockedBy],
    })),
    finalChecklist: [...view.finalChecklist],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceChannelReleaseHandoffPacketResponseDto(
  view: TenantEcommerceChannelReleaseHandoffPacketView,
): EcommerceChannelReleaseHandoffPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    handoffStatus: view.handoffStatus,
    summary: view.summary,
    ownerModel: { ...view.ownerModel },
    channels: view.channels.map((channel) => ({
      ...channel,
      minimumArtifacts: [...channel.minimumArtifacts],
    })),
    handoffChecklist: [...view.handoffChecklist],
    warnings: [...view.warnings],
    blockers: [...view.blockers],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceStorefrontPreviewWorkspaceResponseDto(
  view: TenantEcommerceStorefrontPreviewWorkspaceView,
): EcommerceStorefrontPreviewWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    previewStatus: view.previewStatus,
    summary: { ...view.summary },
    landingPreview: {
      ...view.landingPreview,
      proofStrip: [...view.landingPreview.proofStrip],
    },
    catalogPreview: {
      ...view.catalogPreview,
      offerBullets: [...view.catalogPreview.offerBullets],
    },
    releaseSignals: view.releaseSignals.map((signal) => ({ ...signal })),
    previewChecklist: [...view.previewChecklist],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceChannelReleaseApprovalPacketResponseDto(
  view: TenantEcommerceChannelReleaseApprovalPacketView,
): EcommerceChannelReleaseApprovalPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    approvalStatus: view.approvalStatus,
    summary: view.summary,
    approvalOwner: view.approvalOwner,
    channels: view.channels.map((channel) => ({ ...channel })),
    requiredApprovals: [...view.requiredApprovals],
    warnings: [...view.warnings],
    blockers: [...view.blockers],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceStorefrontPublishReviewWorkspaceResponseDto(
  view: TenantEcommerceStorefrontPublishReviewWorkspaceView,
): EcommerceStorefrontPublishReviewWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    reviewStatus: view.reviewStatus,
    summary: { ...view.summary },
    previewSnapshot: toEcommerceStorefrontPreviewWorkspaceResponseDto(
      view.previewSnapshot,
    ),
    approvalSnapshot: {
      ...view.approvalSnapshot,
      channelDecisions: view.approvalSnapshot.channelDecisions.map((channel) => ({
        ...channel,
      })),
    },
    reviewChecklist: [...view.reviewChecklist],
    blockers: [...view.blockers],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceChannelReleaseLaunchPacketResponseDto(
  view: TenantEcommerceChannelReleaseLaunchPacketView,
): EcommerceChannelReleaseLaunchPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    launchStatus: view.launchStatus,
    summary: view.summary,
    launchOwner: view.launchOwner,
    channels: view.channels.map((channel) => ({ ...channel })),
    launchChecklist: [...view.launchChecklist],
    warnings: [...view.warnings],
    blockers: [...view.blockers],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceLandingPublishArtifactResponseDto(
  view: TenantEcommerceLandingPublishArtifactView,
): EcommerceLandingPublishArtifactResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    artifactStatus: view.artifactStatus,
    summary: { ...view.summary },
    hero: { ...view.hero },
    proofStrip: [...view.proofStrip],
    offerStack: view.offerStack.map((entry) => ({ ...entry })),
    ctaBand: { ...view.ctaBand },
    faqSeed: [...view.faqSeed],
    finalChecklist: [...view.finalChecklist],
    blockers: [...view.blockers],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceCatalogListingAssetResponseDto(
  view: TenantEcommerceCatalogListingAssetView,
): EcommerceCatalogListingAssetResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    listingStatus: view.listingStatus,
    card: { ...view.card },
    offerBullets: [...view.offerBullets],
    storefrontSummary: view.storefrontSummary,
    launchOwner: view.launchOwner,
    placementNotes: [...view.placementNotes],
    finalChecklist: [...view.finalChecklist],
    blockers: [...view.blockers],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceStorefrontReleaseCandidateBriefResponseDto(
  view: TenantEcommerceStorefrontReleaseCandidateBriefView,
): EcommerceStorefrontReleaseCandidateBriefResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    briefStatus: view.briefStatus,
    summary: { ...view.summary },
    landingArtifact: { ...view.landingArtifact },
    catalogListing: { ...view.catalogListing },
    releaseSignals: view.releaseSignals.map((signal) => ({ ...signal })),
    finalChecklist: [...view.finalChecklist],
    blockers: [...view.blockers],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceCatalogStorefrontPlacementPacketResponseDto(
  view: TenantEcommerceCatalogStorefrontPlacementPacketView,
): EcommerceCatalogStorefrontPlacementPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    placementStatus: view.placementStatus,
    card: { ...view.card },
    placementSummary: view.placementSummary,
    storefrontContext: { ...view.storefrontContext },
    placementNotes: [...view.placementNotes],
    placementChecklist: [...view.placementChecklist],
    blockers: [...view.blockers],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceLandingPageStructureResponseDto(
  view: TenantEcommerceLandingPageStructureView,
): EcommerceLandingPageStructureResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    structureStatus: view.structureStatus,
    hero: { ...view.hero },
    proofStrip: [...view.proofStrip],
    offerStack: view.offerStack.map((entry) => ({ ...entry })),
    ctaBand: { ...view.ctaBand },
    faqSeed: [...view.faqSeed],
    previewGuardrails: [...view.previewGuardrails],
  };
}

export function toEcommerceWhatsappSalesFlowResponseDto(
  view: TenantEcommerceWhatsappSalesFlowView,
): EcommerceWhatsappSalesFlowResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    flowStatus: view.flowStatus,
    stages: {
      ...view.stages,
      objectionHandling: [...view.stages.objectionHandling],
    },
    operatorChecklist: [...view.operatorChecklist],
    handoffNotes: [...view.handoffNotes],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceWhatsappGrowthHandoffResponseDto(
  view: TenantEcommerceWhatsappGrowthHandoffView,
): EcommerceWhatsappGrowthHandoffResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    handoffStatus: view.handoffStatus,
    targetWorkspace: { ...view.targetWorkspace },
    payload: {
      ...view.payload,
      objectionHandling: [...view.payload.objectionHandling],
    },
    sequencingNotes: [...view.sequencingNotes],
    bridgeArtifacts: [...view.bridgeArtifacts],
    readinessChecks: [...view.readinessChecks],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceWhatsappGrowthActivationWorkspaceResponseDto(
  view: TenantEcommerceWhatsappGrowthActivationWorkspaceView,
): EcommerceWhatsappGrowthActivationWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    activationStatus: view.activationStatus,
    targetWorkspace: { ...view.targetWorkspace },
    activationSummary: view.activationSummary,
    sequencePayload: {
      ...view.sequencePayload,
      objectionHandling: [...view.sequencePayload.objectionHandling],
    },
    activationChecklist: [...view.activationChecklist],
    bridgeArtifacts: [...view.bridgeArtifacts],
    handoffNotes: [...view.handoffNotes],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceWhatsappGrowthActivationPacketResponseDto(
  view: TenantEcommerceWhatsappGrowthActivationPacketView,
): EcommerceWhatsappGrowthActivationPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    packetStatus: view.packetStatus,
    activationTarget: { ...view.activationTarget },
    activationSummary: view.activationSummary,
    messagePack: {
      ...view.messagePack,
      objectionHandling: [...view.messagePack.objectionHandling],
    },
    activationChecklist: [...view.activationChecklist],
    bridgeArtifacts: [...view.bridgeArtifacts],
    operatorSteps: [...view.operatorSteps],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceWhatsappGrowthExecutionBridgeResponseDto(
  view: TenantEcommerceWhatsappGrowthExecutionBridgeView,
): EcommerceWhatsappGrowthExecutionBridgeResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    bridgeStatus: view.bridgeStatus,
    summary: view.summary,
    targetWorkspace: { ...view.targetWorkspace },
    executionPayload: {
      ...view.executionPayload,
      objectionHandling: [...view.executionPayload.objectionHandling],
    },
    operatorChecklist: [...view.operatorChecklist],
    bridgeArtifacts: [...view.bridgeArtifacts],
    nextSteps: [...view.nextSteps],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceWhatsappGrowthOperatorLaunchPacketResponseDto(
  view: TenantEcommerceWhatsappGrowthOperatorLaunchPacketView,
): EcommerceWhatsappGrowthOperatorLaunchPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    launchStatus: view.launchStatus,
    summary: view.summary,
    targetWorkspace: { ...view.targetWorkspace },
    executionPayload: {
      ...view.executionPayload,
      objectionHandling: [...view.executionPayload.objectionHandling],
    },
    launchChecklist: [...view.launchChecklist],
    operatorSteps: [...view.operatorSteps],
    bridgeArtifacts: [...view.bridgeArtifacts],
    blockers: [...view.blockers],
    guardrails: [...view.guardrails],
  };
}
