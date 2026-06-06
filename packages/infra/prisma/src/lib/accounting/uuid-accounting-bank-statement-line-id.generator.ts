import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AccountingBankStatementLineIdGenerator } from '@saas-platform/accounting-application';

@Injectable()
export class UuidAccountingBankStatementLineIdGenerator
  implements AccountingBankStatementLineIdGenerator
{
  nextId(): string {
    return `accounting_bank_statement_line_${randomUUID()}`;
  }
}
