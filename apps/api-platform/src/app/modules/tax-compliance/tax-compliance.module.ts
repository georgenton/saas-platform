import { Module } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '@saas-platform/catalog-application';
import {
  ENTITLEMENT_REPOSITORY,
  GetTenantEnabledProductByKeyUseCase,
  ListTenantEnabledProductsUseCase,
} from '@saas-platform/commercial-application';
import { FEATURE_FLAG_REPOSITORY } from '@saas-platform/feature-flags-application';
import {
  CUSTOMER_REPOSITORY,
  ISSUER_PROFILE_REPOSITORY,
} from '@saas-platform/invoicing-application';
import {
  PARTY_DIRECTORY_REPOSITORY,
} from '@saas-platform/parties-application';
import {
  GetTenantEcuadorTaxObligationMatrixUseCase,
  GetTenantEcuadorTaxpayerProfileUseCase,
  RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
} from '@saas-platform/tax-compliance-application';
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
import { InvoicingCustomerPartyDirectoryRepository } from '../parties/invoicing-customer-party-directory.repository';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import { TaxComplianceController } from './tax-compliance.controller';

@Module({
  imports: [
    AuthModule,
    CatalogPersistenceModule,
    CommercialPersistenceModule,
    FeatureFlagsPersistenceModule,
    InvoicingPersistenceModule,
    TenancyPersistenceModule,
  ],
  controllers: [TaxComplianceController],
  providers: [
    {
      provide: PARTY_DIRECTORY_REPOSITORY,
      inject: [CUSTOMER_REPOSITORY],
      useFactory: (customerRepository) =>
        new InvoicingCustomerPartyDirectoryRepository(customerRepository),
    },
    {
      provide: GetTenantEcuadorTaxpayerProfileUseCase,
      inject: [
        TENANT_REPOSITORY,
        ISSUER_PROFILE_REPOSITORY,
        PARTY_DIRECTORY_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        issuerProfileRepository,
        partyDirectoryRepository,
      ) =>
        new GetTenantEcuadorTaxpayerProfileUseCase(
          tenantRepository,
          issuerProfileRepository,
          partyDirectoryRepository,
        ),
    },
    {
      provide: GetTenantEcuadorTaxObligationMatrixUseCase,
      inject: [GetTenantEcuadorTaxpayerProfileUseCase],
      useFactory: (getTenantEcuadorTaxpayerProfileUseCase) =>
        new GetTenantEcuadorTaxObligationMatrixUseCase(
          getTenantEcuadorTaxpayerProfileUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
      inject: [GetTenantEcuadorTaxObligationMatrixUseCase],
      useFactory: (getTenantEcuadorTaxObligationMatrixUseCase) =>
        new RequestTenantEcuadorTaxPeriodPreparationPacketUseCase(
          getTenantEcuadorTaxObligationMatrixUseCase,
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
        new ResolveTenantAccessUseCase(tenantRepository, tenantAccessRepository),
    },
    TenantMembershipGuard,
    TenantPermissionGuard,
    TenantProductAccessGuard,
  ],
})
export class TaxComplianceModule {}
