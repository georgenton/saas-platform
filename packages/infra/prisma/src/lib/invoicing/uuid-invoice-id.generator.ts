import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InvoiceIdGenerator } from '@saas-platform/invoicing-application';

@Injectable()
export class UuidInvoiceIdGenerator implements InvoiceIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
