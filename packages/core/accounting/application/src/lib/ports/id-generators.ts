export interface AccountingJournalEntryIdGenerator {
  nextId(): string;
}

export interface AccountingPeriodControlIdGenerator {
  nextId(): string;
}

export const ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR = Symbol(
  'ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR',
);

export const ACCOUNTING_PERIOD_CONTROL_ID_GENERATOR = Symbol(
  'ACCOUNTING_PERIOD_CONTROL_ID_GENERATOR',
);
