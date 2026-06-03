import {
  TenantEcommerceCatalogAssetEntityWorkspaceView,
  TenantEcommerceCatalogCommercialCardView,
  TenantEcommerceCatalogListingAssetView,
  TenantEcommerceCheckoutCustomerCapturePacketView,
  TenantEcommerceCheckoutOrderIntakeWorkspaceView,
  TenantEcommerceChannelReleaseApprovalPacketView,
  TenantEcommerceChannelReleaseExecutionReadinessView,
  TenantEcommerceChannelReleaseHandoffPacketView,
  TenantEcommerceChannelReleaseLaunchPacketView,
  TenantEcommerceChannelReleaseWorkbenchView,
  TenantEcommerceLandingAssetEntityWorkspaceView,
  TenantEcommerceLandingPublishArtifactView,
  TenantEcommerceLandingPageStructureView,
  TenantEcommerceLiveStorefrontSessionWorkspaceView,
  TenantEcommerceOrderDraftDetailView,
  TenantEcommerceOrderDraftRegistryView,
  TenantEcommerceOrderDraftSaveView,
  TenantEcommerceOrderDraftView,
  TenantEcommerceOrderApprovalDecisionView,
  TenantEcommerceOrderFiscalDataCompletionWorkspaceView,
  TenantEcommerceOrderGrowthFollowUpWorkspaceView,
  TenantEcommerceOrderHandoffDecisionView,
  TenantEcommerceOrderHandoffExecutionWorkspaceView,
  TenantEcommerceOrderHoldResolutionWorkspaceView,
  TenantEcommerceOrderRouteResolutionPacketView,
  TenantEcommerceOrderOperatorWorkboardEntryView,
  TenantEcommerceOrderOperatorWorkboardView,
  TenantEcommerceOrderOpsAttentionWorkspaceEntryView,
  TenantEcommerceOrderOpsAttentionWorkspaceView,
  TenantEcommerceOrderOpsEscalationBoardEntryView,
  TenantEcommerceOrderOpsEscalationBoardView,
  TenantEcommerceOrderOpsPriorityQueueEntryView,
  TenantEcommerceOrderOpsPriorityQueueView,
  TenantEcommerceOrderPaymentConfirmationDecisionView,
  TenantEcommerceOrderPaymentConfirmationLogView,
  TenantEcommerceOrderPaymentDisputeWorkspaceView,
  TenantEcommerceOrderPaymentDisputeResolutionPacketView,
  TenantEcommerceOrderPaymentConfirmationWorkspaceView,
  TenantEcommerceOrderInvoiceDraftBridgeView,
  TenantEcommerceInvoiceDraftHandoffWorkspaceView,
  TenantEcommerceInvoiceHandoffAcknowledgementView,
  TenantEcommerceInvoiceDraftIntakeWorkspaceView,
  TenantEcommerceInvoiceDraftOpenBridgeView,
  TenantEcommerceInvoiceDraftLaunchBridgeView,
  TenantEcommerceOrderFulfillmentDeliveryWorkspaceView,
  TenantEcommerceOrderFulfillmentCompletionPacketView,
  TenantEcommerceOrderFulfillmentDeliveryConfirmationPacketView,
  TenantEcommerceOrderFulfillmentExecutionWorkspaceView,
  TenantEcommerceOrderFulfillmentReadinessWorkspaceView,
  TenantEcommerceOrderPaymentReadinessWorkspaceView,
  TenantEcommerceOrderPostSaleLifecycleDetailView,
  TenantEcommerceOrderPostSaleLifecycleEntryView,
  TenantEcommerceOrderPostSaleOpsBoardEntryView,
  TenantEcommerceOrderPostSaleOpsBoardView,
  TenantEcommerceOrderPostSaleReportingBoardEntryView,
  TenantEcommerceOrderPostSaleReportingBoardView,
  TenantEcommerceOrderPostSaleReportingSummaryView,
  TenantEcommerceOrderPostSaleLifecycleRegistryView,
  TenantEcommerceOrderRevenueOpsBoardEntryView,
  TenantEcommerceOrderRevenueOpsBoardView,
  TenantEcommerceOrderRevenueTrackingSummaryEntryView,
  TenantEcommerceOrderRevenueTrackingSummaryView,
  TenantEcommerceOrderPostSaleLifecycleSummaryView,
  TenantEcommerceOrderInvoicingBridgeView,
  TenantEcommerceOrderReviewWorkspaceView,
  TenantEcommerceOrderStatusLifecycleDetailView,
  TenantEcommerceOrderStatusLifecycleRegistryView,
  TenantEcommerceOrderStatusLifecycleSummaryView,
  TenantEcommerceOrderToGrowthConversationBridgeView,
  TenantEcommerceOrderToInvoiceReadinessPacketView,
  TenantEcommerceCheckoutCloseoutPacketView,
  TenantEcommerceStorefrontReleaseCandidateBriefView,
  TenantEcommerceStorefrontGoLiveManifestView,
  TenantEcommerceStorefrontReleaseControlWorkspaceView,
  TenantEcommerceStorefrontPublishReviewWorkspaceView,
  TenantEcommerceStorefrontPreviewWorkspaceView,
  TenantEcommerceCatalogMerchandisingPacketView,
  TenantEcommerceCatalogStorefrontPlacementPacketView,
  TenantEcommerceWhatsappGrowthActivationPacketView,
  TenantEcommerceWhatsappGrowthActivationWorkspaceView,
  TenantEcommerceWhatsappChannelSequenceWorkspaceView,
  TenantEcommerceWhatsappGrowthExecutionBridgeView,
  TenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketView,
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

export interface EcommerceStorefrontReleaseControlWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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

export interface EcommerceCatalogMerchandisingPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
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

export interface EcommerceWhatsappGrowthLaunchAcknowledgementPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  assetEntity: EcommerceProductEntityChannelAssetEntityResponseDto;
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

export interface EcommerceCheckoutOrderIntakeWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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

export interface EcommerceOrderInvoicingBridgeResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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
  orderDraft: EcommerceCheckoutOrderIntakeWorkspaceResponseDto['checkoutDraft'];
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

export interface EcommerceStorefrontGoLiveManifestResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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

export interface EcommerceLiveStorefrontSessionWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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

export interface EcommerceCheckoutCustomerCapturePacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  captureStatus: 'ready_for_order_draft' | 'needs_customer_input' | 'blocked';
  summary: string;
  orderDraftSeed: EcommerceCheckoutOrderIntakeWorkspaceResponseDto['checkoutDraft'];
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

export interface EcommerceOrderToInvoiceReadinessPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  readinessStatus: 'ready_to_invoice' | 'needs_data' | 'blocked';
  summary: string;
  targetWorkspace: {
    productKey: 'invoicing';
    stage: 'electronic_invoicing_ec_mvp';
    handoffMode: 'operator_assist';
  };
  readinessSnapshot: {
    captureStatus:
      | 'ready_for_order_draft'
      | 'needs_customer_input'
      | 'blocked';
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

export interface EcommerceOrderDraftResponseDto {
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
  createdAt: string;
  updatedAt: string;
}

export interface EcommerceOrderDraftSaveResponseDto {
  tenantSlug: string;
  generatedAt: string;
  summary: string;
  orderDraft: EcommerceOrderDraftResponseDto;
}

export interface EcommerceOrderDraftRegistryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  summary: {
    totalOrderDrafts: number;
    draftCount: number;
    needsDataCount: number;
    readyForReviewCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  orderDrafts: EcommerceOrderDraftResponseDto[];
}

export interface EcommerceOrderDraftDetailResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
  summary: string;
  nextActions: string[];
  blockedBy: string[];
  guardrails: string[];
}

export interface EcommerceCheckoutCloseoutPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderToGrowthConversationBridgeResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderReviewWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderInvoiceDraftBridgeResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
  bridgeStatus:
    | 'ready_to_open_invoice_draft'
    | 'needs_data'
    | 'blocked';
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

export interface EcommerceOrderGrowthFollowUpWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderApprovalDecisionResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderFiscalDataCompletionWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderStatusLifecycleSummaryResponseDto {
  orderDraftId: string;
  orderLabel: string;
  currentStatus: 'draft' | 'under_review' | 'approved' | 'handed_off' | 'blocked';
  lastAction: string;
  nextStep: string;
  updatedAt: string;
}

export interface EcommerceOrderStatusLifecycleRegistryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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
  orders: EcommerceOrderStatusLifecycleSummaryResponseDto[];
}

