import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  EcommerceProductAuthoringDraftNotFoundError,
  EcommerceLaunchPlanNotFoundError,
  GetTenantEcommerceCatalogAssetEntityWorkspaceUseCase,
  GetTenantEcommerceCatalogCommercialCardUseCase,
  GetTenantEcommerceCatalogListingAssetUseCase,
  GetTenantEcommerceLiveStorefrontSessionWorkspaceUseCase,
  GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
  GetTenantEcommerceStorefrontReleaseCandidateBriefUseCase,
  GetTenantEcommerceStorefrontGoLiveManifestUseCase,
  GetTenantEcommerceStorefrontReleaseControlWorkspaceUseCase,
  GetTenantEcommerceChannelReleaseExecutionReadinessUseCase,
  GetTenantEcommerceChannelReleaseWorkbenchUseCase,
  GetTenantEcommerceLandingAssetEntityWorkspaceUseCase,
  GetTenantEcommerceLandingPublishArtifactUseCase,
  GetTenantEcommerceLandingPageStructureUseCase,
  GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase,
  GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
  GetTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase,
  GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase,
  GetTenantEcommerceProductEntityChannelDraftDetailUseCase,
  GetTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase,
  GetTenantEcommerceProductEntityChannelReleaseCandidateDetailUseCase,
  GetTenantEcommerceSavedProductEntityChannelDraftDetailUseCase,
  GetTenantEcommerceProductEntityDetailUseCase,
  GetTenantEcommerceProductAuthoringDraftDetailUseCase,
  GetTenantEcommerceProductSetupDetailUseCase,
  GetTenantEcommerceProductWorkspaceDetailUseCase,
  GetTenantEcommerceStorefrontPreviewWorkspaceUseCase,
  GetTenantEcommerceStorefrontPublishReviewWorkspaceUseCase,
  GetTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase,
  GetTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase,
  GetTenantEcommerceWhatsappSalesFlowUseCase,
  RequestTenantEcommerceChannelReleaseHandoffPacketUseCase,
  RequestTenantEcommerceChannelReleaseLaunchPacketUseCase,
  RequestTenantEcommerceCatalogStorefrontPlacementPacketUseCase,
  RequestTenantEcommerceCatalogMerchandisingPacketUseCase,
  RequestTenantEcommerceCheckoutCustomerCapturePacketUseCase,
  RequestTenantEcommerceChannelReleaseApprovalPacketUseCase,
  RequestTenantEcommerceProductAuthoringDraftBriefUseCase,
  RequestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase,
  RequestTenantEcommerceWhatsappGrowthHandoffUseCase,
  RequestTenantEcommerceWhatsappGrowthActivationPacketUseCase,
  RequestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase,
  RequestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase,
  RequestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase,
  RequestTenantEcommerceOrderInvoicingBridgeUseCase,
  RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
  SaveTenantEcommerceProductEntityChannelDraftUseCase,
  UpdateTenantEcommerceProductEntityChannelAssetEntityEditableSnapshotUseCase,
  UpdateTenantEcommerceSavedProductEntityChannelDraftEditableSnapshotUseCase,
  RequestTenantEcommerceProductEntityChannelAssetPublishPacketUseCase,
  RequestTenantEcommerceProductEntityChannelDraftActionPacketUseCase,
  RequestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase,
  RequestTenantEcommerceProductEntityCommercializationPacketUseCase,
  RequestTenantEcommerceProductSetupDefinitionPacketUseCase,
  SaveTenantEcommerceProductAuthoringDraftUseCase,
  UpdateTenantEcommerceProductSetupEditableSnapshotUseCase,
  GetTenantEcommerceProductAuthoringWorkspaceUseCase,
  GetTenantEcommerceLaunchPlanDetailUseCase,
  GetTenantEcommerceStoreProfileWorkspaceUseCase,
  GetTenantEcommerceStoreSetupWorkspaceUseCase,
  GetTenantEcommerceLaunchWorkspaceUseCase,
  ListTenantEcommerceProductSetupsUseCase,
  ListTenantEcommerceProductEntitiesUseCase,
  ListTenantEcommerceProductEntityChannelAssetEntitiesUseCase,
  ListTenantEcommerceProductEntityChannelAssetWorkspacesUseCase,
  ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase,
  ListTenantEcommerceSavedProductEntityChannelDraftsUseCase,
  PromoteTenantEcommerceProductSetupToProductEntityUseCase,
  PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase,
  PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase,
  PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase,
  RequestTenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketUseCase,
  ListTenantEcommerceProductWorkspacesUseCase,
  ListTenantEcommerceSavedProductDraftsUseCase,
  ListTenantEcommerceLaunchPlansUseCase,
  PromoteTenantEcommerceProductWorkspaceToProductSetupUseCase,
  PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase,
  RequestTenantEcommerceProductWorkspaceReadinessPacketUseCase,
  RequestTenantEcommerceLaunchPlanActivationReadinessUseCase,
  UpdateTenantEcommerceProductWorkspaceEditableSnapshotUseCase,
} from '@saas-platform/ecommerce-application';
import {
  ProductNotFoundError,
} from '@saas-platform/catalog-application';
import {
  TENANT_PERMISSIONS,
  TenantAccessContext,
  TenantNotFoundError,
} from '@saas-platform/tenancy-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { TenantAccess } from '../tenancy/tenant-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import {
  EcommerceLaunchPlanDetailResponseDto,
  toEcommerceLaunchPlanDetailResponseDto,
} from './dto/ecommerce-launch-plan-detail.response';
import {
  EcommerceLaunchPlanRegistryResponseDto,
  toEcommerceLaunchPlanRegistryResponseDto,
} from './dto/ecommerce-launch-plan-registry.response';
import {
  EcommerceProductAuthoringDraftDetailResponseDto,
  toEcommerceProductAuthoringDraftDetailResponseDto,
} from './dto/ecommerce-product-authoring-draft-detail.response';
import {
  EcommerceProductAuthoringWorkspaceResponseDto,
  toEcommerceProductAuthoringWorkspaceResponseDto,
} from './dto/ecommerce-product-authoring-workspace.response';
import {
  EcommerceProductEntityChannelAssetDraftsWorkspaceResponseDto,
  toEcommerceProductEntityChannelAssetDraftsWorkspaceResponseDto,
} from './dto/ecommerce-product-entity-channel-asset-drafts-workspace.response';
import {
  EcommerceProductEntityChannelAssetEntityDetailResponseDto,
  EcommerceProductEntityChannelAssetEntityRegistryResponseDto,
  RequestEcommerceProductEntityChannelAssetEntityPublishPreparationPacketResponseDto,
  PromoteEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityResponseDto,
  UpdateEcommerceProductEntityChannelAssetEntityEditableSnapshotRequestDto,
  UpdateEcommerceProductEntityChannelAssetEntityEditableSnapshotResponseDto,
  toEcommerceProductEntityChannelAssetEntityDetailResponseDto,
  toEcommerceProductEntityChannelAssetEntityRegistryResponseDto,
  toPromoteEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityResponseDto,
  toRequestEcommerceProductEntityChannelAssetEntityPublishPreparationPacketResponseDto,
  toUpdateEcommerceProductEntityChannelAssetEntityEditableSnapshotResponseDto,
} from './dto/ecommerce-product-entity-channel-asset-entity.response';
import {
  EcommerceProductEntityChannelReleaseCandidateDetailResponseDto,
  EcommerceProductEntityChannelReleaseCandidateRegistryResponseDto,
  PromoteEcommerceProductEntityChannelAssetEntityToReleaseCandidateResponseDto,
  toEcommerceProductEntityChannelReleaseCandidateDetailResponseDto,
  toEcommerceProductEntityChannelReleaseCandidateRegistryResponseDto,
  toPromoteEcommerceProductEntityChannelAssetEntityToReleaseCandidateResponseDto,
} from './dto/ecommerce-product-entity-channel-release-candidate.response';
import {
  EcommerceCatalogCommercialCardResponseDto,
  EcommerceCatalogListingAssetResponseDto,
  EcommerceCatalogMerchandisingPacketResponseDto,
  EcommerceCheckoutCustomerCapturePacketResponseDto,
  EcommerceCheckoutOrderIntakeWorkspaceResponseDto,
  EcommerceCatalogStorefrontPlacementPacketResponseDto,
  EcommerceChannelReleaseApprovalPacketResponseDto,
  EcommerceChannelReleaseExecutionReadinessResponseDto,
  EcommerceChannelReleaseHandoffPacketResponseDto,
  EcommerceChannelReleaseLaunchPacketResponseDto,
  EcommerceCatalogAssetEntityWorkspaceResponseDto,
  EcommerceLandingPageStructureResponseDto,
  EcommerceLiveStorefrontSessionWorkspaceResponseDto,
  EcommerceChannelReleaseWorkbenchResponseDto,
  EcommerceLandingAssetEntityWorkspaceResponseDto,
  EcommerceLandingPublishArtifactResponseDto,
  EcommerceStorefrontReleaseControlWorkspaceResponseDto,
  EcommerceStorefrontGoLiveManifestResponseDto,
  EcommerceStorefrontReleaseCandidateBriefResponseDto,
  EcommerceStorefrontPublishReviewWorkspaceResponseDto,
  EcommerceStorefrontPreviewWorkspaceResponseDto,
  EcommerceWhatsappGrowthActivationPacketResponseDto,
  EcommerceWhatsappGrowthExecutionBridgeResponseDto,
  EcommerceWhatsappGrowthLaunchAcknowledgementPacketResponseDto,
  EcommerceOrderInvoicingBridgeResponseDto,
  EcommerceOrderToInvoiceReadinessPacketResponseDto,
  EcommerceWhatsappGrowthOperatorLaunchPacketResponseDto,
  EcommerceWhatsappGrowthActivationWorkspaceResponseDto,
  EcommerceWhatsappGrowthHandoffResponseDto,
  EcommerceWhatsappSalesFlowResponseDto,
  EcommerceWhatsappChannelSequenceWorkspaceResponseDto,
  toEcommerceCatalogCommercialCardResponseDto,
  toEcommerceCatalogListingAssetResponseDto,
  toEcommerceCatalogMerchandisingPacketResponseDto,
  toEcommerceCheckoutCustomerCapturePacketResponseDto,
  toEcommerceCheckoutOrderIntakeWorkspaceResponseDto,
  toEcommerceCatalogStorefrontPlacementPacketResponseDto,
  toEcommerceChannelReleaseApprovalPacketResponseDto,
  toEcommerceChannelReleaseExecutionReadinessResponseDto,
  toEcommerceChannelReleaseHandoffPacketResponseDto,
  toEcommerceChannelReleaseLaunchPacketResponseDto,
  toEcommerceCatalogAssetEntityWorkspaceResponseDto,
  toEcommerceLandingPageStructureResponseDto,
  toEcommerceLiveStorefrontSessionWorkspaceResponseDto,
  toEcommerceChannelReleaseWorkbenchResponseDto,
  toEcommerceLandingAssetEntityWorkspaceResponseDto,
  toEcommerceLandingPublishArtifactResponseDto,
  toEcommerceStorefrontReleaseControlWorkspaceResponseDto,
  toEcommerceStorefrontGoLiveManifestResponseDto,
  toEcommerceStorefrontReleaseCandidateBriefResponseDto,
  toEcommerceStorefrontPublishReviewWorkspaceResponseDto,
  toEcommerceStorefrontPreviewWorkspaceResponseDto,
  toEcommerceWhatsappGrowthActivationPacketResponseDto,
  toEcommerceWhatsappGrowthExecutionBridgeResponseDto,
  toEcommerceWhatsappGrowthLaunchAcknowledgementPacketResponseDto,
  toEcommerceOrderInvoicingBridgeResponseDto,
  toEcommerceOrderToInvoiceReadinessPacketResponseDto,
  toEcommerceWhatsappGrowthOperatorLaunchPacketResponseDto,
  toEcommerceWhatsappGrowthActivationWorkspaceResponseDto,
  toEcommerceWhatsappGrowthHandoffResponseDto,
  toEcommerceWhatsappSalesFlowResponseDto,
  toEcommerceWhatsappChannelSequenceWorkspaceResponseDto,
} from './dto/ecommerce-product-entity-channel-realization.response';
import {
  EcommerceProductEntityChannelAssetWorkspaceDetailResponseDto,
  EcommerceProductEntityChannelAssetWorkspaceRegistryResponseDto,
  PromoteEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceResponseDto,
  RequestEcommerceProductEntityChannelAssetPublishPacketResponseDto,
  toEcommerceProductEntityChannelAssetWorkspaceDetailResponseDto,
  toEcommerceProductEntityChannelAssetWorkspaceRegistryResponseDto,
  toPromoteEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceResponseDto,
  toRequestEcommerceProductEntityChannelAssetPublishPacketResponseDto,
} from './dto/ecommerce-product-entity-channel-asset-workspace.response';
import {
  EcommerceSavedProductEntityChannelDraftDetailResponseDto,
  EcommerceSavedProductEntityChannelDraftRegistryResponseDto,
  SaveEcommerceProductEntityChannelDraftResponseDto,
  UpdateEcommerceSavedProductEntityChannelDraftEditableSnapshotRequestDto,
  UpdateEcommerceSavedProductEntityChannelDraftEditableSnapshotResponseDto,
  toEcommerceSavedProductEntityChannelDraftDetailResponseDto,
  toEcommerceSavedProductEntityChannelDraftRegistryResponseDto,
  toSaveEcommerceProductEntityChannelDraftResponseDto,
  toUpdateEcommerceSavedProductEntityChannelDraftEditableSnapshotResponseDto,
} from './dto/ecommerce-product-entity-saved-channel-draft.response';
import {
  EcommerceProductEntityChannelDraftPublishPreparationWorkspaceResponseDto,
  EcommerceProductEntityChannelDraftDetailResponseDto,
  RequestEcommerceProductEntityChannelDraftActionPacketResponseDto,
  RequestEcommerceProductEntityChannelDraftPublishReadinessPacketResponseDto,
  toEcommerceProductEntityChannelDraftPublishPreparationWorkspaceResponseDto,
  toEcommerceProductEntityChannelDraftDetailResponseDto,
  toRequestEcommerceProductEntityChannelDraftActionPacketResponseDto,
  toRequestEcommerceProductEntityChannelDraftPublishReadinessPacketResponseDto,
} from './dto/ecommerce-product-entity-channel-draft.response';
import {
  EcommerceProductEntityChannelAssetsWorkspaceResponseDto,
  toEcommerceProductEntityChannelAssetsWorkspaceResponseDto,
} from './dto/ecommerce-product-entity-channel-assets-workspace.response';
import {
  EcommerceProductSetupDetailResponseDto,
  EcommerceProductSetupRegistryResponseDto,
  toEcommerceProductSetupDetailResponseDto,
  toEcommerceProductSetupRegistryResponseDto,
} from './dto/ecommerce-product-setup.response';
import {
  EcommerceProductEntityDetailResponseDto,
  EcommerceProductEntityRegistryResponseDto,
  toEcommerceProductEntityDetailResponseDto,
  toEcommerceProductEntityRegistryResponseDto,
} from './dto/ecommerce-product-entity.response';
import {
  EcommerceProductWorkspaceDetailResponseDto,
  toEcommerceProductWorkspaceDetailResponseDto,
} from './dto/ecommerce-product-workspace-detail.response';
import {
  EcommerceProductWorkspaceRegistryResponseDto,
  toEcommerceProductWorkspaceRegistryResponseDto,
} from './dto/ecommerce-product-workspace.response';
import {
  EcommerceSavedProductDraftRegistryResponseDto,
  toEcommerceSavedProductDraftRegistryResponseDto,
} from './dto/ecommerce-saved-product-draft-registry.response';
import {
  PromoteEcommerceProductWorkspaceToProductSetupResponseDto,
  toPromoteEcommerceProductWorkspaceToProductSetupResponseDto,
} from './dto/promote-ecommerce-product-workspace-to-product-setup.response';
import {
  PromoteEcommerceProductSetupToProductEntityResponseDto,
  toPromoteEcommerceProductSetupToProductEntityResponseDto,
} from './dto/promote-ecommerce-product-setup-to-product-entity.response';
import {
  PromoteEcommerceSavedDraftToProductWorkspaceResponseDto,
  toPromoteEcommerceSavedDraftToProductWorkspaceResponseDto,
} from './dto/promote-ecommerce-saved-draft-to-product-workspace.response';
import {
  EcommerceStoreProfileWorkspaceResponseDto,
  toEcommerceStoreProfileWorkspaceResponseDto,
} from './dto/ecommerce-store-profile-workspace.response';
import {
  EcommerceStoreSetupWorkspaceResponseDto,
  toEcommerceStoreSetupWorkspaceResponseDto,
} from './dto/ecommerce-store-setup-workspace.response';
import {
  EcommerceLaunchWorkspaceResponseDto,
  toEcommerceLaunchWorkspaceResponseDto,
} from './dto/ecommerce-launch-workspace.response';
import {
  RequestEcommerceProductAuthoringDraftBriefResponseDto,
  toRequestEcommerceProductAuthoringDraftBriefResponseDto,
} from './dto/request-ecommerce-product-authoring-draft-brief.response';
import {
  RequestEcommerceProductEntityCommercializationPacketResponseDto,
  toRequestEcommerceProductEntityCommercializationPacketResponseDto,
} from './dto/request-ecommerce-product-entity-commercialization-packet.response';
import {
  RequestEcommerceProductWorkspaceReadinessPacketResponseDto,
  toRequestEcommerceProductWorkspaceReadinessPacketResponseDto,
} from './dto/request-ecommerce-product-workspace-readiness-packet.response';
import {
  RequestEcommerceProductSetupDefinitionPacketResponseDto,
  toRequestEcommerceProductSetupDefinitionPacketResponseDto,
} from './dto/request-ecommerce-product-setup-definition-packet.response';
import {
  RequestEcommerceProductAuthoringDraftRefinementPacketResponseDto,
  toRequestEcommerceProductAuthoringDraftRefinementPacketResponseDto,
} from './dto/request-ecommerce-product-authoring-draft-refinement-packet.response';
import {
  SaveEcommerceProductAuthoringDraftResponseDto,
  toSaveEcommerceProductAuthoringDraftResponseDto,
} from './dto/save-ecommerce-product-authoring-draft.response';
import { UpdateEcommerceProductWorkspaceEditableSnapshotRequestDto } from './dto/update-ecommerce-product-workspace-editable-snapshot.request';
import {
  UpdateEcommerceProductWorkspaceEditableSnapshotResponseDto,
  toUpdateEcommerceProductWorkspaceEditableSnapshotResponseDto,
} from './dto/update-ecommerce-product-workspace-editable-snapshot.response';
import { UpdateEcommerceProductSetupEditableSnapshotRequestDto } from './dto/update-ecommerce-product-setup-editable-snapshot.request';
import {
  UpdateEcommerceProductSetupEditableSnapshotResponseDto,
  toUpdateEcommerceProductSetupEditableSnapshotResponseDto,
} from './dto/update-ecommerce-product-setup-editable-snapshot.response';
import {
  RequestEcommerceLaunchPlanActivationReadinessResponseDto,
  toRequestEcommerceLaunchPlanActivationReadinessResponseDto,
} from './dto/request-ecommerce-launch-plan-activation-readiness.response';

