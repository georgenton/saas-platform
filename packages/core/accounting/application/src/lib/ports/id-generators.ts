export interface AccountingJournalEntryIdGenerator {
  nextId(): string;
}

export interface AccountingPeriodControlIdGenerator {
  nextId(): string;
}

export interface AccountingBankStatementBatchIdGenerator {
  nextId(): string;
}

export interface AccountingBankStatementLineIdGenerator {
  nextId(): string;
}

export const ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR = Symbol(
  'ACCOUNTING_JOURNAL_ENTRY_ID_GENERATOR',
);

export const ACCOUNTING_PERIOD_CONTROL_ID_GENERATOR = Symbol(
  'ACCOUNTING_PERIOD_CONTROL_ID_GENERATOR',
);

export const ACCOUNTING_BANK_STATEMENT_BATCH_ID_GENERATOR = Symbol(
  'ACCOUNTING_BANK_STATEMENT_BATCH_ID_GENERATOR',
);

export const ACCOUNTING_BANK_STATEMENT_LINE_ID_GENERATOR = Symbol(
  'ACCOUNTING_BANK_STATEMENT_LINE_ID_GENERATOR',
);
