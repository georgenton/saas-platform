import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InvoiceItemIdGenerator } from '@saas-platform/invoicing-application';

@Injectable()
export class UuidInvoiceItemIdGenerator implements InvoiceItemIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