export interface EcommerceOrderStatusLifecycleDetailResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
  currentStatus: 'draft' | 'under_review' | 'approved' | 'handed_off' | 'blocked';
  summary: string;
  lastAction: string;
  nextStep: string;
  timeline: Array<{
    key: 'draft' | 'under_review' | 'approved' | 'handed_off' | 'blocked';
    label: string;
    status: 'completed' | 'active' | 'pending';
    detail: string;
  }>;
  blockedBy: string[];
  guardrails: string[];
}

export interface EcommerceOrderHandoffDecisionResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceInvoiceDraftIntakeWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderOperatorWorkboardEntryResponseDto {
  orderDraftId: string;
  orderLabel: string;
  currentStatus: 'draft' | 'under_review' | 'approved' | 'handed_off' | 'blocked';
  handoffRoute: 'invoicing' | 'growth_follow_up' | 'hold';
  priority: 'high' | 'medium' | 'low';
  attentionReason: string;
  nextStep: string;
  updatedAt: string;
}

export interface EcommerceOrderOperatorWorkboardResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  summary: {
    totalOrders: number;
    highPriorityCount: number;
    readyForInvoicingCount: number;
    growthFollowUpCount: number;
    blockedCount: number;
    headline: string;
    detail: string;
  };
  entries: EcommerceOrderOperatorWorkboardEntryResponseDto[];
}

export interface EcommerceOrderHandoffExecutionWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceInvoiceDraftOpenBridgeResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderOpsPriorityQueueEntryResponseDto {
  orderDraftId: string;
  orderLabel: string;
  currentStatus: 'draft' | 'under_review' | 'approved' | 'handed_off' | 'blocked';
  activeRoute: 'invoicing' | 'growth_follow_up' | 'hold';
  priorityBand: 'critical' | 'high' | 'medium' | 'low';
  priorityScore: number;
  attentionReason: string;
  recommendedAction: string;
  quickActions: string[];
  updatedAt: string;
}

export interface EcommerceOrderOpsPriorityQueueResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  summary: {
    totalOrders: number;
    criticalCount: number;
    invoicingLaneCount: number;
    growthLaneCount: number;
    holdCount: number;
    headline: string;
    detail: string;
  };
  entries: EcommerceOrderOpsPriorityQueueEntryResponseDto[];
}

export interface EcommerceOrderHoldResolutionWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceInvoiceDraftLaunchBridgeResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderOpsAttentionWorkspaceEntryResponseDto {
  orderDraftId: string;
  orderLabel: string;
  attentionStatus: 'blocked' | 'needs_data' | 'ready';
  activeRoute: 'invoicing' | 'growth_follow_up' | 'hold';
  attentionReason: string;
  nextAction: string;
  ownerRole: 'operator';
  updatedAt: string;
}

export interface EcommerceOrderOpsAttentionWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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
  entries: EcommerceOrderOpsAttentionWorkspaceEntryResponseDto[];
}

export interface EcommerceOrderRouteResolutionPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceInvoiceDraftHandoffWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderOpsEscalationBoardEntryResponseDto {
  orderDraftId: string;
  orderLabel: string;
  escalationLevel: 'critical' | 'elevated' | 'monitor';
  activeRoute: 'invoicing' | 'growth_follow_up' | 'hold';
  escalationReason: string;
  recommendedOwnerRole: 'operator';
  nextAction: string;
  updatedAt: string;
}

