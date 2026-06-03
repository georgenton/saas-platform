import { Module } from '@nestjs/common';
import {
  PLATFORM_MODULE_REPOSITORY,
  PRODUCT_REPOSITORY,
  ListProductModulesUseCase,
} from '@saas-platform/catalog-application';
import {
  ENTITLEMENT_REPOSITORY,
  ListTenantEnabledProductsUseCase,
} from '@saas-platform/commercial-application';
import {
  ECOMMERCE_PRODUCT_DRAFT_REPOSITORY,
  ECOMMERCE_ORDER_DRAFT_REPOSITORY,
  ECOMMERCE_ORDER_OPERATIONAL_EVENT_REPOSITORY,
  ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
  GetTenantEcommerceCatalogAssetEntityWorkspaceUseCase,
  GetTenantEcommerceCatalogCommercialCardUseCase,
  GetTenantEcommerceCatalogListingAssetUseCase,
  GetTenantEcommerceLiveStorefrontSessionWorkspaceUseCase,
  GetTenantEcommerceOrderDraftDetailUseCase,
  GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
  GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
  GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
  GetTenantEcommerceOrderHoldResolutionWorkspaceUseCase,
  GetTenantEcommerceOrderOperatorWorkboardUseCase,
  GetTenantEcommerceOrderOpsAttentionWorkspaceUseCase,
  GetTenantEcommerceOrderOpsEscalationBoardUseCase,
  GetTenantEcommerceOrderOpsPriorityQueueUseCase,
  GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase,
  GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
  GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
  GetTenantEcommerceOrderPaymentDisputeWorkspaceUseCase,
  GetTenantEcommerceOrderPostSaleReportingSummaryUseCase,
  GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
  GetTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase,
  GetTenantEcommerceOrderFulfillmentAvailabilityWorkspaceUseCase,
  GetTenantEcommerceOrderInventoryReservationWorkspaceUseCase,
  GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
  GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
  GetTenantEcommerceOrderPostSaleOpsBoardUseCase,
  GetTenantEcommerceOrderPostSaleReportingBoardUseCase,
  GetTenantEcommerceOrderRevenueOpsBoardUseCase,
  GetTenantEcommerceOrderRevenueTrackingSummaryUseCase,
  GetTenantEcommerceOrderPaymentReconciliationWorkspaceUseCase,
  GetTenantEcommerceOrderOperationalHealthBoardUseCase,
  GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase,
  GetTenantEcommerceCompletionDashboardUseCase,
  GetTenantEcommerceOrderReviewWorkspaceUseCase,
  GetTenantEcommerceOrderStatusLifecycleDetailUseCase,
  GetTenantEcommerceInvoiceDraftHandoffWorkspaceUseCase,
  GetTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase,
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
  GetTenantEcommerceProductEntityChannelReleaseCandidateDetailUseCase,
  ECOMMERCE_PRODUCT_ENTITY_REPOSITORY,
  ECOMMERCE_PRODUCT_SETUP_REPOSITORY,
  GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase,
  GetTenantEcommerceProductEntityChannelDraftDetailUseCase,
  GetTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase,
  GetTenantEcommerceSavedProductEntityChannelDraftDetailUseCase,
  GetTenantEcommerceProductEntityDetailUseCase,
  GetTenantEcommerceProductAuthoringDraftDetailUseCase,
  GetTenantEcommerceProductAuthoringWorkspaceUseCase,
  GetTenantEcommerceProductSetupDetailUseCase,
  GetTenantEcommerceProductWorkspaceDetailUseCase,
  GetTenantEcommerceStorefrontPreviewWorkspaceUseCase,
  GetTenantEcommerceStorefrontPublishReviewWorkspaceUseCase,
  GetTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase,
  GetTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase,
  GetTenantEcommerceWhatsappSalesFlowUseCase,
  GetTenantEcommerceLaunchPlanDetailUseCase,
  GetTenantEcommerceStoreProfileWorkspaceUseCase,
  GetTenantEcommerceStoreSetupWorkspaceUseCase,
  GetTenantEcommerceLaunchWorkspaceUseCase,
  ListTenantEcommerceProductWorkspacesUseCase,
  ListTenantEcommerceSavedProductDraftsUseCase,
  ListTenantEcommerceOrderDraftsUseCase,
  ListTenantEcommerceOrderPostSaleLifecyclesUseCase,
  ListTenantEcommerceOrderOperationalEventsUseCase,
  ListTenantEcommerceOrderStatusLifecyclesUseCase,
  ListTenantEcommerceLaunchPlansUseCase,
  ListTenantEcommerceProductSetupsUseCase,
  ListTenantEcommerceProductEntitiesUseCase,
  ListTenantEcommerceProductEntityChannelAssetWorkspacesUseCase,
  ListTenantEcommerceProductEntityChannelAssetEntitiesUseCase,
  ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase,
  ListTenantEcommerceSavedProductEntityChannelDraftsUseCase,
  PromoteTenantEcommerceProductSetupToProductEntityUseCase,
  PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase,
  PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase,
  PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase,
  PromoteTenantEcommerceProductWorkspaceToProductSetupUseCase,
  PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase,
  RequestTenantEcommerceChannelReleaseApprovalPacketUseCase,
  RequestTenantEcommerceCatalogStorefrontPlacementPacketUseCase,
  RequestTenantEcommerceCatalogMerchandisingPacketUseCase,
  RequestTenantEcommerceCheckoutCustomerCapturePacketUseCase,
  RequestTenantEcommerceCheckoutCloseoutPacketUseCase,
  RequestTenantEcommerceOrderApprovalDecisionUseCase,
  RequestTenantEcommerceOrderHandoffDecisionUseCase,
  RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
  RequestTenantEcommerceOrderFulfillmentCompletionPacketUseCase,
  RequestTenantEcommerceOrderPaymentDisputeResolutionPacketUseCase,
  RequestTenantEcommerceOrderFulfillmentDeliveryConfirmationPacketUseCase,
  RequestTenantEcommerceOrderOperationalExceptionPacketUseCase,
  RequestTenantEcommerceOrderInvoiceExecutionPacketUseCase,
  RequestTenantEcommerceOrderInvoiceDraftCreationBridgeUseCase,
  ResolveTenantEcommerceOrderOperationalExceptionUseCase,
  RequestTenantEcommerceLiveRunReadinessPacketUseCase,
  RequestTenantEcommerceInvoiceHandoffAcknowledgementUseCase,
  RequestTenantEcommerceInvoiceDraftOpenBridgeUseCase,
  RequestTenantEcommerceInvoiceDraftLaunchBridgeUseCase,
  RequestTenantEcommerceOrderRouteResolutionPacketUseCase,
  RequestTenantEcommerceChannelReleaseLaunchPacketUseCase,
  RequestTenantEcommerceProductAuthoringDraftBriefUseCase,
  RequestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase,
  RequestTenantEcommerceChannelReleaseHandoffPacketUseCase,
  RequestTenantEcommerceProductEntityChannelDraftActionPacketUseCase,
  RequestTenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketUseCase,
  RequestTenantEcommerceProductEntityChannelAssetPublishPacketUseCase,
  RequestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase,
  RequestTenantEcommerceProductEntityCommercializationPacketUseCase,
  RequestTenantEcommerceProductSetupDefinitionPacketUseCase,
  RequestTenantEcommerceWhatsappGrowthHandoffUseCase,
  RequestTenantEcommerceWhatsappGrowthActivationPacketUseCase,
  RequestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase,
  RequestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase,
  RequestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase,
  RequestTenantEcommerceOrderInvoicingBridgeUseCase,
  RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
  RequestTenantEcommerceOrderToGrowthConversationBridgeUseCase,
  RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
  RequestTenantEcommerceProductWorkspaceReadinessPacketUseCase,
  RequestTenantEcommerceLaunchPlanActivationReadinessUseCase,
  RecordTenantEcommerceOrderOperationalEventUseCase,
  SaveTenantEcommerceProductAuthoringDraftUseCase,
  SaveTenantEcommerceProductEntityChannelDraftUseCase,
  SaveTenantEcommerceOrderDraftUseCase,
  UpdateTenantEcommerceProductEntityChannelAssetEntityEditableSnapshotUseCase,
  UpdateTenantEcommerceSavedProductEntityChannelDraftEditableSnapshotUseCase,
  UpdateTenantEcommerceProductSetupEditableSnapshotUseCase,
  UpdateTenantEcommerceProductWorkspaceEditableSnapshotUseCase,
  UpdateTenantEcommerceOrderCustomerProfileUseCase,
  GetTenantEcommerceOrderReturnsRefundsCancellationWorkspaceUseCase,
} from '@saas-platform/ecommerce-application';
import { FEATURE_FLAG_REPOSITORY } from '@saas-platform/feature-flags-application';
import {
  CatalogPersistenceModule,
  CommercialPersistenceModule,
  EcommercePersistenceModule,
  FeatureFlagsPersistenceModule,
  TenancyPersistenceModule,
} from '@saas-platform/infra-prisma';
import {
  GetTenantBySlugUseCase,
  TENANT_REPOSITORY,
  ResolveTenantAccessUseCase,
  TENANT_ACCESS_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { AuthModule } from '../auth/auth.module';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { EcommerceController } from './ecommerce.controller';

@Module({
  imports: [
    AuthModule,
    CatalogPersistenceModule,
    CommercialPersistenceModule,
    EcommercePersistenceModule,
    FeatureFlagsPersistenceModule,
    TenancyPersistenceModule,
  ],
  controllers: [EcommerceController],
  providers: [
    {
      provide: ListTenantEnabledProductsUseCase,
      inject: [
        TENANT_REPOSITORY,
        ENTITLEMENT_REPOSITORY,
        PRODUCT_REPOSITORY,
        FEATURE_FLAG_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        entitlementRepository,
        productRepository,
        featureFlagRepository,
      ) =>
        new ListTenantEnabledProductsUseCase(
          tenantRepository,
          entitlementRepository,
          productRepository,
          featureFlagRepository,
        ),
    },
    {
      provide: ListProductModulesUseCase,
      inject: [PRODUCT_REPOSITORY, PLATFORM_MODULE_REPOSITORY],
      useFactory: (productRepository, platformModuleRepository) =>
        new ListProductModulesUseCase(
          productRepository,
          platformModuleRepository,
        ),
    },
    {
      provide: GetTenantEcommerceLaunchWorkspaceUseCase,
      inject: [ListTenantEnabledProductsUseCase, ListProductModulesUseCase],
      useFactory: (
        listTenantEnabledProductsUseCase,
        listProductModulesUseCase,
      ) =>
        new GetTenantEcommerceLaunchWorkspaceUseCase(
          listTenantEnabledProductsUseCase,
          listProductModulesUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceStoreSetupWorkspaceUseCase,
      inject: [
        GetTenantEcommerceLaunchWorkspaceUseCase,
        ListTenantEnabledProductsUseCase,
      ],
      useFactory: (
        getTenantEcommerceLaunchWorkspaceUseCase,
        listTenantEnabledProductsUseCase,
      ) =>
        new GetTenantEcommerceStoreSetupWorkspaceUseCase(
          getTenantEcommerceLaunchWorkspaceUseCase,
          listTenantEnabledProductsUseCase,
        ),
    },
    {
      provide: GetTenantBySlugUseCase,
      inject: [TENANT_REPOSITORY],
      useFactory: (tenantRepository) =>
        new GetTenantBySlugUseCase(tenantRepository),
    },
    {
      provide: GetTenantEcommerceStoreProfileWorkspaceUseCase,
      inject: [
        GetTenantBySlugUseCase,
        GetTenantEcommerceStoreSetupWorkspaceUseCase,
      ],
      useFactory: (
        getTenantBySlugUseCase,
        getTenantEcommerceStoreSetupWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceStoreProfileWorkspaceUseCase(
          getTenantBySlugUseCase,
          getTenantEcommerceStoreSetupWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceProductAuthoringWorkspaceUseCase,
      inject: [GetTenantEcommerceStoreProfileWorkspaceUseCase],
      useFactory: (getTenantEcommerceStoreProfileWorkspaceUseCase) =>
        new GetTenantEcommerceProductAuthoringWorkspaceUseCase(
          getTenantEcommerceStoreProfileWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceProductAuthoringDraftDetailUseCase,
      inject: [
        GetTenantEcommerceProductAuthoringWorkspaceUseCase,
        ECOMMERCE_PRODUCT_DRAFT_REPOSITORY,
      ],
      useFactory: (
        getTenantEcommerceProductAuthoringWorkspaceUseCase,
        ecommerceProductDraftRepository,
      ) =>
        new GetTenantEcommerceProductAuthoringDraftDetailUseCase(
          getTenantEcommerceProductAuthoringWorkspaceUseCase,
          ecommerceProductDraftRepository,
        ),
    },
    {
      provide: RequestTenantEcommerceProductAuthoringDraftBriefUseCase,
      inject: [GetTenantEcommerceProductAuthoringDraftDetailUseCase],
      useFactory: (getTenantEcommerceProductAuthoringDraftDetailUseCase) =>
        new RequestTenantEcommerceProductAuthoringDraftBriefUseCase(
          getTenantEcommerceProductAuthoringDraftDetailUseCase,
        ),
    },
    {
      provide:
        RequestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase,
      inject: [GetTenantEcommerceProductAuthoringDraftDetailUseCase],
      useFactory: (getTenantEcommerceProductAuthoringDraftDetailUseCase) =>
        new RequestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase(
          getTenantEcommerceProductAuthoringDraftDetailUseCase,
        ),
    },
    {
      provide: SaveTenantEcommerceProductAuthoringDraftUseCase,
      inject: [
        GetTenantBySlugUseCase,
        GetTenantEcommerceProductAuthoringDraftDetailUseCase,
        RequestTenantEcommerceProductAuthoringDraftBriefUseCase,
        RequestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase,
        ECOMMERCE_PRODUCT_DRAFT_REPOSITORY,
      ],
      useFactory: (
        getTenantBySlugUseCase,
        getTenantEcommerceProductAuthoringDraftDetailUseCase,
        requestTenantEcommerceProductAuthoringDraftBriefUseCase,
        requestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase,
        ecommerceProductDraftRepository,
      ) =>
        new SaveTenantEcommerceProductAuthoringDraftUseCase(
          getTenantBySlugUseCase,
          getTenantEcommerceProductAuthoringDraftDetailUseCase,
          requestTenantEcommerceProductAuthoringDraftBriefUseCase,
          requestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase,
          ecommerceProductDraftRepository,
        ),
    },
    {
      provide: ListTenantEcommerceSavedProductDraftsUseCase,
      inject: [ECOMMERCE_PRODUCT_DRAFT_REPOSITORY],
      useFactory: (ecommerceProductDraftRepository) =>
        new ListTenantEcommerceSavedProductDraftsUseCase(
          ecommerceProductDraftRepository,
        ),
    },
    {
      provide: PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase,
      inject: [ECOMMERCE_PRODUCT_DRAFT_REPOSITORY],
      useFactory: (ecommerceProductDraftRepository) =>
        new PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase(
          ecommerceProductDraftRepository,
        ),
    },
    {
      provide: GetTenantEcommerceProductWorkspaceDetailUseCase,
      inject: [
        ECOMMERCE_PRODUCT_DRAFT_REPOSITORY,
        PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase,
      ],
      useFactory: (
        ecommerceProductDraftRepository,
        promoteTenantEcommerceSavedDraftToProductWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceProductWorkspaceDetailUseCase(
          ecommerceProductDraftRepository,
          promoteTenantEcommerceSavedDraftToProductWorkspaceUseCase,
        ),
    },
    {
      provide: ListTenantEcommerceProductWorkspacesUseCase,
      inject: [
        ECOMMERCE_PRODUCT_DRAFT_REPOSITORY,
        PromoteTenantEcommerceSavedDraftToProductWorkspaceUseCase,
      ],
      useFactory: (
        ecommerceProductDraftRepository,
        promoteTenantEcommerceSavedDraftToProductWorkspaceUseCase,
      ) =>
        new ListTenantEcommerceProductWorkspacesUseCase(
          ecommerceProductDraftRepository,
          promoteTenantEcommerceSavedDraftToProductWorkspaceUseCase,
        ),
    },
    {
      provide: PromoteTenantEcommerceProductSetupToProductEntityUseCase,
      inject: [
        ECOMMERCE_PRODUCT_SETUP_REPOSITORY,
        ECOMMERCE_PRODUCT_ENTITY_REPOSITORY,
      ],
      useFactory: (
        ecommerceProductSetupRepository,
        ecommerceProductEntityRepository,
      ) =>
        new PromoteTenantEcommerceProductSetupToProductEntityUseCase(
          ecommerceProductSetupRepository,
          ecommerceProductEntityRepository,
        ),
    },
    {
      provide: ListTenantEcommerceProductEntitiesUseCase,
      inject: [ECOMMERCE_PRODUCT_ENTITY_REPOSITORY],
      useFactory: (ecommerceProductEntityRepository) =>
        new ListTenantEcommerceProductEntitiesUseCase(
          ecommerceProductEntityRepository,
        ),
    },
    {
      provide: GetTenantEcommerceProductEntityDetailUseCase,
      inject: [ECOMMERCE_PRODUCT_ENTITY_REPOSITORY],
      useFactory: (ecommerceProductEntityRepository) =>
        new GetTenantEcommerceProductEntityDetailUseCase(
          ecommerceProductEntityRepository,
        ),
    },
    {
      provide:
        RequestTenantEcommerceProductEntityCommercializationPacketUseCase,
      inject: [GetTenantEcommerceProductEntityDetailUseCase],
      useFactory: (getTenantEcommerceProductEntityDetailUseCase) =>
        new RequestTenantEcommerceProductEntityCommercializationPacketUseCase(
          getTenantEcommerceProductEntityDetailUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase,
      inject: [GetTenantEcommerceProductEntityDetailUseCase],
      useFactory: (getTenantEcommerceProductEntityDetailUseCase) =>
        new GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase(
          getTenantEcommerceProductEntityDetailUseCase,
        ),
    },
    {
      provide:
        GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase,
      inject: [GetTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase],
      useFactory: (
        getTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase(
          getTenantEcommerceProductEntityChannelAssetsWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceProductEntityChannelDraftDetailUseCase,
      inject: [
        GetTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase,
      ],
      useFactory: (
        getTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceProductEntityChannelDraftDetailUseCase(
          getTenantEcommerceProductEntityChannelAssetDraftsWorkspaceUseCase,
        ),
    },
    {
      provide:
        RequestTenantEcommerceProductEntityChannelDraftActionPacketUseCase,
      inject: [GetTenantEcommerceProductEntityChannelDraftDetailUseCase],
      useFactory: (getTenantEcommerceProductEntityChannelDraftDetailUseCase) =>
        new RequestTenantEcommerceProductEntityChannelDraftActionPacketUseCase(
          getTenantEcommerceProductEntityChannelDraftDetailUseCase,
        ),
    },
    {
      provide:
        RequestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase,
      inject: [GetTenantEcommerceProductEntityChannelDraftDetailUseCase],
      useFactory: (getTenantEcommerceProductEntityChannelDraftDetailUseCase) =>
        new RequestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase(
          getTenantEcommerceProductEntityChannelDraftDetailUseCase,
        ),
    },
    {
      provide:
        GetTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase,
      inject: [
        GetTenantEcommerceProductEntityChannelDraftDetailUseCase,
        RequestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase,
      ],
      useFactory: (
        getTenantEcommerceProductEntityChannelDraftDetailUseCase,
        requestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase,
      ) =>
        new GetTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase(
          getTenantEcommerceProductEntityChannelDraftDetailUseCase,
          requestTenantEcommerceProductEntityChannelDraftPublishReadinessPacketUseCase,
        ),
    },
    {
      provide: SaveTenantEcommerceProductEntityChannelDraftUseCase,
      inject: [
        GetTenantBySlugUseCase,
        GetTenantEcommerceProductEntityChannelDraftDetailUseCase,
        GetTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase,
        ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
      ],
      useFactory: (
        getTenantBySlugUseCase,
        getTenantEcommerceProductEntityChannelDraftDetailUseCase,
        getTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase,
        ecommerceProductEntityChannelDraftRepository,
      ) =>
        new SaveTenantEcommerceProductEntityChannelDraftUseCase(
          getTenantBySlugUseCase,
          getTenantEcommerceProductEntityChannelDraftDetailUseCase,
          getTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase,
          ecommerceProductEntityChannelDraftRepository,
        ),
    },
    {
      provide: ListTenantEcommerceSavedProductEntityChannelDraftsUseCase,
      inject: [
        ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
        GetTenantEcommerceProductEntityDetailUseCase,
      ],
      useFactory: (
        ecommerceProductEntityChannelDraftRepository,
        getTenantEcommerceProductEntityDetailUseCase,
      ) =>
        new ListTenantEcommerceSavedProductEntityChannelDraftsUseCase(
          ecommerceProductEntityChannelDraftRepository,
          getTenantEcommerceProductEntityDetailUseCase,
        ),
    },
    {
      provide:
        PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase,
      inject: [ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY],
      useFactory: (ecommerceProductEntityChannelDraftRepository) =>
        new PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase(
          ecommerceProductEntityChannelDraftRepository,
        ),
    },
    {
      provide:
        PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase,
      inject: [ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY],
      useFactory: (ecommerceProductEntityChannelDraftRepository) =>
        new PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase(
          ecommerceProductEntityChannelDraftRepository,
        ),
    },
    {
      provide: ListTenantEcommerceProductEntityChannelAssetWorkspacesUseCase,
      inject: [
        ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
        GetTenantEcommerceProductEntityDetailUseCase,
        PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase,
      ],
      useFactory: (
        ecommerceProductEntityChannelDraftRepository,
        getTenantEcommerceProductEntityDetailUseCase,
        promoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase,
      ) =>
        new ListTenantEcommerceProductEntityChannelAssetWorkspacesUseCase(
          ecommerceProductEntityChannelDraftRepository,
          getTenantEcommerceProductEntityDetailUseCase,
          promoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase,
        ),
    },
    {
      provide: ListTenantEcommerceProductEntityChannelAssetEntitiesUseCase,
      inject: [
        ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
        GetTenantEcommerceProductEntityDetailUseCase,
        PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase,
      ],
      useFactory: (
        ecommerceProductEntityChannelDraftRepository,
        getTenantEcommerceProductEntityDetailUseCase,
        promoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase,
      ) =>
        new ListTenantEcommerceProductEntityChannelAssetEntitiesUseCase(
          ecommerceProductEntityChannelDraftRepository,
          getTenantEcommerceProductEntityDetailUseCase,
          promoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase,
        ),
    },
    {
      provide:
        GetTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase,
      inject: [
        ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
        GetTenantEcommerceProductEntityDetailUseCase,
        PromoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase,
      ],
      useFactory: (
        ecommerceProductEntityChannelDraftRepository,
        getTenantEcommerceProductEntityDetailUseCase,
        promoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase(
          ecommerceProductEntityChannelDraftRepository,
          getTenantEcommerceProductEntityDetailUseCase,
          promoteTenantEcommerceSavedProductEntityChannelDraftToChannelAssetWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
      inject: [
        ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
        GetTenantEcommerceProductEntityDetailUseCase,
        PromoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase,
      ],
      useFactory: (
        ecommerceProductEntityChannelDraftRepository,
        getTenantEcommerceProductEntityDetailUseCase,
        promoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase,
      ) =>
        new GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase(
          ecommerceProductEntityChannelDraftRepository,
          getTenantEcommerceProductEntityDetailUseCase,
          promoteTenantEcommerceProductEntityChannelAssetWorkspaceToChannelAssetEntityUseCase,
        ),
    },
    {
      provide:
        UpdateTenantEcommerceProductEntityChannelAssetEntityEditableSnapshotUseCase,
      inject: [
        ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
        GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
      ],
      useFactory: (
        ecommerceProductEntityChannelDraftRepository,
        getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
      ) =>
        new UpdateTenantEcommerceProductEntityChannelAssetEntityEditableSnapshotUseCase(
          ecommerceProductEntityChannelDraftRepository,
          getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
        ),
    },
    {
      provide:
        RequestTenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketUseCase,
      inject: [GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase],
      useFactory: (
        getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
      ) =>
        new RequestTenantEcommerceProductEntityChannelAssetEntityPublishPreparationPacketUseCase(
          getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
        ),
    },
    {
      provide:
        PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase,
      inject: [ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY],
      useFactory: (ecommerceProductEntityChannelDraftRepository) =>
        new PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase(
          ecommerceProductEntityChannelDraftRepository,
        ),
    },
    {
      provide: ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase,
      inject: [
        ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
        GetTenantEcommerceProductEntityDetailUseCase,
        PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase,
      ],
      useFactory: (
        ecommerceProductEntityChannelDraftRepository,
        getTenantEcommerceProductEntityDetailUseCase,
        promoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase,
      ) =>
        new ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase(
          ecommerceProductEntityChannelDraftRepository,
          getTenantEcommerceProductEntityDetailUseCase,
          promoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase,
        ),
    },
    {
      provide:
        GetTenantEcommerceProductEntityChannelReleaseCandidateDetailUseCase,
      inject: [
        ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
        GetTenantEcommerceProductEntityDetailUseCase,
        PromoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase,
      ],
      useFactory: (
        ecommerceProductEntityChannelDraftRepository,
        getTenantEcommerceProductEntityDetailUseCase,
        promoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase,
      ) =>
        new GetTenantEcommerceProductEntityChannelReleaseCandidateDetailUseCase(
          ecommerceProductEntityChannelDraftRepository,
          getTenantEcommerceProductEntityDetailUseCase,
          promoteTenantEcommerceProductEntityChannelAssetEntityToReleaseCandidateUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceLandingAssetEntityWorkspaceUseCase,
      inject: [GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase],
      useFactory: (
        getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
      ) =>
        new GetTenantEcommerceLandingAssetEntityWorkspaceUseCase(
          getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceCatalogAssetEntityWorkspaceUseCase,
      inject: [GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase],
      useFactory: (
        getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
      ) =>
        new GetTenantEcommerceCatalogAssetEntityWorkspaceUseCase(
          getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceCatalogCommercialCardUseCase,
      inject: [GetTenantEcommerceCatalogAssetEntityWorkspaceUseCase],
      useFactory: (getTenantEcommerceCatalogAssetEntityWorkspaceUseCase) =>
        new GetTenantEcommerceCatalogCommercialCardUseCase(
          getTenantEcommerceCatalogAssetEntityWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceCatalogListingAssetUseCase,
      inject: [
        GetTenantEcommerceCatalogCommercialCardUseCase,
        RequestTenantEcommerceChannelReleaseLaunchPacketUseCase,
      ],
      useFactory: (
        getTenantEcommerceCatalogCommercialCardUseCase,
        requestTenantEcommerceChannelReleaseLaunchPacketUseCase,
      ) =>
        new GetTenantEcommerceCatalogListingAssetUseCase(
          getTenantEcommerceCatalogCommercialCardUseCase,
          requestTenantEcommerceChannelReleaseLaunchPacketUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceStorefrontPreviewWorkspaceUseCase,
      inject: [
        GetTenantEcommerceLandingPageStructureUseCase,
        GetTenantEcommerceCatalogCommercialCardUseCase,
        GetTenantEcommerceChannelReleaseExecutionReadinessUseCase,
      ],
      useFactory: (
        getTenantEcommerceLandingPageStructureUseCase,
        getTenantEcommerceCatalogCommercialCardUseCase,
        getTenantEcommerceChannelReleaseExecutionReadinessUseCase,
      ) =>
        new GetTenantEcommerceStorefrontPreviewWorkspaceUseCase(
          getTenantEcommerceLandingPageStructureUseCase,
          getTenantEcommerceCatalogCommercialCardUseCase,
          getTenantEcommerceChannelReleaseExecutionReadinessUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceStorefrontPublishReviewWorkspaceUseCase,
      inject: [
        GetTenantEcommerceStorefrontPreviewWorkspaceUseCase,
        RequestTenantEcommerceChannelReleaseApprovalPacketUseCase,
      ],
      useFactory: (
        getTenantEcommerceStorefrontPreviewWorkspaceUseCase,
        requestTenantEcommerceChannelReleaseApprovalPacketUseCase,
      ) =>
        new GetTenantEcommerceStorefrontPublishReviewWorkspaceUseCase(
          getTenantEcommerceStorefrontPreviewWorkspaceUseCase,
          requestTenantEcommerceChannelReleaseApprovalPacketUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceStorefrontReleaseCandidateBriefUseCase,
      inject: [
        GetTenantEcommerceLandingPublishArtifactUseCase,
        GetTenantEcommerceCatalogListingAssetUseCase,
        GetTenantEcommerceChannelReleaseWorkbenchUseCase,
      ],
      useFactory: (
        getTenantEcommerceLandingPublishArtifactUseCase,
        getTenantEcommerceCatalogListingAssetUseCase,
        getTenantEcommerceChannelReleaseWorkbenchUseCase,
      ) =>
        new GetTenantEcommerceStorefrontReleaseCandidateBriefUseCase(
          getTenantEcommerceLandingPublishArtifactUseCase,
          getTenantEcommerceCatalogListingAssetUseCase,
          getTenantEcommerceChannelReleaseWorkbenchUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceStorefrontReleaseControlWorkspaceUseCase,
      inject: [
        GetTenantEcommerceStorefrontReleaseCandidateBriefUseCase,
        GetTenantEcommerceStorefrontPublishReviewWorkspaceUseCase,
        RequestTenantEcommerceChannelReleaseLaunchPacketUseCase,
      ],
      useFactory: (
        getTenantEcommerceStorefrontReleaseCandidateBriefUseCase,
        getTenantEcommerceStorefrontPublishReviewWorkspaceUseCase,
        requestTenantEcommerceChannelReleaseLaunchPacketUseCase,
      ) =>
        new GetTenantEcommerceStorefrontReleaseControlWorkspaceUseCase(
          getTenantEcommerceStorefrontReleaseCandidateBriefUseCase,
          getTenantEcommerceStorefrontPublishReviewWorkspaceUseCase,
          requestTenantEcommerceChannelReleaseLaunchPacketUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceLiveStorefrontSessionWorkspaceUseCase,
      inject: [
        GetTenantEcommerceStorefrontGoLiveManifestUseCase,
        GetTenantEcommerceLandingPublishArtifactUseCase,
        GetTenantEcommerceCatalogListingAssetUseCase,
        RequestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase,
      ],
      useFactory: (
        getTenantEcommerceStorefrontGoLiveManifestUseCase,
        getTenantEcommerceLandingPublishArtifactUseCase,
        getTenantEcommerceCatalogListingAssetUseCase,
        requestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase,
      ) =>
        new GetTenantEcommerceLiveStorefrontSessionWorkspaceUseCase(
          getTenantEcommerceStorefrontGoLiveManifestUseCase,
          getTenantEcommerceLandingPublishArtifactUseCase,
          getTenantEcommerceCatalogListingAssetUseCase,
          requestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
      inject: [
        GetTenantEcommerceStoreProfileWorkspaceUseCase,
        GetTenantEcommerceLandingPublishArtifactUseCase,
        GetTenantEcommerceCatalogCommercialCardUseCase,
        RequestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase,
      ],
      useFactory: (
        getTenantEcommerceStoreProfileWorkspaceUseCase,
        getTenantEcommerceLandingPublishArtifactUseCase,
        getTenantEcommerceCatalogCommercialCardUseCase,
        requestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase,
      ) =>
        new GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase(
          getTenantEcommerceStoreProfileWorkspaceUseCase,
          getTenantEcommerceLandingPublishArtifactUseCase,
          getTenantEcommerceCatalogCommercialCardUseCase,
          requestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceLandingPublishArtifactUseCase,
      inject: [
        GetTenantEcommerceLandingPageStructureUseCase,
        GetTenantEcommerceStorefrontPublishReviewWorkspaceUseCase,
      ],
      useFactory: (
        getTenantEcommerceLandingPageStructureUseCase,
        getTenantEcommerceStorefrontPublishReviewWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceLandingPublishArtifactUseCase(
          getTenantEcommerceLandingPageStructureUseCase,
          getTenantEcommerceStorefrontPublishReviewWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase,
      inject: [GetTenantEcommerceProductEntityChannelAssetEntityDetailUseCase],
      useFactory: (
        getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
      ) =>
        new GetTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase(
          getTenantEcommerceProductEntityChannelAssetEntityDetailUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceChannelReleaseWorkbenchUseCase,
      inject: [
        GetTenantEcommerceProductEntityDetailUseCase,
        ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase,
      ],
      useFactory: (
        getTenantEcommerceProductEntityDetailUseCase,
        listTenantEcommerceProductEntityChannelReleaseCandidatesUseCase,
      ) =>
        new GetTenantEcommerceChannelReleaseWorkbenchUseCase(
          getTenantEcommerceProductEntityDetailUseCase,
          listTenantEcommerceProductEntityChannelReleaseCandidatesUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceChannelReleaseExecutionReadinessUseCase,
      inject: [
        GetTenantEcommerceProductEntityDetailUseCase,
        ListTenantEcommerceProductEntityChannelReleaseCandidatesUseCase,
      ],
      useFactory: (
        getTenantEcommerceProductEntityDetailUseCase,
        listTenantEcommerceProductEntityChannelReleaseCandidatesUseCase,
      ) =>
        new GetTenantEcommerceChannelReleaseExecutionReadinessUseCase(
          getTenantEcommerceProductEntityDetailUseCase,
          listTenantEcommerceProductEntityChannelReleaseCandidatesUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceChannelReleaseHandoffPacketUseCase,
      inject: [
        GetTenantEcommerceChannelReleaseExecutionReadinessUseCase,
        GetTenantEcommerceChannelReleaseWorkbenchUseCase,
      ],
      useFactory: (
        getTenantEcommerceChannelReleaseExecutionReadinessUseCase,
        getTenantEcommerceChannelReleaseWorkbenchUseCase,
      ) =>
        new RequestTenantEcommerceChannelReleaseHandoffPacketUseCase(
          getTenantEcommerceChannelReleaseExecutionReadinessUseCase,
          getTenantEcommerceChannelReleaseWorkbenchUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceChannelReleaseApprovalPacketUseCase,
      inject: [
        GetTenantEcommerceChannelReleaseExecutionReadinessUseCase,
        RequestTenantEcommerceChannelReleaseHandoffPacketUseCase,
      ],
      useFactory: (
        getTenantEcommerceChannelReleaseExecutionReadinessUseCase,
        requestTenantEcommerceChannelReleaseHandoffPacketUseCase,
      ) =>
        new RequestTenantEcommerceChannelReleaseApprovalPacketUseCase(
          getTenantEcommerceChannelReleaseExecutionReadinessUseCase,
          requestTenantEcommerceChannelReleaseHandoffPacketUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceChannelReleaseLaunchPacketUseCase,
      inject: [
        GetTenantEcommerceChannelReleaseExecutionReadinessUseCase,
        RequestTenantEcommerceChannelReleaseApprovalPacketUseCase,
      ],
      useFactory: (
        getTenantEcommerceChannelReleaseExecutionReadinessUseCase,
        requestTenantEcommerceChannelReleaseApprovalPacketUseCase,
      ) =>
        new RequestTenantEcommerceChannelReleaseLaunchPacketUseCase(
          getTenantEcommerceChannelReleaseExecutionReadinessUseCase,
          requestTenantEcommerceChannelReleaseApprovalPacketUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceCatalogStorefrontPlacementPacketUseCase,
      inject: [
        GetTenantEcommerceCatalogListingAssetUseCase,
        GetTenantEcommerceStorefrontPreviewWorkspaceUseCase,
        RequestTenantEcommerceChannelReleaseApprovalPacketUseCase,
      ],
      useFactory: (
        getTenantEcommerceCatalogListingAssetUseCase,
        getTenantEcommerceStorefrontPreviewWorkspaceUseCase,
        requestTenantEcommerceChannelReleaseApprovalPacketUseCase,
      ) =>
        new RequestTenantEcommerceCatalogStorefrontPlacementPacketUseCase(
          getTenantEcommerceCatalogListingAssetUseCase,
          getTenantEcommerceStorefrontPreviewWorkspaceUseCase,
          requestTenantEcommerceChannelReleaseApprovalPacketUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceCatalogMerchandisingPacketUseCase,
      inject: [
        GetTenantEcommerceCatalogCommercialCardUseCase,
        RequestTenantEcommerceCatalogStorefrontPlacementPacketUseCase,
        RequestTenantEcommerceChannelReleaseLaunchPacketUseCase,
      ],
      useFactory: (
        getTenantEcommerceCatalogCommercialCardUseCase,
        requestTenantEcommerceCatalogStorefrontPlacementPacketUseCase,
        requestTenantEcommerceChannelReleaseLaunchPacketUseCase,
      ) =>
        new RequestTenantEcommerceCatalogMerchandisingPacketUseCase(
          getTenantEcommerceCatalogCommercialCardUseCase,
          requestTenantEcommerceCatalogStorefrontPlacementPacketUseCase,
          requestTenantEcommerceChannelReleaseLaunchPacketUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceLandingPageStructureUseCase,
      inject: [GetTenantEcommerceLandingAssetEntityWorkspaceUseCase],
      useFactory: (getTenantEcommerceLandingAssetEntityWorkspaceUseCase) =>
        new GetTenantEcommerceLandingPageStructureUseCase(
          getTenantEcommerceLandingAssetEntityWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceWhatsappSalesFlowUseCase,
      inject: [GetTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase],
      useFactory: (getTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase) =>
        new GetTenantEcommerceWhatsappSalesFlowUseCase(
          getTenantEcommerceWhatsappChannelSequenceWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceWhatsappGrowthHandoffUseCase,
      inject: [GetTenantEcommerceWhatsappSalesFlowUseCase],
      useFactory: (getTenantEcommerceWhatsappSalesFlowUseCase) =>
        new RequestTenantEcommerceWhatsappGrowthHandoffUseCase(
          getTenantEcommerceWhatsappSalesFlowUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase,
      inject: [RequestTenantEcommerceWhatsappGrowthHandoffUseCase],
      useFactory: (requestTenantEcommerceWhatsappGrowthHandoffUseCase) =>
        new GetTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase(
          requestTenantEcommerceWhatsappGrowthHandoffUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceWhatsappGrowthActivationPacketUseCase,
      inject: [GetTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase],
      useFactory: (
        getTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase,
      ) =>
        new RequestTenantEcommerceWhatsappGrowthActivationPacketUseCase(
          getTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase,
      inject: [
        RequestTenantEcommerceWhatsappGrowthHandoffUseCase,
        RequestTenantEcommerceWhatsappGrowthActivationPacketUseCase,
      ],
      useFactory: (
        requestTenantEcommerceWhatsappGrowthHandoffUseCase,
        requestTenantEcommerceWhatsappGrowthActivationPacketUseCase,
      ) =>
        new RequestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase(
          requestTenantEcommerceWhatsappGrowthHandoffUseCase,
          requestTenantEcommerceWhatsappGrowthActivationPacketUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase,
      inject: [
        RequestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase,
        RequestTenantEcommerceChannelReleaseLaunchPacketUseCase,
      ],
      useFactory: (
        requestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase,
        requestTenantEcommerceChannelReleaseLaunchPacketUseCase,
      ) =>
        new RequestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase(
          requestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase,
          requestTenantEcommerceChannelReleaseLaunchPacketUseCase,
        ),
    },
    {
      provide:
        RequestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase,
      inject: [
        GetTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase,
        RequestTenantEcommerceWhatsappGrowthActivationPacketUseCase,
        RequestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase,
      ],
      useFactory: (
        getTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase,
        requestTenantEcommerceWhatsappGrowthActivationPacketUseCase,
        requestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase,
      ) =>
        new RequestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase(
          getTenantEcommerceWhatsappGrowthActivationWorkspaceUseCase,
          requestTenantEcommerceWhatsappGrowthActivationPacketUseCase,
          requestTenantEcommerceWhatsappGrowthOperatorLaunchPacketUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceCheckoutCustomerCapturePacketUseCase,
      inject: [
        GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
        GetTenantEcommerceLiveStorefrontSessionWorkspaceUseCase,
        RequestTenantEcommerceOrderInvoicingBridgeUseCase,
      ],
      useFactory: (
        getTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
        getTenantEcommerceLiveStorefrontSessionWorkspaceUseCase,
        requestTenantEcommerceOrderInvoicingBridgeUseCase,
      ) =>
        new RequestTenantEcommerceCheckoutCustomerCapturePacketUseCase(
          getTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
          getTenantEcommerceLiveStorefrontSessionWorkspaceUseCase,
          requestTenantEcommerceOrderInvoicingBridgeUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceOrderInvoicingBridgeUseCase,
      inject: [
        GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
        GetTenantEcommerceStoreProfileWorkspaceUseCase,
      ],
      useFactory: (
        getTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
        getTenantEcommerceStoreProfileWorkspaceUseCase,
      ) =>
        new RequestTenantEcommerceOrderInvoicingBridgeUseCase(
          getTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
          getTenantEcommerceStoreProfileWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
      inject: [
        RequestTenantEcommerceCheckoutCustomerCapturePacketUseCase,
        RequestTenantEcommerceOrderInvoicingBridgeUseCase,
      ],
      useFactory: (
        requestTenantEcommerceCheckoutCustomerCapturePacketUseCase,
        requestTenantEcommerceOrderInvoicingBridgeUseCase,
      ) =>
        new RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase(
          requestTenantEcommerceCheckoutCustomerCapturePacketUseCase,
          requestTenantEcommerceOrderInvoicingBridgeUseCase,
        ),
    },
    {
      provide: SaveTenantEcommerceOrderDraftUseCase,
      inject: [
        GetTenantBySlugUseCase,
        RequestTenantEcommerceCheckoutCustomerCapturePacketUseCase,
        RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
        ECOMMERCE_ORDER_DRAFT_REPOSITORY,
      ],
      useFactory: (
        getTenantBySlugUseCase,
        requestTenantEcommerceCheckoutCustomerCapturePacketUseCase,
        requestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
        ecommerceOrderDraftRepository,
      ) =>
        new SaveTenantEcommerceOrderDraftUseCase(
          getTenantBySlugUseCase,
          requestTenantEcommerceCheckoutCustomerCapturePacketUseCase,
          requestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
          ecommerceOrderDraftRepository,
        ),
    },
    {
      provide: UpdateTenantEcommerceOrderCustomerProfileUseCase,
      inject: [ECOMMERCE_ORDER_DRAFT_REPOSITORY],
      useFactory: (ecommerceOrderDraftRepository) =>
        new UpdateTenantEcommerceOrderCustomerProfileUseCase(
          ecommerceOrderDraftRepository,
        ),
    },
    {
      provide: ListTenantEcommerceOrderDraftsUseCase,
      inject: [
        ECOMMERCE_ORDER_DRAFT_REPOSITORY,
        GetTenantEcommerceProductEntityDetailUseCase,
      ],
      useFactory: (
        ecommerceOrderDraftRepository,
        getTenantEcommerceProductEntityDetailUseCase,
      ) =>
        new ListTenantEcommerceOrderDraftsUseCase(
          ecommerceOrderDraftRepository,
          getTenantEcommerceProductEntityDetailUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderDraftDetailUseCase,
      inject: [
        ECOMMERCE_ORDER_DRAFT_REPOSITORY,
        GetTenantEcommerceProductEntityDetailUseCase,
      ],
      useFactory: (
        ecommerceOrderDraftRepository,
        getTenantEcommerceProductEntityDetailUseCase,
      ) =>
        new GetTenantEcommerceOrderDraftDetailUseCase(
          ecommerceOrderDraftRepository,
          getTenantEcommerceProductEntityDetailUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceCheckoutCloseoutPacketUseCase,
      inject: [
        GetTenantEcommerceOrderDraftDetailUseCase,
        RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderDraftDetailUseCase,
        requestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
      ) =>
        new RequestTenantEcommerceCheckoutCloseoutPacketUseCase(
          getTenantEcommerceOrderDraftDetailUseCase,
          requestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceOrderToGrowthConversationBridgeUseCase,
      inject: [
        GetTenantEcommerceOrderDraftDetailUseCase,
        RequestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderDraftDetailUseCase,
        requestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase,
      ) =>
        new RequestTenantEcommerceOrderToGrowthConversationBridgeUseCase(
          getTenantEcommerceOrderDraftDetailUseCase,
          requestTenantEcommerceWhatsappGrowthExecutionBridgeUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderReviewWorkspaceUseCase,
      inject: [
        GetTenantEcommerceOrderDraftDetailUseCase,
        RequestTenantEcommerceCheckoutCloseoutPacketUseCase,
        RequestTenantEcommerceOrderToGrowthConversationBridgeUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderDraftDetailUseCase,
        requestTenantEcommerceCheckoutCloseoutPacketUseCase,
        requestTenantEcommerceOrderToGrowthConversationBridgeUseCase,
      ) =>
        new GetTenantEcommerceOrderReviewWorkspaceUseCase(
          getTenantEcommerceOrderDraftDetailUseCase,
          requestTenantEcommerceCheckoutCloseoutPacketUseCase,
          requestTenantEcommerceOrderToGrowthConversationBridgeUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
      inject: [
        GetTenantEcommerceOrderDraftDetailUseCase,
        RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderDraftDetailUseCase,
        requestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
      ) =>
        new RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase(
          getTenantEcommerceOrderDraftDetailUseCase,
          requestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
      inject: [
        GetTenantEcommerceOrderDraftDetailUseCase,
        RequestTenantEcommerceOrderToGrowthConversationBridgeUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderDraftDetailUseCase,
        requestTenantEcommerceOrderToGrowthConversationBridgeUseCase,
      ) =>
        new GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase(
          getTenantEcommerceOrderDraftDetailUseCase,
          requestTenantEcommerceOrderToGrowthConversationBridgeUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
      inject: [
        GetTenantEcommerceOrderDraftDetailUseCase,
        RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderDraftDetailUseCase,
        requestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
      ) =>
        new GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase(
          getTenantEcommerceOrderDraftDetailUseCase,
          requestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceOrderApprovalDecisionUseCase,
      inject: [
        GetTenantEcommerceOrderReviewWorkspaceUseCase,
        RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
        GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderReviewWorkspaceUseCase,
        requestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
        getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
      ) =>
        new RequestTenantEcommerceOrderApprovalDecisionUseCase(
          getTenantEcommerceOrderReviewWorkspaceUseCase,
          requestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
          getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceOrderHandoffDecisionUseCase,
      inject: [
        RequestTenantEcommerceOrderApprovalDecisionUseCase,
        GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
        GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
        RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
      ],
      useFactory: (
        requestTenantEcommerceOrderApprovalDecisionUseCase,
        getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
        getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
        requestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
      ) =>
        new RequestTenantEcommerceOrderHandoffDecisionUseCase(
          requestTenantEcommerceOrderApprovalDecisionUseCase,
          getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
          getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
          requestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase,
      inject: [
        GetTenantEcommerceOrderDraftDetailUseCase,
        GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
        RequestTenantEcommerceOrderHandoffDecisionUseCase,
        RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderDraftDetailUseCase,
        getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
        requestTenantEcommerceOrderHandoffDecisionUseCase,
        requestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
      ) =>
        new GetTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase(
          getTenantEcommerceOrderDraftDetailUseCase,
          getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
          requestTenantEcommerceOrderHandoffDecisionUseCase,
          requestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
      inject: [
        RequestTenantEcommerceOrderHandoffDecisionUseCase,
        GetTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase,
        GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
      ],
      useFactory: (
        requestTenantEcommerceOrderHandoffDecisionUseCase,
        getTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase,
        getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase(
          requestTenantEcommerceOrderHandoffDecisionUseCase,
          getTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase,
          getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderHoldResolutionWorkspaceUseCase,
      inject: [
        RequestTenantEcommerceOrderHandoffDecisionUseCase,
        GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
        GetTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
      ],
      useFactory: (
        requestTenantEcommerceOrderHandoffDecisionUseCase,
        getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
        getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceOrderHoldResolutionWorkspaceUseCase(
          requestTenantEcommerceOrderHandoffDecisionUseCase,
          getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
          getTenantEcommerceOrderGrowthFollowUpWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceInvoiceDraftOpenBridgeUseCase,
      inject: [
        GetTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase,
        GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
      ],
      useFactory: (
        getTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase,
        getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
      ) =>
        new RequestTenantEcommerceInvoiceDraftOpenBridgeUseCase(
          getTenantEcommerceInvoiceDraftIntakeWorkspaceUseCase,
          getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceInvoiceDraftLaunchBridgeUseCase,
      inject: [
        RequestTenantEcommerceInvoiceDraftOpenBridgeUseCase,
        GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
      ],
      useFactory: (
        requestTenantEcommerceInvoiceDraftOpenBridgeUseCase,
        getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
      ) =>
        new RequestTenantEcommerceInvoiceDraftLaunchBridgeUseCase(
          requestTenantEcommerceInvoiceDraftOpenBridgeUseCase,
          getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceOrderRouteResolutionPacketUseCase,
      inject: [
        GetTenantEcommerceOrderHoldResolutionWorkspaceUseCase,
        GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderHoldResolutionWorkspaceUseCase,
        getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
      ) =>
        new RequestTenantEcommerceOrderRouteResolutionPacketUseCase(
          getTenantEcommerceOrderHoldResolutionWorkspaceUseCase,
          getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceInvoiceDraftHandoffWorkspaceUseCase,
      inject: [
        RequestTenantEcommerceInvoiceDraftLaunchBridgeUseCase,
        RequestTenantEcommerceOrderRouteResolutionPacketUseCase,
      ],
      useFactory: (
        requestTenantEcommerceInvoiceDraftLaunchBridgeUseCase,
        requestTenantEcommerceOrderRouteResolutionPacketUseCase,
      ) =>
        new GetTenantEcommerceInvoiceDraftHandoffWorkspaceUseCase(
          requestTenantEcommerceInvoiceDraftLaunchBridgeUseCase,
          requestTenantEcommerceOrderRouteResolutionPacketUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceInvoiceHandoffAcknowledgementUseCase,
      inject: [GetTenantEcommerceInvoiceDraftHandoffWorkspaceUseCase],
      useFactory: (getTenantEcommerceInvoiceDraftHandoffWorkspaceUseCase) =>
        new RequestTenantEcommerceInvoiceHandoffAcknowledgementUseCase(
          getTenantEcommerceInvoiceDraftHandoffWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase,
      inject: [GetTenantEcommerceOrderDraftDetailUseCase],
      useFactory: (getTenantEcommerceOrderDraftDetailUseCase) =>
        new GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase(
          getTenantEcommerceOrderDraftDetailUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
      inject: [GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase],
      useFactory: (getTenantEcommerceOrderPaymentReadinessWorkspaceUseCase) =>
        new GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase(
          getTenantEcommerceOrderPaymentReadinessWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
      inject: [
        GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
        GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
        GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
        getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
        getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ) =>
        new RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase(
          getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
          getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
          getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
      inject: [
        RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
        GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
        GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ],
      useFactory: (
        requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
        getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
        getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ) =>
        new GetTenantEcommerceOrderPaymentConfirmationLogUseCase(
          requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
          getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
          getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderPaymentReconciliationWorkspaceUseCase,
      inject: [GetTenantEcommerceOrderPaymentConfirmationLogUseCase],
      useFactory: (getTenantEcommerceOrderPaymentConfirmationLogUseCase) =>
        new GetTenantEcommerceOrderPaymentReconciliationWorkspaceUseCase(
          getTenantEcommerceOrderPaymentConfirmationLogUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderPaymentDisputeWorkspaceUseCase,
      inject: [
        GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
        RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
        GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderPaymentConfirmationLogUseCase,
        requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
        getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ) =>
        new GetTenantEcommerceOrderPaymentDisputeWorkspaceUseCase(
          getTenantEcommerceOrderPaymentConfirmationLogUseCase,
          requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
          getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceOrderPaymentDisputeResolutionPacketUseCase,
      inject: [
        GetTenantEcommerceOrderPaymentDisputeWorkspaceUseCase,
        GetTenantEcommerceOrderHoldResolutionWorkspaceUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderPaymentDisputeWorkspaceUseCase,
        getTenantEcommerceOrderHoldResolutionWorkspaceUseCase,
      ) =>
        new RequestTenantEcommerceOrderPaymentDisputeResolutionPacketUseCase(
          getTenantEcommerceOrderPaymentDisputeWorkspaceUseCase,
          getTenantEcommerceOrderHoldResolutionWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderStatusLifecycleDetailUseCase,
      inject: [
        GetTenantEcommerceOrderDraftDetailUseCase,
        GetTenantEcommerceOrderReviewWorkspaceUseCase,
        RequestTenantEcommerceOrderApprovalDecisionUseCase,
        RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderDraftDetailUseCase,
        getTenantEcommerceOrderReviewWorkspaceUseCase,
        requestTenantEcommerceOrderApprovalDecisionUseCase,
        requestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
      ) =>
        new GetTenantEcommerceOrderStatusLifecycleDetailUseCase(
          getTenantEcommerceOrderDraftDetailUseCase,
          getTenantEcommerceOrderReviewWorkspaceUseCase,
          requestTenantEcommerceOrderApprovalDecisionUseCase,
          requestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
        ),
    },
    {
      provide: ListTenantEcommerceOrderStatusLifecyclesUseCase,
      inject: [
        ListTenantEcommerceOrderDraftsUseCase,
        GetTenantEcommerceOrderStatusLifecycleDetailUseCase,
      ],
      useFactory: (
        listTenantEcommerceOrderDraftsUseCase,
        getTenantEcommerceOrderStatusLifecycleDetailUseCase,
      ) =>
        new ListTenantEcommerceOrderStatusLifecyclesUseCase(
          listTenantEcommerceOrderDraftsUseCase,
          getTenantEcommerceOrderStatusLifecycleDetailUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      inject: [
        GetTenantEcommerceOrderDraftDetailUseCase,
        GetTenantEcommerceOrderPaymentReadinessWorkspaceUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderDraftDetailUseCase,
        getTenantEcommerceOrderPaymentReadinessWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase(
          getTenantEcommerceOrderDraftDetailUseCase,
          getTenantEcommerceOrderPaymentReadinessWorkspaceUseCase,
        ),
    },
    {
      provide: ListTenantEcommerceOrderPostSaleLifecyclesUseCase,
      inject: [
        ListTenantEcommerceOrderDraftsUseCase,
        GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ],
      useFactory: (
        listTenantEcommerceOrderDraftsUseCase,
        getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ) =>
        new ListTenantEcommerceOrderPostSaleLifecyclesUseCase(
          listTenantEcommerceOrderDraftsUseCase,
          getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
      inject: [
        GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
        GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
        getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ) =>
        new GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase(
          getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
          getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderFulfillmentAvailabilityWorkspaceUseCase,
      inject: [GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase],
      useFactory: (
        getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceOrderFulfillmentAvailabilityWorkspaceUseCase(
          getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderInventoryReservationWorkspaceUseCase,
      inject: [GetTenantEcommerceOrderFulfillmentAvailabilityWorkspaceUseCase],
      useFactory: (
        getTenantEcommerceOrderFulfillmentAvailabilityWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceOrderInventoryReservationWorkspaceUseCase(
          getTenantEcommerceOrderFulfillmentAvailabilityWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase,
      inject: [
        RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
        GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
        GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ],
      useFactory: (
        requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
        getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
        getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ) =>
        new GetTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase(
          requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
          getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
          getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
      inject: [
        GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
        GetTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase,
        GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderPaymentConfirmationLogUseCase,
        getTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase,
        getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ) =>
        new GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase(
          getTenantEcommerceOrderPaymentConfirmationLogUseCase,
          getTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase,
          getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceOrderFulfillmentCompletionPacketUseCase,
      inject: [
        GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
        GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
        GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
        getTenantEcommerceOrderPaymentConfirmationLogUseCase,
        getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
      ) =>
        new RequestTenantEcommerceOrderFulfillmentCompletionPacketUseCase(
          getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
          getTenantEcommerceOrderPaymentConfirmationLogUseCase,
          getTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
        ),
    },
    {
      provide:
        RequestTenantEcommerceOrderFulfillmentDeliveryConfirmationPacketUseCase,
      inject: [
        GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
        RequestTenantEcommerceOrderFulfillmentCompletionPacketUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
        requestTenantEcommerceOrderFulfillmentCompletionPacketUseCase,
      ) =>
        new RequestTenantEcommerceOrderFulfillmentDeliveryConfirmationPacketUseCase(
          getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
          requestTenantEcommerceOrderFulfillmentCompletionPacketUseCase,
        ),
    },
    {
      provide:
        GetTenantEcommerceOrderReturnsRefundsCancellationWorkspaceUseCase,
      inject: [
        GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
        GetTenantEcommerceOrderPaymentDisputeWorkspaceUseCase,
        GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderPaymentConfirmationLogUseCase,
        getTenantEcommerceOrderPaymentDisputeWorkspaceUseCase,
        getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceOrderReturnsRefundsCancellationWorkspaceUseCase(
          getTenantEcommerceOrderPaymentConfirmationLogUseCase,
          getTenantEcommerceOrderPaymentDisputeWorkspaceUseCase,
          getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderRevenueTrackingSummaryUseCase,
      inject: [
        ListTenantEcommerceOrderPostSaleLifecyclesUseCase,
        GetTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
        GetTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
      ],
      useFactory: (
        listTenantEcommerceOrderPostSaleLifecyclesUseCase,
        getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
        getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceOrderRevenueTrackingSummaryUseCase(
          listTenantEcommerceOrderPostSaleLifecyclesUseCase,
          getTenantEcommerceOrderPaymentConfirmationWorkspaceUseCase,
          getTenantEcommerceOrderFulfillmentReadinessWorkspaceUseCase,
        ),
    },
    {
      provide: RecordTenantEcommerceOrderOperationalEventUseCase,
      inject: [
        GetTenantBySlugUseCase,
        ECOMMERCE_ORDER_DRAFT_REPOSITORY,
        ECOMMERCE_ORDER_OPERATIONAL_EVENT_REPOSITORY,
      ],
      useFactory: (
        getTenantBySlugUseCase,
        ecommerceOrderDraftRepository,
        ecommerceOrderOperationalEventRepository,
      ) =>
        new RecordTenantEcommerceOrderOperationalEventUseCase(
          getTenantBySlugUseCase,
          ecommerceOrderDraftRepository,
          ecommerceOrderOperationalEventRepository,
        ),
    },
    {
      provide: ListTenantEcommerceOrderOperationalEventsUseCase,
      inject: [
        ECOMMERCE_ORDER_DRAFT_REPOSITORY,
        ECOMMERCE_ORDER_OPERATIONAL_EVENT_REPOSITORY,
      ],
      useFactory: (
        ecommerceOrderDraftRepository,
        ecommerceOrderOperationalEventRepository,
      ) =>
        new ListTenantEcommerceOrderOperationalEventsUseCase(
          ecommerceOrderDraftRepository,
          ecommerceOrderOperationalEventRepository,
        ),
    },
    {
      provide: GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase,
      inject: [ListTenantEcommerceOrderOperationalEventsUseCase],
      useFactory: (listTenantEcommerceOrderOperationalEventsUseCase) =>
        new GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase(
          listTenantEcommerceOrderOperationalEventsUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceOrderOperationalExceptionPacketUseCase,
      inject: [GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase],
      useFactory: (getTenantEcommerceOrderOperationalReviewWorkspaceUseCase) =>
        new RequestTenantEcommerceOrderOperationalExceptionPacketUseCase(
          getTenantEcommerceOrderOperationalReviewWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderOperationalHealthBoardUseCase,
      inject: [
        ListTenantEcommerceOrderDraftsUseCase,
        GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase,
      ],
      useFactory: (
        listTenantEcommerceOrderDraftsUseCase,
        getTenantEcommerceOrderOperationalReviewWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceOrderOperationalHealthBoardUseCase(
          listTenantEcommerceOrderDraftsUseCase,
          getTenantEcommerceOrderOperationalReviewWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceOrderInvoiceExecutionPacketUseCase,
      inject: [
        RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
        GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
        RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
        GetTenantEcommerceOrderOperationalReviewWorkspaceUseCase,
      ],
      useFactory: (
        requestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
        getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
        requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
        getTenantEcommerceOrderOperationalReviewWorkspaceUseCase,
      ) =>
        new RequestTenantEcommerceOrderInvoiceExecutionPacketUseCase(
          requestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
          getTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase,
          requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
          getTenantEcommerceOrderOperationalReviewWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceOrderInvoiceDraftCreationBridgeUseCase,
      inject: [RequestTenantEcommerceOrderInvoiceExecutionPacketUseCase],
      useFactory: (requestTenantEcommerceOrderInvoiceExecutionPacketUseCase) =>
        new RequestTenantEcommerceOrderInvoiceDraftCreationBridgeUseCase(
          requestTenantEcommerceOrderInvoiceExecutionPacketUseCase,
        ),
    },
    {
      provide: ResolveTenantEcommerceOrderOperationalExceptionUseCase,
      inject: [
        RequestTenantEcommerceOrderOperationalExceptionPacketUseCase,
        RecordTenantEcommerceOrderOperationalEventUseCase,
      ],
      useFactory: (
        requestTenantEcommerceOrderOperationalExceptionPacketUseCase,
        recordTenantEcommerceOrderOperationalEventUseCase,
      ) =>
        new ResolveTenantEcommerceOrderOperationalExceptionUseCase(
          requestTenantEcommerceOrderOperationalExceptionPacketUseCase,
          recordTenantEcommerceOrderOperationalEventUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceCompletionDashboardUseCase,
      inject: [
        GetTenantEcommerceStorefrontGoLiveManifestUseCase,
        ListTenantEcommerceOrderDraftsUseCase,
        GetTenantEcommerceOrderOperationalHealthBoardUseCase,
      ],
      useFactory: (
        getTenantEcommerceStorefrontGoLiveManifestUseCase,
        listTenantEcommerceOrderDraftsUseCase,
        getTenantEcommerceOrderOperationalHealthBoardUseCase,
      ) =>
        new GetTenantEcommerceCompletionDashboardUseCase(
          getTenantEcommerceStorefrontGoLiveManifestUseCase,
          listTenantEcommerceOrderDraftsUseCase,
          getTenantEcommerceOrderOperationalHealthBoardUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceLiveRunReadinessPacketUseCase,
      inject: [GetTenantEcommerceCompletionDashboardUseCase],
      useFactory: (getTenantEcommerceCompletionDashboardUseCase) =>
        new RequestTenantEcommerceLiveRunReadinessPacketUseCase(
          getTenantEcommerceCompletionDashboardUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderRevenueOpsBoardUseCase,
      inject: [
        GetTenantEcommerceOrderRevenueTrackingSummaryUseCase,
        RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
        GetTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderRevenueTrackingSummaryUseCase,
        requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
        getTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceOrderRevenueOpsBoardUseCase(
          getTenantEcommerceOrderRevenueTrackingSummaryUseCase,
          requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
          getTenantEcommerceOrderFulfillmentExecutionWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderPostSaleOpsBoardUseCase,
      inject: [
        ListTenantEcommerceOrderPostSaleLifecyclesUseCase,
        GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
        GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
      ],
      useFactory: (
        listTenantEcommerceOrderPostSaleLifecyclesUseCase,
        getTenantEcommerceOrderPaymentConfirmationLogUseCase,
        getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceOrderPostSaleOpsBoardUseCase(
          listTenantEcommerceOrderPostSaleLifecyclesUseCase,
          getTenantEcommerceOrderPaymentConfirmationLogUseCase,
          getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderPostSaleReportingBoardUseCase,
      inject: [
        ListTenantEcommerceOrderPostSaleLifecyclesUseCase,
        GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
        GetTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
      ],
      useFactory: (
        listTenantEcommerceOrderPostSaleLifecyclesUseCase,
        getTenantEcommerceOrderPaymentConfirmationLogUseCase,
        getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceOrderPostSaleReportingBoardUseCase(
          listTenantEcommerceOrderPostSaleLifecyclesUseCase,
          getTenantEcommerceOrderPaymentConfirmationLogUseCase,
          getTenantEcommerceOrderFulfillmentDeliveryWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderPostSaleReportingSummaryUseCase,
      inject: [
        GetTenantEcommerceOrderPostSaleReportingBoardUseCase,
        GetTenantEcommerceOrderRevenueTrackingSummaryUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderPostSaleReportingBoardUseCase,
        getTenantEcommerceOrderRevenueTrackingSummaryUseCase,
      ) =>
        new GetTenantEcommerceOrderPostSaleReportingSummaryUseCase(
          getTenantEcommerceOrderPostSaleReportingBoardUseCase,
          getTenantEcommerceOrderRevenueTrackingSummaryUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderOperatorWorkboardUseCase,
      inject: [
        ListTenantEcommerceOrderStatusLifecyclesUseCase,
        RequestTenantEcommerceOrderHandoffDecisionUseCase,
      ],
      useFactory: (
        listTenantEcommerceOrderStatusLifecyclesUseCase,
        requestTenantEcommerceOrderHandoffDecisionUseCase,
      ) =>
        new GetTenantEcommerceOrderOperatorWorkboardUseCase(
          listTenantEcommerceOrderStatusLifecyclesUseCase,
          requestTenantEcommerceOrderHandoffDecisionUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderOpsPriorityQueueUseCase,
      inject: [
        GetTenantEcommerceOrderOperatorWorkboardUseCase,
        GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderOperatorWorkboardUseCase,
        getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceOrderOpsPriorityQueueUseCase(
          getTenantEcommerceOrderOperatorWorkboardUseCase,
          getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderOpsAttentionWorkspaceUseCase,
      inject: [
        GetTenantEcommerceOrderOpsPriorityQueueUseCase,
        GetTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderOpsPriorityQueueUseCase,
        getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
      ) =>
        new GetTenantEcommerceOrderOpsAttentionWorkspaceUseCase(
          getTenantEcommerceOrderOpsPriorityQueueUseCase,
          getTenantEcommerceOrderHandoffExecutionWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceOrderOpsEscalationBoardUseCase,
      inject: [
        GetTenantEcommerceOrderOpsAttentionWorkspaceUseCase,
        GetTenantEcommerceOrderOpsPriorityQueueUseCase,
      ],
      useFactory: (
        getTenantEcommerceOrderOpsAttentionWorkspaceUseCase,
        getTenantEcommerceOrderOpsPriorityQueueUseCase,
      ) =>
        new GetTenantEcommerceOrderOpsEscalationBoardUseCase(
          getTenantEcommerceOrderOpsAttentionWorkspaceUseCase,
          getTenantEcommerceOrderOpsPriorityQueueUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceStorefrontGoLiveManifestUseCase,
      inject: [
        GetTenantEcommerceStorefrontReleaseControlWorkspaceUseCase,
        RequestTenantEcommerceCatalogMerchandisingPacketUseCase,
        RequestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase,
        GetTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
        RequestTenantEcommerceOrderInvoicingBridgeUseCase,
      ],
      useFactory: (
        getTenantEcommerceStorefrontReleaseControlWorkspaceUseCase,
        requestTenantEcommerceCatalogMerchandisingPacketUseCase,
        requestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase,
        getTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
        requestTenantEcommerceOrderInvoicingBridgeUseCase,
      ) =>
        new GetTenantEcommerceStorefrontGoLiveManifestUseCase(
          getTenantEcommerceStorefrontReleaseControlWorkspaceUseCase,
          requestTenantEcommerceCatalogMerchandisingPacketUseCase,
          requestTenantEcommerceWhatsappGrowthLaunchAcknowledgementPacketUseCase,
          getTenantEcommerceCheckoutOrderIntakeWorkspaceUseCase,
          requestTenantEcommerceOrderInvoicingBridgeUseCase,
        ),
    },
    {
      provide:
        RequestTenantEcommerceProductEntityChannelAssetPublishPacketUseCase,
      inject: [
        GetTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase,
      ],
      useFactory: (
        getTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase,
      ) =>
        new RequestTenantEcommerceProductEntityChannelAssetPublishPacketUseCase(
          getTenantEcommerceProductEntityChannelAssetWorkspaceDetailUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceSavedProductEntityChannelDraftDetailUseCase,
      inject: [
        ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
        GetTenantEcommerceProductEntityDetailUseCase,
      ],
      useFactory: (
        ecommerceProductEntityChannelDraftRepository,
        getTenantEcommerceProductEntityDetailUseCase,
      ) =>
        new GetTenantEcommerceSavedProductEntityChannelDraftDetailUseCase(
          ecommerceProductEntityChannelDraftRepository,
          getTenantEcommerceProductEntityDetailUseCase,
        ),
    },
    {
      provide:
        UpdateTenantEcommerceSavedProductEntityChannelDraftEditableSnapshotUseCase,
      inject: [
        ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
        GetTenantEcommerceSavedProductEntityChannelDraftDetailUseCase,
      ],
      useFactory: (
        ecommerceProductEntityChannelDraftRepository,
        getTenantEcommerceSavedProductEntityChannelDraftDetailUseCase,
      ) =>
        new UpdateTenantEcommerceSavedProductEntityChannelDraftEditableSnapshotUseCase(
          ecommerceProductEntityChannelDraftRepository,
          getTenantEcommerceSavedProductEntityChannelDraftDetailUseCase,
        ),
    },
    {
      provide: PromoteTenantEcommerceProductWorkspaceToProductSetupUseCase,
      inject: [
        ECOMMERCE_PRODUCT_DRAFT_REPOSITORY,
        ECOMMERCE_PRODUCT_SETUP_REPOSITORY,
      ],
      useFactory: (
        ecommerceProductDraftRepository,
        ecommerceProductSetupRepository,
      ) =>
        new PromoteTenantEcommerceProductWorkspaceToProductSetupUseCase(
          ecommerceProductDraftRepository,
          ecommerceProductSetupRepository,
        ),
    },
    {
      provide: ListTenantEcommerceProductSetupsUseCase,
      inject: [ECOMMERCE_PRODUCT_SETUP_REPOSITORY],
      useFactory: (ecommerceProductSetupRepository) =>
        new ListTenantEcommerceProductSetupsUseCase(
          ecommerceProductSetupRepository,
        ),
    },
    {
      provide: GetTenantEcommerceProductSetupDetailUseCase,
      inject: [ECOMMERCE_PRODUCT_SETUP_REPOSITORY],
      useFactory: (ecommerceProductSetupRepository) =>
        new GetTenantEcommerceProductSetupDetailUseCase(
          ecommerceProductSetupRepository,
        ),
    },
    {
      provide: RequestTenantEcommerceProductSetupDefinitionPacketUseCase,
      inject: [GetTenantEcommerceProductSetupDetailUseCase],
      useFactory: (getTenantEcommerceProductSetupDetailUseCase) =>
        new RequestTenantEcommerceProductSetupDefinitionPacketUseCase(
          getTenantEcommerceProductSetupDetailUseCase,
        ),
    },
    {
      provide: UpdateTenantEcommerceProductSetupEditableSnapshotUseCase,
      inject: [
        ECOMMERCE_PRODUCT_SETUP_REPOSITORY,
        GetTenantEcommerceProductSetupDetailUseCase,
      ],
      useFactory: (
        ecommerceProductSetupRepository,
        getTenantEcommerceProductSetupDetailUseCase,
      ) =>
        new UpdateTenantEcommerceProductSetupEditableSnapshotUseCase(
          ecommerceProductSetupRepository,
          getTenantEcommerceProductSetupDetailUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceProductWorkspaceReadinessPacketUseCase,
      inject: [GetTenantEcommerceProductWorkspaceDetailUseCase],
      useFactory: (getTenantEcommerceProductWorkspaceDetailUseCase) =>
        new RequestTenantEcommerceProductWorkspaceReadinessPacketUseCase(
          getTenantEcommerceProductWorkspaceDetailUseCase,
        ),
    },
    {
      provide: UpdateTenantEcommerceProductWorkspaceEditableSnapshotUseCase,
      inject: [
        ECOMMERCE_PRODUCT_DRAFT_REPOSITORY,
        GetTenantEcommerceProductWorkspaceDetailUseCase,
      ],
      useFactory: (
        ecommerceProductDraftRepository,
        getTenantEcommerceProductWorkspaceDetailUseCase,
      ) =>
        new UpdateTenantEcommerceProductWorkspaceEditableSnapshotUseCase(
          ecommerceProductDraftRepository,
          getTenantEcommerceProductWorkspaceDetailUseCase,
        ),
    },
    {
      provide: GetTenantEcommerceLaunchPlanDetailUseCase,
      inject: [GetTenantEcommerceLaunchWorkspaceUseCase],
      useFactory: (getTenantEcommerceLaunchWorkspaceUseCase) =>
        new GetTenantEcommerceLaunchPlanDetailUseCase(
          getTenantEcommerceLaunchWorkspaceUseCase,
        ),
    },
    {
      provide: ListTenantEcommerceLaunchPlansUseCase,
      inject: [GetTenantEcommerceLaunchWorkspaceUseCase],
      useFactory: (getTenantEcommerceLaunchWorkspaceUseCase) =>
        new ListTenantEcommerceLaunchPlansUseCase(
          getTenantEcommerceLaunchWorkspaceUseCase,
        ),
    },
    {
      provide: RequestTenantEcommerceLaunchPlanActivationReadinessUseCase,
      inject: [GetTenantEcommerceLaunchPlanDetailUseCase],
      useFactory: (getTenantEcommerceLaunchPlanDetailUseCase) =>
        new RequestTenantEcommerceLaunchPlanActivationReadinessUseCase(
          getTenantEcommerceLaunchPlanDetailUseCase,
        ),
    },
    {
      provide: ResolveTenantAccessUseCase,
      inject: [TENANT_REPOSITORY, TENANT_ACCESS_REPOSITORY],
      useFactory: (tenantRepository, tenantAccessRepository) =>
        new ResolveTenantAccessUseCase(
          tenantRepository,
          tenantAccessRepository,
        ),
    },
    TenantMembershipGuard,
    TenantPermissionGuard,
  ],
  exports: [GetTenantEcommerceLaunchWorkspaceUseCase],
})
export class EcommerceModule {}
