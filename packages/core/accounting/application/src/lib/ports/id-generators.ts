export interface AccountingJournalEntryIdGenerator {
  nextId(): string;
}

export const ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR = Symbol(
  'ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR',
);