export interface EcommerceOrderOpsEscalationBoardResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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
  entries: EcommerceOrderOpsEscalationBoardEntryResponseDto[];
}

export interface EcommerceInvoiceHandoffAcknowledgementResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderPaymentReadinessWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderPaymentConfirmationWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderPaymentConfirmationDecisionResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderPaymentConfirmationLogResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
  logStatus: 'confirmed' | 'needs_review' | 'disputed';
  summary: string;
  confirmationRecord: {
    confirmedAt: string;
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

export interface EcommerceOrderPaymentDisputeWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderPaymentDisputeResolutionPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderFulfillmentReadinessWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderFulfillmentExecutionWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
  executionStatus: 'ready_to_execute' | 'waiting_payment_confirmation' | 'blocked';
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

export interface EcommerceOrderFulfillmentDeliveryWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderFulfillmentCompletionPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderFulfillmentDeliveryConfirmationPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
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

export interface EcommerceOrderPostSaleLifecycleSummaryResponseDto {
  orderDraftId: string;
  orderLabel: string;
  currentStatus:
    | 'handed_off'
    | 'invoicing'
    | 'awaiting_payment'
    | 'paid'
    | 'blocked';
  nextStep: string;
  updatedAt: string;
}

export interface EcommerceOrderPostSaleLifecycleRegistryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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
  orders: EcommerceOrderPostSaleLifecycleSummaryResponseDto[];
}

export interface EcommerceOrderPostSaleLifecycleDetailResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  orderDraft: EcommerceOrderDraftResponseDto;
  currentStatus:
    | 'handed_off'
    | 'invoicing'
    | 'awaiting_payment'
    | 'paid'
    | 'blocked';
  summary: string;
  lastAction: string;
  nextStep: string;
  timeline: Array<{
    key: 'handed_off' | 'invoicing' | 'awaiting_payment' | 'paid' | 'blocked';
    label: string;
    status: 'completed' | 'active' | 'pending';
    detail: string;
  }>;
  blockedBy: string[];
  guardrails: string[];
}

export interface EcommerceOrderRevenueTrackingSummaryEntryResponseDto {
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
  updatedAt: string;
}

export interface EcommerceOrderRevenueTrackingSummaryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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
  entries: EcommerceOrderRevenueTrackingSummaryEntryResponseDto[];
}

export interface EcommerceOrderRevenueOpsBoardEntryResponseDto {
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
  updatedAt: string;
}

export interface EcommerceOrderRevenueOpsBoardResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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
  entries: EcommerceOrderRevenueOpsBoardEntryResponseDto[];
}

export interface EcommerceOrderPostSaleOpsBoardEntryResponseDto {
  orderDraftId: string;
  orderLabel: string;
  opsStatus: 'awaiting_payment' | 'ready_for_fulfillment' | 'in_progress' | 'blocked';
  priorityBand: 'critical' | 'high' | 'monitor';
  paymentLogStatus: 'confirmed' | 'needs_review' | 'disputed';
  deliveryStatus: 'in_progress' | 'delivered' | 'blocked';
  attentionReason: string;
  nextAction: string;
  updatedAt: string;
}

export interface EcommerceOrderPostSaleOpsBoardResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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
    laneKey: 'awaiting_payment' | 'ready_for_fulfillment' | 'in_progress' | 'blocked';
    count: number;
    operatorBias: string;
  }>;
  entries: EcommerceOrderPostSaleOpsBoardEntryResponseDto[];
}

export interface EcommerceOrderPostSaleReportingBoardEntryResponseDto {
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
  updatedAt: string;
}

export interface EcommerceOrderPostSaleReportingBoardResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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
  entries: EcommerceOrderPostSaleReportingBoardEntryResponseDto[];
}

export interface EcommerceOrderPostSaleReportingSummaryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
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

