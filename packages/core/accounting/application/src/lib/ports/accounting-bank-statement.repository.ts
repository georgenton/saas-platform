import {
  TenantAccountingBankStatementBatchView,
  TenantAccountingBankStatementLineView,
} from '@saas-platform/accounting-domain';

export interface AccountingBankStatementRepository {
  saveBatch(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    period: string;
    year: number;
    source: TenantAccountingBankStatementBatchView['source'];
    status: TenantAccountingBankStatementBatchView['status'];
    importedByUserId?: string | null;
    importedByEmail?: string | null;
    importedAt: Date;
    originalFileName?: string | null;
    notes?: string | null;
    blockers: string[];
    lines: Array<{
      id: string;
      accountKey: string;
      accountCode: string;
      accountName: string;
      postedAt: Date;
      description: string;
      direction: TenantAccountingBankStatementLineView['direction'];
      amountInCents: number;
      currency: string;
      reference: string;
      externalLineId?: string | null;
      raw: TenantAccountingBankStatementLineView['raw'];
    }>;
  }): Promise<TenantAccountingBankStatementBatchView>;

  listByPeriod(command: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingBankStatementBatchView[]>;
}

export const ACCOUNTING_BANK_STATEMENT_REPOSITORY = Symbol(
  'ACCOUNTING_BANK_STATEMENT_REPOSITORY',
);
