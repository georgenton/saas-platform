import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AccountingBankReconciliationControlIdGenerator } from '@saas-platform/accounting-application';

@Injectable()
export class UuidAccountingBankReconciliationControlIdGenerator
  implements AccountingBankReconciliationControlIdGenerator
{
  nextId(): string {
    return `accounting_bank_reconciliation_control_${randomUUID()}`;
  }
}