export function toEcommerceStorefrontReleaseControlWorkspaceResponseDto(
  view: TenantEcommerceStorefrontReleaseControlWorkspaceView,
): EcommerceStorefrontReleaseControlWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    controlStatus: view.controlStatus,
    summary: { ...view.summary },
    briefSnapshot: { ...view.briefSnapshot },
    releaseControl: { ...view.releaseControl },
    channelDecisions: view.channelDecisions.map((channel) => ({ ...channel })),
    controlChecklist: [...view.controlChecklist],
    blockers: [...view.blockers],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceCatalogMerchandisingPacketResponseDto(
  view: TenantEcommerceCatalogMerchandisingPacketView,
): EcommerceCatalogMerchandisingPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    merchandisingStatus: view.merchandisingStatus,
    card: { ...view.card },
    merchandisingSummary: view.merchandisingSummary,
    placementContext: { ...view.placementContext },
    merchandisingNotes: [...view.merchandisingNotes],
    merchandisingChecklist: [...view.merchandisingChecklist],
    blockers: [...view.blockers],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceCheckoutOrderIntakeWorkspaceResponseDto(
  view: TenantEcommerceCheckoutOrderIntakeWorkspaceView,
): EcommerceCheckoutOrderIntakeWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    checkoutStatus: view.checkoutStatus,
    summary: view.summary,
    checkoutDraft: { ...view.checkoutDraft },
    customerFields: [...view.customerFields],
    channelSignals: view.channelSignals.map((entry) => ({ ...entry })),
    invoicingConnection: { ...view.invoicingConnection },
    orderChecklist: [...view.orderChecklist],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderInvoicingBridgeResponseDto(
  view: TenantEcommerceOrderInvoicingBridgeView,
): EcommerceOrderInvoicingBridgeResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    bridgeStatus: view.bridgeStatus,
    summary: view.summary,
    targetWorkspace: { ...view.targetWorkspace },
    orderDraft: { ...view.orderDraft },
    invoiceReadiness: { ...view.invoiceReadiness },
    fiscalRequirements: [...view.fiscalRequirements],
    handoffArtifacts: [...view.handoffArtifacts],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceStorefrontGoLiveManifestResponseDto(
  view: TenantEcommerceStorefrontGoLiveManifestView,
): EcommerceStorefrontGoLiveManifestResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    manifestStatus: view.manifestStatus,
    summary: { ...view.summary },
    channelSnapshot: { ...view.channelSnapshot },
    orderReadiness: { ...view.orderReadiness },
    goLiveDependencies: view.goLiveDependencies.map((entry) => ({ ...entry })),
    finalChecklist: [...view.finalChecklist],
    operatorHandoff: { ...view.operatorHandoff },
    warnings: [...view.warnings],
    blockers: [...view.blockers],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceLiveStorefrontSessionWorkspaceResponseDto(
  view: TenantEcommerceLiveStorefrontSessionWorkspaceView,
): EcommerceLiveStorefrontSessionWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    sessionStatus: view.sessionStatus,
    summary: { ...view.summary },
    storefrontSnapshot: { ...view.storefrontSnapshot },
    releaseGate: { ...view.releaseGate },
    channelSessions: view.channelSessions.map((entry) => ({ ...entry })),
    sessionChecklist: [...view.sessionChecklist],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceCheckoutCustomerCapturePacketResponseDto(
  view: TenantEcommerceCheckoutCustomerCapturePacketView,
): EcommerceCheckoutCustomerCapturePacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    captureStatus: view.captureStatus,
    summary: view.summary,
    orderDraftSeed: { ...view.orderDraftSeed },
    captureForm: {
      requiredFields: [...view.captureForm.requiredFields],
      optionalFields: [...view.captureForm.optionalFields],
      validationRules: [...view.captureForm.validationRules],
    },
    billingReadiness: { ...view.billingReadiness },
    operatorPrompts: [...view.operatorPrompts],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderToInvoiceReadinessPacketResponseDto(
  view: TenantEcommerceOrderToInvoiceReadinessPacketView,
): EcommerceOrderToInvoiceReadinessPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    readinessStatus: view.readinessStatus,
    summary: view.summary,
    targetWorkspace: { ...view.targetWorkspace },
    readinessSnapshot: { ...view.readinessSnapshot },
    fiscalRequirements: [...view.fiscalRequirements],
    missingFields: [...view.missingFields],
    handoffArtifacts: [...view.handoffArtifacts],
    operatorChecklist: [...view.operatorChecklist],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderDraftResponseDto(
  view: TenantEcommerceOrderDraftView,
): EcommerceOrderDraftResponseDto {
  return {
    id: view.id,
    tenantId: view.tenantId,
    tenantSlug: view.tenantSlug,
    productEntityId: view.productEntityId,
    status: view.status,
    orderLabel: view.orderLabel,
    offerTitle: view.offerTitle,
    pricingSnapshot: view.pricingSnapshot,
    primaryCta: view.primaryCta,
    closingChannel: view.closingChannel,
    captureStatus: view.captureStatus,
    invoicingReadinessStatus: view.invoicingReadinessStatus,
    customerProfile: { ...view.customerProfile },
    requiredFields: [...view.requiredFields],
    optionalFields: [...view.optionalFields],
    operatorPrompts: [...view.operatorPrompts],
    missingFields: [...view.missingFields],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
    createdAt: view.createdAt.toISOString(),
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toEcommerceOrderDraftSaveResponseDto(
  view: TenantEcommerceOrderDraftSaveView,
): EcommerceOrderDraftSaveResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    summary: view.summary,
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
  };
}

export function toEcommerceOrderDraftRegistryResponseDto(
  view: TenantEcommerceOrderDraftRegistryView,
): EcommerceOrderDraftRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    orderDrafts: view.orderDrafts.map((entry) =>
      toEcommerceOrderDraftResponseDto(entry),
    ),
  };
}