@Controller('ecommerce/tenants')
export class EcommerceController {
  constructor(
    private readonly getTenantEcommerceProductAuthoringDraftDetailUseCase: GetTenantEcommerceProductAuthoringDraftDetailUseCase,
    private readonly getTenantEcommerceLandingAssetEntityWorkspaceUseCase: GetTenantEcommerceLandingAssetEntityWorkspaceUseCase,
    private readonly getTenantEcommerceCatalogAssetEntityWorkspaceUseCase: GetTenantEcommerceCatalogAssetEntityWorkspaceUseCase,
    private readonly getTenantEcommerceCatalogCommercialCardUseCase: GetTenantEcommerceCatalogCommercialCardUseCase,
    private readonly getTenantEcommerceCatalogListingAssetUseCase: GetTenantEcommerceCatalogListingAssetUseCase,
    private readonly getTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase: GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
    private readonly getTenantEcommerceStorefrontPreviewWorkspaceUseCase: GetTenantEcommerceStorefrontPreviewWorkspaceUseCase,
    private readonly getTenantEcommerceStorefrontPublishReviewWorkspaceUseCase: GetTenantEcommerceStorefrontPublishReviewWorkspaceUseCase,
    private readonly getTenantEcommerceStorefrontReleaseCandidateBriefUseCase: GetTenantEcommerceStorefrontReleaseCandidateBriefUseCase,
    private readonly getTenantEcommerceStorefrontReleaseControlWorkspaceUseCase: GetTenantEcommerceStorefrontReleaseControlWorkspaceUseCase,
    private readonly getTenantEcommerceStorefrontGoLiveManifestUseCase: GetTenantEcommerceStorefrontGoLiveManifestUseCase,
    private readonly getTenantEcommerceLiveStorefrontSessionWorkspaceUseCase: GetTenantEcommerceLiveStorefrontSessionWorkspaceUseCase,
    private readonly getTenantEcommerceLandingPublishArtifactUseCase: GetTenantEcommerceLandingPublishArtifactUseCase,
    private readonly getTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase: GetTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase,
    private readonly getTenantEcommerceChannelReleaseWorkbenchUseCase: GetTenantEcommerceChannelReleaseWorkbenchUseCase,
    private readonly getTenantEcommerceChannelReleaseExecutionReadinessUseCase: GetTenantEcommerceChannelReleaseExecutionReadinessUseCase,
    private readonly requestTenantEcommerceChannelReleaseApprovalPacketUseCase: RequestTenantEcommerceChannelReleaseApprovalPacketUseCase,
    private readonly requestTenantEcommerceChannelReleaseLaunchPacketUseCase: RequestTenantEcommerceChannelReleaseLaunchPacketUseCase,
    private readonly getTenantEcommerceLandingPageStructureUseCase: GetTenantEcommerceLandingPageStructureUseCase,
    private readonly getTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase: GetTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase,
    private readonly requestTenantEcommerceWhatsappGrowthActivationPacketUseCase: RequestTenantEcommerceWhatsappGrowthActivationPacketUseCase,
    private readonly getTenantEcommerceWhatsappSalesFlowUseCase: GetTenantEcommerceWhatsappSalesFlowUseCase,
    private readonly getTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase: GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase,
    private readonly getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase: GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
    private readonly getTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase: GetTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase,
    private readonly getTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase: GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase,
    private readonly getTenantEcommerceProductEntityChannelDraftDetailUseCase: GetTenantEcommerceProductEntityChannelDraftDetailUseCase,
    private readonly getTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase: GetTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase,
    private readonly getTenantEcommerceProductEntityChannelReleaseCandidateDetailUseCase: GetTenantEcommerceProductEntityChannelReleaseCandidateDetailUseCase,
    private readonly getTenantEcommerceSavedProductEntityChannelDraftDetailUseCase: GetTenantEcommerceSavedProductEntityChannelDraftDetailUseCase,
    private readonly getTenantEcommerceProductEntityDetailUseCase: GetTenantEcommerceProductEntityDetailUseCase,
    private readonly getTenantEcommerceProductSetupDetailUseCase: GetTenantEcommerceProductSetupDetailUseCase,
    private readonly getTenantEcommerceProductWorkspaceDetailUseCase: GetTenantEcommerceProductWorkspaceDetailUseCase,
    private readonly requestTenantEcommerceChannelReleaseHandoffPacketUseCase: RequestTenantEcommerceChannelReleaseHandoffPacketUseCase,
    private readonly requestTenantEcommerceCatalogStorefrontPlacementPacketUseCase: RequestTenantEcommerceCatalogStorefrontPlacementPacketUseCase,
    private readonly requestTenantEcommerceCatalogMerchandisingPacketUseCase: RequestTenantEcommerceCatalogMerchandisingPacketUseCase,
    private readonly requestTenantEcommerceProductAuthoringDraftBriefUseCase: RequestTenantEcommerceProductAuthoringDraftBriefUseCase,
    private readonly requestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase: RequestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase,
    private readonly requestTenantEcommerceWhatsappGrowthHandoffUseCase: RequestTenantEcommerceWhatsappGrowthHandoffUseCase,
    private readonly saveTenantEcommerceProductEntityChannelDraftUseCase: SaveTenantEcommerceProductEntityChannelDraftUseCase,
    private readonly requestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase: RequestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase,
    private readonly requestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase: RequestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase,
    private readonly requestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase: RequestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase,
    private readonly requestTenantEcommerceOrderInvoicingBridgeUseCase: RequestTenantEcommerceOrderInvoicingBridgeUseCase,
    private readonly requestTenantEcommerceCheckoutCustomerCapturePacketUseCase: RequestTenantEcommerceCheckoutCustomerCapturePacketUseCase,
    private readonly requestTenantEcommerceOrderToInvoiceReadinessPacketUseCase: RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
    private readonly updateTenantEcommerceSavedProductEntityChannelDraftEditableSnapshotUseCase: UpdateTenantEcommerceSavedProductEntityChannelDraftEditableSnapshotUseCase,
    private readonly updateTenantEcommerceProductEntityChannelAssetEntityEditableSnapshotUseCase: UpdateTenantEcommerceProductEntityChannelAssetEntityEditableSnapshotUseCase,
    private readonly requestTenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketUseCase: RequestTenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketUseCase,
    private readonly requestTenantEcommerceProductEntityChannelAssetPublishPacketUseCase: RequestTenantEcommerceProductEntityChannelAssetPublishPacketUseCase,
    private readonly requestTenantEcommerceProductEntityChannelDraftActionPacketUseCase: RequestTenantEcommerceProductEntityChannelDraftActionPacketUseCase,
    private readonly requestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase: RequestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase,
    private readonly requestTenantEcommerceProductEntityCommercializationPacketUseCase: RequestTenantEcommerceProductEntityCommercializationPacketUseCase,
    private readonly requestTenantEcommerceProductSetupDefinitionPacketUseCase: RequestTenantEcommerceProductSetupDefinitionPacketUseCase,
    private readonly saveTenantEcommerceProductAuthoringDraftUseCase: SaveTenantEcommerceProductAuthoringDraftUseCase,
    private readonly updateTenantEcommerceProductSetupEditableSnapshotUseCase: UpdateTenantEcommerceProductSetupEditableSnapshotUseCase,
    private readonly getTenantEcommerceProductAuthoringWorkspaceUseCase: GetTenantEcommerceProductAuthoringWorkspaceUseCase,
    private readonly listTenantEcommerceProductEntityChannelAssetEntitiesUseCase: ListTenantEcommerceProductEntityChannelAssetEntitiesUseCase,
    private readonly listTenantEcommerceProductEntityChannelAssetWorkspacesUseCase: ListTenantEcommerceProductEntityChannelAssetWorkspacesUseCase,
    private readonly listTenantEcommerceProductEntityChannelReleaseCandidatesUseCase: ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase,
    private readonly listTenantEcommerceProductEntitiesUseCase: ListTenantEcommerceProductEntitiesUseCase,
    private readonly listTenantEcommerceSavedProductEntityChannelDraftsUseCase: ListTenantEcommerceSavedProductEntityChannelDraftsUseCase,
    private readonly listTenantEcommerceProductSetupsUseCase: ListTenantEcommerceProductSetupsUseCase,
    private readonly listTenantEcommerceProductWorkspacesUseCase: ListTenantEcommerceProductWorkspacesUseCase,
    private readonly listTenantEcommerceSavedProductDraftsUseCase: ListTenantEcommerceSavedProductDraftsUseCase,
    private readonly promoteTenantEcommerceProductSetupToProductEntityUseCase: PromoteTenantEcommerceProductSetupToProductEntityUseCase,
    private readonly promoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase: PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase,
    private readonly promoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase: PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase,
    private readonly promoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase: PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase,
    private readonly promoteTenantEcommerceProductWorkspaceToProductSetupUseCase: PromoteTenantEcommerceProductWorkspaceToProductSetupUseCase,
    private readonly promoteTenantEcommerceSavedDraftToProductWorkspaceUseCase: PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase,
    private readonly requestTenantEcommerceProductWorkspaceReadinessPacketUseCase: RequestTenantEcommerceProductWorkspaceReadinessPacketUseCase,
    private readonly updateTenantEcommerceProductWorkspaceEditableSnapshotUseCase: UpdateTenantEcommerceProductWorkspaceEditableSnapshotUseCase,
    private readonly getTenantEcommerceLaunchPlanDetailUseCase: GetTenantEcommerceLaunchPlanDetailUseCase,
    private readonly getTenantEcommerceStoreProfileWorkspaceUseCase: GetTenantEcommerceStoreProfileWorkspaceUseCase,
    private readonly getTenantEcommerceStoreSetupWorkspaceUseCase: GetTenantEcommerceStoreSetupWorkspaceUseCase,
    private readonly getTenantEcommerceLaunchWorkspaceUseCase: GetTenantEcommerceLaunchWorkspaceUseCase,
    private readonly listTenantEcommerceLaunchPlansUseCase: ListTenantEcommerceLaunchPlansUseCase,
    private readonly requestTenantEcommerceLaunchPlanActivationReadinessUseCase: RequestTenantEcommerceLaunchPlanActivationReadinessUseCase,
  ) {}

