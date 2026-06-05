import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AccountingJournalEntryIdGenerator } from '@saas-platform/accounting-application';

@Injectable()
export class UuidAccountingJournalEntryIdGenerator
  implements AccountingJournalEntryIdGenerator
{
  nextId(): string {
    return randomUUID();
  }
}