export function toEcommerceOrderDraftDetailResponseDto(
  view: TenantEcommerceOrderDraftDetailView,
): EcommerceOrderDraftDetailResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    summary: view.summary,
    nextActions: [...view.nextActions],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceCheckoutCloseoutPacketResponseDto(
  view: TenantEcommerceCheckoutCloseoutPacketView,
): EcommerceCheckoutCloseoutPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    closeoutStatus: view.closeoutStatus,
    summary: view.summary,
    commercialSnapshot: { ...view.commercialSnapshot },
    paymentReadiness: { ...view.paymentReadiness },
    invoicingReadiness: { ...view.invoicingReadiness },
    closeoutChecklist: [...view.closeoutChecklist],
    missingFields: [...view.missingFields],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderToGrowthConversationBridgeResponseDto(
  view: TenantEcommerceOrderToGrowthConversationBridgeView,
): EcommerceOrderToGrowthConversationBridgeResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    bridgeStatus: view.bridgeStatus,
    summary: view.summary,
    targetWorkspace: { ...view.targetWorkspace },
    conversationSeed: { ...view.conversationSeed },
    handoffArtifacts: [...view.handoffArtifacts],
    followUpChecklist: [...view.followUpChecklist],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderReviewWorkspaceResponseDto(
  view: TenantEcommerceOrderReviewWorkspaceView,
): EcommerceOrderReviewWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    reviewStatus: view.reviewStatus,
    summary: view.summary,
    reviewSnapshot: { ...view.reviewSnapshot },
    reviewChecklist: [...view.reviewChecklist],
    nextActions: [...view.nextActions],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderInvoiceDraftBridgeResponseDto(
  view: TenantEcommerceOrderInvoiceDraftBridgeView,
): EcommerceOrderInvoiceDraftBridgeResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    bridgeStatus: view.bridgeStatus,
    summary: view.summary,
    targetWorkspace: { ...view.targetWorkspace },
    invoiceDraftSeed: { ...view.invoiceDraftSeed },
    requiredFields: [...view.requiredFields],
    missingFields: [...view.missingFields],
    handoffArtifacts: [...view.handoffArtifacts],
    operatorChecklist: [...view.operatorChecklist],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderGrowthFollowUpWorkspaceResponseDto(
  view: TenantEcommerceOrderGrowthFollowUpWorkspaceView,
): EcommerceOrderGrowthFollowUpWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    workspaceStatus: view.workspaceStatus,
    summary: view.summary,
    targetWorkspace: { ...view.targetWorkspace },
    followUpPlan: { ...view.followUpPlan },
    handoffArtifacts: [...view.handoffArtifacts],
    operatorChecklist: [...view.operatorChecklist],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderApprovalDecisionResponseDto(
  view: TenantEcommerceOrderApprovalDecisionView,
): EcommerceOrderApprovalDecisionResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    decision: view.decision,
    summary: view.summary,
    owner: { ...view.owner },
    rationale: view.rationale,
    approvalChecklist: [...view.approvalChecklist],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderFiscalDataCompletionWorkspaceResponseDto(
  view: TenantEcommerceOrderFiscalDataCompletionWorkspaceView,
): EcommerceOrderFiscalDataCompletionWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    workspaceStatus: view.workspaceStatus,
    summary: view.summary,
    targetWorkspace: { ...view.targetWorkspace },
    requiredFields: [...view.requiredFields],
    missingFields: [...view.missingFields],
    fiscalProfile: { ...view.fiscalProfile },
    completionHints: view.completionHints.map((entry) => ({ ...entry })),
    operatorChecklist: [...view.operatorChecklist],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderStatusLifecycleSummaryResponseDto(
  view: TenantEcommerceOrderStatusLifecycleSummaryView,
): EcommerceOrderStatusLifecycleSummaryResponseDto {
  return {
    orderDraftId: view.orderDraftId,
    orderLabel: view.orderLabel,
    currentStatus: view.currentStatus,
    lastAction: view.lastAction,
    nextStep: view.nextStep,
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toEcommerceOrderStatusLifecycleRegistryResponseDto(
  view: TenantEcommerceOrderStatusLifecycleRegistryView,
): EcommerceOrderStatusLifecycleRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    orders: view.orders.map((entry) =>
      toEcommerceOrderStatusLifecycleSummaryResponseDto(entry),
    ),
  };
}

export function toEcommerceOrderStatusLifecycleDetailResponseDto(
  view: TenantEcommerceOrderStatusLifecycleDetailView,
): EcommerceOrderStatusLifecycleDetailResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    currentStatus: view.currentStatus,
    summary: view.summary,
    lastAction: view.lastAction,
    nextStep: view.nextStep,
    timeline: view.timeline.map((entry) => ({ ...entry })),
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderHandoffDecisionResponseDto(
  view: TenantEcommerceOrderHandoffDecisionView,
): EcommerceOrderHandoffDecisionResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    handoffStatus: view.handoffStatus,
    route: view.route,
    summary: view.summary,
    owner: { ...view.owner },
    rationale: view.rationale,
    routeChecklist: [...view.routeChecklist],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceInvoiceDraftIntakeWorkspaceResponseDto(
  view: TenantEcommerceInvoiceDraftIntakeWorkspaceView,
): EcommerceInvoiceDraftIntakeWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    workspaceStatus: view.workspaceStatus,
    summary: view.summary,
    targetWorkspace: { ...view.targetWorkspace },
    commercialSnapshot: { ...view.commercialSnapshot },
    fiscalSnapshot: {
      ...view.fiscalSnapshot,
      requiredFields: [...view.fiscalSnapshot.requiredFields],
      missingFields: [...view.fiscalSnapshot.missingFields],
    },
    handoffArtifacts: [...view.handoffArtifacts],
    operatorChecklist: [...view.operatorChecklist],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderOperatorWorkboardEntryResponseDto(
  view: TenantEcommerceOrderOperatorWorkboardEntryView,
): EcommerceOrderOperatorWorkboardEntryResponseDto {
  return {
    orderDraftId: view.orderDraftId,
    orderLabel: view.orderLabel,
    currentStatus: view.currentStatus,
    handoffRoute: view.handoffRoute,
    priority: view.priority,
    attentionReason: view.attentionReason,
    nextStep: view.nextStep,
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toEcommerceOrderOperatorWorkboardResponseDto(
  view: TenantEcommerceOrderOperatorWorkboardView,
): EcommerceOrderOperatorWorkboardResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    entries: view.entries.map((entry) =>
      toEcommerceOrderOperatorWorkboardEntryResponseDto(entry),
    ),
  };
}

