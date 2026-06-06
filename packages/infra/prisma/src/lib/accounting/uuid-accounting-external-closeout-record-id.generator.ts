import { randomUUID } from 'node:crypto';
import { AccountingExternalCloseoutRecordIdGenerator } from '@saas-platform/accounting-application';

export class UuidAccountingExternalCloseoutRecordIdGenerator
  implements AccountingExternalCloseoutRecordIdGenerator
{
  nextId(): string {
    return `accounting_external_closeout_${randomUUID()}`;
  }
}
