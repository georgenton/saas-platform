import { Module } from '@nestjs/common';
import {
  CUSTOMER_ID_GENERATOR,
  CUSTOMER_REPOSITORY,
  INVOICE_ID_GENERATOR,
  INVOICE_ITEM_ID_GENERATOR,
  INVOICE_ITEM_REPOSITORY,
  PAYMENT_ID_GENERATOR,
  PAYMENT_REPOSITORY,
  INVOICE_REPOSITORY,
  TAX_RATE_ID_GENERATOR,
  TAX_RATE_REPOSITORY,
} from '@saas-platform/invoicing-application';
import { PrismaModule } from '../prisma.module';
import { PrismaCustomerRepository } from './prisma-customer.repository';
import { PrismaInvoiceItemRepository } from './prisma-invoice-item.repository';
import { PrismaPaymentRepository } from './prisma-payment.repository';
import { PrismaInvoiceRepository } from './prisma-invoice.repository';
import { PrismaTaxRateRepository } from './prisma-tax-rate.repository';
import { UuidCustomerIdGenerator } from './uuid-customer-id.generator';
import { UuidInvoiceItemIdGenerator } from './uuid-invoice-item-id.generator';
import { UuidPaymentIdGenerator } from './uuid-payment-id.generator';
import { UuidInvoiceIdGenerator } from './uuid-invoice-id.generator';
import { UuidTaxRateIdGenerator } from './uuid-tax-rate-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaCustomerRepository,
    PrismaInvoiceItemRepository,
    PrismaPaymentRepository,
    PrismaInvoiceRepository,
    PrismaTaxRateRepository,
    UuidCustomerIdGenerator,
    UuidInvoiceItemIdGenerator,
    UuidPaymentIdGenerator,
    UuidInvoiceIdGenerator,
    UuidTaxRateIdGenerator,
    {
      provide: CUSTOMER_REPOSITORY,
      useExisting: PrismaCustomerRepository,
    },
    {
      provide: CUSTOMER_ID_GENERATOR,
      useExisting: UuidCustomerIdGenerator,
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
