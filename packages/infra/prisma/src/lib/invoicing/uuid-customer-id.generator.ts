import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CustomerIdGenerator } from '@saas-platform/invoicing-application';

@Injectable()
export class UuidCustomerIdGenerator implements CustomerIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
