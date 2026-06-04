import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { TaxComplianceEventIdGenerator } from '@saas-platform/tax-compliance-application';

@Injectable()
export class UuidTaxComplianceEventIdGenerator
  implements TaxComplianceEventIdGenerator
{
  generate(): string {
    return randomUUID();
  }
}
