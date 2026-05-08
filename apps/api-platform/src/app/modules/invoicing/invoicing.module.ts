import { Module } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '@saas-platform/catalog-application';
import {
  ENTITLEMENT_REPOSITORY,
  GetTenantEnabledProductByKeyUseCase,
  ListTenantEnabledProductsUseCase,
} from '@saas-platform/commercial-application';
import { FEATURE_FLAG_REPOSITORY } from '@saas-platform/feature-flags-application';
import {
  CheckTenantInvoiceElectronicAuthorizationUseCase,
  CreateTenantCustomerUseCase,
  CreateTenantCreditNoteUseCase,
  CreateTenantDebitNoteUseCase,
  CreateTenantInvoiceUseCase,
  CreateTenantInvoiceItemUseCase,
  CreateTenantInvoicePaymentUseCase,
  CreateTenantTaxRateUseCase,
  GetTenantElectronicSandboxReadinessUseCase,
  CUSTOMER_ID_GENERATOR,
  CUSTOMER_REPOSITORY,
  ELECTRONIC_SUBMISSION_SETTINGS_REPOSITORY,
  ELECTRONIC_SIGNATURE_SETTINGS_REPOSITORY,
  ELECTRONIC_INVOICE_SIGNER,
  ELECTRONIC_INVOICE_XML_SCHEMA_VALIDATOR,
  ELECTRONIC_INVOICE_SUBMISSION_GATEWAY,
  GetTenantElectronicSubmissionSettingsUseCase,
  GetTenantElectronicSignatureSettingsUseCase,
  GetTenantCustomerByIdUseCase,
  GetTenantInvoiceNumberingSettingsUseCase,
  GetTenantInvoiceDetailUseCase,
  GetTenantInvoiceDocumentUseCase,
  GetTenantInvoiceElectronicXmlPreviewUseCase,
  GetTenantInvoicingReportSummaryUseCase,
  GetTenantInvoiceByIdUseCase,
  GetTenantInvoiceItemByIdUseCase,
  GetTenantIssuerProfileUseCase,
  INVOICE_ELECTRONIC_EVENT_ID_GENERATOR,
  INVOICE_ELECTRONIC_EVENT_REPOSITORY,
  INVOICE_NUMBERING_SETTINGS_REPOSITORY,
  INVOICE_ID_GENERATOR,
  INVOICE_ITEM_ID_GENERATOR,
  INVOICE_ITEM_REPOSITORY,
  INVOICE_NOTIFICATION_SENDER,
  INVOICE_REPOSITORY,
  ISSUER_PROFILE_REPOSITORY,
  PAYMENT_ID_GENERATOR,
  PAYMENT_REPOSITORY,
  ReverseTenantInvoicePaymentUseCase,
  SECRET_REFERENCE_RESOLVER,
  ListTenantCustomersUseCase,
  ListTenantInvoiceItemsUseCase,
  ListTenantInvoicePaymentsUseCase,
  ListTenantInvoiceSummariesUseCase,
  ListTenantInvoicesUseCase,
  ListTenantTaxRatesUseCase,
  SendTenantInvoiceEmailUseCase,
  SubmitTenantInvoiceElectronicDocumentUseCase,
  SubmitTenantPresignedInvoiceElectronicDocumentUseCase,
  TAX_RATE_ID_GENERATOR,
  TAX_RATE_REPOSITORY,
  UpdateTenantInvoiceStatusUseCase,
  UpdateTenantInvoiceElectronicStatusUseCase,
  UpsertTenantElectronicSubmissionSettingsUseCase,
  UpsertTenantElectronicSignatureSettingsUseCase,
  UpsertTenantInvoiceNumberingSettingsUseCase,
  UpsertTenantIssuerProfileUseCase,
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
import { AxiosSriOfflineWsClient } from './axios-sri-offline-ws-client';
import { EnvSecretReferenceResolver } from './env-secret-reference-resolver';
import { RoutingElectronicInvoiceSubmissionGateway } from './routing-electronic-invoice-submission-gateway';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import { RoutingElectronicInvoiceSigner } from './routing-electronic-invoice-signer';
import { SmtpInvoiceNotificationSender } from './smtp-invoice-notification-sender';
import { StubSriOfflineWsClient } from './stub-sri-offline-ws-client';
import { StubLocalElectronicInvoiceSigner } from './stub-local-electronic-invoice-signer';
import { StubSriOfflineWsSubmissionGateway } from './stub-sri-offline-ws-submission-gateway';
import { StubSriSubmissionGateway } from './stub-sri-submission-gateway';
import { StubXadesPkcs12ElectronicInvoiceSigner } from './stub-xades-pkcs12-electronic-invoice-signer';
import { XmllintSriInvoiceXmlSchemaValidator } from './xmllint-sri-invoice-xml-schema-validator';

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
      provide: ELECTRONIC_INVOICE_SIGNER,
      useExisting: RoutingElectronicInvoiceSigner,
    },
    {
      provide: SECRET_REFERENCE_RESOLVER,
      useExisting: EnvSecretReferenceResolver,
    },
    {
      provide: ELECTRONIC_INVOICE_XML_SCHEMA_VALIDATOR,
      useExisting: XmllintSriInvoiceXmlSchemaValidator,
    },
    {
      provide: ELECTRONIC_INVOICE_SUBMISSION_GATEWAY,
      useExisting: RoutingElectronicInvoiceSubmissionGateway,
    },
    EnvSecretReferenceResolver,
    XmllintSriInvoiceXmlSchemaValidator,
    RoutingElectronicInvoiceSubmissionGateway,
    RoutingElectronicInvoiceSigner,
    AxiosSriOfflineWsClient,
    StubLocalElectronicInvoiceSigner,
    StubSriOfflineWsClient,
    StubSriOfflineWsSubmissionGateway,
    StubSriSubmissionGateway,
    StubXadesPkcs12ElectronicInvoiceSigner,
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
      provide: GetTenantElectronicSandboxReadinessUseCase,
      inject: [
        TENANT_REPOSITORY,
        ISSUER_PROFILE_REPOSITORY,
        INVOICE_NUMBERING_SETTINGS_REPOSITORY,
        ELECTRONIC_SIGNATURE_SETTINGS_REPOSITORY,
        ELECTRONIC_SUBMISSION_SETTINGS_REPOSITORY,
        SECRET_REFERENCE_RESOLVER,
        ELECTRONIC_INVOICE_SIGNER,
        ELECTRONIC_INVOICE_XML_SCHEMA_VALIDATOR,
      ],
      useFactory: (
        tenantRepository,
        issuerProfileRepository,
        invoiceNumberingSettingsRepository,
        electronicSignatureSettingsRepository,
        electronicSubmissionSettingsRepository,
        secretReferenceResolver,
        electronicInvoiceSigner,
        electronicInvoiceXmlSchemaValidator,
      ) =>
        new GetTenantElectronicSandboxReadinessUseCase(
          tenantRepository,
          issuerProfileRepository,
          invoiceNumberingSettingsRepository,
          electronicSignatureSettingsRepository,
          electronicSubmissionSettingsRepository,
          secretReferenceResolver,
          electronicInvoiceSigner,
          electronicInvoiceXmlSchemaValidator,
        ),
    },
    {
      provide: CheckTenantInvoiceElectronicAuthorizationUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ELECTRONIC_EVENT_REPOSITORY,
        INVOICE_ELECTRONIC_EVENT_ID_GENERATOR,
        ELECTRONIC_SUBMISSION_SETTINGS_REPOSITORY,
        ELECTRONIC_INVOICE_SUBMISSION_GATEWAY,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceElectronicEventRepository,
        invoiceElectronicEventIdGenerator,
        electronicSubmissionSettingsRepository,
        electronicInvoiceSubmissionGateway,
      ) =>
        new CheckTenantInvoiceElectronicAuthorizationUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceElectronicEventRepository,
          invoiceElectronicEventIdGenerator,
          electronicSubmissionSettingsRepository,
          electronicInvoiceSubmissionGateway,
        ),
    },
    {
      provide: SubmitTenantInvoiceElectronicDocumentUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ELECTRONIC_EVENT_REPOSITORY,
        INVOICE_ELECTRONIC_EVENT_ID_GENERATOR,
        ELECTRONIC_SUBMISSION_SETTINGS_REPOSITORY,
        ELECTRONIC_SIGNATURE_SETTINGS_REPOSITORY,
        ISSUER_PROFILE_REPOSITORY,
        GetTenantInvoiceDocumentUseCase,
        ELECTRONIC_INVOICE_XML_SCHEMA_VALIDATOR,
        ELECTRONIC_INVOICE_SIGNER,
        ELECTRONIC_INVOICE_SUBMISSION_GATEWAY,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceElectronicEventRepository,
        invoiceElectronicEventIdGenerator,
        electronicSubmissionSettingsRepository,
        electronicSignatureSettingsRepository,
        issuerProfileRepository,
        getTenantInvoiceDocumentUseCase,
        electronicInvoiceXmlSchemaValidator,
        electronicInvoiceSigner,
        electronicInvoiceSubmissionGateway,
      ) =>
        new SubmitTenantInvoiceElectronicDocumentUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceElectronicEventRepository,
          invoiceElectronicEventIdGenerator,
          electronicSubmissionSettingsRepository,
          electronicSignatureSettingsRepository,
          issuerProfileRepository,
          getTenantInvoiceDocumentUseCase,
          electronicInvoiceXmlSchemaValidator,
          electronicInvoiceSigner,
          electronicInvoiceSubmissionGateway,
        ),
    },
    {
      provide: SubmitTenantPresignedInvoiceElectronicDocumentUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ELECTRONIC_EVENT_REPOSITORY,
        INVOICE_ELECTRONIC_EVENT_ID_GENERATOR,
        ELECTRONIC_SUBMISSION_SETTINGS_REPOSITORY,
        ISSUER_PROFILE_REPOSITORY,
        ELECTRONIC_INVOICE_XML_SCHEMA_VALIDATOR,
        ELECTRONIC_INVOICE_SUBMISSION_GATEWAY,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceElectronicEventRepository,
        invoiceElectronicEventIdGenerator,
        electronicSubmissionSettingsRepository,
        issuerProfileRepository,
        electronicInvoiceXmlSchemaValidator,
        electronicInvoiceSubmissionGateway,
      ) =>
        new SubmitTenantPresignedInvoiceElectronicDocumentUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceElectronicEventRepository,
          invoiceElectronicEventIdGenerator,
          electronicSubmissionSettingsRepository,
          issuerProfileRepository,
          electronicInvoiceXmlSchemaValidator,
          electronicInvoiceSubmissionGateway,
        ),
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
      provide: GetTenantElectronicSubmissionSettingsUseCase,
      inject: [TENANT_REPOSITORY, ELECTRONIC_SUBMISSION_SETTINGS_REPOSITORY],
      useFactory: (tenantRepository, electronicSubmissionSettingsRepository) =>
        new GetTenantElectronicSubmissionSettingsUseCase(
          tenantRepository,
          electronicSubmissionSettingsRepository,
        ),
    },
    {
      provide: GetTenantElectronicSignatureSettingsUseCase,
      inject: [TENANT_REPOSITORY, ELECTRONIC_SIGNATURE_SETTINGS_REPOSITORY],
      useFactory: (tenantRepository, electronicSignatureSettingsRepository) =>
        new GetTenantElectronicSignatureSettingsUseCase(
          tenantRepository,
          electronicSignatureSettingsRepository,
        ),
    },
    {
      provide: GetTenantIssuerProfileUseCase,
      inject: [TENANT_REPOSITORY, ISSUER_PROFILE_REPOSITORY],
      useFactory: (tenantRepository, issuerProfileRepository) =>
        new GetTenantIssuerProfileUseCase(
          tenantRepository,
          issuerProfileRepository,
        ),
    },
    {
      provide: UpsertTenantElectronicSubmissionSettingsUseCase,
      inject: [TENANT_REPOSITORY, ELECTRONIC_SUBMISSION_SETTINGS_REPOSITORY],
      useFactory: (tenantRepository, electronicSubmissionSettingsRepository) =>
        new UpsertTenantElectronicSubmissionSettingsUseCase(
          tenantRepository,
          electronicSubmissionSettingsRepository,
        ),
    },
    {
      provide: UpsertTenantElectronicSignatureSettingsUseCase,
      inject: [TENANT_REPOSITORY, ELECTRONIC_SIGNATURE_SETTINGS_REPOSITORY],
      useFactory: (tenantRepository, electronicSignatureSettingsRepository) =>
        new UpsertTenantElectronicSignatureSettingsUseCase(
          tenantRepository,
          electronicSignatureSettingsRepository,
        ),
    },
    {
      provide: UpsertTenantIssuerProfileUseCase,
      inject: [TENANT_REPOSITORY, ISSUER_PROFILE_REPOSITORY],
      useFactory: (tenantRepository, issuerProfileRepository) =>
        new UpsertTenantIssuerProfileUseCase(
          tenantRepository,
          issuerProfileRepository,
        ),
    },
    {
      provide: GetTenantInvoiceNumberingSettingsUseCase,
      inject: [TENANT_REPOSITORY, INVOICE_NUMBERING_SETTINGS_REPOSITORY],
      useFactory: (tenantRepository, invoiceNumberingSettingsRepository) =>
        new GetTenantInvoiceNumberingSettingsUseCase(
          tenantRepository,
          invoiceNumberingSettingsRepository,
        ),
    },
    {
      provide: UpsertTenantInvoiceNumberingSettingsUseCase,
      inject: [TENANT_REPOSITORY, INVOICE_NUMBERING_SETTINGS_REPOSITORY],
      useFactory: (tenantRepository, invoiceNumberingSettingsRepository) =>
        new UpsertTenantInvoiceNumberingSettingsUseCase(
          tenantRepository,
          invoiceNumberingSettingsRepository,
        ),
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
        INVOICE_NUMBERING_SETTINGS_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        customerRepository,
        invoiceRepository,
        invoiceIdGenerator,
        invoiceNumberingSettingsRepository,
      ) =>
        new CreateTenantInvoiceUseCase(
          tenantRepository,
          customerRepository,
          invoiceRepository,
          invoiceIdGenerator,
          invoiceNumberingSettingsRepository,
        ),
    },
    {
      provide: CreateTenantCreditNoteUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        INVOICE_ID_GENERATOR,
        INVOICE_ITEM_ID_GENERATOR,
        INVOICE_NUMBERING_SETTINGS_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
        invoiceIdGenerator,
        invoiceItemIdGenerator,
        invoiceNumberingSettingsRepository,
      ) =>
        new CreateTenantCreditNoteUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
          invoiceIdGenerator,
          invoiceItemIdGenerator,
          invoiceNumberingSettingsRepository,
        ),
    },
    {
      provide: CreateTenantDebitNoteUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        INVOICE_ID_GENERATOR,
        INVOICE_ITEM_ID_GENERATOR,
        INVOICE_NUMBERING_SETTINGS_REPOSITORY,
        TAX_RATE_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
        invoiceIdGenerator,
        invoiceItemIdGenerator,
        invoiceNumberingSettingsRepository,
        taxRateRepository,
      ) =>
        new CreateTenantDebitNoteUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
          invoiceIdGenerator,
          invoiceItemIdGenerator,
          invoiceNumberingSettingsRepository,
          taxRateRepository,
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
        INVOICE_ELECTRONIC_EVENT_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
        paymentRepository,
        invoiceElectronicEventRepository,
      ) =>
        new GetTenantInvoiceDetailUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
          paymentRepository,
          invoiceElectronicEventRepository,
        ),
    },
    {
      provide: GetTenantInvoiceDocumentUseCase,
      inject: [
        TENANT_REPOSITORY,
        CUSTOMER_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        ISSUER_PROFILE_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        customerRepository,
        invoiceRepository,
        invoiceItemRepository,
        issuerProfileRepository,
      ) =>
        new GetTenantInvoiceDocumentUseCase(
          tenantRepository,
          customerRepository,
          invoiceRepository,
          invoiceItemRepository,
          issuerProfileRepository,
        ),
    },
    {
      provide: GetTenantInvoiceElectronicXmlPreviewUseCase,
      inject: [
        TENANT_REPOSITORY,
        ISSUER_PROFILE_REPOSITORY,
        GetTenantInvoiceDocumentUseCase,
      ],
      useFactory: (
        tenantRepository,
        issuerProfileRepository,
        getTenantInvoiceDocumentUseCase,
      ) =>
        new GetTenantInvoiceElectronicXmlPreviewUseCase(
          tenantRepository,
          issuerProfileRepository,
          getTenantInvoiceDocumentUseCase,
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
      provide: UpdateTenantInvoiceElectronicStatusUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        ISSUER_PROFILE_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        issuerProfileRepository,
      ) =>
        new UpdateTenantInvoiceElectronicStatusUseCase(
          tenantRepository,
          invoiceRepository,
          issuerProfileRepository,
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
