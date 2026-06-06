import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AccountingCorrectionIdGenerator } from '@saas-platform/accounting-application';

@Injectable()
export class UuidAccountingCorrectionIdGenerator
  implements AccountingCorrectionIdGenerator
{
  nextId(): string {
    return `accounting_correction_${randomUUID()}`;
  }
}
