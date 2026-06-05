import { Module } from '@nestjs/common';
import {
  ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR,
  ACCOUNTING_JOURNAL_ENTRY_REPOSITORY,
} from '@saas-platform/accounting-application';
import { PrismaModule } from '../prisma.module';
import { PrismaAccountingJournalEntryRepository } from './prisma-accounting-journal-entry.repository';
import { UuidAccountingJournalEntryIdGenerator } from './uuid-accounting-journal-entry-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaAccountingJournalEntryRepository,
    UuidAccountingJournalEntryIdGenerator,
    {
      provide: ACCOUNTING_JOURNAL_ENTRY_REPOSITORY,
      useExisting: PrismaAccountingJournalEntryRepository,
    },
    {
      provide: ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR,
      useExisting: UuidAccountingJournalEntryIdGenerator,
    },
  ],
  exports: [
    ACCOUNTING_JOURNAL_ENTRY_REPOSITORY,
    ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR,
  ],
})
export class AccountingPersistenceModule {}
