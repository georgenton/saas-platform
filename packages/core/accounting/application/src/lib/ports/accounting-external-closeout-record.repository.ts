import { TenantAccountingExternalCloseoutRecordView } from '@saas-platform/accounting-domain';

export interface AccountingExternalCloseoutRecordRepository {
  save(record: TenantAccountingExternalCloseoutRecordView): Promise<void>;
  listByPeriod(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingExternalCloseoutRecordView[]>;
}

export const ACCOUNTING_EXTERNAL_CLOSEOUT_RECORD_REPOSITORY = Symbol(
  'ACCOUNTING_EXTERNAL_CLOSEOUT_RECORD_REPOSITORY',
);