export function toEcommerceOrderHandoffExecutionWorkspaceResponseDto(
  view: TenantEcommerceOrderHandoffExecutionWorkspaceView,
): EcommerceOrderHandoffExecutionWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    executionStatus: view.executionStatus,
    activeRoute: view.activeRoute,
    summary: view.summary,
    owner: { ...view.owner },
    routeTargets: {
      invoicingTarget: { ...view.routeTargets.invoicingTarget },
      growthTarget: { ...view.routeTargets.growthTarget },
    },
    executionChecklist: [...view.executionChecklist],
    nextStep: view.nextStep,
    handoffArtifacts: [...view.handoffArtifacts],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceInvoiceDraftOpenBridgeResponseDto(
  view: TenantEcommerceInvoiceDraftOpenBridgeView,
): EcommerceInvoiceDraftOpenBridgeResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    bridgeStatus: view.bridgeStatus,
    summary: view.summary,
    targetWorkspace: { ...view.targetWorkspace },
    payload: { ...view.payload },
    fiscalSnapshot: {
      requiredFields: [...view.fiscalSnapshot.requiredFields],
      missingFields: [...view.fiscalSnapshot.missingFields],
    },
    handoffArtifacts: [...view.handoffArtifacts],
    operatorChecklist: [...view.operatorChecklist],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderOpsPriorityQueueEntryResponseDto(
  view: TenantEcommerceOrderOpsPriorityQueueEntryView,
): EcommerceOrderOpsPriorityQueueEntryResponseDto {
  return {
    orderDraftId: view.orderDraftId,
    orderLabel: view.orderLabel,
    currentStatus: view.currentStatus,
    activeRoute: view.activeRoute,
    priorityBand: view.priorityBand,
    priorityScore: view.priorityScore,
    attentionReason: view.attentionReason,
    recommendedAction: view.recommendedAction,
    quickActions: [...view.quickActions],
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toEcommerceOrderOpsPriorityQueueResponseDto(
  view: TenantEcommerceOrderOpsPriorityQueueView,
): EcommerceOrderOpsPriorityQueueResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    entries: view.entries.map((entry) =>
      toEcommerceOrderOpsPriorityQueueEntryResponseDto(entry),
    ),
  };
}

export function toEcommerceOrderHoldResolutionWorkspaceResponseDto(
  view: TenantEcommerceOrderHoldResolutionWorkspaceView,
): EcommerceOrderHoldResolutionWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    resolutionStatus: view.resolutionStatus,
    currentRoute: view.currentRoute,
    summary: view.summary,
    owner: { ...view.owner },
    blockerSummary: {
      hardBlockers: [...view.blockerSummary.hardBlockers],
      softBlockers: [...view.blockerSummary.softBlockers],
    },
    suggestedExitRoutes: view.suggestedExitRoutes.map((entry) => ({
      ...entry,
    })),
    resolutionChecklist: [...view.resolutionChecklist],
    nextStep: view.nextStep,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceInvoiceDraftLaunchBridgeResponseDto(
  view: TenantEcommerceInvoiceDraftLaunchBridgeView,
): EcommerceInvoiceDraftLaunchBridgeResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    launchStatus: view.launchStatus,
    summary: view.summary,
    targetWorkspace: { ...view.targetWorkspace },
    launchPayload: { ...view.launchPayload },
    fiscalArtifacts: [...view.fiscalArtifacts],
    commercialArtifacts: [...view.commercialArtifacts],
    operatorChecklist: [...view.operatorChecklist],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderOpsAttentionWorkspaceEntryResponseDto(
  view: TenantEcommerceOrderOpsAttentionWorkspaceEntryView,
): EcommerceOrderOpsAttentionWorkspaceEntryResponseDto {
  return {
    orderDraftId: view.orderDraftId,
    orderLabel: view.orderLabel,
    attentionStatus: view.attentionStatus,
    activeRoute: view.activeRoute,
    attentionReason: view.attentionReason,
    nextAction: view.nextAction,
    ownerRole: view.ownerRole,
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toEcommerceOrderOpsAttentionWorkspaceResponseDto(
  view: TenantEcommerceOrderOpsAttentionWorkspaceView,
): EcommerceOrderOpsAttentionWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    focusLanes: view.focusLanes.map((lane) => ({ ...lane })),
    entries: view.entries.map((entry) =>
      toEcommerceOrderOpsAttentionWorkspaceEntryResponseDto(entry),
    ),
  };
}

export function toEcommerceOrderRouteResolutionPacketResponseDto(
  view: TenantEcommerceOrderRouteResolutionPacketView,
): EcommerceOrderRouteResolutionPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    resolutionStatus: view.resolutionStatus,
    currentRoute: view.currentRoute,
    recommendedRoute: view.recommendedRoute,
    summary: view.summary,
    rationale: view.rationale,
    routeSignals: {
      ...view.routeSignals,
    },
    routeChecklist: [...view.routeChecklist],
    nextStep: view.nextStep,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceInvoiceDraftHandoffWorkspaceResponseDto(
  view: TenantEcommerceInvoiceDraftHandoffWorkspaceView,
): EcommerceInvoiceDraftHandoffWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    workspaceStatus: view.workspaceStatus,
    summary: view.summary,
    targetWorkspace: {
      ...view.targetWorkspace,
    },
    routeSnapshot: {
      ...view.routeSnapshot,
    },
    handoffPayload: {
      ...view.handoffPayload,
    },
    handoffArtifacts: [...view.handoffArtifacts],
    operatorChecklist: [...view.operatorChecklist],
    nextStep: view.nextStep,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderOpsEscalationBoardEntryResponseDto(
  view: TenantEcommerceOrderOpsEscalationBoardEntryView,
): EcommerceOrderOpsEscalationBoardEntryResponseDto {
  return {
    orderDraftId: view.orderDraftId,
    orderLabel: view.orderLabel,
    escalationLevel: view.escalationLevel,
    activeRoute: view.activeRoute,
    escalationReason: view.escalationReason,
    recommendedOwnerRole: view.recommendedOwnerRole,
    nextAction: view.nextAction,
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toEcommerceOrderOpsEscalationBoardResponseDto(
  view: TenantEcommerceOrderOpsEscalationBoardView,
): EcommerceOrderOpsEscalationBoardResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: {
      ...view.summary,
    },
    escalationLanes: view.escalationLanes.map((lane) => ({ ...lane })),
    entries: view.entries.map((entry) =>
      toEcommerceOrderOpsEscalationBoardEntryResponseDto(entry),
    ),
  };
}

