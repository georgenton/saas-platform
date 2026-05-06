import { Module } from '@nestjs/common';
import {
  CUSTOMER_ID_GENERATOR,
  CUSTOMER_REPOSITORY,
  ELECTRONIC_SUBMISSION_SETTINGS_REPOSITORY,
  ELECTRONIC_SIGNATURE_SETTINGS_REPOSITORY,
  INVOICE_ELECTRONIC_EVENT_ID_GENERATOR,
  INVOICE_ELECTRONIC_EVENT_REPOSITORY,
  INVOICE_NUMBERING_SETTINGS_REPOSITORY,
  INVOICE_ID_GENERATOR,
  INVOICE_ITEM_ID_GENERATOR,
  INVOICE_ITEM_REPOSITORY,
  ISSUER_PROFILE_REPOSITORY,
  PAYMENT_ID_GENERATOR,
  PAYMENT_REPOSITORY,
  INVOICE_REPOSITORY,
  TAX_RATE_ID_GENERATOR,
  TAX_RATE_REPOSITORY,
} from '@saas-platform/invoicing-application';
import { PrismaModule } from '../prisma.module';
import { PrismaCustomerRepository } from './prisma-customer.repository';
import { PrismaElectronicSubmissionSettingsRepository } from './prisma-electronic-submission-settings.repository';
import { PrismaElectronicSignatureSettingsRepository } from './prisma-electronic-signature-settings.repository';
import { PrismaInvoiceElectronicEventRepository } from './prisma-invoice-electronic-event.repository';
import { PrismaInvoiceItemRepository } from './prisma-invoice-item.repository';
import { PrismaInvoiceNumberingSettingsRepository } from './prisma-invoice-numbering-settings.repository';
import { PrismaIssuerProfileRepository } from './prisma-issuer-profile.repository';
import { PrismaPaymentRepository } from './prisma-payment.repository';
import { PrismaInvoiceRepository } from './prisma-invoice.repository';
import { PrismaTaxRateRepository } from './prisma-tax-rate.repository';
import { UuidCustomerIdGenerator } from './uuid-customer-id.generator';
import { UuidInvoiceElectronicEventIdGenerator } from './uuid-invoice-electronic-event-id.generator';
import { UuidInvoiceItemIdGenerator } from './uuid-invoice-item-id.generator';
import { UuidPaymentIdGenerator } from './uuid-payment-id.generator';
import { UuidInvoiceIdGenerator } from './uuid-invoice-id.generator';
import { UuidTaxRateIdGenerator } from './uuid-tax-rate-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaCustomerRepository,
    PrismaElectronicSubmissionSettingsRepository,
    PrismaElectronicSignatureSettingsRepository,
    PrismaInvoiceElectronicEventRepository,
    PrismaInvoiceItemRepository,
    PrismaInvoiceNumberingSettingsRepository,
    PrismaIssuerProfileRepository,
    PrismaPaymentRepository,
    PrismaInvoiceRepository,
    PrismaTaxRateRepository,
    UuidCustomerIdGenerator,
    UuidInvoiceElectronicEventIdGenerator,
    UuidInvoiceItemIdGenerator,
    UuidPaymentIdGenerator,
    UuidInvoiceIdGenerator,
    UuidTaxRateIdGenerator,
    {
      provide: ELECTRONIC_SUBMISSION_SETTINGS_REPOSITORY,
      useExisting: PrismaElectronicSubmissionSettingsRepository,
    },
    {
      provide: ELECTRONIC_SIGNATURE_SETTINGS_REPOSITORY,
      useExisting: PrismaElectronicSignatureSettingsRepository,
    },
    {
      provide: INVOICE_ELECTRONIC_EVENT_REPOSITORY,
      useExisting: PrismaInvoiceElectronicEventRepository,
    },
    {
      provide: CUSTOMER_REPOSITORY,
      useExisting: PrismaCustomerRepository,
    },
    {
      provide: CUSTOMER_ID_GENERATOR,
      useExisting: UuidCustomerIdGenerator,
    },
    {
      provide: ISSUER_PROFILE_REPOSITORY,
      useExisting: PrismaIssuerProfileRepository,
    },
    {
      provide: INVOICE_NUMBERING_SETTINGS_REPOSITORY,
      useExisting: PrismaInvoiceNumberingSettingsRepository,
    },
    {
      provide: INVOICE_REPOSITORY,
      useExisting: PrismaInvoiceRepository,
    },
    {
      provide: INVOICE_ITEM_REPOSITORY,
      useExisting: PrismaInvoiceItemRepository,
    },
    {
      provide: INVOICE_ID_GENERATOR,
      useExisting: UuidInvoiceIdGenerator,
    },
    {
      provide: INVOICE_ELECTRONIC_EVENT_ID_GENERATOR,
      useExisting: UuidInvoiceElectronicEventIdGenerator,
    },
    {
      provide: INVOICE_ITEM_ID_GENERATOR,
      useExisting: UuidInvoiceItemIdGenerator,
    },
    {
      provide: PAYMENT_REPOSITORY,
      useExisting: PrismaPaymentRepository,
    },
    {
      provide: PAYMENT_ID_GENERATOR,
      useExisting: UuidPaymentIdGenerator,
    },
    {
      provide: TAX_RATE_REPOSITORY,
      useExisting: PrismaTaxRateRepository,
    },
    {
      provide: TAX_RATE_ID_GENERATOR,
      useExisting: UuidTaxRateIdGenerator,
    },
  ],
  exports: [
    CUSTOMER_REPOSITORY,
    CUSTOMER_ID_GENERATOR,
    ELECTRONIC_SUBMISSION_SETTINGS_REPOSITORY,
    ELECTRONIC_SIGNATURE_SETTINGS_REPOSITORY,
    INVOICE_ELECTRONIC_EVENT_REPOSITORY,
    INVOICE_ELECTRONIC_EVENT_ID_GENERATOR,
    ISSUER_PROFILE_REPOSITORY,
    INVOICE_NUMBERING_SETTINGS_REPOSITORY,
    INVOICE_REPOSITORY,
    INVOICE_ID_GENERATOR,
    INVOICE_ITEM_REPOSITORY,
    INVOICE_ITEM_ID_GENERATOR,
    PAYMENT_REPOSITORY,
    PAYMENT_ID_GENERATOR,
    TAX_RATE_REPOSITORY,
    TAX_RATE_ID_GENERATOR,
  ],
})
export class InvoicingPersistenceModule {}
