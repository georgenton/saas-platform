import { Module } from '@nestjs/common';
import {
  CUSTOMER_ID_GENERATOR,
  CUSTOMER_REPOSITORY,
  INVOICE_ID_GENERATOR,
  INVOICE_ITEM_ID_GENERATOR,
  INVOICE_ITEM_REPOSITORY,
  INVOICE_REPOSITORY,
} from '@saas-platform/invoicing-application';
import { PrismaModule } from '../prisma.module';
import { PrismaCustomerRepository } from './prisma-customer.repository';
import { PrismaInvoiceItemRepository } from './prisma-invoice-item.repository';
import { PrismaInvoiceRepository } from './prisma-invoice.repository';
import { UuidCustomerIdGenerator } from './uuid-customer-id.generator';
import { UuidInvoiceItemIdGenerator } from './uuid-invoice-item-id.generator';
import { UuidInvoiceIdGenerator } from './uuid-invoice-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaCustomerRepository,
    PrismaInvoiceItemRepository,
    PrismaInvoiceRepository,
    UuidCustomerIdGenerator,
    UuidInvoiceItemIdGenerator,
    UuidInvoiceIdGenerator,
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
  ],
  exports: [
    CUSTOMER_REPOSITORY,
    CUSTOMER_ID_GENERATOR,
    INVOICE_REPOSITORY,
    INVOICE_ID_GENERATOR,
    INVOICE_ITEM_REPOSITORY,
    INVOICE_ITEM_ID_GENERATOR,
  ],
})
export class InvoicingPersistenceModule {}
