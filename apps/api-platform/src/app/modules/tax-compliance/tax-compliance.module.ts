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
  GetTenantInvoicingReportSummaryUseCase,
  INVOICE_ITEM_REPOSITORY,
  INVOICE_REPOSITORY,
  ISSUER_PROFILE_REPOSITORY,
  PAYMENT_REPOSITORY,
} from '@saas-platform/invoicing-application';
import {
  GetTenantPartyFiscalReadinessSummaryUseCase,
  PARTY_DIRECTORY_REPOSITORY,
} from '@saas-platform/parties-application';
import {
  GetTenantEcuadorTaxAuditReadinessUseCase,
  GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
  GetTenantEcuadorTaxDueMonitorUseCase,
  GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
  GetTenantEcuadorTaxObligationMatrixUseCase,
  GetTenantEcuadorTaxObligationCalendarUseCase,
  GetTenantEcuadorTaxPeriodWorkspaceUseCase,
  GetTenantEcuadorTaxReconciliationWorkspaceUseCase,
  GetTenantEcuadorTaxpayerProfileUseCase,
  ListTenantEcuadorTaxAccountantReviewsUseCase,
  ListTenantEcuadorTaxComplianceEventsUseCase,
  RecordTenantEcuadorTaxComplianceEventUseCase,
  RequestTenantEcuadorTaxAccountantReviewPacketUseCase,
  RequestTenantEcuadorTaxAccountantReviewUseCase,
  RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
  RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
  RequestTenantEcuadorTaxPeriodCloseoutPacketUseCase,
  RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
  RequestTenantEcuadorTaxSalesBookUseCase,
  RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
  TAX_COMPLIANCE_ACCOUNTANT_REVIEW_ID_GENERATOR,
  TAX_COMPLIANCE_ACCOUNTANT_REVIEW_REPOSITORY,
  TAX_COMPLIANCE_ECOMMERCE_EVIDENCE_REPOSITORY,
  TAX_COMPLIANCE_EVENT_ID_GENERATOR,
  TAX_COMPLIANCE_EVENT_REPOSITORY,
  TransitionTenantEcuadorTaxAccountantReviewUseCase,
} from '@saas-platform/tax-compliance-application';
import {
  CatalogPersistenceModule,
  CommercialPersistenceModule,
  FeatureFlagsPersistenceModule,
  InvoicingPersistenceModule,
  TaxCompliancePersistenceModule,
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
    TaxCompliancePersistenceModule,
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
      provide: GetTenantEcuadorTaxObligationCalendarUseCase,
      inject: [GetTenantEcuadorTaxObligationMatrixUseCase],
      useFactory: (getTenantEcuadorTaxObligationMatrixUseCase) =>
        new GetTenantEcuadorTaxObligationCalendarUseCase(
          getTenantEcuadorTaxObligationMatrixUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
      inject: [GetTenantEcuadorTaxObligationCalendarUseCase],
      useFactory: (getTenantEcuadorTaxObligationCalendarUseCase) =>
        new GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase(
          getTenantEcuadorTaxObligationCalendarUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxDueMonitorUseCase,
      inject: [GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase],
      useFactory: (getTenantEcuadorTaxCalendarReviewWorkspaceUseCase) =>
        new GetTenantEcuadorTaxDueMonitorUseCase(
          getTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
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
      provide: GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
      inject: [TENANT_REPOSITORY, TAX_COMPLIANCE_ECOMMERCE_EVIDENCE_REPOSITORY],
      useFactory: (tenantRepository, ecommerceEvidenceRepository) =>
        new GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase(
          tenantRepository,
          ecommerceEvidenceRepository,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxSalesBookUseCase,
      inject: [
        TENANT_REPOSITORY,
        INVOICE_REPOSITORY,
        INVOICE_ITEM_REPOSITORY,
        PAYMENT_REPOSITORY,
        GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        tenantRepository,
        invoiceRepository,
        invoiceItemRepository,
        paymentRepository,
        getTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxSalesBookUseCase(
          tenantRepository,
          invoiceRepository,
          invoiceItemRepository,
          paymentRepository,
          getTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
      inject: [
        GetTenantEcuadorTaxObligationMatrixUseCase,
        GetTenantInvoicingReportSummaryUseCase,
        GetTenantPartyFiscalReadinessSummaryUseCase,
        GetTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxObligationMatrixUseCase,
        getTenantInvoicingReportSummaryUseCase,
        getTenantPartyFiscalReadinessSummaryUseCase,
        getTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
      ) =>
        new RequestTenantEcuadorTaxPeriodPreparationPacketUseCase(
          getTenantEcuadorTaxObligationMatrixUseCase,
          getTenantInvoicingReportSummaryUseCase,
          getTenantPartyFiscalReadinessSummaryUseCase,
          getTenantEcuadorTaxEcommerceEvidenceSummaryUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
      inject: [
        RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
        GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxPeriodPreparationPacketUseCase,
        getTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
      ) =>
        new RequestTenantEcuadorTaxDeclarationDraftPacketUseCase(
          requestTenantEcuadorTaxPeriodPreparationPacketUseCase,
          getTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxPeriodWorkspaceUseCase,
      inject: [
        GetTenantEcuadorTaxObligationCalendarUseCase,
        GetTenantEcuadorTaxDueMonitorUseCase,
        RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
        RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
        RequestTenantEcuadorTaxSalesBookUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxObligationCalendarUseCase,
        getTenantEcuadorTaxDueMonitorUseCase,
        requestTenantEcuadorTaxPeriodPreparationPacketUseCase,
        requestTenantEcuadorTaxDeclarationDraftPacketUseCase,
        requestTenantEcuadorTaxSalesBookUseCase,
      ) =>
        new GetTenantEcuadorTaxPeriodWorkspaceUseCase(
          getTenantEcuadorTaxObligationCalendarUseCase,
          getTenantEcuadorTaxDueMonitorUseCase,
          requestTenantEcuadorTaxPeriodPreparationPacketUseCase,
          requestTenantEcuadorTaxDeclarationDraftPacketUseCase,
          requestTenantEcuadorTaxSalesBookUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxReconciliationWorkspaceUseCase,
      inject: [
        RequestTenantEcuadorTaxSalesBookUseCase,
        RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
        ListTenantEcuadorTaxAccountantReviewsUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxSalesBookUseCase,
        requestTenantEcuadorTaxPeriodPreparationPacketUseCase,
        listTenantEcuadorTaxAccountantReviewsUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new GetTenantEcuadorTaxReconciliationWorkspaceUseCase(
          requestTenantEcuadorTaxSalesBookUseCase,
          requestTenantEcuadorTaxPeriodPreparationPacketUseCase,
          listTenantEcuadorTaxAccountantReviewsUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxAccountantReviewPacketUseCase,
      inject: [GetTenantEcuadorTaxPeriodWorkspaceUseCase],
      useFactory: (getTenantEcuadorTaxPeriodWorkspaceUseCase) =>
        new RequestTenantEcuadorTaxAccountantReviewPacketUseCase(
          getTenantEcuadorTaxPeriodWorkspaceUseCase,
        ),
    },
    {
      provide: RecordTenantEcuadorTaxComplianceEventUseCase,
      inject: [
        TENANT_REPOSITORY,
        TAX_COMPLIANCE_EVENT_REPOSITORY,
        TAX_COMPLIANCE_EVENT_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        taxComplianceEventRepository,
        eventIdGenerator,
      ) =>
        new RecordTenantEcuadorTaxComplianceEventUseCase(
          tenantRepository,
          taxComplianceEventRepository,
          eventIdGenerator,
        ),
    },
    {
      provide: ListTenantEcuadorTaxComplianceEventsUseCase,
      inject: [TENANT_REPOSITORY, TAX_COMPLIANCE_EVENT_REPOSITORY],
      useFactory: (tenantRepository, taxComplianceEventRepository) =>
        new ListTenantEcuadorTaxComplianceEventsUseCase(
          tenantRepository,
          taxComplianceEventRepository,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxAccountantReviewUseCase,
      inject: [
        TENANT_REPOSITORY,
        TAX_COMPLIANCE_ACCOUNTANT_REVIEW_REPOSITORY,
        TAX_COMPLIANCE_ACCOUNTANT_REVIEW_ID_GENERATOR,
        RequestTenantEcuadorTaxAccountantReviewPacketUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        tenantRepository,
        taxComplianceAccountantReviewRepository,
        reviewIdGenerator,
        requestTenantEcuadorTaxAccountantReviewPacketUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxAccountantReviewUseCase(
          tenantRepository,
          taxComplianceAccountantReviewRepository,
          reviewIdGenerator,
          requestTenantEcuadorTaxAccountantReviewPacketUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: ListTenantEcuadorTaxAccountantReviewsUseCase,
      inject: [TENANT_REPOSITORY, TAX_COMPLIANCE_ACCOUNTANT_REVIEW_REPOSITORY],
      useFactory: (tenantRepository, taxComplianceAccountantReviewRepository) =>
        new ListTenantEcuadorTaxAccountantReviewsUseCase(
          tenantRepository,
          taxComplianceAccountantReviewRepository,
        ),
    },
    {
      provide: TransitionTenantEcuadorTaxAccountantReviewUseCase,
      inject: [
        TENANT_REPOSITORY,
        TAX_COMPLIANCE_ACCOUNTANT_REVIEW_REPOSITORY,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        tenantRepository,
        taxComplianceAccountantReviewRepository,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new TransitionTenantEcuadorTaxAccountantReviewUseCase(
          tenantRepository,
          taxComplianceAccountantReviewRepository,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
      inject: [
        TENANT_REPOSITORY,
        TAX_COMPLIANCE_ACCOUNTANT_REVIEW_REPOSITORY,
        TAX_COMPLIANCE_EVENT_REPOSITORY,
        RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
      ],
      useFactory: (
        tenantRepository,
        taxComplianceAccountantReviewRepository,
        taxComplianceEventRepository,
        requestTenantEcuadorTaxDeclarationDraftPacketUseCase,
      ) =>
        new RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase(
          tenantRepository,
          taxComplianceAccountantReviewRepository,
          taxComplianceEventRepository,
          requestTenantEcuadorTaxDeclarationDraftPacketUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
      inject: [
        RequestTenantEcuadorTaxSalesBookUseCase,
        GetTenantEcuadorTaxReconciliationWorkspaceUseCase,
        GetTenantEcuadorTaxObligationCalendarUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        requestTenantEcuadorTaxSalesBookUseCase,
        getTenantEcuadorTaxReconciliationWorkspaceUseCase,
        getTenantEcuadorTaxObligationCalendarUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase(
          requestTenantEcuadorTaxSalesBookUseCase,
          getTenantEcuadorTaxReconciliationWorkspaceUseCase,
          getTenantEcuadorTaxObligationCalendarUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: RequestTenantEcuadorTaxPeriodCloseoutPacketUseCase,
      inject: [
        GetTenantEcuadorTaxPeriodWorkspaceUseCase,
        RequestTenantEcuadorTaxSalesBookUseCase,
        GetTenantEcuadorTaxReconciliationWorkspaceUseCase,
        RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
        ListTenantEcuadorTaxAccountantReviewsUseCase,
        RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
        RecordTenantEcuadorTaxComplianceEventUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPeriodWorkspaceUseCase,
        requestTenantEcuadorTaxSalesBookUseCase,
        getTenantEcuadorTaxReconciliationWorkspaceUseCase,
        requestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
        listTenantEcuadorTaxAccountantReviewsUseCase,
        requestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
        recordTenantEcuadorTaxComplianceEventUseCase,
      ) =>
        new RequestTenantEcuadorTaxPeriodCloseoutPacketUseCase(
          getTenantEcuadorTaxPeriodWorkspaceUseCase,
          requestTenantEcuadorTaxSalesBookUseCase,
          getTenantEcuadorTaxReconciliationWorkspaceUseCase,
          requestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
          listTenantEcuadorTaxAccountantReviewsUseCase,
          requestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
          recordTenantEcuadorTaxComplianceEventUseCase,
        ),
    },
    {
      provide: GetTenantEcuadorTaxAuditReadinessUseCase,
      inject: [
        GetTenantEcuadorTaxPeriodWorkspaceUseCase,
        ListTenantEcuadorTaxComplianceEventsUseCase,
      ],
      useFactory: (
        getTenantEcuadorTaxPeriodWorkspaceUseCase,
        listTenantEcuadorTaxComplianceEventsUseCase,
      ) =>
        new GetTenantEcuadorTaxAuditReadinessUseCase(
          getTenantEcuadorTaxPeriodWorkspaceUseCase,
          listTenantEcuadorTaxComplianceEventsUseCase,
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
