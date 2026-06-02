import { useEffect, useState } from 'react';
import styles from './app.module.css';
import {
  AiAgentCatalogResponse,
  AiApprovalPolicyResponse,
  AiApprovalRequestResponse,
  AiOperatingModelAgentResponse,
  AiSuggestionEnvelopeResponse,
  AiSuggestionRunDetailResponse,
  AiSuggestionRunResponse,
  EcommerceLaunchPlanDetailResponse,
  EcommerceLaunchPlanRegistryResponse,
  EcommerceProductAuthoringDraftDetailResponse,
  EcommerceProductEntityChannelAssetDraftsWorkspaceResponse,
  EcommerceProductEntityChannelAssetEntityDetailResponse,
  EcommerceProductEntityChannelAssetEntityRegistryResponse,
  EcommerceLandingAssetEntityWorkspaceResponse,
  EcommerceLandingPageStructureResponse,
  EcommerceLandingPublishArtifactResponse,
  EcommerceCatalogAssetEntityWorkspaceResponse,
  EcommerceCatalogCommercialCardResponse,
  EcommerceCatalogListingAssetResponse,
  EcommerceCatalogMerchandisingPacketResponse,
  EcommerceCheckoutCloseoutPacketResponse,
  EcommerceCheckoutCustomerCapturePacketResponse,
  EcommerceCheckoutOrderIntakeWorkspaceResponse,
  EcommerceCatalogStorefrontPlacementPacketResponse,
  EcommerceChannelReleaseApprovalPacketResponse,
  EcommerceChannelReleaseLaunchPacketResponse,
  EcommerceWhatsappChannelSequenceWorkspaceResponse,
  EcommerceChannelReleaseWorkbenchResponse,
  EcommerceChannelReleaseExecutionReadinessResponse,
  EcommerceChannelReleaseHandoffPacketResponse,
  EcommerceStorefrontPublishReviewWorkspaceResponse,
  EcommerceStorefrontPreviewWorkspaceResponse,
  EcommerceStorefrontReleaseControlWorkspaceResponse,
  EcommerceStorefrontGoLiveManifestResponse,
  EcommerceLiveStorefrontSessionWorkspaceResponse,
  EcommerceOrderApprovalDecisionResponse,
  EcommerceOrderDraftDetailResponse,
  EcommerceOrderFiscalDataCompletionWorkspaceResponse,
  EcommerceOrderGrowthFollowUpWorkspaceResponse,
  EcommerceOrderHandoffDecisionResponse,
  EcommerceOrderHandoffExecutionWorkspaceResponse,
  EcommerceOrderHoldResolutionWorkspaceResponse,
  EcommerceOrderRouteResolutionPacketResponse,
  EcommerceOrderInvoiceDraftBridgeResponse,
  EcommerceInvoiceDraftHandoffWorkspaceResponse,
  EcommerceInvoiceHandoffAcknowledgementResponse,
  EcommerceInvoiceDraftIntakeWorkspaceResponse,
  EcommerceInvoiceDraftOpenBridgeResponse,
  EcommerceInvoiceDraftLaunchBridgeResponse,
  EcommerceOrderDraftRegistryResponse,
  EcommerceOrderOpsAttentionWorkspaceResponse,
  EcommerceOrderOpsEscalationBoardResponse,
  EcommerceOrderOperatorWorkboardResponse,
  EcommerceOrderPaymentConfirmationLogResponse,
  EcommerceOrderPaymentConfirmationDecisionResponse,
  EcommerceOrderPaymentConfirmationWorkspaceResponse,
  EcommerceOrderPaymentReadinessWorkspaceResponse,
  EcommerceOrderPostSaleOpsBoardResponse,
  EcommerceOrderPostSaleLifecycleDetailResponse,
  EcommerceOrderPostSaleLifecycleRegistryResponse,
  EcommerceOrderRevenueOpsBoardResponse,
  EcommerceOrderRevenueTrackingSummaryResponse,
  EcommerceOrderFulfillmentDeliveryWorkspaceResponse,
  EcommerceOrderOpsPriorityQueueResponse,
  EcommerceOrderReviewWorkspaceResponse,
  EcommerceOrderStatusLifecycleDetailResponse,
  EcommerceOrderStatusLifecycleRegistryResponse,
  EcommerceOrderFulfillmentExecutionWorkspaceResponse,
  EcommerceOrderFulfillmentReadinessWorkspaceResponse,
  EcommerceStorefrontReleaseCandidateBriefResponse,
  EcommerceWhatsappSalesFlowResponse,
  EcommerceWhatsappGrowthActivationPacketResponse,
  EcommerceWhatsappGrowthExecutionBridgeResponse,
  EcommerceWhatsappGrowthLaunchAcknowledgementPacketResponse,
  EcommerceOrderInvoicingBridgeResponse,
  EcommerceOrderToGrowthConversationBridgeResponse,
  EcommerceOrderToInvoiceReadinessPacketResponse,
  EcommerceWhatsappGrowthOperatorLaunchPacketResponse,
  EcommerceWhatsappGrowthActivationWorkspaceResponse,
  EcommerceWhatsappGrowthHandoffResponse,
  EcommerceProductEntityChannelReleaseCandidateDetailResponse,
  EcommerceProductEntityChannelReleaseCandidateRegistryResponse,
  EcommerceProductEntityChannelAssetWorkspaceDetailResponse,
  EcommerceProductEntityChannelAssetWorkspaceRegistryResponse,
  EcommerceProductEntityChannelAssetsWorkspaceResponse,
  EcommerceProductEntityChannelDraftDetailResponse,
  EcommerceProductEntityChannelDraftPublishPreparationWorkspaceResponse,
  EcommerceProductEntityDetailResponse,
  EcommerceSavedProductEntityChannelDraftRegistryResponse,
  EcommerceSavedProductEntityChannelDraftDetailResponse,
  EcommerceProductEntityRegistryResponse,
  EcommerceProductSetupDetailResponse,
  EcommerceProductSetupRegistryResponse,
  PromoteEcommerceProductSetupToProductEntityResponse,
  PromoteEcommerceProductEntityChannelAssetEntityToReleaseCandidateResponse,
  PromoteEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityResponse,
  RequestEcommerceProductEntityChannelAssetEntityPublishPreparationPacketResponse,
  RequestEcommerceProductEntityChannelAssetPublishPacketResponse,
  RequestEcommerceProductEntityCommercializationPacketResponse,
  RequestEcommerceProductEntityChannelDraftActionPacketResponse,
  RequestEcommerceProductEntityChannelDraftPublishReadinessPacketResponse,
  EcommerceProductWorkspaceDetailResponse,
  EcommerceProductWorkspaceRegistryResponse,
  EcommerceSavedProductDraftRegistryResponse,
  RequestEcommerceProductSetupDefinitionPacketResponse,
  RequestEcommerceProductWorkspaceReadinessPacketResponse,
  RequestEcommerceProductAuthoringDraftBriefResponse,
  RequestEcommerceProductAuthoringDraftRefinementPacketResponse,
  EcommerceProductAuthoringWorkspaceResponse,
  EcommerceStoreProfileWorkspaceResponse,
  EcommerceStoreSetupWorkspaceResponse,
  EcommerceLaunchWorkspaceResponse,
  RequestEcommerceLaunchPlanActivationReadinessResponse,
} from './types';

type Props = {
  hasSession: boolean;
  hasCurrentTenancy: boolean;
  canReadTenantEntitlements: boolean;
  tenantAiEcommerceLaunchWorkspaceLoading: boolean;
  tenantEcommerceProductAuthoringWorkspace: EcommerceProductAuthoringWorkspaceResponse | null;
  tenantEcommerceSavedProductDraftRegistry: EcommerceSavedProductDraftRegistryResponse | null;
  tenantEcommerceProductWorkspaceRegistry: EcommerceProductWorkspaceRegistryResponse | null;
  tenantEcommerceProductSetupRegistry: EcommerceProductSetupRegistryResponse | null;
  tenantEcommerceProductEntityRegistry: EcommerceProductEntityRegistryResponse | null;
  selectedTenantEcommerceProductWorkspaceDetail:
    | EcommerceProductWorkspaceDetailResponse
    | null;
  tenantEcommerceProductWorkspaceDetailLoading: boolean;
  selectedTenantEcommerceProductSetupDetail:
    | EcommerceProductSetupDetailResponse
    | null;
  tenantEcommerceProductSetupDetailLoading: boolean;
  selectedTenantEcommerceProductEntityDetail:
    | EcommerceProductEntityDetailResponse
    | null;
  selectedTenantEcommerceProductEntityChannelAssetsWorkspace:
    | EcommerceProductEntityChannelAssetsWorkspaceResponse
    | null;
  selectedTenantEcommerceProductEntityChannelAssetDraftsWorkspace:
    | EcommerceProductEntityChannelAssetDraftsWorkspaceResponse
    | null;
  tenantEcommerceProductEntityChannelAssetWorkspaceRegistry:
    | EcommerceProductEntityChannelAssetWorkspaceRegistryResponse
    | null;
  selectedTenantEcommerceProductEntityChannelAssetWorkspaceDetail:
    | EcommerceProductEntityChannelAssetWorkspaceDetailResponse
    | null;
  tenantEcommerceProductEntityChannelAssetEntityRegistry:
    | EcommerceProductEntityChannelAssetEntityRegistryResponse
    | null;
  selectedTenantEcommerceProductEntityChannelAssetEntityDetail:
    | EcommerceProductEntityChannelAssetEntityDetailResponse
    | null;
  selectedTenantEcommerceLandingAssetEntityWorkspace:
    | EcommerceLandingAssetEntityWorkspaceResponse
    | null;
  selectedTenantEcommerceCatalogAssetEntityWorkspace:
    | EcommerceCatalogAssetEntityWorkspaceResponse
    | null;
  selectedTenantEcommerceCatalogCommercialCard:
    | EcommerceCatalogCommercialCardResponse
    | null;
  selectedTenantEcommerceCatalogListingAsset:
    | EcommerceCatalogListingAssetResponse
    | null;
  selectedTenantEcommerceStorefrontReleaseCandidateBrief:
    | EcommerceStorefrontReleaseCandidateBriefResponse
    | null;
  selectedTenantEcommerceStorefrontReleaseControlWorkspace:
    | EcommerceStorefrontReleaseControlWorkspaceResponse
    | null;
  selectedTenantEcommerceStorefrontGoLiveManifest:
    | EcommerceStorefrontGoLiveManifestResponse
    | null;
  selectedTenantEcommerceLiveStorefrontSessionWorkspace:
    | EcommerceLiveStorefrontSessionWorkspaceResponse
    | null;
  selectedTenantEcommerceStorefrontPreviewWorkspace:
    | EcommerceStorefrontPreviewWorkspaceResponse
    | null;
  selectedTenantEcommerceStorefrontPublishReviewWorkspace:
    | EcommerceStorefrontPublishReviewWorkspaceResponse
    | null;
  selectedTenantEcommerceLandingPublishArtifact:
    | EcommerceLandingPublishArtifactResponse
    | null;
  selectedTenantEcommerceWhatsappChannelSequenceWorkspace:
    | EcommerceWhatsappChannelSequenceWorkspaceResponse
    | null;
  selectedTenantEcommerceChannelReleaseWorkbench:
    | EcommerceChannelReleaseWorkbenchResponse
    | null;
  selectedTenantEcommerceChannelReleaseExecutionReadiness:
    | EcommerceChannelReleaseExecutionReadinessResponse
    | null;
  lastEcommerceChannelReleaseHandoffPacket:
    | EcommerceChannelReleaseHandoffPacketResponse
    | null;
  lastEcommerceChannelReleaseApprovalPacket:
    | EcommerceChannelReleaseApprovalPacketResponse
    | null;
  lastEcommerceChannelReleaseLaunchPacket:
    | EcommerceChannelReleaseLaunchPacketResponse
    | null;
  lastEcommerceCatalogStorefrontPlacementPacket:
    | EcommerceCatalogStorefrontPlacementPacketResponse
    | null;
  lastEcommerceCatalogMerchandisingPacket:
    | EcommerceCatalogMerchandisingPacketResponse
    | null;
  selectedTenantEcommerceCheckoutOrderIntakeWorkspace:
    | EcommerceCheckoutOrderIntakeWorkspaceResponse
    | null;
  lastEcommerceCheckoutCustomerCapturePacket:
    | EcommerceCheckoutCustomerCapturePacketResponse
    | null;
  tenantEcommerceOrderDraftRegistry: EcommerceOrderDraftRegistryResponse | null;
  selectedTenantEcommerceOrderDraftDetail:
    | EcommerceOrderDraftDetailResponse
    | null;
  lastEcommerceCheckoutCloseoutPacket:
    | EcommerceCheckoutCloseoutPacketResponse
    | null;
  lastEcommerceOrderToGrowthConversationBridge:
    | EcommerceOrderToGrowthConversationBridgeResponse
    | null;
  selectedTenantEcommerceOrderReviewWorkspace:
    | EcommerceOrderReviewWorkspaceResponse
    | null;
  lastEcommerceOrderApprovalDecision:
    | EcommerceOrderApprovalDecisionResponse
    | null;
  lastEcommerceOrderHandoffDecision:
    | EcommerceOrderHandoffDecisionResponse
    | null;
  lastEcommerceOrderInvoiceDraftBridge:
    | EcommerceOrderInvoiceDraftBridgeResponse
    | null;
  selectedTenantEcommerceInvoiceDraftIntakeWorkspace:
    | EcommerceInvoiceDraftIntakeWorkspaceResponse
    | null;
  selectedTenantEcommerceOrderHandoffExecutionWorkspace:
    | EcommerceOrderHandoffExecutionWorkspaceResponse
    | null;
  lastEcommerceInvoiceDraftOpenBridge:
    | EcommerceInvoiceDraftOpenBridgeResponse
    | null;
  selectedTenantEcommerceOrderHoldResolutionWorkspace:
    | EcommerceOrderHoldResolutionWorkspaceResponse
    | null;
  lastEcommerceInvoiceDraftLaunchBridge:
    | EcommerceInvoiceDraftLaunchBridgeResponse
    | null;
  lastEcommerceOrderRouteResolutionPacket:
    | EcommerceOrderRouteResolutionPacketResponse
    | null;
  selectedTenantEcommerceInvoiceDraftHandoffWorkspace:
    | EcommerceInvoiceDraftHandoffWorkspaceResponse
    | null;
  lastEcommerceInvoiceHandoffAcknowledgement:
    | EcommerceInvoiceHandoffAcknowledgementResponse
    | null;
  selectedTenantEcommerceOrderFiscalDataCompletionWorkspace:
    | EcommerceOrderFiscalDataCompletionWorkspaceResponse
    | null;
  selectedTenantEcommerceOrderPaymentReadinessWorkspace:
    | EcommerceOrderPaymentReadinessWorkspaceResponse
    | null;
  selectedTenantEcommerceOrderPaymentConfirmationWorkspace:
    | EcommerceOrderPaymentConfirmationWorkspaceResponse
    | null;
  lastEcommerceOrderPaymentConfirmationDecision:
    | EcommerceOrderPaymentConfirmationDecisionResponse
    | null;
  selectedTenantEcommerceOrderPaymentConfirmationLog:
    | EcommerceOrderPaymentConfirmationLogResponse
    | null;
  selectedTenantEcommerceOrderFulfillmentReadinessWorkspace:
    | EcommerceOrderFulfillmentReadinessWorkspaceResponse
    | null;
  selectedTenantEcommerceOrderFulfillmentExecutionWorkspace:
    | EcommerceOrderFulfillmentExecutionWorkspaceResponse
    | null;
  selectedTenantEcommerceOrderFulfillmentDeliveryWorkspace:
    | EcommerceOrderFulfillmentDeliveryWorkspaceResponse
    | null;
  selectedTenantEcommerceOrderGrowthFollowUpWorkspace:
    | EcommerceOrderGrowthFollowUpWorkspaceResponse
    | null;
  tenantEcommerceOrderOperatorWorkboard:
    | EcommerceOrderOperatorWorkboardResponse
    | null;
  tenantEcommerceOrderOpsPriorityQueue:
    | EcommerceOrderOpsPriorityQueueResponse
    | null;
  tenantEcommerceOrderOpsAttentionWorkspace:
    | EcommerceOrderOpsAttentionWorkspaceResponse
    | null;
  tenantEcommerceOrderOpsEscalationBoard:
    | EcommerceOrderOpsEscalationBoardResponse
    | null;
  tenantEcommerceOrderStatusLifecycleRegistry:
    | EcommerceOrderStatusLifecycleRegistryResponse
    | null;
  selectedTenantEcommerceOrderStatusLifecycleDetail:
    | EcommerceOrderStatusLifecycleDetailResponse
    | null;
  tenantEcommerceOrderPostSaleLifecycleRegistry:
    | EcommerceOrderPostSaleLifecycleRegistryResponse
    | null;
  selectedTenantEcommerceOrderPostSaleLifecycleDetail:
    | EcommerceOrderPostSaleLifecycleDetailResponse
    | null;
  tenantEcommerceOrderPostSaleOpsBoard:
    | EcommerceOrderPostSaleOpsBoardResponse
    | null;
  tenantEcommerceOrderRevenueTrackingSummary:
    | EcommerceOrderRevenueTrackingSummaryResponse
    | null;
  tenantEcommerceOrderRevenueOpsBoard:
    | EcommerceOrderRevenueOpsBoardResponse
    | null;
  selectedTenantEcommerceLandingPageStructure:
    | EcommerceLandingPageStructureResponse
    | null;
  selectedTenantEcommerceWhatsappSalesFlow:
    | EcommerceWhatsappSalesFlowResponse
    | null;
  lastEcommerceWhatsappGrowthHandoff:
    | EcommerceWhatsappGrowthHandoffResponse
    | null;
  selectedTenantEcommerceWhatsappGrowthActivationWorkspace:
    | EcommerceWhatsappGrowthActivationWorkspaceResponse
    | null;
  lastEcommerceWhatsappGrowthActivationPacket:
    | EcommerceWhatsappGrowthActivationPacketResponse
    | null;
  lastEcommerceWhatsappGrowthExecutionBridge:
    | EcommerceWhatsappGrowthExecutionBridgeResponse
    | null;
  lastEcommerceWhatsappGrowthOperatorLaunchPacket:
    | EcommerceWhatsappGrowthOperatorLaunchPacketResponse
    | null;
  lastEcommerceWhatsappGrowthLaunchAcknowledgementPacket:
    | EcommerceWhatsappGrowthLaunchAcknowledgementPacketResponse
    | null;
  lastEcommerceOrderInvoicingBridge:
    | EcommerceOrderInvoicingBridgeResponse
    | null;
  lastEcommerceOrderToInvoiceReadinessPacket:
    | EcommerceOrderToInvoiceReadinessPacketResponse
    | null;
  tenantEcommerceProductEntityChannelReleaseCandidateRegistry:
    | EcommerceProductEntityChannelReleaseCandidateRegistryResponse
    | null;
  selectedTenantEcommerceProductEntityChannelReleaseCandidateDetail:
    | EcommerceProductEntityChannelReleaseCandidateDetailResponse
    | null;
  lastEcommerceProductEntityChannelAssetEntityPublishPreparationPacket:
    | RequestEcommerceProductEntityChannelAssetEntityPublishPreparationPacketResponse
    | null;
  lastEcommerceProductEntityChannelAssetPublishPacket:
    | RequestEcommerceProductEntityChannelAssetPublishPacketResponse
    | null;
  selectedTenantEcommerceProductEntityChannelDraftDetail:
    | EcommerceProductEntityChannelDraftDetailResponse
    | null;
  tenantEcommerceProductEntityDetailLoading: boolean;
  tenantEcommerceProductEntityChannelAssetsWorkspaceLoading: boolean;
  tenantEcommerceProductEntityChannelAssetDraftsWorkspaceLoading: boolean;
  tenantEcommerceProductEntityChannelAssetWorkspaceDetailLoading: boolean;
  tenantEcommerceProductEntityChannelAssetEntityDetailLoading: boolean;
  tenantEcommerceProductEntityChannelReleaseCandidateDetailLoading: boolean;
  tenantEcommerceProductEntityChannelDraftDetailLoading: boolean;
  lastEcommerceProductEntityCommercializationPacket:
    | RequestEcommerceProductEntityCommercializationPacketResponse
    | null;
  lastEcommerceProductEntityChannelDraftActionPacket:
    | RequestEcommerceProductEntityChannelDraftActionPacketResponse
    | null;
  lastEcommerceProductEntityChannelDraftPublishReadinessPacket:
    | RequestEcommerceProductEntityChannelDraftPublishReadinessPacketResponse
    | null;
  selectedTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspace:
    | EcommerceProductEntityChannelDraftPublishPreparationWorkspaceResponse
    | null;
  tenantEcommerceSavedProductEntityChannelDraftRegistry:
    | EcommerceSavedProductEntityChannelDraftRegistryResponse
    | null;
  selectedTenantEcommerceSavedProductEntityChannelDraftDetail:
    | EcommerceSavedProductEntityChannelDraftDetailResponse
    | null;
  lastEcommerceProductSetupDefinitionPacket:
    | RequestEcommerceProductSetupDefinitionPacketResponse
    | null;
  lastEcommerceProductWorkspaceReadinessPacket:
    | RequestEcommerceProductWorkspaceReadinessPacketResponse
    | null;
  selectedTenantEcommerceProductAuthoringDraftDetail:
    | EcommerceProductAuthoringDraftDetailResponse
    | null;
  tenantEcommerceProductAuthoringDraftDetailLoading: boolean;
  lastEcommerceProductAuthoringDraftBrief:
    | RequestEcommerceProductAuthoringDraftBriefResponse
    | null;
  lastEcommerceProductAuthoringDraftRefinementPacket:
    | RequestEcommerceProductAuthoringDraftRefinementPacketResponse
    | null;
  ecommerceProductAuthoringActionLoading: boolean;
  ecommerceProductAuthoringRefinementActionLoading: boolean;
  ecommerceProductAuthoringSaveActionLoading: boolean;
  ecommerceProductWorkspacePromotionActionLoading: string | null;
  ecommerceProductWorkspaceSaveActionLoading: string | null;
  ecommerceProductSetupPromotionActionLoading: string | null;
  ecommerceProductSetupSaveActionLoading: string | null;
  ecommerceProductEntityPromotionActionLoading: string | null;
  ecommerceProductEntityCommercializationActionLoading: string | null;
  ecommerceProductEntityChannelDraftActionPacketLoading: string | null;
  ecommerceProductEntityChannelDraftPublishReadinessPacketLoading: string | null;
  tenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceLoading: boolean;
  ecommerceProductEntityChannelDraftSaveActionLoading: string | null;
  tenantEcommerceSavedProductEntityChannelDraftDetailLoading: boolean;
  ecommerceSavedProductEntityChannelDraftSaveActionLoading: string | null;
  ecommerceProductEntityChannelAssetWorkspacePromotionActionLoading: string | null;
  ecommerceProductEntityChannelAssetPublishPacketLoading: string | null;
  ecommerceProductEntityChannelAssetEntityPromotionActionLoading: string | null;
  ecommerceProductEntityChannelAssetEntitySaveActionLoading: string | null;
  ecommerceProductEntityChannelAssetEntityPublishPreparationPacketLoading:
    | string
    | null;
  ecommerceProductEntityChannelReleaseCandidatePromotionActionLoading:
    | string
    | null;
  ecommerceChannelReleaseHandoffPacketLoading: string | null;
  ecommerceChannelReleaseApprovalPacketLoading: string | null;
  ecommerceChannelReleaseLaunchPacketLoading: string | null;
  ecommerceCatalogStorefrontPlacementPacketLoading: string | null;
  ecommerceCatalogMerchandisingPacketLoading: string | null;
  ecommerceOrderInvoicingBridgeLoading: string | null;
  ecommerceCheckoutCustomerCapturePacketLoading: string | null;
  ecommerceOrderToInvoiceReadinessPacketLoading: string | null;
  ecommerceOrderDraftSaveLoading: string | null;
  tenantEcommerceOrderDraftDetailLoading: boolean;
  ecommerceCheckoutCloseoutPacketLoading: string | null;
  ecommerceOrderToGrowthConversationBridgeLoading: string | null;
  tenantEcommerceOrderReviewWorkspaceLoading: boolean;
  ecommerceOrderApprovalDecisionLoading: string | null;
  ecommerceOrderHandoffDecisionLoading: string | null;
  ecommerceOrderInvoiceDraftBridgeLoading: string | null;
  tenantEcommerceInvoiceDraftIntakeWorkspaceLoading: boolean;
  tenantEcommerceOrderHandoffExecutionWorkspaceLoading: boolean;
  ecommerceInvoiceDraftOpenBridgeLoading: string | null;
  tenantEcommerceOrderHoldResolutionWorkspaceLoading: boolean;
  ecommerceInvoiceDraftLaunchBridgeLoading: string | null;
  ecommerceOrderRouteResolutionPacketLoading: string | null;
  tenantEcommerceInvoiceDraftHandoffWorkspaceLoading: boolean;
  ecommerceInvoiceHandoffAcknowledgementLoading: string | null;
  tenantEcommerceOrderFiscalDataCompletionWorkspaceLoading: boolean;
  tenantEcommerceOrderPaymentReadinessWorkspaceLoading: boolean;
  tenantEcommerceOrderPaymentConfirmationWorkspaceLoading: boolean;
  ecommerceOrderPaymentConfirmationDecisionLoading: string | null;
  tenantEcommerceOrderPaymentConfirmationLogLoading: boolean;
  tenantEcommerceOrderFulfillmentReadinessWorkspaceLoading: boolean;
  tenantEcommerceOrderFulfillmentExecutionWorkspaceLoading: boolean;
  tenantEcommerceOrderFulfillmentDeliveryWorkspaceLoading: boolean;
  tenantEcommerceOrderGrowthFollowUpWorkspaceLoading: boolean;
  tenantEcommerceOrderOperatorWorkboardLoading: boolean;
  tenantEcommerceOrderOpsPriorityQueueLoading: boolean;
  tenantEcommerceOrderOpsAttentionWorkspaceLoading: boolean;
  tenantEcommerceOrderOpsEscalationBoardLoading: boolean;
  tenantEcommerceOrderStatusLifecycleDetailLoading: boolean;
  tenantEcommerceOrderPostSaleLifecycleRegistryLoading: boolean;
  tenantEcommerceOrderPostSaleLifecycleDetailLoading: boolean;
  tenantEcommerceOrderPostSaleOpsBoardLoading: boolean;
  tenantEcommerceOrderRevenueTrackingSummaryLoading: boolean;
  tenantEcommerceOrderRevenueOpsBoardLoading: boolean;
  ecommerceWhatsappGrowthHandoffLoading: string | null;
  ecommerceWhatsappGrowthActivationPacketLoading: string | null;
  ecommerceWhatsappGrowthExecutionBridgeLoading: string | null;
  ecommerceWhatsappGrowthOperatorLaunchPacketLoading: string | null;
  ecommerceWhatsappGrowthLaunchAcknowledgementPacketLoading: string | null;
  ecommerceProductSetupDefinitionActionLoading: string | null;
  ecommerceProductWorkspaceReadinessActionLoading: string | null;
  tenantEcommerceStoreProfileWorkspace: EcommerceStoreProfileWorkspaceResponse | null;
  tenantEcommerceStoreSetupWorkspace: EcommerceStoreSetupWorkspaceResponse | null;
  tenantAiEcommerceLaunchWorkspace: EcommerceLaunchWorkspaceResponse | null;
  tenantEcommerceLaunchPlanRegistry: EcommerceLaunchPlanRegistryResponse | null;
  selectedTenantEcommerceLaunchPlanDetail: EcommerceLaunchPlanDetailResponse | null;
  tenantEcommerceLaunchPlanDetailLoading: boolean;
  lastEcommerceLaunchActivationReadiness:
    | RequestEcommerceLaunchPlanActivationReadinessResponse
    | null;
  ecommerceLaunchPlanActionLoading: boolean;
  ecommerceLaunchError: string | null;
  ecommerceLaunchActionMessage: string | null;
  ecommerceLaunchAssistantAiEnvelope: AiSuggestionEnvelopeResponse | null;
  activeEcommerceAiAgent: AiAgentCatalogResponse | null;
  activeEcommerceAiPrimarySurface:
    | AiOperatingModelAgentResponse['primarySurface']
    | null;
  activeEcommerceAiPromptPack: AiOperatingModelAgentResponse['promptPack'] | null;
  activeEcommerceAiApprovalPolicies: AiApprovalPolicyResponse[];
  activeEcommerceAiToolAccess: AiOperatingModelAgentResponse['toolAccess'];
  activeEcommerceAiSuggestionRuns: AiSuggestionRunResponse[];
  selectedEcommerceAiSuggestionRunDetail: AiSuggestionRunDetailResponse | null;
  ecommerceLaunchAssistantAiApprovalRequests: AiApprovalRequestResponse[];
  latestApprovedEcommerceAiApprovalRequest: AiApprovalRequestResponse | null;
  actionLoading: string | null;
  ecommerceAgentActionLoadingState: string | null;
  formatDate: (value: string | null) => string;
  humanizeKey: (value: string | null) => string;
  operationalStatusTone: (
    status: 'healthy' | 'warning' | 'critical',
  ) => string;
  operationalStatusLabel: (
    status: 'healthy' | 'warning' | 'critical',
  ) => string;
  aiAgentAvailabilityTone: (
    availability: AiAgentCatalogResponse['availability'],
  ) => string;
  aiAgentAvailabilityLabel: (
    availability: AiAgentCatalogResponse['availability'],
  ) => string;
  getDedicatedActionKey: (
    action: 'load_detail' | 'request_approval' | 'review_approval',
    targetId: string,
  ) => string;
  onRefresh: () => void;
  onSelectProductDraft: (draftId: string) => void;
  onRequestProductDraftBrief: () => void;
  onRequestProductDraftRefinementPacket: () => void;
  onSaveProductDraft: () => void;
  onPromoteSavedDraftToProductWorkspace: (savedDraftId: string) => void;
  onSelectProductWorkspace: (savedDraftId: string) => void;
  onUpdateProductWorkspaceEditableSnapshot: (patch: {
    title: string;
    pricingBand: string | null;
    offerAngle: string | null;
    primaryCta: string | null;
    channelSequence: string[];
  }) => void;
  onPromoteProductWorkspaceToProductSetup: () => void;
  onRequestProductWorkspaceReadinessPacket: () => void;
  onSelectProductSetup: (productSetupId: string) => void;
  onRequestProductSetupDefinitionPacket: () => void;
  onUpdateProductSetupEditableSnapshot: (patch: {
    title: string;
    pricingBand: string | null;
    offerAngle: string | null;
    primaryCta: string | null;
    channelSequence: string[];
  }) => void;
  onPromoteProductSetupToProductEntity: () => void;
  onSelectProductEntity: (productEntityId: string) => void;
  onRequestProductEntityCommercializationPacket: () => void;
  onSelectProductEntityChannelDraft: (
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ) => void;
  onRequestProductEntityChannelDraftActionPacket: () => void;
  onRequestProductEntityChannelDraftPublishReadinessPacket: () => void;
  onSelectProductEntityChannelDraftPublishPreparationWorkspace: () => void;
  onSaveProductEntityChannelDraft: () => void;
  onSelectSavedProductEntityChannelDraft: (
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ) => void;
  onUpdateSavedProductEntityChannelDraftEditableSnapshot: (patch: {
    title: string;
    headline: string;
    draftBlueprint: string[];
    recommendedArtifacts: string[];
    nextMilestone: string;
  }) => void;
  onPromoteSavedProductEntityChannelDraftToChannelAssetWorkspace: () => void;
  onSelectProductEntityChannelAssetWorkspace: (
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ) => void;
  onRequestProductEntityChannelAssetPublishPacket: () => void;
  onPromoteProductEntityChannelAssetWorkspaceToChannelAssetEntity: () => void;
  onUpdateProductEntityChannelAssetEntityEditableSnapshot: (patch: {
    title: string;
    headline: string;
    draftBlueprint: string[];
    recommendedArtifacts: string[];
    nextMilestone: string;
  }) => void;
  onRequestProductEntityChannelAssetEntityPublishPreparationPacket: () => void;
  onSelectProductEntityChannelAssetEntity: (
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ) => void;
  onPromoteProductEntityChannelAssetEntityToReleaseCandidate: () => void;
  onRequestChannelReleaseHandoffPacket: () => void;
  onRequestChannelReleaseApprovalPacket: () => void;
  onLoadStorefrontPreviewWorkspace: () => void;
  onLoadStorefrontPublishReviewWorkspace: () => void;
  onLoadLandingPublishArtifact: () => void;
  onLoadStorefrontReleaseCandidateBrief: () => void;
  onLoadStorefrontReleaseControlWorkspace: () => void;
  onLoadStorefrontGoLiveManifest: () => void;
  onLoadLiveStorefrontSessionWorkspace: () => void;
  onRequestChannelReleaseLaunchPacket: () => void;
  onLoadCatalogListingAsset: () => void;
  onRequestCatalogStorefrontPlacementPacket: () => void;
  onRequestCatalogMerchandisingPacket: () => void;
  onLoadCheckoutOrderIntakeWorkspace: () => void;
  onRequestCheckoutCustomerCapturePacket: () => void;
  onSaveOrderDraft: () => void;
  onSelectOrderDraft: (orderDraftId: string) => void;
  onRequestCheckoutCloseoutPacket: () => void;
  onRequestOrderToGrowthConversationBridge: () => void;
  onLoadOrderReviewWorkspace: () => void;
  onRequestOrderApprovalDecision: () => void;
  onRequestOrderHandoffDecision: () => void;
  onRequestOrderInvoiceDraftBridge: () => void;
  onLoadInvoiceDraftIntakeWorkspace: () => void;
  onLoadOrderHandoffExecutionWorkspace: () => void;
  onRequestInvoiceDraftOpenBridge: () => void;
  onLoadOrderHoldResolutionWorkspace: () => void;
  onRequestInvoiceDraftLaunchBridge: () => void;
  onRequestOrderRouteResolutionPacket: () => void;
  onLoadInvoiceDraftHandoffWorkspace: () => void;
  onRequestInvoiceHandoffAcknowledgement: () => void;
  onLoadOrderFiscalDataCompletionWorkspace: () => void;
  onLoadOrderPaymentReadinessWorkspace: () => void;
  onLoadOrderPaymentConfirmationWorkspace: () => void;
  onRequestOrderPaymentConfirmationDecision: () => void;
  onLoadOrderPaymentConfirmationLog: () => void;
  onLoadOrderFulfillmentReadinessWorkspace: () => void;
  onLoadOrderFulfillmentExecutionWorkspace: () => void;
  onLoadOrderFulfillmentDeliveryWorkspace: () => void;
  onLoadOrderGrowthFollowUpWorkspace: () => void;
  onLoadOrderOperatorWorkboard: () => void;
  onLoadOrderOpsPriorityQueue: () => void;
  onLoadOrderOpsAttentionWorkspace: () => void;
  onLoadOrderOpsEscalationBoard: () => void;
  onSelectOrderStatusLifecycle: (orderDraftId: string) => void;
  onLoadOrderPostSaleLifecycleRegistry: () => void;
  onSelectOrderPostSaleLifecycle: (orderDraftId: string) => void;
  onLoadOrderPostSaleOpsBoard: () => void;
  onLoadOrderRevenueTrackingSummary: () => void;
  onLoadOrderRevenueOpsBoard: () => void;
  onRequestWhatsappGrowthHandoff: () => void;
  onLoadWhatsappGrowthActivationWorkspace: () => void;
  onRequestWhatsappGrowthActivationPacket: () => void;
  onRequestWhatsappGrowthExecutionBridge: () => void;
  onRequestWhatsappGrowthOperatorLaunchPacket: () => void;
  onRequestWhatsappGrowthLaunchAcknowledgementPacket: () => void;
  onRequestOrderInvoicingBridge: () => void;
  onRequestOrderToInvoiceReadinessPacket: () => void;
  onSelectProductEntityChannelReleaseCandidate: (
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ) => void;
  onSelectLaunchPlan: (launchPlanId: string) => void;
  onRequestActivationReadiness: () => void;
  onPrepare: () => void;
  onOpenDetail: (runId: string) => void;
  onRequestApproval: (runId: string) => void;
  onReviewApproval: (
    requestId: string,
    status: 'approved' | 'rejected',
  ) => void;
};

