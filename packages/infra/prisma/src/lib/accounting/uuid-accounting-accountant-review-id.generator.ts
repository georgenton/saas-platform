import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AccountingAccountantReviewIdGenerator } from '@saas-platform/accounting-application';

@Injectable()
export class UuidAccountingAccountantReviewIdGenerator
  implements AccountingAccountantReviewIdGenerator
{
  nextId(): string {
    return `accounting_accountant_review_${randomUUID()}`;
  }
}
