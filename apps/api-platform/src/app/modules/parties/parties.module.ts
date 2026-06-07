import { Module } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '@saas-platform/catalog-application';
import {
  ENTITLEMENT_REPOSITORY,
  GetTenantEnabledProductByKeyUseCase,
  ListTenantEnabledProductsUseCase,
} from '@saas-platform/commercial-application';
import { FEATURE_FLAG_REPOSITORY } from '@saas-platform/feature-flags-application';
import { CUSTOMER_REPOSITORY } from '@saas-platform/invoicing-application';
import {
  ApplyTenantPartyFiscalCorrectionUseCase,
  GetTenantPartyByIdUseCase,
  GetTenantPartyDirectoryCoreV2WorkspaceUseCase,
  GetTenantPartyDuplicateMergeReadinessWorkspaceUseCase,
  GetTenantPartyFiscalCleanupPacketUseCase,
  GetTenantPartyFiscalCleanupWorkspaceUseCase,
  GetTenantPartyFiscalIdentityProfileWorkspaceUseCase,
  GetTenantPartyFiscalReadinessSummaryUseCase,
  GetTenantPartyProductRoleBridgeWorkspaceUseCase,
  GetTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase,
  ListTenantPartiesUseCase,
  PARTY_DIRECTORY_REPOSITORY,
  RequestTenantPartiesProductCloseoutPackUseCase,
} from '@saas-platform/parties-application';
import {
  CatalogPersistenceModule,
  CommercialPersistenceModule,
  FeatureFlagsPersistenceModule,
  InvoicingPersistenceModule,
  TenancyPersistenceModule,
} from '@saas-platform/infra-prisma';
import {
  ResolveTenantAccessUseCase,
  TENANT_ACCESS_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { AuthModule } from '../auth/auth.module';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import { InvoicingCustomerPartyDirectoryRepository } from './invoicing-customer-party-directory.repository';
import { PartiesController } from './parties.controller';

@Module({
  imports: [
    AuthModule,
    CatalogPersistenceModule,
    CommercialPersistenceModule,
    FeatureFlagsPersistenceModule,
    InvoicingPersistenceModule,
    TenancyPersistenceModule,
  ],
  controllers: [PartiesController],
  providers: [
    {
      provide: PARTY_DIRECTORY_REPOSITORY,
      inject: [CUSTOMER_REPOSITORY],
      useFactory: (customerRepository) =>
        new InvoicingCustomerPartyDirectoryRepository(customerRepository),
    },
    {
      provide: ListTenantPartiesUseCase,
      inject: [TENANT_REPOSITORY, PARTY_DIRECTORY_REPOSITORY],
      useFactory: (tenantRepository, partyDirectoryRepository) =>
        new ListTenantPartiesUseCase(
          tenantRepository,
          partyDirectoryRepository,
        ),
    },
    {
      provide: GetTenantPartyByIdUseCase,
      inject: [TENANT_REPOSITORY, PARTY_DIRECTORY_REPOSITORY],
      useFactory: (tenantRepository, partyDirectoryRepository) =>
        new GetTenantPartyByIdUseCase(
          tenantRepository,
          partyDirectoryRepository,
        ),
    },
    {
      provide: GetTenantPartyFiscalReadinessSummaryUseCase,
      inject: [TENANT_REPOSITORY, PARTY_DIRECTORY_REPOSITORY],
      useFactory: (tenantRepository, partyDirectoryRepository) =>
        new GetTenantPartyFiscalReadinessSummaryUseCase(
          tenantRepository,
          partyDirectoryRepository,
        ),
    },
    {
      provide: GetTenantPartyFiscalCleanupWorkspaceUseCase,
      inject: [
        GetTenantPartyFiscalReadinessSummaryUseCase,
        ListTenantPartiesUseCase,
      ],
      useFactory: (
        getTenantPartyFiscalReadinessSummaryUseCase,
        listTenantPartiesUseCase,
      ) =>
        new GetTenantPartyFiscalCleanupWorkspaceUseCase(
          getTenantPartyFiscalReadinessSummaryUseCase,
          listTenantPartiesUseCase,
        ),
    },
    {
      provide: GetTenantPartyFiscalCleanupPacketUseCase,
      inject: [GetTenantPartyFiscalCleanupWorkspaceUseCase],
      useFactory: (getTenantPartyFiscalCleanupWorkspaceUseCase) =>
        new GetTenantPartyFiscalCleanupPacketUseCase(
          getTenantPartyFiscalCleanupWorkspaceUseCase,
        ),
    },
    {
      provide: ApplyTenantPartyFiscalCorrectionUseCase,
      inject: [TENANT_REPOSITORY, PARTY_DIRECTORY_REPOSITORY],
      useFactory: (tenantRepository, partyDirectoryRepository) =>
        new ApplyTenantPartyFiscalCorrectionUseCase(
          tenantRepository,
          partyDirectoryRepository,
        ),
    },
    {
      provide: GetTenantPartyDirectoryCoreV2WorkspaceUseCase,
      inject: [
        ListTenantPartiesUseCase,
        GetTenantPartyFiscalReadinessSummaryUseCase,
      ],
      useFactory: (
        listTenantPartiesUseCase,
        getTenantPartyFiscalReadinessSummaryUseCase,
      ) =>
        new GetTenantPartyDirectoryCoreV2WorkspaceUseCase(
          listTenantPartiesUseCase,
          getTenantPartyFiscalReadinessSummaryUseCase,
        ),
    },
    {
      provide: GetTenantPartyFiscalIdentityProfileWorkspaceUseCase,
      inject: [
        ListTenantPartiesUseCase,
        GetTenantPartyFiscalReadinessSummaryUseCase,
      ],
      useFactory: (
        listTenantPartiesUseCase,
        getTenantPartyFiscalReadinessSummaryUseCase,
      ) =>
        new GetTenantPartyFiscalIdentityProfileWorkspaceUseCase(
          listTenantPartiesUseCase,
          getTenantPartyFiscalReadinessSummaryUseCase,
        ),
    },
    {
      provide: GetTenantPartyProductRoleBridgeWorkspaceUseCase,
      inject: [ListTenantPartiesUseCase],
      useFactory: (listTenantPartiesUseCase) =>
        new GetTenantPartyProductRoleBridgeWorkspaceUseCase(
          listTenantPartiesUseCase,
        ),
    },
    {
      provide: GetTenantPartyDuplicateMergeReadinessWorkspaceUseCase,
      inject: [ListTenantPartiesUseCase],
      useFactory: (listTenantPartiesUseCase) =>
        new GetTenantPartyDuplicateMergeReadinessWorkspaceUseCase(
          listTenantPartiesUseCase,
        ),
    },
    {
      provide: GetTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase,
      inject: [ListTenantPartiesUseCase],
      useFactory: (listTenantPartiesUseCase) =>
        new GetTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase(
          listTenantPartiesUseCase,
        ),
    },
    {
      provide: RequestTenantPartiesProductCloseoutPackUseCase,
      inject: [
        GetTenantPartyDirectoryCoreV2WorkspaceUseCase,
        GetTenantPartyFiscalIdentityProfileWorkspaceUseCase,
        GetTenantPartyProductRoleBridgeWorkspaceUseCase,
        GetTenantPartyDuplicateMergeReadinessWorkspaceUseCase,
        GetTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase,
      ],
      useFactory: (
        getTenantPartyDirectoryCoreV2WorkspaceUseCase,
        getTenantPartyFiscalIdentityProfileWorkspaceUseCase,
        getTenantPartyProductRoleBridgeWorkspaceUseCase,
        getTenantPartyDuplicateMergeReadinessWorkspaceUseCase,
        getTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase,
      ) =>
        new RequestTenantPartiesProductCloseoutPackUseCase(
          getTenantPartyDirectoryCoreV2WorkspaceUseCase,
          getTenantPartyFiscalIdentityProfileWorkspaceUseCase,
          getTenantPartyProductRoleBridgeWorkspaceUseCase,
          getTenantPartyDuplicateMergeReadinessWorkspaceUseCase,
          getTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase,
        ),
    },
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
      provide: GetTenantEnabledProductByKeyUseCase,
      inject: [PRODUCT_REPOSITORY, ListTenantEnabledProductsUseCase],
      useFactory: (productRepository, listTenantEnabledProductsUseCase) =>
        new GetTenantEnabledProductByKeyUseCase(
          productRepository,
          listTenantEnabledProductsUseCase,
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
    TenantProductAccessGuard,
  ],
})
export class PartiesModule {}