const ECOMMERCE_AGENT_KEY = 'ecommerce-launch-assistant';

export function AiEcommerceLaunchSection({
  hasSession,
  hasCurrentTenancy,
  canReadTenantEntitlements,
  tenantAiEcommerceLaunchWorkspaceLoading,
  tenantEcommerceProductAuthoringWorkspace,
  tenantEcommerceSavedProductDraftRegistry,
  tenantEcommerceProductWorkspaceRegistry,
  tenantEcommerceProductSetupRegistry,
  tenantEcommerceProductEntityRegistry,
  selectedTenantEcommerceProductWorkspaceDetail,
  tenantEcommerceProductWorkspaceDetailLoading,
  selectedTenantEcommerceProductSetupDetail,
  tenantEcommerceProductSetupDetailLoading,
  selectedTenantEcommerceProductEntityDetail,
  selectedTenantEcommerceProductEntityChannelAssetsWorkspace,
  selectedTenantEcommerceProductEntityChannelAssetDraftsWorkspace,
  tenantEcommerceProductEntityChannelAssetWorkspaceRegistry,
  selectedTenantEcommerceProductEntityChannelAssetWorkspaceDetail,
  tenantEcommerceProductEntityChannelAssetEntityRegistry,
  selectedTenantEcommerceProductEntityChannelAssetEntityDetail,
  selectedTenantEcommerceLandingAssetEntityWorkspace,
  selectedTenantEcommerceCatalogAssetEntityWorkspace,
  selectedTenantEcommerceCatalogCommercialCard,
  selectedTenantEcommerceCatalogListingAsset,
  selectedTenantEcommerceStorefrontReleaseCandidateBrief,
  selectedTenantEcommerceStorefrontReleaseControlWorkspace,
  selectedTenantEcommerceStorefrontGoLiveManifest,
  selectedTenantEcommerceLiveStorefrontSessionWorkspace,
  selectedTenantEcommerceStorefrontPreviewWorkspace,
  selectedTenantEcommerceStorefrontPublishReviewWorkspace,
  selectedTenantEcommerceLandingPublishArtifact,
  selectedTenantEcommerceWhatsappChannelSequenceWorkspace,
  selectedTenantEcommerceChannelReleaseWorkbench,
  selectedTenantEcommerceChannelReleaseExecutionReadiness,
  lastEcommerceChannelReleaseHandoffPacket,
  lastEcommerceChannelReleaseApprovalPacket,
  lastEcommerceChannelReleaseLaunchPacket,
  lastEcommerceCatalogStorefrontPlacementPacket,
  lastEcommerceCatalogMerchandisingPacket,
  selectedTenantEcommerceCheckoutOrderIntakeWorkspace,
  lastEcommerceCheckoutCustomerCapturePacket,
  tenantEcommerceOrderDraftRegistry,
  selectedTenantEcommerceOrderDraftDetail,
  lastEcommerceCheckoutCloseoutPacket,
  lastEcommerceOrderToGrowthConversationBridge,
  selectedTenantEcommerceOrderReviewWorkspace,
  lastEcommerceOrderApprovalDecision,
  lastEcommerceOrderHandoffDecision,
  lastEcommerceOrderInvoiceDraftBridge,
  selectedTenantEcommerceInvoiceDraftIntakeWorkspace,
  selectedTenantEcommerceOrderHandoffExecutionWorkspace,
  lastEcommerceInvoiceDraftOpenBridge,
  selectedTenantEcommerceOrderHoldResolutionWorkspace,
  lastEcommerceInvoiceDraftLaunchBridge,
  lastEcommerceOrderRouteResolutionPacket,
  selectedTenantEcommerceInvoiceDraftHandoffWorkspace,
  lastEcommerceInvoiceHandoffAcknowledgement,
  selectedTenantEcommerceOrderFiscalDataCompletionWorkspace,
  selectedTenantEcommerceOrderPaymentReadinessWorkspace,
  selectedTenantEcommerceOrderPaymentConfirmationWorkspace,
  lastEcommerceOrderPaymentConfirmationDecision,
  selectedTenantEcommerceOrderPaymentConfirmationLog,
  selectedTenantEcommerceOrderFulfillmentReadinessWorkspace,
  selectedTenantEcommerceOrderFulfillmentExecutionWorkspace,
  selectedTenantEcommerceOrderFulfillmentDeliveryWorkspace,
  selectedTenantEcommerceOrderGrowthFollowUpWorkspace,
  tenantEcommerceOrderOperatorWorkboard,
  tenantEcommerceOrderOpsPriorityQueue,
  tenantEcommerceOrderOpsAttentionWorkspace,
  tenantEcommerceOrderOpsEscalationBoard,
  tenantEcommerceOrderStatusLifecycleRegistry,
  selectedTenantEcommerceOrderStatusLifecycleDetail,
  tenantEcommerceOrderPostSaleLifecycleRegistry,
  selectedTenantEcommerceOrderPostSaleLifecycleDetail,
  tenantEcommerceOrderPostSaleOpsBoard,
  tenantEcommerceOrderRevenueTrackingSummary,
  tenantEcommerceOrderRevenueOpsBoard,
  selectedTenantEcommerceLandingPageStructure,
  selectedTenantEcommerceWhatsappSalesFlow,
  lastEcommerceWhatsappGrowthHandoff,
  selectedTenantEcommerceWhatsappGrowthActivationWorkspace,
  lastEcommerceWhatsappGrowthActivationPacket,
  lastEcommerceWhatsappGrowthExecutionBridge,
  lastEcommerceWhatsappGrowthOperatorLaunchPacket,
  lastEcommerceWhatsappGrowthLaunchAcknowledgementPacket,
  lastEcommerceOrderInvoicingBridge,
  lastEcommerceOrderToInvoiceReadinessPacket,
  tenantEcommerceProductEntityChannelReleaseCandidateRegistry,
  selectedTenantEcommerceProductEntityChannelReleaseCandidateDetail,
  lastEcommerceProductEntityChannelAssetEntityPublishPreparationPacket,
  lastEcommerceProductEntityChannelAssetPublishPacket,
  selectedTenantEcommerceProductEntityChannelDraftDetail,
  tenantEcommerceProductEntityDetailLoading,
  tenantEcommerceProductEntityChannelAssetsWorkspaceLoading,
  tenantEcommerceProductEntityChannelAssetDraftsWorkspaceLoading,
  tenantEcommerceProductEntityChannelAssetWorkspaceDetailLoading,
  tenantEcommerceProductEntityChannelAssetEntityDetailLoading,
  tenantEcommerceProductEntityChannelReleaseCandidateDetailLoading,
  tenantEcommerceProductEntityChannelDraftDetailLoading,
  lastEcommerceProductEntityCommercializationPacket,
  lastEcommerceProductEntityChannelDraftActionPacket,
  lastEcommerceProductEntityChannelDraftPublishReadinessPacket,
  selectedTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspace,
  tenantEcommerceSavedProductEntityChannelDraftRegistry,
  selectedTenantEcommerceSavedProductEntityChannelDraftDetail,
  lastEcommerceProductSetupDefinitionPacket,
  lastEcommerceProductWorkspaceReadinessPacket,
  selectedTenantEcommerceProductAuthoringDraftDetail,
  tenantEcommerceProductAuthoringDraftDetailLoading,
  lastEcommerceProductAuthoringDraftBrief,
  lastEcommerceProductAuthoringDraftRefinementPacket,
  ecommerceProductAuthoringActionLoading,
  ecommerceProductAuthoringRefinementActionLoading,
  ecommerceProductAuthoringSaveActionLoading,
  ecommerceProductWorkspacePromotionActionLoading,
  ecommerceProductWorkspaceSaveActionLoading,
  ecommerceProductSetupPromotionActionLoading,
  ecommerceProductSetupSaveActionLoading,
  ecommerceProductEntityPromotionActionLoading,
  ecommerceProductEntityCommercializationActionLoading,
  ecommerceProductEntityChannelDraftActionPacketLoading,
  ecommerceProductEntityChannelDraftPublishReadinessPacketLoading,
  tenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceLoading,
  ecommerceProductEntityChannelDraftSaveActionLoading,
  tenantEcommerceSavedProductEntityChannelDraftDetailLoading,
  ecommerceSavedProductEntityChannelDraftSaveActionLoading,
  ecommerceProductEntityChannelAssetWorkspacePromotionActionLoading,
  ecommerceProductEntityChannelAssetPublishPacketLoading,
  ecommerceProductEntityChannelAssetEntityPromotionActionLoading,
  ecommerceProductEntityChannelAssetEntitySaveActionLoading,
  ecommerceProductEntityChannelAssetEntityPublishPreparationPacketLoading,
  ecommerceProductEntityChannelReleaseCandidatePromotionActionLoading,
  ecommerceChannelReleaseHandoffPacketLoading,
  ecommerceChannelReleaseApprovalPacketLoading,
  ecommerceChannelReleaseLaunchPacketLoading,
  ecommerceCatalogStorefrontPlacementPacketLoading,
  ecommerceCatalogMerchandisingPacketLoading,
  ecommerceOrderInvoicingBridgeLoading,
  ecommerceCheckoutCustomerCapturePacketLoading,
  ecommerceOrderToInvoiceReadinessPacketLoading,
  ecommerceOrderDraftSaveLoading,
  tenantEcommerceOrderDraftDetailLoading,
  ecommerceCheckoutCloseoutPacketLoading,
  ecommerceOrderToGrowthConversationBridgeLoading,
  tenantEcommerceOrderReviewWorkspaceLoading,
  ecommerceOrderApprovalDecisionLoading,
  ecommerceOrderHandoffDecisionLoading,
  ecommerceOrderInvoiceDraftBridgeLoading,
  tenantEcommerceInvoiceDraftIntakeWorkspaceLoading,
  tenantEcommerceOrderHandoffExecutionWorkspaceLoading,
  ecommerceInvoiceDraftOpenBridgeLoading,
  tenantEcommerceOrderHoldResolutionWorkspaceLoading,
  ecommerceInvoiceDraftLaunchBridgeLoading,
  ecommerceOrderRouteResolutionPacketLoading,
  tenantEcommerceInvoiceDraftHandoffWorkspaceLoading,
  ecommerceInvoiceHandoffAcknowledgementLoading,
  tenantEcommerceOrderFiscalDataCompletionWorkspaceLoading,
  tenantEcommerceOrderPaymentReadinessWorkspaceLoading,
  tenantEcommerceOrderPaymentConfirmationWorkspaceLoading,
  ecommerceOrderPaymentConfirmationDecisionLoading,
  tenantEcommerceOrderPaymentConfirmationLogLoading,
  tenantEcommerceOrderFulfillmentReadinessWorkspaceLoading,
  tenantEcommerceOrderFulfillmentExecutionWorkspaceLoading,
  tenantEcommerceOrderFulfillmentDeliveryWorkspaceLoading,
  tenantEcommerceOrderGrowthFollowUpWorkspaceLoading,
  tenantEcommerceOrderOperatorWorkboardLoading,
  tenantEcommerceOrderOpsPriorityQueueLoading,
  tenantEcommerceOrderOpsAttentionWorkspaceLoading,
  tenantEcommerceOrderOpsEscalationBoardLoading,
  tenantEcommerceOrderStatusLifecycleDetailLoading,
  tenantEcommerceOrderPostSaleLifecycleRegistryLoading,
  tenantEcommerceOrderPostSaleLifecycleDetailLoading,
  tenantEcommerceOrderPostSaleOpsBoardLoading,
  tenantEcommerceOrderRevenueTrackingSummaryLoading,
  tenantEcommerceOrderRevenueOpsBoardLoading,
  ecommerceWhatsappGrowthHandoffLoading,
  ecommerceWhatsappGrowthActivationPacketLoading,
  ecommerceWhatsappGrowthExecutionBridgeLoading,
  ecommerceWhatsappGrowthOperatorLaunchPacketLoading,
  ecommerceWhatsappGrowthLaunchAcknowledgementPacketLoading,
  ecommerceProductSetupDefinitionActionLoading,
  ecommerceProductWorkspaceReadinessActionLoading,
  tenantEcommerceStoreProfileWorkspace,
  tenantEcommerceStoreSetupWorkspace,
  tenantAiEcommerceLaunchWorkspace,
  tenantEcommerceLaunchPlanRegistry,
  selectedTenantEcommerceLaunchPlanDetail,
  tenantEcommerceLaunchPlanDetailLoading,
  lastEcommerceLaunchActivationReadiness,
  ecommerceLaunchPlanActionLoading,
  ecommerceLaunchError,
  ecommerceLaunchActionMessage,
  ecommerceLaunchAssistantAiEnvelope,
  activeEcommerceAiAgent,
  activeEcommerceAiPrimarySurface,
  activeEcommerceAiPromptPack,
  activeEcommerceAiApprovalPolicies,
  activeEcommerceAiToolAccess,
  activeEcommerceAiSuggestionRuns,
  selectedEcommerceAiSuggestionRunDetail,
  ecommerceLaunchAssistantAiApprovalRequests,
  latestApprovedEcommerceAiApprovalRequest,
  actionLoading,
  ecommerceAgentActionLoadingState,
  formatDate,
  humanizeKey,
  operationalStatusTone,
  operationalStatusLabel,
  aiAgentAvailabilityTone,
  aiAgentAvailabilityLabel,
  getDedicatedActionKey,
  onRefresh,
  onSelectProductDraft,
  onRequestProductDraftBrief,
  onRequestProductDraftRefinementPacket,
  onSaveProductDraft,
  onPromoteSavedDraftToProductWorkspace,
  onSelectProductWorkspace,
  onUpdateProductWorkspaceEditableSnapshot,
  onPromoteProductWorkspaceToProductSetup,
  onRequestProductWorkspaceReadinessPacket,
  onSelectProductSetup,
  onRequestProductSetupDefinitionPacket,
  onUpdateProductSetupEditableSnapshot,
  onPromoteProductSetupToProductEntity,
  onSelectProductEntity,
  onRequestProductEntityCommercializationPacket,
  onSelectProductEntityChannelDraft,
  onRequestProductEntityChannelDraftActionPacket,
  onRequestProductEntityChannelDraftPublishReadinessPacket,
  onSelectProductEntityChannelDraftPublishPreparationWorkspace,
  onSaveProductEntityChannelDraft,
  onSelectSavedProductEntityChannelDraft,
  onUpdateSavedProductEntityChannelDraftEditableSnapshot,
  onPromoteSavedProductEntityChannelDraftToChannelAssetWorkspace,
  onSelectProductEntityChannelAssetWorkspace,
  onRequestProductEntityChannelAssetPublishPacket,
  onPromoteProductEntityChannelAssetWorkspaceToChannelAssetEntity,
  onUpdateProductEntityChannelAssetEntityEditableSnapshot,
  onRequestProductEntityChannelAssetEntityPublishPreparationPacket,
  onSelectProductEntityChannelAssetEntity,
  onPromoteProductEntityChannelAssetEntityToReleaseCandidate,
  onRequestChannelReleaseHandoffPacket,
  onRequestChannelReleaseApprovalPacket,
  onLoadStorefrontPreviewWorkspace,
  onLoadStorefrontPublishReviewWorkspace,
  onLoadLandingPublishArtifact,
  onLoadStorefrontReleaseCandidateBrief,
  onLoadStorefrontReleaseControlWorkspace,
  onLoadStorefrontGoLiveManifest,
  onLoadLiveStorefrontSessionWorkspace,
  onRequestChannelReleaseLaunchPacket,
  onLoadCatalogListingAsset,
  onRequestCatalogStorefrontPlacementPacket,
  onRequestCatalogMerchandisingPacket,
  onLoadCheckoutOrderIntakeWorkspace,
  onRequestCheckoutCustomerCapturePacket,
  onSaveOrderDraft,
  onSelectOrderDraft,
  onRequestCheckoutCloseoutPacket,
  onRequestOrderToGrowthConversationBridge,
  onLoadOrderReviewWorkspace,
  onRequestOrderApprovalDecision,
  onRequestOrderHandoffDecision,
  onRequestOrderInvoiceDraftBridge,
  onLoadInvoiceDraftIntakeWorkspace,
  onLoadOrderHandoffExecutionWorkspace,
  onRequestInvoiceDraftOpenBridge,
  onLoadOrderHoldResolutionWorkspace,
  onRequestInvoiceDraftLaunchBridge,
  onRequestOrderRouteResolutionPacket,
  onLoadInvoiceDraftHandoffWorkspace,
  onRequestInvoiceHandoffAcknowledgement,
  onLoadOrderFiscalDataCompletionWorkspace,
  onLoadOrderPaymentReadinessWorkspace,
  onLoadOrderPaymentConfirmationWorkspace,
  onRequestOrderPaymentConfirmationDecision,
  onLoadOrderPaymentConfirmationLog,
  onLoadOrderFulfillmentReadinessWorkspace,
  onLoadOrderFulfillmentExecutionWorkspace,
  onLoadOrderFulfillmentDeliveryWorkspace,
  onLoadOrderGrowthFollowUpWorkspace,
  onLoadOrderOperatorWorkboard,
  onLoadOrderOpsPriorityQueue,
  onLoadOrderOpsAttentionWorkspace,
  onLoadOrderOpsEscalationBoard,
  onSelectOrderStatusLifecycle,
  onLoadOrderPostSaleLifecycleRegistry,
  onSelectOrderPostSaleLifecycle,
  onLoadOrderPostSaleOpsBoard,
  onLoadOrderRevenueTrackingSummary,
  onLoadOrderRevenueOpsBoard,
  onRequestWhatsappGrowthHandoff,
  onLoadWhatsappGrowthActivationWorkspace,
  onRequestWhatsappGrowthActivationPacket,
  onRequestWhatsappGrowthExecutionBridge,
  onRequestWhatsappGrowthOperatorLaunchPacket,
  onRequestWhatsappGrowthLaunchAcknowledgementPacket,
  onRequestOrderInvoicingBridge,
  onRequestOrderToInvoiceReadinessPacket,
  onSelectProductEntityChannelReleaseCandidate,
  onSelectLaunchPlan,
  onRequestActivationReadiness,
  onPrepare,
  onOpenDetail,
  onRequestApproval,
  onReviewApproval,
}: Props) {
  const [productWorkspaceTitle, setProductWorkspaceTitle] = useState('');
  const [productWorkspacePricingBand, setProductWorkspacePricingBand] =
    useState('');
  const [productWorkspaceOfferAngle, setProductWorkspaceOfferAngle] =
    useState('');
  const [productWorkspacePrimaryCta, setProductWorkspacePrimaryCta] =
    useState('');
  const [productWorkspaceChannelSequence, setProductWorkspaceChannelSequence] =
    useState('');
  const [productSetupTitle, setProductSetupTitle] = useState('');
  const [productSetupPricingBand, setProductSetupPricingBand] = useState('');
  const [productSetupOfferAngle, setProductSetupOfferAngle] = useState('');
  const [productSetupPrimaryCta, setProductSetupPrimaryCta] = useState('');
  const [productSetupChannelSequence, setProductSetupChannelSequence] =
    useState('');
  const [savedChannelDraftTitle, setSavedChannelDraftTitle] = useState('');
  const [savedChannelDraftHeadline, setSavedChannelDraftHeadline] = useState('');
  const [savedChannelDraftBlueprint, setSavedChannelDraftBlueprint] =
    useState('');
  const [
    savedChannelDraftRecommendedArtifacts,
    setSavedChannelDraftRecommendedArtifacts,
  ] = useState('');
  const [savedChannelDraftNextMilestone, setSavedChannelDraftNextMilestone] =
    useState('');
  const [assetEntityTitle, setAssetEntityTitle] = useState('');
  const [assetEntityHeadline, setAssetEntityHeadline] = useState('');
  const [assetEntityBlueprint, setAssetEntityBlueprint] = useState('');
  const [assetEntityRecommendedArtifacts, setAssetEntityRecommendedArtifacts] =
    useState('');
  const [assetEntityNextMilestone, setAssetEntityNextMilestone] = useState('');

  useEffect(() => {
    const snapshot =
      selectedTenantEcommerceProductWorkspaceDetail?.workspace.editableSnapshot;

    if (!snapshot) {
      setProductWorkspaceTitle('');
      setProductWorkspacePricingBand('');
      setProductWorkspaceOfferAngle('');
      setProductWorkspacePrimaryCta('');
      setProductWorkspaceChannelSequence('');
      return;
    }

    setProductWorkspaceTitle(snapshot.title);
    setProductWorkspacePricingBand(snapshot.pricingBand ?? '');
    setProductWorkspaceOfferAngle(snapshot.offerAngle ?? '');
    setProductWorkspacePrimaryCta(snapshot.primaryCta ?? '');
    setProductWorkspaceChannelSequence(snapshot.channelSequence.join('\n'));
  }, [selectedTenantEcommerceProductWorkspaceDetail]);

  useEffect(() => {
    const setup = selectedTenantEcommerceProductSetupDetail?.productSetup;

    if (!setup) {
      setProductSetupTitle('');
      setProductSetupPricingBand('');
      setProductSetupOfferAngle('');
      setProductSetupPrimaryCta('');
      setProductSetupChannelSequence('');
      return;
    }

    setProductSetupTitle(setup.title);
    setProductSetupPricingBand(setup.pricingBand ?? '');
    setProductSetupOfferAngle(setup.offerAngle ?? '');
    setProductSetupPrimaryCta(setup.primaryCta ?? '');
    setProductSetupChannelSequence(setup.channelSequence.join('\n'));
  }, [selectedTenantEcommerceProductSetupDetail]);

  useEffect(() => {
    const savedDraft =
      selectedTenantEcommerceSavedProductEntityChannelDraftDetail?.savedChannelDraft;

    if (!savedDraft) {
      setSavedChannelDraftTitle('');
      setSavedChannelDraftHeadline('');
      setSavedChannelDraftBlueprint('');
      setSavedChannelDraftRecommendedArtifacts('');
      setSavedChannelDraftNextMilestone('');
      return;
    }

    setSavedChannelDraftTitle(savedDraft.title);
    setSavedChannelDraftHeadline(savedDraft.headline);
    setSavedChannelDraftBlueprint(savedDraft.draftBlueprint.join('\n'));
    setSavedChannelDraftRecommendedArtifacts(
      savedDraft.recommendedArtifacts.join('\n'),
    );
    setSavedChannelDraftNextMilestone(savedDraft.nextMilestone);
  }, [selectedTenantEcommerceSavedProductEntityChannelDraftDetail]);

  useEffect(() => {
    const assetEntity =
      selectedTenantEcommerceProductEntityChannelAssetEntityDetail?.assetEntity;

    if (!assetEntity) {
      setAssetEntityTitle('');
      setAssetEntityHeadline('');
      setAssetEntityBlueprint('');
      setAssetEntityRecommendedArtifacts('');
      setAssetEntityNextMilestone('');
      return;
    }

    setAssetEntityTitle(assetEntity.title);
    setAssetEntityHeadline(assetEntity.headline);
    setAssetEntityBlueprint(assetEntity.draftBlueprint.join('\n'));
    setAssetEntityRecommendedArtifacts(
      assetEntity.recommendedArtifacts.join('\n'),
    );
    setAssetEntityNextMilestone(assetEntity.nextMilestone);
  }, [selectedTenantEcommerceProductEntityChannelAssetEntityDetail]);

  return (
    <section className={styles.adminPanel}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.label}>AI ecommerce launch</span>
          <h2>Surface determinística para preparar el primer launch</h2>
        </div>
        {hasSession && hasCurrentTenancy && canReadTenantEntitlements ? (
          <button
            className={styles.ghostButton}
            disabled={tenantAiEcommerceLaunchWorkspaceLoading}
            onClick={onRefresh}
            type="button"
          >
            {tenantAiEcommerceLaunchWorkspaceLoading
              ? 'Refrescando ecommerce AI...'
              : 'Refrescar ecommerce AI'}
          </button>
        ) : null}
      </div>

      {!hasSession ? (
        <div className={styles.emptyState}>
          <p>Primero carguemos la sesión para abrir el workspace AI de ecommerce.</p>
        </div>
      ) : !hasCurrentTenancy ? (
        <div className={styles.emptyState}>
          <p>Selecciona un tenant actual para revisar el launch workspace de ecommerce.</p>
        </div>
      ) : !canReadTenantEntitlements ? (
        <div className={styles.emptyState}>
          <p>
            Este tenant no expone <code>tenant.entitlements.read</code>, así que
            todavía no podemos abrir la superficie AI de ecommerce.
          </p>
        </div>
      ) : (
        <div className={styles.stack}>
          {ecommerceLaunchError ? (
            <p className={styles.errorBanner}>{ecommerceLaunchError}</p>
          ) : null}
          {ecommerceLaunchActionMessage ? (
            <p className={styles.successBanner}>{ecommerceLaunchActionMessage}</p>
          ) : null}

          <div className={styles.twoColumn}>
            <div className={styles.detailCard}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.label}>
                    Product authoring workspace
                  </span>
                  <h3>Starter set de productos draft</h3>
                </div>
                <span
                  className={`${styles.statusPill} ${operationalStatusTone(
                    tenantEcommerceProductAuthoringWorkspace?.summary.tone ??
                      'healthy',
                  )}`}
                >
                  {tenantEcommerceProductAuthoringWorkspace
                    ? operationalStatusLabel(
                        tenantEcommerceProductAuthoringWorkspace.summary.tone,
                      )
                    : 'sin authoring'}
                </span>
              </div>

              {tenantEcommerceProductAuthoringWorkspace ? (
                <div className={styles.stack}>
                  <p>{tenantEcommerceProductAuthoringWorkspace.summary.headline}</p>
                  <small>
                    {tenantEcommerceProductAuthoringWorkspace.summary.detail}
                  </small>
                  <small>
                    Focus sugerido:{' '}
                    {
                      tenantEcommerceProductAuthoringWorkspace.summary
                        .suggestedFocus
                    }
                  </small>

                  <div className={styles.invoiceKpiGrid}>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Collection</span>
                      <strong>
                        {
                          tenantEcommerceProductAuthoringWorkspace.draftCollection
                            .collectionLabel
                        }
                      </strong>
                      <small>Nombre del primer set draft.</small>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Primary channel</span>
                      <strong>
                        {humanizeKey(
                          tenantEcommerceProductAuthoringWorkspace.draftCollection
                            .primaryChannel,
                        )}
                      </strong>
                      <small>Canal sugerido para bajar el primer set.</small>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Draft count</span>
                      <strong>
                        {
                          tenantEcommerceProductAuthoringWorkspace.draftCollection
                            .draftCount
                        }
                      </strong>
                      <small>Productos ancla del starter set.</small>
                    </div>
                  </div>

                  <ul className={styles.featureList}>
                    {tenantEcommerceProductAuthoringWorkspace.drafts.map(
                      (entry) => (
                        <li key={entry.id}>
                          <strong>
                            {entry.title}{' '}
                            <span className={styles.muted}>
                              ({humanizeKey(entry.productType)})
                            </span>
                          </strong>
                          <div>{entry.rationale}</div>
                          <small>
                            Canales sugeridos:{' '}
                            {entry.suggestedChannels.map(humanizeKey).join(', ')}
                          </small>
                          <div className={styles.inlineActions}>
                            <button
                              className={styles.ghostButton}
                              onClick={() => onSelectProductDraft(entry.id)}
                              type="button"
                            >
                              Ver detalle
                            </button>
                          </div>
                        </li>
                      ),
                    )}
                  </ul>

                  {selectedTenantEcommerceProductAuthoringDraftDetail ? (
                    <div className={styles.commercialCard}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Draft detail</span>
                          <h4>
                            {
                              selectedTenantEcommerceProductAuthoringDraftDetail
                                .draft.title
                            }
                          </h4>
                        </div>
                        <span className={styles.badge}>
                          {humanizeKey(
                            selectedTenantEcommerceProductAuthoringDraftDetail
                              .draft.productType,
                          )}
                        </span>
                      </div>
                      <p>
                        {
                          selectedTenantEcommerceProductAuthoringDraftDetail
                            .draft.rationale
                        }
                      </p>
                      <small>
                        Canales:{' '}
                        {selectedTenantEcommerceProductAuthoringDraftDetail.draft.suggestedChannels
                          .map(humanizeKey)
                          .join(', ')}
                      </small>
                      <div className={styles.inlineActions}>
                        <button
                          className={styles.primaryButton}
                          disabled={
                            ecommerceProductAuthoringActionLoading ||
                            tenantEcommerceProductAuthoringDraftDetailLoading
                          }
                          onClick={onRequestProductDraftBrief}
                          type="button"
                        >
                          {ecommerceProductAuthoringActionLoading
                            ? 'Preparando brief...'
                            : 'Solicitar AI brief'}
                        </button>
                        <button
                          className={styles.ghostButton}
                          disabled={
                            ecommerceProductAuthoringRefinementActionLoading ||
                            tenantEcommerceProductAuthoringDraftDetailLoading
                          }
                          onClick={onRequestProductDraftRefinementPacket}
                          type="button"
                        >
                          {ecommerceProductAuthoringRefinementActionLoading
                            ? 'Refinando...'
                            : 'Solicitar refinement packet'}
                        </button>
                        <button
                          className={styles.secondaryButton}
                          disabled={
                            ecommerceProductAuthoringSaveActionLoading ||
                            tenantEcommerceProductAuthoringDraftDetailLoading
                          }
                          onClick={onSaveProductDraft}
                          type="button"
                        >
                          {ecommerceProductAuthoringSaveActionLoading
                            ? 'Guardando...'
                            : 'Guardar catalog candidate'}
                        </button>
                      </div>
                      {lastEcommerceProductAuthoringDraftBrief ? (
                        <div className={styles.stack}>
                          <small>
                            {
                              lastEcommerceProductAuthoringDraftBrief.summary
                            }
                          </small>
                          <small>
                            Inputs requeridos:{' '}
                            {lastEcommerceProductAuthoringDraftBrief.requiredInputs.join(
                              ', ',
                            )}
                          </small>
                          <small>
                            Guardrails:{' '}
                            {lastEcommerceProductAuthoringDraftBrief.guardrails.join(
                              ' | ',
                            )}
                          </small>
                        </div>
                      ) : null}
                      {lastEcommerceProductAuthoringDraftRefinementPacket ? (
                        <div className={styles.stack}>
                          <small>
                            {
                              lastEcommerceProductAuthoringDraftRefinementPacket.summary
                            }
                          </small>
                          <small>
                            Pricing band:{' '}
                            {
                              lastEcommerceProductAuthoringDraftRefinementPacket.pricingBand
                            }
                          </small>
                          <small>
                            Offer angle:{' '}
                            {
                              lastEcommerceProductAuthoringDraftRefinementPacket.offerAngle
                            }
                          </small>
                          <small>
                            Primary CTA:{' '}
                            {
                              lastEcommerceProductAuthoringDraftRefinementPacket.primaryCta
                            }
                          </small>
                          <small>
                            Channel sequence:{' '}
                            {lastEcommerceProductAuthoringDraftRefinementPacket.channelSequence.join(
                              ' -> ',
                            )}
                          </small>
                        </div>
                      ) : null}
                      {selectedTenantEcommerceProductAuthoringDraftDetail.savedDraft ? (
                        <div className={styles.stack}>
                          <small>
                            Guardado como catalog candidate el{' '}
                            {formatDate(
                              selectedTenantEcommerceProductAuthoringDraftDetail.savedDraft.updatedAt,
                            )}
                          </small>
                          <small>
                            Brief status:{' '}
                            {humanizeKey(
                              selectedTenantEcommerceProductAuthoringDraftDetail.savedDraft
                                .briefingStatus,
                            )}
                          </small>
                          <small>
                            Refinement status:{' '}
                            {humanizeKey(
                              selectedTenantEcommerceProductAuthoringDraftDetail.savedDraft
                                .refinementStatus,
                            )}
                          </small>
                          <small>
                            Saved CTA:{' '}
                            {selectedTenantEcommerceProductAuthoringDraftDetail.savedDraft
                              .primaryCta ?? 'Sin CTA'}
                          </small>
                        </div>
                      ) : null}
                    </div>
                  ) : tenantEcommerceProductAuthoringDraftDetailLoading ? (
                    <p className={styles.muted}>
                      Cargando el detalle del draft seleccionado...
                    </p>
                  ) : null}

                  <div className={styles.commercialCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Saved draft registry</span>
                        <h4>Catalog candidates persistidos</h4>
                      </div>
                      <span className={styles.badge}>
                        {tenantEcommerceSavedProductDraftRegistry?.summary
                          .totalSavedDrafts ?? 0}
                      </span>
                    </div>
                    {tenantEcommerceSavedProductDraftRegistry ? (
                      <div className={styles.stack}>
                        <small>
                          {
                            tenantEcommerceSavedProductDraftRegistry.summary
                              .headline
                          }
                        </small>
                        <small>
                          {
                            tenantEcommerceSavedProductDraftRegistry.summary
                              .detail
                          }
                        </small>
                        {tenantEcommerceSavedProductDraftRegistry.drafts.length ===
                        0 ? (
                          <small>
                            Todavía no hay drafts guardados como catalog
                            candidates.
                          </small>
                        ) : (
                          <ul className={styles.customerList}>
                            {tenantEcommerceSavedProductDraftRegistry.drafts.map(
                              (entry) => (
                                <li
                                  className={styles.customerListItem}
                                  key={entry.id}
                                >
                                  <div className={styles.customerListPrimary}>
                                    <strong>{entry.title}</strong>
                                    <small>
                                      {humanizeKey(entry.productType)} ·{' '}
                                      {humanizeKey(entry.refinementStatus)}
                                    </small>
                                  </div>
                                  <div className={styles.inlineActions}>
                                    <button
                                      className={styles.ghostButton}
                                      onClick={() =>
                                        onSelectProductDraft(entry.sourceDraftId)
                                      }
                                      type="button"
                                    >
                                      Abrir draft base
                                    </button>
                                    <button
                                      className={styles.secondaryButton}
                                      disabled={
                                        ecommerceProductWorkspacePromotionActionLoading ===
                                        entry.id
                                      }
                                      onClick={() =>
                                        onPromoteSavedDraftToProductWorkspace(
                                          entry.id,
                                        )
                                      }
                                      type="button"
                                    >
                                      {ecommerceProductWorkspacePromotionActionLoading ===
                                      entry.id
                                        ? 'Promoviendo...'
                                        : entry.promotedToWorkspaceAt
                                          ? 'Reabrir product workspace'
                                          : 'Promover a product workspace'}
                                    </button>
                                    {entry.promotedToWorkspaceAt ? (
                                      <button
                                        className={styles.ghostButton}
                                        onClick={() =>
                                          onSelectProductWorkspace(entry.id)
                                        }
                                        type="button"
                                      >
                                        Ver product workspace
                                      </button>
                                    ) : null}
                                  </div>
                                </li>
                              ),
                            )}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <small className={styles.muted}>
                        Cargando registry de catalog candidates...
                      </small>
                    )}
                  </div>

                  <div className={styles.commercialCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Product workspace registry</span>
                        <h4>Workspaces promovidos</h4>
                      </div>
                      <span className={styles.badge}>
                        {tenantEcommerceProductWorkspaceRegistry?.summary
                          .totalProductWorkspaces ?? 0}
                      </span>
                    </div>
                    {tenantEcommerceProductWorkspaceRegistry ? (
                      <div className={styles.stack}>
                        <small>
                          {
                            tenantEcommerceProductWorkspaceRegistry.summary
                              .headline
                          }
                        </small>
                        <small>
                          {
                            tenantEcommerceProductWorkspaceRegistry.summary
                              .detail
                          }
                        </small>
                        {tenantEcommerceProductWorkspaceRegistry.workspaces
                          .length === 0 ? (
                          <small>
                            Todavía no hay product workspaces promovidos.
                          </small>
                        ) : (
                          <ul className={styles.customerList}>
                            {tenantEcommerceProductWorkspaceRegistry.workspaces.map(
                              (entry) => (
                                <li
                                  className={styles.customerListItem}
                                  key={entry.savedDraftId}
                                >
                                  <div className={styles.customerListPrimary}>
                                    <strong>
                                      {entry.editableSnapshot.title}
                                    </strong>
                                    <small>
                                      {humanizeKey(entry.status)} · promovido{' '}
                                      {formatDate(entry.promotedAt)}
                                    </small>
                                    <small>{entry.detail}</small>
                                  </div>
                                  <div className={styles.badgeRow}>
                                    {entry.editableSnapshot.pricingBand ? (
                                      <span className={styles.badge}>
                                        {entry.editableSnapshot.pricingBand}
                                      </span>
                                    ) : null}
                                    {entry.editableSnapshot.primaryCta ? (
                                      <span className={styles.badge}>
                                        {entry.editableSnapshot.primaryCta}
                                      </span>
                                    ) : null}
                                  </div>
                                  <div className={styles.inlineActions}>
                                    <button
                                      className={styles.ghostButton}
                                      onClick={() =>
                                        onSelectProductWorkspace(
                                          entry.savedDraftId,
                                        )
                                      }
                                      type="button"
                                    >
                                      Ver detalle
                                    </button>
                                  </div>
                                </li>
                              ),
                            )}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <small className={styles.muted}>
                        Cargando registry de product workspaces...
                      </small>
                    )}
                  </div>

                  {selectedTenantEcommerceProductWorkspaceDetail ? (
                    <div className={styles.commercialCard}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Product workspace detail</span>
                          <h4>
                            {
                              selectedTenantEcommerceProductWorkspaceDetail
                                .workspace.editableSnapshot.title
                            }
                          </h4>
                        </div>
                        <span className={styles.badge}>
                          {humanizeKey(
                            selectedTenantEcommerceProductWorkspaceDetail
                              .workspace.status,
                          )}
                        </span>
                      </div>
                      <p>
                        {
                          selectedTenantEcommerceProductWorkspaceDetail.workspace
                            .headline
                        }
                      </p>
                      <small>
                        Source draft:{' '}
                        {selectedTenantEcommerceProductWorkspaceDetail.sourceDraftId}
                      </small>
                      <small>
                        Último guardado:{' '}
                        {formatDate(
                          selectedTenantEcommerceProductWorkspaceDetail
                            .readiness.lastSavedAt,
                        )}
                      </small>
                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Title</span>
                          <input
                            onChange={(event) =>
                              setProductWorkspaceTitle(event.target.value)
                            }
                            value={productWorkspaceTitle}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Pricing band</span>
                          <input
                            onChange={(event) =>
                              setProductWorkspacePricingBand(event.target.value)
                            }
                            value={productWorkspacePricingBand}
                          />
                        </label>
                      </div>
                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Offer angle</span>
                          <textarea
                            onChange={(event) =>
                              setProductWorkspaceOfferAngle(event.target.value)
                            }
                            rows={3}
                            value={productWorkspaceOfferAngle}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Primary CTA</span>
                          <input
                            onChange={(event) =>
                              setProductWorkspacePrimaryCta(event.target.value)
                            }
                            value={productWorkspacePrimaryCta}
                          />
                        </label>
                      </div>
                      <label className={styles.field}>
                        <span>Channel sequence</span>
                        <textarea
                          onChange={(event) =>
                            setProductWorkspaceChannelSequence(
                              event.target.value,
                            )
                          }
                          rows={4}
                          value={productWorkspaceChannelSequence}
                        />
                      </label>
                      <div className={styles.inlineActions}>
                        <button
                          className={styles.secondaryButton}
                          disabled={
                            ecommerceProductWorkspaceSaveActionLoading ===
                            selectedTenantEcommerceProductWorkspaceDetail.workspace
                              .savedDraftId
                          }
                          onClick={() =>
                            onUpdateProductWorkspaceEditableSnapshot({
                              title: productWorkspaceTitle,
                              pricingBand:
                                productWorkspacePricingBand.trim().length > 0
                                  ? productWorkspacePricingBand
                                  : null,
                              offerAngle:
                                productWorkspaceOfferAngle.trim().length > 0
                                  ? productWorkspaceOfferAngle
                                  : null,
                              primaryCta:
                                productWorkspacePrimaryCta.trim().length > 0
                                  ? productWorkspacePrimaryCta
                                  : null,
                              channelSequence:
                                productWorkspaceChannelSequence.split('\n'),
                            })
                          }
                          type="button"
                        >
                          {ecommerceProductWorkspaceSaveActionLoading ===
                          selectedTenantEcommerceProductWorkspaceDetail.workspace
                            .savedDraftId
                            ? 'Guardando workspace...'
                            : 'Guardar snapshot editable'}
                        </button>
                        <button
                          className={styles.secondaryButton}
                          disabled={
                            ecommerceProductSetupPromotionActionLoading ===
                            selectedTenantEcommerceProductWorkspaceDetail.workspace
                              .savedDraftId
                          }
                          onClick={onPromoteProductWorkspaceToProductSetup}
                          type="button"
                        >
                          {ecommerceProductSetupPromotionActionLoading ===
                          selectedTenantEcommerceProductWorkspaceDetail.workspace
                            .savedDraftId
                            ? 'Abriendo setup...'
                            : 'Promover a product setup'}
                        </button>
                        <button
                          className={styles.ghostButton}
                          disabled={
                            ecommerceProductWorkspaceReadinessActionLoading ===
                            selectedTenantEcommerceProductWorkspaceDetail.workspace
                              .savedDraftId
                          }
                          onClick={onRequestProductWorkspaceReadinessPacket}
                          type="button"
                        >
                          {ecommerceProductWorkspaceReadinessActionLoading ===
                          selectedTenantEcommerceProductWorkspaceDetail.workspace
                            .savedDraftId
                            ? 'Preparando readiness...'
                            : 'Solicitar readiness packet'}
                        </button>
                      </div>
                      <small>
                        Brief status:{' '}
                        {humanizeKey(
                          selectedTenantEcommerceProductWorkspaceDetail
                            .readiness.briefingStatus,
                        )}
                      </small>
                      <small>
                        Refinement status:{' '}
                        {humanizeKey(
                          selectedTenantEcommerceProductWorkspaceDetail
                            .readiness.refinementStatus,
                        )}
                      </small>
                      {lastEcommerceProductWorkspaceReadinessPacket ? (
                        <div className={styles.stack}>
                          <small>
                            {
                              lastEcommerceProductWorkspaceReadinessPacket.summary
                            }
                          </small>
                          <small>
                            Decisions:{' '}
                            {lastEcommerceProductWorkspaceReadinessPacket.requiredDecisions.join(
                              ' | ',
                            )}
                          </small>
                          <small>
                            Artifacts:{' '}
                            {lastEcommerceProductWorkspaceReadinessPacket.recommendedArtifacts.join(
                              ' | ',
                            )}
                          </small>
                          {lastEcommerceProductWorkspaceReadinessPacket.blockedBy
                            .length > 0 ? (
                            <small>
                              Blocked by:{' '}
                              {lastEcommerceProductWorkspaceReadinessPacket.blockedBy.join(
                                ' | ',
                              )}
                            </small>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : tenantEcommerceProductWorkspaceDetailLoading ? (
                    <p className={styles.muted}>
                      Cargando el detalle del product workspace...
                    </p>
                  ) : null}

                  <div className={styles.commercialCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Product setup registry</span>
                        <h4>Setups persistidos</h4>
                      </div>
                      <span className={styles.badge}>
                        {tenantEcommerceProductSetupRegistry?.summary
                          .totalProductSetups ?? 0}
                      </span>
                    </div>
                    {tenantEcommerceProductSetupRegistry ? (
                      <div className={styles.stack}>
                        <small>
                          {tenantEcommerceProductSetupRegistry.summary.headline}
                        </small>
                        <small>
                          {tenantEcommerceProductSetupRegistry.summary.detail}
                        </small>
                        {tenantEcommerceProductSetupRegistry.productSetups
                          .length === 0 ? (
                          <small>
                            Todavía no hay product setups persistidos.
                          </small>
                        ) : (
                          <ul className={styles.customerList}>
                            {tenantEcommerceProductSetupRegistry.productSetups.map(
                              (entry) => (
                                <li
                                  className={styles.customerListItem}
                                  key={entry.productSetupId}
                                >
                                  <div className={styles.customerListPrimary}>
                                    <strong>{entry.title}</strong>
                                    <small>
                                      {humanizeKey(entry.status)} ·{' '}
                                      {humanizeKey(entry.productType)}
                                    </small>
                                  </div>
                                  <div className={styles.inlineActions}>
                                    <button
                                      className={styles.ghostButton}
                                      onClick={() =>
                                        onSelectProductSetup(
                                          entry.productSetupId,
                                        )
                                      }
                                      type="button"
                                    >
                                      Ver product setup
                                    </button>
                                  </div>
                                </li>
                              ),
                            )}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <small className={styles.muted}>
                        Cargando registry de product setups...
                      </small>
                    )}
                  </div>

                  {selectedTenantEcommerceProductSetupDetail ? (
                    <div className={styles.commercialCard}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Product setup detail</span>
                          <h4>
                            {
                              selectedTenantEcommerceProductSetupDetail
                                .productSetup.title
                            }
                          </h4>
                        </div>
                        <span className={styles.badge}>
                          {humanizeKey(
                            selectedTenantEcommerceProductSetupDetail
                              .productSetup.status,
                          )}
                        </span>
                      </div>
                      <p>{selectedTenantEcommerceProductSetupDetail.summary}</p>
                      <small>
                        Source draft:{' '}
                        {
                          selectedTenantEcommerceProductSetupDetail.productSetup
                            .sourceDraftId
                        }
                      </small>
                      <small>
                        Pricing band:{' '}
                        {selectedTenantEcommerceProductSetupDetail.productSetup
                          .pricingBand ?? 'Sin banda'}
                      </small>
                      <small>
                        CTA principal:{' '}
                        {selectedTenantEcommerceProductSetupDetail.productSetup
                          .primaryCta ?? 'Sin CTA'}
                      </small>
                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Title</span>
                          <input
                            onChange={(event) =>
                              setProductSetupTitle(event.target.value)
                            }
                            value={productSetupTitle}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Pricing band</span>
                          <input
                            onChange={(event) =>
                              setProductSetupPricingBand(event.target.value)
                            }
                            value={productSetupPricingBand}
                          />
                        </label>
                      </div>
                      <div className={styles.invoiceInlineGrid}>
                        <label className={styles.field}>
                          <span>Offer angle</span>
                          <textarea
                            onChange={(event) =>
                              setProductSetupOfferAngle(event.target.value)
                            }
                            rows={3}
                            value={productSetupOfferAngle}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>Primary CTA</span>
                          <input
                            onChange={(event) =>
                              setProductSetupPrimaryCta(event.target.value)
                            }
                            value={productSetupPrimaryCta}
                          />
                        </label>
                      </div>
                      <label className={styles.field}>
                        <span>Channel sequence</span>
                        <textarea
                          onChange={(event) =>
                            setProductSetupChannelSequence(event.target.value)
                          }
                          rows={4}
                          value={productSetupChannelSequence}
                        />
                      </label>
                      <div className={styles.inlineActions}>
                        <button
                          className={styles.secondaryButton}
                          disabled={
                            ecommerceProductSetupSaveActionLoading ===
                            selectedTenantEcommerceProductSetupDetail.productSetup
                              .productSetupId
                          }
                          onClick={() =>
                            onUpdateProductSetupEditableSnapshot({
                              title: productSetupTitle,
                              pricingBand:
                                productSetupPricingBand.trim().length > 0
                                  ? productSetupPricingBand
                                  : null,
                              offerAngle:
                                productSetupOfferAngle.trim().length > 0
                                  ? productSetupOfferAngle
                                  : null,
                              primaryCta:
                                productSetupPrimaryCta.trim().length > 0
                                  ? productSetupPrimaryCta
                                  : null,
                              channelSequence:
                                productSetupChannelSequence.split('\n'),
                            })
                          }
                          type="button"
                        >
                          {ecommerceProductSetupSaveActionLoading ===
                          selectedTenantEcommerceProductSetupDetail.productSetup
                            .productSetupId
                            ? 'Guardando setup...'
                            : 'Guardar snapshot editable'}
                        </button>
                        <button
                          className={styles.secondaryButton}
                          disabled={
                            ecommerceProductEntityPromotionActionLoading ===
                            selectedTenantEcommerceProductSetupDetail.productSetup
                              .productSetupId
                          }
                          onClick={onPromoteProductSetupToProductEntity}
                          type="button"
                        >
                          {ecommerceProductEntityPromotionActionLoading ===
                          selectedTenantEcommerceProductSetupDetail.productSetup
                            .productSetupId
                            ? 'Abriendo entity...'
                            : 'Promover a product entity'}
                        </button>
                        <button
                          className={styles.ghostButton}
                          disabled={
                            ecommerceProductSetupDefinitionActionLoading ===
                            selectedTenantEcommerceProductSetupDetail.productSetup
                              .productSetupId
                          }
                          onClick={onRequestProductSetupDefinitionPacket}
                          type="button"
                        >
                          {ecommerceProductSetupDefinitionActionLoading ===
                          selectedTenantEcommerceProductSetupDetail.productSetup
                            .productSetupId
                            ? 'Preparando definition...'
                            : 'Solicitar definition packet'}
                        </button>
                      </div>
                      <small>
                        Next actions:{' '}
                        {selectedTenantEcommerceProductSetupDetail.nextActions.join(
                          ' | ',
                        )}
                      </small>
                      {lastEcommerceProductSetupDefinitionPacket ? (
                        <div className={styles.stack}>
                          <small>
                            {lastEcommerceProductSetupDefinitionPacket.summary}
                          </small>
                          <small>
                            Decisions:{' '}
                            {lastEcommerceProductSetupDefinitionPacket.requiredDecisions.join(
                              ' | ',
                            )}
                          </small>
                          <small>
                            Artifacts:{' '}
                            {lastEcommerceProductSetupDefinitionPacket.recommendedArtifacts.join(
                              ' | ',
                            )}
                          </small>
                          {lastEcommerceProductSetupDefinitionPacket.blockedBy
                            .length > 0 ? (
                            <small>
                              Blocked by:{' '}
                              {lastEcommerceProductSetupDefinitionPacket.blockedBy.join(
                                ' | ',
                              )}
                            </small>
                          ) : null}
                        </div>
                      ) : null}
                      {selectedTenantEcommerceProductSetupDetail.blockedBy.length >
                      0 ? (
                        <small>
                          Blocked by:{' '}
                          {selectedTenantEcommerceProductSetupDetail.blockedBy.join(
                            ' | ',
                          )}
                        </small>
                      ) : null}
                    </div>
                  ) : tenantEcommerceProductSetupDetailLoading ? (
                    <p className={styles.muted}>
                      Cargando el detalle del product setup...
                    </p>
                  ) : null}

                  <div className={styles.commercialCard}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Product entity registry</span>
                        <h4>Entidades de producto</h4>
                      </div>
                      <span className={styles.badge}>
                        {tenantEcommerceProductEntityRegistry?.summary
                          .totalProductEntities ?? 0}
                      </span>
                    </div>
                    {tenantEcommerceProductEntityRegistry ? (
                      <div className={styles.stack}>
                        <small>
                          {tenantEcommerceProductEntityRegistry.summary.headline}
                        </small>
                        <small>
                          {tenantEcommerceProductEntityRegistry.summary.detail}
                        </small>
                        {tenantEcommerceProductEntityRegistry.productEntities
                          .length === 0 ? (
                          <small>
                            Todavía no hay product entities persistidas.
                          </small>
                        ) : (
                          <ul className={styles.customerList}>
                            {tenantEcommerceProductEntityRegistry.productEntities.map(
                              (entry) => (
                                <li
                                  className={styles.customerListItem}
                                  key={entry.productEntityId}
                                >
                                  <div className={styles.customerListPrimary}>
                                    <strong>{entry.title}</strong>
                                    <small>
                                      {humanizeKey(entry.status)} ·{' '}
                                      {humanizeKey(entry.productType)}
                                    </small>
                                  </div>
                                  <div className={styles.inlineActions}>
                                    <button
                                      className={styles.ghostButton}
                                      onClick={() =>
                                        onSelectProductEntity(
                                          entry.productEntityId,
                                        )
                                      }
                                      type="button"
                                    >
                                      Ver product entity
                                    </button>
                                  </div>
                                </li>
                              ),
                            )}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <small className={styles.muted}>
                        Cargando registry de product entities...
                      </small>
                    )}
                  </div>

                  {selectedTenantEcommerceProductEntityDetail ? (
                    <div className={styles.commercialCard}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Product entity detail</span>
                          <h4>
                            {
                              selectedTenantEcommerceProductEntityDetail
                                .productEntity.title
                            }
                          </h4>
                        </div>
                        <span className={styles.badge}>
                          {humanizeKey(
                            selectedTenantEcommerceProductEntityDetail
                              .productEntity.status,
                          )}
                        </span>
                      </div>
                      <p>{selectedTenantEcommerceProductEntityDetail.summary}</p>
                      <small>
                        Source draft:{' '}
                        {
                          selectedTenantEcommerceProductEntityDetail.productEntity
                            .sourceDraftId
                        }
                      </small>
                      <small>
                        Pricing band:{' '}
                        {selectedTenantEcommerceProductEntityDetail.productEntity
                          .pricingBand ?? 'Sin banda'}
                      </small>
                      <small>
                        CTA principal:{' '}
                        {selectedTenantEcommerceProductEntityDetail.productEntity
                          .primaryCta ?? 'Sin CTA'}
                      </small>
                      <div className={styles.inlineActions}>
                        <button
                          className={styles.ghostButton}
                          disabled={
                            ecommerceProductEntityCommercializationActionLoading ===
                            selectedTenantEcommerceProductEntityDetail.productEntity
                              .productEntityId
                          }
                          onClick={onRequestProductEntityCommercializationPacket}
                          type="button"
                        >
                          {ecommerceProductEntityCommercializationActionLoading ===
                          selectedTenantEcommerceProductEntityDetail.productEntity
                            .productEntityId
                            ? 'Preparando commercialization...'
                            : 'Solicitar commercialization packet'}
                        </button>
                      </div>
                      <small>
                        Next actions:{' '}
                        {selectedTenantEcommerceProductEntityDetail.nextActions.join(
                          ' | ',
                        )}
                      </small>
                      {selectedTenantEcommerceProductEntityChannelAssetsWorkspace ? (
                        <div className={styles.stack}>
                          <small>
                            {
                              selectedTenantEcommerceProductEntityChannelAssetsWorkspace.summary
                            }
                          </small>
                          <small>
                            Landing:{' '}
                            {humanizeKey(
                              selectedTenantEcommerceProductEntityChannelAssetsWorkspace
                                .channels.landing.status,
                            )}{' '}
                            ·{' '}
                            {
                              selectedTenantEcommerceProductEntityChannelAssetsWorkspace
                                .channels.landing.headline
                            }
                          </small>
                          <small>
                            Catalog:{' '}
                            {humanizeKey(
                              selectedTenantEcommerceProductEntityChannelAssetsWorkspace
                                .channels.catalog.status,
                            )}{' '}
                            ·{' '}
                            {
                              selectedTenantEcommerceProductEntityChannelAssetsWorkspace
                                .channels.catalog.headline
                            }
                          </small>
                          <small>
                            WhatsApp:{' '}
                            {humanizeKey(
                              selectedTenantEcommerceProductEntityChannelAssetsWorkspace
                                .channels.whatsapp.status,
                            )}{' '}
                            ·{' '}
                            {
                              selectedTenantEcommerceProductEntityChannelAssetsWorkspace
                                .channels.whatsapp.headline
                            }
                          </small>
                          <small>
                            Assets:{' '}
                            {[
                              ...selectedTenantEcommerceProductEntityChannelAssetsWorkspace
                                .channels.landing.recommendedAssets,
                              ...selectedTenantEcommerceProductEntityChannelAssetsWorkspace
                                .channels.catalog.recommendedAssets,
                              ...selectedTenantEcommerceProductEntityChannelAssetsWorkspace
                                .channels.whatsapp.recommendedAssets,
                            ].join(' | ')}
                          </small>
                        </div>
                      ) : tenantEcommerceProductEntityChannelAssetsWorkspaceLoading ? (
                        <small className={styles.muted}>
                          Cargando channel assets workspace...
                        </small>
                      ) : null}
                      {selectedTenantEcommerceProductEntityChannelAssetDraftsWorkspace ? (
                        <div className={styles.stack}>
                          <small>
                            {
                              selectedTenantEcommerceProductEntityChannelAssetDraftsWorkspace.summary
                            }
                          </small>
                          <small>
                            Landing draft:{' '}
                            {humanizeKey(
                              selectedTenantEcommerceProductEntityChannelAssetDraftsWorkspace
                                .drafts.landing.status,
                            )}{' '}
                            ·{' '}
                            {
                              selectedTenantEcommerceProductEntityChannelAssetDraftsWorkspace
                                .drafts.landing.headline
                            }
                          </small>
                          <small>
                            Catalog draft:{' '}
                            {humanizeKey(
                              selectedTenantEcommerceProductEntityChannelAssetDraftsWorkspace
                                .drafts.catalog.status,
                            )}{' '}
                            ·{' '}
                            {
                              selectedTenantEcommerceProductEntityChannelAssetDraftsWorkspace
                                .drafts.catalog.headline
                            }
                          </small>
                          <small>
                            WhatsApp draft:{' '}
                            {humanizeKey(
                              selectedTenantEcommerceProductEntityChannelAssetDraftsWorkspace
                                .drafts.whatsapp.status,
                            )}{' '}
                            ·{' '}
                            {
                              selectedTenantEcommerceProductEntityChannelAssetDraftsWorkspace
                                .drafts.whatsapp.headline
                            }
                          </small>
                          <small>
                            Draft blocks:{' '}
                            {[
                              ...selectedTenantEcommerceProductEntityChannelAssetDraftsWorkspace
                                .drafts.landing.sections,
                              ...selectedTenantEcommerceProductEntityChannelAssetDraftsWorkspace
                                .drafts.catalog.blocks,
                              ...selectedTenantEcommerceProductEntityChannelAssetDraftsWorkspace
                                .drafts.whatsapp.sequence,
                            ].join(' | ')}
                          </small>
                          <div className={styles.inlineActions}>
                            <button
                              className={styles.ghostButton}
                              onClick={() => onSelectProductEntityChannelDraft('landing')}
                              type="button"
                            >
                              Ver landing draft
                            </button>
                            <button
                              className={styles.ghostButton}
                              onClick={() => onSelectProductEntityChannelDraft('catalog')}
                              type="button"
                            >
                              Ver catalog draft
                            </button>
                            <button
                              className={styles.ghostButton}
                              onClick={() => onSelectProductEntityChannelDraft('whatsapp')}
                              type="button"
                            >
                              Ver WhatsApp draft
                            </button>
                          </div>
                        </div>
                      ) : tenantEcommerceProductEntityChannelAssetDraftsWorkspaceLoading ? (
                        <small className={styles.muted}>
                          Cargando channel asset drafts workspace...
                        </small>
                      ) : null}
                      {selectedTenantEcommerceProductEntityChannelDraftDetail ? (
                        <div className={styles.stack}>
                          <small>
                            {selectedTenantEcommerceProductEntityChannelDraftDetail.summary}
                          </small>
                          <small>
                            Headline:{' '}
                            {selectedTenantEcommerceProductEntityChannelDraftDetail.headline}
                          </small>
                          <small>
                            Owner:{' '}
                            {humanizeKey(
                              selectedTenantEcommerceProductEntityChannelDraftDetail.recommendedOwner,
                            )}
                          </small>
                          <small>
                            Structure:{' '}
                            {selectedTenantEcommerceProductEntityChannelDraftDetail.structure.join(
                              ' | ',
                            )}
                          </small>
                          <small>
                            Inputs:{' '}
                            {selectedTenantEcommerceProductEntityChannelDraftDetail.requiredInputs.join(
                              ' | ',
                            )}
                          </small>
                          <div className={styles.inlineActions}>
                            <button
                              className={styles.ghostButton}
                              disabled={
                                ecommerceProductEntityChannelDraftActionPacketLoading ===
                                selectedTenantEcommerceProductEntityChannelDraftDetail.channelKey
                              }
                              onClick={onRequestProductEntityChannelDraftActionPacket}
                              type="button"
                            >
                              {ecommerceProductEntityChannelDraftActionPacketLoading ===
                              selectedTenantEcommerceProductEntityChannelDraftDetail.channelKey
                                ? 'Preparando draft packet...'
                                : 'Solicitar draft action packet'}
                            </button>
                            <button
                              className={styles.ghostButton}
                              disabled={
                                ecommerceProductEntityChannelDraftPublishReadinessPacketLoading ===
                                selectedTenantEcommerceProductEntityChannelDraftDetail.channelKey
                              }
                              onClick={
                                onRequestProductEntityChannelDraftPublishReadinessPacket
                              }
                              type="button"
                            >
                              {ecommerceProductEntityChannelDraftPublishReadinessPacketLoading ===
                              selectedTenantEcommerceProductEntityChannelDraftDetail.channelKey
                                ? 'Preparando publish packet...'
                                : 'Solicitar publish-readiness packet'}
                            </button>
                            <button
                              className={styles.ghostButton}
                              disabled={
                                tenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceLoading
                              }
                              onClick={
                                onSelectProductEntityChannelDraftPublishPreparationWorkspace
                              }
                              type="button"
                            >
                              {tenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceLoading
                                ? 'Cargando publish prep...'
                                : 'Ver publish preparation workspace'}
                            </button>
                          </div>
                          {lastEcommerceProductEntityChannelDraftActionPacket ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  lastEcommerceProductEntityChannelDraftActionPacket.summary
                                }
                              </small>
                              <small>
                                Artifacts:{' '}
                                {lastEcommerceProductEntityChannelDraftActionPacket.recommendedArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Next step:{' '}
                                {
                                  lastEcommerceProductEntityChannelDraftActionPacket.nextStep
                                }
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceProductEntityChannelDraftPublishReadinessPacket ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  lastEcommerceProductEntityChannelDraftPublishReadinessPacket.summary
                                }
                              </small>
                              <small>
                                Checks:{' '}
                                {lastEcommerceProductEntityChannelDraftPublishReadinessPacket.requiredChecks.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Artifacts:{' '}
                                {lastEcommerceProductEntityChannelDraftPublishReadinessPacket.recommendedArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspace ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  selectedTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspace.summary
                                }
                              </small>
                              <small>
                                Owner:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspace.handoffOwner,
                                )}
                              </small>
                              <small>
                                Blueprint:{' '}
                                {selectedTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspace.draftBlueprint.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Checklist:{' '}
                                {selectedTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspace.publishChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Artifacts:{' '}
                                {selectedTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspace.recommendedArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Next milestone:{' '}
                                {
                                  selectedTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspace.nextMilestone
                                }
                              </small>
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.ghostButton}
                                  disabled={
                                    ecommerceProductEntityChannelDraftSaveActionLoading ===
                                    selectedTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspace.channelKey
                                  }
                                  onClick={onSaveProductEntityChannelDraft}
                                  type="button"
                                >
                                  {ecommerceProductEntityChannelDraftSaveActionLoading ===
                                  selectedTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspace.channelKey
                                    ? 'Guardando channel draft...'
                                    : 'Guardar channel draft'}
                                </button>
                              </div>
                            </div>
                          ) : null}
                          {tenantEcommerceSavedProductEntityChannelDraftRegistry ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  tenantEcommerceSavedProductEntityChannelDraftRegistry.summary.headline
                                }
                              </small>
                              <small>
                                {
                                  tenantEcommerceSavedProductEntityChannelDraftRegistry.summary.detail
                                }
                              </small>
                              {tenantEcommerceSavedProductEntityChannelDraftRegistry.drafts
                                .length === 0 ? (
                                <small>
                                  Todavía no hay saved channel drafts persistidos.
                                </small>
                              ) : (
                                <ul className={styles.customerList}>
                                  {tenantEcommerceSavedProductEntityChannelDraftRegistry.drafts.map(
                                    (draft) => (
                                      <li
                                        className={styles.customerListItem}
                                        key={draft.channelKey}
                                      >
                                        <div className={styles.customerListPrimary}>
                                          <strong>
                                            {humanizeKey(draft.channelKey)}
                                          </strong>
                                          <small>
                                            {humanizeKey(
                                              draft.preparationStatus,
                                            )}{' '}
                                            · {draft.title}
                                          </small>
                                        </div>
                                        <div className={styles.inlineActions}>
                                          <button
                                            className={styles.ghostButton}
                                            onClick={() =>
                                              onSelectSavedProductEntityChannelDraft(
                                                draft.channelKey,
                                              )
                                            }
                                            type="button"
                                          >
                                            Ver saved draft
                                          </button>
                                        </div>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : null}
                          {selectedTenantEcommerceSavedProductEntityChannelDraftDetail ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  selectedTenantEcommerceSavedProductEntityChannelDraftDetail.summary
                                }
                              </small>
                              <small>
                                Next actions:{' '}
                                {selectedTenantEcommerceSavedProductEntityChannelDraftDetail.nextActions.join(
                                  ' | ',
                                )}
                              </small>
                              <div className={styles.invoiceInlineGrid}>
                                <label className={styles.field}>
                                  <span>Title</span>
                                  <input
                                    onChange={(event) =>
                                      setSavedChannelDraftTitle(
                                        event.target.value,
                                      )
                                    }
                                    value={savedChannelDraftTitle}
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>Headline</span>
                                  <input
                                    onChange={(event) =>
                                      setSavedChannelDraftHeadline(
                                        event.target.value,
                                      )
                                    }
                                    value={savedChannelDraftHeadline}
                                  />
                                </label>
                              </div>
                              <div className={styles.invoiceInlineGrid}>
                                <label className={styles.field}>
                                  <span>Draft blueprint</span>
                                  <textarea
                                    onChange={(event) =>
                                      setSavedChannelDraftBlueprint(
                                        event.target.value,
                                      )
                                    }
                                    rows={4}
                                    value={savedChannelDraftBlueprint}
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>Recommended artifacts</span>
                                  <textarea
                                    onChange={(event) =>
                                      setSavedChannelDraftRecommendedArtifacts(
                                        event.target.value,
                                      )
                                    }
                                    rows={4}
                                    value={
                                      savedChannelDraftRecommendedArtifacts
                                    }
                                  />
                                </label>
                              </div>
                              <label className={styles.field}>
                                <span>Next milestone</span>
                                <textarea
                                  onChange={(event) =>
                                    setSavedChannelDraftNextMilestone(
                                      event.target.value,
                                    )
                                  }
                                  rows={3}
                                  value={savedChannelDraftNextMilestone}
                                />
                              </label>
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceOrderReviewWorkspaceLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={onLoadOrderReviewWorkspace}
                                  type="button"
                                >
                                  {tenantEcommerceOrderReviewWorkspaceLoading
                                    ? 'Cargando review...'
                                    : 'Cargar order review'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceSavedProductEntityChannelDraftSaveActionLoading ===
                                    selectedTenantEcommerceSavedProductEntityChannelDraftDetail
                                      .savedChannelDraft.channelKey
                                  }
                                  onClick={() =>
                                    onUpdateSavedProductEntityChannelDraftEditableSnapshot(
                                      {
                                        title: savedChannelDraftTitle,
                                        headline: savedChannelDraftHeadline,
                                        draftBlueprint:
                                          savedChannelDraftBlueprint.split('\n'),
                                        recommendedArtifacts:
                                          savedChannelDraftRecommendedArtifacts.split(
                                            '\n',
                                          ),
                                        nextMilestone:
                                          savedChannelDraftNextMilestone,
                                      },
                                    )
                                  }
                                  type="button"
                                >
                                  {ecommerceSavedProductEntityChannelDraftSaveActionLoading ===
                                  selectedTenantEcommerceSavedProductEntityChannelDraftDetail
                                    .savedChannelDraft.channelKey
                                    ? 'Guardando saved draft...'
                                    : 'Guardar snapshot editable'}
                                </button>
                                <button
                                  className={styles.ghostButton}
                                  disabled={
                                    ecommerceProductEntityChannelAssetWorkspacePromotionActionLoading ===
                                    selectedTenantEcommerceSavedProductEntityChannelDraftDetail
                                      .savedChannelDraft.channelKey
                                  }
                                  onClick={
                                    onPromoteSavedProductEntityChannelDraftToChannelAssetWorkspace
                                  }
                                  type="button"
                                >
                                  {ecommerceProductEntityChannelAssetWorkspacePromotionActionLoading ===
                                  selectedTenantEcommerceSavedProductEntityChannelDraftDetail
                                    .savedChannelDraft.channelKey
                                    ? 'Abriendo asset workspace...'
                                    : 'Promover a channel asset workspace'}
                                </button>
                              </div>
                              {selectedTenantEcommerceSavedProductEntityChannelDraftDetail
                                .blockedBy.length > 0 ? (
                                <small>
                                  Blocked by:{' '}
                                  {selectedTenantEcommerceSavedProductEntityChannelDraftDetail.blockedBy.join(
                                    ' | ',
                                  )}
                                </small>
                              ) : null}
                            </div>
                          ) : tenantEcommerceSavedProductEntityChannelDraftDetailLoading ? (
                            <small className={styles.muted}>
                              Cargando el saved channel draft...
                            </small>
                          ) : null}
                          {tenantEcommerceProductEntityChannelAssetWorkspaceRegistry ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  tenantEcommerceProductEntityChannelAssetWorkspaceRegistry.summary.headline
                                }
                              </small>
                              <small>
                                {
                                  tenantEcommerceProductEntityChannelAssetWorkspaceRegistry.summary.detail
                                }
                              </small>
                              {tenantEcommerceProductEntityChannelAssetWorkspaceRegistry.workspaces
                                .length === 0 ? (
                                <small>
                                  Todavía no hay channel asset workspaces promovidos.
                                </small>
                              ) : (
                                <ul className={styles.customerList}>
                                  {tenantEcommerceProductEntityChannelAssetWorkspaceRegistry.workspaces.map(
                                    (workspace) => (
                                      <li
                                        className={styles.customerListItem}
                                        key={workspace.channelKey}
                                      >
                                        <div className={styles.customerListPrimary}>
                                          <strong>
                                            {humanizeKey(workspace.channelKey)}
                                          </strong>
                                          <small>
                                            {humanizeKey(workspace.status)} ·{' '}
                                            {workspace.editableSnapshot.title}
                                          </small>
                                        </div>
                                        <div className={styles.inlineActions}>
                                          <button
                                            className={styles.ghostButton}
                                            onClick={() =>
                                              onSelectProductEntityChannelAssetWorkspace(
                                                workspace.channelKey,
                                              )
                                            }
                                            type="button"
                                          >
                                            Ver asset workspace
                                          </button>
                                        </div>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : null}
                          {selectedTenantEcommerceProductEntityChannelAssetWorkspaceDetail ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  selectedTenantEcommerceProductEntityChannelAssetWorkspaceDetail.workspace.headline
                                }
                              </small>
                              <small>
                                {
                                  selectedTenantEcommerceProductEntityChannelAssetWorkspaceDetail.workspace.detail
                                }
                              </small>
                              <small>
                                Next actions:{' '}
                                {selectedTenantEcommerceProductEntityChannelAssetWorkspaceDetail.workspace.nextActions.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Checklist:{' '}
                                {selectedTenantEcommerceProductEntityChannelAssetWorkspaceDetail.workspace.editableSnapshot.publishChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceProductEntityChannelAssetPublishPacketLoading ===
                                    selectedTenantEcommerceProductEntityChannelAssetWorkspaceDetail
                                      .workspace.channelKey
                                  }
                                  onClick={
                                    onRequestProductEntityChannelAssetPublishPacket
                                  }
                                  type="button"
                                >
                                  {ecommerceProductEntityChannelAssetPublishPacketLoading ===
                                  selectedTenantEcommerceProductEntityChannelAssetWorkspaceDetail
                                    .workspace.channelKey
                                    ? 'Solicitando publish packet...'
                                    : 'Solicitar publish packet'}
                                </button>
                                <button
                                  className={styles.ghostButton}
                                  disabled={
                                    ecommerceProductEntityChannelAssetEntityPromotionActionLoading ===
                                    selectedTenantEcommerceProductEntityChannelAssetWorkspaceDetail
                                      .workspace.channelKey
                                  }
                                  onClick={
                                    onPromoteProductEntityChannelAssetWorkspaceToChannelAssetEntity
                                  }
                                  type="button"
                                >
                                  {ecommerceProductEntityChannelAssetEntityPromotionActionLoading ===
                                  selectedTenantEcommerceProductEntityChannelAssetWorkspaceDetail
                                    .workspace.channelKey
                                    ? 'Promoviendo asset entity...'
                                    : 'Promover a channel asset entity'}
                                </button>
                              </div>
                              {selectedTenantEcommerceProductEntityChannelAssetWorkspaceDetail
                                .blockedBy.length > 0 ? (
                                <small>
                                  Blocked by:{' '}
                                  {selectedTenantEcommerceProductEntityChannelAssetWorkspaceDetail.blockedBy.join(
                                    ' | ',
                                  )}
                                </small>
                              ) : null}
                            </div>
                          ) : tenantEcommerceProductEntityChannelAssetWorkspaceDetailLoading ? (
                            <small className={styles.muted}>
                              Cargando el channel asset workspace...
                            </small>
                          ) : null}
                          {lastEcommerceProductEntityChannelAssetPublishPacket ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  lastEcommerceProductEntityChannelAssetPublishPacket.summary
                                }
                              </small>
                              <small>
                                Checks:{' '}
                                {lastEcommerceProductEntityChannelAssetPublishPacket.requiredChecks.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Artifacts:{' '}
                                {lastEcommerceProductEntityChannelAssetPublishPacket.recommendedArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Next milestone:{' '}
                                {
                                  lastEcommerceProductEntityChannelAssetPublishPacket.nextMilestone
                                }
                              </small>
                              {lastEcommerceProductEntityChannelAssetPublishPacket
                                .blockedBy.length > 0 ? (
                                <small>
                                  Blocked by:{' '}
                                  {lastEcommerceProductEntityChannelAssetPublishPacket.blockedBy.join(
                                    ' | ',
                                  )}
                                </small>
                              ) : null}
                            </div>
                          ) : null}
                          {tenantEcommerceProductEntityChannelAssetEntityRegistry ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  tenantEcommerceProductEntityChannelAssetEntityRegistry.summary.headline
                                }
                              </small>
                              <small>
                                {
                                  tenantEcommerceProductEntityChannelAssetEntityRegistry.summary.detail
                                }
                              </small>
                              {tenantEcommerceProductEntityChannelAssetEntityRegistry
                                .assetEntities.length === 0 ? (
                                <small>
                                  Todavía no hay channel asset entities promovidas.
                                </small>
                              ) : (
                                <ul className={styles.customerList}>
                                  {tenantEcommerceProductEntityChannelAssetEntityRegistry.assetEntities.map(
                                    (assetEntity) => (
                                      <li
                                        className={styles.customerListItem}
                                        key={assetEntity.channelKey}
                                      >
                                        <div className={styles.customerListPrimary}>
                                          <strong>
                                            {humanizeKey(assetEntity.channelKey)}
                                          </strong>
                                          <small>
                                            {humanizeKey(assetEntity.status)} ·{' '}
                                            {assetEntity.title}
                                          </small>
                                        </div>
                                        <div className={styles.inlineActions}>
                                          <button
                                            className={styles.ghostButton}
                                            onClick={() =>
                                              onSelectProductEntityChannelAssetEntity(
                                                assetEntity.channelKey,
                                              )
                                            }
                                            type="button"
                                          >
                                            Ver asset entity
                                          </button>
                                        </div>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : null}
                          {selectedTenantEcommerceProductEntityChannelAssetEntityDetail ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  selectedTenantEcommerceProductEntityChannelAssetEntityDetail.assetEntity.summary
                                }
                              </small>
                              <label className={styles.field}>
                                <span>Asset entity title</span>
                                <input
                                  onChange={(event) =>
                                    setAssetEntityTitle(event.target.value)
                                  }
                                  value={assetEntityTitle}
                                />
                              </label>
                              <label className={styles.field}>
                                <span>Asset entity headline</span>
                                <textarea
                                  onChange={(event) =>
                                    setAssetEntityHeadline(event.target.value)
                                  }
                                  rows={3}
                                  value={assetEntityHeadline}
                                />
                              </label>
                              <div className={styles.invoiceInlineGrid}>
                                <label className={styles.field}>
                                  <span>Draft blueprint</span>
                                  <textarea
                                    onChange={(event) =>
                                      setAssetEntityBlueprint(
                                        event.target.value,
                                      )
                                    }
                                    rows={4}
                                    value={assetEntityBlueprint}
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>Recommended artifacts</span>
                                  <textarea
                                    onChange={(event) =>
                                      setAssetEntityRecommendedArtifacts(
                                        event.target.value,
                                      )
                                    }
                                    rows={4}
                                    value={assetEntityRecommendedArtifacts}
                                  />
                                </label>
                              </div>
                              <label className={styles.field}>
                                <span>Next milestone</span>
                                <textarea
                                  onChange={(event) =>
                                    setAssetEntityNextMilestone(
                                      event.target.value,
                                    )
                                  }
                                  rows={3}
                                  value={assetEntityNextMilestone}
                                />
                              </label>
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceProductEntityChannelAssetEntitySaveActionLoading ===
                                    selectedTenantEcommerceProductEntityChannelAssetEntityDetail
                                      .assetEntity.channelKey
                                  }
                                  onClick={() =>
                                    onUpdateProductEntityChannelAssetEntityEditableSnapshot(
                                      {
                                        title: assetEntityTitle,
                                        headline: assetEntityHeadline,
                                        draftBlueprint:
                                          assetEntityBlueprint.split('\n'),
                                        recommendedArtifacts:
                                          assetEntityRecommendedArtifacts.split(
                                            '\n',
                                          ),
                                        nextMilestone:
                                          assetEntityNextMilestone,
                                      },
                                    )
                                  }
                                  type="button"
                                >
                                  {ecommerceProductEntityChannelAssetEntitySaveActionLoading ===
                                  selectedTenantEcommerceProductEntityChannelAssetEntityDetail
                                    .assetEntity.channelKey
                                    ? 'Guardando asset entity...'
                                    : 'Guardar snapshot editable'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceProductEntityChannelAssetEntityPublishPreparationPacketLoading ===
                                    selectedTenantEcommerceProductEntityChannelAssetEntityDetail
                                      .assetEntity.channelKey
                                  }
                                  onClick={
                                    onRequestProductEntityChannelAssetEntityPublishPreparationPacket
                                  }
                                  type="button"
                                >
                                  {ecommerceProductEntityChannelAssetEntityPublishPreparationPacketLoading ===
                                  selectedTenantEcommerceProductEntityChannelAssetEntityDetail
                                    .assetEntity.channelKey
                                    ? 'Solicitando publish preparation...'
                                    : 'Solicitar publish preparation'}
                                </button>
                                <button
                                  className={styles.ghostButton}
                                  disabled={
                                    ecommerceProductEntityChannelReleaseCandidatePromotionActionLoading ===
                                    selectedTenantEcommerceProductEntityChannelAssetEntityDetail
                                      .assetEntity.channelKey
                                  }
                                  onClick={
                                    onPromoteProductEntityChannelAssetEntityToReleaseCandidate
                                  }
                                  type="button"
                                >
                                  {ecommerceProductEntityChannelReleaseCandidatePromotionActionLoading ===
                                  selectedTenantEcommerceProductEntityChannelAssetEntityDetail
                                    .assetEntity.channelKey
                                    ? 'Promoviendo release candidate...'
                                    : 'Promover a release candidate'}
                                </button>
                              </div>
                              {selectedTenantEcommerceProductEntityChannelAssetEntityDetail
                                .assetEntity.blockedBy.length > 0 ? (
                                <small>
                                  Blocked by:{' '}
                                  {selectedTenantEcommerceProductEntityChannelAssetEntityDetail.assetEntity.blockedBy.join(
                                    ' | ',
                                  )}
                                </small>
                              ) : null}
                            </div>
                          ) : tenantEcommerceProductEntityChannelAssetEntityDetailLoading ? (
                            <small className={styles.muted}>
                              Cargando la channel asset entity...
                            </small>
                          ) : null}
                          {lastEcommerceProductEntityChannelAssetEntityPublishPreparationPacket ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  lastEcommerceProductEntityChannelAssetEntityPublishPreparationPacket.summary
                                }
                              </small>
                              <small>
                                Checks:{' '}
                                {lastEcommerceProductEntityChannelAssetEntityPublishPreparationPacket.requiredChecks.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Artifacts:{' '}
                                {lastEcommerceProductEntityChannelAssetEntityPublishPreparationPacket.recommendedArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Next milestone:{' '}
                                {
                                  lastEcommerceProductEntityChannelAssetEntityPublishPreparationPacket.nextMilestone
                                }
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceLandingAssetEntityWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Landing asset entity
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceLandingAssetEntityWorkspace.assetEntity
                                        .title
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceLandingAssetEntityWorkspace.workspaceStatus,
                                  )}
                                </span>
                              </div>
                              <p>
                                {
                                  selectedTenantEcommerceLandingAssetEntityWorkspace.hero
                                    .headline
                                }
                              </p>
                              <small>
                                {
                                  selectedTenantEcommerceLandingAssetEntityWorkspace.hero
                                    .subheadline
                                }
                              </small>
                              <small>
                                CTA:{' '}
                                {
                                  selectedTenantEcommerceLandingAssetEntityWorkspace.hero
                                    .primaryCta
                                }
                              </small>
                              <small>
                                Proof blocks:{' '}
                                {selectedTenantEcommerceLandingAssetEntityWorkspace.proofBlocks.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Offer sections:{' '}
                                {selectedTenantEcommerceLandingAssetEntityWorkspace.offerSections.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Publish checklist:{' '}
                                {selectedTenantEcommerceLandingAssetEntityWorkspace.publishChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceCatalogAssetEntityWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Catalog asset entity
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceCatalogAssetEntityWorkspace.merchandisingCard
                                        .title
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceCatalogAssetEntityWorkspace.workspaceStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Pricing:{' '}
                                {
                                  selectedTenantEcommerceCatalogAssetEntityWorkspace
                                    .merchandisingCard.pricingSnapshot
                                }
                              </small>
                              <small>
                                CTA:{' '}
                                {
                                  selectedTenantEcommerceCatalogAssetEntityWorkspace
                                    .merchandisingCard.primaryCta
                                }
                              </small>
                              <small>
                                Offer bullets:{' '}
                                {selectedTenantEcommerceCatalogAssetEntityWorkspace.offerBullets.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Merchandising checks:{' '}
                                {selectedTenantEcommerceCatalogAssetEntityWorkspace.merchandisingChecks.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceCatalogCommercialCard ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Catalog commercial card
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceCatalogCommercialCard
                                        .card.title
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceCatalogCommercialCard.commercialStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                {
                                  selectedTenantEcommerceCatalogCommercialCard.storefrontSummary
                                }
                              </small>
                              <small>
                                Short description:{' '}
                                {
                                  selectedTenantEcommerceCatalogCommercialCard
                                    .card.shortDescription
                                }
                              </small>
                              <small>
                                Pricing:{' '}
                                {
                                  selectedTenantEcommerceCatalogCommercialCard
                                    .card.pricingPresentation
                                }
                              </small>
                              <small>
                                CTA:{' '}
                                {
                                  selectedTenantEcommerceCatalogCommercialCard
                                    .card.primaryCta
                                }
                              </small>
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.secondaryButton}
                                  onClick={onLoadStorefrontPreviewWorkspace}
                                  type="button"
                                >
                                  Abrir storefront preview
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  onClick={onLoadStorefrontPublishReviewWorkspace}
                                  type="button"
                                >
                                  Abrir publish review
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  onClick={onLoadLandingPublishArtifact}
                                  type="button"
                                >
                                  Abrir landing publish artifact
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  onClick={onLoadStorefrontReleaseCandidateBrief}
                                  type="button"
                                >
                                  Abrir storefront release brief
                                </button>
                              </div>
                              <small>
                                Highlights:{' '}
                                {selectedTenantEcommerceCatalogCommercialCard.merchandisingHighlights.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceStorefrontPreviewWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Storefront preview workspace
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceStorefrontPreviewWorkspace
                                        .summary.headline
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceStorefrontPreviewWorkspace.previewStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                {
                                  selectedTenantEcommerceStorefrontPreviewWorkspace
                                    .summary.detail
                                }
                              </small>
                              <small>
                                Landing hero:{' '}
                                {
                                  selectedTenantEcommerceStorefrontPreviewWorkspace
                                    .landingPreview.headline
                                }
                              </small>
                              <small>
                                Catalog card:{' '}
                                {
                                  selectedTenantEcommerceStorefrontPreviewWorkspace
                                    .catalogPreview.title
                                }{' '}
                                ·{' '}
                                {
                                  selectedTenantEcommerceStorefrontPreviewWorkspace
                                    .catalogPreview.pricingPresentation
                                }
                              </small>
                              <small>
                                Release signals:{' '}
                                {selectedTenantEcommerceStorefrontPreviewWorkspace.releaseSignals
                                  .map(
                                    (signal) =>
                                      `${humanizeKey(signal.channelKey)}:${humanizeKey(signal.status)}`,
                                  )
                                  .join(' | ')}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceStorefrontPublishReviewWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Storefront publish review
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceStorefrontPublishReviewWorkspace
                                        .summary.headline
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceStorefrontPublishReviewWorkspace.reviewStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                {
                                  selectedTenantEcommerceStorefrontPublishReviewWorkspace
                                    .summary.detail
                                }
                              </small>
                              <small>
                                Approval owner:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceStorefrontPublishReviewWorkspace
                                    .approvalSnapshot.approvalOwner,
                                )}
                              </small>
                              <small>
                                Decisions:{' '}
                                {selectedTenantEcommerceStorefrontPublishReviewWorkspace.approvalSnapshot.channelDecisions
                                  .map(
                                    (channel) =>
                                      `${humanizeKey(channel.channelKey)}:${humanizeKey(channel.approvalDecision)}`,
                                  )
                                  .join(' | ')}
                              </small>
                              <small>
                                Review checklist:{' '}
                                {selectedTenantEcommerceStorefrontPublishReviewWorkspace.reviewChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceLandingPublishArtifact ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Landing publish artifact
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceLandingPublishArtifact
                                        .summary.headline
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceLandingPublishArtifact.artifactStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                {
                                  selectedTenantEcommerceLandingPublishArtifact
                                    .summary.detail
                                }
                              </small>
                              <small>
                                Hero:{' '}
                                {
                                  selectedTenantEcommerceLandingPublishArtifact
                                    .hero.headline
                                }
                              </small>
                              <small>
                                Offer stack:{' '}
                                {selectedTenantEcommerceLandingPublishArtifact.offerStack
                                  .map((entry) => `${entry.title}: ${entry.detail}`)
                                  .join(' | ')}
                              </small>
                              <small>
                                Final checklist:{' '}
                                {selectedTenantEcommerceLandingPublishArtifact.finalChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceStorefrontReleaseCandidateBrief ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Storefront release candidate brief
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceStorefrontReleaseCandidateBrief
                                        .summary.headline
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceStorefrontReleaseCandidateBrief.briefStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                {
                                  selectedTenantEcommerceStorefrontReleaseCandidateBrief
                                    .summary.detail
                                }
                              </small>
                              <small>
                                Landing:{' '}
                                {
                                  selectedTenantEcommerceStorefrontReleaseCandidateBrief
                                    .landingArtifact.title
                                }{' '}
                                ·{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceStorefrontReleaseCandidateBrief
                                    .landingArtifact.artifactStatus,
                                )}
                              </small>
                              <small>
                                Catalog:{' '}
                                {
                                  selectedTenantEcommerceStorefrontReleaseCandidateBrief
                                    .catalogListing.title
                                }{' '}
                                ·{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceStorefrontReleaseCandidateBrief
                                    .catalogListing.listingStatus,
                                )}
                              </small>
                              <small>
                                Release signals:{' '}
                                {selectedTenantEcommerceStorefrontReleaseCandidateBrief.releaseSignals
                                  .map(
                                    (signal) =>
                                      `${humanizeKey(signal.channelKey)}:${humanizeKey(signal.status)}`,
                                  )
                                  .join(' | ')}
                              </small>
                              <small>
                                Final checklist:{' '}
                                {selectedTenantEcommerceStorefrontReleaseCandidateBrief.finalChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.secondaryButton}
                                  onClick={onLoadStorefrontReleaseControlWorkspace}
                                  type="button"
                                >
                                  Abrir release control
                                </button>
                              </div>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceStorefrontReleaseControlWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Storefront release control workspace
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceStorefrontReleaseControlWorkspace.summary.headline
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceStorefrontReleaseControlWorkspace.controlStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Review / owners:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceStorefrontReleaseControlWorkspace.releaseControl.reviewStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceStorefrontReleaseControlWorkspace.releaseControl.approvalOwner,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceStorefrontReleaseControlWorkspace.releaseControl.launchOwner,
                                )}
                              </small>
                              <small>
                                Decisions:{' '}
                                {selectedTenantEcommerceStorefrontReleaseControlWorkspace.channelDecisions
                                  .map(
                                    (channel) =>
                                      `${humanizeKey(channel.channelKey)}:${humanizeKey(channel.launchDecision)}`,
                                  )
                                  .join(' | ')}
                              </small>
                              <small>
                                Control checklist:{' '}
                                {selectedTenantEcommerceStorefrontReleaseControlWorkspace.controlChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.secondaryButton}
                                  onClick={onLoadStorefrontGoLiveManifest}
                                  type="button"
                                >
                                  Abrir go-live manifest
                                </button>
                              </div>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceStorefrontGoLiveManifest ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Storefront go-live manifest
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceStorefrontGoLiveManifest.summary.headline
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceStorefrontGoLiveManifest.manifestStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                {
                                  selectedTenantEcommerceStorefrontGoLiveManifest.summary.detail
                                }
                              </small>
                              <small>
                                Channel snapshot:{' '}
                                {[
                                  `landing:${humanizeKey(
                                    selectedTenantEcommerceStorefrontGoLiveManifest
                                      .channelSnapshot.landingStatus,
                                  )}`,
                                  `catalog:${humanizeKey(
                                    selectedTenantEcommerceStorefrontGoLiveManifest
                                      .channelSnapshot.catalogStatus,
                                  )}`,
                                  `whatsapp:${humanizeKey(
                                    selectedTenantEcommerceStorefrontGoLiveManifest
                                      .channelSnapshot.whatsappStatus,
                                  )}`,
                                ].join(' | ')}
                              </small>
                              <small>
                                Order readiness:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceStorefrontGoLiveManifest
                                    .orderReadiness.checkoutStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceStorefrontGoLiveManifest
                                    .orderReadiness.invoicingStatus,
                                )}
                              </small>
                              <small>
                                Final checklist:{' '}
                                {selectedTenantEcommerceStorefrontGoLiveManifest.finalChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.secondaryButton}
                                  onClick={onLoadLiveStorefrontSessionWorkspace}
                                  type="button"
                                >
                                  Abrir live storefront session
                                </button>
                              </div>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceLiveStorefrontSessionWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Live storefront session
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceLiveStorefrontSessionWorkspace.summary.headline
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceLiveStorefrontSessionWorkspace.sessionStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                {
                                  selectedTenantEcommerceLiveStorefrontSessionWorkspace.summary.detail
                                }
                              </small>
                              <small>
                                Snapshot:{' '}
                                {
                                  selectedTenantEcommerceLiveStorefrontSessionWorkspace
                                    .storefrontSnapshot.landingHeadline
                                }{' '}
                                ·{' '}
                                {
                                  selectedTenantEcommerceLiveStorefrontSessionWorkspace
                                    .storefrontSnapshot.catalogTitle
                                }{' '}
                                ·{' '}
                                {
                                  selectedTenantEcommerceLiveStorefrontSessionWorkspace
                                    .storefrontSnapshot.pricingPresentation
                                }
                              </small>
                              <small>
                                Release gate:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceLiveStorefrontSessionWorkspace
                                    .releaseGate.goLiveStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceLiveStorefrontSessionWorkspace
                                    .releaseGate.checkoutStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceLiveStorefrontSessionWorkspace
                                    .releaseGate.invoicingStatus,
                                )}
                              </small>
                              <small>
                                Channels:{' '}
                                {selectedTenantEcommerceLiveStorefrontSessionWorkspace.channelSessions
                                  .map(
                                    (channel) =>
                                      `${humanizeKey(channel.channelKey)}:${humanizeKey(channel.status)}`,
                                  )
                                  .join(' | ')}
                              </small>
                              <small>
                                Checklist:{' '}
                                {selectedTenantEcommerceLiveStorefrontSessionWorkspace.sessionChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceWhatsappChannelSequenceWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    WhatsApp channel sequence
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceWhatsappChannelSequenceWorkspace
                                        .assetEntity.title
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceWhatsappChannelSequenceWorkspace.workspaceStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Opener:{' '}
                                {
                                  selectedTenantEcommerceWhatsappChannelSequenceWorkspace
                                    .opener
                                }
                              </small>
                              <small>
                                Follow-up:{' '}
                                {selectedTenantEcommerceWhatsappChannelSequenceWorkspace.followUpSequence.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Recovery:{' '}
                                {selectedTenantEcommerceWhatsappChannelSequenceWorkspace.recoveryBranch.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Close CTA:{' '}
                                {
                                  selectedTenantEcommerceWhatsappChannelSequenceWorkspace
                                    .closeCta
                                }
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceChannelReleaseWorkbench ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Channel release workbench
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceChannelReleaseWorkbench
                                        .summary.headline
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {
                                    selectedTenantEcommerceChannelReleaseWorkbench
                                      .summary.readyCount
                                  }
                                  /{
                                    selectedTenantEcommerceChannelReleaseWorkbench
                                      .summary.totalCandidates
                                  }{' '}
                                  ready
                                </span>
                              </div>
                              <small>
                                {
                                  selectedTenantEcommerceChannelReleaseWorkbench
                                    .summary.detail
                                }
                              </small>
                              <small>
                                Channels:{' '}
                                {selectedTenantEcommerceChannelReleaseWorkbench.channels
                                  .map(
                                    (channel) =>
                                      `${humanizeKey(channel.channelKey)}:${humanizeKey(channel.status)}`,
                                  )
                                  .join(' | ')}
                              </small>
                              <small>
                                QA:{' '}
                                {selectedTenantEcommerceChannelReleaseWorkbench.qaChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Final artifacts:{' '}
                                {selectedTenantEcommerceChannelReleaseWorkbench.finalArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceChannelReleaseExecutionReadiness ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Release execution readiness
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceChannelReleaseExecutionReadiness.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceChannelReleaseExecutionReadiness.overallStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Channels:{' '}
                                {selectedTenantEcommerceChannelReleaseExecutionReadiness.channels
                                  .map(
                                    (channel) =>
                                      `${humanizeKey(channel.channelKey)}:${humanizeKey(channel.releaseStatus)}`,
                                  )
                                  .join(' | ')}
                              </small>
                              <small>
                                Final checklist:{' '}
                                {selectedTenantEcommerceChannelReleaseExecutionReadiness.finalChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              {selectedTenantEcommerceChannelReleaseExecutionReadiness.blockedBy
                                .length > 0 ? (
                                <small>
                                  Blocked by:{' '}
                                  {selectedTenantEcommerceChannelReleaseExecutionReadiness.blockedBy.join(
                                    ' | ',
                                  )}
                                </small>
                              ) : null}
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceChannelReleaseHandoffPacketLoading ===
                                    selectedTenantEcommerceChannelReleaseExecutionReadiness
                                      .productEntity.productEntityId
                                  }
                                  onClick={onRequestChannelReleaseHandoffPacket}
                                  type="button"
                                >
                                  {ecommerceChannelReleaseHandoffPacketLoading ===
                                  selectedTenantEcommerceChannelReleaseExecutionReadiness
                                    .productEntity.productEntityId
                                    ? 'Empaquetando handoff...'
                                    : 'Solicitar release handoff'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceChannelReleaseApprovalPacketLoading ===
                                    selectedTenantEcommerceChannelReleaseExecutionReadiness
                                      .productEntity.productEntityId
                                  }
                                  onClick={onRequestChannelReleaseApprovalPacket}
                                  type="button"
                                >
                                  {ecommerceChannelReleaseApprovalPacketLoading ===
                                  selectedTenantEcommerceChannelReleaseExecutionReadiness
                                    .productEntity.productEntityId
                                    ? 'Preparando approval...'
                                    : 'Solicitar release approval'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceChannelReleaseLaunchPacketLoading ===
                                    selectedTenantEcommerceChannelReleaseExecutionReadiness
                                      .productEntity.productEntityId
                                  }
                                  onClick={onRequestChannelReleaseLaunchPacket}
                                  type="button"
                                >
                                  {ecommerceChannelReleaseLaunchPacketLoading ===
                                  selectedTenantEcommerceChannelReleaseExecutionReadiness
                                    .productEntity.productEntityId
                                    ? 'Preparando launch...'
                                    : 'Solicitar launch packet'}
                                </button>
                              </div>
                            </div>
                          ) : null}
                          {lastEcommerceCheckoutCustomerCapturePacket ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Checkout customer capture packet
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceCheckoutCustomerCapturePacket.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceCheckoutCustomerCapturePacket.captureStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Required:{' '}
                                {lastEcommerceCheckoutCustomerCapturePacket.captureForm.requiredFields.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Optional:{' '}
                                {lastEcommerceCheckoutCustomerCapturePacket.captureForm.optionalFields.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Billing readiness:{' '}
                                {humanizeKey(
                                  lastEcommerceCheckoutCustomerCapturePacket
                                    .billingReadiness.status,
                                )}{' '}
                                ·{' '}
                                {
                                  lastEcommerceCheckoutCustomerCapturePacket
                                    .billingReadiness.hint
                                }
                              </small>
                              <small>
                                Validation:{' '}
                                {lastEcommerceCheckoutCustomerCapturePacket.captureForm.validationRules.join(
                                  ' | ',
                                )}
                              </small>
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceCheckoutCustomerCapturePacketLoading ===
                                    lastEcommerceCheckoutCustomerCapturePacket
                                      .productEntity.productEntityId
                                  }
                                  onClick={
                                    onRequestCheckoutCustomerCapturePacket
                                  }
                                  type="button"
                                >
                                  {ecommerceCheckoutCustomerCapturePacketLoading ===
                                  lastEcommerceCheckoutCustomerCapturePacket
                                    .productEntity.productEntityId
                                    ? 'Preparando capture...'
                                    : 'Solicitar customer capture'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceOrderToInvoiceReadinessPacketLoading ===
                                    lastEcommerceCheckoutCustomerCapturePacket
                                      .productEntity.productEntityId
                                  }
                                  onClick={
                                    onRequestOrderToInvoiceReadinessPacket
                                  }
                                  type="button"
                                >
                                  {ecommerceOrderToInvoiceReadinessPacketLoading ===
                                  lastEcommerceCheckoutCustomerCapturePacket
                                    .productEntity.productEntityId
                                    ? 'Preparando readiness...'
                                    : 'Solicitar order-to-invoice readiness'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceOrderDraftSaveLoading ===
                                    lastEcommerceCheckoutCustomerCapturePacket
                                      .productEntity.productEntityId
                                  }
                                  onClick={onSaveOrderDraft}
                                  type="button"
                                >
                                  {ecommerceOrderDraftSaveLoading ===
                                  lastEcommerceCheckoutCustomerCapturePacket
                                    .productEntity.productEntityId
                                    ? 'Guardando order draft...'
                                    : 'Guardar order draft'}
                                </button>
                              </div>
                            </div>
                          ) : null}
                          {lastEcommerceChannelReleaseHandoffPacket ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Release handoff packet
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceChannelReleaseHandoffPacket.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceChannelReleaseHandoffPacket.handoffStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Channels:{' '}
                                {lastEcommerceChannelReleaseHandoffPacket.channels
                                  .map(
                                    (channel) =>
                                      `${humanizeKey(channel.channelKey)}:${humanizeKey(channel.readiness)}`,
                                  )
                                  .join(' | ')}
                              </small>
                              <small>
                                Checklist:{' '}
                                {lastEcommerceChannelReleaseHandoffPacket.handoffChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              {lastEcommerceChannelReleaseHandoffPacket.warnings
                                .length > 0 ? (
                                <small>
                                  Warnings:{' '}
                                  {lastEcommerceChannelReleaseHandoffPacket.warnings.join(
                                    ' | ',
                                  )}
                                </small>
                              ) : null}
                              {lastEcommerceChannelReleaseHandoffPacket.blockers
                                .length > 0 ? (
                                <small>
                                  Blockers:{' '}
                                  {lastEcommerceChannelReleaseHandoffPacket.blockers.join(
                                    ' | ',
                                  )}
                                </small>
                              ) : null}
                            </div>
                          ) : null}
                          {lastEcommerceChannelReleaseApprovalPacket ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Release approval packet
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceChannelReleaseApprovalPacket.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceChannelReleaseApprovalPacket.approvalStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Owner:{' '}
                                {humanizeKey(
                                  lastEcommerceChannelReleaseApprovalPacket.approvalOwner,
                                )}
                              </small>
                              <small>
                                Decisions:{' '}
                                {lastEcommerceChannelReleaseApprovalPacket.channels
                                  .map(
                                    (channel) =>
                                      `${humanizeKey(channel.channelKey)}:${humanizeKey(channel.approvalDecision)}`,
                                  )
                                  .join(' | ')}
                              </small>
                              <small>
                                Required approvals:{' '}
                                {lastEcommerceChannelReleaseApprovalPacket.requiredApprovals.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceChannelReleaseLaunchPacket ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Release launch packet
                                  </span>
                                  <h4>
                                    {lastEcommerceChannelReleaseLaunchPacket.summary}
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceChannelReleaseLaunchPacket.launchStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Launch owner:{' '}
                                {humanizeKey(
                                  lastEcommerceChannelReleaseLaunchPacket.launchOwner,
                                )}
                              </small>
                              <small>
                                Decisions:{' '}
                                {lastEcommerceChannelReleaseLaunchPacket.channels
                                  .map(
                                    (channel) =>
                                      `${humanizeKey(channel.channelKey)}:${humanizeKey(channel.launchDecision)}`,
                                  )
                                  .join(' | ')}
                              </small>
                              <small>
                                Launch checklist:{' '}
                                {lastEcommerceChannelReleaseLaunchPacket.launchChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.secondaryButton}
                                  onClick={onLoadCatalogListingAsset}
                                  type="button"
                                >
                                  Abrir catalog listing asset
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceCatalogStorefrontPlacementPacketLoading ===
                                    selectedTenantEcommerceCatalogCommercialCard?.productEntity
                                      .productEntityId
                                  }
                                  onClick={onRequestCatalogStorefrontPlacementPacket}
                                  type="button"
                                >
                                  {ecommerceCatalogStorefrontPlacementPacketLoading ===
                                  selectedTenantEcommerceCatalogCommercialCard?.productEntity
                                    .productEntityId
                                    ? 'Preparando placement...'
                                    : 'Solicitar placement packet'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceCatalogMerchandisingPacketLoading ===
                                    selectedTenantEcommerceCatalogCommercialCard?.productEntity
                                      .productEntityId
                                  }
                                  onClick={onRequestCatalogMerchandisingPacket}
                                  type="button"
                                >
                                  {ecommerceCatalogMerchandisingPacketLoading ===
                                  selectedTenantEcommerceCatalogCommercialCard?.productEntity
                                    .productEntityId
                                    ? 'Preparando merchandising...'
                                    : 'Solicitar merchandising'}
                                </button>
                              </div>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceCatalogListingAsset ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Catalog listing asset
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceCatalogListingAsset
                                        .card.title
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceCatalogListingAsset.listingStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                {
                                  selectedTenantEcommerceCatalogListingAsset
                                    .storefrontSummary
                                }
                              </small>
                              <small>
                                Pricing:{' '}
                                {
                                  selectedTenantEcommerceCatalogListingAsset.card
                                    .pricingPresentation
                                }
                              </small>
                              <small>
                                Placement notes:{' '}
                                {selectedTenantEcommerceCatalogListingAsset.placementNotes.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Final checklist:{' '}
                                {selectedTenantEcommerceCatalogListingAsset.finalChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceCatalogStorefrontPlacementPacket ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Catalog storefront placement packet
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceCatalogStorefrontPlacementPacket
                                        .placementSummary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceCatalogStorefrontPlacementPacket.placementStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Preview / approval:{' '}
                                {humanizeKey(
                                  lastEcommerceCatalogStorefrontPlacementPacket
                                    .storefrontContext.previewStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  lastEcommerceCatalogStorefrontPlacementPacket
                                    .storefrontContext.approvalStatus,
                                )}
                              </small>
                              <small>
                                Placement notes:{' '}
                                {lastEcommerceCatalogStorefrontPlacementPacket.placementNotes.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Placement checklist:{' '}
                                {lastEcommerceCatalogStorefrontPlacementPacket.placementChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceCatalogMerchandisingPacket ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Catalog merchandising packet
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceCatalogMerchandisingPacket.merchandisingSummary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceCatalogMerchandisingPacket.merchandisingStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Commercial / placement / launch:{' '}
                                {humanizeKey(
                                  lastEcommerceCatalogMerchandisingPacket
                                    .placementContext.commercialStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  lastEcommerceCatalogMerchandisingPacket
                                    .placementContext.placementStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  lastEcommerceCatalogMerchandisingPacket
                                    .placementContext.launchDecision,
                                )}
                              </small>
                              <small>
                                Notes:{' '}
                                {lastEcommerceCatalogMerchandisingPacket.merchandisingNotes.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Checklist:{' '}
                                {lastEcommerceCatalogMerchandisingPacket.merchandisingChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.secondaryButton}
                                  onClick={onLoadCheckoutOrderIntakeWorkspace}
                                  type="button"
                                >
                                  Abrir checkout intake
                                </button>
                              </div>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceCheckoutOrderIntakeWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Checkout order intake workspace
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceCheckoutOrderIntakeWorkspace.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceCheckoutOrderIntakeWorkspace.checkoutStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Offer:{' '}
                                {
                                  selectedTenantEcommerceCheckoutOrderIntakeWorkspace
                                    .checkoutDraft.offerTitle
                                }{' '}
                                ·{' '}
                                {
                                  selectedTenantEcommerceCheckoutOrderIntakeWorkspace
                                    .checkoutDraft.pricingSnapshot
                                }
                              </small>
                              <small>
                                Customer fields:{' '}
                                {selectedTenantEcommerceCheckoutOrderIntakeWorkspace.customerFields.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Invoicing:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceCheckoutOrderIntakeWorkspace
                                    .invoicingConnection.status,
                                )}{' '}
                                ·{' '}
                                {
                                  selectedTenantEcommerceCheckoutOrderIntakeWorkspace
                                    .invoicingConnection.detail
                                }
                              </small>
                              <small>
                                Checklist:{' '}
                                {selectedTenantEcommerceCheckoutOrderIntakeWorkspace.orderChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceOrderInvoicingBridgeLoading ===
                                    selectedTenantEcommerceCheckoutOrderIntakeWorkspace
                                      .productEntity.productEntityId
                                  }
                                  onClick={onRequestOrderInvoicingBridge}
                                  type="button"
                                >
                                  {ecommerceOrderInvoicingBridgeLoading ===
                                  selectedTenantEcommerceCheckoutOrderIntakeWorkspace
                                    .productEntity.productEntityId
                                    ? 'Preparando bridge fiscal...'
                                    : 'Solicitar invoicing bridge'}
                                </button>
                              </div>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceLandingPageStructure ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Landing page structure
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceLandingPageStructure.hero
                                        .headline
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceLandingPageStructure.structureStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Proof strip:{' '}
                                {selectedTenantEcommerceLandingPageStructure.proofStrip.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Offer stack:{' '}
                                {selectedTenantEcommerceLandingPageStructure.offerStack
                                  .map((entry) => `${entry.title}: ${entry.detail}`)
                                  .join(' | ')}
                              </small>
                              <small>
                                CTA band:{' '}
                                {
                                  selectedTenantEcommerceLandingPageStructure.ctaBand
                                    .primaryCta
                                }{' '}
                                ·{' '}
                                {
                                  selectedTenantEcommerceLandingPageStructure.ctaBand
                                    .supportLabel
                                }
                              </small>
                              <small>
                                FAQ seed:{' '}
                                {selectedTenantEcommerceLandingPageStructure.faqSeed.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceWhatsappSalesFlow ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    WhatsApp sales flow
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceWhatsappSalesFlow.stages
                                        .opener
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceWhatsappSalesFlow.flowStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Qualification:{' '}
                                {
                                  selectedTenantEcommerceWhatsappSalesFlow.stages
                                    .qualification
                                }
                              </small>
                              <small>
                                Objection handling:{' '}
                                {selectedTenantEcommerceWhatsappSalesFlow.stages.objectionHandling.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Closing CTA:{' '}
                                {
                                  selectedTenantEcommerceWhatsappSalesFlow.stages
                                    .closingCta
                                }
                              </small>
                              <small>
                                Fallback:{' '}
                                {
                                  selectedTenantEcommerceWhatsappSalesFlow.stages
                                    .fallbackEscalation
                                }
                              </small>
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceWhatsappGrowthHandoffLoading ===
                                    selectedTenantEcommerceWhatsappSalesFlow
                                      .productEntity.productEntityId
                                  }
                                  onClick={onRequestWhatsappGrowthHandoff}
                                  type="button"
                                >
                                  {ecommerceWhatsappGrowthHandoffLoading ===
                                  selectedTenantEcommerceWhatsappSalesFlow
                                    .productEntity.productEntityId
                                    ? 'Preparando handoff...'
                                    : 'Solicitar Growth handoff'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  onClick={onLoadWhatsappGrowthActivationWorkspace}
                                  type="button"
                                >
                                  Abrir Growth activation
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceWhatsappGrowthActivationPacketLoading ===
                                    selectedTenantEcommerceWhatsappSalesFlow
                                      .productEntity.productEntityId
                                  }
                                  onClick={onRequestWhatsappGrowthActivationPacket}
                                  type="button"
                                >
                                  {ecommerceWhatsappGrowthActivationPacketLoading ===
                                  selectedTenantEcommerceWhatsappSalesFlow
                                    .productEntity.productEntityId
                                    ? 'Preparando activation packet...'
                                    : 'Solicitar activation packet'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceWhatsappGrowthExecutionBridgeLoading ===
                                    selectedTenantEcommerceWhatsappSalesFlow
                                      .productEntity.productEntityId
                                  }
                                  onClick={onRequestWhatsappGrowthExecutionBridge}
                                  type="button"
                                >
                                  {ecommerceWhatsappGrowthExecutionBridgeLoading ===
                                  selectedTenantEcommerceWhatsappSalesFlow
                                    .productEntity.productEntityId
                                    ? 'Preparando execution bridge...'
                                    : 'Solicitar execution bridge'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceWhatsappGrowthOperatorLaunchPacketLoading ===
                                    selectedTenantEcommerceWhatsappSalesFlow
                                      .productEntity.productEntityId
                                  }
                                  onClick={onRequestWhatsappGrowthOperatorLaunchPacket}
                                  type="button"
                                >
                                  {ecommerceWhatsappGrowthOperatorLaunchPacketLoading ===
                                  selectedTenantEcommerceWhatsappSalesFlow
                                    .productEntity.productEntityId
                                    ? 'Preparando launch packet...'
                                    : 'Solicitar operator launch'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceWhatsappGrowthLaunchAcknowledgementPacketLoading ===
                                    selectedTenantEcommerceWhatsappSalesFlow
                                      .productEntity.productEntityId
                                  }
                                  onClick={
                                    onRequestWhatsappGrowthLaunchAcknowledgementPacket
                                  }
                                  type="button"
                                >
                                  {ecommerceWhatsappGrowthLaunchAcknowledgementPacketLoading ===
                                  selectedTenantEcommerceWhatsappSalesFlow
                                    .productEntity.productEntityId
                                    ? 'Preparando acknowledgement...'
                                    : 'Solicitar acknowledgement'}
                                </button>
                              </div>
                            </div>
                          ) : null}
                          {lastEcommerceWhatsappGrowthHandoff ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    WhatsApp growth handoff
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceWhatsappGrowthHandoff.payload
                                        .opener
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceWhatsappGrowthHandoff.handoffStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Qualification:{' '}
                                {
                                  lastEcommerceWhatsappGrowthHandoff.payload
                                    .qualification
                                }
                              </small>
                              <small>
                                Objections:{' '}
                                {lastEcommerceWhatsappGrowthHandoff.payload.objectionHandling.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Closing CTA:{' '}
                                {
                                  lastEcommerceWhatsappGrowthHandoff.payload
                                    .closingCta
                                }
                              </small>
                              <small>
                                Bridge artifacts:{' '}
                                {lastEcommerceWhatsappGrowthHandoff.bridgeArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceWhatsappGrowthActivationWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    WhatsApp growth activation
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceWhatsappGrowthActivationWorkspace.activationSummary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceWhatsappGrowthActivationWorkspace.activationStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Opener:{' '}
                                {
                                  selectedTenantEcommerceWhatsappGrowthActivationWorkspace
                                    .sequencePayload.opener
                                }
                              </small>
                              <small>
                                Qualification:{' '}
                                {
                                  selectedTenantEcommerceWhatsappGrowthActivationWorkspace
                                    .sequencePayload.qualification
                                }
                              </small>
                              <small>
                                Checklist:{' '}
                                {selectedTenantEcommerceWhatsappGrowthActivationWorkspace.activationChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceWhatsappGrowthActivationPacket ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    WhatsApp growth activation packet
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceWhatsappGrowthActivationPacket.activationSummary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceWhatsappGrowthActivationPacket.packetStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Opener:{' '}
                                {
                                  lastEcommerceWhatsappGrowthActivationPacket
                                    .messagePack.opener
                                }
                              </small>
                              <small>
                                Qualification:{' '}
                                {
                                  lastEcommerceWhatsappGrowthActivationPacket
                                    .messagePack.qualification
                                }
                              </small>
                              <small>
                                Operator steps:{' '}
                                {lastEcommerceWhatsappGrowthActivationPacket.operatorSteps.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceWhatsappGrowthExecutionBridge ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    WhatsApp growth execution bridge
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceWhatsappGrowthExecutionBridge
                                        .summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceWhatsappGrowthExecutionBridge.bridgeStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Opener:{' '}
                                {
                                  lastEcommerceWhatsappGrowthExecutionBridge
                                    .executionPayload.opener
                                }
                              </small>
                              <small>
                                Qualification:{' '}
                                {
                                  lastEcommerceWhatsappGrowthExecutionBridge
                                    .executionPayload.qualification
                                }
                              </small>
                              <small>
                                Next steps:{' '}
                                {lastEcommerceWhatsappGrowthExecutionBridge.nextSteps.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceWhatsappGrowthOperatorLaunchPacket ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    WhatsApp growth operator launch packet
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceWhatsappGrowthOperatorLaunchPacket
                                        .summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceWhatsappGrowthOperatorLaunchPacket.launchStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Opener:{' '}
                                {
                                  lastEcommerceWhatsappGrowthOperatorLaunchPacket
                                    .executionPayload.opener
                                }
                              </small>
                              <small>
                                Qualification:{' '}
                                {
                                  lastEcommerceWhatsappGrowthOperatorLaunchPacket
                                    .executionPayload.qualification
                                }
                              </small>
                              <small>
                                Operator steps:{' '}
                                {lastEcommerceWhatsappGrowthOperatorLaunchPacket.operatorSteps.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Launch checklist:{' '}
                                {lastEcommerceWhatsappGrowthOperatorLaunchPacket.launchChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceWhatsappGrowthLaunchAcknowledgementPacket ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    WhatsApp growth launch acknowledgement packet
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceWhatsappGrowthLaunchAcknowledgementPacket.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceWhatsappGrowthLaunchAcknowledgementPacket.acknowledgementStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Activation / packet / launch:{' '}
                                {humanizeKey(
                                  lastEcommerceWhatsappGrowthLaunchAcknowledgementPacket
                                    .activationContext.workspaceStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  lastEcommerceWhatsappGrowthLaunchAcknowledgementPacket
                                    .activationContext.packetStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  lastEcommerceWhatsappGrowthLaunchAcknowledgementPacket
                                    .activationContext.launchStatus,
                                )}
                              </small>
                              <small>
                                Operator actions:{' '}
                                {lastEcommerceWhatsappGrowthLaunchAcknowledgementPacket.operatorActions.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Acknowledgement checklist:{' '}
                                {lastEcommerceWhatsappGrowthLaunchAcknowledgementPacket.acknowledgementChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceOrderInvoicingBridge ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order invoicing bridge
                                  </span>
                                  <h4>
                                    {lastEcommerceOrderInvoicingBridge.summary}
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceOrderInvoicingBridge.bridgeStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Draft:{' '}
                                {lastEcommerceOrderInvoicingBridge.orderDraft.offerTitle}{' '}
                                ·{' '}
                                {
                                  lastEcommerceOrderInvoicingBridge.orderDraft
                                    .pricingSnapshot
                                }
                              </small>
                              <small>
                                Invoice readiness:{' '}
                                {humanizeKey(
                                  lastEcommerceOrderInvoicingBridge
                                    .invoiceReadiness.connectionStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  lastEcommerceOrderInvoicingBridge
                                    .invoiceReadiness.buyerProfileStatus,
                                )}
                              </small>
                              <small>
                                Fiscal requirements:{' '}
                                {lastEcommerceOrderInvoicingBridge.fiscalRequirements.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceOrderToInvoiceReadinessPacket ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order-to-invoice readiness packet
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceOrderToInvoiceReadinessPacket.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceOrderToInvoiceReadinessPacket.readinessStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Snapshot:{' '}
                                {humanizeKey(
                                  lastEcommerceOrderToInvoiceReadinessPacket
                                    .readinessSnapshot.captureStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  lastEcommerceOrderToInvoiceReadinessPacket
                                    .readinessSnapshot.bridgeStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  lastEcommerceOrderToInvoiceReadinessPacket
                                    .readinessSnapshot.buyerProfileStatus,
                                )}
                              </small>
                              <small>
                                Missing fields:{' '}
                                {lastEcommerceOrderToInvoiceReadinessPacket.missingFields
                                  .length > 0
                                  ? lastEcommerceOrderToInvoiceReadinessPacket.missingFields.join(
                                      ' | ',
                                    )
                                  : 'Ninguno'}
                              </small>
                              <small>
                                Handoff artifacts:{' '}
                                {lastEcommerceOrderToInvoiceReadinessPacket.handoffArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Checklist:{' '}
                                {lastEcommerceOrderToInvoiceReadinessPacket.operatorChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {tenantEcommerceOrderDraftRegistry ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order draft registry
                                  </span>
                                  <h4>
                                    {
                                      tenantEcommerceOrderDraftRegistry.summary
                                        .headline
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {
                                    tenantEcommerceOrderDraftRegistry.summary
                                      .totalOrderDrafts
                                  }{' '}
                                  drafts
                                </span>
                              </div>
                              <small>
                                {
                                  tenantEcommerceOrderDraftRegistry.summary
                                    .detail
                                }
                              </small>
                              {tenantEcommerceOrderDraftRegistry.orderDrafts
                                .length > 0 ? (
                                <div className={styles.inlineActions}>
                                  {tenantEcommerceOrderDraftRegistry.orderDrafts.map(
                                    (orderDraft) => (
                                      <button
                                        className={styles.secondaryButton}
                                        key={orderDraft.id}
                                        onClick={() =>
                                          onSelectOrderDraft(orderDraft.id)
                                        }
                                        type="button"
                                      >
                                        {humanizeKey(orderDraft.status)} ·{' '}
                                        {orderDraft.offerTitle}
                                      </button>
                                    ),
                                  )}
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                          {selectedTenantEcommerceOrderDraftDetail ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order draft detail
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceOrderDraftDetail.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceOrderDraftDetail
                                      .orderDraft.status,
                                  )}
                                </span>
                              </div>
                              <small>
                                Offer:{' '}
                                {
                                  selectedTenantEcommerceOrderDraftDetail
                                    .orderDraft.offerTitle
                                }{' '}
                                ·{' '}
                                {
                                  selectedTenantEcommerceOrderDraftDetail
                                    .orderDraft.pricingSnapshot
                                }
                              </small>
                              <small>
                                Missing fields:{' '}
                                {selectedTenantEcommerceOrderDraftDetail.orderDraft
                                  .missingFields.length > 0
                                  ? selectedTenantEcommerceOrderDraftDetail.orderDraft.missingFields.join(
                                      ' | ',
                                    )
                                  : 'Ninguno'}
                              </small>
                              <small>
                                Next actions:{' '}
                                {selectedTenantEcommerceOrderDraftDetail.nextActions.join(
                                  ' | ',
                                )}
                              </small>
                              <div className={styles.inlineActions}>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceCheckoutCloseoutPacketLoading ===
                                      selectedTenantEcommerceOrderDraftDetail
                                        .orderDraft.id ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={onRequestCheckoutCloseoutPacket}
                                  type="button"
                                >
                                  {ecommerceCheckoutCloseoutPacketLoading ===
                                  selectedTenantEcommerceOrderDraftDetail
                                    .orderDraft.id
                                    ? 'Preparando closeout...'
                                    : 'Solicitar checkout closeout'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceOrderInvoiceDraftBridgeLoading ===
                                      selectedTenantEcommerceOrderDraftDetail
                                        .orderDraft.id ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={onRequestOrderInvoiceDraftBridge}
                                  type="button"
                                >
                                  {ecommerceOrderInvoiceDraftBridgeLoading ===
                                  selectedTenantEcommerceOrderDraftDetail
                                    .orderDraft.id
                                    ? 'Preparando invoice draft...'
                                    : 'Solicitar invoice draft bridge'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceOrderToGrowthConversationBridgeLoading ===
                                      selectedTenantEcommerceOrderDraftDetail
                                        .orderDraft.id ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={
                                    onRequestOrderToGrowthConversationBridge
                                  }
                                  type="button"
                                >
                                  {ecommerceOrderToGrowthConversationBridgeLoading ===
                                  selectedTenantEcommerceOrderDraftDetail
                                    .orderDraft.id
                                    ? 'Preparando bridge...'
                                    : 'Solicitar growth bridge'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceOrderApprovalDecisionLoading ===
                                      selectedTenantEcommerceOrderDraftDetail
                                        .orderDraft.id ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={onRequestOrderApprovalDecision}
                                  type="button"
                                >
                                  {ecommerceOrderApprovalDecisionLoading ===
                                  selectedTenantEcommerceOrderDraftDetail
                                    .orderDraft.id
                                    ? 'Preparando approval...'
                                    : 'Solicitar approval decision'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceOrderHandoffDecisionLoading ===
                                      selectedTenantEcommerceOrderDraftDetail
                                        .orderDraft.id ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={onRequestOrderHandoffDecision}
                                  type="button"
                                >
                                  {ecommerceOrderHandoffDecisionLoading ===
                                  selectedTenantEcommerceOrderDraftDetail
                                    .orderDraft.id
                                    ? 'Preparando handoff...'
                                    : 'Solicitar handoff decision'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceOrderGrowthFollowUpWorkspaceLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={
                                    onLoadOrderGrowthFollowUpWorkspace
                                  }
                                  type="button"
                                >
                                  {tenantEcommerceOrderGrowthFollowUpWorkspaceLoading
                                    ? 'Cargando follow-up...'
                                    : 'Cargar growth follow-up'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceOrderFiscalDataCompletionWorkspaceLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={
                                    onLoadOrderFiscalDataCompletionWorkspace
                                  }
                                  type="button"
                                >
                                  {tenantEcommerceOrderFiscalDataCompletionWorkspaceLoading
                                    ? 'Cargando fiscal...'
                                    : 'Cargar fiscal completion'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceInvoiceDraftIntakeWorkspaceLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={onLoadInvoiceDraftIntakeWorkspace}
                                  type="button"
                                >
                                  {tenantEcommerceInvoiceDraftIntakeWorkspaceLoading
                                    ? 'Cargando invoice intake...'
                                    : 'Cargar invoice intake'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceOrderHandoffExecutionWorkspaceLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={
                                    onLoadOrderHandoffExecutionWorkspace
                                  }
                                  type="button"
                                >
                                  {tenantEcommerceOrderHandoffExecutionWorkspaceLoading
                                    ? 'Cargando handoff execution...'
                                    : 'Cargar handoff execution'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceInvoiceDraftOpenBridgeLoading ===
                                      selectedTenantEcommerceOrderDraftDetail
                                        .orderDraft.id ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={onRequestInvoiceDraftOpenBridge}
                                  type="button"
                                >
                                  {ecommerceInvoiceDraftOpenBridgeLoading ===
                                  selectedTenantEcommerceOrderDraftDetail
                                    .orderDraft.id
                                    ? 'Preparando invoice open...'
                                    : 'Solicitar invoice open bridge'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceOrderHoldResolutionWorkspaceLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={
                                    onLoadOrderHoldResolutionWorkspace
                                  }
                                  type="button"
                                >
                                  {tenantEcommerceOrderHoldResolutionWorkspaceLoading
                                    ? 'Cargando hold resolution...'
                                    : 'Cargar hold resolution'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceInvoiceDraftLaunchBridgeLoading ===
                                      selectedTenantEcommerceOrderDraftDetail
                                        .orderDraft.id ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={onRequestInvoiceDraftLaunchBridge}
                                  type="button"
                                >
                                  {ecommerceInvoiceDraftLaunchBridgeLoading ===
                                  selectedTenantEcommerceOrderDraftDetail
                                    .orderDraft.id
                                    ? 'Preparando invoice launch...'
                                    : 'Solicitar invoice launch bridge'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceOrderRouteResolutionPacketLoading ===
                                      selectedTenantEcommerceOrderDraftDetail
                                        .orderDraft.id ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={
                                    onRequestOrderRouteResolutionPacket
                                  }
                                  type="button"
                                >
                                  {ecommerceOrderRouteResolutionPacketLoading ===
                                  selectedTenantEcommerceOrderDraftDetail
                                    .orderDraft.id
                                    ? 'Resolviendo ruta...'
                                    : 'Solicitar route resolution'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceInvoiceDraftHandoffWorkspaceLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={
                                    onLoadInvoiceDraftHandoffWorkspace
                                  }
                                  type="button"
                                >
                                  {tenantEcommerceInvoiceDraftHandoffWorkspaceLoading
                                    ? 'Cargando invoice handoff...'
                                    : 'Cargar invoice handoff'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceInvoiceHandoffAcknowledgementLoading ===
                                      selectedTenantEcommerceOrderDraftDetail
                                        .orderDraft.id ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={
                                    onRequestInvoiceHandoffAcknowledgement
                                  }
                                  type="button"
                                >
                                  {ecommerceInvoiceHandoffAcknowledgementLoading ===
                                  selectedTenantEcommerceOrderDraftDetail
                                    .orderDraft.id
                                    ? 'Solicitando acknowledgement...'
                                    : 'Solicitar invoice acknowledgement'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceOrderPaymentReadinessWorkspaceLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={
                                    onLoadOrderPaymentReadinessWorkspace
                                  }
                                  type="button"
                                >
                                  {tenantEcommerceOrderPaymentReadinessWorkspaceLoading
                                    ? 'Cargando payment readiness...'
                                    : 'Cargar payment readiness'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceOrderPaymentConfirmationWorkspaceLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={
                                    onLoadOrderPaymentConfirmationWorkspace
                                  }
                                  type="button"
                                >
                                  {tenantEcommerceOrderPaymentConfirmationWorkspaceLoading
                                    ? 'Cargando payment confirmation...'
                                    : 'Cargar payment confirmation'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    ecommerceOrderPaymentConfirmationDecisionLoading ===
                                      selectedTenantEcommerceOrderDraftDetail
                                        .orderDraft.id ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={
                                    onRequestOrderPaymentConfirmationDecision
                                  }
                                  type="button"
                                >
                                  {ecommerceOrderPaymentConfirmationDecisionLoading ===
                                  selectedTenantEcommerceOrderDraftDetail
                                    .orderDraft.id
                                    ? 'Solicitando confirmation decision...'
                                    : 'Solicitar confirmation decision'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceOrderPaymentConfirmationLogLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={onLoadOrderPaymentConfirmationLog}
                                  type="button"
                                >
                                  {tenantEcommerceOrderPaymentConfirmationLogLoading
                                    ? 'Cargando confirmation log...'
                                    : 'Cargar confirmation log'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceOrderFulfillmentReadinessWorkspaceLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={
                                    onLoadOrderFulfillmentReadinessWorkspace
                                  }
                                  type="button"
                                >
                                  {tenantEcommerceOrderFulfillmentReadinessWorkspaceLoading
                                    ? 'Cargando fulfillment readiness...'
                                    : 'Cargar fulfillment readiness'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceOrderFulfillmentExecutionWorkspaceLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={
                                    onLoadOrderFulfillmentExecutionWorkspace
                                  }
                                  type="button"
                                >
                                  {tenantEcommerceOrderFulfillmentExecutionWorkspaceLoading
                                    ? 'Cargando fulfillment execution...'
                                    : 'Cargar fulfillment execution'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceOrderFulfillmentDeliveryWorkspaceLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={
                                    onLoadOrderFulfillmentDeliveryWorkspace
                                  }
                                  type="button"
                                >
                                  {tenantEcommerceOrderFulfillmentDeliveryWorkspaceLoading
                                    ? 'Cargando fulfillment delivery...'
                                    : 'Cargar fulfillment delivery'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceOrderStatusLifecycleDetailLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={() =>
                                    onSelectOrderStatusLifecycle(
                                      selectedTenantEcommerceOrderDraftDetail
                                        .orderDraft.id,
                                    )
                                  }
                                  type="button"
                                >
                                  {tenantEcommerceOrderStatusLifecycleDetailLoading
                                    ? 'Cargando lifecycle...'
                                    : 'Cargar lifecycle'}
                                </button>
                                <button
                                  className={styles.secondaryButton}
                                  disabled={
                                    tenantEcommerceOrderPostSaleLifecycleDetailLoading ||
                                    tenantEcommerceOrderDraftDetailLoading
                                  }
                                  onClick={() =>
                                    onSelectOrderPostSaleLifecycle(
                                      selectedTenantEcommerceOrderDraftDetail
                                        .orderDraft.id,
                                    )
                                  }
                                  type="button"
                                >
                                  {tenantEcommerceOrderPostSaleLifecycleDetailLoading
                                    ? 'Cargando post-sale...'
                                    : 'Cargar post-sale'}
                                </button>
                              </div>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceOrderReviewWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order review workspace
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceOrderReviewWorkspace.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceOrderReviewWorkspace.reviewStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Snapshot:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderReviewWorkspace
                                    .reviewSnapshot.captureStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderReviewWorkspace
                                    .reviewSnapshot.closeoutStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderReviewWorkspace
                                    .reviewSnapshot.invoiceReadinessStatus,
                                )}
                              </small>
                              <small>
                                Review checklist:{' '}
                                {selectedTenantEcommerceOrderReviewWorkspace.reviewChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Next actions:{' '}
                                {selectedTenantEcommerceOrderReviewWorkspace.nextActions.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceOrderApprovalDecision ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order approval decision
                                  </span>
                                  <h4>
                                    {lastEcommerceOrderApprovalDecision.summary}
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceOrderApprovalDecision.decision,
                                  )}
                                </span>
                              </div>
                              <small>
                                Owner:{' '}
                                {humanizeKey(
                                  lastEcommerceOrderApprovalDecision.owner.productKey,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  lastEcommerceOrderApprovalDecision.owner.role,
                                )}
                              </small>
                              <small>
                                Rationale:{' '}
                                {lastEcommerceOrderApprovalDecision.rationale}
                              </small>
                              <small>
                                Approval checklist:{' '}
                                {lastEcommerceOrderApprovalDecision.approvalChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceOrderHandoffDecision ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order handoff decision
                                  </span>
                                  <h4>
                                    {lastEcommerceOrderHandoffDecision.summary}
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceOrderHandoffDecision.route,
                                  )}
                                </span>
                              </div>
                              <small>
                                Status:{' '}
                                {humanizeKey(
                                  lastEcommerceOrderHandoffDecision.handoffStatus,
                                )}{' '}
                                · Owner:{' '}
                                {humanizeKey(
                                  lastEcommerceOrderHandoffDecision.owner.productKey,
                                )}
                              </small>
                              <small>
                                Rationale:{' '}
                                {lastEcommerceOrderHandoffDecision.rationale}
                              </small>
                              <small>
                                Route checklist:{' '}
                                {lastEcommerceOrderHandoffDecision.routeChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceCheckoutCloseoutPacket ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Checkout closeout packet
                                  </span>
                                  <h4>
                                    {lastEcommerceCheckoutCloseoutPacket.summary}
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceCheckoutCloseoutPacket.closeoutStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Payment readiness:{' '}
                                {humanizeKey(
                                  lastEcommerceCheckoutCloseoutPacket
                                    .paymentReadiness.status,
                                )}{' '}
                                ·{' '}
                                {
                                  lastEcommerceCheckoutCloseoutPacket
                                    .paymentReadiness.hint
                                }
                              </small>
                              <small>
                                Invoicing readiness:{' '}
                                {humanizeKey(
                                  lastEcommerceCheckoutCloseoutPacket
                                    .invoicingReadiness.status,
                                )}{' '}
                                ·{' '}
                                {
                                  lastEcommerceCheckoutCloseoutPacket
                                    .invoicingReadiness.detail
                                }
                              </small>
                              <small>
                                Checklist:{' '}
                                {lastEcommerceCheckoutCloseoutPacket.closeoutChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceOrderInvoiceDraftBridge ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order invoice draft bridge
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceOrderInvoiceDraftBridge.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceOrderInvoiceDraftBridge.bridgeStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Invoice seed:{' '}
                                {
                                  lastEcommerceOrderInvoiceDraftBridge
                                    .invoiceDraftSeed.customerLabel
                                }{' '}
                                ·{' '}
                                {
                                  lastEcommerceOrderInvoiceDraftBridge
                                    .invoiceDraftSeed.offerTitle
                                }
                              </small>
                              <small>
                                Missing fields:{' '}
                                {lastEcommerceOrderInvoiceDraftBridge.missingFields
                                  .length > 0
                                  ? lastEcommerceOrderInvoiceDraftBridge.missingFields.join(
                                      ' | ',
                                    )
                                  : 'Ninguno'}
                              </small>
                              <small>
                                Handoff artifacts:{' '}
                                {lastEcommerceOrderInvoiceDraftBridge.handoffArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceOrderFiscalDataCompletionWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order fiscal data completion
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceOrderFiscalDataCompletionWorkspace.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceOrderFiscalDataCompletionWorkspace.workspaceStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Targets:{' '}
                                {selectedTenantEcommerceOrderFiscalDataCompletionWorkspace.requiredFields.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Missing fields:{' '}
                                {selectedTenantEcommerceOrderFiscalDataCompletionWorkspace
                                  .missingFields.length > 0
                                  ? selectedTenantEcommerceOrderFiscalDataCompletionWorkspace.missingFields.join(
                                      ' | ',
                                    )
                                  : 'Ninguno'}
                              </small>
                              <small>
                                Hints:{' '}
                                {selectedTenantEcommerceOrderFiscalDataCompletionWorkspace.completionHints
                                  .map((entry) => `${entry.label}: ${entry.hint}`)
                                  .join(' | ')}
                              </small>
                              <small>
                                Target workspace:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderFiscalDataCompletionWorkspace
                                    .targetWorkspace.productKey,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderFiscalDataCompletionWorkspace
                                    .targetWorkspace.stage,
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceOrderPaymentReadinessWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order payment readiness
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceOrderPaymentReadinessWorkspace.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceOrderPaymentReadinessWorkspace.workspaceStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Collection channel:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderPaymentReadinessWorkspace
                                    .paymentPlan.collectionChannel,
                                )}{' '}
                                ·{' '}
                                {
                                  selectedTenantEcommerceOrderPaymentReadinessWorkspace
                                    .paymentPlan.pricingSnapshot
                                }
                              </small>
                              <small>
                                Invoice signal:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderPaymentReadinessWorkspace
                                    .invoiceSignal.acknowledgementStatus,
                                )}{' '}
                                ·{' '}
                                {
                                  selectedTenantEcommerceOrderPaymentReadinessWorkspace
                                    .invoiceSignal.detail
                                }
                              </small>
                              <small>
                                Frictions:{' '}
                                {selectedTenantEcommerceOrderPaymentReadinessWorkspace
                                  .frictionPoints.length > 0
                                  ? selectedTenantEcommerceOrderPaymentReadinessWorkspace.frictionPoints.join(
                                      ' | ',
                                    )
                                  : 'Ninguna'}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceOrderPaymentConfirmationWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order payment confirmation
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceOrderPaymentConfirmationWorkspace.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceOrderPaymentConfirmationWorkspace.confirmationStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Expected collection:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderPaymentConfirmationWorkspace
                                    .expectedCollection.collectionChannel,
                                )}{' '}
                                ·{' '}
                                {
                                  selectedTenantEcommerceOrderPaymentConfirmationWorkspace
                                    .expectedCollection.pricingSnapshot
                                }
                              </small>
                              <small>
                                Lifecycle signal:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderPaymentConfirmationWorkspace
                                    .lifecycleSignal.currentStatus,
                                )}{' '}
                                ·{' '}
                                {
                                  selectedTenantEcommerceOrderPaymentConfirmationWorkspace
                                    .lifecycleSignal.detail
                                }
                              </small>
                              <small>
                                Evidence hints:{' '}
                                {selectedTenantEcommerceOrderPaymentConfirmationWorkspace
                                  .evidenceHints.length > 0
                                  ? selectedTenantEcommerceOrderPaymentConfirmationWorkspace.evidenceHints.join(
                                      ' | ',
                                    )
                                  : 'Ninguna'}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceOrderPaymentConfirmationDecision ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Payment confirmation decision
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceOrderPaymentConfirmationDecision.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceOrderPaymentConfirmationDecision.decision,
                                  )}
                                </span>
                              </div>
                              <small>
                                Owner:{' '}
                                {humanizeKey(
                                  lastEcommerceOrderPaymentConfirmationDecision.owner.productKey,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  lastEcommerceOrderPaymentConfirmationDecision.owner.role,
                                )}
                              </small>
                              <small>
                                Rationale:{' '}
                                {lastEcommerceOrderPaymentConfirmationDecision.rationale}
                              </small>
                              <small>
                                Checklist:{' '}
                                {lastEcommerceOrderPaymentConfirmationDecision.confirmationChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceOrderPaymentConfirmationLog ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Payment confirmation log
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceOrderPaymentConfirmationLog.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceOrderPaymentConfirmationLog.logStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Channel:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderPaymentConfirmationLog
                                    .confirmationRecord.confirmationChannel,
                                )}{' '}
                                ·{' '}
                                {formatDate(
                                  selectedTenantEcommerceOrderPaymentConfirmationLog
                                    .confirmationRecord.confirmedAt,
                                )}
                              </small>
                              <small>
                                Operator note:{' '}
                                {
                                  selectedTenantEcommerceOrderPaymentConfirmationLog
                                    .confirmationRecord.operatorNote
                                }
                              </small>
                              <small>
                                Audit trail:{' '}
                                {selectedTenantEcommerceOrderPaymentConfirmationLog.auditTrail.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceOrderFulfillmentReadinessWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order fulfillment readiness
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceOrderFulfillmentReadinessWorkspace.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceOrderFulfillmentReadinessWorkspace.fulfillmentStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Fulfillment profile:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderFulfillmentReadinessWorkspace
                                    .fulfillmentProfile.fulfillmentType,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderFulfillmentReadinessWorkspace
                                    .fulfillmentProfile.deliveryChannel,
                                )}
                              </small>
                              <small>
                                Prerequisites:{' '}
                                {selectedTenantEcommerceOrderFulfillmentReadinessWorkspace.prerequisites.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Next step:{' '}
                                {
                                  selectedTenantEcommerceOrderFulfillmentReadinessWorkspace.nextStep
                                }
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceOrderFulfillmentDeliveryWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Fulfillment delivery workspace
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceOrderFulfillmentDeliveryWorkspace.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceOrderFulfillmentDeliveryWorkspace.deliveryStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Delivery profile:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderFulfillmentDeliveryWorkspace
                                    .deliveryProfile.fulfillmentType,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderFulfillmentDeliveryWorkspace
                                    .deliveryProfile.deliveryMode,
                                )}
                              </small>
                              <small>
                                Handoff notes:{' '}
                                {selectedTenantEcommerceOrderFulfillmentDeliveryWorkspace.handoffNotes.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Next step:{' '}
                                {
                                  selectedTenantEcommerceOrderFulfillmentDeliveryWorkspace.nextStep
                                }
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceOrderFulfillmentExecutionWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Fulfillment execution workspace
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceOrderFulfillmentExecutionWorkspace.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceOrderFulfillmentExecutionWorkspace.executionStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Signals:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderFulfillmentExecutionWorkspace
                                    .executionSignals.paymentDecision,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderFulfillmentExecutionWorkspace
                                    .executionSignals.postSaleStatus,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderFulfillmentExecutionWorkspace
                                    .executionSignals.readinessStatus,
                                )}
                              </small>
                              <small>
                                Execution checklist:{' '}
                                {selectedTenantEcommerceOrderFulfillmentExecutionWorkspace.executionChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Next step:{' '}
                                {
                                  selectedTenantEcommerceOrderFulfillmentExecutionWorkspace.nextStep
                                }
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceInvoiceDraftIntakeWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Invoice draft intake workspace
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceInvoiceDraftIntakeWorkspace.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceInvoiceDraftIntakeWorkspace.workspaceStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Commercial snapshot:{' '}
                                {
                                  selectedTenantEcommerceInvoiceDraftIntakeWorkspace
                                    .commercialSnapshot.offerTitle
                                }{' '}
                                ·{' '}
                                {
                                  selectedTenantEcommerceInvoiceDraftIntakeWorkspace
                                    .commercialSnapshot.pricingSnapshot
                                }
                              </small>
                              <small>
                                Missing fiscal fields:{' '}
                                {selectedTenantEcommerceInvoiceDraftIntakeWorkspace
                                  .fiscalSnapshot.missingFields.length > 0
                                  ? selectedTenantEcommerceInvoiceDraftIntakeWorkspace.fiscalSnapshot.missingFields.join(
                                      ' | ',
                                    )
                                  : 'Ninguno'}
                              </small>
                              <small>
                                Operator checklist:{' '}
                                {selectedTenantEcommerceInvoiceDraftIntakeWorkspace.operatorChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceOrderHandoffExecutionWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order handoff execution workspace
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceOrderHandoffExecutionWorkspace.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceOrderHandoffExecutionWorkspace.executionStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Ruta activa:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderHandoffExecutionWorkspace.activeRoute,
                                )}{' '}
                                · Next step:{' '}
                                {
                                  selectedTenantEcommerceOrderHandoffExecutionWorkspace.nextStep
                                }
                              </small>
                              <small>
                                Checklist:{' '}
                                {selectedTenantEcommerceOrderHandoffExecutionWorkspace.executionChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Handoff artifacts:{' '}
                                {selectedTenantEcommerceOrderHandoffExecutionWorkspace.handoffArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceInvoiceDraftOpenBridge ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Invoice draft open bridge
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceInvoiceDraftOpenBridge.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceInvoiceDraftOpenBridge.bridgeStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Payload:{' '}
                                {
                                  lastEcommerceInvoiceDraftOpenBridge.payload
                                    .customerLabel
                                }{' '}
                                ·{' '}
                                {
                                  lastEcommerceInvoiceDraftOpenBridge.payload
                                    .offerTitle
                                }
                              </small>
                              <small>
                                Missing fiscal fields:{' '}
                                {lastEcommerceInvoiceDraftOpenBridge
                                  .fiscalSnapshot.missingFields.length > 0
                                  ? lastEcommerceInvoiceDraftOpenBridge.fiscalSnapshot.missingFields.join(
                                      ' | ',
                                    )
                                  : 'Ninguno'}
                              </small>
                              <small>
                                Operator checklist:{' '}
                                {lastEcommerceInvoiceDraftOpenBridge.operatorChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceOrderHoldResolutionWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order hold resolution workspace
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceOrderHoldResolutionWorkspace.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceOrderHoldResolutionWorkspace.resolutionStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Ruta actual:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceOrderHoldResolutionWorkspace.currentRoute,
                                )}{' '}
                                · Next step:{' '}
                                {
                                  selectedTenantEcommerceOrderHoldResolutionWorkspace.nextStep
                                }
                              </small>
                              <small>
                                Hard blockers:{' '}
                                {selectedTenantEcommerceOrderHoldResolutionWorkspace
                                  .blockerSummary.hardBlockers.length > 0
                                  ? selectedTenantEcommerceOrderHoldResolutionWorkspace.blockerSummary.hardBlockers.join(
                                      ' | ',
                                    )
                                  : 'Ninguno'}
                              </small>
                              <small>
                                Exit routes:{' '}
                                {selectedTenantEcommerceOrderHoldResolutionWorkspace.suggestedExitRoutes
                                  .map(
                                    (entry) =>
                                      `${humanizeKey(entry.route)}: ${humanizeKey(entry.readiness)}`,
                                  )
                                  .join(' | ')}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceInvoiceDraftLaunchBridge ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Invoice draft launch bridge
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceInvoiceDraftLaunchBridge.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceInvoiceDraftLaunchBridge.launchStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Launch payload:{' '}
                                {
                                  lastEcommerceInvoiceDraftLaunchBridge
                                    .launchPayload.customerLabel
                                }{' '}
                                ·{' '}
                                {
                                  lastEcommerceInvoiceDraftLaunchBridge
                                    .launchPayload.offerTitle
                                }
                              </small>
                              <small>
                                Route confirmed:{' '}
                                {lastEcommerceInvoiceDraftLaunchBridge
                                  .launchPayload.routeConfirmed
                                  ? 'Sí'
                                  : 'No'}
                              </small>
                              <small>
                                Fiscal artifacts:{' '}
                                {lastEcommerceInvoiceDraftLaunchBridge.fiscalArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceOrderRouteResolutionPacket ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order route resolution
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceOrderRouteResolutionPacket.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceOrderRouteResolutionPacket.recommendedRoute,
                                  )}
                                </span>
                              </div>
                              <small>
                                Current route:{' '}
                                {humanizeKey(
                                  lastEcommerceOrderRouteResolutionPacket.currentRoute,
                                )}{' '}
                                · Hold risk:{' '}
                                {humanizeKey(
                                  lastEcommerceOrderRouteResolutionPacket
                                    .routeSignals.holdRisk,
                                )}
                              </small>
                              <small>
                                Rationale:{' '}
                                {
                                  lastEcommerceOrderRouteResolutionPacket.rationale
                                }
                              </small>
                              <small>
                                Checklist:{' '}
                                {lastEcommerceOrderRouteResolutionPacket.routeChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceInvoiceDraftHandoffWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Invoice draft handoff workspace
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceInvoiceDraftHandoffWorkspace.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceInvoiceDraftHandoffWorkspace.workspaceStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Route snapshot:{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceInvoiceDraftHandoffWorkspace
                                    .routeSnapshot.currentRoute,
                                )}{' '}
                                →{' '}
                                {humanizeKey(
                                  selectedTenantEcommerceInvoiceDraftHandoffWorkspace
                                    .routeSnapshot.recommendedRoute,
                                )}
                              </small>
                              <small>
                                Payload:{' '}
                                {
                                  selectedTenantEcommerceInvoiceDraftHandoffWorkspace
                                    .handoffPayload.customerLabel
                                }{' '}
                                ·{' '}
                                {
                                  selectedTenantEcommerceInvoiceDraftHandoffWorkspace
                                    .handoffPayload.offerTitle
                                }
                              </small>
                              <small>
                                Handoff artifacts:{' '}
                                {selectedTenantEcommerceInvoiceDraftHandoffWorkspace.handoffArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceInvoiceHandoffAcknowledgement ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Invoice handoff acknowledgement
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceInvoiceHandoffAcknowledgement.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceInvoiceHandoffAcknowledgement.acknowledgementStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Target workspace:{' '}
                                {humanizeKey(
                                  lastEcommerceInvoiceHandoffAcknowledgement
                                    .targetWorkspace.productKey,
                                )}{' '}
                                ·{' '}
                                {humanizeKey(
                                  lastEcommerceInvoiceHandoffAcknowledgement
                                    .targetWorkspace.stage,
                                )}
                              </small>
                              <small>
                                Received artifacts:{' '}
                                {lastEcommerceInvoiceHandoffAcknowledgement.receivedArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Missing signals:{' '}
                                {lastEcommerceInvoiceHandoffAcknowledgement
                                  .missingSignals.length > 0
                                  ? lastEcommerceInvoiceHandoffAcknowledgement.missingSignals.join(
                                      ' | ',
                                    )
                                  : 'Ninguna'}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceOrderToGrowthConversationBridge ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order to Growth conversation bridge
                                  </span>
                                  <h4>
                                    {
                                      lastEcommerceOrderToGrowthConversationBridge.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    lastEcommerceOrderToGrowthConversationBridge.bridgeStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Seed:{' '}
                                {
                                  lastEcommerceOrderToGrowthConversationBridge
                                    .conversationSeed.leadLabel
                                }{' '}
                                ·{' '}
                                {
                                  lastEcommerceOrderToGrowthConversationBridge
                                    .conversationSeed.opener
                                }
                              </small>
                              <small>
                                Handoff artifacts:{' '}
                                {lastEcommerceOrderToGrowthConversationBridge.handoffArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {lastEcommerceOrderToGrowthConversationBridge ? (
                            <div className={styles.commercialCard}>
                              <small>
                                Follow-up checklist:{' '}
                                {lastEcommerceOrderToGrowthConversationBridge.followUpChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceOrderGrowthFollowUpWorkspace ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order growth follow-up workspace
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceOrderGrowthFollowUpWorkspace.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceOrderGrowthFollowUpWorkspace.workspaceStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Follow-up plan:{' '}
                                {
                                  selectedTenantEcommerceOrderGrowthFollowUpWorkspace
                                    .followUpPlan.leadLabel
                                }{' '}
                                ·{' '}
                                {
                                  selectedTenantEcommerceOrderGrowthFollowUpWorkspace
                                    .followUpPlan.opener
                                }
                              </small>
                              <small>
                                Next step:{' '}
                                {
                                  selectedTenantEcommerceOrderGrowthFollowUpWorkspace
                                    .followUpPlan.nextStep
                                }
                              </small>
                              <small>
                                Checklist:{' '}
                                {selectedTenantEcommerceOrderGrowthFollowUpWorkspace.operatorChecklist.join(
                                  ' | ',
                                )}
                              </small>
                            </div>
                          ) : null}
                          <div className={styles.inlineActions}>
                            <button
                              className={styles.ghostButton}
                              disabled={
                                tenantEcommerceOrderOperatorWorkboardLoading ||
                                tenantEcommerceProductEntityDetailLoading
                              }
                              onClick={onLoadOrderOperatorWorkboard}
                              type="button"
                            >
                              {tenantEcommerceOrderOperatorWorkboardLoading
                                ? 'Cargando workboard...'
                                : 'Refrescar order workboard'}
                            </button>
                            <button
                              className={styles.ghostButton}
                              disabled={
                                tenantEcommerceOrderOpsPriorityQueueLoading ||
                                tenantEcommerceProductEntityDetailLoading
                              }
                              onClick={onLoadOrderOpsPriorityQueue}
                              type="button"
                            >
                              {tenantEcommerceOrderOpsPriorityQueueLoading
                                ? 'Cargando ops queue...'
                                : 'Refrescar ops queue'}
                            </button>
                            <button
                              className={styles.ghostButton}
                              disabled={
                                tenantEcommerceOrderOpsAttentionWorkspaceLoading ||
                                tenantEcommerceProductEntityDetailLoading
                              }
                              onClick={onLoadOrderOpsAttentionWorkspace}
                              type="button"
                            >
                              {tenantEcommerceOrderOpsAttentionWorkspaceLoading
                                ? 'Cargando attention...'
                                : 'Refrescar attention workspace'}
                            </button>
                            <button
                              className={styles.ghostButton}
                              disabled={
                                tenantEcommerceOrderOpsEscalationBoardLoading ||
                                tenantEcommerceProductEntityDetailLoading
                              }
                              onClick={onLoadOrderOpsEscalationBoard}
                              type="button"
                            >
                              {tenantEcommerceOrderOpsEscalationBoardLoading
                                ? 'Cargando escalations...'
                                : 'Refrescar escalation board'}
                            </button>
                          </div>
                          {tenantEcommerceOrderOperatorWorkboard ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  tenantEcommerceOrderOperatorWorkboard.summary
                                    .headline
                                }
                              </small>
                              <small>
                                {
                                  tenantEcommerceOrderOperatorWorkboard.summary
                                    .detail
                                }
                              </small>
                              {tenantEcommerceOrderOperatorWorkboard.entries
                                .length === 0 ? (
                                <small>
                                  Todavía no hay órdenes priorizadas en el workboard.
                                </small>
                              ) : (
                                <ul className={styles.customerList}>
                                  {tenantEcommerceOrderOperatorWorkboard.entries.map(
                                    (entry) => (
                                      <li
                                        className={styles.customerListItem}
                                        key={entry.orderDraftId}
                                      >
                                        <div className={styles.customerListPrimary}>
                                          <strong>{entry.orderLabel}</strong>
                                          <small>
                                            {humanizeKey(entry.currentStatus)} ·{' '}
                                            {humanizeKey(entry.handoffRoute)} ·{' '}
                                            {humanizeKey(entry.priority)}
                                          </small>
                                          <small>
                                            {entry.attentionReason} ·{' '}
                                            {entry.nextStep}
                                          </small>
                                        </div>
                                        <div className={styles.inlineActions}>
                                          <button
                                            className={styles.ghostButton}
                                            onClick={() =>
                                              onSelectOrderDraft(entry.orderDraftId)
                                            }
                                            type="button"
                                          >
                                            Abrir order draft
                                          </button>
                                        </div>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : null}
                          {tenantEcommerceOrderOpsPriorityQueue ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  tenantEcommerceOrderOpsPriorityQueue.summary
                                    .headline
                                }
                              </small>
                              <small>
                                {
                                  tenantEcommerceOrderOpsPriorityQueue.summary
                                    .detail
                                }
                              </small>
                              {tenantEcommerceOrderOpsPriorityQueue.entries
                                .length === 0 ? (
                                <small>
                                  Todavía no hay órdenes en la priority queue.
                                </small>
                              ) : (
                                <ul className={styles.customerList}>
                                  {tenantEcommerceOrderOpsPriorityQueue.entries.map(
                                    (entry) => (
                                      <li
                                        className={styles.customerListItem}
                                        key={entry.orderDraftId}
                                      >
                                        <div className={styles.customerListPrimary}>
                                          <strong>{entry.orderLabel}</strong>
                                          <small>
                                            {humanizeKey(entry.currentStatus)} ·{' '}
                                            {humanizeKey(entry.activeRoute)} ·{' '}
                                            {humanizeKey(entry.priorityBand)} ·{' '}
                                            score {entry.priorityScore}
                                          </small>
                                          <small>
                                            {entry.attentionReason} ·{' '}
                                            {entry.recommendedAction}
                                          </small>
                                        </div>
                                        <div className={styles.inlineActions}>
                                          <button
                                            className={styles.ghostButton}
                                            onClick={() =>
                                              onSelectOrderDraft(entry.orderDraftId)
                                            }
                                            type="button"
                                          >
                                            Abrir order draft
                                          </button>
                                        </div>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : null}
                          {tenantEcommerceOrderOpsAttentionWorkspace ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  tenantEcommerceOrderOpsAttentionWorkspace.summary
                                    .headline
                                }
                              </small>
                              <small>
                                {
                                  tenantEcommerceOrderOpsAttentionWorkspace.summary
                                    .detail
                                }
                              </small>
                              <small>
                                Focus lanes:{' '}
                                {tenantEcommerceOrderOpsAttentionWorkspace.focusLanes
                                  .map(
                                    (lane) =>
                                      `${humanizeKey(lane.laneKey)} (${lane.count})`,
                                  )
                                  .join(' | ')}
                              </small>
                              {tenantEcommerceOrderOpsAttentionWorkspace.entries
                                .length === 0 ? (
                                <small>
                                  Todavía no hay órdenes en la attention workspace.
                                </small>
                              ) : (
                                <ul className={styles.customerList}>
                                  {tenantEcommerceOrderOpsAttentionWorkspace.entries.map(
                                    (entry) => (
                                      <li
                                        className={styles.customerListItem}
                                        key={entry.orderDraftId}
                                      >
                                        <div className={styles.customerListPrimary}>
                                          <strong>{entry.orderLabel}</strong>
                                          <small>
                                            {humanizeKey(entry.attentionStatus)} ·{' '}
                                            {humanizeKey(entry.activeRoute)}
                                          </small>
                                          <small>
                                            {entry.attentionReason} ·{' '}
                                            {entry.nextAction}
                                          </small>
                                        </div>
                                        <div className={styles.inlineActions}>
                                          <button
                                            className={styles.ghostButton}
                                            onClick={() =>
                                              onSelectOrderDraft(entry.orderDraftId)
                                            }
                                            type="button"
                                          >
                                            Abrir order draft
                                          </button>
                                        </div>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : null}
                          {tenantEcommerceOrderOpsEscalationBoard ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  tenantEcommerceOrderOpsEscalationBoard.summary
                                    .headline
                                }
                              </small>
                              <small>
                                {
                                  tenantEcommerceOrderOpsEscalationBoard.summary
                                    .detail
                                }
                              </small>
                              <small>
                                Escalation lanes:{' '}
                                {tenantEcommerceOrderOpsEscalationBoard.escalationLanes
                                  .map(
                                    (lane) =>
                                      `${humanizeKey(lane.laneKey)} (${lane.count})`,
                                  )
                                  .join(' | ')}
                              </small>
                              {tenantEcommerceOrderOpsEscalationBoard.entries
                                .length === 0 ? (
                                <small>
                                  Todavía no hay órdenes en la escalation board.
                                </small>
                              ) : (
                                <ul className={styles.customerList}>
                                  {tenantEcommerceOrderOpsEscalationBoard.entries.map(
                                    (entry) => (
                                      <li
                                        className={styles.customerListItem}
                                        key={entry.orderDraftId}
                                      >
                                        <div className={styles.customerListPrimary}>
                                          <strong>{entry.orderLabel}</strong>
                                          <small>
                                            {humanizeKey(entry.escalationLevel)} ·{' '}
                                            {humanizeKey(entry.activeRoute)}
                                          </small>
                                          <small>
                                            {entry.escalationReason} ·{' '}
                                            {entry.nextAction}
                                          </small>
                                        </div>
                                        <div className={styles.inlineActions}>
                                          <button
                                            className={styles.ghostButton}
                                            onClick={() =>
                                              onSelectOrderDraft(entry.orderDraftId)
                                            }
                                            type="button"
                                          >
                                            Abrir order draft
                                          </button>
                                        </div>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : null}
                          {tenantEcommerceOrderStatusLifecycleRegistry ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  tenantEcommerceOrderStatusLifecycleRegistry
                                    .summary.headline
                                }
                              </small>
                              <small>
                                {
                                  tenantEcommerceOrderStatusLifecycleRegistry
                                    .summary.detail
                                }
                              </small>
                              {tenantEcommerceOrderStatusLifecycleRegistry.orders
                                .length === 0 ? (
                                <small>
                                  Todavía no hay lifecycle entries para order drafts.
                                </small>
                              ) : (
                                <ul className={styles.customerList}>
                                  {tenantEcommerceOrderStatusLifecycleRegistry.orders.map(
                                    (orderLifecycle) => (
                                      <li
                                        className={styles.customerListItem}
                                        key={orderLifecycle.orderDraftId}
                                      >
                                        <div className={styles.customerListPrimary}>
                                          <strong>
                                            {orderLifecycle.orderLabel}
                                          </strong>
                                          <small>
                                            {humanizeKey(
                                              orderLifecycle.currentStatus,
                                            )}{' '}
                                            · {orderLifecycle.nextStep}
                                          </small>
                                        </div>
                                        <div className={styles.inlineActions}>
                                          <button
                                            className={styles.ghostButton}
                                            onClick={() =>
                                              onSelectOrderStatusLifecycle(
                                                orderLifecycle.orderDraftId,
                                              )
                                            }
                                            type="button"
                                          >
                                            Abrir lifecycle
                                          </button>
                                        </div>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : null}
                          <div className={styles.inlineActions}>
                            <button
                              className={styles.secondaryButton}
                              disabled={
                                tenantEcommerceOrderPostSaleLifecycleRegistryLoading
                              }
                              onClick={onLoadOrderPostSaleLifecycleRegistry}
                              type="button"
                            >
                              {tenantEcommerceOrderPostSaleLifecycleRegistryLoading
                                ? 'Cargando post-sale board...'
                                : 'Cargar post-sale board'}
                            </button>
                            <button
                              className={styles.secondaryButton}
                              disabled={tenantEcommerceOrderPostSaleOpsBoardLoading}
                              onClick={onLoadOrderPostSaleOpsBoard}
                              type="button"
                            >
                              {tenantEcommerceOrderPostSaleOpsBoardLoading
                                ? 'Cargando post-sale ops...'
                                : 'Cargar post-sale ops board'}
                            </button>
                            <button
                              className={styles.secondaryButton}
                              disabled={
                                tenantEcommerceOrderRevenueTrackingSummaryLoading
                              }
                              onClick={onLoadOrderRevenueTrackingSummary}
                              type="button"
                            >
                              {tenantEcommerceOrderRevenueTrackingSummaryLoading
                                ? 'Cargando revenue tracking...'
                                : 'Cargar revenue tracking'}
                            </button>
                            <button
                              className={styles.secondaryButton}
                              disabled={tenantEcommerceOrderRevenueOpsBoardLoading}
                              onClick={onLoadOrderRevenueOpsBoard}
                              type="button"
                            >
                              {tenantEcommerceOrderRevenueOpsBoardLoading
                                ? 'Cargando revenue ops...'
                                : 'Cargar revenue ops board'}
                            </button>
                          </div>
                          {tenantEcommerceOrderPostSaleLifecycleRegistry ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  tenantEcommerceOrderPostSaleLifecycleRegistry
                                    .summary.headline
                                }
                              </small>
                              <small>
                                {
                                  tenantEcommerceOrderPostSaleLifecycleRegistry
                                    .summary.detail
                                }
                              </small>
                              {tenantEcommerceOrderPostSaleLifecycleRegistry.orders
                                .length === 0 ? (
                                <small>
                                  Todavía no hay órdenes en el post-sale lifecycle.
                                </small>
                              ) : (
                                <ul className={styles.customerList}>
                                  {tenantEcommerceOrderPostSaleLifecycleRegistry.orders.map(
                                    (orderLifecycle) => (
                                      <li
                                        className={styles.customerListItem}
                                        key={orderLifecycle.orderDraftId}
                                      >
                                        <div className={styles.customerListPrimary}>
                                          <strong>
                                            {orderLifecycle.orderLabel}
                                          </strong>
                                          <small>
                                            {humanizeKey(
                                              orderLifecycle.currentStatus,
                                            )}{' '}
                                            · {orderLifecycle.nextStep}
                                          </small>
                                        </div>
                                        <div className={styles.inlineActions}>
                                          <button
                                            className={styles.ghostButton}
                                            onClick={() =>
                                              onSelectOrderPostSaleLifecycle(
                                                orderLifecycle.orderDraftId,
                                              )
                                            }
                                            type="button"
                                          >
                                            Abrir post-sale
                                          </button>
                                        </div>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : null}
                          {selectedTenantEcommerceOrderStatusLifecycleDetail ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order status lifecycle
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceOrderStatusLifecycleDetail.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceOrderStatusLifecycleDetail.currentStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Timeline:{' '}
                                {selectedTenantEcommerceOrderStatusLifecycleDetail.timeline
                                  .map(
                                    (entry) =>
                                      `${humanizeKey(entry.key)}:${humanizeKey(entry.status)}`,
                                  )
                                  .join(' | ')}
                              </small>
                              <small>
                                Last action:{' '}
                                {
                                  selectedTenantEcommerceOrderStatusLifecycleDetail.lastAction
                                }
                              </small>
                              <small>
                                Next step:{' '}
                                {
                                  selectedTenantEcommerceOrderStatusLifecycleDetail.nextStep
                                }
                              </small>
                            </div>
                          ) : null}
                          {selectedTenantEcommerceOrderPostSaleLifecycleDetail ? (
                            <div className={styles.commercialCard}>
                              <div className={styles.sectionHeading}>
                                <div>
                                  <span className={styles.label}>
                                    Order post-sale lifecycle
                                  </span>
                                  <h4>
                                    {
                                      selectedTenantEcommerceOrderPostSaleLifecycleDetail.summary
                                    }
                                  </h4>
                                </div>
                                <span className={styles.badge}>
                                  {humanizeKey(
                                    selectedTenantEcommerceOrderPostSaleLifecycleDetail.currentStatus,
                                  )}
                                </span>
                              </div>
                              <small>
                                Timeline:{' '}
                                {selectedTenantEcommerceOrderPostSaleLifecycleDetail.timeline
                                  .map(
                                    (entry) =>
                                      `${humanizeKey(entry.key)}:${humanizeKey(entry.status)}`,
                                  )
                                  .join(' | ')}
                              </small>
                              <small>
                                Last action:{' '}
                                {
                                  selectedTenantEcommerceOrderPostSaleLifecycleDetail.lastAction
                                }
                              </small>
                              <small>
                                Next step:{' '}
                                {
                                  selectedTenantEcommerceOrderPostSaleLifecycleDetail.nextStep
                                }
                              </small>
                            </div>
                          ) : null}
                          {tenantEcommerceOrderPostSaleOpsBoard ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  tenantEcommerceOrderPostSaleOpsBoard.summary
                                    .headline
                                }
                              </small>
                              <small>
                                {
                                  tenantEcommerceOrderPostSaleOpsBoard.summary
                                    .detail
                                }
                              </small>
                              <small>
                                Focus lanes:{' '}
                                {tenantEcommerceOrderPostSaleOpsBoard.focusLanes
                                  .map(
                                    (lane) =>
                                      `${humanizeKey(lane.laneKey)} (${lane.count})`,
                                  )
                                  .join(' | ')}
                              </small>
                              {tenantEcommerceOrderPostSaleOpsBoard.entries
                                .length === 0 ? (
                                <small>
                                  Todavía no hay órdenes en el post-sale ops board.
                                </small>
                              ) : (
                                <ul className={styles.customerList}>
                                  {tenantEcommerceOrderPostSaleOpsBoard.entries.map(
                                    (entry) => (
                                      <li
                                        className={styles.customerListItem}
                                        key={entry.orderDraftId}
                                      >
                                        <div className={styles.customerListPrimary}>
                                          <strong>{entry.orderLabel}</strong>
                                          <small>
                                            {humanizeKey(entry.opsStatus)} ·{' '}
                                            {humanizeKey(entry.priorityBand)}
                                          </small>
                                          <small>
                                            {entry.attentionReason} ·{' '}
                                            {entry.nextAction}
                                          </small>
                                        </div>
                                        <div className={styles.inlineActions}>
                                          <button
                                            className={styles.ghostButton}
                                            onClick={() =>
                                              onSelectOrderDraft(entry.orderDraftId)
                                            }
                                            type="button"
                                          >
                                            Abrir order draft
                                          </button>
                                        </div>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : null}
                          {tenantEcommerceOrderRevenueTrackingSummary ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  tenantEcommerceOrderRevenueTrackingSummary
                                    .summary.headline
                                }
                              </small>
                              <small>
                                {
                                  tenantEcommerceOrderRevenueTrackingSummary
                                    .summary.detail
                                }
                              </small>
                              <small>
                                Rollup:{' '}
                                {tenantEcommerceOrderRevenueTrackingSummary
                                  .paymentRollup.confirmationBacklog}
                              </small>
                              <small>
                                Pricing snapshots:{' '}
                                {tenantEcommerceOrderRevenueTrackingSummary
                                  .valueSignals.expectedPricingSnapshots.length > 0
                                  ? tenantEcommerceOrderRevenueTrackingSummary.valueSignals.expectedPricingSnapshots.join(
                                      ' | ',
                                    )
                                  : 'Sin señales todavía'}
                              </small>
                              {tenantEcommerceOrderRevenueTrackingSummary.entries
                                .length === 0 ? (
                                <small>
                                  Todavía no hay órdenes para revenue tracking.
                                </small>
                              ) : (
                                <ul className={styles.customerList}>
                                  {tenantEcommerceOrderRevenueTrackingSummary.entries.map(
                                    (entry) => (
                                      <li
                                        className={styles.customerListItem}
                                        key={entry.orderDraftId}
                                      >
                                        <div className={styles.customerListPrimary}>
                                          <strong>{entry.orderLabel}</strong>
                                          <small>
                                            {humanizeKey(entry.currentStatus)} ·{' '}
                                            {humanizeKey(
                                              entry.paymentConfirmationStatus,
                                            )}{' '}
                                            ·{' '}
                                            {humanizeKey(entry.fulfillmentStatus)}
                                          </small>
                                          <small>
                                            {entry.pricingSnapshot} ·{' '}
                                            {entry.nextStep}
                                          </small>
                                        </div>
                                        <div className={styles.inlineActions}>
                                          <button
                                            className={styles.ghostButton}
                                            onClick={() =>
                                              onSelectOrderDraft(entry.orderDraftId)
                                            }
                                            type="button"
                                          >
                                            Abrir order draft
                                          </button>
                                        </div>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : null}
                          {tenantEcommerceOrderRevenueOpsBoard ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  tenantEcommerceOrderRevenueOpsBoard.summary
                                    .headline
                                }
                              </small>
                              <small>
                                {
                                  tenantEcommerceOrderRevenueOpsBoard.summary
                                    .detail
                                }
                              </small>
                              <small>
                                Lanes:{' '}
                                {tenantEcommerceOrderRevenueOpsBoard.priorityLanes
                                  .map(
                                    (lane) =>
                                      `${humanizeKey(lane.laneKey)} (${lane.count})`,
                                  )
                                  .join(' | ')}
                              </small>
                              {tenantEcommerceOrderRevenueOpsBoard.entries
                                .length === 0 ? (
                                <small>
                                  Todavía no hay órdenes para revenue ops.
                                </small>
                              ) : (
                                <ul className={styles.customerList}>
                                  {tenantEcommerceOrderRevenueOpsBoard.entries.map(
                                    (entry) => (
                                      <li
                                        className={styles.customerListItem}
                                        key={entry.orderDraftId}
                                      >
                                        <div className={styles.customerListPrimary}>
                                          <strong>{entry.orderLabel}</strong>
                                          <small>
                                            {humanizeKey(entry.priorityBand)} ·{' '}
                                            {humanizeKey(entry.revenueStatus)}
                                          </small>
                                          <small>
                                            {entry.revenueImpact} ·{' '}
                                            {entry.nextAction}
                                          </small>
                                        </div>
                                        <div className={styles.inlineActions}>
                                          <button
                                            className={styles.ghostButton}
                                            onClick={() =>
                                              onSelectOrderDraft(entry.orderDraftId)
                                            }
                                            type="button"
                                          >
                                            Abrir order draft
                                          </button>
                                        </div>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : null}
                          {tenantEcommerceProductEntityChannelReleaseCandidateRegistry ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  tenantEcommerceProductEntityChannelReleaseCandidateRegistry.summary.headline
                                }
                              </small>
                              <small>
                                {
                                  tenantEcommerceProductEntityChannelReleaseCandidateRegistry.summary.detail
                                }
                              </small>
                              {tenantEcommerceProductEntityChannelReleaseCandidateRegistry
                                .releaseCandidates.length === 0 ? (
                                <small>
                                  Todavía no hay release candidates promovidos.
                                </small>
                              ) : (
                                <ul className={styles.customerList}>
                                  {tenantEcommerceProductEntityChannelReleaseCandidateRegistry.releaseCandidates.map(
                                    (releaseCandidate) => (
                                      <li
                                        className={styles.customerListItem}
                                        key={releaseCandidate.channelKey}
                                      >
                                        <div className={styles.customerListPrimary}>
                                          <strong>
                                            {humanizeKey(
                                              releaseCandidate.channelKey,
                                            )}
                                          </strong>
                                          <small>
                                            {humanizeKey(
                                              releaseCandidate.status,
                                            )}{' '}
                                            · {releaseCandidate.title}
                                          </small>
                                        </div>
                                        <div className={styles.inlineActions}>
                                          <button
                                            className={styles.ghostButton}
                                            onClick={() =>
                                              onSelectProductEntityChannelReleaseCandidate(
                                                releaseCandidate.channelKey,
                                              )
                                            }
                                            type="button"
                                          >
                                            Ver release candidate
                                          </button>
                                        </div>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </div>
                          ) : null}
                          {selectedTenantEcommerceProductEntityChannelReleaseCandidateDetail ? (
                            <div className={styles.stack}>
                              <small>
                                {
                                  selectedTenantEcommerceProductEntityChannelReleaseCandidateDetail.releaseCandidate.summary
                                }
                              </small>
                              <small>
                                Checklist:{' '}
                                {selectedTenantEcommerceProductEntityChannelReleaseCandidateDetail.releaseCandidate.publishChecklist.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Artifacts:{' '}
                                {selectedTenantEcommerceProductEntityChannelReleaseCandidateDetail.releaseCandidate.recommendedArtifacts.join(
                                  ' | ',
                                )}
                              </small>
                              <small>
                                Next milestone:{' '}
                                {
                                  selectedTenantEcommerceProductEntityChannelReleaseCandidateDetail.releaseCandidate.nextMilestone
                                }
                              </small>
                            </div>
                          ) : tenantEcommerceProductEntityChannelReleaseCandidateDetailLoading ? (
                            <small className={styles.muted}>
                              Cargando el release candidate...
                            </small>
                          ) : null}
                        </div>
                      ) : tenantEcommerceProductEntityChannelDraftDetailLoading ? (
                        <small className={styles.muted}>
                          Cargando channel draft detail...
                        </small>
                      ) : null}
                      {lastEcommerceProductEntityCommercializationPacket ? (
                        <div className={styles.stack}>
                          <small>
                            {
                              lastEcommerceProductEntityCommercializationPacket.summary
                            }
                          </small>
                          <small>
                            Decisions:{' '}
                            {lastEcommerceProductEntityCommercializationPacket.requiredDecisions.join(
                              ' | ',
                            )}
                          </small>
                          <small>
                            Artifacts:{' '}
                            {lastEcommerceProductEntityCommercializationPacket.recommendedArtifacts.join(
                              ' | ',
                            )}
                          </small>
                          {lastEcommerceProductEntityCommercializationPacket.blockedBy
                            .length > 0 ? (
                            <small>
                              Blocked by:{' '}
                              {lastEcommerceProductEntityCommercializationPacket.blockedBy.join(
                                ' | ',
                              )}
                            </small>
                          ) : null}
                        </div>
                      ) : null}
                      {selectedTenantEcommerceProductEntityDetail.blockedBy.length >
                      0 ? (
                        <small>
                          Blocked by:{' '}
                          {selectedTenantEcommerceProductEntityDetail.blockedBy.join(
                            ' | ',
                          )}
                        </small>
                      ) : null}
                    </div>
                  ) : tenantEcommerceProductEntityDetailLoading ? (
                    <p className={styles.muted}>
                      Cargando el detalle de la product entity...
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className={styles.muted}>
                  Cargando el starter set draft de productos...
                </p>
              )}
            </div>

            <div className={styles.detailCard}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.label}>Store profile workspace</span>
                  <h3>Identidad draft de la tienda</h3>
                </div>
                <span
                  className={`${styles.statusPill} ${operationalStatusTone(
                    tenantEcommerceStoreProfileWorkspace?.summary.tone ??
                      'healthy',
                  )}`}
                >
                  {tenantEcommerceStoreProfileWorkspace
                    ? operationalStatusLabel(
                        tenantEcommerceStoreProfileWorkspace.summary.tone,
                      )
                    : 'sin perfil'}
                </span>
              </div>

              {tenantEcommerceStoreProfileWorkspace ? (
                <div className={styles.stack}>
                  <p>{tenantEcommerceStoreProfileWorkspace.summary.headline}</p>
                  <small>
                    {tenantEcommerceStoreProfileWorkspace.summary.detail}
                  </small>
                  <small>
                    Focus sugerido:{' '}
                    {tenantEcommerceStoreProfileWorkspace.summary.suggestedFocus}
                  </small>

                  <div className={styles.invoiceKpiGrid}>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Store name</span>
                      <strong>
                        {
                          tenantEcommerceStoreProfileWorkspace.identityDraft
                            .storeName
                        }
                      </strong>
                      <small>Nombre comercial draft de la tienda.</small>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Storefront slug</span>
                      <strong>
                        {
                          tenantEcommerceStoreProfileWorkspace.identityDraft
                            .storefrontSlug
                        }
                      </strong>
                      <small>Slug operativo inicial, no publish final.</small>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Primary channel</span>
                      <strong>
                        {humanizeKey(
                          tenantEcommerceStoreProfileWorkspace.identityDraft
                            .primaryChannel,
                        )}
                      </strong>
                      <small>Canal sugerido para el primer release.</small>
                    </div>
                  </div>

                  <p className={styles.muted}>
                    {
                      tenantEcommerceStoreProfileWorkspace.identityDraft
                        .launchNarrative
                    }
                  </p>

                  <ul className={styles.featureList}>
                    {tenantEcommerceStoreProfileWorkspace.connections.map(
                      (entry) => (
                        <li key={entry.key}>
                          <strong>
                            {entry.title}{' '}
                            <span className={styles.muted}>
                              ({humanizeKey(entry.status)})
                            </span>
                          </strong>
                          <div>{entry.detail}</div>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ) : (
                <p className={styles.muted}>
                  Cargando el profile draft de Ecommerce...
                </p>
              )}
            </div>

            <div className={styles.detailCard}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.label}>Store setup workspace</span>
                  <h3>Base operativa para abrir la tienda</h3>
                </div>
                <span
                  className={`${styles.statusPill} ${operationalStatusTone(
                    tenantEcommerceStoreSetupWorkspace?.summary.tone ?? 'healthy',
                  )}`}
                >
                  {tenantEcommerceStoreSetupWorkspace
                    ? operationalStatusLabel(
                        tenantEcommerceStoreSetupWorkspace.summary.tone,
                      )
                    : 'sin setup'}
                </span>
              </div>

              {tenantEcommerceStoreSetupWorkspace ? (
                <div className={styles.stack}>
                  <p>{tenantEcommerceStoreSetupWorkspace.summary.headline}</p>
                  <small>{tenantEcommerceStoreSetupWorkspace.summary.detail}</small>
                  <small>
                    Focus sugerido:{' '}
                    {tenantEcommerceStoreSetupWorkspace.summary.suggestedFocus}
                  </small>

                  <div className={styles.invoiceKpiGrid}>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Setup readiness</span>
                      <strong>
                        {humanizeKey(
                          tenantEcommerceStoreSetupWorkspace.summary
                            .setupReadiness,
                        )}
                      </strong>
                      <small>Estado de base para abrir la tienda.</small>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Productos activos</span>
                      <strong>
                        {tenantEcommerceStoreSetupWorkspace.productSnapshot.enabledProductKeys.join(
                          ', ',
                        ) || 'sin productos'}
                      </strong>
                      <small>Stack comercial visible para el tenant.</small>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Facturación</span>
                      <strong>
                        {tenantEcommerceStoreSetupWorkspace.productSnapshot
                          .invoicingEnabled
                          ? 'Conectada'
                          : 'Pendiente'}
                      </strong>
                      <small>Si Invoicing ya acompaña la tienda.</small>
                    </div>
                  </div>

                  <ul className={styles.featureList}>
                    {tenantEcommerceStoreSetupWorkspace.capabilities.map(
                      (capability) => (
                        <li key={capability.key}>
                          <strong>
                            {capability.title}{' '}
                            <span className={styles.muted}>
                              ({humanizeKey(capability.status)})
                            </span>
                          </strong>
                          <div>{capability.detail}</div>
                          <small>{capability.nextStep}</small>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ) : (
                <p className={styles.muted}>
                  Cargando el workspace de setup operativo de Ecommerce...
                </p>
              )}
            </div>

            <div className={styles.detailCard}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.label}>Launch workspace</span>
                  <h3>Base real para catálogo, landing y campaña</h3>
                </div>
                <span
                  className={`${styles.statusPill} ${operationalStatusTone(
                    tenantAiEcommerceLaunchWorkspace?.summary.tone ?? 'healthy',
                  )}`}
                >
                  {tenantAiEcommerceLaunchWorkspace
                    ? operationalStatusLabel(
                        tenantAiEcommerceLaunchWorkspace.summary.tone,
                      )
                    : 'sin workspace'}
                </span>
              </div>

              {tenantAiEcommerceLaunchWorkspace ? (
                <div className={styles.stack}>
                  <p>{tenantAiEcommerceLaunchWorkspace.summary.headline}</p>
                  <small>{tenantAiEcommerceLaunchWorkspace.summary.detail}</small>
                  <small>
                    Focus sugerido:{' '}
                    {tenantAiEcommerceLaunchWorkspace.summary.suggestedFocus}
                  </small>

                  <div className={styles.invoiceKpiGrid}>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Readiness</span>
                      <strong>
                        {humanizeKey(
                          tenantAiEcommerceLaunchWorkspace.summary.launchReadiness,
                        )}
                      </strong>
                      <small>Estado base del launch actual.</small>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Producto</span>
                      <strong>
                        {tenantAiEcommerceLaunchWorkspace.moduleSnapshot.productEnabled
                          ? 'Activo'
                          : 'Inactivo'}
                      </strong>
                      <small>Si ecommerce ya está habilitado para el tenant.</small>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Módulos activos</span>
                      <strong>
                        {
                          tenantAiEcommerceLaunchWorkspace.moduleSnapshot
                            .activeModuleCount
                        }
                      </strong>
                      <small>Base disponible para el primer brief.</small>
                    </div>
                    <div className={styles.commercialCard}>
                      <span className={styles.muted}>Inactivos</span>
                      <strong>
                        {
                          tenantAiEcommerceLaunchWorkspace.moduleSnapshot
                            .inactiveModuleKeys.length
                        }
                      </strong>
                      <small>Piezas que conviene dejar fuera del scope inicial.</small>
                    </div>
                  </div>

                  <div className={styles.stack}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Checklist</span>
                        <h3>Módulos y postura del launch</h3>
                      </div>
                    </div>
                    {tenantAiEcommerceLaunchWorkspace.checklist.map((entry) => (
                      <div
                        className={styles.invoiceItemCard}
                        key={`ecommerce-launch-check:${entry.key}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{entry.label}</strong>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              entry.status === 'blocked'
                                ? 'critical'
                                : entry.status === 'warning'
                                  ? 'warning'
                                  : 'healthy',
                            )}`}
                          >
                            {entry.status}
                          </span>
                        </div>
                        <small>
                          {entry.isCore ? 'Core' : 'Optional'} · {entry.detail}
                        </small>
                      </div>
                    ))}
                  </div>

                  <div className={styles.stack}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Launch lanes</span>
                        <h3>Cómo bajar el brief sin inventar estructura</h3>
                      </div>
                    </div>
                    {tenantAiEcommerceLaunchWorkspace.channelGuidance.map((entry) => (
                      <div
                        className={styles.assistCueCard}
                        key={`ecommerce-launch-lane:${entry.key}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{entry.title}</strong>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              entry.status === 'blocked'
                                ? 'critical'
                                : entry.status === 'warning'
                                  ? 'warning'
                                  : 'healthy',
                            )}`}
                          >
                            {entry.status}
                          </span>
                        </div>
                        <small>{entry.detail}</small>
                        <small>Uso recomendado: {entry.recommendedUse}</small>
                      </div>
                    ))}
                  </div>

                  <div className={styles.stack}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Launch plans</span>
                        <h3>Targets concretos para approval y shadow review</h3>
                      </div>
                    </div>
                    {tenantEcommerceLaunchPlanRegistry ? (
                      <div className={styles.invoiceKpiGrid}>
                        <div className={styles.commercialCard}>
                          <span className={styles.muted}>Total</span>
                          <strong>{tenantEcommerceLaunchPlanRegistry.counts.totalPlans}</strong>
                          <small>Launch plans visibles para este tenant.</small>
                        </div>
                        <div className={styles.commercialCard}>
                          <span className={styles.muted}>Shadow review ready</span>
                          <strong>
                            {
                              tenantEcommerceLaunchPlanRegistry.counts
                                .shadowReviewReadyPlans
                            }
                          </strong>
                          <small>Planes que ya pueden entrar al piloto auditado.</small>
                        </div>
                        <div className={styles.commercialCard}>
                          <span className={styles.muted}>Blocked</span>
                          <strong>
                            {tenantEcommerceLaunchPlanRegistry.counts.blockedPlans}
                          </strong>
                          <small>Planes que siguen frenados por activación o core.</small>
                        </div>
                      </div>
                    ) : null}
                    {(tenantEcommerceLaunchPlanRegistry?.plans ??
                      tenantAiEcommerceLaunchWorkspace.launchPlans
                    ).map((entry) => (
                      <button
                        className={styles.assistCueCard}
                        key={`ecommerce-launch-plan:${entry.id}`}
                        onClick={() => onSelectLaunchPlan(entry.id)}
                        type="button"
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{entry.title}</strong>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              entry.status === 'blocked'
                                ? 'critical'
                                : entry.status === 'warning'
                                  ? 'warning'
                                  : 'healthy',
                            )}`}
                          >
                            {humanizeKey(entry.status)}
                          </span>
                        </div>
                        <small>{entry.scopeSummary}</small>
                        <small>
                          Guarded execution {humanizeKey(entry.guardedExecutionReadiness)}{' '}
                          · channels {entry.selectedChannels.join(', ')}
                        </small>
                        <small>{entry.nextStep}</small>
                        <small className={styles.muted}>
                          {selectedTenantEcommerceLaunchPlanDetail?.plan.id === entry.id
                            ? 'Detalle cargado abajo'
                            : 'Haz clic para abrir detalle'}
                        </small>
                      </button>
                    ))}

                    {tenantEcommerceLaunchPlanDetailLoading ? (
                      <small className={styles.muted}>
                        Cargando detalle del launch plan...
                      </small>
                    ) : selectedTenantEcommerceLaunchPlanDetail ? (
                      <div className={styles.detailCard}>
                        <div className={styles.sectionHeading}>
                          <div>
                            <span className={styles.label}>Launch plan detail</span>
                            <h3>{selectedTenantEcommerceLaunchPlanDetail.plan.title}</h3>
                          </div>
                          <span
                            className={`${styles.statusPill} ${operationalStatusTone(
                              selectedTenantEcommerceLaunchPlanDetail.plan.status ===
                                'blocked'
                                ? 'critical'
                                : selectedTenantEcommerceLaunchPlanDetail.plan
                                      .status === 'warning'
                                  ? 'warning'
                                  : 'healthy',
                            )}`}
                          >
                            {humanizeKey(
                              selectedTenantEcommerceLaunchPlanDetail.plan.status,
                            )}
                          </span>
                        </div>
                        <small>
                          {selectedTenantEcommerceLaunchPlanDetail.plan.scopeSummary}
                        </small>
                        <small>
                          Workspace: {
                            selectedTenantEcommerceLaunchPlanDetail.workspaceSummary
                              .headline
                          }
                        </small>
                        <div className={styles.badgeRow}>
                          {selectedTenantEcommerceLaunchPlanDetail.plan.selectedChannels.map(
                            (entry) => (
                              <span
                                className={styles.badge}
                                key={`ecommerce-launch-plan-channel:${entry}`}
                              >
                                {humanizeKey(entry)}
                              </span>
                            ),
                          )}
                        </div>
                        <button
                          className={styles.secondaryButton}
                          disabled={ecommerceLaunchPlanActionLoading}
                          onClick={onRequestActivationReadiness}
                          type="button"
                        >
                          {ecommerceLaunchPlanActionLoading
                            ? 'Solicitando readiness...'
                            : 'Solicitar activation readiness'}
                        </button>
                        <div className={styles.stack}>
                          <small>
                            Próximo paso:{' '}
                            {selectedTenantEcommerceLaunchPlanDetail.plan.nextStep}
                          </small>
                          <small>
                            Safe actions:{' '}
                            {selectedTenantEcommerceLaunchPlanDetail.safeActions.join(
                              ' · ',
                            )}
                          </small>
                          <small>
                            Bloqueado:{' '}
                            {selectedTenantEcommerceLaunchPlanDetail.blockedActions.join(
                              ' · ',
                            )}
                          </small>
                        </div>
                        {lastEcommerceLaunchActivationReadiness ? (
                          <div className={styles.assistCueCard}>
                            <div className={styles.invoiceCardHeader}>
                              <strong>Activation readiness</strong>
                              <span className={styles.badge}>
                                {humanizeKey(
                                  lastEcommerceLaunchActivationReadiness.activationStatus,
                                )}
                              </span>
                            </div>
                            <small>
                              {lastEcommerceLaunchActivationReadiness.summary}
                            </small>
                            <small>
                              Required actions:{' '}
                              {lastEcommerceLaunchActivationReadiness.requiredActions.join(
                                ' · ',
                              ) || 'ninguna'}
                            </small>
                            <small>
                              Guardrails:{' '}
                              {lastEcommerceLaunchActivationReadiness.guardrails.join(
                                ' · ',
                              )}
                            </small>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : tenantAiEcommerceLaunchWorkspaceLoading ? (
                <small className={styles.muted}>
                  Cargando workspace AI de ecommerce launch...
                </small>
              ) : (
                <div className={styles.emptyState}>
                  <p>
                    Todavía no hay suficiente contexto para hidratar el launch
                    workspace de ecommerce.
                  </p>
                </div>
              )}
            </div>

            <div className={styles.detailCard}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.label}>AI Capability Platform</span>
                  <h3>Ecommerce Launch Assistant</h3>
                </div>
                {activeEcommerceAiAgent ? (
                  <span
                    className={`${styles.statusPill} ${aiAgentAvailabilityTone(
                      activeEcommerceAiAgent.availability,
                    )}`}
                  >
                    {aiAgentAvailabilityLabel(activeEcommerceAiAgent.availability)}
                  </span>
                ) : null}
              </div>

              {ecommerceLaunchAssistantAiEnvelope ? (
                <div className={styles.stack}>
                  <p className={styles.muted}>
                    <strong>{ecommerceLaunchAssistantAiEnvelope.agent.title}</strong>{' '}
                    ya puede convertir esta superficie determinística en un brief
                    reusable para catálogo, landing y campaña, pero sigue en modo
                    sugerencia y no publica nada por sí solo.
                  </p>
                  <div className={styles.badgeRow}>
                    {activeEcommerceAiPrimarySurface ? (
                      <span className={styles.badge}>
                        Surface {activeEcommerceAiPrimarySurface.key}
                      </span>
                    ) : null}
                    <span className={styles.badge}>
                      Prompt pack{' '}
                      {activeEcommerceAiPromptPack?.key ??
                        ecommerceLaunchAssistantAiEnvelope.promptPack.key}
                    </span>
                    <span className={styles.badge}>
                      Mode {ecommerceLaunchAssistantAiEnvelope.mode}
                    </span>
                  </div>
                  {activeEcommerceAiPromptPack ? (
                    <div className={styles.assistReplyBox}>
                      <span className={styles.muted}>Objetivo del agente</span>
                      <strong>{activeEcommerceAiPromptPack.objective}</strong>
                    </div>
                  ) : null}

                  <div className={styles.assistChecklist}>
                    {ecommerceLaunchAssistantAiEnvelope.promptPack.suggestedOutputs.map(
                      (entry) => (
                        <span
                          className={styles.badge}
                          key={`ecommerce-output:${entry.key}`}
                        >
                          {entry.label}
                        </span>
                      ),
                    )}
                  </div>

                  <div className={styles.actionRow}>
                    <button
                      className={styles.primaryButton}
                      disabled={
                        !canReadTenantEntitlements ||
                        actionLoading === 'prepare-ecommerce-ai-suggestion-run'
                      }
                      onClick={onPrepare}
                      type="button"
                    >
                      {actionLoading === 'prepare-ecommerce-ai-suggestion-run'
                        ? 'Preparando...'
                        : 'Preparar handoff AI'}
                    </button>
                  </div>

                  <div className={styles.stack}>
                    <div className={styles.sectionHeading}>
                      <div>
                        <span className={styles.label}>Tool access</span>
                        <h3>Postura real de la capacidad AI</h3>
                      </div>
                    </div>
                    {activeEcommerceAiToolAccess.map((entry) => (
                      <div
                        className={styles.invoiceItemCard}
                        key={`ecommerce-tool:${entry.tool.key}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{entry.tool.title}</strong>
                          <span className={styles.statusPill}>
                            {entry.accessLevel}
                          </span>
                        </div>
                        <small>{entry.rationale}</small>
                        <small>
                          Boundary{' '}
                          {humanizeKey(entry.tool.executionBoundary.executionMode)}
                        </small>
                      </div>
                    ))}
                  </div>

                  {ecommerceLaunchAssistantAiEnvelope.retrieval ? (
                    <div className={styles.stack}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Retrieved memory</span>
                          <h3>Contexto persistido que ya entra al brief</h3>
                        </div>
                      </div>
                      <small>
                        {ecommerceLaunchAssistantAiEnvelope.retrieval.recordCount}{' '}
                        record(s) visibles para este agente.
                      </small>
                      {ecommerceLaunchAssistantAiEnvelope.retrieval.notes.map(
                        (note, index) => (
                          <small key={`ecommerce-retrieval-note:${index}`}>
                            {note}
                          </small>
                        ),
                      )}
                    </div>
                  ) : null}

                  {activeEcommerceAiApprovalPolicies.length > 0 ? (
                    <div className={styles.stack}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Human gate</span>
                          <h3>Cómo entra a revisión humana</h3>
                        </div>
                      </div>
                      {activeEcommerceAiApprovalPolicies.map((entry) => (
                        <div
                          className={styles.assistCueCard}
                          key={`ecommerce-policy:${entry.policyKey}`}
                        >
                          <div className={styles.invoiceCardHeader}>
                            <strong>{entry.title}</strong>
                            <span
                              className={`${styles.statusPill} ${styles.statusWarning}`}
                            >
                              {entry.scope}
                            </span>
                          </div>
                          <small>{entry.summary}</small>
                          <small>{entry.reviewGuidance}</small>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {activeEcommerceAiSuggestionRuns.length > 0 ? (
                    <div className={styles.stack}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Recent handoffs</span>
                          <h3>Últimos briefs preparados</h3>
                        </div>
                      </div>
                      {activeEcommerceAiSuggestionRuns.slice(0, 2).map((entry) => (
                        <div
                          className={styles.timelineCard}
                          key={`ecommerce-run:${entry.id}`}
                        >
                          <div className={styles.invoiceCardHeader}>
                            <strong>{entry.summary}</strong>
                            <span className={styles.statusPill}>
                              {humanizeKey(entry.approvalSummary.status)}
                            </span>
                          </div>
                          <small>
                            {formatDate(entry.createdAt)} · {entry.promptPackKey}@
                            {entry.promptPackVersion}
                          </small>
                          <div className={styles.inlineActions}>
                            <button
                              className={styles.secondaryButton}
                              type="button"
                              onClick={() => onOpenDetail(entry.id)}
                              disabled={
                                ecommerceAgentActionLoadingState ===
                                getDedicatedActionKey('load_detail', entry.id)
                              }
                            >
                              Ver detalle
                            </button>
                            {entry.approvalSummary.status !== 'pending' &&
                            entry.approvalSummary.status !== 'approved' ? (
                              <button
                                className={styles.ghostButton}
                                type="button"
                                onClick={() => onRequestApproval(entry.id)}
                                disabled={
                                  ecommerceAgentActionLoadingState ===
                                  getDedicatedActionKey(
                                    'request_approval',
                                    entry.id,
                                  )
                                }
                              >
                                Pedir approval
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {selectedEcommerceAiSuggestionRunDetail ? (
                    <div className={styles.stack}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Suggestion detail</span>
                          <h3>Brief abierto para revisión humana</h3>
                        </div>
                      </div>
                      <div className={styles.detailCard}>
                        <div className={styles.stack}>
                          <small>
                            {selectedEcommerceAiSuggestionRunDetail.promptPackKey}@
                            {
                              selectedEcommerceAiSuggestionRunDetail.promptPackVersion
                            }
                          </small>
                          <strong>
                            {selectedEcommerceAiSuggestionRunDetail.summary}
                          </strong>
                          <small>
                            Outputs sugeridos:{' '}
                            {selectedEcommerceAiSuggestionRunDetail.suggestedOutputKeys.join(
                              ', ',
                            )}
                          </small>
                        </div>
                        <div className={styles.stack}>
                          {selectedEcommerceAiSuggestionRunDetail.approvalRequests.map(
                            (entry) => (
                              <div
                                className={styles.assistCueCard}
                                key={`ecommerce-detail-approval:${entry.id}`}
                              >
                                <div className={styles.invoiceCardHeader}>
                                  <strong>{entry.summary}</strong>
                                  <span className={styles.statusPill}>
                                    {humanizeKey(entry.status)}
                                  </span>
                                </div>
                                <small>{entry.policyKey}</small>
                                <small>{entry.rationale}</small>
                                {entry.status === 'pending' ? (
                                  <div className={styles.inlineActions}>
                                    <button
                                      className={styles.secondaryButton}
                                      type="button"
                                      onClick={() =>
                                        onReviewApproval(entry.id, 'approved')
                                      }
                                      disabled={
                                        ecommerceAgentActionLoadingState ===
                                        getDedicatedActionKey(
                                          'review_approval',
                                          entry.id,
                                        )
                                      }
                                    >
                                      Aprobar
                                    </button>
                                    <button
                                      className={styles.ghostButton}
                                      type="button"
                                      onClick={() =>
                                        onReviewApproval(entry.id, 'rejected')
                                      }
                                      disabled={
                                        ecommerceAgentActionLoadingState ===
                                        getDedicatedActionKey(
                                          'review_approval',
                                          entry.id,
                                        )
                                      }
                                    >
                                      Rechazar
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {ecommerceLaunchAssistantAiApprovalRequests.length > 0 ? (
                    <div className={styles.stack}>
                      <div className={styles.sectionHeading}>
                        <div>
                          <span className={styles.label}>Approval queue</span>
                          <h3>Solicitudes visibles para ecommerce launch</h3>
                        </div>
                      </div>
                      {ecommerceLaunchAssistantAiApprovalRequests
                        .slice(0, 3)
                        .map((entry) => (
                          <div
                            className={styles.assistCueCard}
                            key={`ecommerce-approval:${entry.id}`}
                          >
                            <div className={styles.invoiceCardHeader}>
                              <strong>{entry.summary}</strong>
                              <span className={styles.statusPill}>
                                {humanizeKey(entry.status)}
                              </span>
                            </div>
                            <small>{entry.policyKey}</small>
                            <small>{entry.rationale}</small>
                            <small>
                              Suggestion run {entry.suggestionRunId} · creada{' '}
                              {formatDate(entry.createdAt)}
                            </small>
                          </div>
                        ))}
                    </div>
                  ) : null}

                  {latestApprovedEcommerceAiApprovalRequest ? (
                    <div className={styles.assistCueCard}>
                      <strong>Última decisión humana</strong>
                      <small>{latestApprovedEcommerceAiApprovalRequest.summary}</small>
                      <small>
                        Revisada{' '}
                        {formatDate(
                          latestApprovedEcommerceAiApprovalRequest.reviewedAt,
                        )}
                      </small>
                    </div>
                  ) : null}
                </div>
              ) : tenantAiEcommerceLaunchWorkspaceLoading ? (
                <small className={styles.muted}>
                  Cargando envelope AI de ecommerce launch...
                </small>
              ) : (
                <div className={styles.emptyState}>
                  <p>
                    Cuando el envelope AI esté disponible, aquí veremos el brief
                    reusable del launch assistant.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
