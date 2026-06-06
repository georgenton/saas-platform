import { Module } from '@nestjs/common';
import {
  ACCOUNTING_BANK_STATEMENT_BATCH_ID_GENERATOR,
  ACCOUNTING_BANK_STATEMENT_LINE_ID_GENERATOR,
  ACCOUNTING_BANK_STATEMENT_REPOSITORY,
  ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR,
  ACCOUNTING_JOURNAL_ENTRY_REPOSITORY,
  ACCOUNTING_PERIOD_CONTROL_ID_GENERATOR,
  ACCOUNTING_PERIOD_CONTROL_REPOSITORY,
} from '@saas-platform/accounting-application';
import { PrismaModule } from '../prisma.module';
import { PrismaAccountingBankStatementRepository } from './prisma-accounting-bank-statement.repository';
import { PrismaAccountingJournalEntryRepository } from './prisma-accounting-journal-entry.repository';
import { PrismaAccountingPeriodControlRepository } from './prisma-accounting-period-control.repository';
import { UuidAccountingBankStatementBatchIdGenerator } from './uuid-accounting-bank-statement-batch-id.generator';
import { UuidAccountingBankStatementLineIdGenerator } from './uuid-accounting-bank-statement-line-id.generator';
import { UuidAccountingJournalEntryIdGenerator } from './uuid-accounting-journal-entry-id.generator';
import { UuidAccountingPeriodControlIdGenerator } from './uuid-accounting-period-control-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaAccountingJournalEntryRepository,
    PrismaAccountingPeriodControlRepository,
    PrismaAccountingBankStatementRepository,
    UuidAccountingJournalEntryIdGenerator,
    UuidAccountingPeriodControlIdGenerator,
    UuidAccountingBankStatementBatchIdGenerator,
    UuidAccountingBankStatementLineIdGenerator,
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
    {
      provide: ACCOUNTING_BANK_STATEMENT_REPOSITORY,
      useExisting: PrismaAccountingBankStatementRepository,
    },
    {
      provide: ACCOUNTING_BANK_STATEMENT_BATCH_ID_GENERATOR,
      useExisting: UuidAccountingBankStatementBatchIdGenerator,
    },
    {
      provide: ACCOUNTING_BANK_STATEMENT_LINE_ID_GENERATOR,
      useExisting: UuidAccountingBankStatementLineIdGenerator,
    },
  ],
  exports: [
    ACCOUNTING_JOURNAL_ENTRY_REPOSITORY,
    ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR,
    ACCOUNTING_PERIOD_CONTROL_REPOSITORY,
    ACCOUNTING_PERIOD_CONTROL_ID_GENERATOR,
    ACCOUNTING_BANK_STATEMENT_REPOSITORY,
    ACCOUNTING_BANK_STATEMENT_BATCH_ID_GENERATOR,
    ACCOUNTING_BANK_STATEMENT_LINE_ID_GENERATOR,
  ],
})
export class AccountingPersistenceModule {}
