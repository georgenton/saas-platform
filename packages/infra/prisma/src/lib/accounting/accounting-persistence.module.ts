import { Module } from '@nestjs/common';
import {
  ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR,
  ACCOUNTING_JOURNAL_ENTRY_REPOSITORY,
  ACCOUNTING_PERIOD_CONTROL_ID_GENERATOR,
  ACCOUNTING_PERIOD_CONTROL_REPOSITORY,
} from '@saas-platform/accounting-application';
import { PrismaModule } from '../prisma.module';
import { PrismaAccountingJournalEntryRepository } from './prisma-accounting-journal-entry.repository';
import { PrismaAccountingPeriodControlRepository } from './prisma-accounting-period-control.repository';
import { UuidAccountingJournalEntryIdGenerator } from './uuid-accounting-journal-entry-id.generator';
import { UuidAccountingPeriodControlIdGenerator } from './uuid-accounting-period-control-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaAccountingJournalEntryRepository,
    PrismaAccountingPeriodControlRepository,
    UuidAccountingJournalEntryIdGenerator,
    UuidAccountingPeriodControlIdGenerator,
    {
      provide: ACCOUNTING_JOURNAL_ENTRY_REPOSITORY,
      useExisting: PrismaAccountingJournalEntryRepository,
    },
    {
      provide: ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR,
      useExisting: UuidAccountingJournalEntryIdGenerator,
    },
    {
      provide: ACCOUNTING_PERIOD_CONTROL_REPOSITORY,
      useExisting: PrismaAccountingPeriodControlRepository,
    },
    {
      provide: ACCOUNTING_PERIOD_CONTROL_ID_GENERATOR,
      useExisting: UuidAccountingPeriodControlIdGenerator,
    },
  ],
  exports: [
    ACCOUNTING_JOURNAL_ENTRY_REPOSITORY,
    ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR,
    ACCOUNTING_PERIOD_CONTROL_REPOSITORY,
    ACCOUNTING_PERIOD_CONTROL_ID_GENERATOR,
  ],
})
export class AccountingPersistenceModule {}
