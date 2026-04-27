import { Module } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '@saas-platform/catalog-application';
import {
  ENTITLEMENT_REPOSITORY,
  GetTenantEnabledProductByKeyUseCase,
  ListTenantEnabledProductsUseCase,
} from '@saas-platform/commercial-application';
import { FEATURE_FLAG_REPOSITORY } from '@saas-platform/feature-flags-application';
import {
  CreateTenantCustomerUseCase,
  CreateTenantInvoiceUseCase,
  CreateTenantInvoiceItemUseCase,
  CUSTOMER_ID_GENERATOR,
  CUSTOMER_REPOSITORY,
  GetTenantCustomerByIdUseCase,
  GetTenantInvoiceDetailUseCase,
  GetTenantInvoiceByIdUseCase,
  GetTenantInvoiceItemByIdUseCase,
  INVOICE_ID_GENERATOR,
  INVOICE_ITEM_ID_GENERATOR,
  INVOICE_ITEM_REPOSITORY,
  INVOICE_REPOSITORY,
  ListTenantCustomersUseCase,
  ListTenantInvoiceItemsUseCase,
  ListTenantInvoiceSummariesUseCase,
  ListTenantInvoicesUseCase,
} from '@saas-platform/invoicing-application';
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
import { InvoicingController } from './invoicing.controller';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';

@Module({
  imports: [
    AuthModule,
    CatalogPersistenceModule,
    CommercialPersistenceModule,
    FeatureFlagsPersistenceModule,
    InvoicingPersistenceModule,
    TenancyPersistenceModule,
  ],
  controllers: [InvoicingController],
  providers: [
    {
      provide: CreateTenantCustomerUseCase,
      inject: [TENANT_REPOSITORY, CUSTOMER_REPOSITORY, CUSTOMER_ID_GENERATOR],
      useFactory: (tenantRepository, customerRepository, customerIdGenerator) =>
        new CreateTenantCustomerUseCase(
          tenantRepository,
          customerRepository,
          customerIdGenerator,
        ),
    },
    {
      provide: GetTenantCustomerByIdUseCase,
      inject: [TENANT_REPOSITORY, CUSTOMER_REPOSITORY],
      useFactory: (tenantRepository, customerRepository) =>
        new GetTenantCustomerByIdUseCase(tenantRepository, customerRepository),
    },
    {
      provide: ListTenantCustomersUseCase,
      inject: [TENANT_REPOSITORY, CUSTOMER_REPOSITORY],
      useFactory: (tenantRepository, customerRepository) =>
        new ListTenantCustomersUseCase(tenantRepository, customerRepository),
    },
    {
      provide: CreateTenantInvoiceUseCase,
      inject: [
        TENANT_REPOSITORY,
        CUSTOMER_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        customerRepository,
        invoiceRepository,
        invoiceIdGenerator,
      ) =>
        new CreateTenantInvoiceUseCase(
          tenantRepository,
          customerRepository,
          invoiceRepository,
          invoiceIdGenerator,
        ),
    },
    {
      provide: CreateTenantInvoiceItemUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        INVOICE_ITEM_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
        invoiceItemIdGenerator,
      ) =>
        new CreateTenantInvoiceItemUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
          invoiceItemIdGenerator,
        ),
    },
    {
      provide: GetTenantInvoiceByIdUseCase,
      inject: [TENANT_REPOSITORY, INVOICE_REPOSITORY],
      useFactory: (tenantRepository, invoiceRepository) =>
        new GetTenantInvoiceByIdUseCase(tenantRepository, invoiceRepository),
    },
    {
      provide: GetTenantInvoiceDetailUseCase,
      inject: [TENANT_REPOSITORY, INVOICE_REPOSITORY, INVOICE_ITEM_REPOSITORY],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
      ) =>
        new GetTenantInvoiceDetailUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
        ),
    },
    {
      provide: GetTenantInvoiceItemByIdUseCase,
      inject: [TENANT_REPOSITORY, INVOICE_REPOSITORY, INVOICE_ITEM_REPOSITORY],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
      ) =>
        new GetTenantInvoiceItemByIdUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
        ),
    },
    {
      provide: ListTenantInvoicesUseCase,
      inject: [TENANT_REPOSITORY, INVOICE_REPOSITORY],
      useFactory: (tenantRepository, invoiceRepository) =>
        new ListTenantInvoicesUseCase(tenantRepository, invoiceRepository),
    },
    {
      provide: ListTenantInvoiceSummariesUseCase,
      inject: [TENANT_REPOSITORY, INVOICE_REPOSITORY, INVOICE_ITEM_REPOSITORY],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
      ) =>
        new ListTenantInvoiceSummariesUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
        ),
    },
    {
      provide: ListTenantInvoiceItemsUseCase,
      inject: [TENANT_REPOSITORY, INVOICE_REPOSITORY, INVOICE_ITEM_REPOSITORY],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
      ) =>
        new ListTenantInvoiceItemsUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
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
export class InvoicingModule {}
