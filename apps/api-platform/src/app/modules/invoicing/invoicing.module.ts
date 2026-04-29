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
  CreateTenantInvoicePaymentUseCase,
  CreateTenantTaxRateUseCase,
  CUSTOMER_ID_GENERATOR,
  CUSTOMER_REPOSITORY,
  GetTenantCustomerByIdUseCase,
  GetTenantInvoiceDetailUseCase,
  GetTenantInvoiceDocumentUseCase,
  GetTenantInvoicingReportSummaryUseCase,
  GetTenantInvoiceByIdUseCase,
  GetTenantInvoiceItemByIdUseCase,
  INVOICE_ID_GENERATOR,
  INVOICE_ITEM_ID_GENERATOR,
  INVOICE_ITEM_REPOSITORY,
  INVOICE_NOTIFICATION_SENDER,
  INVOICE_REPOSITORY,
  PAYMENT_ID_GENERATOR,
  PAYMENT_REPOSITORY,
  ReverseTenantInvoicePaymentUseCase,
  ListTenantCustomersUseCase,
  ListTenantInvoiceItemsUseCase,
  ListTenantInvoicePaymentsUseCase,
  ListTenantInvoiceSummariesUseCase,
  ListTenantInvoicesUseCase,
  ListTenantTaxRatesUseCase,
  SendTenantInvoiceEmailUseCase,
  TAX_RATE_ID_GENERATOR,
  TAX_RATE_REPOSITORY,
  UpdateTenantInvoiceStatusUseCase,
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
import { SmtpInvoiceNotificationSender } from './smtp-invoice-notification-sender';

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
      provide: INVOICE_NOTIFICATION_SENDER,
      useFactory: () =>
        new SmtpInvoiceNotificationSender({
          fromAddress:
            process.env.INVOICING_EMAIL_FROM ??
            process.env.INVITATION_EMAIL_FROM,
          smtpHost: process.env.INVITATION_SMTP_HOST,
          smtpPassword: process.env.INVITATION_SMTP_PASSWORD,
          smtpPort: process.env.INVITATION_SMTP_PORT,
          smtpSecure: process.env.INVITATION_SMTP_SECURE,
          smtpUser: process.env.INVITATION_SMTP_USER,
        }),
    },
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
      provide: CreateTenantTaxRateUseCase,
      inject: [TENANT_REPOSITORY, TAX_RATE_REPOSITORY, TAX_RATE_ID_GENERATOR],
      useFactory: (tenantRepository, taxRateRepository, taxRateIdGenerator) =>
        new CreateTenantTaxRateUseCase(
          tenantRepository,
          taxRateRepository,
          taxRateIdGenerator,
        ),
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
        TAX_RATE_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
        invoiceItemIdGenerator,
        taxRateRepository,
      ) =>
        new CreateTenantInvoiceItemUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
          invoiceItemIdGenerator,
          taxRateRepository,
        ),
    },
    {
      provide: CreateTenantInvoicePaymentUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        PAYMENT_REPOSITORY,
        PAYMENT_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
        paymentRepository,
        paymentIdGenerator,
      ) =>
        new CreateTenantInvoicePaymentUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
          paymentRepository,
          paymentIdGenerator,
        ),
    },
    {
      provide: ReverseTenantInvoicePaymentUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        PAYMENT_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
        paymentRepository,
      ) =>
        new ReverseTenantInvoicePaymentUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
          paymentRepository,
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
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        PAYMENT_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
        paymentRepository,
      ) =>
        new GetTenantInvoiceDetailUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
          paymentRepository,
        ),
    },
    {
      provide: GetTenantInvoiceDocumentUseCase,
      inject: [
        TENANT_REPOSITORY,
        CUSTOMER_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        customerRepository,
        invoiceRepository,
        invoiceItemRepository,
      ) =>
        new GetTenantInvoiceDocumentUseCase(
          tenantRepository,
          customerRepository,
          invoiceRepository,
          invoiceItemRepository,
        ),
    },
    {
      provide: GetTenantInvoicingReportSummaryUseCase,
      inject: [
        TENANT_REPOSITORY,
        CUSTOMER_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        PAYMENT_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        customerRepository,
        invoiceRepository,
        invoiceItemRepository,
        paymentRepository,
      ) =>
        new GetTenantInvoicingReportSummaryUseCase(
          tenantRepository,
          customerRepository,
          invoiceRepository,
          invoiceItemRepository,
          paymentRepository,
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
      provide: SendTenantInvoiceEmailUseCase,
      inject: [
        TENANT_REPOSITORY,
        CUSTOMER_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        INVOICE_NOTIFICATION_SENDER,
      ],
      useFactory: (
        tenantRepository,
        customerRepository,
        invoiceRepository,
        invoiceItemRepository,
        invoiceNotificationSender,
      ) =>
        new SendTenantInvoiceEmailUseCase(
          tenantRepository,
          customerRepository,
          invoiceRepository,
          invoiceItemRepository,
          invoiceNotificationSender,
        ),
    },
    {
      provide: UpdateTenantInvoiceStatusUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        PAYMENT_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
        paymentRepository,
      ) =>
        new UpdateTenantInvoiceStatusUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
          paymentRepository,
        ),
    },
    {
      provide: ListTenantTaxRatesUseCase,
      inject: [TENANT_REPOSITORY, TAX_RATE_REPOSITORY],
      useFactory: (tenantRepository, taxRateRepository) =>
        new ListTenantTaxRatesUseCase(tenantRepository, taxRateRepository),
    },
    {
      provide: ListTenantInvoicesUseCase,
      inject: [TENANT_REPOSITORY, INVOICE_REPOSITORY],
      useFactory: (tenantRepository, invoiceRepository) =>
        new ListTenantInvoicesUseCase(tenantRepository, invoiceRepository),
    },
    {
      provide: ListTenantInvoiceSummariesUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        PAYMENT_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
        paymentRepository,
      ) =>
        new ListTenantInvoiceSummariesUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
          paymentRepository,
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
      provide: ListTenantInvoicePaymentsUseCase,
      inject: [TENANT_REPOSITORY, INVOICE_REPOSITORY, PAYMENT_REPOSITORY],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        paymentRepository,
      ) =>
        new ListTenantInvoicePaymentsUseCase(
          tenantRepository,
          invoiceRepository,
          paymentRepository,
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
