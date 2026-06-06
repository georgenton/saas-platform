import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AccountingBankStatementBatchIdGenerator } from '@saas-platform/accounting-application';

@Injectable()
export class UuidAccountingBankStatementBatchIdGenerator
  implements AccountingBankStatementBatchIdGenerator
{
  nextId(): string {
    return `accounting_bank_statement_batch_${randomUUID()}`;
  }
}
