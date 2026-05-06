import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InvoiceElectronicEventIdGenerator } from '@saas-platform/invoicing-application';

@Injectable()
export class UuidInvoiceElectronicEventIdGenerator
  implements InvoiceElectronicEventIdGenerator
{
  generate(): string {
    return randomUUID();
  }
}
