import { TenantAccountingJournalEntryView } from '@saas-platform/accounting-domain';

export interface AccountingJournalEntryRepository {
  save(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    period: string;
    year: number;
    source: string;
    status: TenantAccountingJournalEntryView['status'];
    label: string;
    currency: string;
    lines: TenantAccountingJournalEntryView['lines'];
    approvalStatus: string;
    approvedByUserId?: string | null;
    approvedByEmail?: string | null;
    approvedAt?: Date | null;
    sourceDraftEntryKey?: string | null;
    sourceApprovalPacketKey?: string | null;
    note?: string | null;
  }): Promise<TenantAccountingJournalEntryView>;

  listByPeriod(command: {
    tenantSlug: string;
    period: string;
    year: number;
    status?: TenantAccountingJournalEntryView['status'];
  }): Promise<TenantAccountingJournalEntryView[]>;
}

export const ACCOUNTING_JOURNAL_ENTRY_REPOSITORY = Symbol(
  'ACCOUNTING_JOURNAL_ENTRY_REPOSITORY',
);
