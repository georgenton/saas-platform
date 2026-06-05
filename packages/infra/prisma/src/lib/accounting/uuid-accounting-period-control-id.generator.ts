import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AccountingPeriodControlIdGenerator } from '@saas-platform/accounting-application';

@Injectable()
export class UuidAccountingPeriodControlIdGenerator
  implements AccountingPeriodControlIdGenerator
{
  nextId(): string {
    return randomUUID();
  }
}