export function toEcommerceInvoiceHandoffAcknowledgementResponseDto(
  view: TenantEcommerceInvoiceHandoffAcknowledgementView,
): EcommerceInvoiceHandoffAcknowledgementResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    acknowledgementStatus: view.acknowledgementStatus,
    summary: view.summary,
    targetWorkspace: { ...view.targetWorkspace },
    receivedArtifacts: [...view.receivedArtifacts],
    missingSignals: [...view.missingSignals],
    nextStep: view.nextStep,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderPaymentReadinessWorkspaceResponseDto(
  view: TenantEcommerceOrderPaymentReadinessWorkspaceView,
): EcommerceOrderPaymentReadinessWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    workspaceStatus: view.workspaceStatus,
    summary: view.summary,
    paymentPlan: { ...view.paymentPlan },
    invoiceSignal: { ...view.invoiceSignal },
    closeoutSignal: { ...view.closeoutSignal },
    readinessChecklist: [...view.readinessChecklist],
    frictionPoints: [...view.frictionPoints],
    nextStep: view.nextStep,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderPaymentConfirmationWorkspaceResponseDto(
  view: TenantEcommerceOrderPaymentConfirmationWorkspaceView,
): EcommerceOrderPaymentConfirmationWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    confirmationStatus: view.confirmationStatus,
    summary: view.summary,
    expectedCollection: { ...view.expectedCollection },
    lifecycleSignal: { ...view.lifecycleSignal },
    confirmationChecklist: [...view.confirmationChecklist],
    evidenceHints: [...view.evidenceHints],
    nextStep: view.nextStep,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderPaymentConfirmationDecisionResponseDto(
  view: TenantEcommerceOrderPaymentConfirmationDecisionView,
): EcommerceOrderPaymentConfirmationDecisionResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    decision: view.decision,
    summary: view.summary,
    owner: { ...view.owner },
    rationale: view.rationale,
    confirmationChecklist: [...view.confirmationChecklist],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderPaymentConfirmationLogResponseDto(
  view: TenantEcommerceOrderPaymentConfirmationLogView,
): EcommerceOrderPaymentConfirmationLogResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    logStatus: view.logStatus,
    summary: view.summary,
    confirmationRecord: {
      confirmedAt: view.confirmationRecord.confirmedAt.toISOString(),
      confirmationChannel: view.confirmationRecord.confirmationChannel,
      operatorNote: view.confirmationRecord.operatorNote,
      evidenceHints: [...view.confirmationRecord.evidenceHints],
    },
    decisionSignal: { ...view.decisionSignal },
    auditTrail: [...view.auditTrail],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderPaymentDisputeWorkspaceResponseDto(
  view: TenantEcommerceOrderPaymentDisputeWorkspaceView,
): EcommerceOrderPaymentDisputeWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    disputeStatus: view.disputeStatus,
    summary: view.summary,
    disputeProfile: {
      disputeReason: view.disputeProfile.disputeReason,
      activeChannel: view.disputeProfile.activeChannel,
      recommendedOwnerRole: view.disputeProfile.recommendedOwnerRole,
      expectedEvidence: [...view.disputeProfile.expectedEvidence],
    },
    resolutionPaths: view.resolutionPaths.map((path) => ({ ...path })),
    nextStep: view.nextStep,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderPaymentDisputeResolutionPacketResponseDto(
  view: TenantEcommerceOrderPaymentDisputeResolutionPacketView,
): EcommerceOrderPaymentDisputeResolutionPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    resolutionDecision: view.resolutionDecision,
    summary: view.summary,
    resolutionOwner: { ...view.resolutionOwner },
    requiredEvidence: [...view.requiredEvidence],
    resolutionChecklist: [...view.resolutionChecklist],
    nextStep: view.nextStep,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderFulfillmentReadinessWorkspaceResponseDto(
  view: TenantEcommerceOrderFulfillmentReadinessWorkspaceView,
): EcommerceOrderFulfillmentReadinessWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    fulfillmentStatus: view.fulfillmentStatus,
    summary: view.summary,
    fulfillmentProfile: { ...view.fulfillmentProfile },
    prerequisites: [...view.prerequisites],
    blockedBy: [...view.blockedBy],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderFulfillmentExecutionWorkspaceResponseDto(
  view: TenantEcommerceOrderFulfillmentExecutionWorkspaceView,
): EcommerceOrderFulfillmentExecutionWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    executionStatus: view.executionStatus,
    summary: view.summary,
    fulfillmentProfile: { ...view.fulfillmentProfile },
    executionSignals: { ...view.executionSignals },
    executionChecklist: [...view.executionChecklist],
    blockedBy: [...view.blockedBy],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderFulfillmentDeliveryWorkspaceResponseDto(
  view: TenantEcommerceOrderFulfillmentDeliveryWorkspaceView,
): EcommerceOrderFulfillmentDeliveryWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    deliveryStatus: view.deliveryStatus,
    summary: view.summary,
    deliveryProfile: { ...view.deliveryProfile },
    handoffNotes: [...view.handoffNotes],
    prerequisitesResolved: [...view.prerequisitesResolved],
    executionSignals: { ...view.executionSignals },
    nextStep: view.nextStep,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderFulfillmentCompletionPacketResponseDto(
  view: TenantEcommerceOrderFulfillmentCompletionPacketView,
): EcommerceOrderFulfillmentCompletionPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    completionStatus: view.completionStatus,
    summary: view.summary,
    deliveryResult: { ...view.deliveryResult },
    completionChecklist: [...view.completionChecklist],
    operatorNotes: [...view.operatorNotes],
    nextStep: view.nextStep,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderFulfillmentDeliveryConfirmationPacketResponseDto(
  view: TenantEcommerceOrderFulfillmentDeliveryConfirmationPacketView,
): EcommerceOrderFulfillmentDeliveryConfirmationPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    confirmationStatus: view.confirmationStatus,
    summary: view.summary,
    confirmationRecord: { ...view.confirmationRecord },
    evidenceChecklist: [...view.evidenceChecklist],
    operatorNotes: [...view.operatorNotes],
    nextStep: view.nextStep,
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderPostSaleLifecycleSummaryResponseDto(
  view: TenantEcommerceOrderPostSaleLifecycleSummaryView,
): EcommerceOrderPostSaleLifecycleSummaryResponseDto {
  return {
    orderDraftId: view.orderDraftId,
    orderLabel: view.orderLabel,
    currentStatus: view.currentStatus,
    nextStep: view.nextStep,
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toEcommerceOrderPostSaleLifecycleDetailResponseDto(
  view: TenantEcommerceOrderPostSaleLifecycleDetailView,
): EcommerceOrderPostSaleLifecycleDetailResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    orderDraft: toEcommerceOrderDraftResponseDto(view.orderDraft),
    currentStatus: view.currentStatus,
    summary: view.summary,
    lastAction: view.lastAction,
    nextStep: view.nextStep,
    timeline: view.timeline.map((entry: TenantEcommerceOrderPostSaleLifecycleEntryView) => ({
      ...entry,
    })),
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
  };
}

