import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { TaxRateIdGenerator } from '@saas-platform/invoicing-application';

@Injectable()
export class UuidTaxRateIdGenerator implements TaxRateIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
