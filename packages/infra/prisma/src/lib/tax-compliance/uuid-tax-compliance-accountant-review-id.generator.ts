import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { TaxComplianceAccountantReviewIdGenerator } from '@saas-platform/tax-compliance-application';

@Injectable()
export class UuidTaxComplianceAccountantReviewIdGenerator
  implements TaxComplianceAccountantReviewIdGenerator
{
  generate(): string {
    return randomUUID();
  }
}