export function toEcommerceOrderPostSaleLifecycleRegistryResponseDto(
  view: TenantEcommerceOrderPostSaleLifecycleRegistryView,
): EcommerceOrderPostSaleLifecycleRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    orders: view.orders.map((entry) =>
      toEcommerceOrderPostSaleLifecycleSummaryResponseDto(entry),
    ),
  };
}

export function toEcommerceOrderRevenueTrackingSummaryEntryResponseDto(
  view: TenantEcommerceOrderRevenueTrackingSummaryEntryView,
): EcommerceOrderRevenueTrackingSummaryEntryResponseDto {
  return {
    ...view,
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toEcommerceOrderRevenueTrackingSummaryResponseDto(
  view: TenantEcommerceOrderRevenueTrackingSummaryView,
): EcommerceOrderRevenueTrackingSummaryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    paymentRollup: { ...view.paymentRollup },
    valueSignals: {
      expectedPricingSnapshots: [...view.valueSignals.expectedPricingSnapshots],
      billingIntents: [...view.valueSignals.billingIntents],
    },
    entries: view.entries.map((entry) =>
      toEcommerceOrderRevenueTrackingSummaryEntryResponseDto(entry),
    ),
  };
}

function toEcommerceOrderRevenueOpsBoardEntryResponseDto(
  view: TenantEcommerceOrderRevenueOpsBoardEntryView,
): EcommerceOrderRevenueOpsBoardEntryResponseDto {
  return {
    orderDraftId: view.orderDraftId,
    orderLabel: view.orderLabel,
    revenueStatus: view.revenueStatus,
    priorityBand: view.priorityBand,
    paymentDecision: view.paymentDecision,
    fulfillmentExecutionStatus: view.fulfillmentExecutionStatus,
    revenueImpact: view.revenueImpact,
    nextAction: view.nextAction,
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toEcommerceOrderRevenueOpsBoardResponseDto(
  view: TenantEcommerceOrderRevenueOpsBoardView,
): EcommerceOrderRevenueOpsBoardResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    priorityLanes: view.priorityLanes.map((lane) => ({ ...lane })),
    entries: view.entries.map((entry) =>
      toEcommerceOrderRevenueOpsBoardEntryResponseDto(entry),
    ),
  };
}

function toEcommerceOrderPostSaleOpsBoardEntryResponseDto(
  view: TenantEcommerceOrderPostSaleOpsBoardEntryView,
): EcommerceOrderPostSaleOpsBoardEntryResponseDto {
  return {
    ...view,
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toEcommerceOrderPostSaleOpsBoardResponseDto(
  view: TenantEcommerceOrderPostSaleOpsBoardView,
): EcommerceOrderPostSaleOpsBoardResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    focusLanes: view.focusLanes.map((lane) => ({ ...lane })),
    entries: view.entries.map((entry) =>
      toEcommerceOrderPostSaleOpsBoardEntryResponseDto(entry),
    ),
  };
}

function toEcommerceOrderPostSaleReportingBoardEntryResponseDto(
  view: TenantEcommerceOrderPostSaleReportingBoardEntryView,
): EcommerceOrderPostSaleReportingBoardEntryResponseDto {
  return {
    ...view,
    updatedAt: view.updatedAt.toISOString(),
  };
}

export function toEcommerceOrderPostSaleReportingBoardResponseDto(
  view: TenantEcommerceOrderPostSaleReportingBoardView,
): EcommerceOrderPostSaleReportingBoardResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    reportingLanes: view.reportingLanes.map((lane) => ({ ...lane })),
    entries: view.entries.map((entry) =>
      toEcommerceOrderPostSaleReportingBoardEntryResponseDto(entry),
    ),
  };
}

export function toEcommerceOrderPostSaleReportingSummaryResponseDto(
  view: TenantEcommerceOrderPostSaleReportingSummaryView,
): EcommerceOrderPostSaleReportingSummaryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    summary: { ...view.summary },
    revenueSnapshot: { ...view.revenueSnapshot },
    operationalHighlights: [...view.operationalHighlights],
    nextFocus: view.nextFocus,
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

export function toEcommerceWhatsappGrowthLaunchAcknowledgementPacketResponseDto(
  view: TenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketView,
): EcommerceWhatsappGrowthLaunchAcknowledgementPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    assetEntity: toEcommerceProductEntityChannelAssetEntityResponseDto(
      view.assetEntity,
    ),
    acknowledgementStatus: view.acknowledgementStatus,
    summary: view.summary,
    targetWorkspace: { ...view.targetWorkspace },
    activationContext: { ...view.activationContext },
    launchPayload: {
      ...view.launchPayload,
      objectionHandling: [...view.launchPayload.objectionHandling],
    },
    acknowledgementChecklist: [...view.acknowledgementChecklist],
    operatorActions: [...view.operatorActions],
    bridgeArtifacts: [...view.bridgeArtifacts],
    blockers: [...view.blockers],
    guardrails: [...view.guardrails],
  };
}
