import {
  TenantEcommerceCatalogAssetEntityWorkspaceView,
  TenantEcommerceCatalogCommercialCardView,
  TenantEcommerceChannelReleaseExecutionReadinessView,
  TenantEcommerceChannelReleaseHandoffPacketView,
  TenantEcommerceChannelReleaseWorkbenchView,
  TenantEcommerceLandingAssetEntityWorkspaceView,
  TenantEcommerceLandingPageStructureView,
  TenantEcommerceWhatsappChannelSequenceWorkspaceView,
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