  @Get(':slug/store-setup-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantStoreSetupWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceStoreSetupWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcommerceStoreSetupWorkspaceUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toEcommerceStoreSetupWorkspaceResponseDto(workspace);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/store-profile-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantStoreProfileWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceStoreProfileWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcommerceStoreProfileWorkspaceUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toEcommerceStoreProfileWorkspaceResponseDto(workspace);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/product-authoring-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantProductAuthoringWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductAuthoringWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcommerceProductAuthoringWorkspaceUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toEcommerceProductAuthoringWorkspaceResponseDto(workspace);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/saved-product-drafts')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async listTenantSavedProductDrafts(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceSavedProductDraftRegistryResponseDto> {
    const registry =
      await this.listTenantEcommerceSavedProductDraftsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

    return toEcommerceSavedProductDraftRegistryResponseDto(registry);
  }

  @Get(':slug/product-workspaces')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async listTenantProductWorkspaces(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductWorkspaceRegistryResponseDto> {
    const registry =
      await this.listTenantEcommerceProductWorkspacesUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

    return toEcommerceProductWorkspaceRegistryResponseDto(registry);
  }

  @Get(':slug/product-setups')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async listTenantProductSetups(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductSetupRegistryResponseDto> {
    const registry =
      await this.listTenantEcommerceProductSetupsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

    return toEcommerceProductSetupRegistryResponseDto(registry);
  }

  @Get(':slug/product-entities')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async listTenantProductEntities(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductEntityRegistryResponseDto> {
    const registry =
      await this.listTenantEcommerceProductEntitiesUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

    return toEcommerceProductEntityRegistryResponseDto(registry);
  }

  @Get(':slug/product-setups/:productSetupId')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantProductSetupDetail(
    @Param('slug') slug: string,
    @Param('productSetupId') productSetupId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductSetupDetailResponseDto> {
    const detail =
      await this.getTenantEcommerceProductSetupDetailUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productSetupId,
      );

    if (!detail) {
      throw new NotFoundException(
        `Product setup ${productSetupId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceProductSetupDetailResponseDto(detail);
  }

  @Get(':slug/product-entities/:productEntityId')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantProductEntityDetail(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductEntityDetailResponseDto> {
    const detail =
      await this.getTenantEcommerceProductEntityDetailUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!detail) {
      throw new NotFoundException(
        `Product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceProductEntityDetailResponseDto(detail);
  }

  @Get(':slug/product-entities/:productEntityId/channel-assets-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantProductEntityChannelAssetsWorkspace(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductEntityChannelAssetsWorkspaceResponseDto> {
    const workspace =
      await this.getTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!workspace) {
      throw new NotFoundException(
        `Product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceProductEntityChannelAssetsWorkspaceResponseDto(
      workspace,
    );
  }

  @Get(':slug/product-entities/:productEntityId/channel-asset-drafts-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantProductEntityChannelAssetDraftsWorkspace(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductEntityChannelAssetDraftsWorkspaceResponseDto> {
    const workspace =
      await this.getTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!workspace) {
      throw new NotFoundException(
        `Product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceProductEntityChannelAssetDraftsWorkspaceResponseDto(
      workspace,
    );
  }

  @Get(':slug/product-entities/:productEntityId/channel-asset-workspaces')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async listTenantProductEntityChannelAssetWorkspaces(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductEntityChannelAssetWorkspaceRegistryResponseDto> {
    const registry =
      await this.listTenantEcommerceProductEntityChannelAssetWorkspacesUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!registry) {
      throw new NotFoundException(
        `Product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceProductEntityChannelAssetWorkspaceRegistryResponseDto(
      registry,
    );
  }

  @Get(':slug/product-entities/:productEntityId/channel-asset-workspaces/:channelKey')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantProductEntityChannelAssetWorkspaceDetail(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: 'landing' | 'catalog' | 'whatsapp',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductEntityChannelAssetWorkspaceDetailResponseDto> {
    const detail =
      await this.getTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
      );

    if (!detail) {
      throw new NotFoundException(
        `Channel asset workspace ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceProductEntityChannelAssetWorkspaceDetailResponseDto(
      detail,
    );
  }

  @Post(
    ':slug/product-entities/:productEntityId/channel-asset-workspaces/:channelKey/request-publish-packet'
  )
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantProductEntityChannelAssetPublishPacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: 'landing' | 'catalog' | 'whatsapp',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<RequestEcommerceProductEntityChannelAssetPublishPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceProductEntityChannelAssetPublishPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
      );

    if (!packet) {
      throw new NotFoundException(
        `Channel asset workspace ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toRequestEcommerceProductEntityChannelAssetPublishPacketResponseDto(
      packet,
    );
  }

  @Get(':slug/product-entities/:productEntityId/channel-asset-entities')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async listTenantProductEntityChannelAssetEntities(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductEntityChannelAssetEntityRegistryResponseDto> {
    const registry =
      await this.listTenantEcommerceProductEntityChannelAssetEntitiesUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!registry) {
      throw new NotFoundException(
        `Product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceProductEntityChannelAssetEntityRegistryResponseDto(
      registry,
    );
  }

  @Get(':slug/product-entities/:productEntityId/channel-asset-entities/:channelKey')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantProductEntityChannelAssetEntityDetail(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: 'landing' | 'catalog' | 'whatsapp',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductEntityChannelAssetEntityDetailResponseDto> {
    const detail =
      await this.getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
      );

    if (!detail) {
      throw new NotFoundException(
        `Channel asset entity ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceProductEntityChannelAssetEntityDetailResponseDto(detail);
  }

  @Post(
    ':slug/product-entities/:productEntityId/channel-asset-entities/:channelKey/update-editable-snapshot'
  )
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async updateTenantProductEntityChannelAssetEntityEditableSnapshot(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: 'landing' | 'catalog' | 'whatsapp',
    @Body()
    body: UpdateEcommerceProductEntityChannelAssetEntityEditableSnapshotRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<UpdateEcommerceProductEntityChannelAssetEntityEditableSnapshotResponseDto> {
    const detail =
      await this.updateTenantEcommerceProductEntityChannelAssetEntityEditableSnapshotUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
        body,
      );

    if (!detail) {
      throw new NotFoundException(
        `Channel asset entity ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toUpdateEcommerceProductEntityChannelAssetEntityEditableSnapshotResponseDto(
      detail,
    );
  }

  @Post(
    ':slug/product-entities/:productEntityId/channel-asset-entities/:channelKey/request-publish-preparation-packet'
  )
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantProductEntityChannelAssetEntityPublishPreparationPacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: 'landing' | 'catalog' | 'whatsapp',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<RequestEcommerceProductEntityChannelAssetEntityPublishPreparationPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
      );

    if (!packet) {
      throw new NotFoundException(
        `Channel asset entity ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toRequestEcommerceProductEntityChannelAssetEntityPublishPreparationPacketResponseDto(
      packet,
    );
  }

  @Post(
    ':slug/product-entities/:productEntityId/channel-asset-workspaces/:channelKey/promote-to-channel-asset-entity'
  )
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async promoteTenantProductEntityChannelAssetWorkspaceToChannelAssetEntity(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: 'landing' | 'catalog' | 'whatsapp',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<PromoteEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityResponseDto> {
    const assetEntity =
      await this.promoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
      );

    if (!assetEntity) {
      throw new NotFoundException(
        `Channel asset workspace ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toPromoteEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityResponseDto(
      assetEntity,
    );
  }

  @Get(':slug/product-entities/:productEntityId/channel-release-candidates')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async listTenantProductEntityChannelReleaseCandidates(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductEntityChannelReleaseCandidateRegistryResponseDto> {
    const registry =
      await this.listTenantEcommerceProductEntityChannelReleaseCandidatesUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!registry) {
      throw new NotFoundException(
        `Product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceProductEntityChannelReleaseCandidateRegistryResponseDto(
      registry,
    );
  }

  @Get(':slug/product-entities/:productEntityId/channel-release-candidates/:channelKey')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantProductEntityChannelReleaseCandidateDetail(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: 'landing' | 'catalog' | 'whatsapp',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductEntityChannelReleaseCandidateDetailResponseDto> {
    const detail =
      await this.getTenantEcommerceProductEntityChannelReleaseCandidateDetailUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
      );

    if (!detail) {
      throw new NotFoundException(
        `Channel release candidate ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceProductEntityChannelReleaseCandidateDetailResponseDto(
      detail,
    );
  }

  @Post(
    ':slug/product-entities/:productEntityId/channel-asset-entities/:channelKey/promote-to-release-candidate'
  )
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async promoteTenantProductEntityChannelAssetEntityToReleaseCandidate(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: 'landing' | 'catalog' | 'whatsapp',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<PromoteEcommerceProductEntityChannelAssetEntityToReleaseCandidateResponseDto> {
    const releaseCandidate =
      await this.promoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
      );

    if (!releaseCandidate) {
      throw new NotFoundException(
        `Channel asset entity ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toPromoteEcommerceProductEntityChannelAssetEntityToReleaseCandidateResponseDto(
      releaseCandidate,
    );
  }

  @Get(':slug/product-entities/:productEntityId/landing-asset-entity-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantLandingAssetEntityWorkspace(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceLandingAssetEntityWorkspaceResponseDto> {
    const workspace =
      await this.getTenantEcommerceLandingAssetEntityWorkspaceUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!workspace) {
      throw new NotFoundException(
        `Landing asset entity workspace for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceLandingAssetEntityWorkspaceResponseDto(workspace);
  }

  @Get(':slug/product-entities/:productEntityId/catalog-asset-entity-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantCatalogAssetEntityWorkspace(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceCatalogAssetEntityWorkspaceResponseDto> {
    const workspace =
      await this.getTenantEcommerceCatalogAssetEntityWorkspaceUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!workspace) {
      throw new NotFoundException(
        `Catalog asset entity workspace for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceCatalogAssetEntityWorkspaceResponseDto(workspace);
  }

  @Get(':slug/product-entities/:productEntityId/catalog-commercial-card')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantCatalogCommercialCard(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceCatalogCommercialCardResponseDto> {
    const card =
      await this.getTenantEcommerceCatalogCommercialCardUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!card) {
      throw new NotFoundException(
        `Catalog commercial card for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceCatalogCommercialCardResponseDto(card);
  }

  @Get(':slug/product-entities/:productEntityId/storefront-preview-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantStorefrontPreviewWorkspace(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceStorefrontPreviewWorkspaceResponseDto> {
    const workspace =
      await this.getTenantEcommerceStorefrontPreviewWorkspaceUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!workspace) {
      throw new NotFoundException(
        `Storefront preview workspace for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceStorefrontPreviewWorkspaceResponseDto(workspace);
  }

  @Get(':slug/product-entities/:productEntityId/storefront-publish-review-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantStorefrontPublishReviewWorkspace(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceStorefrontPublishReviewWorkspaceResponseDto> {
    const workspace =
      await this.getTenantEcommerceStorefrontPublishReviewWorkspaceUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!workspace) {
      throw new NotFoundException(
        `Storefront publish review workspace for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceStorefrontPublishReviewWorkspaceResponseDto(workspace);
  }

  @Get(':slug/product-entities/:productEntityId/storefront-release-candidate-brief')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantStorefrontReleaseCandidateBrief(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceStorefrontReleaseCandidateBriefResponseDto> {
    const brief =
      await this.getTenantEcommerceStorefrontReleaseCandidateBriefUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!brief) {
      throw new NotFoundException(
        `Storefront release candidate brief for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceStorefrontReleaseCandidateBriefResponseDto(brief);
  }

  @Get(':slug/product-entities/:productEntityId/storefront-release-control-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantStorefrontReleaseControlWorkspace(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceStorefrontReleaseControlWorkspaceResponseDto> {
    const workspace =
      await this.getTenantEcommerceStorefrontReleaseControlWorkspaceUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!workspace) {
      throw new NotFoundException(
        `Storefront release control workspace for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceStorefrontReleaseControlWorkspaceResponseDto(workspace);
  }

  @Get(':slug/product-entities/:productEntityId/storefront-go-live-manifest')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantStorefrontGoLiveManifest(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceStorefrontGoLiveManifestResponseDto> {
    const manifest =
      await this.getTenantEcommerceStorefrontGoLiveManifestUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!manifest) {
      throw new NotFoundException(
        `Storefront go-live manifest for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceStorefrontGoLiveManifestResponseDto(manifest);
  }

  @Get(':slug/product-entities/:productEntityId/live-storefront-session-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantLiveStorefrontSessionWorkspace(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceLiveStorefrontSessionWorkspaceResponseDto> {
    const workspace =
      await this.getTenantEcommerceLiveStorefrontSessionWorkspaceUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!workspace) {
      throw new NotFoundException(
        `Live storefront session workspace for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceLiveStorefrontSessionWorkspaceResponseDto(workspace);
  }

  @Get(':slug/product-entities/:productEntityId/landing-publish-artifact')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantLandingPublishArtifact(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceLandingPublishArtifactResponseDto> {
    const artifact =
      await this.getTenantEcommerceLandingPublishArtifactUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!artifact) {
      throw new NotFoundException(
        `Landing publish artifact for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceLandingPublishArtifactResponseDto(artifact);
  }

  @Get(':slug/product-entities/:productEntityId/whatsapp-channel-sequence-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantWhatsappChannelSequenceWorkspace(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceWhatsappChannelSequenceWorkspaceResponseDto> {
    const workspace =
      await this.getTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!workspace) {
      throw new NotFoundException(
        `Whatsapp channel sequence workspace for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceWhatsappChannelSequenceWorkspaceResponseDto(workspace);
  }

  @Get(':slug/product-entities/:productEntityId/channel-release-workbench')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantChannelReleaseWorkbench(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceChannelReleaseWorkbenchResponseDto> {
    const workbench =
      await this.getTenantEcommerceChannelReleaseWorkbenchUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!workbench) {
      throw new NotFoundException(
        `Channel release workbench for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceChannelReleaseWorkbenchResponseDto(workbench);
  }

  @Get(':slug/product-entities/:productEntityId/channel-release-execution-readiness')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantChannelReleaseExecutionReadiness(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceChannelReleaseExecutionReadinessResponseDto> {
    const readiness =
      await this.getTenantEcommerceChannelReleaseExecutionReadinessUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!readiness) {
      throw new NotFoundException(
        `Channel release execution readiness for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceChannelReleaseExecutionReadinessResponseDto(readiness);
  }

  @Post(':slug/product-entities/:productEntityId/request-release-handoff-packet')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantChannelReleaseHandoffPacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceChannelReleaseHandoffPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceChannelReleaseHandoffPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!packet) {
      throw new NotFoundException(
        `Channel release handoff packet for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceChannelReleaseHandoffPacketResponseDto(packet);
  }

  @Post(':slug/product-entities/:productEntityId/request-release-approval-packet')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantChannelReleaseApprovalPacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceChannelReleaseApprovalPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceChannelReleaseApprovalPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!packet) {
      throw new NotFoundException(
        `Channel release approval packet for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceChannelReleaseApprovalPacketResponseDto(packet);
  }

  @Post(':slug/product-entities/:productEntityId/request-release-launch-packet')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantChannelReleaseLaunchPacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceChannelReleaseLaunchPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceChannelReleaseLaunchPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!packet) {
      throw new NotFoundException(
        `Channel release launch packet for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceChannelReleaseLaunchPacketResponseDto(packet);
  }

  @Get(':slug/product-entities/:productEntityId/catalog-listing-asset')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantCatalogListingAsset(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceCatalogListingAssetResponseDto> {
    const listing =
      await this.getTenantEcommerceCatalogListingAssetUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!listing) {
      throw new NotFoundException(
        `Catalog listing asset for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceCatalogListingAssetResponseDto(listing);
  }

  @Post(
    ':slug/product-entities/:productEntityId/request-catalog-storefront-placement-packet',
  )
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantCatalogStorefrontPlacementPacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceCatalogStorefrontPlacementPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceCatalogStorefrontPlacementPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!packet) {
      throw new NotFoundException(
        `Catalog storefront placement packet for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceCatalogStorefrontPlacementPacketResponseDto(packet);
  }

  @Post(':slug/product-entities/:productEntityId/request-catalog-merchandising-packet')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantCatalogMerchandisingPacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceCatalogMerchandisingPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceCatalogMerchandisingPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!packet) {
      throw new NotFoundException(
        `Catalog merchandising packet for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceCatalogMerchandisingPacketResponseDto(packet);
  }

  @Get(':slug/product-entities/:productEntityId/checkout-order-intake-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantCheckoutOrderIntakeWorkspace(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceCheckoutOrderIntakeWorkspaceResponseDto> {
    const workspace =
      await this.getTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!workspace) {
      throw new NotFoundException(
        `Checkout order intake workspace for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceCheckoutOrderIntakeWorkspaceResponseDto(workspace);
  }

  @Post(':slug/product-entities/:productEntityId/request-checkout-customer-capture-packet')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantCheckoutCustomerCapturePacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceCheckoutCustomerCapturePacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceCheckoutCustomerCapturePacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!packet) {
      throw new NotFoundException(
        `Checkout customer capture packet for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceCheckoutCustomerCapturePacketResponseDto(packet);
  }

  @Get(':slug/product-entities/:productEntityId/landing-page-structure')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantLandingPageStructure(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceLandingPageStructureResponseDto> {
    const structure =
      await this.getTenantEcommerceLandingPageStructureUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!structure) {
      throw new NotFoundException(
        `Landing page structure for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceLandingPageStructureResponseDto(structure);
  }

  @Get(':slug/product-entities/:productEntityId/whatsapp-sales-flow')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantWhatsappSalesFlow(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceWhatsappSalesFlowResponseDto> {
    const flow = await this.getTenantEcommerceWhatsappSalesFlowUseCase.execute(
      tenantAccess?.tenantSlug ?? slug,
      productEntityId,
    );

    if (!flow) {
      throw new NotFoundException(
        `Whatsapp sales flow for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceWhatsappSalesFlowResponseDto(flow);
  }

  @Post(':slug/product-entities/:productEntityId/request-whatsapp-growth-handoff')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantWhatsappGrowthHandoff(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceWhatsappGrowthHandoffResponseDto> {
    const handoff =
      await this.requestTenantEcommerceWhatsappGrowthHandoffUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!handoff) {
      throw new NotFoundException(
        `Whatsapp growth handoff for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceWhatsappGrowthHandoffResponseDto(handoff);
  }

  @Get(':slug/product-entities/:productEntityId/whatsapp-growth-activation-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantWhatsappGrowthActivationWorkspace(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceWhatsappGrowthActivationWorkspaceResponseDto> {
    const workspace =
      await this.getTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!workspace) {
      throw new NotFoundException(
        `Whatsapp growth activation workspace for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceWhatsappGrowthActivationWorkspaceResponseDto(workspace);
  }

  @Post(':slug/product-entities/:productEntityId/request-whatsapp-growth-activation-packet')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantWhatsappGrowthActivationPacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceWhatsappGrowthActivationPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceWhatsappGrowthActivationPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!packet) {
      throw new NotFoundException(
        `Whatsapp growth activation packet for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceWhatsappGrowthActivationPacketResponseDto(packet);
  }

  @Post(':slug/product-entities/:productEntityId/request-whatsapp-growth-execution-bridge')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantWhatsappGrowthExecutionBridge(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceWhatsappGrowthExecutionBridgeResponseDto> {
    const bridge =
      await this.requestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!bridge) {
      throw new NotFoundException(
        `Whatsapp growth execution bridge for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceWhatsappGrowthExecutionBridgeResponseDto(bridge);
  }

  @Post(
    ':slug/product-entities/:productEntityId/request-whatsapp-growth-operator-launch-packet',
  )
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantWhatsappGrowthOperatorLaunchPacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceWhatsappGrowthOperatorLaunchPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!packet) {
      throw new NotFoundException(
        `Whatsapp growth operator launch packet for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceWhatsappGrowthOperatorLaunchPacketResponseDto(packet);
  }

  @Post(
    ':slug/product-entities/:productEntityId/request-whatsapp-growth-launch-acknowledgement-packet',
  )
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantWhatsappGrowthLaunchAcknowledgementPacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceWhatsappGrowthLaunchAcknowledgementPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!packet) {
      throw new NotFoundException(
        `Whatsapp growth launch acknowledgement packet for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceWhatsappGrowthLaunchAcknowledgementPacketResponseDto(
      packet,
    );
  }

  @Post(':slug/product-entities/:productEntityId/request-order-invoicing-bridge')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantOrderInvoicingBridge(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceOrderInvoicingBridgeResponseDto> {
    const packet =
      await this.requestTenantEcommerceOrderInvoicingBridgeUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!packet) {
      throw new NotFoundException(
        `Order invoicing bridge for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceOrderInvoicingBridgeResponseDto(packet);
  }

  @Post(':slug/product-entities/:productEntityId/request-order-to-invoice-readiness-packet')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantOrderToInvoiceReadinessPacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceOrderToInvoiceReadinessPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceOrderToInvoiceReadinessPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!packet) {
      throw new NotFoundException(
        `Order-to-invoice readiness packet for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceOrderToInvoiceReadinessPacketResponseDto(packet);
  }

  @Get(':slug/product-entities/:productEntityId/channel-drafts/:channelKey')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantProductEntityChannelDraftDetail(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductEntityChannelDraftDetailResponseDto> {
    const detail =
      await this.getTenantEcommerceProductEntityChannelDraftDetailUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
      );

    if (!detail) {
      throw new NotFoundException(
        `Channel draft ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceProductEntityChannelDraftDetailResponseDto(detail);
  }

  @Post(
    ':slug/product-entities/:productEntityId/channel-drafts/:channelKey/request-action-packet'
  )
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantProductEntityChannelDraftActionPacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<RequestEcommerceProductEntityChannelDraftActionPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceProductEntityChannelDraftActionPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
      );

    if (!packet) {
      throw new NotFoundException(
        `Channel draft ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toRequestEcommerceProductEntityChannelDraftActionPacketResponseDto(
      packet,
    );
  }

  @Post(
    ':slug/product-entities/:productEntityId/channel-drafts/:channelKey/request-publish-readiness-packet'
  )
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantProductEntityChannelDraftPublishReadinessPacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<RequestEcommerceProductEntityChannelDraftPublishReadinessPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
      );

    if (!packet) {
      throw new NotFoundException(
        `Channel draft ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toRequestEcommerceProductEntityChannelDraftPublishReadinessPacketResponseDto(
      packet,
    );
  }

  @Get(
    ':slug/product-entities/:productEntityId/channel-drafts/:channelKey/publish-preparation-workspace'
  )
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantProductEntityChannelDraftPublishPreparationWorkspace(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductEntityChannelDraftPublishPreparationWorkspaceResponseDto> {
    const workspace =
      await this.getTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
      );

    if (!workspace) {
      throw new NotFoundException(
        `Channel draft ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceProductEntityChannelDraftPublishPreparationWorkspaceResponseDto(
      workspace,
    );
  }

  @Get(':slug/product-entities/:productEntityId/saved-channel-drafts')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async listTenantSavedProductEntityChannelDrafts(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceSavedProductEntityChannelDraftRegistryResponseDto> {
    const registry =
      await this.listTenantEcommerceSavedProductEntityChannelDraftsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!registry) {
      throw new NotFoundException(
        `Product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceSavedProductEntityChannelDraftRegistryResponseDto(
      registry,
    );
  }

  @Get(':slug/product-entities/:productEntityId/saved-channel-drafts/:channelKey')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantSavedProductEntityChannelDraftDetail(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: 'landing' | 'catalog' | 'whatsapp',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceSavedProductEntityChannelDraftDetailResponseDto> {
    const detail =
      await this.getTenantEcommerceSavedProductEntityChannelDraftDetailUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
      );

    if (!detail) {
      throw new NotFoundException(
        `Saved channel draft ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceSavedProductEntityChannelDraftDetailResponseDto(detail);
  }

  @Post(':slug/product-entities/:productEntityId/channel-drafts/:channelKey/save')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async saveTenantProductEntityChannelDraft(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: 'landing' | 'catalog' | 'whatsapp',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<SaveEcommerceProductEntityChannelDraftResponseDto> {
    const result =
      await this.saveTenantEcommerceProductEntityChannelDraftUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
      );

    return toSaveEcommerceProductEntityChannelDraftResponseDto(result);
  }

  @Post(
    ':slug/product-entities/:productEntityId/saved-channel-drafts/:channelKey/promote-to-channel-asset-workspace'
  )
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async promoteTenantSavedProductEntityChannelDraftToChannelAssetWorkspace(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: 'landing' | 'catalog' | 'whatsapp',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<PromoteEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceResponseDto> {
    const workspace =
      await this.promoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
      );

    if (!workspace) {
      throw new NotFoundException(
        `Saved channel draft ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toPromoteEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceResponseDto(
      workspace,
    );
  }

  @Post(
    ':slug/product-entities/:productEntityId/saved-channel-drafts/:channelKey/update-editable-snapshot'
  )
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async updateTenantSavedProductEntityChannelDraftEditableSnapshot(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @Param('channelKey') channelKey: 'landing' | 'catalog' | 'whatsapp',
    @Body()
    body: UpdateEcommerceSavedProductEntityChannelDraftEditableSnapshotRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<UpdateEcommerceSavedProductEntityChannelDraftEditableSnapshotResponseDto> {
    const detail =
      await this.updateTenantEcommerceSavedProductEntityChannelDraftEditableSnapshotUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
        channelKey,
        {
          title: body.title,
          headline: body.headline,
          draftBlueprint: body.draftBlueprint,
          recommendedArtifacts: body.recommendedArtifacts,
          nextMilestone: body.nextMilestone,
        },
      );

    if (!detail) {
      throw new NotFoundException(
        `Saved channel draft ${channelKey} for product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toUpdateEcommerceSavedProductEntityChannelDraftEditableSnapshotResponseDto(
      detail,
    );
  }

  @Post(':slug/product-entities/:productEntityId/request-commercialization-packet')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantProductEntityCommercializationPacket(
    @Param('slug') slug: string,
    @Param('productEntityId') productEntityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<RequestEcommerceProductEntityCommercializationPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceProductEntityCommercializationPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productEntityId,
      );

    if (!packet) {
      throw new NotFoundException(
        `Product entity ${productEntityId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toRequestEcommerceProductEntityCommercializationPacketResponseDto(
      packet,
    );
  }

  @Post(':slug/product-setups/:productSetupId/request-definition-packet')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantProductSetupDefinitionPacket(
    @Param('slug') slug: string,
    @Param('productSetupId') productSetupId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<RequestEcommerceProductSetupDefinitionPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceProductSetupDefinitionPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productSetupId,
      );

    if (!packet) {
      throw new NotFoundException(
        `Product setup ${productSetupId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toRequestEcommerceProductSetupDefinitionPacketResponseDto(packet);
  }

  @Post(':slug/product-setups/:productSetupId/update-editable-snapshot')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async updateTenantProductSetupEditableSnapshot(
    @Param('slug') slug: string,
    @Param('productSetupId') productSetupId: string,
    @Body() body: UpdateEcommerceProductSetupEditableSnapshotRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<UpdateEcommerceProductSetupEditableSnapshotResponseDto> {
    const detail =
      await this.updateTenantEcommerceProductSetupEditableSnapshotUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productSetupId,
        {
          title: body.title,
          pricingBand: body.pricingBand ?? null,
          offerAngle: body.offerAngle ?? null,
          primaryCta: body.primaryCta ?? null,
          channelSequence: body.channelSequence,
        },
      );

    if (!detail) {
      throw new NotFoundException(
        `Product setup ${productSetupId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toUpdateEcommerceProductSetupEditableSnapshotResponseDto(detail);
  }

  @Post(':slug/product-setups/:productSetupId/promote-to-product-entity')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async promoteTenantProductSetupToProductEntity(
    @Param('slug') slug: string,
    @Param('productSetupId') productSetupId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<PromoteEcommerceProductSetupToProductEntityResponseDto> {
    const productEntity =
      await this.promoteTenantEcommerceProductSetupToProductEntityUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        productSetupId,
      );

    if (!productEntity) {
      throw new NotFoundException(
        `Product setup ${productSetupId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toPromoteEcommerceProductSetupToProductEntityResponseDto(
      productEntity,
    );
  }

  @Get(':slug/product-workspaces/:savedDraftId')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantProductWorkspaceDetail(
    @Param('slug') slug: string,
    @Param('savedDraftId') savedDraftId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductWorkspaceDetailResponseDto> {
    const detail =
      await this.getTenantEcommerceProductWorkspaceDetailUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        savedDraftId,
      );

    if (!detail) {
      throw new NotFoundException(
        `Product workspace ${savedDraftId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toEcommerceProductWorkspaceDetailResponseDto(detail);
  }

  @Get(':slug/product-authoring-drafts/:draftId')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantProductAuthoringDraftDetail(
    @Param('slug') slug: string,
    @Param('draftId') draftId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceProductAuthoringDraftDetailResponseDto> {
    try {
      const detail =
        await this.getTenantEcommerceProductAuthoringDraftDetailUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          draftId,
        );

      return toEcommerceProductAuthoringDraftDetailResponseDto(detail);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError ||
        error instanceof EcommerceProductAuthoringDraftNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/product-authoring-drafts/:draftId/request-ai-brief')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantProductAuthoringDraftBrief(
    @Param('slug') slug: string,
    @Param('draftId') draftId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<RequestEcommerceProductAuthoringDraftBriefResponseDto> {
    try {
      const result =
        await this.requestTenantEcommerceProductAuthoringDraftBriefUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          draftId,
        );

      return toRequestEcommerceProductAuthoringDraftBriefResponseDto(result);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError ||
        error instanceof EcommerceProductAuthoringDraftNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/product-authoring-drafts/:draftId/request-refinement-packet')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantProductAuthoringDraftRefinementPacket(
    @Param('slug') slug: string,
    @Param('draftId') draftId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<RequestEcommerceProductAuthoringDraftRefinementPacketResponseDto> {
    try {
      const result =
        await this.requestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          draftId,
        );

      return toRequestEcommerceProductAuthoringDraftRefinementPacketResponseDto(
        result,
      );
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError ||
        error instanceof EcommerceProductAuthoringDraftNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/product-authoring-drafts/:draftId/save')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async saveTenantProductAuthoringDraft(
    @Param('slug') slug: string,
    @Param('draftId') draftId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<SaveEcommerceProductAuthoringDraftResponseDto> {
    try {
      const saved =
        await this.saveTenantEcommerceProductAuthoringDraftUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          draftId,
        );

      return toSaveEcommerceProductAuthoringDraftResponseDto(saved);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError ||
        error instanceof EcommerceProductAuthoringDraftNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/saved-product-drafts/:savedDraftId/promote-to-product-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async promoteTenantSavedDraftToProductWorkspace(
    @Param('slug') slug: string,
    @Param('savedDraftId') savedDraftId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<PromoteEcommerceSavedDraftToProductWorkspaceResponseDto> {
    const workspace =
      await this.promoteTenantEcommerceSavedDraftToProductWorkspaceUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        savedDraftId,
      );

    if (!workspace) {
      throw new NotFoundException(
        `Saved ecommerce draft ${savedDraftId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toPromoteEcommerceSavedDraftToProductWorkspaceResponseDto(
      workspace,
    );
  }

  @Post(':slug/product-workspaces/:savedDraftId/promote-to-product-setup')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async promoteTenantProductWorkspaceToProductSetup(
    @Param('slug') slug: string,
    @Param('savedDraftId') savedDraftId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<PromoteEcommerceProductWorkspaceToProductSetupResponseDto> {
    const productSetup =
      await this.promoteTenantEcommerceProductWorkspaceToProductSetupUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        savedDraftId,
      );

    if (!productSetup) {
      throw new NotFoundException(
        `Product workspace ${savedDraftId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toPromoteEcommerceProductWorkspaceToProductSetupResponseDto(
      productSetup,
    );
  }

  @Post(':slug/product-workspaces/:savedDraftId/update-editable-snapshot')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async updateTenantProductWorkspaceEditableSnapshot(
    @Param('slug') slug: string,
    @Param('savedDraftId') savedDraftId: string,
    @Body() body: UpdateEcommerceProductWorkspaceEditableSnapshotRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<UpdateEcommerceProductWorkspaceEditableSnapshotResponseDto> {
    const workspace =
      await this.updateTenantEcommerceProductWorkspaceEditableSnapshotUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        savedDraftId,
        {
          title: body.title,
          pricingBand: body.pricingBand ?? null,
          offerAngle: body.offerAngle ?? null,
          primaryCta: body.primaryCta ?? null,
          channelSequence: body.channelSequence,
        },
      );

    if (!workspace) {
      throw new NotFoundException(
        `Product workspace ${savedDraftId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toUpdateEcommerceProductWorkspaceEditableSnapshotResponseDto(
      workspace,
    );
  }

  @Post(':slug/product-workspaces/:savedDraftId/request-readiness-packet')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantProductWorkspaceReadinessPacket(
    @Param('slug') slug: string,
    @Param('savedDraftId') savedDraftId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<RequestEcommerceProductWorkspaceReadinessPacketResponseDto> {
    const packet =
      await this.requestTenantEcommerceProductWorkspaceReadinessPacketUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        savedDraftId,
      );

    if (!packet) {
      throw new NotFoundException(
        `Product workspace ${savedDraftId} was not found for tenant ${
          tenantAccess?.tenantSlug ?? slug
        }.`,
      );
    }

    return toRequestEcommerceProductWorkspaceReadinessPacketResponseDto(
      packet,
    );
  }

  @Get(':slug/launch-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantLaunchWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceLaunchWorkspaceResponseDto> {
    try {
      const workspace =
        await this.getTenantEcommerceLaunchWorkspaceUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toEcommerceLaunchWorkspaceResponseDto(workspace);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/launch-plans/:planId')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async getTenantLaunchPlanDetail(
    @Param('slug') slug: string,
    @Param('planId') planId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceLaunchPlanDetailResponseDto> {
    try {
      const detail =
        await this.getTenantEcommerceLaunchPlanDetailUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          planId,
        );

      return toEcommerceLaunchPlanDetailResponseDto(detail);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError ||
        error instanceof EcommerceLaunchPlanNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/launch-plans')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async listTenantLaunchPlans(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<EcommerceLaunchPlanRegistryResponseDto> {
    try {
      const registry =
        await this.listTenantEcommerceLaunchPlansUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toEcommerceLaunchPlanRegistryResponseDto(registry);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/launch-plans/:planId/request-activation-readiness')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(TENANT_PERMISSIONS.ENTITLEMENTS_READ)
  async requestTenantLaunchPlanActivationReadiness(
    @Param('slug') slug: string,
    @Param('planId') planId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<RequestEcommerceLaunchPlanActivationReadinessResponseDto> {
    try {
      const result =
        await this.requestTenantEcommerceLaunchPlanActivationReadinessUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          planId,
        );

      return toRequestEcommerceLaunchPlanActivationReadinessResponseDto(result);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ProductNotFoundError ||
        error instanceof EcommerceLaunchPlanNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
