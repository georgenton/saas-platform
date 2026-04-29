import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PaymentIdGenerator } from '@saas-platform/invoicing-application';

@Injectable()
export class UuidPaymentIdGenerator implements PaymentIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
